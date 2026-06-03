import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/language';
import { localizedPath } from '@/lib/i18n-routing';
import { absoluteUrl } from '@/lib/site';
import { submitIndexNow } from '@/lib/indexnow';
import { isValidSanitySignature, SANITY_SIGNATURE_HEADER_NAME } from '@/lib/sanityWebhookSignature';

export const runtime = 'nodejs';

function getSlugValue(slug: unknown): string | null {
  if (typeof slug === 'string') return slug;
  if (slug && typeof slug === 'object' && 'current' in slug) {
    const current = (slug as { current?: unknown }).current;
    return typeof current === 'string' ? current : null;
  }

  return null;
}

function revalidateLocalizedPath(path: string) {
  for (const language of SUPPORTED_LANGUAGES) {
    revalidatePath(localizedPath(language, path));
  }
}

function localizedAbsoluteUrls(path: string) {
  return SUPPORTED_LANGUAGES.map((language) => absoluteUrl(localizedPath(language, path)));
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: 'Sanity webhook secret not configured' },
      { status: 500 }
    );
  }

  const signature = request.headers.get(SANITY_SIGNATURE_HEADER_NAME);
  const body = await request.text();

  if (!isValidSanitySignature(body, signature, secret)) {
    return NextResponse.json(
      { message: 'Invalid signature' },
      { status: 401 }
    );
  }

  let json: { _type?: string; slug?: unknown };

  try {
    json = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { message: 'Invalid body' },
      { status: 400 }
    );
  }

  try {
    const docType = json._type;
    const slug = getSlugValue(json.slug);
    const indexNowUrls = new Set<string>();

    if (docType === 'post') {
      revalidateTag('posts');
      revalidateTag('blog');
      revalidateTag('featured-posts');
      revalidateTag('post'); // Clear individual post fetch cache
      if (slug) {
        revalidateTag(slug);
      }
      
      // Revalidate both route patterns and the concrete localized URLs users request.
      revalidatePath('/[lang]', 'page');
      revalidatePath('/[lang]/blog', 'page');
      revalidatePath('/[lang]/blog/[slug]', 'page');
      revalidateLocalizedPath('/');
      revalidateLocalizedPath('/blog');
      localizedAbsoluteUrls('/').forEach((url) => indexNowUrls.add(url));
      localizedAbsoluteUrls('/blog').forEach((url) => indexNowUrls.add(url));
      if (slug) {
        revalidateLocalizedPath(`/blog/${slug}`);
        localizedAbsoluteUrls(`/blog/${slug}`).forEach((url) => indexNowUrls.add(url));
      }

    } else if (docType === 'project') {
      revalidateTag('projects');
      revalidateTag('project'); // Clear individual project fetch cache
      if (slug) {
        revalidateTag(slug);
      }
      
      revalidatePath('/[lang]', 'page'); // Homepage has featured projects
      revalidatePath('/[lang]/project/[slug]', 'page');
      revalidateLocalizedPath('/');
      localizedAbsoluteUrls('/').forEach((url) => indexNowUrls.add(url));
      if (slug) {
        revalidateLocalizedPath(`/project/${slug}`);
        localizedAbsoluteUrls(`/project/${slug}`).forEach((url) => indexNowUrls.add(url));
      }

    } else if (docType === 'serviceLanding') {
      revalidateTag('service-landings');
      revalidateTag('service-landing');
      if (slug) {
        revalidateTag(slug);
      }
      
      revalidatePath('/[lang]/uslugi/[slug]', 'page');
      if (slug) {
        revalidateLocalizedPath(`/uslugi/${slug}`);
        localizedAbsoluteUrls(`/uslugi/${slug}`).forEach((url) => indexNowUrls.add(url));
      }

    } else if (docType === 'aboutMe') {
      revalidateTag('about-me');
      revalidatePath('/[lang]/about-me', 'page');
      revalidateLocalizedPath('/about-me');
      localizedAbsoluteUrls('/about-me').forEach((url) => indexNowUrls.add(url));
    } else if (docType === 'category') {
      revalidateTag('post-categories');
      revalidateTag('posts');
      revalidateTag('blog');
      revalidateTag('featured-posts');
      revalidatePath('/[lang]/blog', 'page');
      revalidateLocalizedPath('/blog');
      localizedAbsoluteUrls('/blog').forEach((url) => indexNowUrls.add(url));
    }

    revalidateTag('sitemap');
    revalidatePath('/sitemap.xml');
    indexNowUrls.add(absoluteUrl('/sitemap.xml'));
    const indexNow = await submitIndexNow(Array.from(indexNowUrls));

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      docType,
      slug,
      indexNow,
    });
  } catch (error) {
    console.error('Sanity revalidation failed:', error);

    return NextResponse.json(
      { message: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
