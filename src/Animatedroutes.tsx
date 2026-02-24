import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Lazy load components
const App = lazy(() => import('./App'));
const Blog = lazy(() => import('./BlogNew'));
const StudioPage = lazy(() => import('./StudioPage'));
const BlogPostPage = lazy(() => import('./components/new/BlogPostPageNew'));
const PrivacyPolicy = lazy(() => import('./components/new/PrivacyPolicyNew'));
const ProjectDetails = lazy(() => import('./components/new/ProjectDetailsNew'));
const Unsubscribe = lazy(() => import('./pages/UnsubscribeNew'));
const NotFound = lazy(() => import('./components/NotFound'));


// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen bg-[#140F2D] text-white flex items-center justify-center">
  Loading...
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
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
          path="/studio/*"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <StudioPage />
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