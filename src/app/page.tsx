import type { Metadata } from 'next';
import HomePageClient from '@/components/next/HomePageClient';
import { absoluteUrl } from '@/lib/site';
import { getRequestLanguage } from '@/lib/request-language';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const url = absoluteUrl('/');
  const language = await getRequestLanguage();
  
  const isPl = language === 'pl';
  
  const title = isPl 
    ? 'AppCrates | Aplikacje AI, Sklepy Medusa.js, Migracje Next.js & Landing Page' 
    : 'AppCrates | AI Apps, Medusa.js eCommerce, Next.js Migrations & Platforms';
    
  const description = isPl 
    ? 'Tworzymy dedykowane aplikacje AI, wdrażamy RAG w firmach. Budujemy sklepy i marketplace na Medusa.js oraz platformy webowe. Wykonujemy audyty WCAG/GDPR i migracje z legacy na Next.js i TanStack.' 
    : 'Building custom AI applications, integrating RAG for business. Developing headless Medusa.js eCommerce/marketplaces, landing pages, WCAG/GDPR audits, and migrating legacy apps to modern Next.js/TanStack.';
    
  const keywords = [
    'strony internetowe landing page', 'platformy internetowe', 'aplikacje ai', 'web platforms',
    'implementacja ai w firmach', 'rag', 'retrieval-augmented generation', 'sklepy ecommerce medusa js',
    'marketplace ecommerce medusa js', 'audyty wcag', 'audyty gdpr', 'poprawianie dostępności stron', 
    'migracje na next.js', 'migracje na tanstack', 'modernizacja legacy framework', 'headless commerce',
    'frontend migrations', 'Medusa JS developer', 'AI integration', 'WCAG compliance', 'AppCrates'
  ];

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'AppCrates' }],
    alternates: {
      canonical: url,
      languages: {
        'en': `${url}?lang=en`,
        'pl': `${url}?lang=pl`,
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
      locale: isPl ? 'pl_PL' : 'en_US',
      alternateLocale: isPl ? ['en_US'] : ['pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/media/default-og-image.png')],
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
