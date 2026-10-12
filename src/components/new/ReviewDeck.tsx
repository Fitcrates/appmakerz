'use client';

import { useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, type PanInfo, type Transition } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './ReviewDeck.module.css';

export interface DeckCard {
  id: string;
  node: React.ReactNode;
}

interface ReviewDeckProps {
  cards: DeckCard[];
  prevLabel: string;
  nextLabel: string;
  hint: string;
  /** Height of the card area; the fan of covered cards adds to it below. */
  className?: string;
}

const SWIPE_OFFSET = 110;
const SWIPE_VELOCITY = 450;
/** Cards deeper than this are fully behind the stack and hidden. */
const VISIBLE_DEPTH = 3;

// Resting pose by depth: each covered card sits a little lower, a little
// smaller and turned the other way from its neighbour, so the corners of the
// whole deck show under the top card.
const pose = (depth: number) => ({
  y: depth * 16,
  scale: 1 - depth * 0.045,
  rotate: depth === 0 ? 0 : (depth % 2 ? -1 : 1) * (1.2 + depth * 0.6),
  opacity: depth > VISIBLE_DEPTH ? 0 : 1,
});

const springTransition: Transition = { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 };
const exitTransition: Transition = { duration: 0.38, ease: [0.4, 0, 0.6, 1] };

interface DragLayerProps {
  children: React.ReactNode;
  draggable: boolean;
  exitDir: 1 | -1 | null;
  transition: Transition;
  onDragEnd: (event: unknown, info: PanInfo) => void;
  onExited: () => void;
}

// The drag layer tilts with the pointer: rotation is derived from x, so the
// card leans into a drag and keeps leaning as it flies off.
function DragLayer({ children, draggable, exitDir, transition, onDragEnd, onExited }: DragLayerProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 320], [-9, 9]);
  return (
    <motion.div
      className={`${styles.card} ${draggable ? styles.grab : ''}`}
      style={{ x, rotate }}
      drag={draggable ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.85}
      animate={exitDir ? { x: exitDir * 720, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={exitDir ? exitTransition : transition}
      onDragEnd={onDragEnd}
      onAnimationComplete={() => {
        if (!exitDir) return;
        // Back to centre while invisible, so the card fades in at the bottom
        // of the stack instead of sliding in from the side.
        x.jump(0);
        onExited();
      }}
    >
      {children}
    </motion.div>
  );
}

// A stack of cards the reader flips through: drag the top one away or use the
// arrows. Order is the only state; the swiped card animates out, then moves
// to the bottom of the stack and the rest spring forward one place.
export default function ReviewDeck({ cards, prevLabel, nextLabel, hint, className = '' }: ReviewDeckProps) {
  const reduceMotion = useReducedMotion();
  const [order, setOrder] = useState(() => cards.map((card) => card.id));
  const [exit, setExit] = useState<{ id: string; dir: 1 | -1 } | null>(null);

  const count = cards.length;
  const topIndex = cards.findIndex((card) => card.id === order[0]);
  const transition = reduceMotion ? { duration: 0 } : springTransition;

  const next = (dir: 1 | -1 = 1) => {
    if (exit || count < 2) return;
    if (reduceMotion) {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      return;
    }
    setExit({ id: order[0], dir });
  };

  const prev = () => {
    if (exit || count < 2) return;
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  };

  const finishExit = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
    setExit(null);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > SWIPE_OFFSET || Math.abs(velocity.x) > SWIPE_VELOCITY) {
      next(offset.x < 0 ? -1 : 1);
    }
  };

  return (
    <div className={className}>
      <div className="relative" style={{ paddingBottom: `${VISIBLE_DEPTH * 16}px` }}>
        <div className="relative h-[27rem]">
          {cards.map((card) => {
            const depth = order.indexOf(card.id);
            const isTop = depth === 0;
            const isExiting = exit?.id === card.id;
            return (
              // Outer layer: place in the stack. Inner layer: drag and exit,
              // so the swipe never fights the resting rotation.
              <motion.div
                key={card.id}
                className="absolute inset-0"
                style={{ zIndex: count - depth, transformOrigin: '50% 100%' }}
                initial={false}
                animate={pose(depth)}
                transition={transition}
                aria-hidden={!isTop}
                inert={!isTop}
              >
                <DragLayer
                  draggable={isTop && !exit}
                  exitDir={isExiting ? exit.dir : null}
                  transition={transition}
                  onDragEnd={onDragEnd}
                  onExited={finishExit}
                >
                  {card.node}
                </DragLayer>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <span className="font-oxanium text-sm tabular-nums text-white/60" aria-live="polite">
          <span className="text-teal-300">{String(topIndex + 1).padStart(2, '0')}</span>
          <span className="mx-1.5 text-white/30">/</span>
          {String(count).padStart(2, '0')}
        </span>
        <span className="hidden sm:block text-xs tracking-[0.12em] uppercase text-white/35">{hint}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={Boolean(exit)}
            aria-label={prevLabel}
            className="w-11 h-11 border border-white/20 flex items-center justify-center text-white transition-all hover:bg-teal-300 hover:border-teal-300 hover:text-indigo-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => next(1)}
            disabled={Boolean(exit)}
            aria-label={nextLabel}
            className="w-11 h-11 border border-white/20 flex items-center justify-center text-white transition-all hover:bg-teal-300 hover:border-teal-300 hover:text-indigo-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
