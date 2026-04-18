'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_LANGUAGE, type Language } from '../lib/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getPreferredClientLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const url = new URL(window.location.href);
  const langFromQuery = url.searchParams.get('lang');
  if (langFromQuery === 'en' || langFromQuery === 'pl') {
    return langFromQuery;
  }

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

const getInitialLanguage = (initialLanguage?: Language): Language => initialLanguage || DEFAULT_LANGUAGE;

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language }> = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage(initialLanguage));

  useEffect(() => {
    const preferredLanguage = getPreferredClientLanguage();
    if (preferredLanguage !== language) {
      setLanguage(preferredLanguage);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('language', language);
    document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Lax`;
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
