import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  author: string;
  text: string;
  source: string;
  quote: (text: string) => string;
  ratingLabel: string;
  readMoreLabel: string;
  closeLabel: string;
  motionProps: Record<string, unknown>;
}

const Stars = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 text-teal-300" role="img" aria-label={label}>
    {Array.from({ length: 5 }, (_, star) => (
      <Star key={star} className="w-4 h-4 fill-current" aria-hidden="true" />
    ))}
  </div>
);

// Reviews vary from two lines to several paragraphs. The card clamps the
// text so the row stays even, and only when it actually overflows offers the
// full review in a native dialog (focus trap, Escape and backdrop for free).
export default function ReviewCard({
  author,
  text,
  source,
  quote,
  ratingLabel,
  readMoreLabel,
  closeLabel,
  motionProps,
}: ReviewCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  // Feeds the hover edge light. Only CSS variables change, so moving the
  // cursor never re-renders the card.
  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    // Subgrid: cards in one row share the parent's row tracks (stars, quote,
    // caption), so the divider above the author lines up across the row even
    // when one source label wraps to two lines and another does not.
    <motion.figure
      {...motionProps}
      className={`ac-card ac-card--sm ${styles.glow} row-span-3 grid grid-rows-[subgrid] gap-y-0 p-6 sm:p-8`}
      onPointerMove={trackPointer}
    >
      <Stars label={ratingLabel} />
      <blockquote className="mt-5 flex-1">
        <p ref={textRef} className="line-clamp-[8] whitespace-pre-line font-light leading-relaxed text-white/80">
          {quote(text)}
        </p>
        {overflows ? (
          <button
            type="button"
            onClick={open}
            className="mt-3 text-sm text-teal-300 underline decoration-teal-300/40 underline-offset-4 transition-colors hover:text-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60 rounded-sm"
          >
            {readMoreLabel}
          </button>
        ) : null}
      </blockquote>
      <figcaption className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col gap-1.5">
        <span className="font-oxanium text-white">{author}</span>
        <span className="text-[11px] tracking-[0.12em] uppercase text-white/60">{source}</span>
      </figcaption>

      {overflows ? (
        <dialog
          ref={dialogRef}
          aria-label={author}
          onClick={(event) => {
            // A click on the dialog element itself is a click on the backdrop.
            if (event.target === dialogRef.current) close();
          }}
          className="m-auto w-[min(42rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-[var(--ac-card-radius)] border border-white/10 bg-indigo-950 p-0 text-white backdrop:bg-indigo-950/80 backdrop:backdrop-blur-sm"
        >
          <div className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <Stars label={ratingLabel} />
              <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="-mr-2 -mt-2 p-2 text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60 rounded-sm"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-6 whitespace-pre-line font-light leading-relaxed text-white/85">{quote(text)}</p>
            <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-oxanium text-white">{author}</span>
              <span className="text-[11px] tracking-[0.12em] uppercase text-white/60">{source}</span>
            </div>
          </div>
        </dialog>
      ) : null}
    </motion.figure>
  );
}
