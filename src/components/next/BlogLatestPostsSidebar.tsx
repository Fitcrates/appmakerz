'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
}

export default function BlogLatestPostsSidebar({ currentPostId, language, posts }: BlogLatestPostsSidebarProps) {
  const [isFixed, setIsFixed] = useState(false);
  const latestPosts = [...posts]
    .filter((item) => item._id !== currentPostId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);

  useEffect(() => {
    const updateFixedState = () => {
      const marker = document.getElementById('blog-content-start');
      if (!marker) return;

      setIsFixed(marker.getBoundingClientRect().top <= 112);
    };

    updateFixedState();
    window.addEventListener('scroll', updateFixedState, { passive: true });
    window.addEventListener('resize', updateFixedState);

    return () => {
      window.removeEventListener('scroll', updateFixedState);
      window.removeEventListener('resize', updateFixedState);
    };
  }, []);

  if (!latestPosts.length) {
    return null;
  }

  return (
    <aside className="hidden xl:col-start-3 xl:row-start-2 xl:block">
      <div className={`${isFixed ? 'fixed right-[max(2rem,calc(50%_-_38rem))] top-28 z-30 w-[17.5rem]' : 'relative'} max-h-[calc(100vh-8rem)] overflow-y-auto pr-1`}>
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
    </aside>
  );
}
