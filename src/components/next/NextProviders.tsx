'use client';

import type { ReactNode } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import type { Language } from '@/lib/language';

interface NextProvidersProps {
  children: ReactNode;
  initialLanguage: Language;
}

export default function NextProviders({ children, initialLanguage }: NextProvidersProps) {
  return <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>;
}
