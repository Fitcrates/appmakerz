'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { isLanguage, type Language } from '@/lib/language';
import { translations } from '@/translations/translations';

/**
 * The one image zoom of the site, shared by project pages and the blog so
 * both behave and look the same.
 *
 * It works in the manner of medium-zoom: the picture grows out of its place
 * on the page and shrinks back into it on close. A click anywhere, Escape,
 * the wheel or scrolling the page closes it. Built on the native <dialog>:
 * showModal() puts it in the top layer and traps focus.
 *
 * Thumbnails are found through `data-zoom-src` (set it to the item's
 * `fullSrc` on the inline <img>), so any image of a set can be the one the
 * zoom flies back to, and cropped (object-fit: cover) thumbnails unfold into
 * the whole picture instead of stretching.
 */

export interface LightboxItem {
  /** Large rendition, loaded only once the lightbox opens. */
  fullSrc: string;
  alt: string;
  caption?: string;
}

const LABELS = {
  pl: { close: 'Zamknij', prev: 'Poprzednie zdjęcie', next: 'Następne zdjęcie' },
  en: { close: 'Close', prev: 'Previous image', next: 'Next image' },
} as const;

const DURATION = 300;
const EASING = 'cubic-bezier(0.2, 0, 0.2, 1)';
/** Corner radius of the zoomed picture, the rounded-xl of the inline images. */
const RADIUS = 12;
/** Pixels a scroll or swipe has to cover before it counts as leaving the zoom. */
const SCROLL_CLOSE_THRESHOLD = 60;

/** Round control, the same in every corner of the lightbox. */
const CONTROL_CLASS =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-teal-300/60 hover:bg-white/20 hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300';

