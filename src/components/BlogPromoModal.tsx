import React, { useState, useEffect, useRef } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
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
  
  // Separate useEffect for click outside detection
  useEffect(() => {
    // Only add listeners if the modal is visible
    if (!isVisible) return;
    
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      // Simple check - if modal exists and click is outside it
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    // Add events with a small delay to avoid immediate triggering
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isVisible]);
  
  // Don't render anything if modal should not be visible
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 animate-fadeIn">
      <div 
        ref={modalRef} 
        className="relative bg-[#140F2D] text-white rounded-lg shadow-xl p-4 sm:p-8 max-w-md mx-4 ring-1 ring-teal-300/30 w-full sm:w-[40rem] animate-scaleIn border-t border-white/10 overflow-hidden"
      >
        <button 
  className="absolute top-2 right-2 text-white bg-teal-300/10 hover:text-black hover:bg-teal-300 rounded-full  p-3 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer "
  onClick={closeModal}
  onTouchStart={(e) => {
    e.preventDefault(); 
    closeModal();
  }}
  aria-label="Close modal"
  style={{ WebkitTapHighlightColor: 'transparent' }}
>
<X className="h-5 w-5" />
</button>
        
        <div className="flex flex-col items-center text-center gap-4 sm:gap-8 relative z-10 mt-4">
          <h3 className="text-2xl sm:text-3xl font-bold mt-6 font-jakarta tracking-tight text-white">{t.heading}</h3>
          
          <p className="mb-2 sm:mb-4 text-left font-jakarta font-light leading-relaxed text-white/90 text-base sm:text-lg">{t.subtitle}</p>
          
          <Link 
            to="/blog" 
            className="inline-block GlowButton relative "
            onMouseEnter={() => handleMouseEnter('/blog')}
            onClick={closeModal}
          >
            <span className="relative z-10 font-jakarta">{t.button}</span>
            
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPromoModal;
