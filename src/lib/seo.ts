import { urlFor } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';

export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;
export const DEFAULT_SOCIAL_IMAGE = absoluteUrl('/media/default-og-image.png');

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function createSneakPeekDescription(...values: string[]) {
  const source = normalizeWhitespace(values.find((value) => normalizeWhitespace(value).length > 0) || '');
  if (!source) return '';

  if (source.length <= 155) {
    return source.endsWith('...') ? source : `${source.replace(/[.,;:!?]+$/, '')}...`;
  }

  const truncated = source.slice(0, 156);
  const lastSpace = truncated.lastIndexOf(' ');
  const preview = normalizeWhitespace(truncated.slice(0, lastSpace > 80 ? lastSpace : 155));

  return `${preview.replace(/[.,;:!?]+$/, '')}...`;
}

export function extractPortableText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (!Array.isArray(value)) {
    return '';
  }

  return value
    .flatMap((block) => {
      if (!block || typeof block !== 'object') return [];
      const children = (block as { children?: unknown }).children;
      if (!Array.isArray(children)) return [];

      return children.map((child) => {
        if (!child || typeof child !== 'object') return '';
        const text = (child as { text?: unknown }).text;
        return typeof text === 'string' ? text : '';
      });
    })
    .join(' ');
}

export function getSanitySocialImageUrl(source: Parameters<typeof urlFor>[0]) {
  return urlFor(source)
    .width(SOCIAL_IMAGE_WIDTH)
    .height(SOCIAL_IMAGE_HEIGHT)
    .fit('crop')
    .auto('format')
    .url();
}
