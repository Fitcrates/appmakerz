import { client } from '../lib/sanity.client';

interface UnsubscribeResponse {
  success: boolean;
  message?: string;
}

const handleResponse = async (response: any): Promise<UnsubscribeResponse> => {
  if (response.error) {
    throw new Error(response.error.message);
  }

  return { success: true };
};

export const unsubscribeWithToken = async (token: string): Promise<UnsubscribeResponse> => {
  try {
    // Find and update the subscriber document
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && unsubscribeToken == $token][0]`,
      { token }
    );

    if (!subscriber) {
      throw new Error('Invalid unsubscribe token');
    }

    // Update the subscriber's status
    const response = await client
      .patch(subscriber._id)
      .set({ isActive: false })
      .commit();

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process unsubscribe request');
  }
};

export const unsubscribeWithEmail = async (email: string): Promise<UnsubscribeResponse> => {
  try {
    // Find the subscriber document by email
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (!subscriber) {
      throw new Error('No subscription found for this email address');
    }

    if (!subscriber.isActive) {
      throw new Error('This email is already unsubscribed');
    }

    // Update the subscriber's status
    const response = await client
      .patch(subscriber._id)
      .set({ isActive: false })
      .commit();

    return handleResponse(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process unsubscribe request');
  }
};
