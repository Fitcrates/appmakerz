import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { SUPPORTED_LANGUAGES } from '@/lib/language';

export const revalidate = 3600;

const staticPages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/blog', changeFrequency: 'daily' as const, priority: 0.9 },
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
  const { posts, projects, serviceLandings } = await getSitemapEntries();

  return [
    ...staticPages.flatMap((page) => localizedEntries(page.path, page)),
    ...posts.flatMap((post) => localizedEntries(`/blog/${post.slug}`, {
      lastModified: post._updatedAt || post.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...projects.flatMap((project) => localizedEntries(`/project/${project.slug}`, {
      lastModified: project._updatedAt || project.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...serviceLandings.flatMap((service) => localizedEntries(`/uslugi/${service.slug}`, {
      lastModified: service._updatedAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];
}
