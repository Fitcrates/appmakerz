export type Language = 'en' | 'pl';

export const DEFAULT_LANGUAGE: Language = 'pl';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'pl'];

export function isLanguage(value: string | null | undefined): value is Language {
  return value === 'en' || value === 'pl';
}
