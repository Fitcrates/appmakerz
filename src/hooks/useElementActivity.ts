"use client";

import { useEffect, useState, type RefObject } from "react";

/** Gate optional animation work by both viewport and browser-tab visibility. */
export function useElementActivity(ref: RefObject<HTMLElement | null>, enabled = true) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let inView = false;
    const sync = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, enabled]);

  return enabled && active;
}
