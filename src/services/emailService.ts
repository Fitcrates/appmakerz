import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/email.config';
import type { EmailForm, EmailResponse } from '../types/email.types';

export const sendEmail = async (formData: EmailForm): Promise<EmailResponse> => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'AppCrates', // Add recipient name for template
      reply_to: formData.email // Enable reply-to functionality
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAIL_CONFIG.PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};