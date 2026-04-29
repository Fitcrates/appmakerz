import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.SANITY_WEBHOOK_SECRET;

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
      revalidatePath('/blog');
      if (json.slug?.current) {
        revalidatePath(`/blog/${json.slug.current}`);
      }
    } else if (docType === 'project') {
      revalidateTag('projects');
      revalidatePath('/project');
      if (json.slug?.current) {
        revalidatePath(`/project/${json.slug.current}`);
      }
    } else if (docType === 'serviceLanding') {
      revalidateTag('service-landings');
      if (json.slug?.current) {
        revalidatePath(`/uslugi/${json.slug.current}`);
      }
    } else if (docType === 'aboutMe') {
      revalidateTag('about-me');
      revalidatePath('/about-me');
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
