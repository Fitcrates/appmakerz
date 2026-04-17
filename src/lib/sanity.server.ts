import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('Missing Sanity environment configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.');
}

const client = createClient({
  projectId,
  dataset,
  token: process.env.BACKEND_SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-02-20',
});

const builder = imageUrlBuilder({
  projectId,
  dataset,
});

export const SANITY_REVALIDATE_SECONDS = 3600;

export const urlFor = (source: SanityImageSource) => builder.image(source);

function asPortableTextBlocks(value: unknown): any[] {
  if (!value) return [];

  const toBlocksFromText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return [];
    return [
      {
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', text: trimmed, marks: [] }],
      },
    ];
  };

  const normalizeBlock = (block: any) => {
    if (!block || typeof block !== 'object') return null;
    if (block._type === 'image') return block;

    const style = typeof block.style === 'string' ? block.style : 'normal';
    const rawChildren = Array.isArray(block.children) ? block.children : [];
    const children = rawChildren
      .map((child: any) => {
        if (!child || typeof child !== 'object' || child._type !== 'span') return null;

        const rawText = child.text;
        const text = typeof rawText === 'string'
          ? rawText
          : rawText == null
            ? ''
            : JSON.stringify(rawText);

        return {
          _type: 'span',
          text,
          marks: Array.isArray(child.marks) ? child.marks : [],
        };
      })
      .filter(Boolean);

    if (!children.length) return null;

    return {
      _type: 'block',
      style,
      markDefs: Array.isArray(block.markDefs) ? block.markDefs : [],
      children,
      ...(block.listItem ? { listItem: block.listItem } : {}),
      ...(typeof block.level === 'number' ? { level: block.level } : {}),
    };
  };

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        return asPortableTextBlocks(JSON.parse(trimmed));
      } catch {
        return toBlocksFromText(trimmed);
      }
    }

    return toBlocksFromText(trimmed);
  }

  if (!Array.isArray(value)) return [];

  return value
    .map((item: any) => {
      if (typeof item === 'string') return normalizeBlock({ _type: 'block', style: 'normal', children: [{ _type: 'span', text: item }] });
      return normalizeBlock(item);
    })
    .filter(Boolean);
}

function normalizeLocalizedPortableField(field: any) {
  if (!field || typeof field !== 'object') return field;
  return {
    ...field,
    en: asPortableTextBlocks(field.en),
    pl: asPortableTextBlocks(field.pl),
  };
}

function normalizeServiceLandingPayload(landing: any) {
  if (!landing || typeof landing !== 'object') return landing;
  return {
    ...landing,
    content: normalizeLocalizedPortableField(landing.content),
  };
}

async function fetchSanity<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return client.fetch(query, params || {}, {
    next: { revalidate: SANITY_REVALIDATE_SECONDS },
  });
}

export async function getPosts() {
  return fetchSanity<any[]>(`
    *[_type == "post" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(publishedAt desc) {
      _id,
      title { en, pl },
      slug,
      mainImage,
      categories[]->{
        title { en, pl }
      },
      publishedAt,
      excerpt { en, pl },
      author->{
        name,
        image
      },
      viewCount,
      tags,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }
  `);
}

export async function getPost(slug: string) {
  return fetchSanity<any>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title { en, pl },
      slug,
      author->{
        name,
        image
      },
      mainImage,
      publishedAt,
      body { en, pl },
      excerpt { en, pl },
      viewCount,
      categories[]->{
        title { en, pl }
      },
      tags,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug }
  );
}

export async function getPopularPosts() {
  return fetchSanity<any[]>(`
    *[_type == "post" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(viewCount desc, publishedAt desc) [0...3] {
      _id,
      title { en, pl },
      slug,
      mainImage,
      publishedAt,
      viewCount,
      categories[]->{
        title { en, pl }
      },
      tags
    }
  `);
}

export async function getProjects() {
  return fetchSanity<any[]>(`
    *[_type == "project" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      mainImage,
      body,
      technologies,
      projectUrl,
      githubUrl,
      blogUrl,
      publishedAt,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }
  `);
}

export async function getProject(slug: string) {
  return fetchSanity<any>(
    `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description,
      mainImage,
      body,
      technologies,
      projectUrl,
      githubUrl,
      blogUrl,
      publishedAt,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug }
  );
}

export async function getServiceLanding(slug: string) {
  const landing = await fetchSanity<any>(
    `*[_type == "serviceLanding" && slug.current == $slug][0]{
      _id,
      title { en, pl },
      slug,
      serviceType,
      city,
      isLocalLanding,
      eyebrow { en, pl },
      intro { en, pl },
      heroImage,
      problems { en, pl },
      deliverables { en, pl },
      processSteps { en, pl },
      faq { en, pl },
      content { en, pl },
      ctaLabel { en, pl },
      ctaSecondaryLabel { en, pl },
      stats { en, pl },
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug }
  );

  return normalizeServiceLandingPayload(landing);
}

export async function getServiceLandings() {
  const landings = await fetchSanity<any[]>(`
    *[_type == "serviceLanding" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
      _id,
      title { en, pl },
      slug,
      intro { en, pl },
      heroImage,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }
  `);

  return landings.map(normalizeServiceLandingPayload);
}

export async function getAboutMe(slug: string = 'about-me') {
  return fetchSanity<any>(
    `*[_type == "aboutMe" && slug.current == $slug][0]{
      _id,
      title { en, pl },
      slug,
      eyebrow { en, pl },
      intro { en, pl },
      heroImage,
      story { en, pl },
      highlights { en, pl },
      ctaProjects { en, pl },
      ctaContact { en, pl },
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug }
  );
}

export async function getSitemapEntries() {
  const [posts, projects, serviceLandings] = await Promise.all([
    fetchSanity<Array<{ slug: string; publishedAt?: string; _updatedAt?: string }>>(`
      *[_type == "post" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `),
    fetchSanity<Array<{ slug: string; publishedAt?: string; _updatedAt?: string }>>(`
      *[_type == "project" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
    `),
    fetchSanity<Array<{ slug: string; _updatedAt?: string }>>(`
      *[_type == "serviceLanding" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        _updatedAt
      }
    `),
  ]);

  return { posts, projects, serviceLandings };
}
