import type { Metadata } from 'next';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BlogIndexClient from '@/components/next/BlogIndexClient';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import { getPosts } from '@/lib/sanity.server';
import { getRequestLanguage } from '@/lib/request-language';
import { absoluteUrl } from '@/lib/site';
import { translations } from '@/translations/translations';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const t = translations[language].blog;
  const canonical = absoluteUrl('/blog');

  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: t.title,
      description: t.subtitle,
    },
  };
}

export default async function BlogPage() {
  const language = await getRequestLanguage();
  const t = translations[language].blog;
  const posts = await getPosts();

  return (
    <div className="bg-indigo-950 min-h-screen">
      <NextHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 lg:mb-24">
            <div className="mb-8">
              <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">[ Blog ]</span>
            </div>

            <div className="mb-8">
              <BurnSpotlightText as="h1" className="text-5xl sm:text-6xl lg:text-8xl font-light text-white font-jakarta" glowSize={200} baseDelay={200}>
                {t.title}
              </BurnSpotlightText>
            </div>

            <div className="text-white/40 font-jakarta font-light text-lg max-w-xl">
              <p>{t.subtitle}</p>
            </div>
          </div>

          <BlogIndexClient posts={posts} />
        </div>
      </main>

      <NextFooter />
    </div>
  );
}
