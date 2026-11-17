"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { PiGlobeDuotone, PiShoppingCartDuotone, PiStorefrontDuotone, PiRobotDuotone, PiBrowserDuotone, PiStackDuotone } from 'react-icons/pi';
import { SiShopify } from 'react-icons/si';
import { IconType } from 'react-icons';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useRouteTransition } from '@/components/next/RouteTransitionProvider';
import LanguageToggleNext from '../next/LanguageToggleNext';
import { useLanguage } from '../../context/LanguageContext';
import { localizedPath } from '../../lib/i18n-routing';
import { translations } from '../../translations/translations';

const getNavItems = (t: typeof translations.en.nav) => [
  { label: t.solutions, href: '/#systems' },
  { label: t.projects, href: '/#projects' },
  { label: t.about, href: '/#about' },
  { label: t.blog, href: '/blog' },
  { label: t.pricing, href: '/#pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: t.contact, href: '/#contact' },
];

type ServiceGroupKey = 'medusa' | 'other';

interface ServiceLink {
  icon: IconType;
  label: string;
  description: string;
  longDescription: string;
  href: string;
  image: string;
  /** Which cluster the entry belongs to in the dropdown. */
  group: ServiceGroupKey;
}

// The two Medusa services are children of the hub, not its siblings, so the
// menu groups them under it instead of listing seven peers.
const getServiceGroups = (language: string): Array<{ key: ServiceGroupKey; label: string }> => [
  { key: 'medusa', label: 'Medusa.js' },
  { key: 'other', label: language === 'pl' ? 'Pozostałe usługi' : 'Other services' },
];

const getServiceLandingLinks = (language: string): ServiceLink[] => [
  {
    icon: PiStackDuotone,
    label: language === 'pl' ? 'MedusaJS: wdrożenia i rozwój' : 'MedusaJS development',
    description: language === 'pl' ? 'Punkt wyjścia do sklepów i marketplace' : 'The way into stores and marketplaces',
    longDescription: language === 'pl'
      ? 'Sklepy dla jednego sprzedawcy, platformy marketplace i integracje z tym, czego już używasz. Zacznij tutaj, jeśli nie wiesz jeszcze, którego wariantu potrzebujesz.'
      : 'Single-seller stores, marketplace platforms and integrations with what you already use. Start here if you are not yet sure which variant you need.',
    href: '/uslugi/medusa-js-development',
    image: '/media/solutions/marketplace.webp',
    group: 'medusa',
  },
  {
    icon: SiShopify,
    label: language === 'pl' ? 'Sklepy Shopify' : 'Shopify Stores',
    description: language === 'pl' ? 'Od prostych sklepów po custom storefronty' : 'From simple stores to custom storefronts',
    longDescription: language === 'pl'
      ? 'Projektuję i wdrażam sklepy Shopify dopasowane do etapu rozwoju biznesu - od sprawnego startu na gotowym motywie po w pełni customowe storefronty headless na Next.js lub TanStack.'
      : 'I design and build Shopify stores matched to your stage of growth - from a focused launch on a proven theme to fully custom headless storefronts built with Next.js or TanStack.',
    href: '/uslugi/shopify-development',
    image: '/media/solutions/ecommerceshop.webp',
    group: 'other',
  },
  {
    icon: PiGlobeDuotone,
    label: language === 'pl' ? 'Strony Internetowe' : 'Websites',
    description: language === 'pl' ? 'Profesjonalne strony i landing page' : 'Professional sites & landing pages',
    longDescription: language === 'pl'
      ? 'Zoptymalizowane pod konwersję i SEO nowoczesne strony na Next.js. Błyskawiczne ładowanie, świetny design i gotowość na skalowanie ruchu od pierwszego dnia.'
      : 'Conversion and SEO-optimized modern websites built on Next.js. Lightning-fast load times, exceptional design, and fully ready to scale your traffic from day one.',
    href: '/uslugi/professional-website-development',
    image: '/media/solutions/landing.webp',
    group: 'other',
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
    group: 'medusa',
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
    group: 'medusa',
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
    group: 'other',
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
    group: 'other',
  },
];

type NavItem = { label: string; href: string };
type ServiceGroup = { key: ServiceGroupKey; label: string; entries: { item: ServiceLink; index: number }[] };

interface MobileMenuProps {
  open: boolean;
  servicesLabel: string;
  serviceGroups: ServiceGroup[];
  items: NavItem[];
  contact?: NavItem;
  onClose: () => void;
  onNavClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

/**
 * Mobile navigation panel.
 *
 * Performance notes, each one fixed a visible stutter on phones:
 * - It stays mounted and is only hidden, so opening it does not first mount
 *   two dozen links before the animation can start.
 * - The slide and the dim are CSS transitions on translate and opacity, which
 *   the compositor runs even while the page underneath keeps the main thread
 *   busy. framer-motion drove the slide from JavaScript, frame by frame.
 * - It starts below the header instead of sliding under it, so the header's
 *   backdrop blur is not recomputed on every frame.
 * - It is memoised and gets stable props, so header re-renders (scroll state,
 *   desktop hover) do not touch it, and the services accordion animates
 *   grid-template-rows in CSS rather than height in JavaScript.
 */
const MobileMenu = memo(function MobileMenu({ open, servicesLabel, serviceGroups, items, contact, onClose, onNavClick }: MobileMenuProps) {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div
      className="fixed inset-x-0 top-20 bottom-0 z-60 lg:hidden"
      inert={!open}
      // Hidden only once the slide-out has finished, so the closed panel is
      // never painted but still animates out.
      style={{ visibility: open ? 'visible' : 'hidden', transition: open ? 'visibility 0s' : 'visibility 0s linear 300ms' }}
    >
      <div
        className={`absolute inset-0 bg-indigo-950/95 transition-opacity duration-300 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={`absolute inset-0 flex flex-col bg-indigo-950 will-change-transform transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? 'translate-x-0' : 'translate-x-full'}`}
        // Collapse the accordion once the panel is off screen, where the
        // reflow costs nothing visible.
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && !open) setServicesOpen(false);
        }}
      >
      <div className="flex-1 overflow-y-auto overscroll-contain px-6 pt-2 pb-6">
        <div className="border-b border-white/[0.08]">
          <button
            type="button"
            onClick={() => setServicesOpen((value) => !value)}
            aria-expanded={servicesOpen}
            aria-controls="mobile-services"
            className="flex w-full items-center justify-between py-3.5 text-left text-xl font-light text-white focus:outline-hidden focus-visible:text-teal-300"
          >
            {servicesLabel}
            <ChevronDown
              className={`h-5 w-5 text-teal-300 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          <div
            id="mobile-services"
            className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${servicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            {/* inert keeps the collapsed links out of the tab order and screen readers. */}
            <div className="min-h-0 overflow-hidden" inert={!servicesOpen}>
              <div
                className={`space-y-5 pb-5 transition-opacity duration-300 motion-reduce:transition-none ${servicesOpen ? 'opacity-100' : 'opacity-0'}`}
              >
                {serviceGroups.map((group) => (
                  <div key={group.key}>
                    <p className="mb-1.5 font-plex text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {group.label}
                    </p>
                    {group.entries.map(({ item }) => {
                      const Icon = item.icon;
                      return (
                        <PrefetchLink
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center gap-3 py-2 text-[15px] font-light text-white/80 transition-colors hover:text-teal-300 focus:outline-hidden focus-visible:text-teal-300"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-teal-300/70" aria-hidden="true" />
                          <span>{item.label}</span>
                        </PrefetchLink>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {items.map((item) => (
          <div key={item.label} className="border-b border-white/[0.08]">
            <PrefetchLink
              href={item.href}
              onClick={(event) => onNavClick(event, item.href)}
              className="block py-3.5 text-xl font-light text-white transition-colors hover:text-teal-300 focus:outline-hidden focus-visible:text-teal-300"
            >
              {item.label}
            </PrefetchLink>
          </div>
        ))}
      </div>

      {contact ? (
        <div className="border-t border-white/[0.08] px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <PrefetchLink
            href={contact.href}
            onClick={(event) => onNavClick(event, contact.href)}
            className="flex w-full items-center justify-between bg-teal-300 px-5 py-4 font-oxanium text-lg font-normal tracking-wide text-indigo-950 transition-colors hover:bg-teal-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
          >
            {contact.label}
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </PrefetchLink>
        </div>
      ) : null}
      </nav>
    </div>
  );
});

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
  // Memoised on language: the mobile panel is memo()ed and these are its props.
  const navItems = useMemo(() => getNavItems(t).map((item) => ({
    ...item,
    href: localizedPath(language, item.href),
  })), [t, language]);
  // On mobile, Contact leaves the list and becomes the button pinned to the
  // bottom of the panel, where the thumb already is. The desktop bar keeps the
  // conventional order, with Contact last.
  const mobileNavItems = useMemo(() => navItems.filter((item) => item.label !== t.contact), [navItems, t]);
  const mobileContact = useMemo(() => navItems.find((item) => item.label === t.contact), [navItems, t]);
  const serviceLandingLinks = useMemo(() => getServiceLandingLinks(language).map((item) => ({
    ...item,
    href: localizedPath(language, item.href),
  })), [language]);
  // Grouped for display only. The flat array stays the source of truth because
  // activeServiceHoverIndex indexes into it to drive the preview panel.
  const serviceGroups = useMemo(() => getServiceGroups(language)
    .map((group) => ({
      ...group,
      entries: serviceLandingLinks
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.group === group.key),
    }))
    .filter((group) => group.entries.length > 0), [language, serviceLandingLinks]);


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

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    mobileMenuButtonRef.current?.blur();
  }, []);

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

  const handleNavClick = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
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
  }, [closeMobileMenu, language, pathname, beginNavigation, router]);

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
        className={`fixed top-0 left-0 w-full backdrop-blur-xs z-100 shadow-xs transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-indigo-950/95 border-b border-white/5' : ''
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
                  className="inline-flex items-center gap-2 text-white/90  font-light text-sm hover:text-white transition-colors focus:outline-hidden focus:text-teal-300"
                  aria-haspopup="true"
                  aria-expanded={isServicesMenuOpen}
                  aria-label={t.services}
                >
                  <span>{t.services}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  className={`fixed inset-x-0 top-20 z-50 flex justify-center transition-all duration-300 ease-out ${isServicesMenuOpen
                    ? 'pointer-events-auto opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 -translate-y-3'
                    }`}
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesMenuClose}
                >
                  {/* Zewnętrzna ramka */}
                  <div className="w-full max-w-6xl mx-4 mt-2 rounded-[24px] border border-white/20 bg-indigo-950/40 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    {/* Wewnętrzna ramka */}
                    <div className="rounded-[18px] border border-white/10 bg-indigo-950 overflow-hidden">
                      <div className="p-6">
                        <div className="grid grid-cols-12 gap-8 min-h-[380px]">
                        {/* Lewa strona - lista usług */}
                        <div className="col-span-5 flex flex-col gap-3 border-r border-white/10 pr-6 py-1">
                          {serviceGroups.map((group) => (
                            <div key={group.key} className="flex flex-col gap-1">
                              <p className="px-3 font-plex text-[10px] uppercase tracking-[0.22em] text-white/35">
                                {group.label}
                              </p>
                            {group.entries.map(({ item, index }) => {
                              const Icon = item.icon;
                              const isActive = index === activeServiceHoverIndex;
                              return (
                                <PrefetchLink
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsServicesMenuOpen(false)}
                                  onMouseEnter={() => handleMouseEnterService(index)}
                                  className={`group/service-card flex min-w-0 items-center gap-4 rounded-xl transition-all duration-300 p-2.5 ${isActive
                                    ? 'border border-teal-300/30 bg-white/4 shadow-[0_0_20px_rgba(45,212,191,0.05)]'
                                    : 'border border-transparent hover:border-white/10 hover:bg-white/2'
                                    }`}
                                >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
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
                          ))}
                        </div>

                        {/* Prawa strona - dynamiczny podgląd */}
                        <div className="col-span-7 relative overflow-hidden rounded-2xl border border-white/5 bg-indigo-950/20 group/preview">
                          {/* Static Overlays - optymalizacja wydajności */}
                          <div className="absolute inset-0 bg-indigo-950/30 z-10 pointer-events-none" />
                          <div className="absolute inset-0 bg-linear-to-t from-indigo-950 via-indigo-950/80 to-transparent z-10 pointer-events-none" />
                          <div className="absolute inset-0 bg-linear-to-r from-indigo-950/90 via-indigo-950/40 to-transparent z-10 pointer-events-none" />

                          {/* Pre-rendered images - zmiana tylko opacity by odciążyć przeglądarkę */}
                          {isServicesMenuOpen
                            ? serviceLandingLinks.map((item, idx) => (
                              <Image
                                key={item.href}
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

                                <p className="text-3xl lg:text-4xl font-light text-white mb-4 drop-shadow-lg">
                                  {serviceLandingLinks[activeServiceHoverIndex].label}
                                </p>

                                <p className="text-white/90 text-sm leading-relaxed max-w-md mb-8">
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
              </div>

              {navItems.map((item) => (
                <PrefetchLink
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="relative text-white/90  font-light text-sm hover:text-white transition-colors group focus:outline-hidden focus:text-teal-300"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-300 group-hover:w-full transition-all duration-300" />
                </PrefetchLink>
              ))}
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
                className="relative z-10 w-10 h-10 flex items-center justify-center text-white rounded-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-300"
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

      <MobileMenu
        open={isMobileMenuOpen}
        servicesLabel={t.services}
        serviceGroups={serviceGroups}
        items={mobileNavItems}
        contact={mobileContact}
        onClose={closeMobileMenu}
        onNavClick={handleNavClick}
      />
    </>
  );
};

export default HeaderNew;
