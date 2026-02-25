import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import CrackImage from './CrackImage';
import SpotlightText from './SpotlightText';
import BurnSpotlightText from './BurnSpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

// Burn glow text reveal component
const BurnRevealHeading: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (isInView) {
      const startTimer = setTimeout(() => setIsGlowing(true), delay * 1000);
      const endTimer = setTimeout(() => setIsGlowing(false), (delay + 0.6) * 1000);
      return () => {
        clearTimeout(startTimer);
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
        className={isGlowing ? 'burn-glow-text' : ''}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface Service {
  number: string;
  title: string;
  description: string;
  titleBreak?: boolean;
}

const getServices = (t: typeof translations.en.services): Service[] => [
  {
    number: t.items.webDev.number,
    title: t.items.webDev.title,
    description: t.items.webDev.description,
  },
  {
    number: t.items.backend.number,
    title: t.items.backend.title,
    description: t.items.backend.description,
    titleBreak: false,
  },
  {
    number: t.items.ecommerce.number,
    title: t.items.ecommerce.title,
    description: t.items.ecommerce.description,
  },
  {
    number: t.items.responsive.number,
    title: t.items.responsive.title,
    description: t.items.responsive.description,
  },
];

const ServiceItem: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative py-12 border-b border-white/10 hover:border-white/20 transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 ">
        {/* Number */}
        <span className="text-xs text-teal-300 font-jakarta tracking-widest lg:w-12 flex-shrink-0">
          {service.number}
        </span>

        {/* Title */}
        <div className="lg:w-72 flex-shrink-0">
          <SpotlightText
            as="h3"
            className="text-2xl sm:text-3xl font-light font-jakarta"
            glowSize={100}
          >
            {service.title}
          </SpotlightText>
        </div>

        {/* Description */}
        <div className="lg:flex-1">
          <SpotlightText as="p" className="font-jakarta font-light leading-relaxed" glowSize={100}>
            {service.description}
          </SpotlightText>
        </div>
      </div>

      {/* Hover line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-teal-300 origin-left"
      />
    </motion.div>
  );
};

const ServicesNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const t = translations[language].services;
  const services = getServices(t);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });

  // Parallax for image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-20 lg:py-24 bg-indigo-950 overflow-visible"
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

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 ">
          {/* Left column - Content */}
          <div>
            {/* Header with burn animation then spotlight */}
            <div className="mb-16 lg:mb-24 ">
              <BurnSpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-7xl font-light font-jakarta " glowSize={150} baseDelay={200} charDelay={50}>
                {t.heading}
              </BurnSpotlightText>
            </div>

            {/* Services list */}
            <div className="border-t border-white/10">
              {services.map((service, index) => (
                <ServiceItem key={service.number} service={service} index={index} />
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
          </div>

          {/* Right column - Image with crack effect */}
          <div className="lg:pt-64">
            <motion.div
              ref={imageRef}
              style={{ y: imageY }}
              className="relative aspect-[4/5]"
            >
            <CrackImage
              src="/media/services.webp"
              alt="Modern web development workspace showcasing professional services"
              className="w-full h-full"
              gridSize={4}
              cycleInterval={5000}
              transitionDuration={1.5}
            />

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-teal-300/20" aria-hidden="true" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-white/10" aria-hidden="true" />
            
            {/* Floating accent */}
            <motion.div
              className="absolute -right-8 top-1/4 w-2 h-16 bg-teal-300/30"
              aria-hidden="true"
              animate={{ 
                height: [64, 96, 64],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesNew;
