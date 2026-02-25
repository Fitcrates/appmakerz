import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { getPosts } from '../../lib/sanity.client';

const getNavItems = (t: typeof translations.en.nav) => [
  { label: t.home, href: '/#hero' },
  { label: t.about, href: '/#about' },
  { label: t.projects, href: '/#projects' },
  { label: t.services, href: '/#services' },
  { label: t.solutions, href: '/#solutions' },
  { label: t.blog, href: '/blog' },
  { label: t.contact, href: '/#contact' },
];

const HeaderNew: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = translations[language].nav;
  const navItems = getNavItems(t);

  const prefetchBlogPage = () => {
    void import('../../BlogNew');
    queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: getPosts,
      staleTime: 5 * 60 * 1000,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      
      if (location.pathname !== '/') {
        window.location.href = href;
      } else {
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-indigo-950/80 backdrop-blur-lg border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="relative z-10">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl font-jakarta font-light text-white"
              >
                App<span className="text-teal-300">Crates</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  onMouseEnter={item.href === '/blog' ? prefetchBlogPage : undefined}
                  onFocus={item.href === '/blog' ? prefetchBlogPage : undefined}
                  className="relative text-white/70 font-jakarta font-light text-sm hover:text-white transition-colors group focus:outline-none focus:text-teal-300"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-300 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA Button and Language Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageToggle />
             
            </div>

            {/* Mobile: Language Toggle + Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-10 w-10 h-10 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-teal-300 rounded"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-indigo-950/95 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.nav
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-indigo-950 border-l border-white/5 flex flex-col justify-center px-8"
              aria-label="Mobile navigation"
            >
              <div className="space-y-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      onTouchStart={item.href === '/blog' ? prefetchBlogPage : undefined}
                      onFocus={item.href === '/blog' ? prefetchBlogPage : undefined}
                      className="block text-3xl font-jakarta font-light text-white hover:text-teal-300 transition-colors focus:outline-none focus:text-teal-300"
                    >
                      {item.label}
                    </a>
                  </motion.div>
                ))}
              </div>

              
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderNew;
