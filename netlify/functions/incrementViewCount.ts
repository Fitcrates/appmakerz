import { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-02-20'
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { postId } = JSON.parse(event.body || '');

    if (!postId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Post ID is required' })
      };
    }

    const updatedPost = await client
      .patch(postId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        viewCount: updatedPost.viewCount 
      })
    };
  } catch (error) {
    console.error('View count increment error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to increment view count' 
      })
    };
  }
};
