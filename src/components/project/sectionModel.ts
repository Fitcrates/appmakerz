import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import type { Language } from '@/lib/language';

/**
 * Normalizes what Sanity returns into the list the page renders, and derives
 * the in-page navigation from it.
 *
 * Projects authored before the section builder existed only have `body`. Those
 * are wrapped into a single rich text section, so old pages get the new frame,
 * the in-page navigation and the new typography without a content migration.
 */

export type SectionWidth = 'narrow' | 'wide' | 'full';
export type SectionTone = 'plain' | 'panel' | 'accent';

/** A `{ en, pl }` object, or a plain string on older documents. */
export type LocalizedValue = string | { en?: string; pl?: string } | undefined;

export interface SanityImageValue {
  _key?: string;
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
}

/** Minimal shape of the Portable Text blocks this module inspects. */
export interface PortableBlock {
  _type?: string;
  style?: string;
  children?: Array<{ text?: string }>;
}

/** The fields of a project document this module reads. */
export interface ProjectDocumentLike {
  sections?: unknown;
  body?: unknown;
}

export interface SectionItem {
  _key?: string;
  title?: LocalizedValue;
  description?: LocalizedValue;
  meta?: LocalizedValue;
  label?: LocalizedValue;
  question?: LocalizedValue;
  answer?: LocalizedValue;
  value?: string;
  items?: string[];
}

export interface ProjectSection {
  _key: string;
  _type: string;
  anchor: string;
  hideFromToc?: boolean;
  width: SectionWidth;
  tone: SectionTone;
  // Section payloads differ per type; the renderer reads them by name.
  [key: string]: any;
}

export interface TocEntry {
  id: string;
  label: string;
  /** Nested headings pulled out of rich text, rendered one level in. */
  level: 1 | 2;
}

const SLUG_MAP: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => SLUG_MAP[char] || char)
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function uniqueAnchor(candidate: string, used: Set<string>, fallback: string): string {
  const base = candidate || fallback;
  let anchor = base;
  let suffix = 2;

  while (used.has(anchor)) {
    anchor = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(anchor);
  return anchor;
}

/** Plain text of a Portable Text block, used for headings. */
function blockToText(block: PortableBlock): string {
  if (!block || block._type !== 'block' || !Array.isArray(block.children)) {
    return '';
  }

  return block.children
    .map((child) => (typeof child?.text === 'string' ? child.text : ''))
    .join('')
    .trim();
}

/** Section titles used when a section carries no heading of its own. */
const FALLBACK_LABELS: Record<string, { en: string; pl: string }> = {
  projectMetricStrip: { en: 'Results', pl: 'Wyniki' },
  projectTechStack: { en: 'Tech stack', pl: 'Stack' },
  projectTimeline: { en: 'Process', pl: 'Proces' },
  projectFaq: { en: 'FAQ', pl: 'FAQ' },
  projectQuote: { en: 'Quote', pl: 'Opinia' },
  projectMediaBlock: { en: 'Gallery', pl: 'Galeria' },
};

export function normalizeSections(project: ProjectDocumentLike, language: Language): ProjectSection[] {
  const authored: ProjectSection[] = Array.isArray(project?.sections) ? project.sections : [];
  const used = new Set<string>();

  if (authored.length) {
    return authored
      .filter((section) => section && section._type)
      .map((section, index) => {
        const heading = getLocalizedText(section.heading, language);
        const eyebrow = getLocalizedText(section.eyebrow, language);
        const explicit = typeof section.anchor === 'string' ? section.anchor.trim() : '';
        const fallback = FALLBACK_LABELS[section._type];
        const fallbackLabel = fallback ? fallback[language] || fallback.en : '';
        const anchor = uniqueAnchor(
          explicit || slugifyHeading(heading || eyebrow || fallbackLabel),
          used,
          `section-${index + 1}`
        );

        return {
          ...section,
          _key: section._key || `section-${index}`,
          anchor,
          width: (section.width as SectionWidth) || 'narrow',
          tone: (section.tone as SectionTone) || 'plain',
        };
      });
  }

  const legacyBody = getLocalizedArray<PortableBlock>(project?.body, language);

  if (!legacyBody.length) {
    return [];
  }

  return [
    {
      _key: 'legacy-body',
      _type: 'projectRichText',
      anchor: uniqueAnchor('overview', used, 'overview'),
      width: 'narrow',
      tone: 'plain',
      lead: true,
      // Rendered through the same path as authored rich text.
      resolvedBody: legacyBody,
    },
  ];
}

/**
 * In-page navigation. Section headings are top level; H2s found inside rich
 * text nest under them, which is what makes long legacy pages navigable
 * without touching their content.
 */
export function buildToc(sections: ProjectSection[], language: Language): TocEntry[] {
  const entries: TocEntry[] = [];
  const used = new Set<string>(sections.map((section) => section.anchor));

  sections.forEach((section) => {
    // A CTA is a destination, not a place in the argument - never list it.
    if (section.hideFromToc || section._type === 'projectCtaBand') {
      return;
    }

    const heading = getLocalizedText(section.heading, language);
    const eyebrow = getLocalizedText(section.eyebrow, language);
    const fallback = FALLBACK_LABELS[section._type];
    const label = heading || eyebrow || (fallback ? fallback[language] || fallback.en : '');

    if (label) {
      entries.push({ id: section.anchor, label, level: 1 });
    }

    const body = (section.resolvedBody || getLocalizedArray<PortableBlock>(section.body, language)) as PortableBlock[];

    if (!Array.isArray(body)) {
      return;
    }

    body.forEach((block) => {
      if (block?._type !== 'block' || (block.style !== 'h2' && block.style !== 'h1')) {
        return;
      }

      const text = blockToText(block);

      if (!text) {
        return;
      }

      entries.push({
        id: uniqueAnchor(slugifyHeading(text), used, `${section.anchor}-heading`),
        label: text,
        level: label ? 2 : 1,
      });
    });
  });

  return entries;
}

/**
 * Anchor ids for rich text headings, keyed by heading text so the renderer and
 * the navigation agree. Built from the same pass as `buildToc`.
 */
export function buildHeadingAnchors(sections: ProjectSection[], language: Language): Map<string, string> {
  const map = new Map<string, string>();
  const toc = buildToc(sections, language);
  const sectionAnchors = new Set(sections.map((section) => section.anchor));

  toc.forEach((entry) => {
    if (!sectionAnchors.has(entry.id)) {
      map.set(entry.label, entry.id);
    }
  });

  return map;
}

export const SECTION_WIDTH_CLASS: Record<SectionWidth, string> = {
  narrow: 'max-w-3xl',
  wide: 'max-w-6xl',
  full: 'max-w-7xl',
};

export const SECTION_TONE_CLASS: Record<SectionTone, string> = {
  plain: '',
  panel: 'bg-white/[0.02] border-y border-white/[0.06]',
  accent: 'bg-teal-300/[0.035] border-y border-teal-300/10',
};
