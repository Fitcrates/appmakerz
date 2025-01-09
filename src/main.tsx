import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
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
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-12 w-12 text-teal-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <p className="text-lg font-semibold animate-pulse">
                  Loading, please wait...
                </p>
              </div>
            </div>
          }
        >
          <AnimatedRoutes />
        </React.Suspense>
      </Router>
    </LanguageProvider>
  </StrictMode>
);
