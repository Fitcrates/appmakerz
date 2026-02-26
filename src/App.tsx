import { Suspense, lazy } from 'react';
import HeaderNew from './components/new/HeaderNew';
import HeroNew from './components/new/HeroNew';
import { CursorGlowProvider } from './context/CursorGlowContext';
import './styles/new-design.css';

const LoadingFallback = () => (
  <div className="min-h-[50vh] bg-indigo-950" />
);

const TechStackNew = lazy(() => import('./components/new/TechStackNew'));
const AboutNew = lazy(() => import('./components/new/AboutNew'));
const ProjectsNew = lazy(() => import('./components/new/ProjectsNew'));
const ServicesNew = lazy(() => import('./components/new/ServicesNew'));

const ContactNew = lazy(() => import('./components/new/ContactNew'));
const FooterNew = lazy(() => import('./components/new/FooterNew'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const SystemsIBuild = lazy(() => import('./components/new/SystemsIBuild'));

function App() {
  return (
    <CursorGlowProvider>
      <div className="bg-indigo-950 min-h-screen">
        <HeaderNew />
        
        <main>
          <HeroNew />
          
          <Suspense fallback={<LoadingFallback />}>
            <TechStackNew />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <AboutNew />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <ProjectsNew />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <ServicesNew />
          </Suspense>

      
          
          <Suspense fallback={<LoadingFallback />}>
            <SystemsIBuild />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <ContactNew />
          </Suspense>
        </main>

        <Suspense fallback={<LoadingFallback />}>
          <FooterNew />
        </Suspense>

        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </div>
    </CursorGlowProvider>
  );
}

export default App;
