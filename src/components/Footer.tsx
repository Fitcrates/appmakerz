import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import NewsletterModal from './NewsletterModal';
import { ChevronUp } from 'lucide-react';
import { usePrefetchRoute } from '../hooks/usePrefetchRoute';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const prefetchRoute = usePrefetchRoute();

  const handleMouseEnter = (path: string) => {
    prefetchRoute(path);
  };

  return (
    <>
      <footer className="relative bg-[#140F2D] text-white py-8 md:py-12 font-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/20 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 gap-6 md:gap-0">
              <div className="text-sm text-white/80 space-y-2">
                <p>{t.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
                <p>{t.graphicDesign}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                
                <Link 
                  to="/blog"
                  onMouseEnter={() => handleMouseEnter('/blog')}
                  className="text-sm text-white/80 hover:text-teal-300 transition-colors"
                >
                  {t.blog}
                </Link>
                <Link 
                  to="/privacy-policy"
                  onMouseEnter={() => handleMouseEnter('/privacy-policy')}
                  className="text-sm text-white/80 hover:text-teal-300 transition-colors"
                >
                  {t.privacyPolicy}
                </Link>
                
                {/* Newsletter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Newsletter <ChevronUp className="ml-1 w-4 h-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute bottom-full mb-2 w-40 bg-[#140F2D] ring-1 ring-white/40 text-white shadow-lg rounded-lg">
                      <button
                        onClick={() => setIsNewsletterOpen(true)}
                        className="block w-full text-left px-4 py-2 text-sm hover:text-teal-300 hover:bg-[#3e3766] rounded-lg"
                      >
                        {t.newsletter}
                      </button>
                      <Link
                        to="/unsubscribe"
                        onMouseEnter={() => handleMouseEnter('/unsubscribe')}
                        className="block w-full text-left px-4 py-2 text-sm hover:text-teal-300 hover:bg-[#3e3766] rounded-lg"
                      >
                        {t.unsubscribe}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </>
  );
};

export default Footer;
