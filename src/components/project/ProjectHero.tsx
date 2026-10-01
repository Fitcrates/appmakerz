import type { ReactNode } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Feather, Github, Globe, Newspaper } from 'lucide-react';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { TechBadgeList } from '@/components/project/TechBadge';
import { getImageAlt } from '@/lib/image-alt';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import type { ProjectArticleLink } from '@/types/sanity.types';

interface ProjectHeroProps {
  project: ProjectHeroData;
  language: Language;
  title: string;
  description: string;
  heroImageUrl: string;
  /** Anchor of the tech stack section, if the project has one. */
  stackAnchor?: string;
  labels: {
    home: string;
    projects: string;
    liveDemo: string;
    sourceCode: string;
    blogPost: string;
    externalArticle: string;
    moreTech: (count: number) => string;
  };
}

interface ProjectHeroData {
  mainImage?: unknown;
  category?: unknown;
  year?: string | number;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  blogUrl?: string;
  articleLinks?: ProjectArticleLink[];
}

/**
 * Project introduction with the product mockup treated as primary content.
 * The visual uses `contain`, so screenshots and device mockups are never
 * cropped just to fill the hero frame.
 */
export default function ProjectHero({
  project,
  language,
  title,
  description,
  heroImageUrl,
  stackAnchor,
  labels,
}: ProjectHeroProps) {
  const category = getLocalizedText(project.category, language);
  const year = project.year ? String(project.year) : '';
  const technologies: string[] = Array.isArray(project.technologies) ? project.technologies : [];
  // An entry with no URL is an author halfway through adding one; rendering it
  // would put a dead button in the hero.
  const articleLinks = (Array.isArray(project.articleLinks) ? project.articleLinks : []).filter(
    (link): link is ProjectArticleLink & { url: string } => Boolean(link?.url)
  );
  const hasLinks =
    Boolean(project.projectUrl || project.githubUrl || project.blogUrl) || articleLinks.length > 0;

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-indigo-950 pt-28 sm:pt-32 lg:pt-36">
      <div className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 overflow-hidden font-plex text-sm text-white/70 lg:mb-14"
        >
          <PrefetchLink
            href={localizedPath(language, '/')}
            className="whitespace-nowrap transition-colors hover:text-teal-300"
          >
            {labels.home}
          </PrefetchLink>
          <span className="text-white/30" aria-hidden="true">/</span>
          <PrefetchLink
            href={localizedPath(language, '/#projects')}
            className="whitespace-nowrap transition-colors hover:text-teal-300"
          >
            {labels.projects}
          </PrefetchLink>
          <span className="text-white/30" aria-hidden="true">/</span>
          <span className="max-w-[250px] truncate text-white/50 sm:max-w-none" aria-current="page">
            {title}
          </span>
        </nav>

        <div className={heroImageUrl ? 'grid items-center gap-12 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:gap-10' : ''}>
          <div className="relative z-20 min-w-0">
            {category || year ? (
              <p className="font-plex text-xs uppercase tracking-[0.3em] text-teal-300/80">
                {[category, year].filter(Boolean).join(' · ')}
              </p>
            ) : null}

            <div className="mt-4 max-w-4xl">
              <BurnSpotlightText
                as="h1"
                className="font-oxanium text-4xl font-light leading-[1.08] text-white sm:text-5xl xl:text-[3.25rem]"
                glowSize={200}
                baseDelay={200}
                charDelay={25}
              >
                {title}
              </BurnSpotlightText>
            </div>

            {description ? (
              <div className="mt-6 max-w-2xl">
                <SpotlightText
                  as="p"
                  className="font-plex text-lg font-light leading-relaxed text-white/65 sm:text-xl"
                  glowSize={150}
                >
                  {description}
                </SpotlightText>
              </div>
            ) : null}

            {heroImageUrl ? (
              <div className="mt-10 xl:hidden">
                <ProjectMockup imageUrl={heroImageUrl} alt={getImageAlt(project.mainImage, title)} priority />
              </div>
            ) : null}

            {technologies.length ? (
              <TechBadgeList
                items={technologies}
                size="sm"
                max={6}
                moreHref={stackAnchor ? `#${stackAnchor}` : undefined}
                moreLabel={labels.moreTech}
                className="mt-9 max-w-3xl"
              />
            ) : null}

            {hasLinks ? (
              // A grid rather than flex-wrap: every button gets the same track
              // width, so the set lines up instead of each one shrinking to its
              // own label. max-w-xl stops them stretching across the whole
              // column on wide screens, where a button that wide stops reading
              // as a button.
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {project.projectUrl ? (
                  <HeroLink
                    href={project.projectUrl}
                    label={labels.liveDemo}
                    icon={<Globe className="h-4 w-4" />}
                    variant="primary"
                  />
                ) : null}

                {project.githubUrl ? (
                  <HeroLink
                    href={project.githubUrl}
                    label={labels.sourceCode}
                    icon={<Github className="h-4 w-4" />}
                  />
                ) : null}

                {project.blogUrl ? (
                  <HeroLink
                    href={project.blogUrl}
                    label={labels.blogPost}
                    icon={<Feather className="h-4 w-4" />}
                  />
                ) : null}

                {articleLinks.map((link, index) => (
                  <HeroLink
                    key={link._key || `${link.url}-${index}`}
                    href={link.url}
                    label={getLocalizedText(link.label, language, labels.externalArticle)}
                    icon={<Newspaper className="h-4 w-4" />}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {heroImageUrl ? (
            <div className="relative z-20 hidden min-w-0 xl:block">
              <ProjectMockup imageUrl={heroImageUrl} alt={getImageAlt(project.mainImage, title)} priority />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProjectMockup({ imageUrl, alt, priority = false }: { imageUrl: string; alt: string; priority?: boolean }) {
  return (
    <figure className="relative">
      {/* 16:9 matches the screenshots and device mockups coming out of Sanity,
          so `contain` fills the frame instead of letterboxing it. */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={alt}
          unoptimized
          fill
          priority={priority}
          sizes="(max-width: 1279px) calc(100vw - 32px), (max-width: 1535px) 720px, 860px"
          className="object-contain object-center"
        />
      </div>
    </figure>
  );
}

/**
 * One hero button. It fills its grid track, so the whole set keeps the same
 * width whatever the labels say. The label sits in a truncating min-w-0 span:
 * a long outlet name shortens rather than widening its track and dragging
 * every other button out with it.
 */
function HeroLink({
  href,
  label,
  icon,
  variant = 'secondary',
}: {
  href: string;
  label: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const primary = variant === 'primary';
  // The teal fill is already the darkest-on-lightest pair in the set, so the
  // primary button keeps its colours through hover; only the outlined variant
  // flips to indigo as the teal sweep passes under it.
  const hoverInk = primary ? '' : 'transition-colors duration-500 group-hover:text-indigo-950';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      // sm:last:odd:col-span-2: with an odd number of buttons the last one sits
      // alone in its row, so it takes the whole row instead of half of it.
      className={`group relative inline-flex w-full items-center gap-2.5 overflow-hidden px-4 py-4 sm:last:odd:col-span-2 font-normal transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 sm:px-5 ${
        primary
          ? 'bg-teal-300 text-indigo-950 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)]'
          : 'border border-white/20 text-white hover:border-teal-300'
      }`}
    >
      <span className={`relative z-10 shrink-0 ${hoverInk}`}>{icon}</span>
      <span className={`relative z-10 min-w-0 flex-1 truncate ${hoverInk}`}>{label}</span>
      <ArrowUpRight
        className={`relative z-10 h-4 w-4 shrink-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
          primary ? '' : 'group-hover:text-indigo-950'
        }`}
      />
      <span
        className={`absolute inset-0 -translate-x-full transition-transform duration-500 group-hover:translate-x-0 ${
          primary ? 'bg-white' : 'bg-teal-300'
        }`}
      />
    </a>
  );
}
