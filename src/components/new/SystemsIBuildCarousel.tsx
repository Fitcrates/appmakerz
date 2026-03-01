'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import SpotlightText from './SpotlightText';

interface StageData {
  id: string;
  number: string;
  title: string;
  problem: string;
  description: string;
  image: string;
  mobileImage: string;
}

const getStages = (t: typeof translations.en.solutions): StageData[] => [
  {
    id: 'landing',
    number: t.items.landing.number,
    title: t.items.landing.title,
    problem: t.items.landing.problem,
    description: t.items.landing.description,
    image: '/media/solutions/01-Landingpage.webp',
    mobileImage: '/media/solutions/01-mobilLanding.webp',
  },
  {
    id: 'ecommerce',
    number: t.items.ecommerce.number,
    title: t.items.ecommerce.title,
    problem: t.items.ecommerce.problem,
    description: t.items.ecommerce.description,
    image: '/media/solutions/02-EShop.webp',
    mobileImage: '/media/solutions/02-mobileShop.webp',
  },
  {
    id: 'marketplace',
    number: t.items.marketplace.number,
    title: t.items.marketplace.title,
    problem: t.items.marketplace.problem,
    description: t.items.marketplace.description,
    image: '/media/solutions/03-marketplace.webp',
    mobileImage: '/media/solutions/03-mobileMarket.webp',
  },
  {
    id: 'webApps',
    number: t.items.webApps.number,
    title: t.items.webApps.title,
    problem: t.items.webApps.problem,
    description: t.items.webApps.description,
    image: '/media/solutions/04-Webapp.webp',
    mobileImage: '/media/solutions/04-mobileWebapp.webp',
  },
  {
    id: 'seo',
    number: t.items.seo.number,
    title: t.items.seo.title,
    problem: t.items.seo.problem,
    description: t.items.seo.description,
    image: '/media/solutions/05-SEO.webp',
    mobileImage: '/media/solutions/05-mobileSEO.webp',
  },
];

type SlideDirection = 1 | -1;

const SystemsIBuildCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const wheelAccumulatedDeltaRef = useRef(0);
  const wheelLastEventRef = useRef(0);
  const wheelLastNavigateRef = useRef(0);
  const { language } = useLanguage();
  const t = translations[language].solutions;
  const stages = useMemo(() => getStages(t), [t]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>(1);
  const [isInView, setIsInView] = useState(false);

  const activeStage = stages[activeIndex];

  const goTo = useCallback(
    (index: number, dir?: SlideDirection) => {
      const bounded = Math.max(0, Math.min(stages.length - 1, index));
      if (bounded === activeIndex) return;
      setDirection(dir ?? (bounded > activeIndex ? 1 : -1));
      setActiveIndex(bounded);
    },
    [activeIndex, stages.length]
  );

  const next = useCallback(() => {
    if (activeIndex < stages.length - 1) {
      goTo(activeIndex + 1, 1);
    }
  }, [activeIndex, stages.length, goTo]);

  const prev = useCallback(() => {
    if (activeIndex > 0) {
      goTo(activeIndex - 1, -1);
    }
  }, [activeIndex, goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!isInView) return;

      const now = Date.now();
      const cooldownMs = 550;

      if (now - wheelLastEventRef.current > 280) {
        wheelAccumulatedDeltaRef.current = 0;
      }
      wheelLastEventRef.current = now;

      wheelAccumulatedDeltaRef.current += e.deltaY;
      const threshold = 80;
      if (Math.abs(wheelAccumulatedDeltaRef.current) < threshold) {
        return;
      }

      const dir = wheelAccumulatedDeltaRef.current > 0 ? 1 : -1;
      wheelAccumulatedDeltaRef.current = 0;

      const canNavigate =
        (dir === 1 && activeIndex < stages.length - 1) ||
        (dir === -1 && activeIndex > 0);

      if (!canNavigate) {
        return;
      }

      e.preventDefault();

      if (now - wheelLastNavigateRef.current < cooldownMs) {
        return;
      }

      wheelLastNavigateRef.current = now;
      if (dir === 1) next();
      else prev();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isInView, activeIndex, stages.length, next, prev]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) {
        return;
      }

      if (dx < 0) next();
      else prev();
    },
    [next, prev]
  );

  useEffect(() => {
    if (!isInView) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isInView, next, prev]);

  const slideVariants = {
    enter: (d: SlideDirection) => ({
      y: d > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (d: SlideDirection) => ({
      y: d > 0 ? '-30%' : '30%',
      opacity: 0,
    }),
  };

  return (
    <section
      id="solutions"
      className="relative bg-indigo-950"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div
        ref={containerRef}
        className="relative h-screen overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeStage.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <picture className="w-full h-full">
              <source media="(max-width: 1023px)" srcSet={activeStage.mobileImage} />
              <motion.img
                src={activeStage.image}
                alt={activeStage.title}
                className="w-full h-full object-cover"
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                initial={{ scale: 1.1, filter: 'blur(8px)' }}
                animate={{ scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(to right, rgba(15, 11, 31, 0.95) 0%, rgba(15, 11, 31, 0.85) 40%, rgba(15, 11, 31, 0.6) 70%, rgba(15, 11, 31, 0.4) 100%)',
          }}
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-center bg-gradient-to-t from-indigo-950/95 via-transparent to-indigo-950/95">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-2xl flex flex-col h-full">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="mb-4"
                >
                  <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-jakarta">
                    {t.label}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8"
                >
                  <SpotlightText
                    as="h2"
                    className="text-3xl sm:text-4xl lg:text-5xl font-light font-jakarta"
                    glowSize={150}
                  >
                    {t.heading}
                  </SpotlightText>
                </motion.div>

                <div className="relative min-h-[200px] sm:min-h-[180px] lg:min-h-[160px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStage.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="flex items-center gap-4 mb-4"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <motion.span
                          className="text-teal-300 font-mono text-base tracking-wider shrink-0"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          {activeStage.number}
                        </motion.span>
                        <SpotlightText
                          as="h3"
                          className="text-2xl sm:text-3xl lg:text-4xl font-light font-jakarta"
                          glowSize={120}
                        >
                          {activeStage.title}
                        </SpotlightText>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-4"
                      >
                        <SpotlightText
                          as="p"
                          className="text-teal-300/80 font-jakarta text-base"
                          glowSize={100}
                        >
                          {activeStage.problem}
                        </SpotlightText>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <SpotlightText
                          as="p"
                          className="font-jakarta text-base leading-relaxed max-w-xl"
                          glowSize={100}
                        >
                          {activeStage.description}
                        </SpotlightText>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="hidden lg:block mt-auto pt-8">
                <div className="flex gap-2 mb-8 max-w-md">
                  {stages.map((stage, index) => (
                    <button
                      key={index}
                      onClick={() => goTo(index)}
                      className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                      aria-label={`Go to step ${index + 1}: ${stage.title}`}
                    >
                      <motion.div
                        className="h-full bg-teal-300 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: index <= activeIndex ? 1 : 0,
                          opacity: index === activeIndex ? 1 : index < activeIndex ? 0.6 : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                          delay: index === activeIndex ? 0.1 : 0,
                        }}
                        style={{ originX: 0 }}
                      />
                    </button>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
                    aria-label="Contact me to discuss your project"
                  >
                    <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
                      {t.cta}
                    </span>
                    <div className="w-12 h-12 border border-white/30 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
                    </div>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30 px-4 py-4 safe-area-inset-bottom">
          <div className="flex gap-2 mb-4 max-w-md mx-auto">
            {stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
                aria-label={`Go to step ${index + 1}: ${stage.title}`}
              >
                <motion.div
                  className="h-full bg-teal-300 rounded-full"
                  animate={{
                    scaleX: index <= activeIndex ? 1 : 0,
                    opacity: index === activeIndex ? 1 : index < activeIndex ? 0.6 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ originX: 0 }}
                />
              </button>
            ))}
          </div>

          <a
            href="#contact"
            className="group flex items-center justify-center gap-3 w-full py-3 transition-colors rounded"
            aria-label="Contact me to discuss your project"
          >
            <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
              {t.cta}
            </span>
            <div
              className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300"
              aria-hidden="true"
            >
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
            </div>
          </a>
        </div>
      </div>

      <div className="sr-only">
        <h2>
          {language === 'pl'
            ? 'Uslugi tworzenia stron i aplikacji internetowych'
            : 'Web Development Services - Hire a Developer'}
        </h2>
        <p>
          {language === 'pl'
            ? 'Fullstack developer oferujacy strony landing page, sklepy internetowe, platformy marketplace, aplikacje webowe oraz strony zoptymalizowane pod SEO.'
            : 'Professional fullstack developer offering landing page development, e-commerce solutions, marketplace platforms, custom web applications, and SEO-optimized development services.'}
        </p>
        <ul>
          {stages.map((stage) => (
            <li key={stage.id}>
              {stage.title} - {stage.problem}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SystemsIBuildCarousel;
