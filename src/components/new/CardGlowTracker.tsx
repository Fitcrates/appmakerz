'use client';

import { useEffect } from 'react';

// Feeds the hover edge light of cards in .ac-glow-scope (rounded-cards.css).
// One listener for the whole page instead of a handler on every card; only two
// CSS variables change, so nothing re-renders.
export default function CardGlowTracker() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const card = target?.closest?.('.ac-glow-scope .ac-card') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  return null;
}
