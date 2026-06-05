import type { Metadata } from 'next';
import NextProviders from '@/components/next/NextProviders';
import CookieConsentNew from '@/components/new/CookieConsentNew';
import ScrollBlurOverlay from '@/components/new/ScrollBlurOverlay';
import CursorAura from '@/components/next/CursorAura';
import HomePageClient from '@/components/next/HomePageClient';
import { getFeaturedProjects, getPosts } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';
import { translations } from '@/translations/translations';
import type { Post, Project } from '@/types/sanity.types';

export const revalidate = 3600;
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const t = translations[DEFAULT_LANGUAGE];
  const title = t.hero.metaTitle;
  const description = t.hero.subtitle;
  const canonical = absoluteUrl('/');

  return {
    title,
    description,
    keywords: ['strony internetowe landing page', 'platformy internetowe', 'aplikacje ai', 'web platforms', 'implementacja ai w firmach', 'rag', 'retrieval-augmented generation', 'sklepy ecommerce medusa js', 'sklepy internetowe medusa js', 'sklepy internetowe', 'marketplace ecommerce medusa js', 'audyty wcag', 'audyty gdpr', 'migracje na next.js', 'migracje na tanstack', 'headless commerce', 'frontend migrations', 'Medusa JS developer', 'AI integration', 'WCAG compliance', 'AppCrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl('/en'),
        pl: canonical,
        'x-default': canonical,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'AppCrates',
      locale: 'pl_PL',
      alternateLocale: ['en_US'],
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

export default async function HomePage() {
  let featuredProjects: Project[] = [];
  let latestPosts: Post[] = [];

  try {
    [featuredProjects, latestPosts] = await Promise.all([
      getFeaturedProjects(),
      getPosts(),
    ]);
  } catch {
    // Fallback to empty arrays; client sections handle missing Sanity content.
  }

  return (
    <NextProviders initialLanguage={DEFAULT_LANGUAGE}>
      <HomePageClient projects={featuredProjects} posts={latestPosts.slice(0, 3)} />
      <CookieConsentNew />
      <ScrollBlurOverlay />
      <CursorAura />
    </NextProviders>
  );
}
