import type { Metadata } from 'next';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BlogIndexClient from '@/components/next/BlogIndexClient';
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
          <BlogIndexClient posts={posts} title={t.title} subtitle={t.subtitle} />
        </div>
      </main>

      <NextFooter />
    </div>
  );
}
