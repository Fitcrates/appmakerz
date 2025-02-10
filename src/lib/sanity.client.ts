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

// Log environment variables to verify they're loaded
console.log('Sanity Config:', {
  projectId: requiredEnvVars.projectId,
  dataset: requiredEnvVars.dataset,
  tokenLength: (getEnvVar('VITE_SANITY_AUTH_TOKEN', 'SANITY_TOKEN'))?.length || 0
});

if (!requiredEnvVars.projectId || !requiredEnvVars.dataset) {
  throw new Error(
    `Missing required environment variables. Make sure either VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET or SANITY_PROJECT_ID and SANITY_DATASET are set in your environment.`
  );
}

// Create two clients - one for reading (with CDN) and one for writing
export const readClient = createClient({
  projectId: requiredEnvVars.projectId,
  dataset: requiredEnvVars.dataset,
  useCdn: true, // Enable CDN for faster reads
  apiVersion: '2024-02-20',
  perspective: 'published',
});

export const writeClient = createClient({
  projectId: requiredEnvVars.projectId,
  dataset: requiredEnvVars.dataset,
  useCdn: false, // Disable CDN for mutations
  apiVersion: '2024-02-20',
  perspective: 'published',
  token: getEnvVar('VITE_SANITY_AUTH_TOKEN', 'SANITY_TOKEN'),
});

const builder = imageUrlBuilder(readClient);

export const urlFor = (source: SanityImageSource) => builder.image(source);

export async function getPosts() {
  return readClient.fetch(`
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

export const getPost = async (slug: string) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
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
  }`;
  
  return readClient.fetch(query, { slug });
};

export async function getProject(slug: string): Promise<any> {
  return readClient.fetch(
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

export const incrementPostView = async (postId: string) => {
  try {
    console.log('Incrementing view count for post:', postId);
    const result = await writeClient
      .patch(postId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit();
    console.log('View count updated:', result);
    return result;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

export const getPopularPosts = async () => {
  return readClient.fetch(`
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
};
