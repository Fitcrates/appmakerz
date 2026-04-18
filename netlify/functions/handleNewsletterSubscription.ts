import type { Handler } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

import { getSanityWriteClient, jsonResponse, normalizeEmail, parseJsonBody } from './_shared';

type SubscriptionPayload = {
  email?: string;
  categories?: unknown;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method not allowed.' });
  }

  try {
    const body = parseJsonBody<SubscriptionPayload>(event.body);
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    const categories = Array.isArray(body.categories)
      ? body.categories.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      : [];

    if (!email || categories.length === 0) {
      return jsonResponse(400, {
        success: false,
        message: 'Email and at least one category are required.',
      });
    }

    const client = getSanityWriteClient();
    const query = `*[_type == "subscriber" && email == $email][0]._id`;
    const existingSubscriberId = (await client.fetch(
      query,
      { email } as Record<string, string>
    )) as string | null;

    if (existingSubscriberId) {
      await client
        .patch(existingSubscriberId)
        .set({
          email,
          subscribedCategories: categories,
          unsubscribeToken: uuidv4(),
          isActive: true,
          status: 'active',
          subscribedAt: new Date().toISOString(),
        })
        .commit();

      return jsonResponse(200, { success: true, reactivated: true });
    }

    await client.create({
      _type: 'subscriber',
      email,
      subscribedCategories: categories,
      unsubscribeToken: uuidv4(),
      isActive: true,
      status: 'active',
      subscribedAt: new Date().toISOString(),
    });

    return jsonResponse(200, { success: true, reactivated: false });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return jsonResponse(500, {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process subscription.',
    });
  }
};
