import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BlogIndexClient from '@/components/next/BlogIndexClient';
import { getFeaturedPosts, getPostCategories, getPosts } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';
import { translations } from '@/translations/translations';

interface LocalizedBlogPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 3600;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LocalizedBlogPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const t = translations[language].blog;
  const canonical = absoluteUrl(localizedPath(language, '/blog'));

  return {
    title: t.title,
    description: t.subtitle,
    keywords: language === 'pl'
      ? ['blog', 'web development', 'next.js', 'react', 'ai', 'aplikacje webowe', 'appcrates']
      : ['blog', 'web development', 'next.js', 'react', 'ai', 'web applications', 'appcrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/blog')),
        pl: absoluteUrl(localizedPath('pl', '/blog')),
        'x-default': absoluteUrl(localizedPath('pl', '/blog')),
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: t.title,
      description: t.subtitle,
      siteName: 'AppCrates',
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          width: SOCIAL_IMAGE_WIDTH,
          height: SOCIAL_IMAGE_HEIGHT,
          alt: t.title,
          type: 'image/png',
        },
      ],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.subtitle,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: t.title }],
    },
  };
}

export default async function LocalizedBlogPage({ params }: LocalizedBlogPageProps) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const t = translations[language].blog;
  const [posts, featuredPosts, categories] = await Promise.all([
    getPosts(),
    getFeaturedPosts(),
    getPostCategories(),
  ]);

  return (
    <div className="bg-indigo-950 min-h-screen">
      <NextHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogIndexClient
            posts={posts}
            featuredPosts={featuredPosts}
            categories={categories}
            title={t.title}
            subtitle={t.subtitle}
          />
        </div>
      </main>

      <NextFooter />
    </div>
  );
}
