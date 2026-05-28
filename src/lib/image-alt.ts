export function normalizeAltText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function getImageAlt(source: unknown, fallback: string) {
  if (source && typeof source === 'object') {
    const alt = (source as { alt?: unknown }).alt;
    if (typeof alt === 'string' && alt.trim()) {
      return normalizeAltText(alt);
    }
  }

  return normalizeAltText(fallback);
}
