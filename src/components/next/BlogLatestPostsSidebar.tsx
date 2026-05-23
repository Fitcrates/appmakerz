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
  relatedServices?: any[];
}

type SidebarPosition = 'relative' | 'fixed' | 'bottom';

const SIDEBAR_TOP_OFFSET = 112;

export default function BlogLatestPostsSidebar({ currentPostId, language, posts, relatedServices = [] }: BlogLatestPostsSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SidebarPosition>('relative');
  const latestPosts = [...posts]
    .filter((item) => item._id !== currentPostId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

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

  if (!latestPosts.length && !relatedServices.length) {
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
        {relatedServices.length > 0 ? (
          <div className="mb-10 border border-white/10 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-teal-300/80">
              {language === 'pl' ? 'Powiązane usługi' : 'Related services'}
            </p>
            <h2 className="mt-3 font-oxanium text-lg font-light leading-snug text-white">
              {language === 'pl' ? 'Zobacz jak to wygląda w praktyce' : 'See how this works in practice'}
            </h2>
            <div className="mt-5 divide-y divide-white/10">
              {relatedServices.slice(0, 3).map((service) => {
                const title = getLocalizedText(service.title, language);
                const intro = getLocalizedText(service.intro, language);

                return (
                  <PrefetchLink
                    key={service._id}
                    href={localizedPath(language, `/uslugi/${service.slug.current}`)}
                    className="group flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-sm leading-snug text-white/75 transition-colors group-hover:text-teal-300">
                        {title}
                      </span>
                      {intro ? (
                        <span className="mt-2 line-clamp-2 block text-xs leading-relaxed text-white/35">
                          {intro}
                        </span>
                      ) : null}
                    </span>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-teal-300" />
                  </PrefetchLink>
                );
              })}
            </div>
          </div>
        ) : null}

        {latestPosts.length > 0 ? (
          <>
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
          </>
        ) : null}
      </div>
    </aside>
  );
}
