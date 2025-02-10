import { Handler } from '@netlify/functions';
import sanityClient from '@sanity/client';
import * as emailjs from '@emailjs/nodejs';

// Helper function to validate email configuration
const validateEmailConfig = () => {
  console.log('Starting email config validation');
  
  const requiredEnvVars = [
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_ID',
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_PRIVATE_KEY',
    'SITE_URL'
  ];

  // Log all env vars (without their values)
  console.log('Available environment variables:', {
    ...Object.keys(process.env).reduce((acc, key) => ({
      ...acc,
      [key]: key.includes('KEY') || key.includes('TOKEN') ? '[HIDDEN]' : !!process.env[key]
    }), {})
  });

  // Check each required var individually
  requiredEnvVars.forEach(varName => {
    console.log(`Checking ${varName}:`, !!process.env[varName]);
  });

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  console.log('Email config validation successful');
};

// Helper function to validate sanity configuration
const validateSanityConfig = () => {
  const requiredEnvVars = [
    'SANITY_PROJECT_ID',
    'SANITY_DATASET',
    'SANITY_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required Sanity environment variables: ${missingVars.join(', ')}`);
  }
};

// Helper function to send email
const sendEmail = async (subscriber: any, post: any, isTest = false) => {
  console.log('Starting email send process');
  
  try {
    console.log('Preparing email template params');
    const templateParams = {
      categories: post.categories?.join(', ') || '',
      blog_title: post.title,
      snippet: post.snippet,
      blog_url: `${process.env.SITE_URL}/blog/${post.slug.current}`,
      unsubscribe_url: `${process.env.SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`,
      to_email: subscriber.email,
      is_test: isTest ? '[TEST] ' : ''
    };

    console.log('Email template params prepared:', {
      ...templateParams,
      blog_url: templateParams.blog_url,
      unsubscribe_url: '[HIDDEN]',
      to_email: '[HIDDEN]'
    });

    // Initialize EmailJS with both public and private keys
    console.log('Initializing EmailJS');
    
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    console.log('Email sent successfully:', {
      status: result.status,
      text: result.text,
      subscriber: subscriber.email
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

const handler: Handler = async (event) => {
  console.log('Function triggered with event:', {
    method: event.httpMethod,
    body: event.body ? JSON.parse(event.body) : null
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    // Log environment variables (without sensitive values)
    console.log('Environment variables check:', {
      SANITY_PROJECT_ID: !!process.env.SANITY_PROJECT_ID,
      SANITY_DATASET: !!process.env.SANITY_DATASET,
      SANITY_TOKEN: !!process.env.SANITY_TOKEN,
      EMAILJS_SERVICE_ID: !!process.env.EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID: !!process.env.EMAILJS_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY: !!process.env.EMAILJS_PUBLIC_KEY,
      EMAILJS_PRIVATE_KEY: !!process.env.EMAILJS_PRIVATE_KEY,
      SITE_URL: process.env.SITE_URL
    });

    // Validate configurations first
    validateEmailConfig();
    validateSanityConfig();

    // Initialize Sanity client inside the handler
    const client = sanityClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      token: process.env.SANITY_TOKEN,
      useCdn: false,
      apiVersion: '2023-05-03'
    });

    console.log('Sanity client initialized with projectId:', process.env.SANITY_PROJECT_ID);

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

    console.log('Retrieved post:', { id: body._id, found: !!post, post });

    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Post not found' })
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
