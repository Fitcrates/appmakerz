import { useCallback } from 'react';

// Map of route paths to their corresponding lazy components
const routeComponents: Record<string, () => Promise<any>> = {
  '/': () => import('../App'),
  '/blog': () => import('../Blog'),
  '/pricing': () => import('../Pricing'),
  '/studio': () => import('../StudioPage'),
  '/privacy': () => import('../components/PrivacyPolicy'),
  '/unsubscribe': () => import('../pages/Unsubscribe'),
  '/subscriber-list': () => import('../pages/SubscriberList'),
};

export const usePrefetchRoute = () => {
  const prefetchRoute = useCallback((path: string) => {
    const component = routeComponents[path];
    if (component) {
      // Start loading the component
      component();
    }
  }, []);

  return prefetchRoute;
};
