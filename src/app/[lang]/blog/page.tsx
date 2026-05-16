import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BlogIndexClient from '@/components/next/BlogIndexClient';
import { getPosts } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
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
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
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
  const posts = await getPosts();

  return (
    <div className="bg-indigo-950 min-h-screen">
      <NextHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogIndexClient posts={posts} title={t.title} subtitle={t.subtitle} />

          {posts.length ? (
            <section className="mt-20 border-t border-white/10 pt-12" aria-labelledby="all-blog-posts-heading">
              <h2 id="all-blog-posts-heading" className="text-2xl sm:text-3xl font-light font-oxanium text-white mb-8">
                {language === 'pl' ? 'Wszystkie wpisy' : 'All posts'}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const postTitle = getLocalizedText(post.title, language);
                  const postExcerpt = getLocalizedText(post.excerpt, language);

                  return (
                    <li key={post._id} className="border border-white/10 hover:border-teal-300/30 transition-colors">
                      <a href={localizedPath(language, `/blog/${post.slug.current}`)} className="block h-full p-5">
                        <h3 className="text-lg font-light font-oxanium text-white">{postTitle}</h3>
                        {postExcerpt ? (
                          <p className="mt-3 text-sm leading-relaxed text-white/45 line-clamp-3">{postExcerpt}</p>
                        ) : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      </main>

      <NextFooter />
    </div>
  );
}
