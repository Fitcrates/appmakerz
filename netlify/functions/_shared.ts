import { createClient } from '@sanity/client';

function firstEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

export function getSanityWriteClient() {
  const projectId = firstEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'VITE_SANITY_PROJECT_ID', 'SANITY_PROJECT_ID');
  const dataset = firstEnv('NEXT_PUBLIC_SANITY_DATASET', 'VITE_SANITY_DATASET', 'SANITY_DATASET');
  const token = firstEnv('BACKEND_SANITY_TOKEN', 'SANITY_TOKEN', 'SANITY_AUTH_TOKEN');

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity configuration. Set project ID, dataset, and a write token.');
  }

  return createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-02-20',
  });
}

export function getSiteUrl() {
  const siteUrl = firstEnv('SITE_URL', 'NEXT_PUBLIC_SITE_URL', 'URL', 'DEPLOY_PRIME_URL');
  if (!siteUrl) {
    throw new Error('Missing site URL configuration. Set SITE_URL or rely on Netlify URL env vars.');
  }

  return siteUrl.replace(/\/+$/, '');
}

export function getEmailJsConfig() {
  const serviceId = firstEnv('EMAILJS_SERVICE_ID');
  const templateId = firstEnv('EMAILJS_TEMPLATE_ID');
  const publicKey = firstEnv('EMAILJS_PUBLIC_KEY');
  const privateKey = firstEnv('EMAILJS_PRIVATE_KEY');

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error('Missing EmailJS configuration. Check EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY.');
  }

  return { serviceId, templateId, publicKey, privateKey };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function parseJsonBody<T>(body: string | null | undefined): T {
  if (!body) return {} as T;

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error('Invalid JSON request body.');
  }
}

export function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
    body: JSON.stringify(body),
  };
}
