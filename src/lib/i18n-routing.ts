import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isLanguage, type Language } from '@/lib/language';

export function getLanguageFromPathname(pathname: string | null | undefined): Language {
  return getExplicitLanguageFromPathname(pathname) || DEFAULT_LANGUAGE;
}

export function getExplicitLanguageFromPathname(pathname: string | null | undefined): Language | null {
  const segment = pathname?.split('/').filter(Boolean)[0];
  return isLanguage(segment) ? segment : null;
}

export function stripLanguagePrefix(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);

  if (isLanguage(parts[0])) {
    const stripped = `/${parts.slice(1).join('/')}`;
    return stripped === '/' ? '/' : stripped.replace(/\/$/, '') || '/';
  }

  return pathname || '/';
}

export function localizedPath(language: Language, href: string): string {
  if (!href.startsWith('/')) {
    return href;
  }

  const [pathname, hash = ''] = href.split('#');
  const normalizedPath = stripLanguagePrefix(pathname || '/');
  const prefix = `/${language}`;
  const path = normalizedPath === '/' ? prefix : `${prefix}${normalizedPath}`;

  return hash ? `${path}#${hash}` : path;
}

export function getAlternateLanguagePath(pathname: string, nextLanguage: Language): string {
  return localizedPath(nextLanguage, pathname || '/');
}

export function languageAlternates(path: string) {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((language) => [language, localizedPath(language, path)])
  ) as Record<Language, string>;
}
