'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import SpotlightText from '@/components/new/SpotlightText';
import type { Language } from '@/lib/language';
import styles from './MindMap.module.css';

// Label anchors and the point each spoke starts from, in percent of the map.
// Spokes run from the label into the portrait, so ideas visibly flow into the
// person in the middle.
const nodes = [
  { fallback: 'Philosophy', className: 'left-[15%] top-[22%] items-start text-left', from: [26, 27] },
  { fallback: 'Technology', className: 'right-[15%] top-[22%] items-end text-right', from: [74, 27] },
  { fallback: 'Psychology', className: 'left-[8%] top-[50%] -translate-y-1/2 items-start text-left', from: [20, 50] },
  { fallback: 'Management', className: 'right-[8%] top-[50%] -translate-y-1/2 items-end text-right', from: [80, 50] },
  { fallback: 'Curiosity', className: 'left-[15%] bottom-[22%] items-start text-left', from: [26, 73] },
  { fallback: 'Performance', className: 'right-[15%] bottom-[22%] items-end text-right', from: [74, 73] },
] as const;

// What each trait means for the client, in the same order as the labels in
// Sanity (hero.mindLabels). If the labels are reordered there, reorder these.
const notes: Record<Language, string[]> = {
  pl: [
    'Zanim cokolwiek zbuduję, pytam, po co ma istnieć. Czasem najlepsza funkcja to ta, której nie trzeba pisać.',
    'Dobieram narzędzia do problemu, nie problem do narzędzi. Medusa.js, Next.js albo AI tam, gdzie naprawdę pomagają.',
    'Rozumiem, dlaczego klient porzuca koszyk albo nie wysyła zapytania, zanim dotkniemy kodu.',
    'Myślę budżetem, priorytetami i terminem. Dostajesz decyzje do podjęcia, a nie listę problemów.',
    'Wchodzę w Twoją branżę na tyle głęboko, żeby zadać pytania, których nikt wcześniej nie zadał.',
    'Automatyzuję to, co powtarzalne, żeby Twój zespół zajmował się tym, czego automat nie zrobi.',
  ],
  en: [
    'Before I build anything, I ask why it should exist. Sometimes the best feature is the one you never have to write.',
    'I pick tools for the problem, not the other way round. Medusa.js, Next.js or AI where they actually help.',
    'I work out why a customer abandons the cart or never sends an enquiry before we touch the code.',
    'I think in budget, priorities and deadlines. You get decisions to make, not a list of problems.',
    'I go deep enough into your industry to ask the questions nobody has asked yet.',
    'I automate what repeats, so your team spends its time on what a machine cannot do.',
  ],
};

const CYCLE_MS = 6500;
const RESUME_MS = 9000;

interface MindMapProps {
  labels?: string[];
  portrait?: string;
  portraitAlt?: string;
  language: Language;
}

