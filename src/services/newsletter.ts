import { client } from '../lib/sanity.client';

interface UnsubscribeResponse {
  success: boolean;
  message?: string;
}

export const unsubscribeWithToken = async (token: string): Promise<UnsubscribeResponse> => {
  try {
    const response = await fetch('/.netlify/functions/handleUnsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to unsubscribe');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process unsubscribe request');
  }
};

export const unsubscribeWithEmail = async (email: string): Promise<UnsubscribeResponse> => {
  try {
    const response = await fetch('/.netlify/functions/handleUnsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to unsubscribe');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process unsubscribe request');
  }
};
