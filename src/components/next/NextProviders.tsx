'use client';

import type { ReactNode } from 'react';
import GlobalRoutePrefetch from '@/components/next/GlobalRoutePrefetch';
import RouteTransitionProvider from '@/components/next/RouteTransitionProvider';
import AnalyticsPageTracker from '@/components/next/AnalyticsPageTracker';
import { LanguageProvider } from '@/context/LanguageContext';
import type { Language } from '@/lib/language';

interface NextProvidersProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export default function NextProviders({ children, initialLanguage }: NextProvidersProps) {
  return (
    <RouteTransitionProvider>
      <LanguageProvider initialLanguage={initialLanguage}>
        <GlobalRoutePrefetch />
        <AnalyticsPageTracker />
        {children}
      </LanguageProvider>
    </RouteTransitionProvider>
  );
}
