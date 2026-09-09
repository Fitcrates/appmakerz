"use client";

import { ArrowUpRight } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import type { Post } from '@/types/sanity.types';

interface HubEvidenceProps {
  posts: Post[];
  language: Language;
}

// On a service landing the related articles are a footnote at the bottom of the
// page. On the hub they are the evidence, so they sit mid-page and carry a real
// heading level.
//
// The list runs in two columns from lg up: three entries in one column read as
// an afterthought, eight of them read as a wall. Separation is a hairline and
// whitespace rather than a card, so the section stays open.
export default function HubEvidence({ posts, language }: HubEvidenceProps) {
  const entries = posts.filter((post) => post?.slug?.current);

  if (!entries.length) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs tracking-[0.3em] uppercase text-white/30">
          {language === 'pl' ? 'Dowody' : 'Evidence'}
        </span>
        <div className="mt-4 max-w-3xl">
          <BurnSpotlightText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium"
            glowSize={180}
            baseDelay={100}
            charDelay={30}
          >
            {language === 'pl' ? 'Problemy rozwiązane w produkcji' : 'Problems solved in production'}
          </BurnSpotlightText>
        </div>
        <p className="mt-5 mb-12 max-w-2xl font-light leading-relaxed text-white/55 lg:mb-16">
          {language === 'pl'
            ? 'Każdy z tych tekstów opisuje decyzję podjętą na działającym systemie, razem z tym, co poszło nie tak za pierwszym razem.'
            : 'Each of these describes a decision taken on a running system, including what went wrong on the first attempt.'}
        </p>

        <div className="grid lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {entries.map((post, index) => {
            const title = getLocalizedText(post.title, language);
            const excerpt = getLocalizedText(post.excerpt, language);
            // Legacy posts store categories as plain strings; newer ones
            // reference a category document.
            const firstCategory = post.categories?.[0];
            const category = typeof firstCategory === 'string'
              ? firstCategory
              : getLocalizedText(firstCategory?.title, language);

            return (
              <PrefetchLink
                key={post._id}
                href={localizedPath(language, `/blog/${post.slug.current}`)}
                className="group grid grid-cols-[2rem_1fr_1rem] items-start gap-x-4 border-t border-white/10 py-7 transition-colors hover:border-teal-300/30 sm:grid-cols-[2.75rem_1fr_1.25rem]"
              >
                <span className="font-oxanium text-sm font-light tabular-nums text-teal-300/50 transition-colors group-hover:text-teal-300 pt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  {category ? (
                    <span className="block font-plex text-[11px] tracking-[0.18em] uppercase text-white/35">
                      {category}
                    </span>
                  ) : null}
                  <h3 className="mt-2 font-oxanium text-lg font-light leading-snug text-white transition-colors group-hover:text-teal-300 sm:text-xl">
                    {title}
                  </h3>
                  {excerpt ? (
                    <span className="mt-2 line-clamp-2 block max-w-[52ch] font-light leading-relaxed text-white/55">
                      {excerpt}
                    </span>
                  ) : null}
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  size={16}
                  className="mt-1 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-300"
                />
              </PrefetchLink>
            );
          })}
        </div>

        <PrefetchLink
          href={localizedPath(language, '/blog')}
          className="mt-10 inline-flex items-center gap-2 border-t border-white/10 pt-8 text-sm text-teal-300 transition-colors hover:text-teal-200"
        >
          {language === 'pl' ? 'Wszystkie wpisy na blogu' : 'All posts on the blog'}
          <ArrowUpRight aria-hidden="true" size={15} />
        </PrefetchLink>
      </div>
    </section>
  );
}
