"use client";

import { Plus } from 'lucide-react';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import type { Language } from '@/lib/language';
import type { ServiceIntegration } from '@/types/sanity.types';

interface HubIntegrationsProps {
  integrations: ServiceIntegration[];
  language: Language;
}

// Written from the buyer's side: each row is something they already worry
// about, opened to show what answers it. Drawn as a hub, Medusa in the middle
// and the groups hanging off it, so the page shows "one engine, many
// connections" before anyone reads a line. Answers sit in <details>, so they
// are in the HTML and work without JavaScript.
export default function HubIntegrations({ integrations, language }: HubIntegrationsProps) {
  const rows = integrations.filter((entry) => entry?.name);

  if (!rows.length) {
    return null;
  }

  const groups: Array<{ heading: string; rows: ServiceIntegration[] }> = [];
  rows.forEach((row) => {
    const heading = row.group || '';
    const last = groups[groups.length - 1];
    if (last && last.heading === heading) {
      last.rows.push(row);
    } else {
      groups.push({ heading, rows: [row] });
    }
  });

  const count = groups.length;
  const columns = count >= 3 ? 'lg:grid-cols-3' : count === 2 ? 'lg:grid-cols-2' : '';
  // The bar joins the centres of the first and last column.
  const inset = `${50 / Math.min(count, 3)}%`;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs tracking-[0.3em] uppercase text-white/55">
          {language === 'pl' ? 'Połączenia' : 'Connections'}
        </span>
        <div className="mt-4 max-w-3xl">
          <BurnSpotlightText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium"
            glowSize={180}
            baseDelay={100}
            charDelay={30}
          >
            {language === 'pl' ? 'Sklep nie działa sam' : 'A store does not run alone'}
          </BurnSpotlightText>
        </div>
        <SpotlightText
          as="p"
          className="mt-5 mb-12 max-w-2xl font-light leading-relaxed text-white/55 lg:mb-16"
          glowSize={120}
        >
          {language === 'pl'
            ? 'Musi rozmawiać z tym, czego już używasz, i z tym, czego oczekuje Twój klient. Kliknij potrzebę, żeby zobaczyć, czym ją zamykam.'
            : 'It has to talk to what you already use, and to what your customer expects. Open a need to see what closes it.'}
        </SpotlightText>

        <div className="flex justify-center">
          <span className="rounded-full bg-teal-300 px-6 py-3 font-oxanium text-lg text-indigo-950">Medusa.js</span>
        </div>

        {count > 1 ? (
          <div aria-hidden="true" className="relative hidden h-10 lg:block">
            <span className="absolute left-1/2 top-0 h-5 w-px bg-teal-300/40" />
            <span className="absolute top-5 h-px bg-teal-300/40" style={{ left: inset, right: inset }} />
          </div>
        ) : null}

        <div className={`mt-6 grid items-start gap-4 lg:mt-0 ${columns}`}>
          {groups.map((group, groupIndex) => (
            <div key={`integration-group-${groupIndex}`} className="relative">
              {count > 1 ? (
                <span aria-hidden="true" className="absolute -top-5 left-1/2 hidden h-5 w-px bg-teal-300/40 lg:block" />
              ) : null}
              <div className="ac-card p-5 sm:p-6">
                {group.heading ? (
                  <SpotlightText as="h3" className="mb-3 px-1 font-plex text-xs uppercase tracking-[0.25em] text-teal-300/80!" glowSize={90}>
                    {group.heading}
                  </SpotlightText>
                ) : null}
                <div className="flex flex-col gap-2">
                  {group.rows.map((row, rowIndex) => (
                    <details
                      key={`integration-${groupIndex}-${rowIndex}`}
                      className="group rounded-2xl bg-white/[0.035] transition-colors open:bg-white/[0.06]"
                    >
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                        <SpotlightText className="font-oxanium text-base leading-snug text-white!" glowSize={100}>{row.name}</SpotlightText>
                        <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-300 transition-transform duration-300 group-open:rotate-45" />
                      </summary>
                      <div className="px-4 pb-4">
                        <SpotlightText as="p" className="font-plex text-sm font-light leading-relaxed text-white/70!" glowSize={110}>{row.detail}</SpotlightText>
                        {row.meta ? (
                          <div className="mt-2">
                            <SpotlightText as="p" className="font-plex text-xs tracking-wide text-white/45!" glowSize={90}>{row.meta}</SpotlightText>
                          </div>
                        ) : null}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
