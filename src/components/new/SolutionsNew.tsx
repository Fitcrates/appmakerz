import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import BurnSpotlightText from './BurnSpotlightText';
import SpotlightText from './SpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

interface Solution {
  number: string;
  title: string;
  problem: string;
  description: string;
  image: string;
  mobileImage: string;
}

const getSolutions = (t: typeof translations.en.solutions): Solution[] => [
  {
    number: t.items.landing.number,
    title: t.items.landing.title,
    problem: t.items.landing.problem,
    description: t.items.landing.description,
    image: '/media/solutions/01-Landingpage.webp',
    mobileImage: '/media/solutions/01-mobilLanding.webp',
  },
  {
    number: t.items.ecommerce.number,
    title: t.items.ecommerce.title,
    problem: t.items.ecommerce.problem,
    description: t.items.ecommerce.description,
    image: '/media/solutions/02-EShop.webp',
    mobileImage: '/media/solutions/02-mobileShop.webp',
  },
  {
    number: t.items.marketplace.number,
    title: t.items.marketplace.title,
    problem: t.items.marketplace.problem,
    description: t.items.marketplace.description,
    image: '/media/solutions/03-marketplace.webp',
    mobileImage: '/media/solutions/03-mobileMarket.webp',
  },
  {
    number: t.items.webApps.number,
    title: t.items.webApps.title,
    problem: t.items.webApps.problem,
    description: t.items.webApps.description,
    image: '/media/solutions/04-Webapp.webp',
    mobileImage: '/media/solutions/04-mobileWebapp.webp',
  },
  {
    number: t.items.seo.number,
    title: t.items.seo.title,
    problem: t.items.seo.problem,
    description: t.items.seo.description,
    image: '/media/solutions/05-SEO.webp',
    mobileImage: '/media/solutions/05-mobileSEO.webp',
  },
];

interface SolutionItemProps {
  solution: Solution;
  index: number;
  onHover: (image: string | null) => void;
  onTouch: (index: number) => void;
  isActive: boolean;
}

const SolutionItem: React.FC<SolutionItemProps> = ({ solution, index, onHover, onTouch, isActive }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-50px" });

  const handleTouchStart = useCallback(() => {
    onTouch(index);
  }, [index, onTouch]);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative py-6 lg:h-[140px] border-b transition-colors ${
        isActive ? 'border-teal-300/30 bg-white/5' : 'border-white/10 hover:border-white/20'
      }`}
      itemScope
      itemType="https://schema.org/Service"
      onMouseEnter={() => onHover(solution.image)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(solution.image)}
      onBlur={() => onHover(null)}
      onTouchStart={handleTouchStart}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Number */}
        <span className="text-xs text-teal-300 font-jakarta tracking-widest lg:w-12 flex-shrink-0" aria-hidden="true">
          {solution.number}
        </span>

        {/* Title & Problem */}
        <div className="lg:w-72 flex-shrink-0">
          <SpotlightText as="h3" className="text-2xl sm:text-3xl font-light font-jakarta" glowSize={100}>
            {solution.title}
          </SpotlightText>
          <p className="text-white/40 font-jakarta text-sm mt-2 italic" itemProp="name">
            {solution.problem}
          </p>
        </div>

        {/* Description */}
        <div className="lg:flex-1">
          <SpotlightText as="p" className="font-jakarta font-light leading-relaxed" glowSize={100}>
            {solution.description}
          </SpotlightText>
          <meta itemProp="description" content={solution.description} />
        </div>
      </div>

      {/* Hover line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-teal-300 origin-left"
        aria-hidden="true"
      />
    </motion.div>
  );
};

const SolutionsNew: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { language } = useLanguage();
  const t = translations[language].solutions;
  const solutions = getSolutions(t);

  // Detect mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 1024px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-cycle images on mobile when in view
  useEffect(() => {
    if (!isMobile || !isInView || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev === null ? 0 : (prev + 1) % solutions.length;
        setActiveImage(solutions[next].image);
        return next;
      });
    }, 3000);

    // Start with first image
    if (activeIndex === null) {
      setActiveIndex(0);
      setActiveImage(solutions[0].image);
    }

    return () => clearInterval(interval);
  }, [isMobile, isInView, isAutoPlaying, solutions, activeIndex]);

  // Handle touch on solution item
  const handleTouch = useCallback((index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
    setActiveImage(solutions[index].image);
    
    // Resume auto-play after 5 seconds of no interaction
    const timeout = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [solutions]);

  return (
    <section
      ref={sectionRef}
      id="systems"
      className="relative py-20 lg:py-24 bg-indigo-950 overflow-visible"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-6 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
            {t.label}
          </span>
        </motion.div>

        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <BurnSpotlightText 
            as="h2" 
            className="text-4xl sm:text-5xl lg:text-7xl font-light font-jakarta" 
            glowSize={150} 
            baseDelay={200} 
            charDelay={40}
          >
            {t.heading}
          </BurnSpotlightText>
        </div>

        {/* Solutions list */}
        <div className="relative border-t border-white/10">
          {/* Background image overlay - inside solutions list */}
          <AnimatePresence>
            {activeImage && (
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-0 pointer-events-none rounded-lg overflow-hidden"
              >
                <picture>
                  <source 
                    media="(max-width: 1023px)" 
                    srcSet={solutions.find(s => s.image === activeImage)?.mobileImage || activeImage}
                  />
                  <img 
                    src={activeImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain object-center"
                  />
                </picture>
                <div className="absolute inset-0 bg-indigo-950/70" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-transparent to-indigo-950/30" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {solutions.map((solution, index) => (
            <SolutionItem 
              key={solution.number} 
              solution={solution} 
              index={index} 
              onHover={setActiveImage}
              onTouch={handleTouch}
              isActive={activeIndex === index}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-row items-center justify-center lg:justify-start mt-16 "
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
            aria-label="Contact me to discuss your project"
          >
            <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
              {t.cta}
            </span>
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
    </section>
  );
};

export default SolutionsNew;
