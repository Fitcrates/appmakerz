"use client";

import { useState } from 'react';
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

const VISIBLE = 3;

// Scope as tiles. Each shows its first three items and folds the rest away, so
// the breadth is visible at a glance without a run-on line of dot-separated
// features. The folded items stay in the HTML (hidden, not unmounted), so the
// full scope is still there for search engines and for find-in-page.
export default function HubCapabilities({ capabilities, language }: HubCapabilitiesProps) {
  const groups = capabilities.filter((entry) => entry?.group && entry.items?.length);
  const [open, setOpen] = useState<number | null>(null);

  if (!groups.length) {
    return null;
  }

  const t = language === 'pl'
    ? { eyebrow: 'Zakres', heading: 'Co buduję', lead: 'Obszary, w których pracuję na Medusa.js. W każdym kilka najczęstszych potrzeb, resztę rozwiniesz.', more: (n: number) => `+ ${n} więcej`, less: 'Zwiń', count: (n: number) => `${n} pozycji` }
    : { eyebrow: 'Scope', heading: 'What I build', lead: 'The areas I work on in Medusa.js. Each shows the most common needs; expand for the rest.', more: (n: number) => `+ ${n} more`, less: 'Show less', count: (n: number) => `${n} items` };

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl lg:mb-16">
          <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-teal-300/80">{t.eyebrow}</span>
          <BurnSpotlightText
            as="h2"
            className="font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl/10 lg:text-5xl/none"
            glowSize={200}
            baseDelay={100}
            charDelay={30}
            activateOnMount
          >
            {t.heading}
          </BurnSpotlightText>
          <div className="mt-5">
            <SpotlightText as="p" className="font-plex text-lg font-light leading-relaxed text-white/60!" glowSize={130}>{t.lead}</SpotlightText>
          </div>
        </div>

        {/* Every tile the same height while all are folded. An open tile
            releases that, so one long list does not stretch the whole grid. */}
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${open === null ? 'md:auto-rows-fr' : ''}`}>
          {groups.map((group, index) => {
            const items = group.items || [];
            const top = items.slice(0, VISIBLE);
            const rest = items.slice(VISIBLE);
            const isOpen = open === index;
            const restId = `capability-rest-${index}`;

            return (
              <article key={`capability-${index}`} className="ac-card flex flex-col gap-5 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3 font-plex text-xs">
                  <span className="text-teal-300">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-white/50">{t.count(items.length)}</span>
                </div>
                <SpotlightText as="h3" className="font-oxanium text-xl font-light leading-snug text-white! sm:text-[1.375rem]" glowSize={120}>{group.group}</SpotlightText>
                <ul className="flex flex-col gap-2.5">
                  {top.map((item) => (
                    <li key={item} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-2.5 font-plex text-[0.95rem] leading-relaxed text-white/80">
                      <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-teal-300" aria-hidden="true" />
                      <SpotlightText className="text-white/80!" glowSize={100}>{item}</SpotlightText>
                    </li>
                  ))}
                </ul>
                {rest.length ? (
                  <ul id={restId} hidden={!isOpen} className="flex flex-col gap-2.5 border-t border-white/10 pt-4">
                    {rest.map((item) => (
                      <li key={item} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-2.5 font-plex text-sm leading-relaxed text-white/65">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/35" aria-hidden="true" />
                        <SpotlightText className="text-white/65!" glowSize={100}>{item}</SpotlightText>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                  {rest.length ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={restId}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="min-h-11 border border-white/20 px-4 py-2 font-plex text-sm text-white transition-colors hover:border-teal-300/60 hover:text-teal-200"
                    >
                      {isOpen ? t.less : t.more(rest.length)}
                    </button>
                  ) : <span />}
                  {group.linkHref && group.linkLabel ? (
                    <PrefetchLink
                      href={localizedPath(language, group.linkHref)}
                      className="text-sm text-teal-300 transition-colors hover:text-teal-200"
                    >
                      {group.linkLabel} <span aria-hidden="true">→</span>
                    </PrefetchLink>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
