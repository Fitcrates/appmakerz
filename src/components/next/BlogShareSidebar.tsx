'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaRedditAlien } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { Language } from '@/lib/language';
import { translations } from '@/translations/translations';

interface BlogShareSidebarProps {
  language: Language;
  title: string;
  variant?: 'desktop' | 'mobile';
}

export default function BlogShareSidebar({ language, title, variant = 'desktop' }: BlogShareSidebarProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const t = translations[language].blog.post;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (variant !== 'desktop') return;

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
  }, [variant]);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = useMemo(() => [
    {
      label: t.shareOnFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF aria-hidden="true" className="h-4 w-4" />,
    },
    {
      label: t.shareOnX,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaXTwitter aria-hidden="true" className="h-4 w-4" />,
    },
    {
      label: t.shareOnReddit,
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <FaRedditAlien aria-hidden="true" className="h-4 w-4" />,
    },
    {
      label: t.shareOnLinkedIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <FaLinkedinIn aria-hidden="true" className="h-4 w-4" />,
    },
  ], [encodedTitle, encodedUrl, t.shareOnFacebook, t.shareOnLinkedIn, t.shareOnReddit, t.shareOnX]);

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col items-center gap-3 border-b border-white/10 pb-8 xl:hidden">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/35">
          {t.share}
        </p>
        <div className="flex gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={link.label}
              title={link.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition-colors duration-200 hover:border-teal-300 hover:bg-teal-300 hover:text-indigo-950"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden xl:col-start-1 xl:row-start-2 xl:block">
      <div className={`${isFixed ? 'fixed left-[max(2rem,calc(50%_-_38rem))] top-28 z-30 w-[4.5rem]' : 'relative'} flex flex-col items-center gap-4`}>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/35">
          {t.share}
        </p>
        <div className="flex flex-col gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={link.label}
              title={link.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition-colors duration-200 hover:border-teal-300 hover:bg-teal-300 hover:text-indigo-950"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
