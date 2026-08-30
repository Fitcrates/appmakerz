import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { SUPPORTED_LANGUAGES } from '@/lib/language';
import { getLatestModifiedDate, getModifiedDate } from '@/lib/content-dates';
import { MARKETPLACE_GUIDE_REVIEWED_AT, MARKETPLACE_GUIDE_SLUGS } from '@/lib/marketplace-guide-manifest';

export const revalidate = 3600;

const staticPages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/blog', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/kalkulator', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/about-me', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly' as const, priority: 0.3 },
];

function localizedEntries(path: string, options: { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; lastModified?: string }) {
  return SUPPORTED_LANGUAGES.map((language) => ({
    url: absoluteUrl(localizedPath(language, path)),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: {
        en: absoluteUrl(localizedPath('en', path)),
        pl: absoluteUrl(localizedPath('pl', path)),
        'x-default': absoluteUrl(localizedPath('pl', path)),
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, projects, serviceLandings, aboutMe } = await getSitemapEntries();

  // Static routes have no document of their own, so they inherit the freshness of
  // whatever content they list. Without this they ship no <lastmod> at all.
  const latestPost = getLatestModifiedDate(posts);
  const latestOverall = getLatestModifiedDate([...posts, ...projects, ...serviceLandings]);
  const staticLastModified: Record<string, string | undefined> = {
    '/': latestOverall,
    '/blog': latestPost,
    '/about-me': getModifiedDate(aboutMe),
  };

  return [
    ...staticPages.flatMap((page) => localizedEntries(page.path, {
      ...page,
      lastModified: staticLastModified[page.path],
    })),
    ...posts.flatMap((post) => localizedEntries(`/blog/${post.slug}`, {
      lastModified: getModifiedDate(post),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...projects.flatMap((project) => localizedEntries(`/project/${project.slug}`, {
      lastModified: getModifiedDate(project),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...serviceLandings.flatMap((service) => localizedEntries(`/uslugi/${service.slug}`, {
      lastModified: getModifiedDate(service),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    ...localizedEntries('/marketplace-guide', {
      lastModified: MARKETPLACE_GUIDE_REVIEWED_AT,
      changeFrequency: 'monthly',
      priority: 0.85,
    }),
    ...MARKETPLACE_GUIDE_SLUGS.flatMap((slug) => localizedEntries(`/marketplace-guide/${slug}`, {
      lastModified: MARKETPLACE_GUIDE_REVIEWED_AT,
      changeFrequency: 'monthly',
      priority: 0.75,
    })),
  ];
}
