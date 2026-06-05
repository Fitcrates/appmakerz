"use client";

import React, { useEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { PiGlobeDuotone, PiShoppingCartDuotone, PiStorefrontDuotone, PiRobotDuotone, PiBrowserDuotone } from 'react-icons/pi';
import { IconType } from 'react-icons';
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
  icon: IconType;
  label: string;
  description: string;
  longDescription: string;
  href: string;
  image: string;
}

const getServiceLandingLinks = (language: string): ServiceLink[] => [
  {
    icon: PiGlobeDuotone,
    label: language === 'pl' ? 'Strony Internetowe' : 'Websites',
    description: language === 'pl' ? 'Profesjonalne strony i landing page' : 'Professional sites & landing pages',
    longDescription: language === 'pl'
      ? 'Zoptymalizowane pod konwersję i SEO nowoczesne strony na Next.js. Błyskawiczne ładowanie, świetny design i gotowość na skalowanie ruchu od pierwszego dnia.'
      : 'Conversion and SEO-optimized modern websites built on Next.js. Lightning-fast load times, exceptional design, and fully ready to scale your traffic from day one.',
    href: '/uslugi/professional-website-development',
    image: '/media/solutions/landing.webp',
  },
  {
    icon: PiShoppingCartDuotone,
    label: language === 'pl' ? 'Sklepy internetowe' : 'Online Stores',
    description: language === 'pl' ? 'Headless commerce na Medusa.js' : 'Headless commerce on Medusa.js',
    longDescription: language === 'pl'
      ? 'Zbuduj sklep bez technologicznych ograniczeń i prowizji SaaS. Pełna swoboda w projektowaniu checkoutu, zaawansowana logika produktów i doskonała wydajność dzięki architekturze headless.'
      : 'Build a store without SaaS limitations or commissions. Enjoy total design freedom, advanced product logic, and unmatched performance through headless architecture.',
    href: '/uslugi/e-commerce-shops-medusa-js',
    image: '/media/solutions/ecommerceshop.webp',
  },
  {
    icon: PiStorefrontDuotone,
    label: language === 'pl' ? 'Marketplace multi-vendor' : 'Multi-vendor Marketplace',
    description: language === 'pl' ? 'Platformy dla wielu sprzedawców' : 'Platforms for multiple vendors',
    longDescription: language === 'pl'
      ? 'Wdrożenia potężnych platform na Medusa.js. Niestandardowe modele prowizji, zintegrowane systemy płatności oraz panele dla dostawców dopasowane do Twojego modelu biznesowego.'
      : 'Implementation of powerful platforms on Medusa.js. Custom commission models, integrated payment systems, and dedicated vendor dashboards tailored to your exact business model.',
    href: '/uslugi/marketplace-multi-vendor-medusa-js',
    image: '/media/solutions/marketplace.webp',
  },
  {
    icon: PiRobotDuotone,
    label: language === 'pl' ? 'Wdrożenia AI' : 'AI Implementations',
    description: language === 'pl' ? 'Automatyzacje i integracje AI' : 'Automations & AI integrations',
    longDescription: language === 'pl'
      ? 'Zwiększ efektywność dzięki inteligentnym asystentom i automatyzacjom. Od chatbotów obsługi klienta po systemy RAG pracujące bezpiecznie na wewnętrznych danych Twojej firmy.'
      : 'Boost efficiency with smart assistants and automated workflows. From customer support chatbots to custom RAG systems trained securely on your company\'s internal data.',
    href: '/uslugi/ai-automation-rpa-solutions',
    image: '/media/solutions/SEO.webp',
  },
  {
    icon: PiBrowserDuotone,
    label: language === 'pl' ? 'Dedykowane aplikacje webowe' : 'Custom Web Apps & SaaS',
    description: language === 'pl' ? 'Aplikacje webowe i SaaS' : 'Custom web apps & SaaS',
    longDescription: language === 'pl'
      ? 'Szyte na miarę systemy wewnętrzne, platformy SaaS i panele B2B. Czysta architektura (Next.js) i interfejsy zaprojektowane pod kątem najlepszych doświadczeń użytkownika.'
      : 'Tailor-made internal systems, SaaS platforms, and B2B dashboards. Clean architecture (Next.js) and intuitive interfaces designed for the best user experience.',
    href: '/uslugi/custom-web-applications',
    image: '/media/solutions/webapps.webp',
  },
];

