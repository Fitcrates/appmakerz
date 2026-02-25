import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
}

const getSolutions = (t: typeof translations.en.solutions): Solution[] => [
  {
    number: t.items.landing.number,
    title: t.items.landing.title,
    problem: t.items.landing.problem,
    description: t.items.landing.description,
  },
  {
    number: t.items.ecommerce.number,
    title: t.items.ecommerce.title,
    problem: t.items.ecommerce.problem,
    description: t.items.ecommerce.description,
  },
  {
    number: t.items.marketplace.number,
    title: t.items.marketplace.title,
    problem: t.items.marketplace.problem,
    description: t.items.marketplace.description,
  },
  {
    number: t.items.webApps.number,
    title: t.items.webApps.title,
    problem: t.items.webApps.problem,
    description: t.items.webApps.description,
  },
  {
    number: t.items.seo.number,
    title: t.items.seo.title,
    problem: t.items.seo.problem,
    description: t.items.seo.description,
  },
];

const SolutionItem: React.FC<{ solution: Solution; index: number }> = ({ solution, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative py-12 border-b border-white/10 hover:border-white/20 transition-colors"
      itemScope
      itemType="https://schema.org/Service"
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
  const { language } = useLanguage();
  const t = translations[language].solutions;
  const solutions = getSolutions(t);

  return (
    <section
      ref={sectionRef}
      id="solutions"
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
        <div className="border-t border-white/10">
          {solutions.map((solution, index) => (
            <SolutionItem key={solution.number} solution={solution} index={index} />
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
