const { createClient } = require('@sanity/client');

// Create a singleton client instance
let clientInstance;

const getClient = () => {
  if (!clientInstance) {
    clientInstance = createClient({
      projectId: process.env.VITE_SANITY_PROJECT_ID,
      dataset: process.env.VITE_SANITY_DATASET,
      token: process.env.VITE_SANITY_AUTH_TOKEN,
      useCdn: false, // Keep this false for mutations
      apiVersion: '2024-02-20',
    });
  }
  return clientInstance;
};

// Cache for throttling view count updates
const viewCountCache = new Map();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

exports.handler = async (event) => {
  // Add CORS headers for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse request body with error handling
    let postId;
    try {
      const body = JSON.parse(event.body);
      postId = body.postId;
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid request body' 
        }),
      };
    }

    if (!postId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Post ID is required' 
        }),
      };
    }

    // Check if we've recently updated this post's view count
    const now = Date.now();
    const cacheKey = `post_${postId}`;
    const cachedCount = viewCountCache.get(cacheKey);
    
    // Throttle frequent updates for the same post
    if (cachedCount && (now - cachedCount.timestamp < CACHE_EXPIRY)) {
      // Return cached count but increment the pending count for the next update
      viewCountCache.set(cacheKey, {
        count: cachedCount.count + 1,
        timestamp: cachedCount.timestamp,
        pendingUpdates: (cachedCount.pendingUpdates || 0) + 1
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          viewCount: cachedCount.count, 
          cached: true 
        }),
      };
    }

    // Initialize or get the client
    const client = getClient();
    
    // Determine how many views to add
    const updatesToApply = cachedCount?.pendingUpdates ? cachedCount.pendingUpdates + 1 : 1;
    
    // Update view count in Sanity
    const result = await client
      .patch(postId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: updatesToApply })
      .commit({ autoGenerateArrayKeys: true });
    
    // Update cache with new count and reset pending updates
    viewCountCache.set(cacheKey, {
      count: result.viewCount,
      timestamp: now,
      pendingUpdates: 0
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        viewCount: result.viewCount,
        updatesApplied: updatesToApply
      }),
    };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to increment view count',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};