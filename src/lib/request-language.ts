import { DEFAULT_LANGUAGE, isLanguage, type Language } from './language';

export async function getRequestLanguage(): Promise<Language> {
  return DEFAULT_LANGUAGE;
}

export function getStaticLanguage(value?: string | null): Language {
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}
