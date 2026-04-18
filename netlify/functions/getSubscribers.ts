import type { Handler } from '@netlify/functions';

import { getSanityWriteClient, jsonResponse } from './_shared';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { message: 'Method not allowed.' });
  }

  try {
    const client = getSanityWriteClient();
    const subscribers = await client.fetch(
      `*[_type == "subscriber"] | order(subscribedAt desc) {
        _id,
        email,
        subscribedCategories,
        isActive,
        subscribedAt,
        unsubscribedAt
      }`
    );

    return jsonResponse(200, subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    return jsonResponse(500, {
      message: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
};
