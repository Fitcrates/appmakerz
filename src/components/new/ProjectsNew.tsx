import { useRef, useState, useEffect, memo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import BurnSpotlightText from "./BurnSpotlightText";

// ─── Burn glow heading (unchanged visually) ───
const BurnRevealHeading: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const startTimer = setTimeout(
      () => setIsGlowing(true),
      delay * 1000,
    );
    const endTimer = setTimeout(
      () => setIsGlowing(false),
      (delay + 0.6) * 1000,
    );

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [isInView, delay]);

  return (
    <div ref={ref} className="mb-2 overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={isGlowing ? "burn-glow-text" : ""}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ─── Data ───
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
    id: "1",
    title: t.items.artovnia.title,
    category: t.items.artovnia.category,
    description: t.items.artovnia.description,
    image: "/media/artovniaImage.webp",
    slug: "multivendor-e-commerce-platform",
    year: "2026",
  },
  {
    id: "2",
    title: t.items.animeSearch.title,
    category: t.items.animeSearch.category,
    description: t.items.animeSearch.description,
    image: "/media/ansearch.webp",
    slug: "anime-platform",
    year: "2025",
  },
  {
    id: "3",
    title: t.items.flixstock.title,
    category: t.items.flixstock.category,
    description: t.items.flixstock.description,
    image: "/media/packstock.webp",
    slug: "flixstock-app",
    year: "2024",
  },
  {
    id: "4",
    title: t.items.portfolio.title,
    category: t.items.portfolio.category,
    description: t.items.portfolio.description,
    image: "/media/mojaStrona2.webp",
    slug: "personal-portfolio-website",
    year: "2024",
  },
];

// ─── Variants (defined once outside component, no re-creation) ───
const bgVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

const titleVariants = {
  rest: { x: 0 },
  hover: { x: 20 },
};

const descVariants = {
  rest: { x: 0, opacity: 0 },
  hover: { x: 20, opacity: 1 },
};

const arrowVariants = {
  rest: { x: -10, opacity: 0 },
  hover: { x: 0, opacity: 1 },
};

const previewVariants = {
  rest: { opacity: 0, scale: 0.9, y: 10 },
  hover: { opacity: 1, scale: 1, y: 0 },
};

const hoverTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
const descTransition = {
  duration: 0.4,
  delay: 0.05,
  ease: [0.16, 1, 0.3, 1],
};
const arrowTransition = { duration: 0.3 };
const previewTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

// ─── ProjectRow ───
// Simplified for performance - no animated transitions on hover
const ProjectRow = memo<{ project: Project; index: number }>(
  ({ project, index }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(rowRef, {
      once: true,
      margin: "-50px",
    });

    return (
      <motion.div
        ref={rowRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
      >
        <Link to={`/project/${project.slug}`} aria-label={`View project: ${project.title}`}>
          <article className="group relative py-4 lg:py-8 border-b border-white/10 cursor-pointer hover:border-white/20 transition-colors">
            {/* Background hover effect - CSS only */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-4">
              {/* Number */}
              <span className="text-xs text-teal-300 font-jakarta tracking-widest lg:w-12 flex-shrink-0" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Title */}
              <div className="lg:w-72 flex-shrink-0">
                <h3 className="text-2xl sm:text-3xl font-light text-white font-jakarta group-hover:text-teal-300 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm font-jakarta mt-1 text-white/40 italic">
                  {project.category} — {project.year}
                </p>
              </div>

              {/* Description - separate column */}
              <div className="lg:flex-1">
                <p className="font-jakarta font-light leading-relaxed text-white/70">
                  {project.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center flex-shrink-0">
                <ArrowUpRight className="w-6 h-6 text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </div>
            </div>

            
             {/* Mobile arrow - always visible */}
            <div className="flex lg:hidden items-center justify-end flex-shrink-0" aria-hidden="true">
               <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                 <ArrowUpRight className="w-4 h-4 text-teal-300" />
             </div>
            </div>

            {/* Hover image preview - CSS only for performance */}
            <div className="absolute right-24 top-1/3 -translate-y-1/3 w-80 h-56 pointer-events-none hidden lg:block z-50 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300">
              <div className="w-full h-full bg-indigo-900 border border-teal-300/30 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`Preview of ${project.title} project`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-900">
                    <span className="text-white/20 text-xs font-jakarta">
                      [ Image ]
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-teal-300" aria-hidden="true" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-teal-300" aria-hidden="true" />
            </div>
          </article>
        </Link>
      </motion.div>
    );
  },
);

ProjectRow.displayName = "ProjectRow";

// ─── Section ───
const ProjectsNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-100px",
  });
  const { language } = useLanguage();
  const t = translations[language].projects;
  const projects = getProjects(t);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineScaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0, 1],
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="mb-16">
          <BurnSpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-7xl font-light font-jakarta" glowSize={150} baseDelay={200} charDelay={40}>
            {t.heading}
          </BurnSpotlightText>

          <motion.div
            style={{ scaleX: lineScaleX }}
            className="h-px bg-teal-300 mt-8 origin-left"
          />
        </div>

        <div className="border-t border-white/10">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-row items-center justify-center lg:justify-start mt-16 "
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950 rounded"
            aria-label="Contact me to work together"
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
    </section>
  );
};

export default ProjectsNew;