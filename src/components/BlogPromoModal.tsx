import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const BlogPromoModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].modalblog;

  useEffect(() => {
    // Check if user has already seen the modal in this session
    const modalShown = sessionStorage.getItem('blogModalShown');
    if (modalShown) {
      setHasShown(true);
      return;
    }

    const handleScroll = () => {
      const contactElement = document.getElementById('contact');
      if (contactElement && !hasShown) {
        const rect = contactElement.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
 
        const isPartiallyVisible = 
          (rect.top <= windowHeight && rect.top + 100 >= 0) || 
          (rect.bottom >= 0 && rect.bottom <= windowHeight);
        
        if (isPartiallyVisible) {
          setIsVisible(true);
          setHasShown(true);
          // Save to session storage to avoid showing again
          sessionStorage.setItem('blogModalShown', 'true');
        }
      }
    };

    // Throttle scroll event to improve performance
    let scrollTimeout;
    const throttledScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 200);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    
    // Initial check in case the element is already in view on page load
    setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimeout);
    };
  }, [hasShown]);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 animate-fadeIn">
      <div className="relative bg-[#140F2D] text-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md mx-4 ring-1 ring-teal-300/30 w-full sm:w-[40rem] animate-scaleIn border-t border-white/10 overflow-hidden">
        
        <button 
          className="absolute top-3 right-3 text-white hover:text-black hover:bg-teal-300 rounded-full px-3 py-1 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300"
          onClick={closeModal}
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <div className="flex flex-col items-center text-center gap-4 sm:gap-8 relative z-10">
          <h3 className="text-2xl sm:text-3xl font-bold mt-6 font-jakarta tracking-tight text-white">{t.heading}</h3>
          
          <p className="mb-2 sm:mb-4 text-left font-jakarta font-light leading-relaxed text-white/90 text-base sm:text-lg">{t.subtitle}</p>
          
          <Link 
            to="/blog" 
            className="inline-block GlowButton relative group overflow-hidden "
            onClick={closeModal}
          >
            <span className="relative z-10 font-jakarta">{t.button}</span>
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPromoModal;
