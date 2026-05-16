'use client';

import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BlogPostViewTracker from '@/components/next/BlogPostViewTracker';
import FaqAccordionList from '@/components/next/FaqAccordionList';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { portableTextComponentsClient } from '@/components/next/PortableTextComponentsClient';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { urlFor } from '@/lib/sanity.image';
import { translations } from '@/translations/translations';

interface BlogPostLocalizedContentProps {
  post: any;
  posts: any[];
  popularPosts: any[];
}

export default function BlogPostLocalizedContent({ post, posts, popularPosts }: BlogPostLocalizedContentProps) {
  const { language } = useLanguage();
  const t = translations[language].blog;

  const title = getLocalizedText(post.title, language);
  const body = getLocalizedArray<any>(post.body, language);
  const faq = getLocalizedArray<{ question: string; answer: string }>(post.faq, language);
  const heroImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).auto('format').fit('crop').url() : '';
  const authorImageUrl = post.author?.image ? urlFor(post.author.image).width(80).height(80).auto('format').url() : '';
  const allPostsSorted = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const currentIndex = allPostsSorted.findIndex((item) => item._id === post._id);
  const previousPost = currentIndex > 0 ? allPostsSorted[currentIndex - 1] : null;
  const nextPost = currentIndex < allPostsSorted.length - 1 ? allPostsSorted[currentIndex + 1] : null;
  const popularLabel = language === 'pl' ? 'Popularne wpisy' : 'Popular Posts';

  return (
    <>
      <BlogPostViewTracker postId={post._id} />

      <main className="pt-16 lg:pt-24 pb-24">
        {heroImageUrl ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
            <div className="relative h-[38vh] sm:h-[44vh] lg:h-[50vh] overflow-hidden">
              <Image
                src={heroImageUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-indigo-950/20 pointer-events-none" />
            </div>
          </div>
        ) : null}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/40  mb-8 overflow-hidden">
            <PrefetchLink href={localizedPath(language, '/')} className="hover:text-teal-300 transition-colors">{translations[language].navigation.home}</PrefetchLink>
            <span>/</span>
            <PrefetchLink href={localizedPath(language, '/blog')} className="hover:text-teal-300 transition-colors">{translations[language].navigation.blog}</PrefetchLink>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[200px]">{title}</span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white  leading-tight mb-8">
            <BurnSpotlightText as="span" className="font-inherit text-inherit" glowSize={150}>
              {title}
            </BurnSpotlightText>
          </h1>

          <div className="flex items-center gap-4 mb-12 pb-12 border-b border-white/10">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt={post.author?.name || ''}
                width={80}
                height={80}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="text-white ">{post.author?.name}</p>
              <p className="text-white/40 text-sm ">
                {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {post.viewCount ? ` - ${post.viewCount} ${t.views}` : ''}
              </p>
            </div>
          </div>

          <article className="blog-content">
            <PortableText value={body} components={portableTextComponentsClient} />
          </article>

          {faq.length > 0 ? (
            <section className="mt-16 pt-16 border-t border-white/10">
              <div className="mb-10">
                <p className="text-xs text-teal-300 tracking-[0.32em] uppercase mb-3">FAQ</p>
                <h2 className="text-3xl lg:text-4xl font-light font-oxanium text-white">
                  {language === 'pl' ? 'Najczęściej zadawane pytania' : 'Frequently asked questions'}
                </h2>
              </div>
              <FaqAccordionList items={faq} />
            </section>
          ) : null}

          {post.author ? (
            <div className="mt-16 p-8 border border-white/10">
              <div className="flex items-center gap-6">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 text-white/70 flex items-center justify-center  text-2xl shrink-0">
                    {(post.author?.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/30  tracking-widest uppercase mb-1">{t.post?.author || 'AUTHOR'}</p>
                  <h3 className="text-xl text-white ">{post.author.name}</h3>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-8">
            {previousPost ? (
              <PrefetchLink href={localizedPath(language, `/blog/${previousPost.slug.current}`)} className="group flex items-center gap-4 flex-1">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/30  tracking-widest uppercase mb-1">{language === 'pl' ? 'Poprzedni' : 'Previous'}</p>
                  <p className="text-white  group-hover:text-teal-300 transition-colors font-oxanium truncate">{getLocalizedText(previousPost.title, language)}</p>
                </div>
              </PrefetchLink>
            ) : <div />}

            {nextPost ? (
              <PrefetchLink href={localizedPath(language, `/blog/${nextPost.slug.current}`)} className="group flex items-center gap-4 flex-1 justify-end text-right">
                <div className="min-w-0">
                  <p className="text-xs text-white/30  tracking-widest uppercase mb-1">{language === 'pl' ? 'Następny' : 'Next'}</p>
                  <p className="text-white  group-hover:text-teal-300 transition-colors font-oxanium truncate">{getLocalizedText(nextPost.title, language)}</p>
                </div>
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                </div>
              </PrefetchLink>
            ) : null}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="border-t border-white/10 pt-16">
            <h3 className="text-lg font-light text-white  mb-6">{popularLabel}</h3>
            <div className="space-y-4">
              {popularPosts.map((popularPost) => {
                const popularTitle = getLocalizedText(popularPost.title, language);
                const imageUrl = popularPost.mainImage ? urlFor(popularPost.mainImage).width(64).height(64).url() : '';
                return (
                  <PrefetchLink
                    key={popularPost._id}
                    href={localizedPath(language, `/blog/${popularPost.slug.current}`)}
                    className="flex items-center gap-4 group p-3 -mx-3 border border-transparent hover:border-white/10 transition-all duration-300"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={popularTitle}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover flex-shrink-0"
                      />
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-white  group-hover:text-teal-300 transition-colors font-oxanium duration-200 line-clamp-2">{popularTitle}</h4>
                      <p className="text-xs text-white/30  mt-1">
                        {popularPost.viewCount || 0} {t.views} - {new Date(popularPost.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                      </p>
                    </div>
                  </PrefetchLink>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
