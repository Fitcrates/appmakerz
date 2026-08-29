import { PortableText, type PortableTextBlock } from '@portabletext/react';
import { ArrowUpRight, Check, Quote as QuoteIcon } from 'lucide-react';
import FaqAccordionList from '@/components/next/FaqAccordionList';
import { createProjectPortableTextComponents } from '@/components/project/ProjectPortableText';
import { TechBadgeList } from '@/components/project/TechBadge';
import {
  SECTION_TONE_CLASS,
  SECTION_WIDTH_CLASS,
  type ProjectSection,
  type SanityImageValue,
  type SectionItem,
} from '@/components/project/sectionModel';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { getImageAlt } from '@/lib/image-alt';
import { localizedPath } from '@/lib/i18n-routing';
import { urlFor } from '@/lib/sanity.server';
import type { Language } from '@/lib/language';

interface ProjectSectionsProps {
  sections: ProjectSection[];
  headingAnchors: Map<string, string>;
  language: Language;
}

/** Sections that lay out their own heading and skip the standard frame header. */
const SELF_HEADED = new Set(['projectCtaBand']);

export default function ProjectSections({ sections, headingAnchors, language }: ProjectSectionsProps) {
  const components = createProjectPortableTextComponents(headingAnchors);
  let headingIndex = 0;

  return (
    <>
      {sections.map((section) => {
        const numbered = Boolean(getLocalizedText(section.heading, language)) && !SELF_HEADED.has(section._type);

        if (numbered) {
          headingIndex += 1;
        }

        return (
          <SectionFrame key={section._key} section={section} language={language} index={numbered ? headingIndex : 0}>
            <SectionBody section={section} language={language} components={components} />
          </SectionFrame>
        );
      })}
    </>
  );
}

/* ── Frame ──────────────────────────────────────────────────────────────── */

