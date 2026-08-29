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
  useCdn: true,
  apiVersion: '2024-02-20',
});

const builder = imageUrlBuilder({
  projectId,
  dataset,
});

// A route's effective revalidate is the lowest of its segment config and the
// revalidate on every fetch inside it, so leaving this at 3600 silently pinned
// every Sanity-backed page back to a 1 h TTL — and that TTL is what the Netlify
// runtime hands to the durable cache. Freshness comes from the Sanity webhook
// (/api/revalidate) purging these tags on every content change, not from the
// clock, so the timer only needs to be a backstop.
export const SANITY_REVALIDATE_SECONDS = 604800;

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
    if (typeof block._type === 'string' && block._type !== 'block') return block;

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

async function fetchSanity<T>(query: string, params?: Record<string, unknown>, tags?: string[]): Promise<T> {
  return client.fetch(query, params || {}, {
    next: { revalidate: SANITY_REVALIDATE_SECONDS, tags },
  });
}

// Every list view (home, blog index, related posts, AI context) uses this.
// It deliberately omits the Portable Text bodies: nothing in a list renders
// them, only the reading-time estimate needed them, and GROQ counts the words
// server-side instead. The previous version selected `body { en, pl }` for all
// posts in both languages, which produced a 2.29 MB response — over the 2 MB
// Next.js Data Cache limit, so it was re-fetched uncached on every render and
// every revalidation. This variant is ~98 KB and caches normally.
// Use getPost(slug) when you actually need a body.
export async function getPostSummaries() {
  return fetchSanity<any[]>(
    `
    *[_type == "post" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(publishedAt desc) {
      _id,
      _updatedAt,
      title { en, pl },
      slug,
      mainImage,
      categories[]->{
        _id,
        title { en, pl },
        slug,
        color,
        order
      },
      publishedAt,
      excerpt { en, pl },
      featured,
      featuredOrder,
      author->{
        name,
        image
      },
      viewCount,
      tags,
      relatedServices[]->{
        _id,
        title { en, pl },
        slug,
        intro { en, pl },
        serviceType
      },
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      },
      "wordCount": {
        "en": length(string::split(pt::text(body.en), " ")),
        "pl": length(string::split(pt::text(body.pl), " "))
      }
    }
  `,
    {},
    ['posts', 'blog']
  );
}

export async function getPost(slug: string) {
  return fetchSanity<any>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _updatedAt,
      title { en, pl },
      slug,
      author->{
        name,
        image
      },
      mainImage,
      publishedAt,
      updatedAt,
      body { en, pl },
      faq { en, pl },
      excerpt { en, pl },
      featured,
      featuredOrder,
      viewCount,
      categories[]->{
        _id,
        title { en, pl },
        slug,
        color,
        order
      },
      tags,
      relatedServices[]->{
        _id,
        title { en, pl },
        slug,
        intro { en, pl },
        serviceType
      },
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug },
    ['post', slug]
  );
}

export async function getFeaturedPosts() {
  return fetchSanity<any[]>(
    `
    *[_type == "post" && featured == true && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(coalesce(featuredOrder, 9999) asc, publishedAt desc) [0...6] {
      _id,
      title { en, pl },
      slug,
      mainImage,
      publishedAt,
      excerpt { en, pl },
      featured,
      featuredOrder,
      viewCount,
      categories[]->{
        _id,
        title { en, pl },
        slug,
        color,
        order
      },
      tags,
      "wordCount": {
        "en": length(string::split(pt::text(body.en), " ")),
        "pl": length(string::split(pt::text(body.pl), " "))
      }
    }
  `,
    {},
    ['posts', 'featured-posts']
  );
}

export async function getPopularPosts() {
  return fetchSanity<any[]>(
    `
    *[_type == "post" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(viewCount desc, publishedAt desc) [0...3] {
      _id,
      title { en, pl },
      slug,
      mainImage,
      publishedAt,
      body { en, pl },
      viewCount,
      categories[]->{
        _id,
        title { en, pl },
        slug,
        color,
        order
      },
      tags
    }
  `,
    {},
    ['posts']
  );
}

export async function getProjects() {
  return fetchSanity<any[]>(
    `
    *[_type == "project" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(publishedAt desc) {
      _id,
      title,
      homepageTitle,
      slug,
      description,
      homepageDescription,
      category,
      year,
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
  `,
    {},
    ['projects']
  );
}

export async function getFeaturedProjects() {
  return fetchSanity<any[]>(
    `
    *[_type == "project" && featured == true && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(coalesce(homepageOrder, 9999) asc, publishedAt desc) {
      _id,
      title,
      homepageTitle,
      slug,
      description,
      homepageDescription,
      homepageOrder,
      category,
      year,
      mainImage,
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
  `,
    {},
    ['projects', 'featured']
  );
}

