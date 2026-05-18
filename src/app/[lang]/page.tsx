import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePageClient from '@/components/next/HomePageClient';
import { getFeaturedProjects } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { translations } from '@/translations/translations';
import type { Project } from '@/types/sanity.types';

interface LocalizedHomePageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LocalizedHomePageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const t = translations[language];
  const path = localizedPath(language, '/');
  const canonical = absoluteUrl(path);
  const title = t.hero.seoHeading;
  const description = t.hero.subtitle;

  return {
    title,
    description,
    keywords: language === 'pl'
      ? ['strony internetowe landing page', 'platformy internetowe', 'aplikacje ai', 'web platforms', 'implementacja ai w firmach', 'rag', 'retrieval-augmented generation', 'sklepy ecommerce medusa js', 'sklepy internetowe medusa js', 'sklepy internetowe', 'marketplace ecommerce medusa js', 'audyty wcag', 'audyty gdpr', 'migracje na next.js', 'migracje na tanstack', 'headless commerce', 'frontend migrations', 'Medusa JS developer', 'AI integration', 'WCAG compliance', 'AppCrates']
      : ['landing pages', 'web platforms', 'ai applications', 'ai implementation business', 'rag', 'retrieval-augmented generation', 'ecommerce stores medusa js', 'online stores medusa js', 'online shops', 'marketplace ecommerce medusa js', 'wcag audits', 'gdpr audits', 'next.js migrations', 'tanstack migrations', 'headless commerce', 'frontend migrations', 'Medusa JS developer', 'AI integration', 'WCAG compliance', 'AppCrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/')),
        pl: absoluteUrl(localizedPath('pl', '/')),
        'x-default': absoluteUrl(localizedPath('pl', '/')),
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'AppCrates',
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
      images: [
        {
          url: absoluteUrl('/media/default-og-image.png'),
          width: 1200,
          height: 630,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/media/default-og-image.png')],
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  let featuredProjects: Project[] = [];
  try {
    featuredProjects = await getFeaturedProjects();
  } catch {
    // Fallback to empty array; ProjectsNew will use hardcoded projects.
  }

  return <HomePageClient projects={featuredProjects} />;
}
