import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Lazy load components
const App = lazy(() => import('./App'));
const Blog = lazy(() => import('./BlogNew'));
const BlogPostPage = lazy(() => import('./components/new/BlogPostPageNew'));
const PrivacyPolicy = lazy(() => import('./components/new/PrivacyPolicyNew'));
const ProjectDetails = lazy(() => import('./components/new/ProjectDetailsNew'));
const Unsubscribe = lazy(() => import('./pages/UnsubscribeNew'));
const NotFound = lazy(() => import('./components/NotFound'));
const FAQPage = lazy(() => import('./components/new/FAQNew'));
const ServiceLandingPage = lazy(() => import('./components/new/ServiceLandingPageNew'));
const AboutMePage = lazy(() => import('./components/new/AboutMePageNew'));


// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen bg-[#140F2D] text-white flex items-center justify-center">
  Loading...
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const warmUpRoutes = () => {
      void import('./components/new/FAQNew');
      void import('./components/new/AboutMePageNew');
      void import('./components/new/ServiceLandingPageNew');
    };

    const requestIdle = (globalThis as { requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number }).requestIdleCallback;
    const cancelIdle = (globalThis as { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback;

    if (requestIdle && cancelIdle) {
      const idleCallback = requestIdle(warmUpRoutes, { timeout: 2000 });
      return () => cancelIdle(idleCallback);
    }

    const timeoutId = setTimeout(warmUpRoutes, 1200);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;

    const targetId = decodeURIComponent(location.hash.slice(1));
    if (!targetId) return;

    let attempts = 0;
    const maxAttempts = 40;
    const headerOffset = 92;

    const scrollToHashTarget = () => {
      const element = document.getElementById(targetId);

      if (element) {
        const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        window.setTimeout(scrollToHashTarget, 80);
      }
    };

    scrollToHashTarget();
  }, [location.pathname, location.hash]);

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <App />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Blog />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPostPage />
            </Suspense>
          }
        />
        <Route
          path="/project/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProjectDetails />
            </Suspense>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route
          path="/faq"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FAQPage />
            </Suspense>
          }
        />
        <Route
          path="/about-me"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AboutMePage />
            </Suspense>
          }
        />
        <Route
          path="/uslugi/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ServiceLandingPage />
            </Suspense>
          }
        />
        <Route
          path="/unsubscribe"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Unsubscribe />
            </Suspense>
          }
        />
        {/* Catch-all route for 404 Not Found */}
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
