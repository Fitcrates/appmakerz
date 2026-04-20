'use client';

import { createContext, useContext, useEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import RouteTransitionDisplay from '@/components/next/RouteTransitionDisplay';

interface RouteTransitionContextValue {
  beginNavigation: (target?: string, navigate?: () => void) => void;
  endNavigation: () => void;
  isNavigating: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | undefined>(undefined);

const COVER_START_DELAY_MS = 24;
const COVER_MS = 1125;
const REVEAL_MS = 720;
const FAILSAFE_MS = 10000;

export default function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [isNavigating, setIsNavigating] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'pre-cover' | 'cover' | 'hold' | 'reveal'>('idle');
  const [navigationTarget, setNavigationTarget] = useState<string | undefined>(undefined);
  const activeNavigationId = useRef(0);
  const coverStartTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const navigationOriginRef = useRef('');
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const clearTimer = (timerRef: MutableRefObject<number | null>) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearAllTimers = () => {
    clearTimer(coverStartTimerRef);
    clearTimer(revealTimerRef);
    clearTimer(finishTimerRef);
    clearTimer(failsafeTimerRef);
    clearTimer(navigateTimerRef);
  };

  const startReveal = () => {
    clearTimer(revealTimerRef);
    clearTimer(finishTimerRef);
    setPhase('reveal');

    const navigationId = activeNavigationId.current;
    finishTimerRef.current = window.setTimeout(() => {
      if (activeNavigationId.current !== navigationId) {
        return;
      }

      setIsNavigating(false);
      setNavigationTarget(undefined);
      setPhase('idle');
    }, REVEAL_MS);
  };

  useEffect(() => {
    if (!isNavigating) {
      return;
    }

    const currentLocation = `${pathname}?${searchKey}`;
    if ((phase !== 'cover' && phase !== 'hold') || currentLocation === navigationOriginRef.current) {
      return;
    }

    startReveal();
  }, [pathname, searchKey, isNavigating, phase]);

  useEffect(() => {
    if (!isNavigating) {
      clearAllTimers();
      return;
    }

    const navigationId = activeNavigationId.current;
    clearTimer(failsafeTimerRef);
    failsafeTimerRef.current = window.setTimeout(() => {
      if (activeNavigationId.current !== navigationId) {
        return;
      }

      startReveal();
    }, FAILSAFE_MS);

    return clearAllTimers;
  }, [isNavigating]);

  return (
    <RouteTransitionContext.Provider
      value={{
        beginNavigation: (target, navigate) => {
          activeNavigationId.current += 1;
          navigationOriginRef.current = `${pathname}?${searchKey}`;
          clearAllTimers();
          pendingNavigationRef.current = navigate || null;
          setNavigationTarget(target);
          setIsNavigating(true);
          setPhase('pre-cover');

          const navigationId = activeNavigationId.current;
          coverStartTimerRef.current = window.setTimeout(() => {
            if (activeNavigationId.current !== navigationId) {
              return;
            }

            setPhase('cover');
          }, COVER_START_DELAY_MS);

          navigateTimerRef.current = window.setTimeout(() => {
            if (activeNavigationId.current !== navigationId) {
              return;
            }

            setPhase('hold');
            pendingNavigationRef.current?.();
            pendingNavigationRef.current = null;
          }, COVER_START_DELAY_MS + COVER_MS);
        },
        endNavigation: () => {
          clearAllTimers();
          pendingNavigationRef.current = null;
          setIsNavigating(false);
          setNavigationTarget(undefined);
          setPhase('idle');
        },
        isNavigating,
      }}
    >
      {isNavigating ? (
        <RouteTransitionDisplay
          target={navigationTarget}
          variant="overlay"
          phase={phase === 'idle' ? 'pre-cover' : phase}
        />
      ) : null}
      {children}
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error('useRouteTransition must be used within a RouteTransitionProvider');
  }

  return context;
}
