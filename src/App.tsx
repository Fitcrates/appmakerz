import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AutoRefreshHandler from './utils/AutoRefreshHandler';
import BlogPromoModal from './components/BlogPromoModal';



// Import critical components normally
const LoadingFallback = () => <div className="h-screen bg-[#140F2D]" />;

// Lazy load below-the-fold components
const About = lazy(() => import('./components/About'));
const Timeline = lazy(() => import('./components/Timeline'));

const Projects = lazy(() => import('./components/Projects'));
const PricingComponent = lazy(() => import('./components/PricingComponent'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));

function App() {
  return (
    <div className="bg-[#140F2D] min-h-screen">
      <AutoRefreshHandler />
      <Header />
    
      <main>
        <Hero />
    
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Timeline />
        </Suspense>
      
        
        <Suspense fallback={<LoadingFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <PricingComponent />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <BlogPromoModal />
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
