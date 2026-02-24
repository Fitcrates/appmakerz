import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Type for gtag function
type GtagFunction = (command: string, action: string, params: Record<string, string>) => void;

// Helper to safely call gtag
const callGtag = (command: string, action: string, params: Record<string, string>) => {
  const gtag = (window as unknown as { gtag?: GtagFunction }).gtag;
  if (typeof gtag === 'function') {
    gtag(command, action, params);
  }
};

const CookieConsentNew: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const content = {
    en: {
      message: 'We use cookies to analyze website traffic and improve your experience.',
      accept: 'Accept',
      decline: 'Decline',
      privacyLink: 'Privacy Policy',
    },
    pl: {
      message: 'Używamy plików cookie do analizy ruchu i poprawy jakości usług.',
      accept: 'Akceptuj',
      decline: 'Odrzuć',
      privacyLink: 'Polityka Prywatności',
    },
  };

  useEffect(() => {
    const consentStatus = localStorage.getItem('cookieConsent');
    if (!consentStatus) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consentStatus === 'accepted') {
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = async () => {
    // Check if gtag already exists
    const existingGtag = (window as unknown as { gtag?: GtagFunction }).gtag;
    if (typeof existingGtag === 'function') {
      callGtag('consent', 'update', { 'analytics_storage': 'granted' });
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

      callGtag('consent', 'update', { 'analytics_storage': 'granted' });
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
    callGtag('consent', 'update', { 'analytics_storage': 'denied' });
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50"
        >
          <div className="relative bg-indigo-950/95 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-teal-300/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-teal-300/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-teal-300/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-teal-300/50" />

            {/* Close button */}
            <button
              onClick={handleDecline}
              className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-300/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-teal-300" />
              </div>
              <span className="text-xs text-white/30 font-jakarta tracking-widest uppercase">
                Cookies
              </span>
            </div>

            {/* Message */}
            <p className="text-white/60 font-jakarta text-sm leading-relaxed mb-6">
              {content[language].message}{' '}
              <a 
                href="/privacy-policy" 
                className="text-teal-300 hover:text-teal-200 transition-colors"
              >
                {content[language].privacyLink}
              </a>
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-jakarta text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all disabled:opacity-50"
              >
                {content[language].decline}
              </button>
              <button
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm font-jakarta font-medium text-indigo-950 bg-teal-300 hover:bg-teal-200 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-950/30 border-t-indigo-950 rounded-full animate-spin" />
                    <span>{content[language].accept}</span>
                  </>
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

export default CookieConsentNew;
