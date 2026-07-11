'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import type { Language } from '@/lib/language';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { urlFor } from '@/lib/sanity.image';
import { translations } from '@/translations/translations';

interface BlogLatestPostsSidebarProps {
  currentPostId: string;
  language: Language;
  posts: any[];
  toc?: { text: string; id: string }[];
}

type SidebarPosition = 'relative' | 'fixed' | 'bottom';

const SIDEBAR_TOP_OFFSET = 112;

export default function BlogLatestPostsSidebar({ currentPostId, language, posts, toc = [] }: BlogLatestPostsSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SidebarPosition>('relative');
  const [activeId, setActiveId] = useState<string>('');

  const latestPosts = [...posts]
    .filter((item) => item._id !== currentPostId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  useEffect(() => {
    if (!toc.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    const updateSidebarPosition = () => {
      const marker = document.getElementById('blog-content-start');
      const sidebar = sidebarRef.current;

      if (!marker || !sidebar) return;

      const markerRect = marker.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;

      if (markerRect.top > SIDEBAR_TOP_OFFSET) {
        setPosition('relative');
        return;
      }

      if (markerRect.bottom <= SIDEBAR_TOP_OFFSET + sidebarHeight) {
        setPosition('bottom');
        return;
      }

      setPosition('fixed');
    };

    updateSidebarPosition();
    window.addEventListener('scroll', updateSidebarPosition, { passive: true });
    window.addEventListener('resize', updateSidebarPosition);

    return () => {
      window.removeEventListener('scroll', updateSidebarPosition);
      window.removeEventListener('resize', updateSidebarPosition);
    };
  }, []);

  if (!toc.length && !latestPosts.length) {
    return null;
  }

  const sidebarPositionClass = {
    relative: 'relative',
    fixed: 'fixed right-[max(2rem,calc(50%_-_38rem))] top-28 z-30 w-[17.5rem]',
    bottom: 'absolute bottom-0 right-0 w-[17.5rem]',
  }[position];

  return (
    <aside className="relative hidden xl:col-start-3 xl:row-start-2 xl:block xl:self-stretch">
      <div ref={sidebarRef} className={`${sidebarPositionClass} max-h-[calc(100vh-8rem)] overflow-y-auto pr-1`}>
        {toc.length > 0 ? (
          <div className="mb-10">
            <h2 className="border-b border-white/10 pb-4 text-sm font-light text-white/75">
              {language === 'pl' ? 'Spis treści' : 'Table of Contents'}
            </h2>
            <div className="mt-5 space-y-3">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm transition-colors ${
                    activeId === item.id ? 'text-teal-300 font-medium' : 'text-white/50 hover:text-teal-300'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {latestPosts.length > 0 ? (
          <div className="mb-10">
            <h2 className="border-b border-white/10 pb-4 text-sm font-light text-white/75">
              {translations[language].blog.post.latestPosts}
            </h2>
            <div className="mt-5 space-y-5">
              {latestPosts.map((latestPost) => {
                const title = getLocalizedText(latestPost.title, language);
                const imageUrl = latestPost.mainImage ? urlFor(latestPost.mainImage).width(96).height(72).fit('crop').auto('format').url() : '';

                return (
                  <PrefetchLink
                    key={latestPost._id}
                    href={localizedPath(language, `/blog/${latestPost.slug.current}`)}
                    className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-3"
                  >
                    <div className="relative h-16 overflow-hidden bg-white/5">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-sm leading-snug text-white/75 transition-colors duration-200 group-hover:text-teal-300">
                        {title}
                      </h3>
                      <p className="mt-1 text-[0.68rem] uppercase tracking-[0.08em] text-white/30">
                        {new Date(latestPost.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </PrefetchLink>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
