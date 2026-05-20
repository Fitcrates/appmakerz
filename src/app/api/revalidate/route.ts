import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { SUPPORTED_LANGUAGES } from '@/lib/language';
import { localizedPath } from '@/lib/i18n-routing';

const SECRET = process.env.SANITY_WEBHOOK_SECRET;

// We no longer need revalidateLocalizedPath as revalidatePath('/[lang]/...', 'page') handles all languages natively.

function isValidSanitySignature(signatureHeader: string, body: string, secret: string): boolean {
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.trim().startsWith('t='))?.split('=')[1];
  const signature = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1];
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${body}`;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { message: 'Sanity webhook secret not configured' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('sanity-webhook-signature') || '';
  const body = await request.text();

  if (!isValidSanitySignature(signature, body, SECRET)) {
    return NextResponse.json(
      { message: 'Invalid signature' },
      { status: 401 }
    );
  }

  try {
    const json = JSON.parse(body);
    const docType = json._type as string;

    if (docType === 'post') {
      revalidateTag('posts');
      revalidateTag('blog');
      revalidateTag('post'); // Clear individual post fetch cache
      if (json.slug?.current) {
        revalidateTag(json.slug.current);
      }
      
      // Target the exact Next.js App Router static segments
      revalidatePath('/[lang]', 'page'); // Homepage has popular posts
      revalidatePath('/[lang]/blog', 'page');
      revalidatePath('/[lang]/blog/[slug]', 'page');

    } else if (docType === 'project') {
      revalidateTag('projects');
      revalidateTag('project'); // Clear individual project fetch cache
      if (json.slug?.current) {
        revalidateTag(json.slug.current);
      }
      
      revalidatePath('/[lang]', 'page'); // Homepage has featured projects
      revalidatePath('/[lang]/project/[slug]', 'page');

    } else if (docType === 'serviceLanding') {
      revalidateTag('service-landings');
      revalidateTag('service-landing');
      
      revalidatePath('/[lang]/uslugi/[slug]', 'page');

    } else if (docType === 'aboutMe') {
      revalidateTag('about-me');
      revalidatePath('/[lang]/about-me', 'page');
    }

    revalidateTag('sitemap');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      docType,
    });
  } catch {
    return NextResponse.json(
      { message: 'Invalid body' },
      { status: 400 }
    );
  }
}
