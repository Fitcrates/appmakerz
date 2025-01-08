import React, { Suspense, lazy } from 'react';

// Import critical components normally
import Header from './components/Header';
import Hero from './components/Hero';

// Lazy load non-critical components
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));

// Loading fallback for below-the-fold content
const LoadingFallback = () => <div className="h-screen animate-pulse bg-gray-100" />;

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="relative">
          <Hero />
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
}

export default App;
