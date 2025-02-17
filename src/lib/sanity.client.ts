import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

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
  return executeQuery(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title {
        en,
        pl
      },
      slug,
      mainImage,
      publishedAt,
      author->{
        name,
        image
      },
      excerpt {
        en,
        pl
      },
      viewCount,
      categories,
      tags
    }
  `);
}

// Fetch a single post by slug
export async function getPost(slug: string) {
  return executeQuery(
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
      tags
    }`,
    { slug }
  );
}

// Fetch a single project by slug
export async function getProject(slug: string): Promise<any> {
  return executeQuery(
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
      publishedAt
    }`,
    { slug }
  );
}

export async function getCategories() {
  return executeQuery(
    `*[_type == "category"] {
      _id,
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