const HeaderNew: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [activeServiceHoverIndex, setActiveServiceHoverIndex] = useState(0);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const servicesMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
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

    if (pathname !== '/' && pathname !== homePath) {
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

  const handleMouseEnterService = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveServiceHoverIndex(index);
    }, 120);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full backdrop-blur-sm z-[100] shadow-sm transition-all duration-300 ${isScrolled ? 'bg-indigo-950/95 border-b border-white/5' : ''
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
                  className={`fixed left-0 right-0 top-20 z-50 transition-all duration-200 ${isServicesMenuOpen
                    ? 'pointer-events-auto opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 -translate-y-1'
                    }`}
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesMenuClose}
                >
                  <div className="border-y border-white/10 bg-indigo-950 shadow-2xl backdrop-blur-2xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                      <div className="grid grid-cols-12 gap-8 min-h-[380px]">
                        {/* Lewa strona - lista usług */}
                        <div className="col-span-5 flex flex-col gap-2 border-r border-white/10 pr-6 py-2">
                          {serviceLandingLinks.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = index === activeServiceHoverIndex;
                            return (
                              <PrefetchLink
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsServicesMenuOpen(false)}
                                onMouseEnter={() => handleMouseEnterService(index)}
                                className={`group/service-card flex min-w-0 items-center gap-4 rounded-xl transition-all duration-300 p-3 ${isActive
                                  ? 'border border-teal-300/30 bg-white/[0.04] shadow-[0_0_20px_rgba(45,212,191,0.05)]'
                                  : 'border border-transparent hover:border-white/10 hover:bg-white/[0.02]'
                                  }`}
                              >
                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive
                                  ? 'bg-teal-300/10 border border-teal-300/30 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.1)]'
                                  : 'bg-white/5 border border-white/10 text-white/60 group-hover/service-card:bg-white/10 group-hover/service-card:text-white/90'
                                  }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-[15px] font-medium transition-colors duration-300 ${isActive ? 'text-teal-300' : 'text-white/90 group-hover/service-card:text-white'}`}>
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-white/50 mt-0.5 truncate">{item.description}</p>
                                </div>
                                <ArrowUpRight className={`w-4 h-4 transition-all duration-300 ${isActive
                                  ? 'text-teal-300 opacity-100 translate-x-0'
                                  : 'text-white/30 opacity-0 -translate-x-3 group-hover/service-card:opacity-50 group-hover/service-card:-translate-x-1'
                                  }`} />
                              </PrefetchLink>
                            );
                          })}
                        </div>

                        {/* Prawa strona - dynamiczny podgląd */}
                        <div className="col-span-7 relative overflow-hidden rounded-2xl border border-white/5 bg-indigo-950/20 group/preview">
                          {/* Static Overlays - optymalizacja wydajności */}
                          <div className="absolute inset-0 bg-indigo-950/30 z-10 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent z-10 pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-950/40 to-transparent z-10 pointer-events-none" />

                          {/* Pre-rendered images - zmiana tylko opacity by odciążyć przeglądarkę */}
                          {isServicesMenuOpen
                            ? serviceLandingLinks.map((item, idx) => (
                              <Image
                                key={item.image}
                                src={item.image}
                                alt={item.label}
                                fill
                                quality={55}
                                sizes="(min-width: 1024px) 58vw, 0px"
                                className={`object-cover mix-blend-luminosity transition-opacity duration-500 ease-out ${activeServiceHoverIndex === idx ? 'opacity-60' : 'opacity-0'
                                  }`}
                              />
                            ))
                            : null}

                          {/* Content */}
                          <div className="absolute inset-0 p-10 z-20 flex flex-col justify-end">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeServiceHoverIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                              >
                                <div className="flex items-center gap-3 mb-5">
                                  <div className="w-8 h-8 rounded-full bg-teal-300/10 border border-teal-300/30 flex items-center justify-center">
                                    {React.createElement(serviceLandingLinks[activeServiceHoverIndex].icon, { className: 'w-4 h-4 text-teal-300' })}
                                  </div>
                                  <span className="text-xs tracking-[0.2em] uppercase text-teal-300 font-medium">
                                    {language === 'pl' ? 'Odkryj usługę' : 'Explore service'}
                                  </span>
                                </div>

                                <h3 className="text-3xl lg:text-4xl font-light text-white mb-4 drop-shadow-lg">
                                  {serviceLandingLinks[activeServiceHoverIndex].label}
                                </h3>

                                <p className="text-white/70 text-sm leading-relaxed max-w-md mb-8">
                                  {serviceLandingLinks[activeServiceHoverIndex].longDescription}
                                </p>

                                <PrefetchLink
                                  href={serviceLandingLinks[activeServiceHoverIndex].href}
                                  onClick={() => setIsServicesMenuOpen(false)}
                                  className="inline-flex items-center gap-3 text-sm font-medium text-indigo-950 bg-teal-300 hover:bg-white px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                  {language === 'pl' ? 'Zobacz szczegóły' : 'View details'}
                                  <ArrowUpRight className="w-4 h-4" />
                                </PrefetchLink>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
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