function SectionFrame({
  section,
  language,
  index,
  children,
}: {
  section: ProjectSection;
  language: Language;
  index: number;
  children: React.ReactNode;
}) {
  const eyebrow = getLocalizedText(section.eyebrow, language);
  const heading = SELF_HEADED.has(section._type) ? '' : getLocalizedText(section.heading, language);

  return (
    <section
      id={section.anchor}
      className={`scroll-mt-24 py-14 lg:py-20 ${SECTION_TONE_CLASS[section.tone] || ''}`}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${SECTION_WIDTH_CLASS[section.width] || SECTION_WIDTH_CLASS.narrow}`}>
        {eyebrow || heading ? (
          <header className="mb-10 lg:mb-12">
            {eyebrow ? (
              <span className="block text-xs tracking-[0.3em] uppercase text-teal-300/70 font-plex mb-3">
                {eyebrow}
              </span>
            ) : null}

            {heading ? (
              <>
                <div className="flex items-baseline gap-4">
                  {index > 0 ? (
                    <span className="text-sm font-oxanium text-white/25 notranslate" aria-hidden="true">
                      {String(index).padStart(2, '0')}
                    </span>
                  ) : null}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-oxanium text-white leading-tight">
                    {heading}
                  </h2>
                </div>
                <div className="mt-5 h-px bg-gradient-to-r from-teal-300/40 via-white/10 to-transparent" />
              </>
            ) : null}
          </header>
        ) : null}

        {children}
      </div>
    </section>
  );
}

/* ── Dispatcher ─────────────────────────────────────────────────────────── */

function SectionBody({
  section,
  language,
  components,
}: {
  section: ProjectSection;
  language: Language;
  components: ReturnType<typeof createProjectPortableTextComponents>;
}) {
  switch (section._type) {
    case 'projectRichText':
      return <RichTextSection section={section} language={language} components={components} />;
    case 'projectSplitFeature':
      return <SplitFeatureSection section={section} language={language} components={components} />;
    case 'projectBulletGrid':
      return <BulletGridSection section={section} language={language} />;
    case 'projectMediaBlock':
      return <MediaSection section={section} language={language} />;
    case 'projectMetricStrip':
      return <MetricSection section={section} language={language} />;
    case 'projectTimeline':
      return <TimelineSection section={section} language={language} />;
    case 'projectTechStack':
      return <TechStackSection section={section} language={language} />;
    case 'projectQuote':
      return <QuoteSection section={section} language={language} />;
    case 'projectFaq':
      return <FaqSection section={section} language={language} />;
    case 'projectCtaBand':
      return <CtaSection section={section} language={language} />;
    default:
      return null;
  }
}

/* ── Sections ───────────────────────────────────────────────────────────── */

function RichTextSection({
  section,
  language,
  components,
}: {
  section: ProjectSection;
  language: Language;
  components: ReturnType<typeof createProjectPortableTextComponents>;
}) {
  const body = section.resolvedBody || getLocalizedArray(section.body, language);

  if (!body.length) {
    return null;
  }

  const leadClass = section.lead
    ? '[&>p:first-child]:text-xl [&>p:first-child]:lg:text-[1.375rem] [&>p:first-child]:text-white/85 [&>p:first-child]:leading-relaxed [&>p:first-child]:mb-8'
    : '';

  return (
    <div className={leadClass}>
      <PortableText value={body} components={components} />
    </div>
  );
}

function SplitFeatureSection({
  section,
  language,
  components,
}: {
  section: ProjectSection;
  language: Language;
  components: ReturnType<typeof createProjectPortableTextComponents>;
}) {
  const body = getLocalizedArray<PortableTextBlock>(section.body, language);
  const hasMedia = Boolean(section.media?.asset?._ref);
  const mediaFirst = section.mediaPosition === 'left';

  if (!hasMedia) {
    return body.length ? <PortableText value={body} components={components} /> : null;
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div className={`lg:col-span-7 ${mediaFirst ? 'lg:order-2' : ''}`}>
        <PortableText value={body} components={components} />
      </div>

      <figure className={`lg:col-span-5 ${mediaFirst ? 'lg:order-1' : ''} ${section.sticky === false ? '' : 'lg:sticky lg:top-28'}`}>
        <img
          src={urlFor(section.media).width(900).auto('format').quality(80).fit('max').url()}
          alt={getImageAlt(section.media, getLocalizedText(section.heading, language))}
          className="w-full h-auto border border-white/10"
          loading="lazy"
          decoding="async"
        />
        {section.media?.caption ? (
          <figcaption className="mt-3 text-sm text-white/45 font-plex">{section.media.caption}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}

function BulletGridSection({ section, language }: { section: ProjectSection; language: Language }) {
  const items: SectionItem[] = Array.isArray(section.items) ? section.items : [];
  const intro = getLocalizedText(section.intro, language);

  if (!items.length) {
    return null;
  }

  const columns = section.columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : section.columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <>
      {intro ? <p className="mb-10 max-w-2xl text-white/70 font-light font-plex text-lg leading-relaxed">{intro}</p> : null}

      <div className={`grid ${columns} gap-px bg-white/[0.06] border border-white/[0.06]`}>
        {items.map((item, index) => (
          <div
            key={item._key || index}
            className="group relative bg-indigo-950 p-6 lg:p-8 transition-colors duration-500 hover:bg-white/[0.03]"
          >
            <div className="absolute top-0 left-0 h-px w-0 bg-teal-300/60 transition-all duration-500 group-hover:w-12" />
            <div className="absolute top-0 left-0 w-px h-0 bg-teal-300/60 transition-all duration-500 group-hover:h-12" />

            {section.marker === 'check' ? (
              <Check className="mb-5 h-5 w-5 text-teal-300" aria-hidden="true" />
            ) : section.marker === 'none' ? null : (
              <span className="mb-5 block text-3xl font-extralight font-oxanium text-teal-300/40 notranslate transition-colors duration-500 group-hover:text-teal-300/80">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}

            <h3 className="text-lg font-normal font-oxanium text-white mb-3">
              {getLocalizedText(item.title, language)}
            </h3>
            <p className="text-white/60 font-light font-plex leading-relaxed transition-colors duration-500 group-hover:text-white/80">
              {getLocalizedText(item.description, language)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function MediaSection({ section, language }: { section: ProjectSection; language: Language }) {
  const images: SanityImageValue[] = Array.isArray(section.images)
    ? section.images.filter((image: SanityImageValue) => image?.asset?._ref)
    : [];
  const caption = getLocalizedText(section.caption, language);
  const videoUrl: string = section.videoUrl || '';
  const isInlineVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl);
  const columns = section.columns === 3 ? 'sm:grid-cols-3' : section.columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1';

  if (!images.length && !videoUrl) {
    return null;
  }

  return (
    <figure>
      {isInlineVideo ? (
        <div className="border border-white/10 bg-black/40">
          <video className="w-full" controls preload="metadata" playsInline>
            <source src={videoUrl} />
          </video>
        </div>
      ) : null}

      {images.length ? (
        <div className={`grid ${columns} gap-4 ${isInlineVideo ? 'mt-4' : ''}`}>
          {images.map((image, index) => (
            <MediaFrame key={image._key || index} image={image} framed={section.frame === 'browser'} />
          ))}
        </div>
      ) : null}

      {!isInlineVideo && videoUrl ? (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors font-plex"
        >
          {language === 'pl' ? 'Zobacz wideo' : 'Watch the video'}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : null}

      {caption ? <figcaption className="mt-4 text-sm text-white/45 font-plex">{caption}</figcaption> : null}
    </figure>
  );
}

function MediaFrame({ image, framed }: { image: SanityImageValue; framed: boolean }) {
  const img = (
    <img
      src={urlFor(image).width(1600).auto('format').quality(80).fit('max').url()}
      alt={getImageAlt(image, image?.caption || 'Project image')}
      className="w-full h-auto"
      loading="lazy"
      decoding="async"
    />
  );

  if (!framed) {
    return (
      <div className="border border-white/10">
        {img}
        {image?.caption ? <p className="px-4 py-3 text-sm text-white/45 font-plex border-t border-white/10">{image.caption}</p> : null}
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 h-1.5 flex-1 max-w-[220px] rounded-full bg-white/[0.07]" />
      </div>
      {img}
      {image?.caption ? <p className="px-4 py-3 text-sm text-white/45 font-plex border-t border-white/10">{image.caption}</p> : null}
    </div>
  );
}

function MetricSection({ section, language }: { section: ProjectSection; language: Language }) {
  const items: SectionItem[] = Array.isArray(section.items) ? section.items : [];

  if (!items.length) {
    return null;
  }

  const columns = items.length >= 4 ? 'grid-cols-2 lg:grid-cols-4' : items.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${columns} gap-px bg-white/[0.08] border border-white/[0.08]`}>
      {items.map((item, index) => (
        <div key={item._key || index} className="bg-indigo-950 px-6 py-8 lg:py-10">
          <p className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-teal-300 notranslate">
            {item.value}
          </p>
          <p className="mt-3 text-sm text-white/50 font-plex leading-relaxed">
            {getLocalizedText(item.label, language)}
          </p>
        </div>
      ))}
    </div>
  );
}

