const { createClient } = require('@sanity/client');
const crypto = require('crypto');

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
    const { email, categories } = JSON.parse(event.body);

    // Check if email already exists and is active
    const existingSubscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]{
        _id,
        isActive,
        subscribedCategories
      }`,
      { email }
    );

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: 'This email is already subscribed to the newsletter.'
          })
        };
      } else {
        // Reactivate the subscription with existing or new categories
        const updatedCategories = categories || existingSubscriber.subscribedCategories || [];
        await client
          .patch(existingSubscriber._id)
          .set({
            isActive: true,
            subscribedCategories: updatedCategories,
            subscribedAt: new Date().toISOString()
          })
          .commit();

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Your subscription has been reactivated.',
            subscriberId: existingSubscriber._id
          })
        };
      }
    }

    // Validate categories
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Please select at least one category'
        })
      };
    }

    // Create new subscriber
    const result = await client.create({
      _type: 'subscriber',
      email,
      subscribedCategories: categories,
      unsubscribeToken: crypto.randomUUID(),
      isActive: true,
      subscribedAt: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed to the newsletter.',
        subscriberId: result._id 
      }),
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to process subscription request'
      }),
    };
  }
};
