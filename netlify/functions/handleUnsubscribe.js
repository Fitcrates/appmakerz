const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.VITE_SANITY_AUTH_TOKEN,
  useCdn: false,
  apiVersion: '2024-02-20',
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { token, email } = JSON.parse(event.body);
    let query = '';
    let params = {};

    if (token) {
      query = '*[_type == "subscriber" && unsubscribeToken == $token][0]';
      params = { token };
    } else if (email) {
      query = '*[_type == "subscriber" && email == $email][0]';
      params = { email };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Either token or email is required' 
        }),
      };
    }

    const subscriber = await client.fetch(query, params);

    if (!subscriber) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          success: false, 
          message: 'No subscription found' 
        }),
      };
    }

    if (!subscriber.isActive) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: 'Already unsubscribed' 
        }),
      };
    }

    await client
      .patch(subscriber._id)
      .set({ isActive: false })
      .commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to process unsubscribe request' 
      }),
    };
  }
};
