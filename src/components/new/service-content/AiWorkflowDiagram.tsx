import { ArrowDown, ArrowRight } from 'lucide-react';
import SpotlightText from '@/components/new/SpotlightText';
import type { Language } from '@/lib/language';

// The workflow-first idea drawn as a pipeline: rules before the model, the
// model only in the step that needs it, validation after it. The exception
// lane underneath is what keeps it running when the model is unsure.
const copy = {
  pl: {
    caption: 'Przepływ automatyzacji: wejście, reguły, AI tylko w jednym kroku, walidacja i wynik, oraz ścieżka wyjątków.',
    steps: [
      { label: '01', title: 'Wejście', body: 'dokumenty, zgłoszenia, dane z Twoich systemów', tag: '' },
      { label: '02', title: 'Reguły', body: 'walidacja wejścia i logika, która nie potrzebuje modelu', tag: 'bez AI' },
      { label: '03', title: 'AI tam, gdzie trzeba', body: 'klasyfikacja, ekstrakcja, podsumowanie, wyszukiwanie (RAG)', tag: 'AI' },
      { label: '04', title: 'Walidacja wyniku', body: 'format, zakres i pewność odpowiedzi', tag: 'bez AI' },
      { label: '05', title: 'Wynik', body: 'trafia do CRM, ERP, skrzynki albo raportu', tag: '' },
    ],
    exception: 'Niepewność albo błąd?',
    exceptionSteps: ['ponowienie', 'weryfikacja przez człowieka', 'rozwiązanie alternatywne'],
    cost: 'Cache i reguły przed modelem oznaczają mniej wywołań, a więc niższy i przewidywalny koszt.',
  },
  en: {
    caption: 'Automation flow: input, rules, AI in one step only, validation and output, plus the exception path.',
    steps: [
      { label: '01', title: 'Input', body: 'documents, tickets, data from your systems', tag: '' },
      { label: '02', title: 'Rules', body: 'input validation and logic that needs no model', tag: 'no AI' },
      { label: '03', title: 'AI where it pays', body: 'classification, extraction, summaries, search (RAG)', tag: 'AI' },
      { label: '04', title: 'Output validation', body: 'format, range and confidence of the answer', tag: 'no AI' },
      { label: '05', title: 'Result', body: 'lands in your CRM, ERP, inbox or report', tag: '' },
    ],
    exception: 'Unsure or failed?',
    exceptionSteps: ['retry', 'human review', 'fallback'],
    cost: 'Cache and rules in front of the model mean fewer calls, so the cost stays lower and predictable.',
  },
};

function Connector() {
  return (
    <span aria-hidden="true" className="flex items-center justify-center text-teal-300/70">
      <ArrowDown className="h-5 w-5 lg:hidden" />
      <ArrowRight className="hidden h-5 w-5 lg:block" />
    </span>
  );
}

export default function AiWorkflowDiagram({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <figure>
      <figcaption className="sr-only">{t.caption}</figcaption>
      <div className="grid items-stretch gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr)_auto)_minmax(0,1fr)] lg:gap-3">
        {t.steps.map((step, index) => {
          const isAi = step.tag === 'AI';
          return (
            <div key={step.label} className="contents">
              <div
                className={`flex flex-col gap-2 p-5 ${
                  isAi ? 'rounded-[20px] bg-teal-300/12 ring-1 ring-teal-300/40' : 'ac-card ac-card--sm'
                }`}
              >
                <span className="flex items-center justify-between gap-2 font-plex text-xs">
                  <span className="text-teal-300">{step.label}</span>
                  {step.tag ? (
                    <span className={`rounded-full px-2.5 py-0.5 ${isAi ? 'bg-teal-300 text-indigo-950' : 'bg-white/[0.07] text-white/65'}`}>
                      {step.tag}
                    </span>
                  ) : null}
                </span>
                <SpotlightText className={`font-oxanium text-lg leading-snug ${isAi ? 'text-teal-200!' : 'text-white!'}`} glowSize={90}>
                  {step.title}
                </SpotlightText>
                <SpotlightText className="font-plex text-sm font-light leading-relaxed text-white/65!" glowSize={90}>
                  {step.body}
                </SpotlightText>
              </div>
              {index < t.steps.length - 1 ? <Connector /> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-[20px] border border-dashed border-orange-300/45 bg-orange-300/[0.06] px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center">
        <SpotlightText className="font-oxanium text-base text-orange-200!" glowSize={90}>{t.exception}</SpotlightText>
        <ol className="flex flex-wrap items-center gap-2 font-plex text-sm">
          {t.exceptionSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              {index > 0 ? <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-orange-300/70" /> : null}
              <span className="rounded-full bg-orange-300/12 px-3 py-1 text-orange-100/90">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 max-w-3xl">
        <SpotlightText as="p" className="font-plex text-sm font-light leading-relaxed text-white/55!" glowSize={110}>{t.cost}</SpotlightText>
      </div>
    </figure>
  );
}
