"use client";

import PrefetchLink from '@/components/next/PrefetchLink';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import type { ServiceCapability } from '@/types/sanity.types';

interface HubCapabilitiesProps {
  capabilities: ServiceCapability[];
  language: Language;
}

// Scope, grouped. The sticky-heading layout is borrowed from
// ServiceDeliverablesNew because it carries a long list without turning into a
// wall of cards, which matters here because the point is breadth.
export default function HubCapabilities({ capabilities, language }: HubCapabilitiesProps) {
  const groups = capabilities.filter((entry) => entry?.group && entry.items?.length);

  if (!groups.length) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.9fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <span className="text-xs tracking-[0.3em] uppercase text-teal-300/80 mb-4 block">
              {language === 'pl' ? 'Zakres' : 'Scope'}
            </span>
            <BurnSpotlightText
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white leading-tight"
              glowSize={200}
              baseDelay={100}
              charDelay={30}
              activateOnMount
            >
              {language === 'pl' ? 'Co buduję' : 'What I build'}
            </BurnSpotlightText>
          </div>

          <div>
            {groups.map((group, index) => (
              <div
                key={`capability-${index}`}
                className={index === 0 ? 'pb-7' : 'border-t border-white/10 py-7'}
              >
                <h3 className="font-oxanium text-xl font-light text-white/85 sm:text-[1.375rem]">
                  {group.group}
                </h3>
                <SpotlightText
                  as="p"
                  className="mt-3 max-w-[58ch] font-light leading-relaxed text-white/60"
                  glowSize={120}
                >
                  {(group.items || []).join(' · ')}
                </SpotlightText>
                {group.linkHref && group.linkLabel ? (
                  <PrefetchLink
                    href={localizedPath(language, group.linkHref)}
                    className="mt-4 inline-block text-sm text-teal-300 transition-colors hover:text-teal-200"
                  >
                    {group.linkLabel} <span aria-hidden="true">→</span>
                  </PrefetchLink>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
