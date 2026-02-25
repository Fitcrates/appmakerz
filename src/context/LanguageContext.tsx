import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  // Check localStorage first
  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'pl') {
    return stored;
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('pl')) {
    return 'pl';
  }
  
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    // Persist language to localStorage whenever it changes
    localStorage.setItem('language', language);
    
    // Update HTML lang attribute for accessibility and SEO
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
