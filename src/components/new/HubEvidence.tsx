"use client";

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
// page. On the hub they are the evidence, so they sit mid-page with the
// category as a label and the article title as the anchor text.
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
        <div className="mt-4 mb-12 max-w-3xl lg:mb-16">
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

        <div>
          {entries.map((post) => {
            const title = getLocalizedText(post.title, language);
            const excerpt = getLocalizedText(post.excerpt, language);
            // Legacy posts store categories as plain strings; newer ones
            // reference a category document.
            const firstCategory = post.categories?.[0];
            const category = typeof firstCategory === 'string'
              ? firstCategory
              : getLocalizedText(firstCategory?.title, language);

            return (
              <div
                key={post._id}
                className="grid gap-3 border-t border-white/10 py-7 sm:grid-cols-[180px_1fr] sm:gap-8"
              >
                <p className="font-plex text-[11px] tracking-[0.18em] uppercase text-white/35">
                  {category}
                </p>
                <div>
                  <PrefetchLink
                    href={localizedPath(language, `/blog/${post.slug.current}`)}
                    className="font-oxanium text-lg font-light text-teal-300 transition-colors hover:text-teal-200 sm:text-xl"
                  >
                    {title}
                  </PrefetchLink>
                  {excerpt ? (
                    <p className="mt-2 max-w-[62ch] font-light leading-relaxed text-white/55">
                      {excerpt}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
