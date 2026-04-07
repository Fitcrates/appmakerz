import { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';

// Create a singleton client instance
let clientInstance: any;

const getClient = () => {
  if (!clientInstance) {
    clientInstance = createClient({
      projectId: process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
      dataset: process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET,
      token: process.env.BACKEND_SANITY_TOKEN || process.env.SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN,
      useCdn: false, // Keep this false for mutations
      apiVersion: '2024-02-20',
    });
  }
  return clientInstance;
};

// Cache for throttling view count updates
const viewCountCache = new Map<string, { count: number, timestamp: number, pendingUpdates: number }>();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  let postId: string;
  try {
    const body = JSON.parse(event.body || '{}');
    postId = body.postId;
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid request body' }) };
  }

  if (!postId) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Post ID is required' }) };
  }

  try {
    const now = Date.now();
    const cacheKey = `post_${postId}`;
    const cachedCount = viewCountCache.get(cacheKey);
    
    if (cachedCount && (now - cachedCount.timestamp < CACHE_EXPIRY)) {
      viewCountCache.set(cacheKey, {
        count: cachedCount.count, // We won't eagerly increment frontend cache here since they expect the exact sanity number, but we increment pending.
        timestamp: cachedCount.timestamp,
        pendingUpdates: (cachedCount.pendingUpdates || 0) + 1
      });
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, viewCount: cachedCount.count, cached: true }) };
    }

    const client = getClient();
    const updatesToApply = cachedCount?.pendingUpdates ? cachedCount.pendingUpdates + 1 : 1;
    
    const result = await client
      .patch(postId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: updatesToApply })
      .commit({ autoGenerateArrayKeys: true });
    
    viewCountCache.set(cacheKey, {
      count: result.viewCount,
      timestamp: now,
      pendingUpdates: 0
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, viewCount: result.viewCount, updatesApplied: updatesToApply }) };
  } catch (error: any) {
    console.error('Error incrementing view count:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Failed to increment view count', error: error.message }) };
  }
};
