import 'server-only';

import { createClient } from '@sanity/client';
import { v4 as uuidv4 } from 'uuid';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  process.env.SANITY_DATASET;
const token =
  process.env.BACKEND_SANITY_TOKEN ||
  process.env.SANITY_TOKEN ||
  process.env.SANITY_AUTH_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error('Missing Sanity write configuration. Set project ID, dataset, and a write token.');
}

const writeClient = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-02-20',
});

export async function subscribeToNewsletter(email: string, categories: string[]) {
  const normalizedEmail = email.trim().toLowerCase();
  const query1 = `*[_type == "subscriber" && email == $email][0]._id`;
  const existingSubscriberId = (await writeClient.fetch(
    query1,
    { email: normalizedEmail } as Record<string, string>
  )) as string | null;

  if (existingSubscriberId) {
    await writeClient
      .patch(existingSubscriberId)
      .set({
        email: normalizedEmail,
        subscribedCategories: categories,
        unsubscribeToken: uuidv4(),
        isActive: true,
        status: 'active',
        subscribedAt: new Date().toISOString(),
      })
      .commit();

    return { success: true, reactivated: true };
  }

  await writeClient.create({
    _type: 'subscriber',
    email: normalizedEmail,
    subscribedCategories: categories,
    unsubscribeToken: uuidv4(),
    isActive: true,
    status: 'active',
    subscribedAt: new Date().toISOString(),
  });

  return { success: true, reactivated: false };
}

export async function unsubscribeFromNewsletter(input: { token?: string; email?: string }) {
  const normalizedEmail = input.email?.trim().toLowerCase();
  const queryToken = `*[_type == "subscriber" && unsubscribeToken == $token][0]._id`;
  const queryEmail = `*[_type == "subscriber" && email == $email][0]._id`;

  const subscriberId = input.token
    ? ((await writeClient.fetch(
        queryToken,
        { token: input.token } as Record<string, string>
      )) as string | null)
    : normalizedEmail
      ? ((await writeClient.fetch(
          queryEmail,
          { email: normalizedEmail } as Record<string, string>
        )) as string | null)
      : null;

  if (!subscriberId) {
    return { success: false, message: 'Subscriber not found' };
  }

  await writeClient
    .patch(subscriberId)
    .set({
      isActive: false,
      status: 'inactive',
      unsubscribedAt: new Date().toISOString(),
    })
    .commit();

  return { success: true, message: 'Successfully unsubscribed' };
}

export async function incrementPostViewCount(postId: string) {
  const result = await writeClient
    .patch(postId)
    .setIfMissing({ viewCount: 0 })
    .inc({ viewCount: 1 })
    .commit({ autoGenerateArrayKeys: true });

  return {
    success: true,
    viewCount: result.viewCount,
  };
}
