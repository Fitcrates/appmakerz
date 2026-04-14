import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import BurnSpotlightText from './BurnSpotlightText';
import SpotlightText from './SpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

gsap.registerPlugin(ScrollTrigger);

interface Solution {
  number: string;
  title: string;
  problem: string;
  description: string;
  mobileImage: string;
}

const getSolutions = (t: typeof translations.en.solutions): Solution[] => [
  {
    number: t.items.landing.number,
    title: t.items.landing.title,
    problem: t.items.landing.problem,
    description: t.items.landing.description,
    mobileImage: '/media/solutions/01-mobilLanding.webp',
  },
  {
    number: t.items.ecommerce.number,
    title: t.items.ecommerce.title,
    problem: t.items.ecommerce.problem,
    description: t.items.ecommerce.description,
    mobileImage: '/media/solutions/02-mobileShop.webp',
  },
  {
    number: t.items.marketplace.number,
    title: t.items.marketplace.title,
    problem: t.items.marketplace.problem,
    description: t.items.marketplace.description,
    mobileImage: '/media/solutions/03-mobileMarket.webp',
  },
  {
    number: t.items.webApps.number,
    title: t.items.webApps.title,
    problem: t.items.webApps.problem,
    description: t.items.webApps.description,
    mobileImage: '/media/solutions/04-mobileWebapp.webp',
  },
  {
    number: t.items.seo.number,
    title: t.items.seo.title,
    problem: t.items.seo.problem,
    description: t.items.seo.description,
    mobileImage: '/media/solutions/05-mobileSEO.webp',
  },
];

