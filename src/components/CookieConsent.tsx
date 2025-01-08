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
      setIsVisible(true);
    } else if (consentStatus === 'accepted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
      });
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XY59Q6HJSJ';
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
      });
    };
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied',
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div>
        {content[language].message}{' '}
        <a href="#/privacy-policy" className="underline">
          {content[language].privacyLink}
        </a>
      </div>
      <div>
        <button onClick={handleDecline}>{content[language].decline}</button>
        <button onClick={handleAccept}>{content[language].accept}</button>
      </div>
    </div>
  );
};

export default CookieConsent;
