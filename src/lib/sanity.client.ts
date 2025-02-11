import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Get environment variables with fallbacks to non-VITE prefixed versions
const getEnvVar = (viteKey: string, regularKey: string) => {
  return import.meta.env[viteKey] || import.meta.env[regularKey];
};

// Validate environment variables
const requiredEnvVars = {
  projectId: getEnvVar('VITE_SANITY_PROJECT_ID', 'SANITY_PROJECT_ID'),
  dataset: getEnvVar('VITE_SANITY_DATASET', 'SANITY_DATASET'),
};

if (!requiredEnvVars.projectId || !requiredEnvVars.dataset) {
  throw new Error(
    `Missing required environment variables. Make sure either VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET or SANITY_PROJECT_ID and SANITY_DATASET are set in your environment.`
  );
}

// Create a single read-only client
export const client = createClient({
  projectId: requiredEnvVars.projectId,
  dataset: requiredEnvVars.dataset,
  useCdn: true,
  apiVersion: '2024-02-20',
  perspective: 'published',
});

// Export the client as readClient for backward compatibility
export const readClient = client;

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);

// Fetch posts with basic information
export async function getPosts() {
  return client.fetch(`
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
export const getPost = async (slug: string) =>
  client.fetch(
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

// Fetch a single project by slug
export async function getProject(slug: string): Promise<any> {
  return client.fetch(
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

// Increment post view - now using the Netlify function
export const incrementPostView = async (postId: string) => {
  try {
    // Check if we're in development environment
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // In development, increment view count directly using Sanity client
      const result = await client.patch(postId)
        .setIfMissing({ viewCount: 0 })
        .inc({ viewCount: 1 })
        .commit();
      return result;
    } else {
      // In production, use the Netlify function
      const response = await fetch('/.netlify/functions/incrementViewCount', {
        method: 'POST',
        body: JSON.stringify({ postId }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to increment view count');
      }

      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

// Fetch popular posts
export const getPopularPosts = async () =>
  client.fetch(`
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
