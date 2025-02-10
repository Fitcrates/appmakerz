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
  console.log('Sending email with post data:', post);
  console.log('To subscriber:', subscriber);

  // Extract title from the localized object
  const postTitle = post.title?.en || post.title?.pl || 'New Blog Post';
  
  // Get categories from the webhook payload
  const categories = Array.isArray(post.categories) 
    ? post.categories.map((cat: any) => cat.title || cat).join(', ')
    : 'General';

  const templateParams = {
    post_title: postTitle,
    post_url: `${process.env.SITE_URL}/blog/${post.slug.current}`,
    categories: categories,
    unsubscribe_url: `${process.env.SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`,
    to_email: subscriber.email,
    is_test: isTest ? '[TEST] ' : '',
    author_name: 'Arkadiusz Wawrzyniak'
  };

  console.log('Sending with template params:', templateParams);

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
  console.log('Received webhook event:', event.body);

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
    console.log('Parsed webhook body:', body);

    // Handle both test mode and webhook payload
    const isTestMode = body.isTest === true;
    
    if (!isTestMode && (!body._type || body._type !== 'post')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid webhook payload' })
      };
    }

    // For webhook events, use the data directly from the webhook
    // For test mode, fetch the post data
    const post = isTestMode 
      ? await client.fetch(
          `*[_type == "post" && _id == $id][0]{
            _id,
            _type,
            title,
            slug,
            categories[]->
          }`,
          { id: body._id }
        )
      : body; // Use webhook payload directly

    console.log('Post data:', post);

    if (!post || !post.slug?.current) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Invalid post data' })
      };
    }

    // Get subscribers based on mode
    const subscribersQuery = isTestMode
      ? `*[_type == "subscriber" && email == $testEmail]{
          email,
          unsubscribeToken
        }`
      : `*[_type == "subscriber" && isActive == true && count(subscribedCategories[@ in $categories]) > 0]{
          email,
          unsubscribeToken
        }`;

    // Extract category titles for the query
    const categoryTitles = Array.isArray(post.categories)
      ? post.categories.map((cat: any) => cat.title || cat)
      : ['General'];

    const subscribers = await client.fetch(
      subscribersQuery,
      isTestMode ? { testEmail: body.testEmail } : { categories: categoryTitles }
    );

    console.log('Found subscribers:', subscribers);

    if (subscribers.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: isTestMode 
            ? 'No test subscriber found with the provided email' 
            : 'No subscribers found for the post categories',
          categories: categoryTitles
        })
      };
    }

    // Send email to each subscriber
    const emailPromises = subscribers.map(subscriber => 
      sendEmail(subscriber, post, isTestMode)
    );

    const results = await Promise.all(emailPromises);
    console.log('Email sending results:', results);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Notifications sent successfully to ${subscribers.length} subscriber(s)`,
        testMode: isTestMode,
        categories: categoryTitles,
        results: results
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
