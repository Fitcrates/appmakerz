import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePageClient from '@/components/next/HomePageClient';
import { getFeaturedProjects, getPostSummaries } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';
import { translations } from '@/translations/translations';
import type { Post, Project } from '@/types/sanity.types';

interface LocalizedHomePageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 604800;
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
  const title = t.hero.metaTitle;
  // Not the hero subtitle: that is on-page copy, and the meta description is
  // where search results read which stack the work is built on.
  const description = t.hero.metaDescription;

  return {
    title,
    description,
    keywords: language === 'pl'
      ? ['medusa.js developer', 'wdrożenia medusa js', 'sklepy internetowe medusa js', 'marketplace medusa js', 'marketplace multi-vendor', 'sklepy ecommerce medusa js', 'headless commerce', 'strony internetowe landing page', 'platformy internetowe', 'aplikacje ai', 'implementacja ai w firmach', 'rag', 'sklepy internetowe', 'audyty wcag', 'audyty gdpr', 'migracje na next.js', 'migracje na tanstack', 'frontend migrations', 'AI integration', 'WCAG compliance', 'AppCrates']
      : ['medusa.js developer', 'medusa js development', 'online stores medusa js', 'marketplace medusa js', 'multi-vendor marketplace', 'ecommerce stores medusa js', 'headless commerce', 'landing pages', 'web platforms', 'ai applications', 'ai implementation business', 'rag', 'online shops', 'wcag audits', 'gdpr audits', 'next.js migrations', 'tanstack migrations', 'frontend migrations', 'AI integration', 'WCAG compliance', 'AppCrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/')),
        pl: absoluteUrl(localizedPath('pl', '/')),
        'x-default': absoluteUrl(localizedPath('en', '/')),
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
          url: DEFAULT_SOCIAL_IMAGE,
          width: SOCIAL_IMAGE_WIDTH,
          height: SOCIAL_IMAGE_HEIGHT,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: title }],
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  let featuredProjects: Project[] = [];
  let latestPosts: Post[] = [];
  try {
    [featuredProjects, latestPosts] = await Promise.all([
      getFeaturedProjects(),
      getPostSummaries(),
    ]);
  } catch {
    // Fallback to empty arrays; client sections handle missing Sanity content.
  }

  return <HomePageClient projects={featuredProjects} posts={latestPosts.slice(0, 3)} />;
}
