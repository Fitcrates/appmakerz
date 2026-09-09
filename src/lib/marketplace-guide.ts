import polishGuide from '@/content/marketplace-guide/pl.json';
import englishGuide from '@/content/marketplace-guide/en.json';
import type { Language } from '@/lib/language';

export type GuideSegment = { text: string; href?: string };

export type GuideBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; segments: GuideSegment[] }
  | { type: 'list-item'; ordered: boolean; segments: GuideSegment[] }
  | { type: 'callout'; variant: 'stop' | 'practice' | 'important' | 'decision' | 'evidence' | 'deadline' | 'note'; label: string; text: string }
  | { type: 'table'; rows: string[][] };

export type GuideTrackKey = 'regulacje' | 'architektura';

export type GuideTrack = {
  key: GuideTrackKey;
  /** Pill label on the index. The full title heads the panel it opens. */
  shortTitle: string;
  title: string;
  subtitle: string;
  description: string;
};

export type GuideChapter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  /** Which of the two guides the chapter belongs to. */
  track: GuideTrackKey;
  /** Ordering key of the thematic group the chapter sits in. */
  section: number;
  /** Display name of that group, already localised. */
  sectionTitle: string;
  blocks: GuideBlock[];
};

export type MarketplaceGuide = {
  language: Language;
  title: string;
  subtitle: string;
  description: string;
  reviewedAt: string;
  tracks: GuideTrack[];
  chapters: GuideChapter[];
};

const guides: Record<Language, MarketplaceGuide> = {
  pl: polishGuide as MarketplaceGuide,
  en: englishGuide as MarketplaceGuide,
};

export function getMarketplaceGuide(language: Language) {
  return guides[language];
}

export function getMarketplaceGuideChapter(language: Language, slug: string) {
  return guides[language].chapters.find((chapter) => chapter.slug === slug);
}

/**
 * Tracks paired with their chapters, in manifest order.
 *
 * A track with no chapters yet is dropped rather than rendered empty: the
 * architecture guide only appears on the index once its first chapter exists,
 * so the page never advertises something that is not there.
 */
export function getMarketplaceGuideTracks(language: Language) {
  const guide = getMarketplaceGuide(language);
  return (guide.tracks || [])
    .map((track) => {
      const chapters = guide.chapters.filter((chapter) => chapter.track === track.key);

      // Twenty-six cards in one flat run is the thing that makes the index hard
      // to read. Grouping gives the eye a place to stop without changing any
      // chapter, and a track with no groups still renders as one block.
      const sections: Array<{ title: string; chapters: GuideChapter[] }> = [];
      for (const chapter of chapters) {
        const last = sections[sections.length - 1];
        if (last && last.title === chapter.sectionTitle) last.chapters.push(chapter);
        else sections.push({ title: chapter.sectionTitle, chapters: [chapter] });
      }

      return { ...track, chapters, sections };
    })
    .filter((track) => track.chapters.length > 0);
}

/** Chapters of one track, in manifest order. */
export function getMarketplaceGuideTrackChapters(language: Language, track: GuideTrackKey) {
  return getMarketplaceGuide(language).chapters.filter((chapter) => chapter.track === track);
}

/**
 * Previous and next within the same track.
 *
 * This used to index guide.chapters by `chapter.order`, which worked only while
 * order happened to equal the array position and there was a single track. With
 * two guides sharing one file, that arithmetic walks straight out of one guide
 * and into the other.
 */
export function getMarketplaceGuideSiblings(language: Language, slug: string) {
  const chapter = getMarketplaceGuideChapter(language, slug);
  if (!chapter) return { previous: undefined, next: undefined, siblings: [] };

  const siblings = getMarketplaceGuideTrackChapters(language, chapter.track);
  const position = siblings.findIndex((entry) => entry.slug === slug);
  return {
    previous: position > 0 ? siblings[position - 1] : undefined,
    next: position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : undefined,
    siblings,
  };
}

/** The track a chapter belongs to, with its own title and subtitle. */
export function getMarketplaceGuideTrack(language: Language, track: GuideTrackKey) {
  return (getMarketplaceGuide(language).tracks || []).find((entry) => entry.key === track);
}

export function getMarketplaceGuideNavigation(language: Language) {
  const guide = guides[language];
  const trackTitles = new Map((guide.tracks || []).map((track) => [track.key, track.title]));

  return guide.chapters.map((chapter) => ({
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    description: chapter.description,
    // Search spans both guides, and each numbers its chapters from zero, so a
    // result is ambiguous without saying which guide it came from.
    track: trackTitles.get(chapter.track) || '',
    headings: chapter.blocks
      .filter((block): block is Extract<GuideBlock, { type: 'heading' }> => block.type === 'heading')
      .map((block) => block.text),
  }));
}
