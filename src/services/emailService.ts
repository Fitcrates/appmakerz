import type { EmailForm, EmailResponse } from '../types/email.types';

export const sendEmail = async (formData: EmailForm): Promise<EmailResponse> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { status: 200, text: 'OK' };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};
