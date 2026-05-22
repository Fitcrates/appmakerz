'use client';

import Image from 'next/image';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import SpotlightText from '@/components/new/SpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { urlFor } from '@/lib/sanity.image';
import { translations } from '@/translations/translations';
import type { Post } from '@/types/sanity.types';

interface LatestBlogPostsSectionProps {
  posts?: Post[];
}

export default function LatestBlogPostsSection({ posts = [] }: LatestBlogPostsSectionProps) {
  const { language } = useLanguage();
  const t = translations[language].blog.latestSection;
  const latestPosts = posts.slice(0, 3);

  if (!latestPosts.length) {
    return null;
  }

  return (
    <section id="latest-blog" className="relative bg-indigo-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pt-12 lg:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/30">
              {t.label}
            </span>
            <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
              <SpotlightText as="span" className="font-oxanium" glowSize={160}>
                {t.heading}
              </SpotlightText>
            </h2>
            <SpotlightText as="p" className="mt-6 max-w-2xl text-base font-light leading-relaxed text-white/55 sm:text-lg">
              {t.subtitle}
            </SpotlightText>
          </div>
        </div>

        <div className="grid items-stretch sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => {
            const title = getLocalizedText(post.title, language);
            const excerpt = getLocalizedText(post.excerpt, language);
            const imageUrl = post.mainImage
              ? urlFor(post.mainImage).width(700).height(460).fit('crop').auto('format').url()
              : '';

            return (
              <article key={post._id} className="group h-full border border-white/[0.07] bg-indigo-950">
                <PrefetchLink href={localizedPath(language, `/blog/${post.slug.current}`)} className="flex h-full flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/10 to-transparent" />
                  </div>

                  <div className="flex min-h-[22rem] flex-1 flex-col p-6 sm:p-7">
                    <div>
                      <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/35">
                        <CalendarDays className="h-4 w-4 text-teal-300/70" />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                      </div>

                      <h3 className="font-oxanium text-2xl font-light leading-tight text-white transition-colors group-hover:text-teal-300">
                        {title}
                      </h3>
                    </div>

                    <div className="mt-auto pt-8">
                      {excerpt ? (
                        <p className="line-clamp-4 min-h-[5.5rem] text-sm font-light leading-relaxed text-white/50">
                          {excerpt}
                        </p>
                      ) : (
                        <div className="min-h-[5.5rem]" />
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 text-sm text-white/55 transition-colors group-hover:text-teal-300">
                        {translations[language].blog.readMore}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </PrefetchLink>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center lg:justify-start">
          <PrefetchLink
            href={localizedPath(language, '/blog')}
            className="group inline-flex items-center gap-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
          >
            <SpotlightText glowSize={100}>
              <span className="font-oxanium text-lg font-light text-white transition-colors group-hover:text-teal-300">
                {t.cta}
              </span>
            </SpotlightText>
            <div className="flex h-12 w-12 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-teal-300 group-hover:bg-teal-300" aria-hidden="true">
              <ArrowUpRight className="h-5 w-5 text-white transition-colors group-hover:text-indigo-950" />
            </div>
          </PrefetchLink>
        </div>
      </div>
    </section>
  );
}
