import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from './LanguageToggle';
import { usePrefetchRoute } from '../hooks/usePrefetchRoute';
import { translations } from '../translations/translations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const prefetchRoute = usePrefetchRoute();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: index * 0.1 + 0.3, 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for spring-like effect
      }
    }),
    exit: { 
      opacity: 0, 
      x: -20, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      } 
    }
  };

  const menuBackgroundVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  const menuPanelVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: "0%",
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      x: "100%",
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const buttonVariants = {
    tap: { scale: 0.95 }
  };

  // Smooth scrolling polyfill
  const smoothScrollTo = (targetY: number, duration = 500) => {
    const start = window.pageYOffset;
    const distance = targetY - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeInOutQuad = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, start + distance * easeInOutQuad);
      if (progress < 1) requestAnimationFrame(animateScroll);
    };
    requestAnimationFrame(animateScroll);
  };

  const scrollToSection = (sectionId: string) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
          smoothScrollTo(offsetPosition);
        }
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToElement, 500);
    } else {
      scrollToElement();
    }
    setIsMenuOpen(false);
  };

  const handleMouseEnter = (path: string) => {
    prefetchRoute(path);
  };

  const menuItems = [
    { text: t.navigation.home, action: () => scrollToSection('hero'), path: '/' },
    { text: t.navigation.blog, action: () => setIsMenuOpen(false), link: "/blog", path: '/blog' },
    { text: t.navigation.about, action: () => scrollToSection('about'), path: '/' },
    { text: t.navigation.projects, action: () => scrollToSection('projects'), path: '/' },
   
    { text: t.navigation.contact, action: () => scrollToSection('contact'), path: '/' },
  ];

  return (
    <header className="fixed w-full backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-white/30">
          <button onClick={() => navigate('/')} className="text-2xl font-light flex-shrink-0">
            <span className="text-white font-bold">app</span>
            <span className="text-white font-thin font-jakarta">crates</span>
          </button>
          {/* Desktop navigation - unchanged */}
          <nav className="hidden lg:flex space-x-6 mx-6 flex-grow flex justify-end items-center">
            <button onClick={() => scrollToSection('hero')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.home}</button>
            <Link to="/blog" onMouseEnter={() => handleMouseEnter('/blog')} className="text-white hover:text-teal-300 transition">{t.navigation.blog}</Link>
            <button onClick={() => scrollToSection('about')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.about}</button>
            <button onClick={() => scrollToSection('projects')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.projects}</button>
            <button onClick={() => scrollToSection('pricing')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.pricing}</button>
            <button onClick={() => scrollToSection('contact')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.contact}</button>
            <LanguageToggle />
          </nav>
          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-4">
            <LanguageToggle />
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label="Toggle menu" 
              className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors menu-button"
              whileTap={{ scale: 0.9 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile menu with animation */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div 
                  className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
                  variants={menuBackgroundVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Menu panel with flex column layout to position footer at bottom */}
                <motion.div
                  className="lg:hidden fixed top-0 bottom-0 right-0 w-4/5 max-w-xs bg-gradient-to-br from-[#140F2D] via-[#140F2D]/95 to-teal-600/90 backdrop-blur-md z-50 mobile-menu-container shadow-xl flex flex-col "
                  variants={menuPanelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Menu header */}
                  <div className="flex justify-between items-center p-6 border-b border-white/10 ">
                    <span className="text-xl text-white font-medium">{t.navigation.menu || 'Menu'}</span>
                    <motion.button 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                  
                  {/* Menu items - using flex-grow to push footer to bottom */}
                  <nav className="flex flex-col p-6 space-y-6 flex-grow bg-gradient-to-tr from-[#140F2D] via-[#140F2D] to-teal-600/95  h-screen ">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={index}
                        custom={index}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative"
                      >
                        {item.link ? (
                          <Link 
                            to={item.link} 
                            onMouseEnter={() => handleMouseEnter(item.path)} 
                            onClick={item.action} 
                            className="text-white text-lg font-jakarta hover:text-teal-300 transition-colors flex items-center group"
                          >
                            <motion.span
                              className="absolute left-0 w-0 h-0.5 bg-teal-300 group-hover:w-8 transition-all duration-300"
                              whileHover={{ width: "2rem" }}
                            />
                            <span className="pl-10">{item.text}</span>
                          </Link>
                        ) : (
                          <motion.button 
                            onMouseEnter={() => handleMouseEnter(item.path)} 
                            onClick={item.action} 
                            className="text-white text-lg font-jakarta hover:text-teal-300 transition-colors flex items-center group w-full text-left"
                            variants={buttonVariants}
                            whileTap="tap"
                          >
                            <motion.span
                              className="absolute left-0 w-0 h-0.5 bg-teal-300 group-hover:w-8 transition-all duration-300"
                              whileHover={{ width: "2rem" }}
                            />
                            <span className="pl-10">{item.text}</span>
                          </motion.button>
                          
                        )}
                      </motion.div>
                    ))}
                    {/* Menu footer - now at the bottom of the flex container */}
                  <motion.div 
                    className="p-6 border-t border-white/30 text-white/70 text-sm mt-auto   h-screen"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.8, duration: 0.5 } 
                    }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div className="font-bold text-white">app<span className="font-thin">crates</span></div>
                    <div className="mt-2">© {new Date().getFullYear()} All rights reserved</div>
                  </motion.div>
                  </nav>
                  
                  
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
