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
    'VITE_SANITY_PROJECT_ID',
    'VITE_SANITY_DATASET',
    'VITE_SANITY_AUTH_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required Sanity environment variables: ${missingVars.join(', ')}`);
  }
};

// Helper function to get title from multilingual object
const getTitle = (title: any): string => {
  console.log('Getting title from:', JSON.stringify(title, null, 2));
  
  if (!title) {
    console.log('Title is empty, returning default');
    return 'New Blog Post';
  }
  
  if (typeof title === 'string') {
    console.log('Title is a string:', title);
    return title;
  }
  
  // Handle multilingual title
  const extractedTitle = title.en || title.pl || 'New Blog Post';
  console.log('Extracted multilingual title:', extractedTitle);
  return extractedTitle;
};

// Add a simple in-memory lock mechanism
const locks = new Map<string, boolean>();
const LOCK_TIMEOUT = 60000; // 60 seconds

const acquireLock = async (lockId: string): Promise<boolean> => {
  if (locks.get(lockId)) {
    return false;
  }
  locks.set(lockId, true);
  setTimeout(() => locks.delete(lockId), LOCK_TIMEOUT);
  return true;
};

const releaseLock = (lockId: string) => {
  locks.delete(lockId);
};

// Rate limiting mechanism
const rateLimits = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_EMAILS_PER_WINDOW = 5;

const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const lastSent = rateLimits.get(email) || 0;
  
  if (now - lastSent < RATE_LIMIT_WINDOW) {
    return false;
  }
  
  rateLimits.set(email, now);
  return true;
};

// Helper function to send email
const sendEmail = async (subscriber: any, post: any, isTest = false) => {
  console.log('Starting email send process');
  
  // Check rate limit for this subscriber
  if (!isTest && !checkRateLimit(subscriber.email)) {
    console.log(`Rate limit exceeded for ${subscriber.email}`);
    throw new Error('Rate limit exceeded');
  }
  
  try {
    if (!post || !post.slug || !post.title) {
      console.error('Invalid post data:', {
        hasPost: !!post,
        hasSlug: !!post?.slug,
        hasTitle: !!post?.title,
        titleType: typeof post?.title,
        titleValue: post?.title
      });
      throw new Error('Invalid post data received');
    }

    const blogTitle = getTitle(post.title);
    const blogUrl = `${process.env.SITE_URL}/blog/${post.slug}`;
    const unsubscribeUrl = `${process.env.SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;
    const categories = Array.isArray(post.categories) ? post.categories.join(', ') : '';

    const templateParams = {
      categories,
      blog_title: blogTitle,
      blog_url: blogUrl,
      unsubscribe_url: unsubscribeUrl,
      to_email: subscriber.email,
      is_test: isTest ? '[TEST] ' : '',
      author_name: 'AppCrates Team'
    };

    // Initialize EmailJS
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY!,
      privateKey: process.env.EMAILJS_PRIVATE_KEY!,
    });

    // Add delay between emails to prevent overwhelming the service
    if (!isTest) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams
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
  const lockId = event.body ? JSON.parse(event.body)._id : 'default';
  
  // Try to acquire lock
  if (!await acquireLock(lockId)) {
    console.log('Function is already running for this post');
    return {
      statusCode: 429,
      body: JSON.stringify({ message: 'Function is already processing this post' })
    };
  }
  
  try {
    console.log('Function triggered with event:', {
      method: event.httpMethod,
      body: event.body ? JSON.parse(event.body) : null
    });

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    try {
      validateEmailConfig();
      validateSanityConfig();

      const client = sanityClient({
        projectId: process.env.VITE_SANITY_PROJECT_ID,
        dataset: process.env.VITE_SANITY_DATASET,
        token: process.env.VITE_SANITY_AUTH_TOKEN,
        useCdn: false,
        apiVersion: '2023-05-03'
      });

      const body = JSON.parse(event.body || '{}');
      const isTestMode = body.isTest === true;
      
      if (!isTestMode && (!body._type || body._type !== 'post')) {
        console.log('Invalid webhook payload:', body);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid webhook payload' })
        };
      }

      // Double-check if emails have already been sent (with transaction)
      const post = await client.fetch(
        `*[_type == "post" && _id == $id][0]{
          _id,
          title,
          "slug": slug.current,
          categories,
          emailsSent,
          _createdAt,
          _updatedAt,
          publishedAt,
          "revision": _rev
        }`,
        { id: body._id }
      );

      if (!post) {
        throw new Error(`Post not found with ID: ${body._id}`);
      }

      // Log post details for debugging
      console.log('Post details:', {
        id: post._id,
        revision: post.revision,
        publishedAt: post.publishedAt,
        createdAt: post._createdAt,
        updatedAt: post._updatedAt,
        emailsSent: post.emailsSent,
        title: post.title
      });

      // Check if this is a new publication
      const isNewPublication = post.publishedAt && !post.emailsSent;

      if (!isTestMode) {
        if (post.emailsSent) {
          console.log('Emails have already been sent for this post');
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Emails already sent for this post' })
          };
        }

        if (!post.publishedAt) {
          console.log('Post is not published yet');
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Post is not published yet' })
          };
        }

        if (!isNewPublication) {
          console.log('Post is being updated, not sending emails');
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Post is not newly published, skipping emails' })
          };
        }

        // Mark as sent only if we're actually going to send emails
        const tx = client.transaction();
        tx.patch(post._id, { 
          set: { 
            emailsSent: true,
            emailsSentAt: new Date().toISOString()
          } 
        });
        await tx.commit();
      }

      // Get all active subscribers
      const subscribers = await client.fetch(`
        *[_type == "subscriber" && isActive == true]{
          email,
          subscribedCategories,
          unsubscribeToken
        }
      `);

      // Filter subscribers based on post categories
      const relevantSubscribers = subscribers.filter(subscriber => {
        if (!post.categories || post.categories.length === 0) return true;
        if (!subscriber.subscribedCategories || subscriber.subscribedCategories.length === 0) return true;
        return post.categories.some(category => 
          subscriber.subscribedCategories.includes(category)
        );
      });

      if (relevantSubscribers.length === 0) {
        console.log('No matching subscribers found for this post');
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'No matching subscribers to notify' })
        };
      }

      console.log(`Found ${relevantSubscribers.length} matching subscribers`);

      // Process subscribers in smaller batches to prevent overwhelming EmailJS
      const BATCH_SIZE = 3;
      const batches = [];
      for (let i = 0; i < relevantSubscribers.length; i += BATCH_SIZE) {
        batches.push(relevantSubscribers.slice(i, i + BATCH_SIZE));
      }

      const failures = [];
      for (const batch of batches) {
        const emailPromises = batch.map(subscriber => 
          sendEmail(subscriber, post, isTestMode)
            .catch(error => {
              console.error(`Failed to send email to ${subscriber.email}:`, error);
              return { error, subscriber };
            })
        );

        const results = await Promise.all(emailPromises);
        failures.push(...results.filter(r => r.error));

        // Add delay between batches
        if (!isTestMode) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      if (failures.length > 0) {
        console.error(`Failed to send ${failures.length} emails:`, failures);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Some emails failed to send',
            failureCount: failures.length,
            totalCount: relevantSubscribers.length
          })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Emails sent successfully',
          count: relevantSubscribers.length
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
    console.error('Top-level error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message,
        stack: error.stack
      })
    };
  } finally {
    // Always release the lock
    releaseLock(lockId);
  }
};

export { handler };
