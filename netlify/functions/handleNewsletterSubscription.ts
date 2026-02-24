import { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';

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
    const { email, categories } = JSON.parse(event.body || '');

    if (!email || !categories?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Email and at least one category are required' 
        })
      };
    }

    // Create subscriber in Sanity
    await client.create({
      _type: 'subscriber',
      email,
      subscribedCategories: categories,
      unsubscribeToken: uuidv4(),
      isActive: true,
      subscribedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process subscription' 
      })
    };
  }
};
