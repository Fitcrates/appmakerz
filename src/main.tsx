import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';

// Lazy load EmailJS initialization
const initEmailJs = async () => {
  const emailjs = await import('@emailjs/browser');
  const { EMAIL_CONFIG } = await import('./config/email.config');
  emailjs.default.init(EMAIL_CONFIG.PUBLIC_KEY);
};

// Initialize EmailJS after initial render
window.requestIdleCallback?.(() => {
  initEmailJs();
}) ?? setTimeout(initEmailJs, 1000);

// Lazy load routes
const AnimatedRoutes = React.lazy(() => import('./Animatedroutes'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Router>
          <AnimatedRoutes />
      </Router>
    </LanguageProvider>
  </StrictMode>
);
