import { ArrowLeft, ArrowRight } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { urlFor } from '@/lib/sanity.server';
import type { Language } from '@/lib/language';

interface ProjectNextPrevProps {
  previous: any;
  next: any;
  language: Language;
  labels: { previous: string; next: string; all: string };
}

/** Keeps the visitor inside the portfolio instead of ending on a dead page. */
export default function ProjectNextPrev({ previous, next, language, labels }: ProjectNextPrevProps) {
  const hasPrevious = Boolean(previous?.slug?.current);
  const hasNext = Boolean(next?.slug?.current);

  if (!hasPrevious && !hasNext) {
    return null;
  }

  return (
    <nav aria-label={labels.all} className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* A single neighbour takes the full width instead of leaving a hole. */}
        <div className={`grid gap-px bg-white/[0.07] ${hasPrevious && hasNext ? 'sm:grid-cols-2' : ''}`}>
          <AdjacentCard project={previous} language={language} label={labels.previous} direction="previous" />
          <AdjacentCard project={next} language={language} label={labels.next} direction="next" />
        </div>
      </div>
    </nav>
  );
}

function AdjacentCard({
  project,
  language,
  label,
  direction,
}: {
  project: any;
  language: Language;
  label: string;
  direction: 'previous' | 'next';
}) {
  if (!project?.slug?.current) {
    return null;
  }

  const title = getLocalizedText(project.title, language);
  const category = getLocalizedText(project.category, language);
  const thumbnail = project.mainImage?.asset?._ref
    ? urlFor(project.mainImage).width(220).height(160).fit('crop').auto('format').url()
    : '';

  return (
    <PrefetchLink
      href={localizedPath(language, `/project/${project.slug.current}`)}
      className={`group flex items-center gap-5 bg-indigo-950 px-6 py-8 transition-colors duration-500 hover:bg-white/[0.03] lg:px-8 lg:py-10 ${
        direction === 'next' ? 'sm:flex-row-reverse sm:text-right' : ''
      }`}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          aria-hidden="true"
          className="hidden h-16 w-24 flex-shrink-0 border border-white/10 object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-100 sm:block"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <div className="min-w-0">
        <span
          className={`flex items-center gap-2 font-plex text-xs uppercase tracking-[0.25em] text-white/35 transition-colors duration-500 group-hover:text-teal-300/80 ${
            direction === 'next' ? 'sm:justify-end' : ''
          }`}
        >
          {direction === 'previous' ? <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> : null}
          {label}
          {direction === 'next' ? <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        </span>

        <p className="mt-3 truncate font-oxanium text-lg font-light text-white transition-colors duration-500 group-hover:text-teal-300 lg:text-xl">
          {title}
        </p>

        {category ? <p className="mt-1 truncate font-plex text-sm text-white/40">{category}</p> : null}
      </div>
    </PrefetchLink>
  );
}
