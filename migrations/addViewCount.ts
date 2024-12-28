import { createClient } from '@sanity/client';
import 'dotenv/config';

// Initialize the client
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  token: process.env.SANITY_AUTH_TOKEN, // Using the existing auth token
  apiVersion: '2023-12-13',
  useCdn: false,
});

async function migrateViewCount() {
  try {
    // Fetch all posts
    const posts = await client.fetch(`*[_type == "post"]`);
    
    console.log(`Found ${posts.length} posts to migrate`);

    // Update each post
    for (const post of posts) {
      console.log(`Migrating post: ${post.title}`);
      
      await client
        .patch(post._id)
        .setIfMissing({ viewCount: 0 })
        .commit()
        .then(() => {
          console.log(`Successfully migrated post: ${post.title}`);
        })
        .catch((err) => {
          console.error(`Failed to migrate post: ${post.title}`, err);
        });
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateViewCount();
