import type { Metadata } from 'next';

import HomePageClient from '@/components/next/HomePageClient';
import { getFeaturedProjects } from '@/lib/sanity.server';
import type { Project } from '@/types/sanity.types';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { translations } from '@/translations/translations';

const url = absoluteUrl(localizedPath('pl', '/'));
const title = translations.pl.hero.seoHeading;
const description = translations.pl.hero.subtitle;

export const revalidate = 3600;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'strony internetowe landing page',
    'platformy internetowe',
    'aplikacje ai',
    'web platforms',
    'implementacja ai w firmach',
    'rag',
    'retrieval-augmented generation',
    'sklepy ecommerce medusa js',
    'sklepy internetowe medusa js',
    'sklepy internetowe',
    'marketplace ecommerce medusa js',
    'audyty wcag',
    'audyty gdpr',
    'migracje na next.js',
    'migracje na tanstack',
    'headless commerce',
    'frontend migrations',
    'Medusa JS developer',
    'AI integration',
    'WCAG compliance',
    'AppCrates',
  ],
  authors: [{ name: 'AppCrates' }],
  alternates: {
    canonical: url,
    languages: {
      en: absoluteUrl(localizedPath('en', '/')),
      pl: absoluteUrl(localizedPath('pl', '/')),
      'x-default': absoluteUrl(localizedPath('pl', '/')),
    },
  },
  openGraph: {
    type: 'website',
    url,
    title,
    description,
    images: [
      {
        url: absoluteUrl('/media/default-og-image.png'),
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
    siteName: 'AppCrates',
    locale: 'en_US',
    alternateLocale: ['pl_PL'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [absoluteUrl('/media/default-og-image.png')],
  },
};

export default async function HomePage() {
  let featuredProjects: Project[] = [];
  try {
    featuredProjects = await getFeaturedProjects();
  } catch {
    // Fallback to empty array; ProjectsNew will use hardcoded projects
  }
  return <HomePageClient projects={featuredProjects} />;
}
