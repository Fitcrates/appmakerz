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
  try {
    console.log('Function triggered with event:', {
      method: event.httpMethod,
      body: event.body ? JSON.parse(event.body) : null
    });

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
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

      console.log('Sanity client initialized');

      const body = JSON.parse(event.body || '{}');
      console.log('Parsed webhook body:', body);
      
      const isTestMode = body.isTest === true;
      
      // For test mode, we don't require a specific _type
      if (!isTestMode && (!body._type || body._type !== 'post')) {
        console.log('Invalid webhook payload:', body);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid webhook payload' })
        };
      }

      // Get the full post data
      console.log('Fetching post data for ID:', body._id);
      const post = await client.fetch(
        `*[_type == "post" && _id == $id][0]{
          title,
          slug,
          categories,
          "snippet": array::join(string::split(pt::text(body[0...1]), "")[0...200], "") + "..."
        }`,
        { id: body._id }
      );

      console.log('Retrieved post data:', { 
        found: !!post,
        title: post?.title,
        slug: post?.slug?.current,
        categoriesCount: post?.categories?.length
      });

      if (!post) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Post not found' })
        };
      }

      // Get all subscribers
      console.log('Fetching subscribers');
      const subscribers = await client.fetch(
        `*[_type == "subscriber" && !(_id in path("drafts.**"))]{
          email,
          unsubscribeToken
        }`
      );

      console.log(`Found ${subscribers.length} subscribers`);

      // Send emails to all subscribers
      const emailPromises = subscribers.map(subscriber => 
        sendEmail(subscriber, post, isTestMode)
          .catch(error => {
            console.error(`Failed to send email to ${subscriber.email}:`, error);
            return { error, subscriber };
          })
      );

      const results = await Promise.all(emailPromises);
      const failures = results.filter(r => r.error);
      
      if (failures.length > 0) {
        console.error(`Failed to send ${failures.length} emails:`, failures);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Some emails failed to send',
            failureCount: failures.length,
            totalCount: subscribers.length
          })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Emails sent successfully',
          count: subscribers.length
        })
      };

    } catch (error: any) {
      console.error('Error in handler:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: error.message || 'Internal server error',
          stack: error.stack
        })
      };
    }
  } catch (error: any) {
    // Catch any JSON parsing errors or other top-level errors
    console.error('Top-level error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message,
        stack: error.stack
      })
    };
  }
};

export { handler };
