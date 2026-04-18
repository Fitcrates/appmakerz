import { useRef, memo } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import BurnSpotlightText from './BurnSpotlightText';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  year: string;
}

const getProjects = (t: typeof translations.en.projects): Project[] => [
  {
    id: '1',
    title: t.items.artovnia.title,
    category: t.items.artovnia.category,
    description: t.items.artovnia.description,
    image: '/media/artovniaImage.webp',
    slug: 'multivendor-e-commerce-platform',
    year: '2026',
  },
  {
    id: '2',
    title: t.items.spaWebsite.title,
    category: t.items.spaWebsite.category,
    description: t.items.spaWebsite.description,
    image: '/media/DemoLanding1.webp',
    slug: 'glow-and-serenity-spa-website-with-headless-cms',
    year: '2026',
  },
  {
    id: '3',
    title: t.items.koreanBbq.title,
    category: t.items.koreanBbq.category,
    description: t.items.koreanBbq.description,
    image: '/media/KoreanRestaurant.webp',
    slug: 'premium-korean-bbq-demo',
    year: '2026',
  },
  {
    id: '4',
    title: t.items.animeSearch.title,
    category: t.items.animeSearch.category,
    description: t.items.animeSearch.description,
    image: '/media/ansearch.webp',
    slug: 'anime-platform',
    year: '2025',
  },
  {
    id: '5',
    title: t.items.homebudget.title,
    category: t.items.homebudget.category,
    description: t.items.homebudget.description,
    image: '/media/HomeBudget.webp',
    slug: 'home-budget-ai-app',
    year: '2026',
  },
  {
    id: '6',
    title: t.items.portfolio.title,
    category: t.items.portfolio.category,
    description: t.items.portfolio.description,
    image: '/media/alfaMain.webp',
    slug: 'alfaromeo-portfolio-website',
    year: '2026',
  },
  {
    id: '7',
    title: t.items.flixstock.title,
    category: t.items.flixstock.category,
    description: t.items.flixstock.description,
    image: '/media/packstock.webp',
    slug: 'flixstock-app',
    year: '2024',
  },
];

const ProjectRow = memo<{ project: Project; index: number; mobileActionLabel: string }>(({ project, index, mobileActionLabel }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, {
    once: true,
    margin: '-50px',
  });

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <PrefetchLink href={`/project/${project.slug}`} aria-label={`View project: ${project.title}`}>
        <article className="group relative py-6 lg:min-h-[180px] border-b border-white/10 cursor-pointer hover:border-white/20 hover:z-50 transition-colors">
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-4">
            <span className="text-xs text-teal-300 font-jakarta tracking-widest lg:w-12 flex-shrink-0" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="lg:w-72 flex-shrink-0">
              <h3 className="text-2xl sm:text-3xl font-light text-white font-jakarta group-hover:text-teal-300 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-sm font-jakarta mt-1 text-white/40 italic">
                {project.category} - {project.year}
              </p>
            </div>

            <div className="lg:flex-1">
              <p className="font-jakarta font-light leading-relaxed text-white/70">{project.description}</p>
            </div>

            <div className="hidden lg:flex items-center flex-shrink-0">
              <ArrowUpRight className="w-6 h-6 text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </div>
          </div>

          <div className="flex lg:hidden items-center justify-end gap-2 flex-shrink-0 mt-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white/55 font-jakarta">{mobileActionLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-300/80" aria-hidden="true" />
          </div>

          <div className="absolute right-24 top-1/2 -translate-y-1/2 w-[480px] h-[336px] pointer-events-none hidden lg:block z-[100] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300">
            <div className="w-full h-full bg-indigo-900 border border-teal-300/30 overflow-hidden shadow-2xl">
              <img
                src={project.image}
                alt={`Preview of ${project.title} project`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-teal-300" aria-hidden="true" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-teal-300" aria-hidden="true" />
          </div>
        </article>
      </PrefetchLink>
    </motion.div>
  );
});

ProjectRow.displayName = 'ProjectRow';

const ProjectsNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-100px',
  });
  const { language } = useLanguage();
  const t = translations[language].projects;
  const projects = getProjects(t);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineScaleX = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section id="projects" ref={containerRef} className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-6 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">{t.label}</span>
        </motion.div>

        <div className="mb-16">
          <BurnSpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-7xl font-light font-jakarta" glowSize={150} baseDelay={200} charDelay={40}>
            {t.heading}
          </BurnSpotlightText>

          <motion.div style={{ scaleX: lineScaleX }} className="h-px bg-teal-300 mt-8 origin-left" />
        </div>

        <div className="border-t border-white/10">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} mobileActionLabel={t.viewAction} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-row items-center justify-center lg:justify-start mt-16"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
            aria-label="Contact me to work together"
          >
            <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">{t.cta}</span>
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300" aria-hidden="true">
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsNew;
