import emailjs from '@emailjs/browser';
import { NEWSLETTER_CONFIG, NewsletterEmailParams } from '../config/newsletter.config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  token: import.meta.env.VITE_SANITY_AUTH_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

export const sendTestNewsletter = async (postId: string, testEmail: string) => {
  try {
    // Get the post data with proper query and handle missing references
    const post = await client.fetch(
      `*[_type == "post" && _id == $id][0]{
        title {
          en,
          pl
        },
        slug,
        mainImage,
        "categories": coalesce(categories[]->title, ["General"])
      }`,
      { id: postId }
    );

    if (!post) {
      throw new Error('Post not found. Make sure you entered the correct post ID.');
    }

    if (!post.title?.en && !post.title?.pl) {
      throw new Error('Post title is missing. Make sure the post has a title in English or Polish.');
    }

    if (!post.slug?.current) {
      throw new Error('Post slug is missing. Make sure the post has a valid URL slug.');
    }

    // Get the subscriber data (for unsubscribe token)
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]{
        email,
        unsubscribeToken
      }`,
      { email: testEmail }
    );

    if (!subscriber) {
      throw new Error('Subscriber not found. Make sure you are subscribed to the newsletter.');
    }

    if (!subscriber.unsubscribeToken) {
      throw new Error('Subscriber is missing unsubscribe token. Please check the subscriber configuration.');
    }

    // Format categories safely
    const categories = Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories.join(', ')
      : 'General';

    // Get the post title (prefer English, fallback to Polish)
    const postTitle = post.title.en || post.title.pl || 'Untitled Post';

    // Prepare email parameters
    const templateParams: NewsletterEmailParams = {
      post_title: postTitle,
      post_url: `${window.location.origin}/blog/${post.slug.current}`,
      categories: categories,
      unsubscribe_url: `${window.location.origin}/unsubscribe?token=${subscriber.unsubscribeToken}`,
      to_email: subscriber.email,
      is_test: '[TEST] ',
      author_name: 'Arkadiusz Wawrzyniak'
    };

    console.log('Sending email with parameters:', templateParams);

    // Send test email
    const result = await emailjs.send(
      NEWSLETTER_CONFIG.SERVICE_ID,
      NEWSLETTER_CONFIG.TEMPLATE_ID,
      templateParams,
      NEWSLETTER_CONFIG.PUBLIC_KEY
    );

    console.log('Test email sent successfully:', result);
    return { success: true, result };
  } catch (error: any) {
    console.error('Failed to send test email:', error);
    // Return a more user-friendly error message
    return { 
      success: false, 
      error: {
        message: error.message || 'An error occurred while sending the test email',
        details: error.stack
      }
    };
  }
};

// Example usage:
/*
import { sendTestNewsletter } from './utils/testNewsletter';

// In your component or test file:
const testNewNewsletter = async () => {
  const result = await sendTestNewsletter(
    'your-post-id', 
    'your-email@example.com'
  );
  console.log(result);
};
*/
