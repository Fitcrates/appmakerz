import type { Handler } from '@netlify/functions';

import { getSanityWriteClient, jsonResponse, normalizeEmail, parseJsonBody } from './_shared';

type UnsubscribePayload = {
  token?: string;
  email?: string;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method not allowed.' });
  }

  try {
    const body = parseJsonBody<UnsubscribePayload>(event.body);
    const token = typeof body.token === 'string' && body.token.trim().length > 0 ? body.token.trim() : undefined;
    const email = typeof body.email === 'string' && body.email.trim().length > 0 ? normalizeEmail(body.email) : undefined;

    if (!token && !email) {
      return jsonResponse(400, { message: 'Token or email is required.' });
    }

    const client = getSanityWriteClient();
    const subscriberId = token
      ? ((await client.fetch(
          `*[_type == "subscriber" && unsubscribeToken == $token][0]._id`,
          { token } as Record<string, string>
        )) as string | null)
      : ((await client.fetch(
          `*[_type == "subscriber" && email == $email][0]._id`,
          { email: email as string } as Record<string, string>
        )) as string | null);

    if (!subscriberId) {
      return jsonResponse(404, { message: 'Subscriber not found.' });
    }

    await client
      .patch(subscriberId)
      .set({
        isActive: false,
        status: 'inactive',
        unsubscribedAt: new Date().toISOString(),
      })
      .commit();

    return jsonResponse(200, { message: 'Successfully unsubscribed.' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return jsonResponse(500, {
      message: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
};
