// Newsletter email configuration
export const NEWSLETTER_CONFIG = {
  SERVICE_ID: 'service_g1qzw0g',
  TEMPLATE_ID: 'template_2exzlz7',
  PUBLIC_KEY: 'wC9zFTjXx-KJhSLVx'
} as const;

// Types for newsletter email templates
export interface NewsletterEmailParams {
  post_title: string;
  post_url: string;
  categories: string;
  unsubscribe_url: string;
  to_email: string;
  is_test?: string;
  author_name: string;
}
