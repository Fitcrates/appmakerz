"use client";

import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import type { Language } from '@/lib/language';
import type { ServiceIntegration } from '@/types/sanity.types';

interface HubIntegrationsProps {
  integrations: ServiceIntegration[];
  language: Language;
}

// Written from the buyer's side: the left column is something they already
// worry about, the right column is what answers it. An earlier version led with
// vendor names, which told a prospect nothing about what they would get.
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

  return (
    <section className="py-20 lg:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs tracking-[0.3em] uppercase text-white/30">
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
            ? 'Musi rozmawiać z tym, czego już używasz, i z tym, czego oczekuje Twój klient. Poniżej typowe potrzeby i to, czym je zamykam.'
            : 'It has to talk to what you already use, and to what your customer expects. Below are the usual needs and what closes them.'}
        </SpotlightText>

        {groups.map((group, groupIndex) => (
          <div key={`integration-group-${groupIndex}`} className={groupIndex > 0 ? 'mt-14' : ''}>
            {group.heading ? (
              <h3 className="font-plex text-[11px] tracking-[0.2em] uppercase text-white/40">
                {group.heading}
              </h3>
            ) : null}
            <div className={group.heading ? 'mt-5' : ''}>
              {group.rows.map((row, rowIndex) => (
                <div
                  key={`integration-${groupIndex}-${rowIndex}`}
                  className="grid gap-2 border-t border-white/10 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12"
                >
                  <p className="font-oxanium text-lg font-light text-white sm:text-xl">
                    {row.name}
                  </p>
                  <div>
                    <p className="font-light leading-relaxed text-white/60">{row.detail}</p>
                    {row.meta ? (
                      <p className="mt-2 font-plex text-xs tracking-wide text-white/35">{row.meta}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
