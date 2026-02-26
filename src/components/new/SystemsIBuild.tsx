'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import SpotlightText from './SpotlightText';

// ============================================
// TYPES
// ============================================
interface StageData {
  id: string;
  number: string;
  title: string;
  problem: string;
  description: string;
  image: string;
  mobileImage: string;
}

// ============================================
// STAGE CONFIGURATION
// ============================================
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

// ============================================
// MAIN COMPONENT
// ============================================
const SystemsIBuild: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lastStageChangeRef = useRef(0);
  const { language } = useLanguage();
  const t = translations[language].solutions;
  const stages = useMemo(() => getStages(t), [t]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [fixedPosition, setFixedPosition] = useState<'before' | 'during' | 'after'>('before');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateMobileState = () => setIsMobile(mediaQuery.matches);
    updateMobileState();
    mediaQuery.addEventListener('change', updateMobileState);
    return () => mediaQuery.removeEventListener('change', updateMobileState);
  }, []);

  const goToStage = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(stages.length - 1, index));
    setActiveStageIndex(boundedIndex);

    const targetProgress = boundedIndex / stages.length;
    const sectionTop = sectionRef.current?.offsetTop || 0;
    const sectionHeight = sectionRef.current?.offsetHeight || 0;
    const scrollTarget = sectionTop + (sectionHeight * targetProgress) + 100;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const stageCount = stages.length;
      const progressInStages = v * (stageCount - 1);
      const now = Date.now();
      const stageChangeCooldown = isMobile ? 450 : 200;

      setActiveStageIndex((currentStage) => {
        if (now - lastStageChangeRef.current < stageChangeCooldown) {
          return currentStage;
        }

        let nextStage = currentStage;
        const forwardThreshold = currentStage + 0.65;
        const backwardThreshold = currentStage - 0.65;

        if (progressInStages >= forwardThreshold && currentStage < stageCount - 1) {
          nextStage = currentStage + 1;
        } else if (progressInStages <= backwardThreshold && currentStage > 0) {
          nextStage = currentStage - 1;
        }

        if (nextStage !== currentStage) {
          lastStageChangeRef.current = now;
        }

        return nextStage;
      });
      
      if (v <= 0) {
        setFixedPosition('before');
        setIsInView(false);
      } else if (v >= 1) {
        setFixedPosition('after');
        setIsInView(false);
      } else {
        setFixedPosition('during');
        setIsInView(true);
      }
    });
    return () => unsubscribe();
  }, [isMobile, scrollYProgress, stages.length]);

  const activeStage = stages[activeStageIndex];

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative bg-indigo-950"
      style={{ height: isMobile ? '520vh' : '300vh' }}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* Fixed viewport container */}
      <div 
        className="left-0 right-0 h-screen overflow-hidden"
        style={{
          position: isInView ? 'fixed' : 'absolute',
          top: fixedPosition === 'after' ? 'auto' : 0,
          bottom: fixedPosition === 'after' ? 0 : 'auto',
        }}
      >
        {/* Full-screen stacking background images */}
        {stages.map((stage, index) => {
          const shouldShow = index <= activeStageIndex;
          const isActive = index === activeStageIndex;
          
          return (
            <motion.div
              key={stage.id}
              className="absolute inset-0 overflow-hidden "
              style={{ zIndex: index }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{
                y: shouldShow ? 0 : '100%',
                opacity: shouldShow ? 1 : 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <picture className="w-full h-full ">
                <source 
                  media="(max-width: 1023px)" 
                  srcSet={stage.mobileImage}
                />
                <motion.img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-fit "
                  loading={index === 0 ? 'eager' : 'lazy'}
                  initial={{ scale: 1.1, filter: 'blur(8px)' }}
                  animate={{
                    scale: isActive ? 1 : 1.05,
                    filter: isActive ? 'blur(0px)' : 'blur(4px)',
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </picture>
            </motion.div>
          );
        })}

        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0 z-10 "
          style={{
            background: 'linear-gradient(to right, rgba(15, 11, 31, 0.95) 0%, rgba(15, 11, 31, 0.85) 40%, rgba(15, 11, 31, 0.6) 70%, rgba(15, 11, 31, 0.4) 100%)',
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center bg-gradient-to-t from-indigo-950/95 via-transparent to-indigo-950/95">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-2xl flex flex-col h-full">
              {/* Top content area */}
              <div className="flex-1">
                {/* Section label */}
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

                {/* Section Heading */}
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

                {/* Stage content with AnimatePresence */}
                <div className="relative min-h-[200px] sm:min-h-[180px] lg:min-h-[160px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStage.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Stage number & title */}
                      <motion.div
                        className="flex items-center gap-4 mb-4"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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

                      {/* Problem */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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

                      {/* Description */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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

              {/* Bottom area - Progress + CTA (hidden on mobile, shown on desktop) */}
              <div className="hidden lg:block mt-auto pt-8">
                {/* Progress indicator - clickable */}
                <div className="flex gap-2 mb-8 max-w-md">
                  {stages.map((stage, index) => (
                    <button
                      key={index}
                      onClick={() => goToStage(index)}
                      className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                      aria-label={`Go to step ${index + 1}: ${stage.title}`}
                    >
                      <motion.div
                        className="h-full bg-teal-300 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: index <= activeStageIndex ? 1 : 0,
                          opacity: index === activeStageIndex ? 1 : index < activeStageIndex ? 0.6 : 0,
                        }}
                        transition={{ 
                          duration: 0.5, 
                          ease: [0.22, 1, 0.36, 1],
                          delay: index === activeStageIndex ? 0.1 : 0,
                        }}
                        style={{ originX: 0 }}
                      />
                    </button>
                  ))}
                </div>

                {/* CTA */}
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

        {/* Mobile fixed bottom bar - Progress + CTA */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30  px-4 py-4 safe-area-inset-bottom">
          {/* Progress indicator - clickable */}
          <div className="flex gap-2 mb-4 max-w-md mx-auto">
            {stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => goToStage(index)}
                className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
                aria-label={`Go to step ${index + 1}: ${stage.title}`}
              >
                <motion.div
                  className="h-full bg-teal-300 rounded-full"
                  animate={{ 
                    scaleX: index <= activeStageIndex ? 1 : 0,
                    opacity: index === activeStageIndex ? 1 : index < activeStageIndex ? 0.6 : 0,
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

          {/* CTA */}
          <a
            href="#contact"
            className="group flex items-center justify-center gap-3 w-full py-3  transition-colors rounded"
            aria-label="Contact me to discuss your project"
          >
             <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
              {t.cta}
            </span>
             <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300" aria-hidden="true">
             
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
            </div>
          </a>
        </div>

      </div>

      {/* SEO content */}
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

export default SystemsIBuild;
