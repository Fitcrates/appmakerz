"use client";

import { useEffect, type RefObject } from "react";
import { scroll, useMotionValue } from "framer-motion";
import { useMediaQuery } from "./useMediaQuery";

/** A single observer gates both CSS animation and the desktop scroll driver. */
export function useHeroMotion(ref: RefObject<HTMLElement | null>) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const y = useMotionValue("0%");
  const cardsY = useMotionValue("0%");

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    let inView = false;
    let stopScroll: VoidFunction | undefined;

    const sync = () => {
      const active = inView && !document.hidden && !reducedMotion;
      hero.style.setProperty("--hero-animation-state", active ? "running" : "paused");
      hero.style.setProperty("--hero-will-change", active && desktop ? "transform" : "auto");

      if (active && desktop) {
        stopScroll ??= scroll((progress: number) => {
          y.set(`${progress * 25}%`);
          cardsY.set(`${progress * 15}%`);
        }, { target: hero, offset: ["start start", "end start"] });
      } else {
        stopScroll?.();
        stopScroll = undefined;
        // Keep the last desktop position while offscreen to avoid a jump.
        if (!desktop || reducedMotion) {
          y.set("0%");
          cardsY.set("0%");
        }
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(hero);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stopScroll?.();
      hero.style.removeProperty("--hero-animation-state");
      hero.style.removeProperty("--hero-will-change");
    };
  }, [ref, desktop, reducedMotion, y, cardsY]);

  return { y, cardsY, reducedMotion, desktopMotion: desktop && !reducedMotion };
}