const SolutionsNew: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mobileSceneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const t = translations[language].solutions;
  const solutions = getSolutions(t);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [mobilePinState, setMobilePinState] = useState<'before' | 'during' | 'after'>('before');
  const [isMobilePinned, setIsMobilePinned] = useState(false);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        if (prefersReducedMotion) return;

        const leftCol = scene.querySelector('.solutions-scene__left');
        const panels = scene.querySelectorAll('.solutions-scene__image-panel');
        const stepElements = Array.from(scene.querySelectorAll<HTMLElement>('.solutions-scene__step'));

        if (!leftCol || panels.length === 0) return;

        const setActiveStep = (activeIndex: number) => {
          stepElements.forEach((step, index) => {
            const isActive = index === activeIndex;
            step.classList.toggle('is-active', isActive);
            step.classList.toggle('opacity-100', isActive);
            step.classList.toggle('opacity-0', !isActive);
          });
        };

        ScrollTrigger.create({
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftCol,
          pinSpacing: false,
        });

        setActiveStep(0);

        panels.forEach((panel, i) => {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveStep(i),
            onEnterBack: () => setActiveStep(i),
          });
        });
      });

      return () => mm.revert();
    }, sceneRef);

    return () => ctx.revert();
  }, [solutions.length]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 768 || !mobileSceneRef.current) return;

      const rect = mobileSceneRef.current.getBoundingClientRect();
      const maxScrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / maxScrollable));
      const index = Math.min(
        solutions.length - 1,
        Math.max(0, Math.floor(progress * solutions.length))
      );

      setMobileActiveIndex(index);

      if (progress <= 0) {
        setMobilePinState('before');
        setIsMobilePinned(false);
      } else if (progress >= 1) {
        setMobilePinState('after');
        setIsMobilePinned(false);
      } else {
        setMobilePinState('during');
        setIsMobilePinned(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [solutions.length]);

  return (
    <section
      ref={sectionRef}
      id="systems"
      className="relative bg-indigo-950 overflow-x-hidden"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label - like AboutNew */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="pt-20 lg:pt-24 mb-6 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
            {t.label}
          </span>
        </motion.div>

        {/* Header - like AboutNew */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16 lg:mb-24"
        >
          <BurnSpotlightText 
            as="h2" 
            className="text-4xl sm:text-5xl lg:text-6xl font-light font-jakarta leading-[1.3]" 
            glowSize={150} 
            baseDelay={200} 
            charDelay={40}
          >
            {t.heading}
          </BurnSpotlightText>
        </motion.div>
      </div>

      {/* Scene - constrained to max-w-7xl */}
      <div className="w-full md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
        <div ref={sceneRef} className="solutions-scene relative" id="process">
          {/* DESKTOP VIEW */}
          <div className="solutions-scene__desktop hidden md:block">
            <div className="solutions-scene__sticky-wrap grid grid-cols-2 min-h-[100svh] bg-indigo-950 rounded-lg overflow-hidden">
              <div className="solutions-scene__left sticky top-0 h-[100svh] flex flex-col justify-center px-8 lg:px-12 z-10 bg-indigo-950">
                {solutions.map((solution, i) => (
                  <article
                    key={solution.number}
                    className={`solutions-scene__step absolute top-1/2 -translate-y-1/2 left-8 right-10 lg:left-12 lg:right-14 opacity-0 transition-opacity duration-500 ease-out ${i === 0 ? 'is-active opacity-100' : ''}`}
                    itemScope
                    itemType="https://schema.org/Service"
                  >
                  <span className="notranslate text-[0.65rem] font-medium tracking-[0.2em] uppercase text-teal-300 mb-5 block" aria-hidden="true">
                    {solution.number}
                  </span>
                  <h3 className="text-white text-[clamp(2.5rem,5vw,4.5rem)] font-jakarta font-light tracking-[-0.03em] leading-[1.05] uppercase mb-5">
                    {solution.title}
                  </h3>
                  <p className="text-white/45 font-jakarta text-sm italic mb-4" itemProp="name">
                    {solution.problem}
                  </p>
                  <p className="font-jakarta font-light text-[clamp(0.95rem,1.1vw,1.1rem)] leading-[1.9] text-white/80 max-w-[420px]" itemProp="description">
                    {solution.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="solutions-scene__right relative  ">
              {solutions.map((solution) => (
                <div key={`panel-${solution.number}`} className="solutions-scene__image-panel h-[100svh] relative overflow-hidden">
                  <img
                    src={solution.mobileImage}
                    alt={solution.title}
                    className="solutions-scene__image w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="solutions-scene__image-overlay absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/65 to-transparent pointer-events-none z-[1]" />
                  <div className="solutions-scene__image-overlay absolute inset-0 bg-gradient-to-l from-indigo-950 via-transparent to-transparent pointer-events-none z-[2]" />
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* MOBILE STACKING CARDS VIEW */}
          <div
            ref={mobileSceneRef}
            className="solutions-scene__mobile md:hidden block relative"
            style={{ height: `${solutions.length * 100}svh` }}
          >
            <div
              className="left-0 right-0 h-[100svh] overflow-hidden"
              style={{
                position: isMobilePinned ? 'fixed' : 'absolute',
                top: mobilePinState === 'after' ? 'auto' : 0,
                bottom: mobilePinState === 'after' ? 0 : 'auto',
              }}
            >
              {solutions.map((solution, i) => {
                const isActive = i === mobileActiveIndex;
                const isPast = i < mobileActiveIndex;
                const distance = mobileActiveIndex - i;
                const translateY = i > mobileActiveIndex ? 100 : isPast ? -Math.min(18, distance * 6) : 0;
                const scale = isActive ? 1 : isPast ? Math.max(0.92, 1 - distance * 0.025) : 1;
                const opacity = i > mobileActiveIndex ? 0 : isActive ? 1 : Math.max(0.45, 0.82 - distance * 0.15);

                return (
                  <article
                    key={`mobile-${solution.number}`}
                    className="solutions-scene__mobile-card absolute inset-0 transition-[transform,opacity] duration-500 ease-out"
                    style={{
                      zIndex: isActive ? 100 : i + 1,
                      transform: `translateY(${translateY}%) scale(${scale})`,
                      opacity,
                    }}
                    itemScope
                    itemType="https://schema.org/Service"
                  >
                    <div className="absolute inset-0 w-full h-full z-0">
                      <img
                        src={solution.mobileImage}
                        alt={solution.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/75 to-transparent z-[1] pointer-events-none" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 pb-[clamp(4rem,12vh,8rem)] z-[2]">
                      <span className="notranslate text-[0.65rem] font-medium tracking-[0.2em] uppercase text-teal-300 mb-4 block" aria-hidden="true">
                        {solution.number}
                      </span>
                      <h3 className="text-white text-[clamp(1.8rem,7.5vw,2.2rem)] font-jakarta font-light tracking-[-0.02em] leading-[1.05] uppercase mb-4">
                        {solution.title}
                      </h3>
                      <p className="text-white/50 font-jakarta text-[0.85rem] italic mb-3" itemProp="name">
                        {solution.problem}
                      </p>
                      <p className="font-jakarta font-light text-[0.95rem] leading-[1.75] text-white/90 mb-0 max-w-[42ch]" itemProp="description">
                        {solution.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-row items-center justify-center lg:justify-start mt-16 pb-20 lg:pb-24"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
            aria-label="Contact me to discuss your project"
          >
            <SpotlightText glowSize={100}>
              <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
                {t.cta}
              </span>
            </SpotlightText>
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300" aria-hidden="true">
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
            </div>
          </a>
        </motion.div>

        {/* SEO-friendly structured data summary */}
        <div className="sr-only">
          <h2>Web Development Services - Hire a Developer</h2>
          <p>
            Professional fullstack developer offering landing page development, 
            e-commerce solutions, marketplace platforms, custom web applications, 
            and SEO-optimized development services. Looking for a developer to build 
            your landing page, online shop, or web application? Contact me today.
          </p>
          <ul>
            <li>Landing page developer - high-converting websites for lead generation</li>
            <li>E-commerce developer - online shops and stores with secure payments</li>
            <li>Marketplace developer - multi-vendor platforms and SaaS solutions</li>
            <li>Web application developer - custom software and business tools</li>
            <li>SEO developer - search engine optimized websites that rank</li>
          </ul>
        </div>
      </div>

      {/* Horizontal line accent - like AboutNew */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white/5 origin-left"
        aria-hidden="true"
      />
    </section>
  );
};

export default SolutionsNew;
