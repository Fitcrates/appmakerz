import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Create two clients - one for reading (with CDN) and one for writing
export const readClient = createClient({
  projectId: '867nk643',
  dataset: 'production',
  useCdn: true, // Enable CDN for faster reads
  apiVersion: '2024-02-20',
  perspective: 'published',
});

export const writeClient = createClient({
  projectId: '867nk643',
  dataset: 'production',
  useCdn: false, // Disable CDN for mutations
  apiVersion: '2024-02-20',
  perspective: 'published',
  token: import.meta.env.VITE_SANITY_AUTH_TOKEN,
});

const builder = imageUrlBuilder(readClient);

export const urlFor = (source: SanityImageSource) => builder.image(source);

export async function getPosts() {
  return readClient.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      author->{
        name,
        image
      },
      excerpt,
      viewCount
    }
  `);
}

export const getPost = async (slug: string) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    author->{
      name,
      image
    },
    mainImage,
    publishedAt,
    body,
    viewCount
  }`;
  
  return readClient.fetch(query, { slug });
};

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
      title,
      slug,
      mainImage,
      publishedAt,
      viewCount
    }
  `);
};