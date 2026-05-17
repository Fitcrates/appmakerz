"use client";

import React, { useEffect, useRef, useState, type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Globe, Bot, AppWindow, ShoppingCart, type LucideIcon } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useRouteTransition } from '@/components/next/RouteTransitionProvider';
import LanguageToggleNext from '../next/LanguageToggleNext';
import { useLanguage } from '../../context/LanguageContext';
import { localizedPath } from '../../lib/i18n-routing';
import { translations } from '../../translations/translations';

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
    description: language === 'pl' ? 'Sklepy online i platformy sprzedazowe' : 'Online stores & sales platforms',
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
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const servicesMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { beginNavigation } = useRouteTransition();
  const { language } = useLanguage();
  const t = translations[language].nav;
  const navItems = getNavItems(t).map((item) => ({
    ...item,
    href: localizedPath(language, item.href),
  }));
  const serviceLandingLinks = getServiceLandingLinks(language).map((item) => ({
    ...item,
    href: localizedPath(language, item.href),
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (servicesMenuCloseTimerRef.current) {
        clearTimeout(servicesMenuCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    if (!isMobileMenuOpen) {
      requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    mobileMenuButtonRef.current?.blur();
  };

  const openServicesMenu = () => {
    if (servicesMenuCloseTimerRef.current) {
      clearTimeout(servicesMenuCloseTimerRef.current);
      servicesMenuCloseTimerRef.current = null;
    }

    setIsServicesMenuOpen(true);
  };

  const scheduleServicesMenuClose = () => {
    if (servicesMenuCloseTimerRef.current) {
      clearTimeout(servicesMenuCloseTimerRef.current);
    }

    servicesMenuCloseTimerRef.current = setTimeout(() => {
      setIsServicesMenuOpen(false);
      servicesMenuCloseTimerRef.current = null;
    }, 180);
  };

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMobileMenu();

    const url = new URL(href, 'https://appcrates.local');
    if (!url.hash) {
      return;
    }

    event.preventDefault();
    const targetId = url.hash.slice(1);
    const homePath = localizedPath(language, '/');

    if (pathname !== homePath) {
      beginNavigation(href, () => {
        router.push(href);
      });
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) {
      return;
    }

    const headerOffset = 92;
    const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full backdrop-blur-sm z-[100] shadow-sm transition-all duration-300 ${isScrolled ? 'bg-indigo-950/80 border-b border-white/5' : ''
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <PrefetchLink href={localizedPath(language, '/')} className="relative z-10 block">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1">

                <span className="text-xl  font-light text-white">
                  App<span className="text-teal-300">Crates</span>
                </span>
                <img src="/media/AppcratesLogoSmaller.webp" alt="AppCrates Logo" className="w-8 h-8 object-contain hidden md:block" />
              </motion.div>
            </PrefetchLink>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <PrefetchLink
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="relative text-white/70  font-light text-sm hover:text-white transition-colors group focus:outline-none focus:text-teal-300"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-300 group-hover:w-full transition-all duration-300" />
                </PrefetchLink>
              ))}

              <div
                className="relative"
                onMouseEnter={openServicesMenu}
                onMouseLeave={scheduleServicesMenuClose}
                onFocus={openServicesMenu}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    scheduleServicesMenuClose();
                  }
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-white/70  font-light text-sm hover:text-white transition-colors focus:outline-none focus:text-teal-300"
                  aria-haspopup="true"
                  aria-expanded={isServicesMenuOpen}
                  aria-label={t.services}
                >
                  <span>{t.services}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`fixed left-0 right-0 top-20 z-50 transition-all duration-200 ${
                    isServicesMenuOpen
                      ? 'pointer-events-auto opacity-100 translate-y-0'
                      : 'pointer-events-none opacity-0 -translate-y-1'
                  }`}
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesMenuClose}
                >
                  <div className="border-y border-white/10 bg-indigo-950 shadow-2xl backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-4 gap-3">
                    {serviceLandingLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <PrefetchLink
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsServicesMenuOpen(false)}
                          className="group/service-card flex min-w-0 items-start gap-4 rounded-lg border border-white/10 bg-indigo-950/[0.9] p-4 hover:border-teal-300/30 hover:bg-white/[0.06] transition-all duration-200"
                        >
                          <div className="w-10 h-10 rounded-lg bg-teal-300/10 border border-teal-300/20 flex items-center justify-center flex-shrink-0 group-hover/service-card:bg-teal-300/20 group-hover/service-card:border-teal-300/30 transition-colors">
                            <Icon className="w-5 h-5 text-teal-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm  font-medium text-white group-hover/service-card:text-teal-300 transition-colors">{item.label}</p>
                            <p className="text-xs  text-white/70 mt-1 leading-relaxed">{item.description}</p>
                          </div>
                        </PrefetchLink>
                      );
                    })}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <LanguageToggleNext />
            </div>

            <div className="lg:hidden flex items-center gap-3">
              <LanguageToggleNext />
              <button
                ref={mobileMenuButtonRef}
                type="button"
                onClick={() => setIsMobileMenuOpen((value) => !value)}
                className="relative z-10 w-10 h-10 flex items-center justify-center text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
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

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-indigo-950/95 backdrop-blur-lg" onClick={closeMobileMenu} />

            <motion.nav
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute inset-0 bg-indigo-950 flex flex-col px-6 pb-10 pt-24 z-50"
              aria-label="Mobile navigation"
            >
              <button
                type="button"
                onClick={closeMobileMenu}
                className="absolute right-4 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-4 overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PrefetchLink
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item.href)}
                      className="block text-2xl  font-light text-white hover:text-teal-300 transition-colors focus:outline-none focus-visible:text-teal-300"
                    >
                      {item.label}
                    </PrefetchLink>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-2 border-t border-white/10"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white  mb-4">{t.services}</p>
                  <div className="space-y-2">
                    {serviceLandingLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <PrefetchLink
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 py-1 text-base  font-light text-white hover:text-teal-300 transition-colors focus:outline-none focus-visible:text-teal-300"
                        >
                          <Icon className="w-4 h-4 text-teal-300/60" />
                          <span>{item.label}</span>
                        </PrefetchLink>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default HeaderNew;
