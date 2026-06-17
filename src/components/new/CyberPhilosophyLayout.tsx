'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';
import PrefetchLink from '@/components/next/PrefetchLink';
import FloatingLines from '@/components/new/FloatingLines';
import PhilosophyProcess from '@/components/new/PhilosophyProcess';
import PhilosophyTiltCard from '@/components/new/PhilosophyTiltCard';
import SpotlightText from '@/components/new/SpotlightText';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import type { PhilosophyProcessStep } from '@/components/new/PhilosophyProcess';

gsap.registerPlugin(ScrollTrigger);

type Highlight = { _key?: string; label?: string; url?: string } | string;
type PhilosophyCard = { title: string; desc: string };
type BeyondCodeCard = { title: string; desc: string; img?: string; alt?: string };

export interface CyberPhilosophyContent {
  hero?: {
    eyebrow?: string;
    title?: string;
    accent?: string;
    subtitle?: string;
    question?: string;
    portrait?: string;
    portraitAlt?: string;
    mindLabels?: string[];
  };
  founderStatement?: {
    headline?: string;
    accent?: string;
    paragraphs?: string[];
  };
  principlesSection?: {
    eyebrow?: string;
    title?: string;
    accent?: string;
    cards?: PhilosophyCard[];
  };
  processSection?: {
    eyebrow?: string;
    title?: string;
    accent?: string;
    steps?: PhilosophyProcessStep[];
  };
  beyondCodeSection?: {
    eyebrow?: string;
    title?: string;
    accent?: string;
    cards?: BeyondCodeCard[];
  };
  ctaSection?: {
    headlineLines?: string[];
    accent?: string;
    highlights?: Highlight[];
    primaryButton?: string;
    secondaryButton?: string;
  };
  backgrounds?: {
    hero?: string;
    process?: string;
    beyondCode?: string;
  };
}

const mindLabels = [
  { label: 'Philosophy', className: 'left-[12%] top-[18%] md:left-[17%] md:top-[24%]' },
  { label: 'Technology', className: 'right-[12%] top-[18%] md:right-[17%] md:top-[24%]' },
  { label: 'Psychology', className: 'left-[5%] top-[50%] md:left-[10%] md:top-[50%]' },
  { label: 'Management', className: 'right-[5%] top-[50%] md:right-[10%] md:top-[50%]' },
  { label: 'Curiosity', className: 'left-[16%] bottom-[10%] md:left-[21%] md:bottom-[18%]' },
  { label: 'Performance', className: 'right-[16%] bottom-[10%] md:right-[21%] md:bottom-[18%]' },
];

const principles: PhilosophyCard[] = [
  {
    title: 'Ask why first',
    desc: 'I start by naming the real problem, not by picking a stack. The useful answer is often simpler than the first idea.',
  },
  {
    title: 'Reduce complexity',
    desc: 'Good systems feel calm. I remove needless moving parts so teams can understand, change, and trust the product.',
  },
  {
    title: 'Build for outcomes',
    desc: 'The point is not code volume. The point is a clearer process, a faster decision, or a user experience that finally clicks.',
  },
  {
    title: 'Improve continuously',
    desc: 'Small gains compound. Software, racing, training, and business all reward careful feedback loops.',
  },
];

const beyondCode: BeyondCodeCard[] = [
  {
    title: 'Mountains',
    desc: 'Distance helps me see systems more clearly. A few hours away from the screen often turns a tangled problem into a simple path.',
    img: '/media/about/sleza.webp',
  },
  {
    title: 'Curiosity',
    desc: 'Psychology, physics, maps, patterns, and old questions. I like understanding how things work before I try to improve them.',
    img: '/media/about/curiosity_star_map.webp',
  },
  {
    title: 'Performance',
    desc: 'Simracing trained the same instinct I use in product work: observe precisely, adjust deliberately, repeat until it feels inevitable.',
    img: '/media/about/IMG_20240917_161321.webp',
  },
];

const defaultFounderParagraphs = [
  'As a fitness coach and creator of the Fitcrates brand, I learned how to ask questions, understand motivations and help people achieve meaningful goals.',
  'Later I moved into management and discovered another side of business: priorities, budgets and decision-making.',
  'Software became a natural extension of that journey.',
  'Today I use technology to solve business problems with the same mindset that guided me from the beginning:',
];

const defaultBackgrounds = {
  hero: '/media/about/ChatGPT Image 17 cze 2026, 11_06_48.webp',
  process: '/media/about/ChatGPT Image 17 cze 2026, 11_06_55.webp',
  beyondCode: '/media/about/ChatGPT Image 17 cze 2026, 11_07_28.png',
};

