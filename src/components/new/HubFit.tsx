"use client";

import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import type { Language } from '@/lib/language';

interface HubFitProps {
  fitYes: string[];
  fitNo: string[];
  language: Language;
}

// Qualification, not persuasion. The "poor fit" column is the point: it turns
// away work that would go badly and makes the other column credible.
export default function HubFit({ fitYes, fitNo, language }: HubFitProps) {
  if (!fitYes.length && !fitNo.length) {
    return null;
  }

  const columns = [
    {
      heading: language === 'pl' ? 'Dla Ciebie, jeśli' : 'For you if',
      items: fitYes,
      tone: 'text-teal-300',
    },
    {
      heading: language === 'pl' ? 'Raczej nie, jeśli' : 'Probably not if',
      items: fitNo,
      tone: 'text-white/40',
    },
  ].filter((column) => column.items.length);

  return (
    <section className="py-20 lg:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs tracking-[0.3em] uppercase text-white/30">
          {language === 'pl' ? 'Zanim napiszesz' : 'Before you write'}
        </span>
        <div className="mt-4 mb-12 max-w-3xl lg:mb-16">
          <BurnSpotlightText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium"
            glowSize={180}
            baseDelay={100}
            charDelay={30}
          >
            {language === 'pl' ? 'Dla kogo?' : 'Who is this for?'}
          </BurnSpotlightText>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
          {columns.map((column, index) => (
            <div
              key={column.heading}
              className={index === 1 ? 'lg:border-l lg:border-white/10 lg:pl-14' : 'lg:pr-14'}
            >
              <span className={`font-plex text-[11px] tracking-[0.18em] uppercase ${column.tone}`}>
                {column.heading}
              </span>
              <ul className="mt-5" role="list">
                {column.items.map((item, itemIndex) => (
                  <li
                    key={`fit-${index}-${itemIndex}`}
                    className="border-b border-white/[0.06] py-3 font-light leading-relaxed text-white/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
