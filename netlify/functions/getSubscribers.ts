import { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-02-20',
  useCdn: false,
});

export const handler: Handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const subscribers = await client.fetch(
      `*[_type == "subscriber"] | order(subscribedAt desc) {
        _id,
        email,
        subscribedCategories,
        isActive,
        subscribedAt
      }`
    );

    return {
      statusCode: 200,
      body: JSON.stringify(subscribers),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