function TimelineSection({ section, language }: { section: ProjectSection; language: Language }) {
  const steps: SectionItem[] = Array.isArray(section.steps) ? section.steps : [];

  if (!steps.length) {
    return null;
  }

  return (
    <ol className="relative border-l border-white/10 ml-3">
      {steps.map((step, index) => (
        <li key={step._key || index} className="group relative pl-8 pb-10 last:pb-0">
          <span
            className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rotate-45 border border-teal-300/60 bg-indigo-950 transition-colors duration-500 group-hover:bg-teal-300"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-lg font-normal font-oxanium text-white">
              {getLocalizedText(step.title, language)}
            </h3>
            {getLocalizedText(step.meta, language) ? (
              <span className="text-xs tracking-[0.2em] uppercase text-teal-300/60 font-plex">
                {getLocalizedText(step.meta, language)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-white/60 font-light font-plex leading-relaxed max-w-2xl">
            {getLocalizedText(step.description, language)}
          </p>
        </li>
      ))}
    </ol>
  );
}

function TechStackSection({ section, language }: { section: ProjectSection; language: Language }) {
  const groups: SectionItem[] = Array.isArray(section.groups) ? section.groups : [];
  const intro = getLocalizedText(section.intro, language);

  if (!groups.length) {
    return null;
  }

  return (
    <>
      {intro ? <p className="mb-10 max-w-2xl text-white/70 font-light font-plex text-lg leading-relaxed">{intro}</p> : null}

      <div className="space-y-8">
        {groups.map((group, index) => {
          const items: string[] = Array.isArray(group.items) ? group.items : [];

          if (!items.length) {
            return null;
          }

          return (
            <div key={group._key || index} className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <p className="text-xs tracking-[0.25em] uppercase text-white/35 font-plex sm:pt-2.5">
                {getLocalizedText(group.label, language)}
              </p>
              <TechBadgeList items={items} size="md" tone="always" />
            </div>
          );
        })}
      </div>
    </>
  );
}

function QuoteSection({ section, language }: { section: ProjectSection; language: Language }) {
  const quote = getLocalizedText(section.quote, language);

  if (!quote) {
    return null;
  }

  const role = getLocalizedText(section.role, language);

  return (
    <figure className="relative">
      <QuoteIcon className="h-8 w-8 text-teal-300/30 mb-6" aria-hidden="true" />
      <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light font-oxanium text-white/90 leading-snug">
        {quote}
      </blockquote>

      {section.author || role ? (
        <figcaption className="mt-8 flex items-center gap-4">
          {section.avatar?.asset?._ref ? (
            <img
              src={urlFor(section.avatar).width(96).height(96).fit('crop').auto('format').url()}
              alt={getImageAlt(section.avatar, section.author || 'Author')}
              className="h-12 w-12 border border-white/10 object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div>
            {section.author ? <p className="text-white font-plex">{section.author}</p> : null}
            {role ? <p className="text-sm text-white/45 font-plex">{role}</p> : null}
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}

function FaqSection({ section, language }: { section: ProjectSection; language: Language }) {
  const items: SectionItem[] = Array.isArray(section.items) ? section.items : [];

  const resolved = items
    .map((item) => ({
      question: getLocalizedText(item.question, language),
      answer: getLocalizedText(item.answer, language),
    }))
    .filter((item) => item.question && item.answer);

  if (!resolved.length) {
    return null;
  }

  return <FaqAccordionList items={resolved} />;
}

function CtaSection({ section, language }: { section: ProjectSection; language: Language }) {
  const heading = getLocalizedText(section.heading, language);
  const text = getLocalizedText(section.text, language);
  const label = getLocalizedText(section.buttonLabel, language, language === 'pl' ? 'Skontaktuj się' : 'Get in touch');
  const href: string = section.href || localizedPath(language, '/#contact');
  const isExternal = href.startsWith('http');

  return (
    <div className="text-center">
      {heading ? (
        <p className="text-2xl sm:text-3xl lg:text-4xl font-light font-oxanium text-white leading-tight">{heading}</p>
      ) : null}
      {text ? (
        <p className="mt-5 mx-auto max-w-2xl text-white/65 font-light font-plex text-lg leading-relaxed">{text}</p>
      ) : null}

      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="group relative mt-10 inline-flex min-w-[230px] items-center justify-center overflow-hidden bg-teal-300 px-10 py-5 text-center font-normal text-indigo-950 transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
      >
        <span className="relative z-10">{label}</span>
        <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
      </a>
    </div>
  );
}

