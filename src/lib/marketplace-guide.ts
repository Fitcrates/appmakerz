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

export type GuideChapter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  blocks: GuideBlock[];
};

export type MarketplaceGuide = {
  language: Language;
  title: string;
  subtitle: string;
  description: string;
  reviewedAt: string;
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

export function getMarketplaceGuideNavigation(language: Language) {
  return guides[language].chapters.map((chapter) => ({
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    description: chapter.description,
    headings: chapter.blocks
      .filter((block): block is Extract<GuideBlock, { type: 'heading' }> => block.type === 'heading')
      .map((block) => block.text),
  }));
}
