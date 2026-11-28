import type { ReactNode } from 'react';
import { PortableText, type PortableTextBlockComponent, type PortableTextComponents } from '@portabletext/react';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import type { Language } from '@/lib/language';
import DecisionChecklist from './DecisionChecklist';
import MarketplaceMoneyFlow from './MarketplaceMoneyFlow';

// The service pages keep their long-form copy in one Portable Text field. Shown
// as a single prose column it read as a wall of text, so this splits it at each
// h2 and picks a layout per section from what the section contains: a short
// section becomes a statement, h3 groups become tiles, lists become cards or
// pills. Editors keep writing plain text in Sanity; nothing here needs new
// fields. A few sections are matched by block key (language segment removed)
// to add a diagram or an interactive version of their list.

type Span = { _type: string; text?: string; marks?: string[] };
type Block = {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Span[];
  markDefs?: unknown[];
};

interface Section {
  id: string;
  heading: Block | null;
  blocks: Block[];
}

type Segment = { kind: 'blocks'; blocks: Block[] } | { kind: 'list'; items: Block[] };

const NUMBERED_SECTIONS = new Set(['h-own', 'h-mistakes']);

const baseBlocks = portableTextComponentsServer.block as Record<string, PortableTextBlockComponent>;

// The spotlight draws its glow from a plain-text copy of the paragraph laid
// over the original, so it only lines up when every run has the same glyph
// widths. Links qualify (same font, only underlined); bold switches to
// Oxanium and italics change widths, so those paragraphs render without it.
function canSpotlight(block: Block) {
  const linkKeys = new Set(
    ((block.markDefs || []) as Array<{ _key?: string; _type?: string }>)
      .filter((def) => def._type === 'link')
      .map((def) => def._key)
  );
  return (block.children || []).every((child) => (child.marks || []).every((mark) => linkKeys.has(mark)));
}

function paragraph(className: string): PortableTextBlockComponent {
  const Paragraph: PortableTextBlockComponent = ({ value, children }) =>
    canSpotlight(value as Block) ? (
      <SpotlightText as="p" className={className} glowSize={120}>{children}</SpotlightText>
    ) : (
      <p className={className}>{children}</p>
    );
  return Paragraph;
}

// Paragraphs carry no margins: the spotlight wraps each one in its own div,
// so spacing comes from the parent (space-y-*) instead.
const bodyComponents: PortableTextComponents = {
  ...portableTextComponentsServer,
  block: {
    ...baseBlocks,
    normal: paragraph('font-plex text-lg font-light leading-relaxed text-white/70!'),
    // A lone h3 inside a flowing section labels what follows (for example a
    // list of platforms), so it reads as a label rather than a heading.
    h3: ({ children }) => (
      <h3 className="pt-5 font-plex text-xs uppercase tracking-[0.25em] text-teal-300/80 first:pt-0">{children}</h3>
    ),
  },
};

const tileComponents: PortableTextComponents = {
  ...bodyComponents,
  block: {
    ...(bodyComponents.block as Record<string, PortableTextBlockComponent>),
    normal: paragraph('font-plex text-base font-light leading-relaxed text-white/65!'),
  },
};

const inlineComponents: PortableTextComponents = {
  ...portableTextComponentsServer,
  block: {
    ...baseBlocks,
    normal: ({ children }) => <>{children}</>,
  },
};

const statementComponents: PortableTextComponents = {
  ...portableTextComponentsServer,
  block: {
    ...baseBlocks,
    normal: paragraph('font-plex text-lg font-light leading-relaxed text-white/70! sm:text-xl/8'),
  },
};

const panelComponents: PortableTextComponents = {
  ...portableTextComponentsServer,
  block: {
    ...baseBlocks,
    normal: paragraph('font-plex text-base font-light leading-relaxed text-white/65!'),
  },
};

