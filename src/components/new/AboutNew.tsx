import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SpotlightText from './SpotlightText';
import BurnSpotlightText from './BurnSpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

const BurnRevealImage: React.FC<{ src: string; alt: string; ariaLabel?: string }> = ({ src, alt, ariaLabel }) => {
  return (
    <div className="relative w-full h-full overflow-hidden" role="img" aria-label={ariaLabel || alt}>
      <div className="absolute inset-0 burn-reveal-cycle">
        <div className="absolute inset-0 burn-reveal-image" aria-hidden="true">
          <picture>
            <source media="(max-width: 768px)" srcSet="/media/newAbout.webp" />
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 50vw"
            />
          </picture>
        </div>

        <div className="absolute left-0 right-0 h-8 -translate-y-1/2 pointer-events-none z-10 burn-reveal-line" aria-hidden="true" />

        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-teal-300 rounded-full pointer-events-none z-10 burn-reveal-spark"
            style={{
              left: `${15 + index * 18}%`,
              ['--spark-delay' as string]: `${index * 0.06}s`,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="absolute inset-0 bg-indigo-950 pointer-events-none burn-reveal-overlay" aria-hidden="true" />
      </div>
    </div>
  );
};

const AboutNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { language } = useLanguage();
  const t = translations[language].about;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  return (
    <section id="about" ref={containerRef} className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-6 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">{t.label}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            ref={imageRef}
            style={{ y: imageY, scale: imageScale, willChange: 'transform' }}
            className="relative aspect-[4/5] lg:sticky lg:top-32"
          >
            <div className="absolute inset-0 overflow-hidden">
              <BurnRevealImage
                src="/media/newAbout.webp"
                alt="Portrait of Arkadiusz Wawrzyniak, fullstack developer"
                ariaLabel="Professional portrait showing the developer at work"
              />
            </div>

            <div className="absolute -top-4 -left-4 w-full h-full border border-teal-300/20" aria-hidden="true" />
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-teal-300" aria-hidden="true" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-teal-300" aria-hidden="true" />
          </motion.div>

          <div className="lg:pt-16">
            <div className="mb-12">
              <BurnSpotlightText
                as="h2"
                className="text-4xl sm:text-5xl lg:text-6xl font-light font-jakarta leading-[1.3] mb-2"
                glowSize={150}
                baseDelay={300}
                charDelay={35}
              >
                {t.heading}
              </BurnSpotlightText>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 mb-10"
            >
              <SpotlightText as="p" className="text-lg font-jakarta font-light leading-relaxed" glowSize={120}>
                {t.description.p1}
              </SpotlightText>
              <SpotlightText as="p" className="text-lg font-jakarta font-light leading-relaxed" glowSize={120}>
                {t.description.p2}
              </SpotlightText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-16"
            >
              <Link href="/about-me" className="group inline-flex items-center gap-4" aria-label="Go to About Me page">
                <span className="text-white font-jakarta group-hover:text-teal-300 transition-colors">
                  {language === 'pl' ? 'Poznaj mnie' : 'Get to know me'}
                </span>
                <span className="w-11 h-11 border border-white/20 flex items-center justify-center group-hover:bg-teal-300 group-hover:border-teal-300 transition-all">
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:text-indigo-950 transition-colors" />
                </span>
              </Link>
            </motion.div>

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
                  <div className="text-xs text-teal-300 font-jakarta tracking-widest uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

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
