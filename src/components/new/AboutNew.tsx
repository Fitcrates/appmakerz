import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import SpotlightText from './SpotlightText';
import BurnSpotlightText from './BurnSpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

// Text reveal animation component with burn glow
const RevealText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsRevealing(true), delay * 1000);
      const endTimer = setTimeout(() => setIsRevealing(false), (delay + 0.5) * 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(endTimer);
      };
    }
  }, [isInView, delay]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className={isRevealing ? 'burn-glow-text' : ''}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Burn reveal effect for image - loops continuously
const BurnRevealImage: React.FC<{ src: string; alt: string; ariaLabel?: string }> = ({ src, alt, ariaLabel }) => {
  const [burnPhase, setBurnPhase] = useState(0);
  
  useEffect(() => {
    // Loop through burn phases: 0 = hidden, 1-10 = burning reveal, 11 = visible, 12-15 = pause, then reset
    const interval = setInterval(() => {
      setBurnPhase(prev => (prev + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate burn line position (0-100%)
  const burnProgress = burnPhase < 30 ? (burnPhase / 30) * 100 : 100;
  const isFading = burnPhase >= 50;

  return (
    <div className="relative w-full h-full overflow-hidden" role="img" aria-label={ariaLabel || alt}>
      {/* Base image - always present but masked */}
      <img 
        src={src} 
        alt={alt} 
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          clipPath: `inset(0 0 ${100 - burnProgress}% 0)`,
          opacity: isFading ? 1 - ((burnPhase - 50) / 10) : 1
        }}
      />
      
      {/* Burn line effect */}
      {burnPhase < 30 && (
        <div 
          className="absolute left-0 right-0 h-8 pointer-events-none z-10"
          style={{
            top: `${burnProgress}%`,
            transform: 'translateY(-50%)',
            background: 'linear-gradient(to bottom, transparent, rgba(94, 234, 212, 0.8) 40%, rgba(94, 234, 212, 1) 50%, rgba(94, 234, 212, 0.8) 60%, transparent)',
            boxShadow: '0 0 30px rgba(94, 234, 212, 0.8), 0 0 60px rgba(94, 234, 212, 0.5)',
            filter: 'blur(2px)'
          }}
        />
      )}

      {/* Sparks along burn line */}
      {burnPhase < 30 && burnPhase > 2 && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-teal-300 rounded-full animate-ping"
              style={{
                top: `${burnProgress}%`,
                left: `${15 + i * 18}%`,
                animationDelay: `${i * 50}ms`,
                boxShadow: '0 0 10px rgba(94, 234, 212, 1)'
              }}
            />
          ))}
        </>
      )}

      {/* Dark overlay for unrevealed part */}
      <div 
        className="absolute inset-0 bg-indigo-950"
        style={{
          clipPath: `inset(${burnProgress}% 0 0 0)`,
          opacity: isFading ? 1 - ((burnPhase - 50) / 10) : 1
        }}
      />
    </div>
  );
};

const AboutNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const t = translations[language].about;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax for image
  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden"
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

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column - Image with burn effect */}
          <motion.div
            ref={imageRef}
            style={{ y: imageY, scale: imageScale }}
            className="relative aspect-[4/5] lg:sticky lg:top-32"
          >
            {/* Image with burn reveal effect */}
            <div className="absolute inset-0 overflow-hidden">
              <BurnRevealImage 
                src="/media/newAbout.webp" 
                alt="Portrait of Arkadiusz Wawrzyniak, fullstack developer" 
                ariaLabel="Professional portrait showing the developer at work"
              />
            </div>
            
            {/* Frame accent */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-teal-300/20" aria-hidden="true" />
            
            {/* Corner marks */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-teal-300" aria-hidden="true" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-teal-300" aria-hidden="true" />
          </motion.div>

          {/* Right column - Text content */}
          <div className="lg:pt-16">
            {/* Main heading with burn animation then spotlight */}
            <div className="mb-12">
              <BurnSpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-6xl font-light font-jakarta leading-[1.3] mb-2" glowSize={150} baseDelay={300} charDelay={35}>
                {t.heading}
              </BurnSpotlightText>
            </div>

            {/* Description with spotlight effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 mb-16"
            >
              <SpotlightText as="p" className="text-lg font-jakarta font-light leading-relaxed" glowSize={120}>
                {t.description.p1}
              </SpotlightText>
              <SpotlightText as="p" className="text-lg font-jakarta font-light leading-relaxed" glowSize={120}>
                {t.description.p2}
              </SpotlightText>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10 items-center text-center lg:text-left"
              role="list"
              aria-label="Experience statistics"
            >
              {[
                { value: t.stats.years.value, label: t.stats.years.label, description: 'Years of professional experience' },
                { value: t.stats.projects.value, label: t.stats.projects.label, description: 'Completed projects' },
                { value: t.stats.dedication.value, label: t.stats.dedication.label, description: 'Dedication to quality' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  role="listitem"
                  aria-label={stat.description}
                >
                  <div className="mb-2">
                    <SpotlightText as="span" className="text-3xl sm:text-4xl lg:text-5xl font-light font-jakarta" glowSize={80}>
                      {stat.value}
                    </SpotlightText>
                  </div>
                  <div className="text-xs text-teal-300 font-jakarta tracking-widest uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Horizontal line accent */}
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

export default AboutNew;
