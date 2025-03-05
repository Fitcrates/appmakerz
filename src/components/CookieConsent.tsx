import React, { useEffect, useState, Suspense } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const content = {
    en: {
      message: 'We use cookies (Google Analytics) to analyze our website traffic. By continuing to use our website, you consent to our use of cookies.',
      accept: 'Accept',
      decline: 'Decline',
      privacyLink: 'Privacy Policy',
    },
    pl: {
      message: 'Używamy plików cookie (Google Analytics) do analizy ruchu na naszej stronie. Kontynuując korzystanie z naszej strony, wyrażasz zgodę na używanie plików cookie.',
      accept: 'Akceptuj',
      decline: 'Odrzuć',
      privacyLink: 'Polityka Prywatności',
    },
  };

  useEffect(() => {
    const consentStatus = localStorage.getItem('cookieConsent');
    if (!consentStatus) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else if (consentStatus === 'accepted') {
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = async () => {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
      });
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XY59Q6HJSJ';
      script.async = true;
      
      const loadPromise = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });

      document.head.appendChild(script);
      await loadPromise;

      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    localStorage.setItem('cookieConsent', 'accepted');
    await loadAnalytics();
    setIsLoading(false);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
      });
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#140F2D] backdrop-blur-sm border-t border-white/40"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white">
              {content[language].message}{' '}
              <a 
                href="#/privacy-policy" 
                className="text-teal-300 hover:text-teal-500 underline transition-colors"
              >
                {content[language].privacyLink}
              </a>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-white  rounded-md transition-colors"
                disabled={isLoading}
              >
                {content[language].decline}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-black bg-teal-300 hover:bg-teal-400 rounded-md transition-colors disabled:opacity-75"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {content[language].accept}
                  </span>
                ) : (
                  content[language].accept
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
