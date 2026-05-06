'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ScrollBlurOverlay() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);

      // Znika po krótkim czasie braku aktywności scrolla
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isScrolling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 z-[40] bg-gradient-to-t from-indigo-950/80 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black_20%,transparent)]"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
