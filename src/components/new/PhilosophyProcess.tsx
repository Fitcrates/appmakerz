'use client';

import SpotlightText from '@/components/new/SpotlightText';

export interface PhilosophyProcessStep {
  step: string;
  name: string;
  verb: string;
  detail: string;
}

export const defaultPhilosophyProcessSteps: PhilosophyProcessStep[] = [
  {
    step: '01',
    name: 'Discover',
    verb: 'Question',
    detail: 'Understand the business, the user, the constraint, and the uncomfortable part nobody has named yet.',
  },
  {
    step: '02',
    name: 'Architect',
    verb: 'Simplify',
    detail: 'Turn messy needs into a small set of decisions: data, flows, interfaces, risks, and tradeoffs.',
  },
  {
    step: '03',
    name: 'Build',
    verb: 'Create',
    detail: 'Ship the core experience with performance, maintainability, and a visual system that supports the idea.',
  },
  {
    step: '04',
    name: 'Refine',
    verb: 'Iterate',
    detail: 'Remove friction, test the assumptions, and polish the parts users actually touch.',
  },
  {
    step: '05',
    name: 'Scale',
    verb: 'Prepare',
    detail: 'Leave the system ready for growth: fewer surprises, cleaner content paths, and room for future work.',
  },
];

interface PhilosophyProcessProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  steps?: PhilosophyProcessStep[];
}

export default function PhilosophyProcess({
  className = '',
  eyebrow = 'Thought stream',
  title = 'The',
  accent = 'Process',
  steps = defaultPhilosophyProcessSteps,
}: PhilosophyProcessProps) {
  return (
    <div className={`relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 ${className}`}>
      <div className="cyber-reveal mx-auto mb-14 max-w-3xl text-center md:mb-20">
        <SpotlightText as="p" className="mb-4 font-plex text-xs uppercase tracking-[0.35em] text-teal-300/60" glowSize={100}>
          {eyebrow}
        </SpotlightText>
        <SpotlightText as="h2" className="font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl md:text-5xl" glowSize={160}>
          {title} <span className="text-teal-300">{accent}</span>
        </SpotlightText>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="absolute bottom-4 left-5 top-4 w-px bg-gradient-to-b from-transparent via-teal-300/40 to-transparent md:left-1/2" />
        <div className="space-y-8 md:space-y-10">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`cyber-reveal relative grid items-center gap-5 pl-16 md:grid-cols-[1fr_96px_1fr] md:gap-8 md:pl-0 ${index % 2 ? '' : 'md:[&_.process-card]:col-start-3'
                }`}
            >
              <div className="process-card border border-teal-300/20  p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-md transition-colors hover:border-teal-300/60 sm:p-7">
                <SpotlightText as="p" className="mb-3 font-plex text-xs uppercase tracking-[0.32em] text-teal-300/60" glowSize={90}>
                  {item.verb}
                </SpotlightText>
                <SpotlightText as="h3" className="font-oxanium text-2xl font-light text-white sm:text-3xl" glowSize={130}>
                  {item.name}
                </SpotlightText>
                <SpotlightText as="p" className="mt-4 font-plex text-base font-light leading-relaxed text-white/60" glowSize={120}>
                  {item.detail}
                </SpotlightText>
              </div>

              <div className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-t-full border border-teal-300/40 backdrop-blur-md font-oxanium text-xs tracking-widest text-teal-200 shadow-[0_0_35px_rgba(94,234,212,0.16)] md:static md:col-start-2 md:row-start-1 md:h-24 md:w-24 md:translate-y-0">
                <span>{item.step}</span>
              </div>

              <div className="hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
