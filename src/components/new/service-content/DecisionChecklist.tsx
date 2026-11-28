'use client';

import { useState, type ReactNode } from 'react';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';

// The pre-build decisions as a checklist the visitor can tick. Whatever they
// tick and leave open is carried into the contact form as a draft (see
// CONTACT_DRAFT_KEY in useEmailForm), so the first message already says where
// the project stands instead of starting from a blank textarea.
export const CONTACT_DRAFT_KEY = 'contactDraft';

const copy = {
  pl: {
    eyebrow: 'Zanim powstanie kod',
    of: (n: number) => `z ${n} odpowiedzi gotowych`,
    hints: [
      'Zaznacz pytania, na które znasz już odpowiedź.',
      'Większość osób zaczyna właśnie tutaj. Od tego jest pierwsza rozmowa.',
      'Dobry start. Brakujące punkty to dokładnie to, od czego zaczniemy rozmowę.',
      'Masz solidną bazę. Wyślij odpowiedzi, a napiszę, od czego bym zaczął.',
    ],
    cta: 'Wyślij mi swoje odpowiedzi',
    small: 'Nie musisz mieć wszystkich. Resztę przepracujemy na rozmowie.',
    draft: (done: string[], open: string[]) => [
      'Planuję marketplace.',
      done.length ? `\nMam już odpowiedź na:\n${done.map((q) => `- ${q}`).join('\n')}` : '',
      open.length ? `\nJeszcze do ustalenia:\n${open.map((q) => `- ${q}`).join('\n')}` : '',
      '\nKilka słów o projekcie: ',
    ].join('\n').replace(/\n{3,}/g, '\n\n'),
  },
  en: {
    eyebrow: 'Before any code',
    of: (n: number) => `of ${n} answers ready`,
    hints: [
      'Tick the questions you already have an answer to.',
      'Most people start right here. That is what the first call is for.',
      'Good start. The open points are exactly where our conversation begins.',
      'You have a solid base. Send your answers and I will tell you where I would start.',
    ],
    cta: 'Send me your answers',
    small: 'You do not need all of them. We will work through the rest on a call.',
    draft: (done: string[], open: string[]) => [
      'I am planning a marketplace.',
      done.length ? `\nI already have answers for:\n${done.map((q) => `- ${q}`).join('\n')}` : '',
      open.length ? `\nStill to decide:\n${open.map((q) => `- ${q}`).join('\n')}` : '',
      '\nA few words about the project: ',
    ].join('\n').replace(/\n{3,}/g, '\n\n'),
  },
};

/** "Question? Why it matters." → question and the line under it. */
function splitQuestion(text: string) {
  const index = text.indexOf('? ');
  // A second question is part of the question, not an explanation of it.
  if (index === -1 || text.trim().endsWith('?')) return { question: text, impact: '' };
  return { question: text.slice(0, index + 1), impact: text.slice(index + 2) };
}

interface DecisionChecklistProps {
  language: Language;
  heading: string;
  items: string[];
  lead: ReactNode;
  note: ReactNode;
}

export default function DecisionChecklist({ language, heading, items, lead, note }: DecisionChecklistProps) {
  const t = copy[language];
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const parsed = items.map(splitQuestion);
  const done = checked.filter(Boolean).length;
  const ratio = items.length ? done / items.length : 0;
  const hint = done === 0 ? t.hints[0] : ratio < 0.3 ? t.hints[1] : ratio < 0.7 ? t.hints[2] : t.hints[3];

  const saveDraft = () => {
    const answered = parsed.filter((_, index) => checked[index]).map((item) => item.question);
    const open = parsed.filter((_, index) => !checked[index]).map((item) => item.question);
    try {
      window.sessionStorage.setItem(CONTACT_DRAFT_KEY, t.draft(answered, open));
    } catch {
      // Storage can be blocked; the link still takes them to the form.
    }
  };

  return (
    // DOM order is intro, list, tally: on a phone the questions come before
    // the button. On wide screens the grid puts intro and tally in the left
    // column, the tally sticky, and the list on the right.
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-x-16 lg:gap-y-8">
      <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1">
        <span className="font-plex text-xs uppercase tracking-[0.3em] text-teal-300/80">{t.eyebrow}</span>
        <BurnSpotlightText
          as="h2"
          className="font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl/tight lg:text-5xl/tight"
          glowSize={180}
          baseDelay={100}
          charDelay={30}
        >
          {heading}
        </BurnSpotlightText>
        {lead ? <div>{lead}</div> : null}
      </div>

      <ul className="flex flex-col gap-2.5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {parsed.map((item, index) => (
          <li key={index}>
            <label
              className={`grid cursor-pointer grid-cols-[1.75rem_minmax(0,1fr)] gap-4 rounded-[20px] px-5 py-5 transition-colors sm:px-6 ${
                checked[index] ? 'bg-teal-300/10' : 'bg-white/[0.035] hover:bg-white/[0.06]'
              }`}
            >
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)))}
                className="mt-1 h-5 w-5 accent-teal-300"
              />
              <span className="flex flex-col gap-1.5">
                <SpotlightText className="font-oxanium text-lg leading-snug text-white!" glowSize={110}>{item.question}</SpotlightText>
                {item.impact ? (
                  <SpotlightText className="font-plex text-sm font-light leading-relaxed text-white/60!" glowSize={100}>{item.impact}</SpotlightText>
                ) : null}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-6 self-start lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2">
        <div className="ac-card flex flex-col gap-4 p-6 sm:p-7">
          <div className="flex items-baseline gap-3" aria-live="polite">
            <span className="font-oxanium text-5xl font-light leading-none text-teal-300">{done}</span>
            <SpotlightText className="font-plex text-base text-white/70!" glowSize={90}>{t.of(items.length)}</SpotlightText>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-full rounded-full bg-teal-300 transition-[width] duration-500" style={{ width: `${ratio * 100}%` }} />
          </div>
          <SpotlightText as="p" className="font-plex text-sm leading-relaxed text-white/70!" glowSize={100}>{hint}</SpotlightText>
          <PrefetchLink
            href={localizedPath(language, '/#contact')}
            onClick={saveDraft}
            className="bg-teal-300 px-6 py-4 text-center font-plex font-medium text-indigo-950 transition-colors hover:bg-teal-200 focus:outline-hidden focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
          >
            {t.cta}
          </PrefetchLink>
          <SpotlightText className="font-plex text-xs text-white/55!" glowSize={80}>{t.small}</SpotlightText>
        </div>

        {note ? <div>{note}</div> : null}
      </div>
    </div>
  );
}
