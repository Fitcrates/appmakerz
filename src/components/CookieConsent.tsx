import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  const content = {
    en: {
      message: 'We use cookies (Google Analytics) to analyze our website traffic. By continuing to use our website, you consent to our use of cookies.',
      accept: 'Accept',
      decline: 'Decline',
      privacyLink: 'Privacy Policy'
    },
    pl: {
      message: 'Używamy plików cookie (Google Analytics) do analizy ruchu na naszej stronie. Kontynuując korzystanie z naszej strony, wyrażasz zgodę na używanie plików cookie.',
      accept: 'Akceptuj',
      decline: 'Odrzuć',
      privacyLink: 'Polityka Prywatności'
    }
  };

  useEffect(() => {
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem('cookieConsent');
    if (!consentStatus) {
      setIsVisible(true);
    }

    // If consent was given, initialize GA
    if (consentStatus === 'accepted') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied'
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-8 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm flex-1">
          {content[language].message}{' '}
          <a href="#/privacy-policy" className="underline">
            {content[language].privacyLink}
          </a>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {content[language].decline}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {content[language].accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
