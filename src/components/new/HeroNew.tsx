import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SpotlightText from './SpotlightText';
import BurnSpotlightText from './BurnSpotlightText';
import HeroPulsePath from './HeroPulsePath';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const HeroNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language].hero;
  
  // Scroll transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-indigo-950"
    >
      {/* Hero background image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img 
          src="/media/hero2new.webp" 
          alt="" 
          role="presentation"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-indigo-950/70" />
      </div>

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Animated pulse path decoration */}
      <HeroPulsePath />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Visually hidden SEO h1 */}
        <h1 className="sr-only">{t.seoHeading}</h1>

        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-jakarta text-white/90">
            {t.label}
          </span>
        </motion.div>

        {/* Decorative heading with burn animation (not the SEO h1) */}
        <div className="mb-8" aria-hidden="true">
          <BurnSpotlightText as="div" className="text-5xl sm:text-7xl lg:text-[120px] font-light font-jakarta tracking-normal leading-[1.2] " glowSize={200} baseDelay={500} charDelay={40}>
            {t.heading}
          </BurnSpotlightText>
        </div>

        {/* Subtitle with spotlight effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="max-w-xl mx-auto mb-16"
        >
          <SpotlightText as="p" className="text-lg sm:text-xl font-jakarta font-light" glowSize={100}>
            {t.subtitle}
          </SpotlightText>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#projects"
            className="group relative px-10 py-5 bg-teal-300 text-indigo-950 font-jakarta font-medium overflow-hidden transition-all duration-500 min-w-[230px] hover:shadow-[0_0_60px_rgba(94,234,212,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
            aria-label="View my portfolio projects"
          >
            <span className="relative z-10">{t.cta.viewWork}</span>
            {/* Hover wipe effect */}
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </a>
          
          <a
            href="#contact"
            className="group px-10 py-5 border border-white/20 text-white font-jakarta font-medium hover:border-teal-300 transition-all duration-500 relative overflow-hidden min-w-[230px] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
            aria-label="Contact me to discuss your project"
          >
            <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">{t.cta.getInTouch}</span>
            <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - hidden on mobile, fades out on scroll */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-3 text-white/30 hover:text-teal-300 transition-colors cursor-pointer group focus:outline-none focus:text-teal-300"
        aria-label="Scroll down to About section"
      >
        <span className="text-[10px] font-jakarta tracking-[0.3em] uppercase">{t.scroll}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Minimal corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10 z-10" aria-hidden="true" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10 z-10" aria-hidden="true" />
    </section>
  );
};

export default HeroNew;
