import { NextResponse } from 'next/server';
import { getSitemapEntries } from '@/lib/sanity.server';

// This list only feeds link prefetching, and unlike the page routes it is a
// plain Cache-Control header that revalidateTag() cannot purge. Keep it on its
// own short TTL rather than following SANITY_REVALIDATE_SECONDS.
// Must stay in sync with `revalidate` below, which Next.js requires to be a
// literal it can read statically.
const PREFETCH_CACHE_SECONDS = 3600;

export const revalidate = 3600;

export async function GET() {
  const { posts, projects, serviceLandings } = await getSitemapEntries();

  const routes = Array.from(
    new Set([
      '/',
      '/about-me',
      '/blog',
      '/faq',
      '/privacy-policy',
      '/unsubscribe',
      ...posts.map((post) => `/blog/${post.slug}`),
      ...projects.map((project) => `/project/${project.slug}`),
      ...serviceLandings.map((service) => `/uslugi/${service.slug}`),
    ]),
  );

  return NextResponse.json(
    { routes },
    {
      headers: {
        'Cache-Control': `s-maxage=${PREFETCH_CACHE_SECONDS}, stale-while-revalidate=${PREFETCH_CACHE_SECONDS}`,
      },
    },
  );
}
