"use client";

import { ArrowUpRight, BookOpenCheck } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';

interface GuideChapterLink {
  slug: string;
  title: string;
}

interface GuideCtaSectionProps {
  chapters: GuideChapterLink[];
  chapterCount: number;
  trackCount: number;
  language: Language;
}

// Lifted out of uslugi/[slug]/page.tsx, where it was gated on a hardcoded slug
// so no other landing could ever surface the guide. Both layouts now render it
// from the guideCta field.
export default function GuideCtaSection({ chapters, chapterCount, trackCount, language }: GuideCtaSectionProps) {
  const trackLabel = language === 'pl'
    ? (trackCount === 2 ? 'dwóch ścieżkach' : `${trackCount} ścieżkach`)
    : (trackCount === 2 ? 'two tracks' : `${trackCount} tracks`);

  return (
    <section className="border-t border-white/10 py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border border-teal-300/20 bg-teal-300/[0.05] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-teal-300">
              <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
              {language === 'pl' ? 'Bezpłatna baza wiedzy' : 'Free knowledge base'}
            </div>
            <h2 className="font-oxanium text-2xl font-light text-white sm:text-3xl">
              {language === 'pl'
                ? 'Przewodnik marketplace: obowiązki i architektura'
                : 'Marketplace guide: obligations and architecture'}
            </h2>
            <p className="mt-4 max-w-2xl font-light leading-relaxed text-white/60">
              {language === 'pl'
                ? `${chapterCount} rozdziałów w ${trackLabel}: obowiązki operatora, od onboardingu sprzedawców przez GPSR, DSA i DAC7 po BDO, oraz architektura platformy od MVP do skali.`
                : `${chapterCount} chapters across ${trackLabel}: operator obligations, from seller onboarding through GPSR, DSA and DAC7 to packaging compliance, and platform architecture from MVP to scale.`}
            </p>
            {chapters.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" role="list">
                {chapters.map((chapter) => (
                  <li key={chapter.slug}>
                    <PrefetchLink
                      href={localizedPath(language, `/marketplace-guide/${chapter.slug}`)}
                      className="text-sm text-teal-300/90 underline decoration-teal-300/30 underline-offset-4 transition-colors hover:text-teal-200"
                    >
                      {chapter.title}
                    </PrefetchLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <PrefetchLink
            href={localizedPath(language, '/marketplace-guide')}
            className="inline-flex items-center justify-center gap-2 border border-teal-300/40 px-6 py-3 text-sm text-teal-300 transition-colors hover:bg-teal-300 hover:text-indigo-950"
          >
            {language === 'pl' ? 'Otwórz przewodnik' : 'Open the guide'}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </PrefetchLink>
        </div>
      </div>
    </section>
  );
}
