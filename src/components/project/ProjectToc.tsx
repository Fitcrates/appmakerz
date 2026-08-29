'use client';

import { useEffect, useRef, useState } from 'react';
import type { TocEntry } from '@/components/project/sectionModel';

interface ProjectTocProps {
  entries: TocEntry[];
  label: string;
}

/**
 * In-page navigation for the project page.
 *
 * Two surfaces, one component: a fixed rail on wide screens (dots that expand
 * into labels on hover) and a scroll progress line at the top of the viewport
 * everywhere else. Both are position-fixed, so full-bleed sections keep their
 * full width - no layout column is reserved for navigation.
 */
export default function ProjectToc({ entries, label }: ProjectTocProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };

    const onScroll = () => {
      if (!frame.current) {
        frame.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!entries.length) {
      return;
    }

    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!targets.length) {
      return;
    }

    // Highlights the heading closest to the top of the reading area, which
    // behaves better than "first intersecting" on short sections.
    const observer = new IntersectionObserver(
      () => {
        const marker = window.innerHeight * 0.3;
        let current = '';

        targets.forEach((element) => {
          if (element.getBoundingClientRect().top <= marker) {
            current = element.id;
          }
        });

        setActiveId(current || targets[0].id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: [0, 1] }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [entries]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
    setActiveId(id);
  };

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[110] h-[2px] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-teal-300/60 to-teal-300"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {entries.length > 1 ? (
        <nav
          aria-label={label}
          className="group/rail fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:block"
        >
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => {
              const isActive = entry.id === activeId;

              return (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    onClick={(event) => handleClick(event, entry.id)}
                    className="flex items-center gap-3 py-0.5"
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span
                      className={`h-px transition-all duration-300 ${
                        isActive
                          ? 'w-8 bg-teal-300'
                          : entry.level === 2
                            ? 'w-3 bg-white/20 group-hover/rail:bg-white/40'
                            : 'w-5 bg-white/25 group-hover/rail:bg-white/50'
                      }`}
                      aria-hidden="true"
                    />
                    {/* Labels stay hidden until the rail is hovered, so they
                        never sit on top of the content at narrower desktops. */}
                    <span
                      className={`max-w-[15rem] truncate border border-white/10 bg-indigo-950/90 px-2.5 py-1 font-plex opacity-0 backdrop-blur-sm transition-all duration-300 -translate-x-1 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 ${
                        entry.level === 2 ? 'text-[11px]' : 'text-xs'
                      } ${isActive ? 'border-teal-300/30 text-teal-300' : 'text-white/60'}`}
                    >
                      {entry.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
