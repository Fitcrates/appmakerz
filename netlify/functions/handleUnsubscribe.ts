import { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';

// Initialize Sanity client with write access
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-02-20',
  useCdn: false,
});

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { token, email } = JSON.parse(event.body || '{}');

    // If token is provided, use it to find and delete subscriber
    if (token) {
      const subscriberId = await client.fetch(
        `*[_type == "subscriber" && unsubscribeToken == $token][0]._id`,
        { token }
      );

      if (!subscriberId) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Subscriber not found' }),
        };
      }

      await client.delete(subscriberId);
    }
    // If email is provided, use it to find and delete subscriber
    else if (email) {
      const subscriberId = await client.fetch(
        `*[_type == "subscriber" && email == $email][0]._id`,
        { email }
      );

      if (!subscriberId) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Subscriber not found' }),
        };
      }

      await client.delete(subscriberId);
    }
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Token or email is required' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully unsubscribed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
