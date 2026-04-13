// netlify/functions/sitemap.js
// Dynamic sitemap generation - queries Sanity on each request for fresh content

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '867nk643',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false, // Set to false to ensure we get instantly published documents without CDN delay
  apiVersion: '2024-01-01',
});

const SITE_URL = 'https://appcrates.pl';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/blog', changefreq: 'daily', priority: 0.9 },
  { path: '/faq', changefreq: 'monthly', priority: 0.6 },
  { path: '/about-me', changefreq: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function handler(event) {
  try {
    // Fetch all published posts, projects and service landings from Sanity
    // Ordered by _updatedAt because publishedAt is an optional field the user might forget
    const [posts, projects, serviceLandings] = await Promise.all([
      client.fetch(`*[_type == "post" && defined(slug.current) && !defined(seo.noIndex) || (_type == "post" && defined(slug.current) && seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }`),
      client.fetch(`*[_type == "project" && defined(slug.current) && !defined(seo.noIndex) || (_type == "project" && defined(slug.current) && seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }`),
      client.fetch(`*[_type == "serviceLanding" && defined(slug.current) && !defined(seo.noIndex) || (_type == "serviceLanding" && defined(slug.current) && seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        _updatedAt
      }`),
    ]);

    const today = new Date().toISOString().split('T')[0];

    // Build URL entries
    const urls = [
      // Static pages
      ...STATIC_PAGES.map((page) =>
        buildUrlEntry({
          loc: `${SITE_URL}${page.path}`,
          lastmod: today,
          changefreq: page.changefreq,
          priority: page.priority,
        })
      ),
      // Blog posts
      ...posts.map((post) =>
        buildUrlEntry({
          loc: `${SITE_URL}/blog/${post.slug}`,
          lastmod: (post._updatedAt || post.publishedAt || new Date().toISOString()).split('T')[0],
          changefreq: 'monthly',
          priority: 0.7,
        })
      ),
      // Projects
      ...projects.map((project) =>
        buildUrlEntry({
          loc: `${SITE_URL}/project/${project.slug}`,
          lastmod: (project._updatedAt || project.publishedAt || new Date().toISOString()).split('T')[0],
          changefreq: 'monthly',
          priority: 0.7,
        })
      ),
      // Service landing pages
      ...serviceLandings.map((service) =>
        buildUrlEntry({
          loc: `${SITE_URL}/uslugi/${service.slug}`,
          lastmod: (service._updatedAt || new Date().toISOString()).split('T')[0],
          changefreq: 'monthly',
          priority: 0.8,
        })
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=60', // Cache for only 60 seconds (down from 1 hour)
        'X-Robots-Tag': 'noindex', // Sitemap itself shouldn't be indexed
      },
      body: xml,
    };
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Error generating sitemap',
    };
  }
}
