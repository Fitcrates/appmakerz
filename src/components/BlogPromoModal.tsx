import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { usePrefetchRoute } from '../hooks/usePrefetchRoute';
import { X } from 'lucide-react';

const BlogPromoModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].modalblog;
  const prefetchRoute = usePrefetchRoute();

  const handleMouseEnter = (path: string) => {
    prefetchRoute(path);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsVisible(false);
  };

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
          console.log("Contact element visible, showing modal"); // Debug log
          setIsVisible(true);
          setHasShown(true);
          // Save to session storage to avoid showing again
          sessionStorage.setItem('blogModalShown', 'true');
        }
      }
    };
    
    // Throttle scroll event to improve performance
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
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
    const initialCheckTimeout = setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      clearTimeout(initialCheckTimeout);
    };
  }, [hasShown]);
  
  // Don't render anything if modal should not be visible
  if (!isVisible) return null;

  const handleContentClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 touch-none"
      onClick={closeModal}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90" />
      
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="relative bg-[#140F2D] text-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md mx-4 ring-1 ring-teal-300/30 w-full sm:w-[40rem] animate-scaleIn border-t border-white/10 overflow-hidden"
          onClick={handleContentClick}
          onTouchStart={handleContentClick}
          onTouchMove={handleContentClick}
          onTouchEnd={handleContentClick}
        >
          {/* Header with close button on the right */}
          <div className="flex items-center justify-between mb-4">
            <div></div> {/* Empty div to push the button to the right */}
            <button
              onClick={closeModal}
              className="p-2 hover:bg-teal-300 text-white hover:text-black rounded-full transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col items-center text-center gap-4 sm:gap-8 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-jakarta tracking-tight text-white">{t.heading}</h3>
            
            <p className="mb-2 sm:mb-4 text-left font-jakarta font-light leading-relaxed text-white/90 text-base sm:text-lg">{t.subtitle}</p>
            
            <Link 
              to="/blog" 
              className="inline-block GlowButton relative"
              onMouseEnter={() => handleMouseEnter('/blog')}
              onClick={closeModal}
            >
              <span className="relative z-10 font-jakarta">{t.button}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPromoModal;