/** Portable Text with the paragraph spacing the components leave out. */
function Prose({ blocks, components, gap = 'space-y-5' }: { blocks: Block[]; components: PortableTextComponents; gap?: string }) {
  return (
    <div className={gap}>
      <PortableText value={blocks as never} components={components} />
    </div>
  );
}

export function normalizeKey(key?: string) {
  return (key || '').replace(/(^|-)(pl|en)-/, '$1');
}

function plainText(block: Block) {
  return (block.children || []).map((child) => child.text || '').join('');
}

function isPlain(block: Block) {
  return (block.children || []).every((child) => !child.marks?.length);
}

/**
 * Which heading level starts a section. Most copy uses h2 with h3 inside; some
 * older pages open with h3 and never use h2, and there h3 is the top level.
 */
function sectionLevel(blocks: Block[]): 'h2' | 'h3' | null {
  const headings = blocks.filter((block) => block._type === 'block');
  if (headings.some((block) => block.style === 'h2')) return 'h2';
  if (headings[0]?.style === 'h3') return 'h3';
  return null;
}

export function hasSectionHeadings(blocks: Block[]) {
  return sectionLevel(blocks) !== null;
}

/** Something a page adds to its copy: inside a section (below its text) or as a section of its own before one. */
export interface SectionExtra {
  match: RegExp;
  place: 'inside' | 'before';
  node: ReactNode;
}

function splitSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  const level = sectionLevel(blocks);
  let current: Section | null = null;

  blocks.forEach((block) => {
    if (block._type === 'block' && block.style === level) {
      current = { id: normalizeKey(block._key) || `s${sections.length + 1}`, heading: block, blocks: [] };
      sections.push(current);
      return;
    }
    if (!current) {
      current = { id: 'intro', heading: null, blocks: [] };
      sections.push(current);
    }
    current.blocks.push(block);
  });

  return sections;
}

function segment(blocks: Block[]): Segment[] {
  const segments: Segment[] = [];
  blocks.forEach((block) => {
    const last = segments[segments.length - 1];
    if (block._type === 'block' && block.listItem) {
      if (last?.kind === 'list') last.items.push(block);
      else segments.push({ kind: 'list', items: [block] });
      return;
    }
    if (last?.kind === 'blocks') last.blocks.push(block);
    else segments.push({ kind: 'blocks', blocks: [block] });
  });
  return segments;
}

function isStatement(section: Section) {
  return (
    section.heading !== null &&
    section.blocks.length > 0 &&
    section.blocks.length <= 2 &&
    section.blocks.every((block) => block._type === 'block' && (block.style || 'normal') === 'normal' && !block.listItem)
  );
}

function h3Count(section: Section) {
  return section.blocks.filter((block) => block._type === 'block' && block.style === 'h3').length;
}

function hasCustomTypes(section: Section) {
  return section.blocks.some((block) => block._type !== 'block');
}

/** "Title - description" or "Title. Description" → separate parts, when the item is plain text. */
function splitItem(block: Block): { title?: string; body: string } | null {
  if (!isPlain(block)) return null;
  const text = plainText(block);
  const match = text.match(/^(.{3,80}?)(?: [-–] |\. )([\s\S]+)$/);
  return match ? { title: match[1], body: match[2] } : { body: text };
}

/** Titles only when most items have one; a list where two of seven items get a bold lead reads as uneven. */
function titlesFit(items: Block[]) {
  const titled = items.filter((item) => splitItem(item)?.title).length;
  return titled >= Math.ceil(items.length * 0.75);
}

function ListItemContent({ block, titleClass, bodyClass, split = true }: { block: Block; titleClass: string; bodyClass: string; split?: boolean }) {
  const parts = split ? splitItem(block) : isPlain(block) ? { body: plainText(block) } : null;
  if (!parts) {
    const inline = <PortableText key="inline" value={{ ...block, listItem: undefined, level: undefined } as never} components={inlineComponents} />;
    return canSpotlight(block)
      ? <SpotlightText className={bodyClass} glowSize={110}>{[inline]}</SpotlightText>
      : <span className={bodyClass}>{inline}</span>;
  }
  return (
    <>
      {parts.title ? <SpotlightText className={titleClass} glowSize={110}>{parts.title}</SpotlightText> : null}
      <SpotlightText className={bodyClass} glowSize={110}>{parts.body}</SpotlightText>
    </>
  );
}

