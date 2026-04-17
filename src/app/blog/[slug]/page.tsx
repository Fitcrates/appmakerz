import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BlogPostViewTracker from '@/components/next/BlogPostViewTracker';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import { getPopularPosts, getPost, getPosts, urlFor } from '@/lib/sanity.server';
import { getRequestLanguage } from '@/lib/request-language';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';
import { translations } from '@/translations/translations';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getRequestLanguage();
  const post = await getPost(slug);

  if (!post?._id) {
    return {
      title: translations[language].blog.post.backToBlog,
      alternates: { canonical: absoluteUrl('/blog') },
    };
  }

  const title = getLocalizedText(post.title, language);
  const excerpt = getLocalizedText(post.excerpt, language);
  const metaTitle = getLocalizedText(post.seo?.metaTitle, language, title);
  const metaDescription = getLocalizedText(post.seo?.metaDescription, language, excerpt);
  const canonical = post.seo?.canonicalUrl || absoluteUrl(`/blog/${post.slug.current}`);
  const ogImage = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).fit('crop').auto('format').url()
    : post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).fit('crop').auto('format').url()
      : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: post.seo?.keywords,
    alternates: { canonical },
    robots: post.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'article',
      url: canonical,
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const language = await getRequestLanguage();
  const t = translations[language].blog;
  const [post, posts, popularPosts] = await Promise.all([getPost(slug), getPosts(), getPopularPosts()]);

  if (!post?._id) {
    notFound();
  }

  const title = getLocalizedText(post.title, language);
  const body = getLocalizedArray<any>(post.body, language);
  const heroImageUrl = post.mainImage ? urlFor(post.mainImage).auto('format').fit('max').url() : '';
  const authorImageUrl = post.author?.image ? urlFor(post.author.image).width(80).height(80).url() : '';
  const allPostsSorted = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const currentIndex = allPostsSorted.findIndex((item) => item._id === post._id);
  const previousPost = currentIndex > 0 ? allPostsSorted[currentIndex - 1] : null;
  const nextPost = currentIndex < allPostsSorted.length - 1 ? allPostsSorted[currentIndex + 1] : null;
  const popularLabel = language === 'pl' ? 'Popularne wpisy' : 'Popular Posts';

  return (
    <div className="bg-indigo-950 min-h-screen">
      <NextHeader />
      <BlogPostViewTracker postId={post._id} />

      <main className="pt-16 lg:pt-24 pb-24">
        {heroImageUrl ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
            <div className="relative h-[38vh] sm:h-[44vh] lg:h-[50vh] overflow-hidden">
              <img
                src={heroImageUrl}
                alt={title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-indigo-950/20 pointer-events-none" />
            </div>
          </div>
        ) : null}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/40 font-jakarta mb-8 overflow-hidden">
            <Link href="/" className="hover:text-teal-300 transition-colors">{translations[language].navigation.home}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-teal-300 transition-colors">{translations[language].navigation.blog}</Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[200px]">{title}</span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white font-jakarta leading-tight mb-8">{title}</h1>

          <div className="flex items-center gap-4 mb-12 pb-12 border-b border-white/10">
            {authorImageUrl ? <img src={authorImageUrl} alt={post.author?.name || ''} className="w-14 h-14 rounded-full object-cover" /> : null}
            <div>
              <p className="text-white font-jakarta">{post.author?.name}</p>
              <p className="text-white/40 text-sm font-jakarta">
                {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {post.viewCount ? ` • ${post.viewCount} ${t.views}` : ''}
              </p>
            </div>
          </div>

          <article className="blog-content">
            <PortableText value={body} components={portableTextComponentsServer} />
          </article>

          {post.author ? (
            <div className="mt-16 p-8 border border-white/10">
              <div className="flex items-center gap-6">
                {authorImageUrl ? (
                  <img src={authorImageUrl} alt={post.author.name} className="w-20 h-20 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 text-white/70 flex items-center justify-center font-jakarta text-2xl shrink-0">
                    {(post.author?.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-1">{t.post?.author || 'AUTHOR'}</p>
                  <h3 className="text-xl text-white font-jakarta">{post.author.name}</h3>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-8">
            {previousPost ? (
              <Link href={`/blog/${previousPost.slug.current}`} className="group flex items-center gap-4 flex-1">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-1">{language === 'pl' ? 'Poprzedni' : 'Previous'}</p>
                  <p className="text-white font-jakarta group-hover:text-teal-300 transition-colors truncate">{getLocalizedText(previousPost.title, language)}</p>
                </div>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link href={`/blog/${nextPost.slug.current}`} className="group flex items-center gap-4 flex-1 justify-end text-right">
                <div className="min-w-0">
                  <p className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-1">{language === 'pl' ? 'Następny' : 'Next'}</p>
                  <p className="text-white font-jakarta group-hover:text-teal-300 transition-colors truncate">{getLocalizedText(nextPost.title, language)}</p>
                </div>
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                </div>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="border-t border-white/10 pt-16">
            <h3 className="text-lg font-light text-white font-jakarta mb-6">{popularLabel}</h3>
            <div className="space-y-4">
              {popularPosts.map((popularPost) => {
                const popularTitle = getLocalizedText(popularPost.title, language);
                const imageUrl = popularPost.mainImage ? urlFor(popularPost.mainImage).width(64).height(64).url() : '';
                return (
                  <Link
                    key={popularPost._id}
                    href={`/blog/${popularPost.slug.current}`}
                    className="flex items-center gap-4 group p-3 -mx-3 border border-transparent hover:border-white/10 transition-all duration-300"
                  >
                    {imageUrl ? <img src={imageUrl} alt={popularTitle} className="w-16 h-16 object-cover flex-shrink-0" loading="lazy" /> : null}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-white font-jakarta group-hover:text-teal-300 transition-colors duration-200 line-clamp-2">{popularTitle}</h4>
                      <p className="text-xs text-white/30 font-jakarta mt-1">
                        {popularPost.viewCount || 0} {t.views} • {new Date(popularPost.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <NextFooter />
    </div>
  );
}
