'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea, summary, label';
const TEXT_INPUT_SELECTOR = 'input, textarea, select';

export default function CursorAura() {
  const auraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const aura = auraRef.current;
    if (!aura || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let frameId: number | null = null;
    let x = 0;
    let y = 0;

    const moveAura = () => {
      aura.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frameId = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      const target = event.target instanceof Element ? event.target : null;
      const isInteractive = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      aura.classList.toggle('cursor-aura--active', isInteractive);
      aura.classList.toggle('cursor-aura--text', isInteractive && Boolean(target?.closest(TEXT_INPUT_SELECTOR)));

      if (frameId === null) {
        frameId = requestAnimationFrame(moveAura);
      }
    };

    const handlePointerLeave = () => {
      aura.classList.remove('cursor-aura--visible', 'cursor-aura--active', 'cursor-aura--text');
    };

    const handlePointerEnter = () => {
      aura.classList.add('cursor-aura--visible');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.documentElement.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.documentElement.removeEventListener('pointerenter', handlePointerEnter);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return <div ref={auraRef} className="cursor-aura" aria-hidden="true" />;
}
