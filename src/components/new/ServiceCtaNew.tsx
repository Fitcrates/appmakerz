"use client";

import PrefetchLink from '@/components/next/PrefetchLink';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';

interface ServiceCtaNewProps {
  ctaLabel: string;
  language: Language;
  heading?: string;
  body?: string;
}

// Closing CTA, lifted out of uslugi/[slug]/page.tsx. Heading and body are
// overridable so the hub can close on its own note without a second copy of
// the markup.
export default function ServiceCtaNew({ ctaLabel, language, heading, body }: ServiceCtaNewProps) {
  return (
    <section className="py-20 lg:py-24 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <BurnSpotlightText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white"
            glowSize={200}
            baseDelay={100}
            charDelay={30}
          >
            {heading || (language === 'pl' ? 'Gotowy, żeby zacząć?' : 'Ready to get started?')}
          </BurnSpotlightText>
        </div>
        <div className="mb-10 max-w-2xl mx-auto">
          <SpotlightText as="p" className="text-white/50 font-light font-plex text-lg" glowSize={150}>
            {body || (language === 'pl'
              ? 'Porozmawiajmy o Twoim projekcie. Bezpłatna konsultacja, bez zobowiązań.'
              : "Let's talk about your project. Free consultation, no obligations.")}
          </SpotlightText>
        </div>
        <PrefetchLink
          href={localizedPath(language, '/#contact')}
          className="group relative inline-block px-12 py-5 bg-teal-300 text-indigo-950 font-normal overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
        >
          <span className="relative z-10">{ctaLabel}</span>
          <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </PrefetchLink>
      </div>
    </section>
  );
}
