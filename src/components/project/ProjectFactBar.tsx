import { getLocalizedText } from '@/lib/localize';
import type { Language } from '@/lib/language';

interface ProjectFactBarProps {
  project: ProjectFactBarData;
  language: Language;
}

interface ProjectFactBarData {
  facts?: Array<{ label?: unknown; value?: unknown }>;
  category?: unknown;
  technologies?: string[];
  year?: string | number;
  projectUrl?: string;
}

/**
 * The strip under the hero. Authored in Sanity as `facts`; when a project has
 * none, it falls back to what every project already has (category, year,
 * stack size) so the frame never collapses on older entries.
 */
export default function ProjectFactBar({ project, language }: ProjectFactBarProps) {
  const facts = resolveFacts(project, language);

  if (!facts.length) {
    return null;
  }

  return (
    <section className="border-y border-white/10 bg-indigo-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* auto-fit keeps the last row full - an odd number of facts never
            leaves a dangling empty cell. */}
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-px bg-white/[0.07]">
          {facts.map((fact, index) => (
            <div key={`${fact.label}-${index}`} className="bg-indigo-950 px-5 py-6 lg:px-6 lg:py-7">
              <dt className="font-plex text-[11px] uppercase tracking-[0.25em] text-white/35">{fact.label}</dt>
              <dd className="mt-2 font-oxanium text-base font-light text-white lg:text-lg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function resolveFacts(project: ProjectFactBarData, language: Language): Array<{ label: string; value: string }> {
  const authored = Array.isArray(project?.facts) ? project.facts : [];

  const mapped = authored
    .map((fact) => ({
      label: getLocalizedText(fact?.label, language),
      value: getLocalizedText(fact?.value, language),
    }))
    .filter((fact: { label: string; value: string }) => fact.label && fact.value);

  if (mapped.length) {
    return mapped.slice(0, 6);
  }

  const category = getLocalizedText(project?.category, language);
  const technologies: string[] = Array.isArray(project?.technologies) ? project.technologies : [];
  const fallback: Array<{ label: string; value: string }> = [];

  if (category) {
    fallback.push({ label: language === 'pl' ? 'Typ projektu' : 'Project type', value: category });
  }

  if (project?.year) {
    fallback.push({ label: language === 'pl' ? 'Rok' : 'Year', value: String(project.year) });
  }

  if (technologies.length >= 4) {
    fallback.push({
      label: language === 'pl' ? 'Technologie' : 'Technologies',
      value: String(technologies.length),
    });
  }

  if (project?.projectUrl) {
    fallback.push({ label: language === 'pl' ? 'Status' : 'Status', value: language === 'pl' ? 'Wdrożone' : 'Live' });
  }

  return fallback;
}