/** One line, title and description in two tones, under one spotlight. */
function CompactItem({ block, split }: { block: Block; split: boolean }) {
  const parts = split ? splitItem(block) : null;
  if (!parts?.title) {
    return <ListItemContent block={block} split={false} titleClass="" bodyClass="font-light text-white/70!" />;
  }
  return (
    <SpotlightText className="font-light text-white/60!" glowSize={110}>
      {[<span key="t" className="font-normal text-white/90">{parts.title}</span>, ' · ', parts.body]}
    </SpotlightText>
  );
}

function ListView({ items, variant }: { items: Block[]; variant: 'cards' | 'numbered' | 'pills' | 'compact' }) {
  const split = titlesFit(items);
  if (variant === 'pills') {
    return (
      <ul className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={item._key || index} className="rounded-full bg-white/[0.06] px-4 py-2">
            <SpotlightText className="font-plex text-sm text-white/80!" glowSize={70}>{plainText(item)}</SpotlightText>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'numbered') {
    return (
      <ol className="border-t border-white/10">
        {items.map((item, index) => (
          <li key={item._key || index} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-white/10 py-5">
            <span className="pt-0.5 font-plex text-sm text-teal-300">{String(index + 1).padStart(2, '0')}</span>
            <span className="flex flex-col gap-1.5">
              <ListItemContent
                block={item}
                split={split}
                titleClass="font-oxanium text-lg text-white!"
                bodyClass="font-plex text-base font-light leading-relaxed text-white/70!"
              />
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (variant === 'compact') {
    return (
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item._key || index} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-2.5 font-plex text-[0.95rem] leading-relaxed">
            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-teal-300" aria-hidden="true" />
            <CompactItem block={item} split={split} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={item._key || index} className="ac-card ac-card--sm flex flex-col gap-2 p-5">
          <ListItemContent
            block={item}
            split={split}
            titleClass="font-oxanium text-lg leading-snug text-white!"
            bodyClass="font-plex text-base font-light leading-relaxed text-white/65!"
          />
        </li>
      ))}
    </ul>
  );
}

function pickListVariant(sectionId: string, items: Block[]) {
  if (NUMBERED_SECTIONS.has(sectionId)) return 'numbered' as const;
  if (items.every((item) => isPlain(item) && plainText(item).length <= 40)) return 'pills' as const;
  return 'cards' as const;
}

function Body({ section, blocks, components = bodyComponents }: { section: Section; blocks: Block[]; components?: PortableTextComponents }) {
  return (
    <div className="space-y-6">
      {segment(blocks).map((part, index) =>
        part.kind === 'list' ? (
          <ListView key={index} items={part.items} variant={pickListVariant(section.id, part.items)} />
        ) : (
          <Prose key={index} blocks={part.blocks} components={components} />
        )
      )}
    </div>
  );
}

function SectionHeading({ block, className = '' }: { block: Block; className?: string }) {
  return (
    <BurnSpotlightText
      as="h2"
      className={`font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl/tight lg:text-5xl/tight ${className}`}
      glowSize={180}
      baseDelay={100}
      charDelay={30}
    >
      {plainText(block)}
    </BurnSpotlightText>
  );
}

function SectionShell({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={`sekcja-${id}`} className="scroll-mt-28 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

const centeredComponents: PortableTextComponents = {
  ...portableTextComponentsServer,
  block: {
    ...baseBlocks,
    normal: paragraph('font-plex text-lg font-light leading-relaxed text-white/70! sm:text-xl/8'),
    h3: ({ children }) => (
      <h3 className="pt-4 font-plex text-xs uppercase tracking-[0.25em] text-teal-300/80">{children}</h3>
    ),
  },
};

function textBlocks(part: Segment) {
  return part.kind === 'blocks' ? part.blocks : [];
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Heading and opening text, centred in one column. */
function CenteredIntro({ section, lead }: { section: Section; lead: Block[] }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {section.heading ? <SectionHeading block={section.heading} className="mb-6" /> : null}
      {lead.length ? <div className="text-left"><Prose blocks={lead} components={centeredComponents} /></div> : null}
    </div>
  );
}

/** Closing text under a section, centred. */
function CenteredOutro({ blocks }: { blocks: Block[] }) {
  if (!blocks.length) return null;
  return (
    <div className="mx-auto mt-12 max-w-3xl">
      <Prose blocks={blocks} components={centeredComponents} />
    </div>
  );
}

/** Short plain items as numbered cards on a grid, instead of pills in a line of text. */
function PointGrid({ items }: { items: Block[] }) {
  const columns = items.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : items.length % 3 === 0 || items.length > 4 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2';
  return (
    <ul className={`grid gap-4 ${columns}`}>
      {items.map((item, index) => (
        <li key={item._key || index} className="ac-card flex flex-col gap-4 p-6">
          <span className="font-plex text-xs text-teal-300">{String(index + 1).padStart(2, '0')}</span>
          <SpotlightText className="font-oxanium text-lg leading-snug text-white!" glowSize={110}>
            {capitalize(plainText(item))}
          </SpotlightText>
        </li>
      ))}
    </ul>
  );
}

function isShortList(items: Block[]) {
  return items.every((item) => isPlain(item) && plainText(item).length <= 70);
}

/**
 * A text section with at most one list. Heading and opening text sit in a
 * centred column; the list leaves the line of text and becomes its own row of
 * cards across the full width, with whatever follows it centred below. The
 * sentence that introduces the list ("I focus on:") stays directly above it.
 */
function FeatureSection({ section, extra }: { section: Section; extra?: ReactNode }) {
  const parts = segment(section.blocks);
  const listIndex = parts.findIndex((part) => part.kind === 'list');

  if (listIndex === -1) {
    return (
      <SectionShell id={section.id}>
        <CenteredIntro section={section} lead={section.blocks} />
        {extra ? <div className="mt-12 lg:mt-16">{extra}</div> : null}
      </SectionShell>
    );
  }

  const lead = parts.slice(0, listIndex).flatMap(textBlocks);
  const items = (parts[listIndex] as { kind: 'list'; items: Block[] }).items;
  const after = parts.slice(listIndex + 1).flatMap(textBlocks);
  const variant = pickListVariant(section.id, items);

  return (
    <SectionShell id={section.id}>
      <CenteredIntro section={section} lead={lead} />
      <div className={`mt-10 ${variant === 'numbered' ? 'mx-auto max-w-4xl' : ''}`}>
        {variant === 'numbered' || !isShortList(items) ? <ListView items={items} variant={variant === 'pills' ? 'cards' : variant} /> : <PointGrid items={items} />}
      </div>
      <CenteredOutro blocks={after} />
      {extra ? <div className="mt-12 lg:mt-16">{extra}</div> : null}
    </SectionShell>
  );
}

/**
 * A text section with two or more lists reads as stages: each list with the
 * sentence that introduces it becomes a numbered column. Text before the first
 * introducing sentence is the section lead; text between a list and the next
 * introducing sentence closes the previous stage; text after the last list
 * closes the section.
 */
function PhasesSection({ section, extra }: { section: Section; extra?: ReactNode }) {
  const parts = segment(section.blocks);
  const lead: Block[] = [];
  const phases: Array<{ intro: Block[]; items: Block[]; after: Block[] }> = [];
  let pending: Block[] = [];

  parts.forEach((part) => {
    if (part.kind === 'blocks') {
      pending = pending.concat(part.blocks);
      return;
    }
    const intro = pending.slice(-1);
    const before = pending.slice(0, -1);
    if (phases.length) phases[phases.length - 1].after.push(...before);
    else lead.push(...before);
    phases.push({ intro, items: part.items, after: [] });
    pending = [];
  });

  const columns = phases.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2';

  return (
    <SectionShell id={section.id}>
      <CenteredIntro section={section} lead={lead} />
      <ol className={`mt-12 grid gap-4 ${columns}`}>
        {phases.map((phase, index) => (
          <li key={index} className="ac-card flex flex-col gap-5 p-6 sm:p-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-300/12 font-plex text-sm text-teal-200">
              {String(index + 1).padStart(2, '0')}
            </span>
            {phase.intro.length ? <Prose blocks={phase.intro} components={tileComponents} gap="space-y-3" /> : null}
            <ul className="flex flex-wrap gap-2">
              {phase.items.map((item, itemIndex) => (
                <li key={item._key || itemIndex} className="rounded-full bg-white/[0.06] px-3.5 py-1.5">
                  <SpotlightText className="font-plex text-sm text-white/85!" glowSize={70}>{capitalize(plainText(item))}</SpotlightText>
                </li>
              ))}
            </ul>
            {phase.after.length ? <Prose blocks={phase.after} components={tileComponents} gap="space-y-3" /> : null}
          </li>
        ))}
      </ol>
      <CenteredOutro blocks={pending} />
      {extra ? <div className="mt-12 lg:mt-16">{extra}</div> : null}
    </SectionShell>
  );
}

function WideSection({ section }: { section: Section }) {
  return (
    <SectionShell id={section.id}>
      <div className="max-w-4xl">
        {section.heading ? <SectionHeading block={section.heading} className="mb-8" /> : null}
      </div>
      <div className="min-w-0">
        <Body section={section} blocks={section.blocks} />
      </div>
    </SectionShell>
  );
}

function TilesSection({ section, language }: { section: Section; language: Language }) {
  const firstH3 = section.blocks.findIndex((block) => block._type === 'block' && block.style === 'h3');
  const lead = section.blocks.slice(0, firstH3);
  const tiles: Array<{ heading: Block; blocks: Block[] }> = [];
  section.blocks.slice(firstH3).forEach((block) => {
    if (block._type === 'block' && block.style === 'h3') tiles.push({ heading: block, blocks: [] });
    else tiles[tiles.length - 1].blocks.push(block);
  });
  const columns = tiles.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2';

  return (
    <SectionShell id={section.id}>
      <div className="max-w-3xl">
        {section.heading ? <SectionHeading block={section.heading} className="mb-6" /> : null}
        {lead.length ? <Body section={section} blocks={lead} components={statementComponents} /> : null}
      </div>

      {section.id === 'h-areas' ? <MarketplaceMoneyFlow language={language} /> : null}

      <div className={`mt-12 grid gap-4 ${columns}`}>
        {tiles.map((tile, index) => (
          <article key={tile.heading._key || index} className="ac-card flex flex-col p-6 sm:p-8">
            <span className="mb-4 font-plex text-xs text-teal-300">{String(index + 1).padStart(2, '0')}</span>
            <SpotlightText as="h3" className="mb-4 font-oxanium text-xl font-light text-white! sm:text-2xl" glowSize={120}>
              {plainText(tile.heading)}
            </SpotlightText>
            <div className="space-y-5">
              {segment(tile.blocks).map((part, partIndex) =>
                part.kind === 'list' ? (
                  <ListView key={partIndex} items={part.items} variant="compact" />
                ) : (
                  <Prose key={partIndex} blocks={part.blocks} components={tileComponents} gap="space-y-4" />
                )
              )}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function StatementSection({ section }: { section: Section }) {
  return (
    <SectionShell id={section.id}>
      <CenteredIntro section={section} lead={section.blocks} />
    </SectionShell>
  );
}

function StatementRow({ sections }: { sections: Section[] }) {
  const columns = sections.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2';
  return (
    <section className="py-16 lg:py-24">
      <div className={`mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:px-8 ${columns}`}>
        {sections.map((section) => (
          <article key={section.id} id={`sekcja-${section.id}`} className="ac-card scroll-mt-28 p-6 sm:p-8">
            {section.heading ? (
              <SpotlightText as="h2" className="mb-4 font-oxanium text-2xl font-light leading-snug text-white!" glowSize={120}>
                {plainText(section.heading)}
              </SpotlightText>
            ) : null}
            <Prose blocks={section.blocks} components={panelComponents} gap="space-y-4" />
          </article>
        ))}
      </div>
    </section>
  );
}

function DecisionsSection({ section, language }: { section: Section; language: Language }) {
  const listStart = section.blocks.findIndex((block) => block.listItem);
  const listEnd = section.blocks.findIndex((block, index) => index > listStart && !block.listItem);
  const lead = section.blocks.slice(0, listStart);
  const items = section.blocks.slice(listStart, listEnd === -1 ? undefined : listEnd).map(plainText);
  const note = listEnd === -1 ? [] : section.blocks.slice(listEnd);

  return (
    <SectionShell id={section.id}>
      <DecisionChecklist
        language={language}
        heading={section.heading ? plainText(section.heading) : ''}
        items={items}
        lead={lead.length ? <Prose blocks={lead} components={bodyComponents} /> : null}
        note={note.length ? <Prose blocks={note} components={panelComponents} gap="space-y-4" /> : null}
      />
    </SectionShell>
  );
}

export default function ServiceContentSections({
  blocks,
  language,
  extras = [],
}: {
  blocks: Block[];
  language: Language;
  extras?: SectionExtra[];
}) {
  const sections = splitSections(blocks);
  const output: ReactNode[] = [];
  const used = new Set<SectionExtra>();
  const peek = (section: Section, place: SectionExtra['place']) => {
    if (!section.heading) return undefined;
    const title = plainText(section.heading);
    return extras.find((entry) => entry.place === place && !used.has(entry) && entry.match.test(title));
  };
  const find = (section: Section, place: SectionExtra['place']) => {
    const extra = peek(section, place);
    if (extra) used.add(extra);
    return extra;
  };

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const before = find(section, 'before');
    if (before) output.push(<div key={`extra-${section.id}`}>{before.node}</div>);

    if (isStatement(section)) {
      const run = [section];
      while (index + 1 < sections.length && isStatement(sections[index + 1]) && !peek(sections[index + 1], 'before')) {
        run.push(sections[index + 1]);
        index += 1;
      }
      output.push(
        run.length > 1
          ? <StatementRow key={run[0].id} sections={run} />
          : <StatementSection key={section.id} section={section} />
      );
      continue;
    }

    const inside = find(section, 'inside');
    if (section.id === 'h-decisions' && section.blocks.some((block) => block.listItem)) {
      output.push(<DecisionsSection key={section.id} section={section} language={language} />);
    } else if (h3Count(section) >= 2) {
      output.push(<TilesSection key={section.id} section={section} language={language} />);
    } else if (hasCustomTypes(section)) {
      output.push(<WideSection key={section.id} section={section} />);
    } else {
      const listCount = segment(section.blocks).filter((part) => part.kind === 'list').length;
      output.push(
        listCount >= 2
          ? <PhasesSection key={section.id} section={section} extra={inside?.node} />
          : <FeatureSection key={section.id} section={section} extra={inside?.node} />
      );
    }
  }

  // A "before" extra whose section is missing in this language still shows, at the end.
  extras
    .filter((entry) => entry.place === 'before' && !used.has(entry))
    .forEach((entry, index) => output.push(<div key={`extra-end-${index}`}>{entry.node}</div>));

  return <div id="service-content">{output}</div>;
}
