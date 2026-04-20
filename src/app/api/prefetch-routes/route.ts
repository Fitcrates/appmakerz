import { NextResponse } from 'next/server';
import { getSitemapEntries, SANITY_REVALIDATE_SECONDS } from '@/lib/sanity.server';

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
        'Cache-Control': `s-maxage=${SANITY_REVALIDATE_SECONDS}, stale-while-revalidate=${SANITY_REVALIDATE_SECONDS}`,
      },
    },
  );
}
