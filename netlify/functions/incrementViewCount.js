const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
  apiVersion: '2024-02-20',
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { postId } = JSON.parse(event.body);

    if (!postId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Post ID is required' }),
      };
    }

    const result = await client
      .patch(postId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, viewCount: result.viewCount }),
    };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to increment view count' 
      }),
    };
  }
};
