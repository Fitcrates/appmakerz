import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;

  return (
    <footer className="bg-[#140F2D] text-white py-8 md:py-12 font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/20 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-6 md:gap-0">
            <div className="text-sm text-white/80 space-y-2">
              <p>{t.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
              <p>{t.graphicDesign}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <a 
                href="/pricing" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {t.pricing}
              </a>
              <a 
                href="/blog" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {t.blog}
              </a>
              <a 
                href="/privacy-policy" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {t.privacyPolicy}
              </a>
              <a 
                href="/unsubscribe" 
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
{t.unsubscribe}              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;