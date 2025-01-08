import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Lazy load components
const App = lazy(() => import('./App'));
const Blog = lazy(() => import('./Blog'));
const Pricing = lazy(() => import('./Pricing'));
const StudioPage = lazy(() => import('./StudioPage'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
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
        path="/pricing"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Pricing />
          </Suspense>
        }
      />
      <Route
        path="/studio"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <StudioPage />
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
    </Routes>
  );
};

export default AnimatedRoutes;
