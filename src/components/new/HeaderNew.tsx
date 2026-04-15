import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Globe, Bot, AppWindow, ShoppingCart,   type LucideIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { getAboutMe, getPosts, getServiceLanding } from '../../lib/sanity.client';

const getNavItems = (t: typeof translations.en.nav) => [
  { label: t.about, href: '/#about' },
  { label: t.projects, href: '/#projects' },
  { label: t.solutions, href: '/#systems' },
  { label: t.blog, href: '/blog' },
  { label: t.contact, href: '/#contact' },
  { label: 'FAQ', href: '/faq' },
];

interface ServiceLink {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
}

const getServiceLandingLinks = (language: string): ServiceLink[] => [
  {
    icon: Globe,
    label: language === 'pl' ? 'Strony Internetowe' : 'Websites',
    description: language === 'pl' ? 'Profesjonalne strony i landing page' : 'Professional sites & landing pages',
    href: '/uslugi/professional-website-development',
  },
  {
    icon: Bot,
    label: language === 'pl' ? 'Wdrożenia AI' : 'AI Implementations',
    description: language === 'pl' ? 'Automatyzacje i integracje AI' : 'Automations & AI integrations',
    href: '/uslugi/ai-automation-rpa-solutions',
  },
  {
    icon: ShoppingCart,
    label: language === 'pl' ? 'Sklepy E-commerce' : 'E-commerce Shops',
    description: language === 'pl' ? 'Sklepy online i platformy sprzedażowe' : 'Online stores & sales platforms',
    href: '/uslugi/e-commerce-shops-medusa-js',
  },
  {
    icon: AppWindow,
    label: language === 'pl' ? 'Dedykowane aplikacje webowe' : 'Custom Web Apps & SaaS',
    description: language === 'pl' ? 'Aplikacje webowe i SaaS' : 'Custom web apps & SaaS',
    href: '/uslugi/custom-web-applications',
  },
];

const HeaderNew: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = translations[language].nav;
  const navItems = getNavItems(t);
  const serviceLandingLinks = getServiceLandingLinks(language);

  const prefetchBlogPage = () => {
    void import('../../BlogNew');
    queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: getPosts,
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchServiceLandingPage = () => {
    void import('./ServiceLandingPageNew');
  };

  const prefetchFaqPage = () => {
    void import('./FAQNew');
  };

  const prefetchAboutMePage = () => {
    void import('./AboutMePageNew');
    queryClient.prefetchQuery({
      queryKey: ['about-me', 'about-me'],
      queryFn: () => getAboutMe('about-me'),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchServiceLandingData = (href: string) => {
    const slug = href.replace('/uslugi/', '');
    if (!slug || slug === href) return;

    queryClient.prefetchQuery({
      queryKey: ['service-landing', slug],
      queryFn: () => getServiceLanding(slug),
      staleTime: 5 * 60 * 1000,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      
      if (location.pathname !== '/') {
        navigate(`/#${targetId}`);
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed w-full backdrop-blur-sm z-50 shadow-sm transition-all duration-300 ${
          isScrolled
            ? 'bg-indigo-950/80 border-b border-white/5'
            : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="relative z-10"
              onMouseEnter={prefetchAboutMePage}
              onFocus={prefetchAboutMePage}
            >
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
                  onPointerEnter={item.href === '/faq' ? prefetchFaqPage : undefined}
                  className="relative text-white/70 font-jakarta font-light text-sm hover:text-white transition-colors group focus:outline-none focus:text-teal-300"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-300 group-hover:w-full transition-all duration-300" />
                </a>
              ))}

              <div className="relative group">
                <button
                  type="button"
                  onMouseEnter={prefetchServiceLandingPage}
                  onFocus={prefetchServiceLandingPage}
                  onTouchStart={prefetchServiceLandingPage}
                  className="inline-flex items-center gap-2 text-white/70 font-jakarta font-light text-sm hover:text-white transition-colors focus:outline-none focus:text-teal-300"
                  aria-haspopup="true"
                  aria-label={t.services}
                >
                  <span>{t.services}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>

                <div className="pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute right-0 top-full pt-4 z-50">
                  <div className="w-[540px] border border-white/10 bg-indigo-950 shadow-2xl rounded-xl p-2 grid grid-cols-2 gap-1">
                    {serviceLandingLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onMouseEnter={() => {
                            prefetchServiceLandingPage();
                            prefetchServiceLandingData(item.href);
                          }}
                          onFocus={() => {
                            prefetchServiceLandingPage();
                            prefetchServiceLandingData(item.href);
                          }}
                          onTouchStart={() => {
                            prefetchServiceLandingPage();
                            prefetchServiceLandingData(item.href);
                          }}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/[0.05] transition-all duration-200 group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-teal-300/10 border border-teal-300/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-300/20 group-hover:border-teal-300/30 transition-colors">
                            <Icon className="w-5 h-5 text-teal-300" />
                          </div>
                          <div>
                            <p className="text-sm font-jakarta font-medium text-white group-hover:text-teal-300 transition-colors">{item.label}</p>
                            <p className="text-xs font-jakarta text-white mt-1 leading-relaxed">{item.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
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
      </header>

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
                      onPointerEnter={item.href === '/faq' ? prefetchFaqPage : undefined}
                      className="block text-3xl font-jakarta font-light text-white hover:text-teal-300 transition-colors focus:outline-none focus:text-teal-300"
                    >
                      {item.label}
                    </a>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-2 border-t border-white/10"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white font-jakarta mb-4">{t.services}</p>
                  <div className="space-y-2">
                    {serviceLandingLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onMouseEnter={() => {
                            prefetchServiceLandingPage();
                            prefetchServiceLandingData(item.href);
                          }}
                          onFocus={() => {
                            prefetchServiceLandingPage();
                            prefetchServiceLandingData(item.href);
                          }}
                          onTouchStart={() => {
                            prefetchServiceLandingPage();
                            prefetchServiceLandingData(item.href);
                          }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-1 text-base font-jakarta font-light text-white hover:text-teal-300 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-teal-300/60" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderNew;
