import type { Metadata } from 'next';

import HomePageClient from '@/components/next/HomePageClient';
import { absoluteUrl } from '@/lib/site';

const url = absoluteUrl('/');
const title = 'AppCrates | AI Apps, Medusa.js eCommerce, Next.js Migrations & Platforms';
const description =
  'Building custom AI applications, integrating RAG for business. Developing headless Medusa.js eCommerce and marketplaces, landing pages, WCAG and GDPR audits, and migrating legacy apps to modern Next.js and TanStack.';

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
      en: `${url}?lang=en`,
      pl: `${url}?lang=pl`,
      'x-default': url,
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

export default function HomePage() {
  return <HomePageClient />;
}