export async function getProject(slug: string) {
  return fetchSanity<any>(
    `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description,
      category,
      year,
      mainImage,
      sections,
      facts,
      body,
      technologies,
      projectUrl,
      githubUrl,
      blogUrl,
      publishedAt,
      updatedAt,
      _updatedAt,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug },
    ['project', slug]
  );
}

/**
 * Previous / next project in publication order, used by the footer navigation
 * on the project page. Returns nulls at the ends of the list.
 */
export async function getAdjacentProjects(slug: string) {
  return fetchSanity<{ previous: any; next: any }>(
    `{
      "previous": *[_type == "project" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true) && slug.current != $slug && publishedAt < *[_type == "project" && slug.current == $slug][0].publishedAt]
        | order(publishedAt desc)[0]{ _id, title, slug, category, year, mainImage },
      "next": *[_type == "project" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true) && slug.current != $slug && publishedAt > *[_type == "project" && slug.current == $slug][0].publishedAt]
        | order(publishedAt asc)[0]{ _id, title, slug, category, year, mainImage }
    }`,
    { slug },
    ['projects', 'project', slug]
  );
}

export async function getServiceLanding(slug: string) {
  const landing = await fetchSanity<any>(
    `*[_type == "serviceLanding" && slug.current == $slug][0]{
      _id,
      publishedAt,
      updatedAt,
      _updatedAt,
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
      models { en, pl },
      relatedServices[]->{
        _id,
        title { en, pl },
        slug,
        intro { en, pl },
        serviceType,
        city
      },
      relatedProjects[]->{
        _id,
        title,
        homepageTitle,
        slug,
        description,
        homepageDescription,
        category,
        year,
        mainImage,
        technologies,
        publishedAt
      },
      relatedPosts[]->{
        _id,
        title { en, pl },
        slug,
        mainImage,
        publishedAt,
        excerpt { en, pl },
        categories[]->{
          _id,
          title { en, pl },
          slug,
          color,
          order
        },
        tags
      },
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }`,
    { slug },
    ['service-landing', slug]
  );

  return normalizeServiceLandingPayload(landing);
}

export async function getPostCategories() {
  return fetchSanity<any[]>(
    `
    *[_type == "category" && defined(slug.current)] | order(coalesce(order, 100) asc, title.en asc) {
      _id,
      title { en, pl },
      slug,
      description { en, pl },
      color,
      order
    }
  `,
    {},
    ['post-categories', 'blog']
  );
}

export async function getServiceLandings() {
  const landings = await fetchSanity<any[]>(
    `
    *[_type == "serviceLanding" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
      _id,
      title { en, pl },
      slug,
      intro { en, pl },
      heroImage,
      serviceType,
      city,
      seo {
        metaTitle { en, pl },
        metaDescription { en, pl },
        keywords,
        canonicalUrl,
        ogImage,
        noIndex
      }
    }
  `,
    {},
    ['service-landings']
  );

  return landings.map(normalizeServiceLandingPayload);
}

export async function getAboutMe(slug: string = 'about-me') {
  return fetchSanity<any>(
    `*[_type == "aboutMe" && slug.current == $slug][0]{
      _id,
      publishedAt,
      updatedAt,
      _updatedAt,
      title { en, pl },
      slug,
      eyebrow { en, pl },
      intro { en, pl },
      heroImage,
      hero {
        eyebrow { en, pl },
        title { en, pl },
        accent { en, pl },
        subtitle { en, pl },
        question { en, pl },
        portrait,
        mindLabels { en, pl }
      },
      founderStatement {
        headline { en, pl },
        accent { en, pl },
        paragraphs { en, pl }
      },
      principlesSection {
        eyebrow { en, pl },
        title { en, pl },
        accent { en, pl },
        cards { en, pl }
      },
      processSection {
        eyebrow { en, pl },
        title { en, pl },
        accent { en, pl },
        steps { en, pl }
      },
      beyondCodeSection {
        eyebrow { en, pl },
        title { en, pl },
        accent { en, pl },
        cards { en, pl }
      },
      ctaSection {
        headlineLines { en, pl },
        accent { en, pl },
        highlights { en, pl },
        primaryButton { en, pl },
        secondaryButton { en, pl }
      },
      backgrounds {
        hero,
        process,
        beyondCode
      },
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
    { slug },
    ['about-me']
  );
}

export async function getSitemapEntries() {
  const [posts, projects, serviceLandings, aboutMe] = await Promise.all([
    fetchSanity<Array<{ slug: string; publishedAt?: string; updatedAt?: string; _updatedAt?: string }>>(`
      *[_type == "post" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        updatedAt,
        _updatedAt
      }
    `, {}, ['posts', 'sitemap']),
    fetchSanity<Array<{ slug: string; publishedAt?: string; updatedAt?: string; _updatedAt?: string }>>(`
      *[_type == "project" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        updatedAt,
        _updatedAt
      }
    `, {}, ['projects', 'sitemap']),
    fetchSanity<Array<{ slug: string; publishedAt?: string; updatedAt?: string; _updatedAt?: string }>>(`
      *[_type == "serviceLanding" && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)] | order(_updatedAt desc) {
        "slug": slug.current,
        publishedAt,
        updatedAt,
        _updatedAt
      }
    `, {}, ['service-landings', 'sitemap']),
    fetchSanity<{ publishedAt?: string; updatedAt?: string; _updatedAt?: string } | null>(`
      *[_type == "aboutMe" && slug.current == "about-me"][0] {
        publishedAt,
        updatedAt,
        _updatedAt
      }
    `, {}, ['about-me', 'sitemap']),
  ]);

  return { posts, projects, serviceLandings, aboutMe };
}
