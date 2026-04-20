'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const STATIC_ROUTES = ['/', '/about-me', '/blog', '/faq', '/privacy-policy', '/unsubscribe'];
const globalPrefetchedRoutes = new Set<string>();
let manifestLoaded = false;

function scheduleIdleCallback(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }

  const timeoutId = globalThis.setTimeout(callback, 250);
  return () => globalThis.clearTimeout(timeoutId);
}

export default function GlobalRoutePrefetch() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const prefetchRoute = (route: string) => {
      if (!route.startsWith('/')) {
        return;
      }

      if (route === pathname) {
        return;
      }

      if (globalPrefetchedRoutes.has(route)) {
        return;
      }

      globalPrefetchedRoutes.add(route);
      router.prefetch(route);
    };

    const warmStaticRoutes = () => {
      STATIC_ROUTES.forEach(prefetchRoute);
    };

    const runPrefetch = async () => {
      if (manifestLoaded) {
        return;
      }

      manifestLoaded = true;

      try {
        const response = await fetch('/api/prefetch-routes', { credentials: 'same-origin' });
        if (!response.ok) {
          return;
        }

        const payload: unknown = await response.json();
        const routes = Array.isArray((payload as { routes?: unknown[] })?.routes)
          ? ((payload as { routes: unknown[] }).routes.filter((route): route is string => typeof route === 'string'))
          : [];

        for (const route of routes) {
          if (cancelled) {
            return;
          }

          prefetchRoute(route);
          await new Promise<void>((resolve) => window.setTimeout(resolve, 35));
        }
      } catch {
        manifestLoaded = false;
      }
    };

    warmStaticRoutes();
    const cancelIdle = scheduleIdleCallback(runPrefetch);

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [pathname, router]);

  return null;
}
