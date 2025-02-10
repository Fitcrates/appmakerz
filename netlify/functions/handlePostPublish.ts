import { Handler } from '@netlify/functions';
import sanityClient from '@sanity/client';
import emailjs from '@emailjs/browser';

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Helper function to validate email configuration
const validateEmailConfig = () => {
  const requiredEnvVars = [
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_ID',
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_PRIVATE_KEY',
    'SITE_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Helper function to send email
const sendEmail = async (subscriber: any, post: any, isTest = false) => {
  const templateParams = {
    categories: post.categories.join(', '),
    blog_title: post.title,
    snippet: post.snippet,
    blog_url: `${process.env.SITE_URL}/blog/${post.slug.current}`,
    unsubscribe_url: `${process.env.SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`,
    to_email: subscriber.email,
    is_test: isTest ? '[TEST] ' : '' // Prefix test emails
  };

  try {
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );
    console.log(`Email sent to ${subscriber.email}:`, result);
    return result;
  } catch (error) {
    console.error(`Failed to send email to ${subscriber.email}:`, error);
    throw error;
  }
};

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    // Validate email configuration first
    validateEmailConfig();

    const body = JSON.parse(event.body || '{}');
    const isTestMode = body.isTest === true;
    
    // For test mode, we don't require a specific _type
    if (!isTestMode && (!body._type || body._type !== 'post')) {
      return {
        statusCode: 400,
        body: 'Invalid webhook payload'
      };
    }

    // Get the full post data
    const post = await client.fetch(
      `*[_type == "post" && _id == $id][0]{
        title,
        slug,
        categories,
        "snippet": array::join(string::split(pt::text(body[0...1]), "")[0...200], "") + "..."
      }`,
      { id: body._id }
    );

    if (!post) {
      return {
        statusCode: 404,
        body: 'Post not found'
      };
    }

    // Get subscribers based on mode
    const subscribersQuery = isTestMode
      ? // In test mode, get only the subscriber who triggered the test
        `*[_type == "subscriber" && email == $testEmail]{
          email,
          unsubscribeToken
        }`
      : // In normal mode, get all active subscribers for the post categories
        `*[_type == "subscriber" && isActive == true && count(subscribedCategories[@ in $categories]) > 0]{
          email,
          unsubscribeToken
        }`;

    const subscribers = await client.fetch(
      subscribersQuery,
      isTestMode ? { testEmail: body.testEmail } : { categories: post.categories }
    );

    if (subscribers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: isTestMode 
            ? 'No test subscriber found with the provided email' 
            : 'No subscribers found for the post categories' 
        })
      };
    }

    // Send email to each subscriber
    const emailPromises = subscribers.map(subscriber => 
      sendEmail(subscriber, post, isTestMode)
    );

    await Promise.all(emailPromises);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Notifications sent successfully to ${subscribers.length} subscriber(s)`,
        testMode: isTestMode
      })
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

export { handler };