interface View {
  index: number;
  /** Width / height. Null until either the thumbnail or the full image has loaded. */
  aspect: number | null;
  /** Already in the cache, shown while the large rendition loads. */
  thumbSrc: string;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Where a thumbnail sits on screen, and what of it is visible. */
interface Origin {
  /** The whole picture as laid out, crop included. */
  content: Rect;
  /** The part of it actually showing: the element box, for a cover-fitted image. */
  visible: Rect;
  radius: number;
}

export function findThumb(item: LightboxItem | undefined): HTMLImageElement | null {
  if (!item || typeof document === 'undefined') return null;
  const candidates = document.querySelectorAll<HTMLImageElement>('img[data-zoom-src]');
  return Array.from(candidates).find((img) => img.dataset.zoomSrc === item.fullSrc) ?? null;
}

function viewOf(items: LightboxItem[], index: number): View {
  const thumb = findThumb(items[index]);
  const aspect = thumb && thumb.naturalWidth > 0 ? thumb.naturalWidth / thumb.naturalHeight : null;
  return { index, aspect, thumbSrc: thumb?.currentSrc || thumb?.src || '' };
}

/** First rounded corner on the thumbnail or the frame clipping it. */
function cornerRadius(element: HTMLElement): number {
  let node: HTMLElement | null = element;
  for (let depth = 0; node && depth < 3; depth += 1) {
    const radius = parseFloat(getComputedStyle(node).borderTopLeftRadius);
    if (radius > 0) return radius;
    node = node.parentElement;
  }
  return 0;
}

function originOf(img: HTMLImageElement): Origin | null {
  const box = img.getBoundingClientRect();
  if (box.width === 0 || box.bottom < 0 || box.top > window.innerHeight) return null;

  const aspect = img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 0;
  const fit = getComputedStyle(img).objectFit;
  let content: Rect = { left: box.left, top: box.top, width: box.width, height: box.height };

  if (aspect && (fit === 'cover' || fit === 'contain')) {
    const wider = aspect > box.width / box.height;
    const fillWidth = fit === 'cover' ? !wider : wider;
    const width = fillWidth ? box.width : box.height * aspect;
    const height = fillWidth ? box.width / aspect : box.height;
    content = { left: box.left + (box.width - width) / 2, top: box.top + (box.height - height) / 2, width, height };
  }

  const left = Math.max(box.left, content.left);
  const top = Math.max(box.top, content.top);
  const visible = {
    left,
    top,
    width: Math.min(box.right, content.left + content.width) - left,
    height: Math.min(box.bottom, content.top + content.height) - top,
  };
  return { content, visible, radius: cornerRadius(img) };
}

/** Where the zoomed image sits: as large as fits, leaving room for the controls. */
function stageRect(aspect: number, viewport: { width: number; height: number }): Rect {
  const padX = viewport.width < 640 ? 16 : 88;
  const padTop = 72;
  const padBottom = viewport.width < 640 ? 88 : 80;
  const availableWidth = Math.max(viewport.width - padX * 2, 1);
  const availableHeight = Math.max(viewport.height - padTop - padBottom, 1);
  const width = Math.min(availableWidth, availableHeight * aspect);
  const height = width / aspect;
  return {
    left: (viewport.width - width) / 2,
    top: padTop + (availableHeight - height) / 2,
    width,
    height,
  };
}

const REST_CLIP = `inset(0px 0px 0px 0px round ${RADIUS}px)`;

/**
 * The frame that lays the stage over a thumbnail: a uniform scale onto the
 * whole picture, and a clip down to the part of it the thumbnail shows.
 */
function frameAt(stage: DOMRect, origin: Origin): Keyframe {
  const { content, visible } = origin;
  const scale = content.width / stage.width;
  const top = (visible.top - content.top) / scale;
  const left = (visible.left - content.left) / scale;
  const bottom = (content.top + content.height - visible.top - visible.height) / scale;
  const right = (content.left + content.width - visible.left - visible.width) / scale;
  return {
    transform: `translate(${content.left - stage.left}px, ${content.top - stage.top}px) scale(${scale})`,
    clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round ${origin.radius / scale}px)`,
  };
}

function motionDuration(): number {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DURATION;
}

function useLanguage(language?: Language): Language {
  const params = useParams();
  if (language) return language;
  const fromRoute = params?.lang;
  return typeof fromRoute === 'string' && isLanguage(fromRoute) ? fromRoute : 'pl';
}

/** The "click to zoom" line under zoomable images, worded the same everywhere. */
export function ZoomHint({ language, className = '' }: { language?: Language; className?: string }) {
  const lang = useLanguage(language);
  return (
    <p className={`flex items-center justify-center gap-1.5 font-plex text-xs font-light text-white/60 sm:text-sm ${className}`}>
      <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{translations[lang].projects.clickToZoom}</span>
    </p>
  );
}

/**
 * `open(index)` zooms that item of `items`; render `lightbox` anywhere, it
 * portals itself to the body.
 */
export function useImageLightbox(items: LightboxItem[], language?: Language) {
  const lang = useLanguage(language);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<Origin | null>(null);
  const closingRef = useRef(false);
  const previousIndexRef = useRef<number | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const labels = LABELS[lang] ?? LABELS.en;
  const count = items.length;
  const isOpen = view !== null;

  const open = useCallback(
    (index: number) => {
      if (!items[index]) return;
      const thumb = findThumb(items[index]);
      originRef.current = thumb ? originOf(thumb) : null;
      closingRef.current = false;
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setView(viewOf(items, index));
    },
    [items]
  );

  const step = useCallback(
    (delta: number) => {
      setView((value) => (value === null ? value : viewOf(items, (value.index + delta + count) % count)));
    },
    [items, count]
  );

  // State is reset here rather than from the dialog's `close` event: that event
  // is queued as a task and some embedded browsers never deliver it, which
  // left the dialog mounted.
  const close = useCallback(() => {
    const dialog = dialogRef.current;
    const stage = stageRef.current;
    if (!view || !dialog || closingRef.current) return;
    closingRef.current = true;

    const finish = () => {
      dialog.close();
      setView(null);
    };
    const duration = motionDuration();
    const options: KeyframeAnimationOptions = { duration, easing: EASING, fill: 'forwards' };
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], options);
    chromeRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { ...options, duration: duration / 2 });

    if (!stage || duration === 0) {
      finish();
      return;
    }
    const thumb = findThumb(items[view.index]);
    const origin = thumb ? originOf(thumb) : null;
    const keyframes: Keyframe[] = origin
      ? [{ transform: 'none', clipPath: REST_CLIP }, frameAt(stage.getBoundingClientRect(), origin)]
      : [{ opacity: 1 }, { opacity: 0, transform: 'scale(0.96)' }];
    stage.animate(keyframes, options).onfinish = finish;
  }, [view, items]);

  // Open: show the dialog and grow the image out of the thumbnail. A layout
  // effect, so the first painted frame is already the thumbnail-sized one.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    if (!dialog.open) dialog.showModal();

    const duration = motionDuration();
    const options = { duration, easing: EASING };
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], options);
    chromeRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], options);

    const stage = stageRef.current;
    const origin = originRef.current;
    if (stage && origin) {
      stage.animate([frameAt(stage.getBoundingClientRect(), origin), { transform: 'none', clipPath: REST_CLIP }], options);
    } else {
      stage?.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], options);
    }
  }, [isOpen]);

  // Stepping through a set: a short fade, the slide needs no flight path.
  const currentIndex = view?.index ?? null;
  useLayoutEffect(() => {
    const previous = previousIndexRef.current;
    previousIndexRef.current = currentIndex;
    if (previous === null || currentIndex === null || previous === currentIndex) return;
    stageRef.current?.animate(
      [
        { opacity: 0, transform: 'scale(0.97)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: motionDuration() * 0.7, easing: EASING }
    );
  }, [currentIndex]);

  // The thumbnail of whichever image is up is hidden, so the zoomed copy reads
  // as that same picture lifted off the page, not a duplicate.
  useLayoutEffect(() => {
    if (currentIndex === null) return;
    const thumb = findThumb(items[currentIndex]);
    if (!thumb) return;
    thumb.style.visibility = 'hidden';
    return () => {
      thumb.style.visibility = '';
    };
  }, [currentIndex, items]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    // Escape fires `cancel` synchronously; route it through close() so it
    // animates like every other way out.
    const handleCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    // Scrolling the page means the visitor has moved on. Only past a
    // threshold: momentum or a smooth scroll still settling when the image
    // was clicked would otherwise close it as it opens.
    const startY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - startY) > SCROLL_CLOSE_THRESHOLD) close();
    };
    // A modal dialog swallows the wheel instead of scrolling the page, so the
    // gesture itself closes it. Events from the first moments are skipped, they
    // are momentum from before the click; ctrl+wheel is a pinch on a trackpad.
    const openedAt = performance.now();
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && performance.now() - openedAt > DURATION) close();
    };
    // On touch, a one-finger drag past the threshold is a swipe away; two
    // fingers are a pinch to look closer and are left alone.
    let touchStartY: number | null = null;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || event.touches.length !== 1) return;
      if (Math.abs(event.touches[0].clientY - touchStartY) > SCROLL_CLOSE_THRESHOLD) close();
    };
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('wheel', handleWheel, { passive: true });
    dialog.addEventListener('touchstart', handleTouchStart, { passive: true });
    dialog.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('wheel', handleWheel);
      dialog.removeEventListener('touchstart', handleTouchStart);
      dialog.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, close]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (count < 2) return;
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  };

  const item = view ? items[view.index] : null;
  // Until anything has loaded, a 16:10 box: the full image corrects it on load.
  const rect = view ? stageRect(view.aspect ?? 1.6, viewport) : null;

  const lightbox: ReactNode =
    view && item && rect
      ? createPortal(
          <dialog
            ref={dialogRef}
            onKeyDown={onKeyDown}
            aria-label={item.alt}
            // Anywhere but a control closes, the image included: there is
            // nothing to do on the zoomed picture except look at it.
            onClick={(event) => {
              if (!(event.target as HTMLElement).closest('button')) close();
            }}
            className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none cursor-zoom-out overflow-hidden bg-transparent p-0 text-white backdrop:bg-transparent"
          >
            <div ref={backdropRef} className="absolute inset-0 bg-indigo-950/95 backdrop-blur-md" />

            <div
              ref={stageRef}
              className="absolute origin-top-left"
              style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, clipPath: REST_CLIP }}
            >
              <StageImage
                key={item.fullSrc}
                item={item}
                thumbSrc={view.thumbSrc}
                onAspect={(aspect) =>
                  setView((value) =>
                    value && value.index === view.index && value.aspect === null ? { ...value, aspect } : value
                  )
                }
              />
            </div>

            <div ref={chromeRef}>
              <button type="button" onClick={close} aria-label={labels.close} autoFocus className={`absolute right-4 top-4 sm:right-6 sm:top-5 ${CONTROL_CLASS}`}>
                <X className="h-5 w-5" />
              </button>

              <div className="absolute inset-x-4 bottom-5 flex flex-col items-center gap-3 sm:bottom-6">
                {item.caption ? (
                  <p className="max-w-2xl rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-center font-plex text-sm font-light text-white/80 backdrop-blur-md">
                    {item.caption}
                  </p>
                ) : null}
                {count > 1 ? (
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-plex text-xs font-light tabular-nums tracking-wide text-white/70 backdrop-blur-md notranslate">
                    {view.index + 1} / {count}
                  </span>
                ) : null}
              </div>

              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={labels.prev}
                    className={`absolute bottom-4 left-4 sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2 ${CONTROL_CLASS}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={labels.next}
                    className={`absolute bottom-4 right-4 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 ${CONTROL_CLASS}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
          </dialog>,
          document.body
        )
      : null;

  return { open, isOpen, lightbox };
}

/**
 * The cached thumbnail scaled up straight away, with the large rendition
 * fading in over it once loaded, so the zoom never starts on an empty box.
 */
function StageImage({
  item,
  thumbSrc,
  onAspect,
}: {
  item: LightboxItem;
  thumbSrc: string;
  onAspect: (aspect: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {thumbSrc ? (
        <img src={thumbSrc} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain" />
      ) : null}
      <img
        src={item.fullSrc}
        alt={item.alt}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth > 0) onAspect(img.naturalWidth / img.naturalHeight);
          setLoaded(true);
        }}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}
