import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex rounded-full overflow-hidden bg-white/10 border border-white/20">
      <button
        onClick={() => setLanguage('en')}
        className={` transition-colors ${
          language === 'en'
            ? 'bg-teal-300 text-black rounded-full px-4'
            : 'text-white hover:text-teal-300 px-1'
        }`}
      >
        ENG
      </button>
      <button
        onClick={() => setLanguage('pl')}
        className={`  transition-colors ${
          language === 'pl'
            ? 'bg-teal-300 text-black rounded-full px-4'
            : 'text-white hover:text-teal-300 px-1'
        }`}
      >
        PL
      </button>
    </div>
  );
};

export default LanguageToggle;
