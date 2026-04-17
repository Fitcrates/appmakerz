import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

const staticPages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/blog', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/about-me', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, projects, serviceLandings } = await getSitemapEntries();

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post._updatedAt || post.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/project/${project.slug}`),
      lastModified: project._updatedAt || project.publishedAt || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...serviceLandings.map((service) => ({
      url: absoluteUrl(`/uslugi/${service.slug}`),
      lastModified: service._updatedAt || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
