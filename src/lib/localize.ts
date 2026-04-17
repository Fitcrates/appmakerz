import type { Language } from '@/lib/language';

export function getLocalizedText(value: unknown, language: Language, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const record = value as Record<string, string | undefined>;
  return record[language] || record.en || record.pl || fallback;
}

export function getLocalizedArray<T>(value: unknown, language: Language): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const record = value as Record<string, T[] | undefined>;
  return record[language] || record.en || record.pl || [];
}
