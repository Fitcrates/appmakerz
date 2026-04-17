const FALLBACK_SITE_URL = 'https://appcrates.pl';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '');

export function absoluteUrl(path: string = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}
