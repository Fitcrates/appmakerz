import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE, isLanguage, type Language } from './language';

export async function getRequestLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get('language')?.value;

  if (isLanguage(cookieLanguage)) {
    return cookieLanguage;
  }

  return DEFAULT_LANGUAGE;
}