export default function MindMap({ labels, portrait, portraitAlt, language }: MindMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px -15% 0px' });
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [pausedUntil, setPausedUntil] = useState(0);
  const [userChose, setUserChose] = useState(false);

  const items = nodes.map((node, index) => ({
    ...node,
    label: labels?.[index] || node.fallback,
    note: notes[language]?.[index] || notes.en[index],
  }));

  // Walks through the traits on its own while the map is on screen, so the
  // interaction is discovered without a "hover me" instruction. Any hover,
  // focus or tap pauses it for a while.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil) return;
      setActive((current) => (current === null ? 0 : (current + 1) % nodes.length));
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, reducedMotion, pausedUntil]);

  // Without this the hint would sit there for a whole cycle before the
  // first trait shows up.
  useEffect(() => {
    if (!inView || reducedMotion || active !== null) return;
    const id = window.setTimeout(() => setActive(0), 1500);
    return () => window.clearTimeout(id);
  }, [inView, reducedMotion, active]);

  const choose = (index: number) => {
    setActive(index);
    setUserChose(true);
    setPausedUntil(Date.now() + RESUME_MS);
  };

  const current = active === null ? null : items[active];
  const hint = language === 'pl'
    ? 'Najedź na hasło albo je kliknij, żeby zobaczyć, co z tego masz w projekcie.'
    : 'Hover or tap a word to see what it means for your project.';

  const caption = (
    <div className="relative mx-auto min-h-[5.5rem] max-w-md px-4 text-center" aria-live={userChose ? 'polite' : 'off'}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current?.label ?? 'hint'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          {current ? (
            <>
              <span className="block font-plex text-[11px] uppercase tracking-[0.28em] text-teal-300">{current.label}</span>
              <p className="mt-2 font-plex text-base font-light leading-relaxed text-white/80">{current.note}</p>
            </>
          ) : (
            <p className="pt-3 font-plex text-sm font-light text-white/55">{hint}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div
      ref={ref}
      className="cyber-reveal relative mx-auto mt-8 flex w-full max-w-6xl flex-col items-center justify-center gap-6 sm:mt-10 md:min-h-[540px]"
    >
      <svg className="absolute inset-0 z-0 hidden h-full w-full md:block" aria-hidden="true" style={{ pointerEvents: 'none' }}>
        {items.map((item, index) => {
          const isActive = active === index;
          const [x, y] = item.from;
          return (
            <g key={item.fallback}>
              <line
                className={styles.spoke}
                x1={`${x}%`}
                y1={`${y}%`}
                x2="50%"
                y2="50%"
                stroke={isActive ? 'rgba(94,234,212,0.55)' : 'rgba(94,234,212,0.16)'}
                strokeWidth={isActive ? 1.5 : 1}
              />
              <line
                className={`${styles.pulse} ${isActive ? styles.pulseActive : ''}`}
                x1={`${x}%`}
                y1={`${y}%`}
                x2="50%"
                y2="50%"
                pathLength={100}
                stroke="#5eead4"
                strokeWidth={2}
                style={{ animationDelay: `${index * 0.6}s` }}
              />
            </g>
          );
        })}
      </svg>

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

      {/* Desktop: labels around the portrait. */}
      {items.map((item, index) => {
        const isActive = active === index;
        return (
          <button
            key={item.fallback}
            type="button"
            onMouseEnter={() => choose(index)}
            onFocus={() => choose(index)}
            onClick={() => choose(index)}
            aria-pressed={isActive}
            className={`absolute z-10 hidden font-plex text-[11px] uppercase tracking-[0.28em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60 rounded-sm md:flex md:flex-col ${item.className} ${isActive ? 'text-teal-200' : 'text-teal-200/70 hover:text-teal-200'}`}
          >
            <span className={`mb-2 block h-px transition-all duration-500 ${isActive ? 'w-14 bg-teal-300' : 'w-8 bg-teal-300/40'}`} />
            <SpotlightText as="span" className={isActive ? 'text-teal-100' : 'text-teal-200/80'} glowSize={80}>
              {item.label}
            </SpotlightText>
          </button>
        );
      })}

      {/* Desktop caption sits under the portrait. Absolute, so the portrait
          stays at the exact centre the spokes point to. */}
      <div className="absolute left-1/2 top-[calc(50%+150px)] z-20 hidden w-full max-w-md -translate-x-1/2 md:block">{caption}</div>

      {/* Mobile: the labels become a tappable grid with the caption below. */}
      <div className="relative z-10 grid w-full max-w-[22rem] grid-cols-2 gap-x-5 gap-y-3 px-4 sm:max-w-md sm:grid-cols-3 md:hidden">
        {items.map((item, index) => {
          const isActive = active === index;
          return (
            <button
              key={item.fallback}
              type="button"
              onClick={() => choose(index)}
              aria-pressed={isActive}
              className={`border-b px-1 pb-2 text-center font-plex text-[10px] uppercase tracking-[0.2em] transition-colors ${isActive ? 'border-teal-300 text-teal-100' : 'border-teal-300/20 text-teal-200/80'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="w-full md:hidden">{caption}</div>
    </div>
  );
}
