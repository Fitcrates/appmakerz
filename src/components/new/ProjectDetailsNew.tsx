import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { getProject, urlFor } from '../../lib/sanity.client';
import { ArrowLeft, Github, Globe, Feather, ArrowUpRight } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import HeaderNew from './HeaderNew';
import FooterNew from './FooterNew';
import { portableTextComponents } from '../PortableTextComponents';
import { Project } from '../../types/sanity.types';

const ProjectDetailsNew = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language].projectDetails;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!slug) throw new Error("No slug provided");

        // Always fetch fresh data from Sanity
        const fetchedProject = await getProject(slug);
        setProject(fetchedProject);
      } catch (err) {
        setError("Failed to fetch project details");
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-2 border-teal-300/30 border-t-teal-300 rounded-full animate-spin" />
          <span className="text-white/50 font-jakarta">Loading project...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <>
        <HeaderNew />
        <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white font-jakarta mb-4">Project not found</h1>
            <HashLink to="/#projects" className="text-teal-300 hover:text-teal-200 transition-colors">
              ← Back to projects
            </HashLink>
          </div>
        </div>
        <FooterNew />
      </>
    );
  }

  return (
    <>
      <HeaderNew />
      
      <main className="min-h-screen bg-indigo-950 pt-16 lg:pt-24 pb-24">
        {/* Hero section with image */}
        {project.mainImage && (
          <div className="relative h-[50vh] lg:h-[60vh]  lg:mb-16">
            <img
              src={urlFor(project.mainImage).auto('format').fit('max').url()}
              alt={project.title[language]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-transparent" />
          </div>
        )}

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <HashLink
              smooth
              to="/#projects"
              className="inline-flex items-center text-white/60 hover:text-teal-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-jakarta text-sm">{t.backToProjects}</span>
            </HashLink>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-light text-white font-jakarta leading-tight mb-8"
          >
            {project.title[language]}
          </motion.h1>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 font-jakarta text-sm"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Project links */}
          <div className="flex flex-wrap gap-4 mb-16 pb-12 border-b border-white/10">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-3 bg-teal-300 text-indigo-950 font-jakarta font-medium hover:bg-teal-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {t.liveDemo}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white font-jakarta hover:border-teal-300 hover:text-teal-300 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  {t.sourceCode}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
              {project.blogUrl && (
                <a
                  href={project.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white font-jakarta hover:border-teal-300 hover:text-teal-300 transition-colors"
                >
                  <Feather className="w-4 h-4" />
                  {t.blogPost}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
          </div>

          {/* Project body */}
          <article
            className="prose prose-lg prose-invert max-w-none font-jakarta
              prose-headings:font-jakarta prose-headings:font-light prose-headings:text-white
              prose-h1:text-teal-300 prose-h2:text-teal-300 prose-h3:text-white prose-h4:text-white
              prose-p:text-white/60 prose-p:leading-relaxed
              prose-a:text-teal-300 prose-a:no-underline hover:prose-a:text-teal-200
              prose-strong:text-white prose-strong:font-medium
              prose-li:text-white/60 prose-li:marker:text-teal-300
              prose-ul:text-white/60 prose-ol:text-white/60
              prose-code:text-teal-300 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-l-teal-300 prose-blockquote:text-white/50
              prose-img:rounded-lg prose-img:border prose-img:border-white/10"
          >
            {(() => {
              const getBodyContent = () => {
                if (!project.body) {
                  return null;
                }

                if (project.body[language] && Array.isArray(project.body[language]) && project.body[language].length > 0) {
                  return project.body[language];
                }

                const otherLang = language === 'en' ? 'pl' : 'en';
                if (project.body[otherLang] && Array.isArray(project.body[otherLang]) && project.body[otherLang].length > 0) {
                  return project.body[otherLang];
                }

                if (Array.isArray(project.body) && project.body.length > 0) {
                  return project.body;
                }

                return null;
              };

              const bodyContent = getBodyContent();

              if (bodyContent) {
                return (
                  <PortableText
                    value={bodyContent}
                    components={portableTextComponents}
                  />
                );
              }

              if (project.description) {
                const desc = project.description[language] || project.description;
                return <p>{typeof desc === 'string' ? desc : JSON.stringify(desc)}</p>;
              }

              return (
                <div className="text-white/40 space-y-4">
                  <p>No body content found for this project.</p>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-teal-300/50">Debug info</summary>
                    <pre className="mt-2 p-4 bg-white/5 overflow-auto text-white/30">
                      {JSON.stringify({
                        hasBody: !!project.body,
                        bodyKeys: project.body ? Object.keys(project.body) : [],
                        bodyEn: project.body?.en ? `Array(${project.body.en.length})` : 'undefined',
                        bodyPl: project.body?.pl ? `Array(${project.body.pl.length})` : 'undefined',
                        currentLang: language
                      }, null, 2)}
                    </pre>
                  </details>
                </div>
              );
            })()}
          </article>
        </section>
      </main>

      <FooterNew />
    </>
  );
};

export default ProjectDetailsNew;
