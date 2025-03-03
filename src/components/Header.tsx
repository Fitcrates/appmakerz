import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import LanguageToggle from './LanguageToggle';
import { usePrefetchRoute } from '../hooks/usePrefetchRoute';
import { translations } from '../translations/translations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const prefetchRoute = usePrefetchRoute();

  const menuVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: (index) => ({
      y: 0,
      opacity: 1,
      transition: { delay: index * 0.1, duration: 0.3, ease: 'easeInOut' },
    }),
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
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
        const headerOffset = 100; // Adjust this value based on your header height
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

  return (
    <header className="fixed w-full backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 border-b border-white">
          <button onClick={() => navigate('/')} className="text-2xl font-light flex-shrink-0">
            <span className="text-white font-bold">app</span>
            <span className="text-white font-thin font-jakarta">crates</span>
          </button>
          <nav className="hidden lg:flex space-x-6 mx-6 flex-grow flex justify-end items-center">
            <button onClick={() => scrollToSection('hero')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.home}</button>
            <Link to="/blog" onMouseEnter={() => handleMouseEnter('/blog')} className="text-white hover:text-teal-300 transition">{t.navigation.blog}</Link>
            <button onClick={() => scrollToSection('about')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.about}</button>
            <button onClick={() => scrollToSection('projects')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.projects}</button>
            <Link to="/pricing" onMouseEnter={() => handleMouseEnter('/pricing')} className="text-white hover:text-teal-300 transition">{t.navigation.pricing}</Link>
            <button onClick={() => scrollToSection('contact')} onMouseEnter={() => handleMouseEnter('/')} className="text-white hover:text-teal-300 transition">{t.navigation.contact}</button>
            <LanguageToggle />
          </nav>
          <LanguageToggle />
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />} 
            </button>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-tl from-[#140F2D] via-[#140F2D]/95 to-teal-300/95 backdrop-blur-sm"
            >
              <nav className="flex flex-col space-y-4 p-4 text-center">
                {[
                  { text: t.navigation.home, action: () => scrollToSection('hero'), path: '/' },
                  { text: t.navigation.blog, action: () => setIsMenuOpen(false), link: "/blog", path: '/blog' },
                  { text: t.navigation.about, action: () => scrollToSection('about'), path: '/' },
                  { text: t.navigation.projects, action: () => scrollToSection('projects'), path: '/' },
                  { text: t.navigation.pricing, action: () => setIsMenuOpen(false), link: "/pricing", path: '/pricing' },
                  { text: t.navigation.contact, action: () => scrollToSection('contact'), path: '/' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuVariants}
                  >
                    {item.link ? (
                      <Link to={item.link} onMouseEnter={() => handleMouseEnter(item.path)} onClick={item.action} className="text-white hover:text-teal-300 transition">
                        {item.text}
                      </Link>
                    ) : (
                      <button onMouseEnter={() => handleMouseEnter(item.path)} onClick={item.action} className="text-white hover:text-teal-300 transition">
                        {item.text}
                      </button>
                    )}
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
