'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import JurisdictionBadge from './JurisdictionBadge';
import styles from './MarketplaceGuide.module.css';

import type { GuideJurisdiction } from '@/lib/marketplace-guide';

type Chapter = { id: string; slug: string; title: string; description: string; jurisdiction?: GuideJurisdiction };
type Section = { title: string; chapters: Chapter[] };
export type SwitcherTrack = {
  key: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  description: string;
  sections: Section[];
  chapterCount: number;
};

/**
 * Both guides live on one index. Stacking them meant scrolling past twenty-six
 * chapters to reach the second, so they are switched instead.
 *
 * The inactive track stays in the DOM behind `hidden` rather than being
 * unmounted: its chapter links have to remain crawlable, and this is the index
 * page that points at every chapter. Search sits outside this component and
 * covers both tracks whatever is selected.
 */
export default function GuideTrackSwitcher({
  tracks,
  language,
}: {
  tracks: SwitcherTrack[];
  language: Language;
}) {
  const [active, setActive] = useState(tracks[0]?.key);

  if (!tracks.length) return null;

  const activeIndex = Math.max(0, tracks.findIndex((track) => track.key === active));

  return (
    <>
      {tracks.length > 1 ? (
        <div className={styles.trackSwitcherRow}>
          <div
            className={`${styles.trackSwitcher} backdrop-blur-xl`}
            role="tablist"
            aria-label={language === 'pl' ? 'Wybierz przewodnik' : 'Choose a guide'}
            /* The teal pill is one element sliding under the labels rather than a
               background swapped per button, so the movement reads as one control. */
            style={{ '--track-count': tracks.length, '--track-active': activeIndex } as React.CSSProperties}
          >
            <span aria-hidden="true" className={styles.trackThumb} />
            {tracks.map((track) => (
              <button
                key={track.key}
                type="button"
                role="tab"
                id={`track-tab-${track.key}`}
                aria-selected={track.key === active}
                aria-controls={`track-panel-${track.key}`}
                className={track.key === active ? styles.trackTabActive : styles.trackTab}
                onClick={() => setActive(track.key)}
              >
                {track.shortTitle}
                <span className={styles.trackTabCount}>{track.chapterCount}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {tracks.map((track) => (
        <section
          key={track.key}
          id={`track-panel-${track.key}`}
          role={tracks.length > 1 ? 'tabpanel' : undefined}
          aria-labelledby={tracks.length > 1 ? `track-tab-${track.key}` : undefined}
          hidden={tracks.length > 1 && track.key !== active}
          className={styles.trackSection}
        >
          {tracks.length > 1 ? (
            <div className={styles.trackHeader}>
              <h2>{track.title}</h2>
              <p className={styles.trackSubtitle}>{track.subtitle}</p>
              <p>{track.description}</p>
            </div>
          ) : null}

          {/* Shown only for the track that carries markers, so the architecture
              track is not annotated with a legal legend it never uses. */}
          {track.sections.some((section) => section.chapters.some((chapter) => chapter.jurisdiction)) ? (
            <p className={styles.jurisdictionLegend}>
              <span>{language === 'pl' ? 'Zasięg:' : 'Scope:'}</span>
              <span className={styles.jurisdictionLegendItem}>
                <JurisdictionBadge jurisdiction="eu" language={language} />
                {language === 'pl' ? 'obowiązek z prawa UE, szczegóły wdrożenia bywają krajowe' : 'obligation from EU law, implementation details can be national'}
              </span>
              <span className={styles.jurisdictionLegendItem}>
                <JurisdictionBadge jurisdiction="pl" language={language} />
                {language === 'pl' ? 'polskie rejestry, progi lub terminy' : 'Polish registers, thresholds or deadlines'}
              </span>
            </p>
          ) : null}

          {track.sections.map((section) => (
            <div key={section.title} className={styles.chapterSection}>
              <h2 className={styles.sectionLabel}>
                {section.title}
                <span className={styles.sectionCount}>{section.chapters.length}</span>
              </h2>
              <div className={styles.chapterGrid}>
                {section.chapters.map((chapter) => (
                  <PrefetchLink
                    key={chapter.slug}
                    className={styles.chapterCard}
                    href={localizedPath(language, `/marketplace-guide/${chapter.slug}`)}
                  >
                    <span className={styles.chapterNumber}>
                      <span className={styles.chapterNumberLead}>
                        {chapter.id === 'legal' ? '§' : chapter.id.padStart(2, '0')}
                        <JurisdictionBadge jurisdiction={chapter.jurisdiction} language={language} />
                      </span>
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </span>
                    <h3>{chapter.title.replace(/^\d+\.\s*/, '')}</h3>
                    <p>{chapter.description}</p>
                  </PrefetchLink>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
