'use client';

import { useMemo, useState } from 'react';
import PrefetchLink from '@/components/next/PrefetchLink';
import SearchBar from '@/components/next/SearchBar';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import styles from './MarketplaceGuide.module.css';

type SearchChapter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  headings: string[];
};

export default function GuideSearch({ language, chapters, compact = false }: { language: Language; chapters: SearchChapter[]; compact?: boolean }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase(language);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return chapters
      .map((chapter) => {
        const haystack = [chapter.title, chapter.description, ...chapter.headings].join(' ').toLocaleLowerCase(language);
        return { chapter, score: haystack.includes(normalizedQuery) ? (chapter.title.toLocaleLowerCase(language).includes(normalizedQuery) ? 2 : 1) : 0 };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((entry) => entry.chapter);
  }, [chapters, language, normalizedQuery]);

  return (
    <SearchBar
      id={compact ? 'guide-search-compact' : 'guide-search'}
      label={language === 'pl' ? 'Szukaj w przewodniku' : 'Search the guide'}
      placeholder={language === 'pl' ? 'Szukaj obowiązku, procesu lub przepisu…' : 'Search an obligation, process, or regulation…'}
      value={query}
      onValueChange={setQuery}
      className={`${styles.guideSearch} ${compact ? styles.guideSearchCompact : ''}`}
    >
      {normalizedQuery ? (
        <div className={styles.searchResults} role="listbox" aria-label={language === 'pl' ? 'Wyniki wyszukiwania' : 'Search results'}>
          {results.length ? results.map((chapter) => (
            <PrefetchLink
              key={chapter.slug}
              href={localizedPath(language, `/marketplace-guide/${chapter.slug}`)}
              role="option"
              onClick={() => setQuery('')}
            >
              <span>{chapter.id === 'legal' ? '§' : chapter.id.padStart(2, '0')}</span>
              <span>
                <strong>{chapter.title.replace(/^\d+\.\s*/, '')}</strong>
                <small>{chapter.description}</small>
              </span>
            </PrefetchLink>
          )) : (
            <p>{language === 'pl' ? 'Brak pasujących rozdziałów.' : 'No matching chapters.'}</p>
          )}
        </div>
      ) : null}
    </SearchBar>
  );
}
