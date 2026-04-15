import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { setCache, getCache } from '../utils/cache';


// Only use public configuration
const config = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
};

if (!config.projectId || !config.dataset) {
  throw new Error(
    'Missing required environment variables. Make sure VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET are set in your environment.'
  );
}



// Create an image builder (this doesn't require authentication)
const builder = imageUrlBuilder({
  projectId: config.projectId,
  dataset: config.dataset,
});

export const urlFor = (source: SanityImageSource) => builder.image(source);

const SERVICE_LANDING_CACHE_VERSION = 'v2';
const SERVICE_LANDING_CACHE_TTL_MS = 2 * 60 * 1000;

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

    const isImage = block._type === 'image';
    if (isImage) return block;

    const style = typeof block.style === 'string' ? block.style : 'normal';
    const rawChildren = Array.isArray(block.children) ? block.children : [];
    const children = rawChildren
      .map((child: any) => {
        if (!child || typeof child !== 'object') return null;
        if (child._type !== 'span') return null;

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

    // Handle accidentally stringified JSON from stale/proxy cache layers.
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

// Helper function to execute Sanity queries through Netlify function
async function executeQuery<T>(query: string, params?: Record<string, any>): Promise<T> {
  const response = await fetch('/.netlify/functions/handleSanityQuery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to execute query');
  }

  return response.json();
}

// Fetch posts with basic information
export async function getPosts() {
  const cacheKey = 'blogPosts';
  const cached = getCache<any[]>(cacheKey);
  if (cached) return cached;
  const posts = await executeQuery(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title {
        en,
        pl
      },
      slug,
      mainImage,
      categories,
      publishedAt,
      excerpt {
        en,
        pl
      },
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
  setCache(cacheKey, posts);
  return posts;
}

// Fetch only the body for a single post
export async function getPostBody(slug: string) {
  const cacheKey = `postBody-${slug}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const postBody = await executeQuery(
    `*[_type == "post" && slug.current == $slug][0]{
      body { en, pl }
    }`,
    { slug }
  );

  setCache(cacheKey, postBody);
  return postBody;
}

// Fetch a single post by slug
export async function getPost(slug: string) {
  const cacheKey = `post-${slug}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const post = await executeQuery(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title {
        en,
        pl
      },
      slug,
      author->{
        name,
        image
      },
      mainImage,
      publishedAt,
      body {
        en,
        pl
      },
      viewCount,
      categories,
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

  setCache(cacheKey, post);
  return post;
}

// Fetch a single project by slug
export async function getProject(slug: string): Promise<any> {
  const cacheKey = `project-${slug}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const project = await executeQuery(
    `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description,
      mainImage {
        asset->
      },
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

  setCache(cacheKey, project);
  return project;
}

export async function getServiceLanding(slug: string): Promise<any> {
  const cacheKey = `service-landing-${SERVICE_LANDING_CACHE_VERSION}-${slug}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return normalizeServiceLandingPayload(cached);

  const landing = await executeQuery(
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

  const normalized = normalizeServiceLandingPayload(landing);
  setCache(cacheKey, normalized, SERVICE_LANDING_CACHE_TTL_MS);
  return normalized;
}

export async function getAboutMe(slug: string = 'about-me'): Promise<any> {
  const cacheKey = `about-me-${slug}`;
  const cached = getCache<any>(cacheKey);
  if (cached) return cached;

  const aboutMe = await executeQuery(
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

  setCache(cacheKey, aboutMe);
  return aboutMe;
}


export async function getCategories() {
  return executeQuery(
    `*[_type == "post"] { ..., categories[]->{ title } } {
     
      name
    }`
  );
}


// Increment post view - using Netlify function
export async function incrementPostView(postId: string) {
  try {
    const response = await fetch('/.netlify/functions/incrementViewCount', {
      method: 'POST',
      body: JSON.stringify({ postId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to increment view count');
    }

    return response.json();
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
}

// Fetch popular posts
export async function getPopularPosts() {
  return executeQuery(`
    *[_type == "post"] | order(viewCount desc) [0...3] {
      _id,
      title {
        en,
        pl
      },
      slug,
      mainImage,
      publishedAt,
      viewCount,
      categories,
      tags
    }
  `);
}
// Fetch proposed posts
export async function getProposedPosts() {
  return executeQuery(`
    *[_type == "post"] | order(viewCount desc) [0...3] {
      _id,
      title {
        en,
        pl
      },
      slug,
      mainImage,
      publishedAt,
      viewCount,
      categories,
      tags
    }
  `);
}
