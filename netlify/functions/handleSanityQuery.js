const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: true,
  apiVersion: '2024-02-20',
});

const HOT_CACHE_TTL_MS = 60 * 1000;
const RESPONSE_CACHE_CONTROL = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300';
const hotQueryCache = new Map();

function getCacheKey(query, params) {
  return JSON.stringify({ query, params: params || {} });
}

function getHotCacheValue(cacheKey) {
  const cached = hotQueryCache.get(cacheKey);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > HOT_CACHE_TTL_MS) {
    hotQueryCache.delete(cacheKey);
    return null;
  }

  return cached.value;
}

function setHotCacheValue(cacheKey, value) {
  hotQueryCache.set(cacheKey, {
    timestamp: Date.now(),
    value,
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { query, params } = JSON.parse(event.body);
    const cacheKey = getCacheKey(query, params);
    const hotCachedResult = getHotCacheValue(cacheKey);

    if (hotCachedResult) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': RESPONSE_CACHE_CONTROL,
          'X-Cache': 'HIT',
        },
        body: JSON.stringify(hotCachedResult),
      };
    }

    const result = await client.fetch(query, params || {});
    setHotCacheValue(cacheKey, result);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': RESPONSE_CACHE_CONTROL,
        'X-Cache': 'MISS',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Query error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to execute query' 
      }),
    };
  }
};
