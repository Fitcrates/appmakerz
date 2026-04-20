// src/components/next/RouteTransitionProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import RouteTransitionDisplay from '@/components/next/RouteTransitionDisplay';

interface RouteTransitionContextValue {
  beginNavigation: (target?: string, navigate?: () => void) => void;
  endNavigation: () => void;
  isNavigating: boolean;
}

const RouteTransitionContext = createContext<
  RouteTransitionContextValue | undefined
>(undefined);

const PRE_COVER_DELAY_MS = 50;
const COVER_DURATION_MS = 830;
const NAVIGATE_DELAY_MS = 420;
const REVEAL_START_DELAY_MS = 0;
const REVEAL_DURATION_MS = 830;
const FAILSAFE_MS = 3500;

export default function RouteTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [phase, setPhase] = useState<
    'idle' | 'pre-cover' | 'cover' | 'hold' | 'reveal'
  >('idle');
  const [navigationTarget, setNavigationTarget] = useState<
    string | undefined
  >(undefined);
  const [snapshotMarkup, setSnapshotMarkup] = useState<string | null>(null);
  const [snapshotScrollY, setSnapshotScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const activeNavigationId = useRef(0);
  const coverStartTimerRef = useRef<number | null>(null);
  const coverTimerRef = useRef<number | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const revealStartTimerRef = useRef<number | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);
  const navigationOriginRef = useRef('');
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const navigateTriggeredRef = useRef(false);
  const incomingReadyRef = useRef(false);
  const isNavigatingRef = useRef(false);
  const phaseRef = useRef(phase);

  const clearTransitionTimers = () => {
    if (coverStartTimerRef.current !== null) {
      window.clearTimeout(coverStartTimerRef.current);
      coverStartTimerRef.current = null;
    }
    if (coverTimerRef.current !== null) {
      window.clearTimeout(coverTimerRef.current);
      coverTimerRef.current = null;
    }
    if (navigateTimerRef.current !== null) {
      window.clearTimeout(navigateTimerRef.current);
      navigateTimerRef.current = null;
    }
    if (revealStartTimerRef.current !== null) {
      window.clearTimeout(revealStartTimerRef.current);
      revealStartTimerRef.current = null;
    }
    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
  };

  const clearFailsafeTimer = () => {
    if (failsafeTimerRef.current !== null) {
      window.clearTimeout(failsafeTimerRef.current);
      failsafeTimerRef.current = null;
    }
  };

  const clearAllTimers = () => {
    clearTransitionTimers();
    clearFailsafeTimer();
  };

  const cleanupTransition = (navigationId?: number) => {
    if (
      navigationId !== undefined &&
      activeNavigationId.current !== navigationId
    ) {
      return;
    }

    clearAllTimers();
    pendingNavigationRef.current = null;
    navigateTriggeredRef.current = false;
    incomingReadyRef.current = false;
    isNavigatingRef.current = false;
    setIsNavigating(false);
    setNavigationTarget(undefined);
    setSnapshotMarkup(null);
    setSnapshotScrollY(0);
    phaseRef.current = 'idle';
    setPhase('idle');
  };

  const startReveal = (navigationId: number) => {
    if (activeNavigationId.current !== navigationId) {
      return;
    }
    if (
      phaseRef.current === 'reveal' ||
      phaseRef.current === 'idle' ||
      !incomingReadyRef.current
    ) {
      return;
    }

    phaseRef.current = 'reveal';
    setPhase('reveal');
    cleanupTimerRef.current = window.setTimeout(() => {
      cleanupTransition(navigationId);
    }, REVEAL_DURATION_MS);
  };

  const captureSnapshot = () => {
    const root = contentRef.current;
    if (!root) return;

    const clone = root.cloneNode(true) as HTMLDivElement;
    clone.removeAttribute('data-route-transition-live');
    clone.removeAttribute('data-route-transition-phase');
    clone.style.removeProperty('--route-live-intensity');
    clone.style.removeProperty('--route-live-resolve');
    clone.querySelectorAll('[data-route-transition-live]').forEach((node) => {
      if (node instanceof HTMLElement) {
        node.removeAttribute('data-route-transition-live');
        node.removeAttribute('data-route-transition-phase');
        node.style.removeProperty('--route-live-intensity');
        node.style.removeProperty('--route-live-resolve');
      }
    });

    setSnapshotMarkup(clone.outerHTML);
    setSnapshotScrollY(window.scrollY);
  };

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    isNavigatingRef.current = isNavigating;
  }, [isNavigating]);

  useEffect(() => {
    if (!isNavigating) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNavigating]);

  useEffect(() => {
    if (!isNavigatingRef.current) return;
    if (
      pathname === navigationOriginRef.current ||
      !navigateTriggeredRef.current
    ) {
      return;
    }

    incomingReadyRef.current = true;
    if (phaseRef.current === 'hold') {
      const navigationId = activeNavigationId.current;
      if (revealStartTimerRef.current !== null) {
        window.clearTimeout(revealStartTimerRef.current);
      }
      revealStartTimerRef.current = window.setTimeout(() => {
        startReveal(navigationId);
      }, REVEAL_START_DELAY_MS);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isNavigating) {
      clearFailsafeTimer();
      return;
    }

    const navigationId = activeNavigationId.current;
    clearFailsafeTimer();
    failsafeTimerRef.current = window.setTimeout(() => {
      if (activeNavigationId.current !== navigationId) return;
      incomingReadyRef.current = true;

      if (phaseRef.current === 'reveal') {
        return;
      }

      if (
        phaseRef.current === 'cover' ||
        phaseRef.current === 'hold' ||
        phaseRef.current === 'pre-cover'
      ) {
        startReveal(navigationId);
      } else {
        cleanupTransition(navigationId);
      }
    }, FAILSAFE_MS);

    return clearFailsafeTimer;
  }, [isNavigating]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return (
    <RouteTransitionContext.Provider
      value={{
        beginNavigation: (target, navigate) => {
          if (isNavigatingRef.current) {
            return;
          }

          activeNavigationId.current += 1;
          const navigationId = activeNavigationId.current;
          navigationOriginRef.current = pathname;
          clearAllTimers();
          captureSnapshot();
          pendingNavigationRef.current = navigate || null;
          navigateTriggeredRef.current = false;
          incomingReadyRef.current = false;
          setNavigationTarget(target);
          isNavigatingRef.current = true;
          setIsNavigating(true);

          // Mount overlay with blocks in initial hidden position
          phaseRef.current = 'pre-cover';
          setPhase('pre-cover');

          // After browser paints the initial state, trigger cover animation
          coverStartTimerRef.current = window.setTimeout(() => {
            if (activeNavigationId.current !== navigationId) return;
            phaseRef.current = 'cover';
            setPhase('cover');

            navigateTimerRef.current = window.setTimeout(() => {
              if (activeNavigationId.current !== navigationId) return;
              navigateTriggeredRef.current = true;
              phaseRef.current = 'hold';
              setPhase('hold');
              if (coverTimerRef.current !== null) {
                window.clearTimeout(coverTimerRef.current);
                coverTimerRef.current = null;
              }
              pendingNavigationRef.current?.();
              pendingNavigationRef.current = null;
            }, NAVIGATE_DELAY_MS);

            coverTimerRef.current = window.setTimeout(() => {
              if (activeNavigationId.current !== navigationId) return;
              if (phaseRef.current === 'cover') {
                phaseRef.current = 'hold';
                setPhase('hold');
              }
            }, COVER_DURATION_MS);
          }, PRE_COVER_DELAY_MS);
        },
        endNavigation: () => {
          cleanupTransition();
        },
        isNavigating,
      }}
    >
      {isNavigating && (
        <RouteTransitionDisplay
          target={navigationTarget}
          variant="overlay"
          phase={phase === 'idle' ? 'pre-cover' : phase}
          snapshotMarkup={snapshotMarkup}
          snapshotScrollY={snapshotScrollY}
        />
      )}
      <div
        ref={contentRef}
        data-route-transition-live
        data-route-transition-phase={isNavigating ? phase : 'idle'}
        className="route-transition-live"
      >
        {children}
      </div>
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const ctx = useContext(RouteTransitionContext);
  if (!ctx) {
    throw new Error(
      'useRouteTransition must be used within RouteTransitionProvider',
    );
  }
  return ctx;
}