function SectionBackdrop({ image }: { image: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-fixed bg-center bg-cover opacity-[0.18]" style={{ backgroundImage: `url('${image}')` }} />
      <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px]" />
    </>
  );
}

function SectionHeading({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="cyber-reveal mx-auto mb-12 max-w-3xl text-center md:mb-16">
      <SpotlightText as="p" className="mb-4 font-plex text-xs uppercase tracking-[0.35em] text-teal-300/60" glowSize={100}>
        {eyebrow}
      </SpotlightText>
      <h2 className="font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl md:text-5xl">
        <SpotlightText as="span" className="text-white" glowSize={160}>
          {title}
        </SpotlightText>{' '}
        <SpotlightText as="span" className="text-teal-300" glowSize={160}>
          {accent}
        </SpotlightText>
      </h2>
    </div>
  );
}

function FixedLightRibbon() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.54]">
      <FloatingLines
        enabledWaves={['middle']}
        lineCount={4}
        lineDistance={12}
        bendRadius={12}
        bendStrength={-0.9}
        interactive={false}
        parallax={false}
        animationSpeed={0.42}
        linesGradient={['#5EEAD4', '#6D5DF5', '#5EEAD4']}
        mixBlendMode="screen"
      />
    </div>
  );
}

function FounderStatement({ content }: { content?: CyberPhilosophyContent['founderStatement'] }) {
  const headline = content?.headline || 'I never started with code.';
  const accent = content?.accent || 'I started with people.';
  const hasCustomParagraphs = Boolean(content?.paragraphs?.filter(Boolean).length);
  const paragraphs = hasCustomParagraphs ? content!.paragraphs!.filter(Boolean) : defaultFounderParagraphs;
  const bodyParagraphs = paragraphs.slice(0, -1);
  const callout = paragraphs[paragraphs.length - 1];

  return (
    <div className="cyber-reveal relative z-10 mx-auto mt-8 max-w-3xl border border-teal-300/20 px-6 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-md sm:px-10">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/55 to-transparent" />
      
      <div className="mx-auto max-w-2xl font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl">
        <SpotlightText as="p" glowSize={200}>
          {headline}
        </SpotlightText>
        <SpotlightText as="p" className="mt-2 font-medium text-teal-300" glowSize={200}>
          {accent}
        </SpotlightText>
      </div>
      
      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-6 font-plex text-base font-light leading-relaxed text-white/70 sm:text-lg">
        {bodyParagraphs.map((paragraph) => (
          <SpotlightText key={paragraph} as="p" glowSize={160}>
            {paragraph}
          </SpotlightText>
        ))}
        
        {callout ? (
          <div className="mt-4">
            <SpotlightText as="p" glowSize={180} className="font-medium text-white/90">
              {callout}
            </SpotlightText>
            {!hasCustomParagraphs ? (
              <SpotlightText as="p" className="mt-4 font-oxanium text-2xl font-semibold tracking-wide text-teal-300 sm:text-3xl" glowSize={200}>
                understand first, build second.
              </SpotlightText>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MindMap({ labels, portrait, portraitAlt }: { labels?: string[]; portrait?: string; portraitAlt?: string }) {
  const items = mindLabels.map((item, index) => ({ ...item, label: labels?.[index] || item.label }));

  return (
    <div className="cyber-reveal relative mx-auto mt-8 flex w-full max-w-6xl flex-col items-center justify-center gap-8 sm:mt-10 md:min-h-[480px]">
      <div className="absolute left-1/2 top-1/2 hidden h-px w-[58%] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-300/25 to-transparent md:block" />
      <div className="absolute left-1/2 top-1/2 hidden h-[58%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-teal-300/20 to-transparent md:block" />
      <div className="absolute left-1/2 top-1/2 hidden h-px w-[48%] -translate-x-1/2 rotate-[35deg] bg-gradient-to-r from-transparent via-teal-300/20 to-transparent md:block" />
      <div className="absolute left-1/2 top-1/2 hidden h-px w-[48%] -translate-x-1/2 -rotate-[35deg] bg-gradient-to-r from-transparent via-teal-300/20 to-transparent md:block" />

      <div className="relative z-20 h-44 w-44 rounded-full border border-teal-300/75 bg-indigo-950 p-2 shadow-[0_0_82px_rgba(94,234,212,0.34)] sm:h-52 sm:w-52 md:h-60 md:w-60">
        <div className="absolute inset-[-9px] rounded-full border border-teal-300/35 shadow-[0_0_34px_rgba(94,234,212,0.22)]" />
        <div className="relative h-full w-full overflow-hidden rounded-full bg-indigo-950">
          <Image
            src={portrait || '/media/about/arek5.webp'}
            alt={portraitAlt || 'Arkadiusz Wawrzyniak'}
            fill
            className="scale-[1.1] object-cover object-[50%_20%]"
            sizes="(max-width: 640px) 240px, (max-width: 768px) 288px, 320px"
            quality={100}
            unoptimized
            priority
          />
        </div>
      </div>

      {items.map((item) => (
        <div
          key={item.label}
          className={`absolute z-10 hidden font-plex text-[11px] uppercase tracking-[0.28em] text-teal-200/80 transition-colors hover:text-teal-200 md:block ${item.className}`}
        >
          <span className="mb-2 block h-px w-8 bg-teal-300/40" />
          <SpotlightText as="span" className="text-teal-200/80" glowSize={80}>
            {item.label}
          </SpotlightText>
        </div>
      ))}

      <div className="relative z-10 grid w-full max-w-[22rem] grid-cols-2 gap-x-5 gap-y-3 px-4 sm:max-w-md sm:grid-cols-3 md:hidden">
        {items.map((item) => (
          <span
            key={item.label}
            className="border-b border-teal-300/20 px-1 pb-2 text-center font-plex text-[10px] uppercase tracking-[0.2em] text-teal-200/80"
          >
            <SpotlightText as="span" className="text-teal-200/80" glowSize={80}>
              {item.label}
            </SpotlightText>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CyberPhilosophyLayout({
  language,
  highlights = [],
  content,
}: {
  language: Language;
  highlights?: Highlight[];
  content?: CyberPhilosophyContent;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hero = content?.hero;
  const backgrounds = {
    hero: content?.backgrounds?.hero || defaultBackgrounds.hero,
    process: content?.backgrounds?.process || defaultBackgrounds.process,
    beyondCode: content?.backgrounds?.beyondCode || defaultBackgrounds.beyondCode,
  };
  const principleCards = content?.principlesSection?.cards?.length ? content.principlesSection.cards : principles;
  const beyondCodeCards = content?.beyondCodeSection?.cards?.length ? content.beyondCodeSection.cards : beyondCode;
  const ctaHighlights = content?.ctaSection?.highlights?.length ? content.ctaSection.highlights : highlights;
  const ctaHeadlineLines = content?.ctaSection?.headlineLines?.length
    ? content.ctaSection.headlineLines
    : ['Understand first.', 'Build second.'];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cyber-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-indigo-950 text-white selection:bg-teal-300/20 selection:text-teal-100"
    >
   
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,234,212,0.12),transparent_38%),linear-gradient(180deg,rgba(8,11,34,0.72),#090c24_62%,#08091d)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(94,234,212,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(94,234,212,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />
      </div>

      <FixedLightRibbon />

      <div className="relative z-10">
        <section className="relative flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <SectionBackdrop image={backgrounds.hero} />

          <div className="cyber-reveal relative z-10 mx-auto max-w-5xl text-center">
            <SpotlightText as="p" className="mb-5 font-plex text-xs uppercase tracking-[0.38em] text-teal-300/60" glowSize={100}>
              {hero?.eyebrow || 'Founder operating system'}
            </SpotlightText>
            <h1 className="mx-auto max-w-5xl font-oxanium text-4xl font-light leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl">
              <SpotlightText as="span" className="text-white" glowSize={220}>
                {hero?.title || 'Enter the Mind of'}
              </SpotlightText>{' '}
              <SpotlightText as="span" className="font-semibold text-teal-300" glowSize={220}>
                {hero?.accent || 'AppCrates'}
              </SpotlightText>
            </h1>
            <div className="mx-auto mt-7 max-w-2xl font-plex text-lg font-light leading-relaxed text-white/60 sm:text-xl">
              <SpotlightText as="p" glowSize={140}>
                {hero?.subtitle || 'Behind every system I build is one question:'}
              </SpotlightText>
              <SpotlightText as="p" className="mt-3 font-medium text-white" glowSize={140}>
                {hero?.question || 'What problem are we really solving?'}
              </SpotlightText>
            </div>
          </div>

          <MindMap labels={hero?.mindLabels} portrait={hero?.portrait} portraitAlt={hero?.portraitAlt} />
          <FounderStatement content={content?.founderStatement} />
        </section>

        <section className="relative overflow-hidden border-y border-teal-300/10 px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <SectionBackdrop image={backgrounds.hero} />
          <div className="relative z-10 mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={content?.principlesSection?.eyebrow || 'How I think'}
              title={content?.principlesSection?.title || 'My operating'}
              accent={content?.principlesSection?.accent || 'principles'}
            />

            <div className="grid gap-5 md:grid-cols-2 lg:gap-7">
              {principleCards.map((card, index) => (
                <div key={card.title} className="cyber-reveal">
                  <PhilosophyTiltCard
                    title={card.title}
                    desc={card.desc}
                    number={String(index + 1).padStart(2, '0')}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-teal-300/10">
          <SectionBackdrop image={backgrounds.process} />
          <PhilosophyProcess
            eyebrow={content?.processSection?.eyebrow}
            title={content?.processSection?.title}
            accent={content?.processSection?.accent}
            steps={content?.processSection?.steps?.length ? content.processSection.steps : undefined}
          />
        </section>

        <section className="relative overflow-hidden border-y border-teal-300/10 px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <SectionBackdrop image={backgrounds.beyondCode} />
          <div className="relative z-10 mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={content?.beyondCodeSection?.eyebrow || 'Human inputs'}
              title={content?.beyondCodeSection?.title || 'Beyond'}
              accent={content?.beyondCodeSection?.accent || 'Code'}
            />

            <div className="grid gap-6 md:grid-cols-3">
              {beyondCodeCards.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="cyber-reveal group overflow-hidden border border-teal-300/20 bg-indigo-950/75 shadow-[0_24px_80px_rgba(0,0,0,0.32)] transition-colors hover:border-teal-300/50"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-indigo-950">
                    <Image
                      src={item.img || beyondCode[index]?.img || beyondCode[0].img || '/media/about/sleza.webp'}
                      alt={item.alt || item.title}
                      fill
                      className="object-cover opacity-[0.74] saturate-[0.75] transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-100"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/10 to-transparent" />
                  </div>
                  <div className="p-7 sm:p-8">
                    <SpotlightText as="h3" className="font-oxanium text-2xl font-light text-white" glowSize={120}>
                      {item.title}
                    </SpotlightText>
                    <SpotlightText as="p" className="mt-4 font-plex text-base font-light leading-relaxed text-white/60" glowSize={120}>
                      {item.desc}
                    </SpotlightText>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <SectionBackdrop image={backgrounds.hero} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-indigo-950 via-transparent to-transparent" />
          <div className="cyber-reveal relative z-10 mx-auto max-w-4xl text-center">
            <div className="font-oxanium text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
              {ctaHeadlineLines.map((line) => (
                <SpotlightText key={line} as="p" glowSize={220}>
                  {line}
                </SpotlightText>
              ))}
              <SpotlightText as="p" className="mt-5 text-teal-300" glowSize={220}>
                {content?.ctaSection?.accent || 'Create something that solves a real problem.'}
              </SpotlightText>
            </div>

            {ctaHighlights.length > 0 ? (
              <ul className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 text-left">
                {ctaHighlights.map((h, index) => {
                  const label = typeof h === 'string' ? h : h.label;
                  const url = typeof h === 'string' ? undefined : h.url;
                  const key = typeof h === 'string' ? `hl-${index}` : h._key || `hl-${index}`;
                  if (!label) return null;

                  const inner = (
                    <>
                      <span className="font-oxanium text-sm tracking-widest text-teal-300/50 transition-colors group-hover:text-teal-300">
                        [{String(index + 1).padStart(2, '0')}]
                      </span>
                      <SpotlightText as="span" className="font-plex text-base font-light text-white/80 transition-colors group-hover:text-white" glowSize={100}>
                        {label}
                      </SpotlightText>
                    </>
                  );

                  return (
                    <li key={key}>
                      {url ? (
                        <PrefetchLink
                          href={url}
                          className="group flex items-center gap-4 border-b border-teal-300/10 py-3 transition-transform hover:translate-x-2"
                        >
                          {inner}
                        </PrefetchLink>
                      ) : (
                        <div className="group flex items-center gap-4 border-b border-teal-300/10 py-3">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className="mt-12 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <PrefetchLink
                href={localizedPath(language, '/#contact')}
                className="group relative min-w-[230px] overflow-hidden bg-teal-300 px-10 py-5 text-center font-plex font-normal text-black transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <span className="relative z-10 uppercase "> {content?.ctaSection?.primaryButton || 'Start a project'} </span>
                <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
              </PrefetchLink>
              <PrefetchLink
                href={localizedPath(language, '/#projects')}
                className="group relative min-w-[230px] overflow-hidden border border-white/20 px-10 py-5 text-center font-plex font-normal text-white transition-all duration-500 hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <span className="relative z-10 uppercase transition-colors duration-500 group-hover:text-indigo-950">
                  {content?.ctaSection?.secondaryButton || 'See my work'}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-teal-300 transition-transform duration-500 group-hover:translate-x-0" />
              </PrefetchLink>
            </div>
          </div>
        </section>
      </div>
 </div>
  
  );
}
