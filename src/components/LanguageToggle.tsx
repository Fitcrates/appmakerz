import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
      className="fixed top-4 right-4 z-50 px-3 py-8 rounded-md bg-white/30 text-white hover:bg-teal-300 transition-colors"
    >
      {language === 'en' ? 'PL' : 'EN'}
    </button>
  );
};
