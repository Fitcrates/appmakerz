'use client';

import PhilosophyProcess, { type PhilosophyProcessStep } from '@/components/new/PhilosophyProcess';

interface ServiceProcessNewProps {
  processSteps: string[];
  language: string;
}

export default function ServiceProcessNew({ processSteps, language }: ServiceProcessNewProps) {
  const steps: PhilosophyProcessStep[] = processSteps.map((detail, index) => ({
    step: String(index + 1).padStart(2, '0'),
    name: language === 'pl' ? `Krok ${String(index + 1).padStart(2, '0')}` : `Step ${String(index + 1).padStart(2, '0')}`,
    verb: language === 'pl' ? 'Etap' : 'Stage',
    detail,
  }));

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-indigo-950">
      <PhilosophyProcess
        eyebrow={language === 'pl' ? 'Krok po kroku' : 'Step by step'}
        title={language === 'pl' ? 'Proces' : 'Process'}
        accent={language === 'pl' ? 'współpracy' : 'workflow'}
        steps={steps}
      />
    </section>
  );
}
