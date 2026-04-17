'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { trackCookieConsentDecision, updateAnalyticsConsent } from '../../utils/gtm';

const COOKIE_CONSENT_KEY = 'cookieConsent';

const persistConsent = (value: 'accepted' | 'declined') => {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  document.cookie = `${COOKIE_CONSENT_KEY}=${value}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax`;
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
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!consentStatus) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consentStatus === 'accepted') {
      loadAnalytics();
    } else {
      updateAnalyticsConsent(false);
    }
  }, []);

  const loadAnalytics = async () => {
    updateAnalyticsConsent(true);
  };

  const handleAccept = async () => {
    setIsLoading(true);
    persistConsent('accepted');
    await loadAnalytics();
    trackCookieConsentDecision('accepted');
    setIsLoading(false);
    setIsVisible(false);
  };

  const handleDecline = () => {
    persistConsent('declined');
    updateAnalyticsConsent(false);
    trackCookieConsentDecision('declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:px-6"
        >
          <div
            className="relative w-full max-w-xl bg-indigo-950/95 border border-white/10 p-6 shadow-2xl"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-teal-300/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-teal-300/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-teal-300/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-teal-300/50" />

          

            {/* Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-300/10 flex items-center justify-center rounded-full">
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
            <div className="flex  gap-3 max-w-sm justify-center mx-auto ">
              <button
                onClick={handleDecline}
                disabled={isLoading}
                className="flex-1  px-4 py-2.5 text-sm font-jakarta text-white/60 border border-white/10 hover:border-white/30 hover:text-white transition-all disabled:opacity-50"
              >
                {content[language].decline}
              </button>
              <button
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1   px-4 py-2.5 text-sm font-jakarta font-medium text-indigo-950 bg-teal-300 hover:bg-teal-200 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
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
