import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { usePrefetchRoute } from '../../hooks/usePrefetchRoute';
import { X, ArrowUpRight } from 'lucide-react';

const BlogPromoModalNew = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { language } = useLanguage();
  const t = translations[language].modalblog;
  const prefetchRoute = usePrefetchRoute();

  const handleMouseEnter = (path: string) => {
    prefetchRoute(path);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  useEffect(() => {
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
          sessionStorage.setItem('blogModalShown', 'true');
        }
      }
    };
    
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
    const initialCheckTimeout = setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      clearTimeout(initialCheckTimeout);
    };
  }, [hasShown]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-indigo-950/95 backdrop-blur-sm" 
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-indigo-950 border border-white/10 p-8 sm:p-12 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-teal-300/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-teal-300/50" />
              
              <div className="text-center">
                {/* Label */}
                <span className="text-xs tracking-[0.3em] uppercase text-teal-300 font-jakarta mb-4 block">
                  Blog
                </span>

                {/* Heading */}
                <h3 className="text-3xl sm:text-4xl font-light text-white font-jakarta mb-6">
                  {t.heading}
                </h3>
                
                {/* Description */}
                <p className="text-white/50 font-jakarta font-light leading-relaxed mb-8">
                  {t.subtitle}
                </p>
                
                {/* CTA Button */}
                <Link 
                  to="/blog" 
                  className="group inline-flex items-center gap-4"
                  onMouseEnter={() => handleMouseEnter('/blog')}
                  onClick={closeModal}
                >
                  <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
                    {t.button}
                  </span>
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogPromoModalNew;
