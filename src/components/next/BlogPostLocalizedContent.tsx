'use client';

import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import BlogLatestPostsSidebar from '@/components/next/BlogLatestPostsSidebar';
import BlogPostViewTracker from '@/components/next/BlogPostViewTracker';
import BlogShareSidebar from '@/components/next/BlogShareSidebar';
import FaqAccordionList from '@/components/next/FaqAccordionList';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { portableTextComponentsClient } from '@/components/next/PortableTextComponentsClient';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { urlFor } from '@/lib/sanity.image';
import { getImageAlt } from '@/lib/image-alt';
import { extractPortableText } from '@/lib/seo';
import { translations } from '@/translations/translations';

interface BlogPostLocalizedContentProps {
  post: any;
  posts: any[];
}

export default function BlogPostLocalizedContent({ post, posts }: BlogPostLocalizedContentProps) {
  const { language } = useLanguage();
  const t = translations[language].blog;

  const title = getLocalizedText(post.title, language);
  const body = getLocalizedArray<any>(post.body, language);
  const faq = getLocalizedArray<{ question: string; answer: string }>(post.faq, language);
  const heroImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).auto('format').fit('crop').url() : '';
  const authorImageUrl = post.author?.image ? urlFor(post.author.image).width(80).height(80).auto('format').url() : '';
  
  const bodyText = extractPortableText(body);
  const wordCount = bodyText.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const toc = body
    .filter((block: any) => block._type === 'block' && block.style === 'h2')
    .map((block: any) => {
      const text = Array.isArray(block.children) ? block.children.map((c: any) => c.text).join('') : '';
      const id = text.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { text, id };
    })
    .filter((item: any) => item.text);
  const allPostsSorted = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const currentIndex = allPostsSorted.findIndex((item) => item._id === post._id);
  const previousPost = currentIndex > 0 ? allPostsSorted[currentIndex - 1] : null;
  const nextPost = currentIndex < allPostsSorted.length - 1 ? allPostsSorted[currentIndex + 1] : null;
  const relatedServices = Array.isArray(post.relatedServices) ? post.relatedServices : [];

  return (
    <>
      <BlogPostViewTracker postId={post._id} />

      <main className="pt-16 lg:pt-24 pb-24">
        {heroImageUrl ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
            <div className="relative h-[38vh] sm:h-[44vh] lg:h-[50vh] overflow-hidden">
              <Image
                src={heroImageUrl}
                alt={getImageAlt(post.mainImage, title)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/70 to-indigo-950/20 pointer-events-none" />
            </div>
          </div>
        ) : null}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:px-8 xl:grid-cols-[4.5rem_minmax(0,48rem)_17.5rem] xl:items-start xl:gap-12">
          <div className="min-w-0 xl:col-start-2">
            <div className="flex items-center gap-2 text-sm text-white/70  mb-8 overflow-hidden">
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
                  alt={post.author?.name || 'Post author'}
                  width={80}
                  height={80}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : null}
              <div>
                <p className="text-white ">{post.author?.name}</p>
                <p className="text-white/70 text-sm ">
                  {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {post.viewCount ? ` - ${post.viewCount} ${t.views}` : ''}
                  {` - ${readingTime} min ${language === 'pl' ? 'czytania' : 'read'}`}
                </p>
              </div>
            </div>

            {relatedServices.length > 0 ? (
              <div className="mb-12">
                <p className="flex items-baseline gap-1.5 text-xs uppercase tracking-[0.18em] text-teal-300/80">
                  <span className="text-teal-300/50">/</span>
                  {language === 'pl' ? 'Powiązane usługi' : 'Related services'}
                </p>
                <div>
                  {relatedServices.slice(0, 3).map((service) => {
                    const serviceTitle = getLocalizedText(service.title, language);
                    const serviceIntro = getLocalizedText(service.intro, language);

                    return (
                      <PrefetchLink
                        key={service._id}
                        href={localizedPath(language, `/uslugi/${service.slug.current}`)}
                        className="group relative block border-b border-white/10 py-5"
                      >
                        <span className="flex items-start justify-between gap-4">
                          <span className="min-w-0 transition-transform duration-300 group-hover:translate-x-1.5">
                            <span className="block font-oxanium text-base leading-snug text-white/80 transition-colors duration-300 group-hover:text-teal-300">
                              {serviceTitle}
                            </span>
                            {serviceIntro ? (
                              <span className="mt-2 line-clamp-2 block text-sm font-light leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/70">
                                {serviceIntro}
                              </span>
                            ) : null}
                          </span>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-300" />
                        </span>
                        <span className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                      </PrefetchLink>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className=" -mt-4">
              <BlogShareSidebar language={language} title={title} variant="mobile" />
            </div>
          </div>

          <BlogShareSidebar language={language} title={title} />

          <div id="blog-content-start" className="min-w-0 xl:col-start-2 xl:row-start-2">
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

            {/* author removed */}

            <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8 overflow-hidden">
              {previousPost ? (
                <PrefetchLink href={localizedPath(language, `/blog/${previousPost.slug.current}`)} className="group flex min-w-0 max-w-full items-center gap-4">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                    <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                  </div>
                  <div className="min-w-0 max-w-full">
                    <p className="text-xs text-white/30  tracking-widest uppercase mb-1">{language === 'pl' ? 'Poprzedni' : 'Previous'}</p>
                    <p className="text-white  group-hover:text-teal-300 transition-colors font-oxanium leading-snug line-clamp-3 break-words">{getLocalizedText(previousPost.title, language)}</p>
                  </div>
                </PrefetchLink>
              ) : <div className="hidden sm:block" />}

              {nextPost ? (
                <PrefetchLink href={localizedPath(language, `/blog/${nextPost.slug.current}`)} className="group flex min-w-0 max-w-full items-center justify-end gap-4 text-right">
                  <div className="min-w-0 max-w-full">
                    <p className="text-xs text-white/30  tracking-widest uppercase mb-1">{language === 'pl' ? 'Następny' : 'Next'}</p>
                    <p className="text-white  group-hover:text-teal-300 transition-colors font-oxanium leading-snug line-clamp-3 break-words">{getLocalizedText(nextPost.title, language)}</p>
                  </div>
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                  </div>
                </PrefetchLink>
              ) : null}
            </div>
          </div>

          <BlogLatestPostsSidebar currentPostId={post._id} language={language} posts={posts} toc={toc} />
        </div>
      </main>
    </>
  );
}
