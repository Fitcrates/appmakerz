'use client';

import { ProcessStepsBody } from '@/components/new/ServiceProcessSteps';

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

// Same numbered timeline as the service pages: one process layout across
// the site instead of the alternating card zigzag this page used to have.
export default function PhilosophyProcess({
  className = '',
  eyebrow = 'Thought stream',
  title = 'The',
  accent = 'Process',
  steps = defaultPhilosophyProcessSteps,
}: PhilosophyProcessProps) {
  return (
    <div className={`relative z-10 py-20 lg:py-28 ${className}`}>
      <ProcessStepsBody
        eyebrow={eyebrow}
        heading={[title, accent].filter(Boolean).join(' ')}
        items={steps.map((item) => ({ label: item.verb, title: item.name, text: item.detail }))}
      />
    </div>
  );
}
