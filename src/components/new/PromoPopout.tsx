'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useLanguage } from '../../context/LanguageContext';
import { localizedPath } from '../../lib/i18n-routing';
import type { Language } from '../../lib/language';

export interface PromoPopoutContent {
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  tabLabel: string;
}

export interface PromoPopoutProps {
  id: string;
  href: string;
  hideOn: string[];
  delaySeconds: number;
  snoozeDays: number;
  content: Record<Language, PromoPopoutContent>;
}

// Never on top of the cookie banner: until the visitor has answered it, the
// panel keeps waiting.
const CONSENT_KEY = 'cookieConsent';
const CONSENT_POLL_MS = 2_000;

const labels = {
  en: { open: 'Show offer', close: 'Close', collapse: 'Fold away' },
  pl: { open: 'Pokaż ofertę', close: 'Zamknij', collapse: 'Zwiń' },
} as const;

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Without storage the panel simply slides in again on the next visit.
  }
};

const stripLanguage = (pathname: string) => pathname.replace(/^\/(en|pl)(?=\/|$)/, '') || '/';

// A campaign panel managed in Sanity (promoPopout). It slides in from the
// right edge once, after a delay. The tab's chevron only folds it back to the
// edge (and stops it sliding in by itself for snoozeDays); the X, or following
// the link, dismisses it: the panel and its tab are gone for snoozeDays.
//
// The panel is rendered on the server, collapsed, so its title, text and link
// are in the page markup. It is not a modal: a <dialog> sits in the browser's
// top layer, above the cursor aura, which then disappeared over it.
export default function PromoPopout({ id, href, hideOn, delaySeconds, snoozeDays, content }: PromoPopoutProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // The graphic is only mounted once the panel has been opened, so visitors
  // who never see it never download it.
  const [opened, setOpened] = useState(false);
  // 'pending' until the browser has checked storage: the tab stays invisible
  // meanwhile, so a visitor who dismissed it never sees it flash back.
  const [status, setStatus] = useState<'pending' | 'active' | 'dismissed'>('pending');

  const storageKey = `promoPopout:${id}`;
  const dismissKey = `${storageKey}:dismissed`;
  const hidden = hideOn.includes(stripLanguage(pathname ?? '/'));

  useEffect(() => {
    if (hidden) return;

    let timer: ReturnType<typeof setTimeout>;
    // Deferred to a task so the state change does not run synchronously
    // inside the effect.
    timer = setTimeout(() => {
      if (Number(readStorage(dismissKey)) > Date.now()) {
        setStatus('dismissed');
        return;
      }
      setStatus('active');
      if (Number(readStorage(storageKey)) > Date.now()) return;
      timer = setTimeout(waitForConsent, delaySeconds * 1000);
    }, 0);

    const waitForConsent = () => {
      if (readStorage(CONSENT_KEY)) {
        setOpen(true);
        setOpened(true);
      } else {
        timer = setTimeout(waitForConsent, CONSENT_POLL_MS);
      }
    };
    return () => clearTimeout(timer);
  }, [hidden, storageKey, dismissKey, delaySeconds]);

  if (hidden || status === 'dismissed') return null;

  const t = content[language];
  const ui = labels[language];
  const external = /^https?:\/\//i.test(href);
  const target = external ? href : localizedPath(language, href);

  const snoozeUntil = () => String(Date.now() + snoozeDays * 24 * 60 * 60 * 1000);
  const show = () => {
    setOpen(true);
    setOpened(true);
  };
  const collapse = () => {
    setOpen(false);
    writeStorage(storageKey, snoozeUntil());
  };
  const dismiss = () => {
    setOpen(false);
    writeStorage(storageKey, snoozeUntil());
    writeStorage(dismissKey, snoozeUntil());
    setStatus('dismissed');
  };

  const linkProps = {
    onClick: dismiss,
    ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  };
  const LinkTag = external ? 'a' : PrefetchLink;

  return (
    <aside
      aria-label={t.title}
      className={`fixed right-0 top-1/2 z-40 flex items-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${open ? '-translate-y-1/2' : '-translate-y-1/2 translate-x-(--panel-w)'} ${status === 'pending' ? 'invisible' : ''}`}
      style={{ '--panel-w': 'min(20rem, calc(100vw - 3.5rem))' } as React.CSSProperties}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) collapse();
      }}
    >
      {/* The tab travels with the panel: it sits on its left edge while open
          and is all that is left at the screen edge once it is folded. */}
      <button
        type="button"
        onClick={open ? collapse : show}
        aria-expanded={open}
        aria-controls="promo-popout-panel"
        aria-label={open ? ui.collapse : `${ui.open}: ${t.tabLabel}`}
        className="flex w-10 shrink-0 flex-col items-center gap-3 rounded-l-xl border border-r-0 border-white/10 bg-[#242150] py-4 text-white/80 transition-colors hover:text-teal-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-300/60"
      >
        {open ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
        <span className="font-oxanium text-[11px] uppercase tracking-[0.18em] [writing-mode:vertical-rl]">{t.tabLabel}</span>
      </button>

      <div
        id="promo-popout-panel"
        inert={!open}
        className="relative flex max-h-[calc(100dvh-11rem)] w-(--panel-w) flex-col overflow-y-auto overscroll-contain rounded-l-xl border border-r-0 border-white/10 bg-[#242150] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        {/* On a short screen the graphic gives way, not the text: it shrinks
            (letterboxed, never cropped, since it carries its own lettering) so
            the title and button always fit without scrolling the panel. The
            11rem cap keeps clear of the header above and the chat button below. */}
        <LinkTag
          href={target}
          {...linkProps}
          className="relative block min-h-0 w-full shrink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-300/60"
          style={{ aspectRatio: `${t.imageWidth} / ${t.imageHeight}` }}
        >
          {opened && t.imageUrl ? (
            // Plain <img>: the Sanity CDN already resizes and converts it.
            // Absolute, so it follows the box as it shrinks instead of holding
            // its own height.
            <img
              src={t.imageUrl}
              alt={t.imageAlt}
              width={t.imageWidth}
              height={t.imageHeight}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : null}
        </LinkTag>

        <button
          type="button"
          onClick={dismiss}
          aria-label={ui.close}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-indigo-950/70 text-white/80 backdrop-blur-xs transition-colors hover:border-teal-300 hover:bg-teal-300 hover:text-indigo-950 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-300/60"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="shrink-0 p-5">
          {t.eyebrow ? (
            <span className="block text-[11px] uppercase tracking-[0.18em] text-teal-300">{t.eyebrow}</span>
          ) : null}
          <p className={`font-oxanium text-lg font-light leading-snug text-white ${t.eyebrow ? 'mt-2' : ''}`}>{t.title}</p>
          {t.body ? <p className="mt-2 text-sm font-light leading-relaxed text-white/65">{t.body}</p> : null}
          {t.ctaLabel ? (
            <LinkTag
              href={target}
              {...linkProps}
              className="mt-4 block bg-teal-300 px-5 py-3 text-center text-sm text-indigo-950 transition-colors hover:bg-teal-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#242150]"
            >
              {t.ctaLabel}
            </LinkTag>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
