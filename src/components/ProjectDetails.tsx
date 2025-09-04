import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { getProject, urlFor } from '../lib/sanity.client';
import { ArrowLeft, Github, Globe, Feather } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import Header from './Header';
import Footer from './Footer';
import { portableTextComponents } from './PortableTextComponents';
import { Project } from '../types/sanity.types';
import ImageZoom from './ImageZoom';

const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language].backToProjects;
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!slug) throw new Error("No slug provided");
  
        // Try loading from cache first
        const cachedProject = localStorage.getItem(`project-${slug}`);
        if (cachedProject) {
          setProject(JSON.parse(cachedProject));
          return; // Avoid making another API call
        }
  
        // Fetch from Sanity if not cached
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

  // Prevent widows/orphans in text paragraphs
  useEffect(() => {
    const preventOrphans = () => {
      document.querySelectorAll('.prose p').forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/\s(a|I|the|an|to|of|in|on)\s/g, ' $1&nbsp;');
      });
    };

    preventOrphans();
  }, [project]);

  if (!project) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#140F2D]">
          <div className="text-white text-center">Loading project...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#140F2D] py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <HashLink
            smooth
            to="/#projects"
            className="inline-flex font-jakarta items-center text-white text-sm hover:text-teal-300 mb-8 mt-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-sm" />
            {translations[language].backToProjects.title}
          </HashLink>

          <h1 className="text-4xl font-bold text-white mb-4 font-jakarta">{project.title[language]}</h1>
            
          <article className="bg-[#140F2D] min-h-screen text-white py-8">
            {project.mainImage && (
              <ImageZoom
                src={urlFor(project.mainImage).width(1200).height(600).url()}
                alt={project.title[language]}
                className="w-full h-90 object-cover rounded-xl mb-8"
              />
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-teal-300 rounded-full text-sm text-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mb-8">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-300 rounded-full py-1 px-1 hover:bg-teal-300 hover:text-black"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {translations[language].backToProjects.demo}
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-300 rounded-full py-1 px-1 hover:bg-teal-300 hover:text-black"
                >
                  <Github className="w-4 h-4 mr-2" />
                  {translations[language].backToProjects.sourceCode}
                </a>
              )}
              {project.blogUrl && (
                <a
                  href={project.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-300 rounded-full py-1 px-1 hover:bg-teal-300 hover:text-black"
                >
                  <Feather className="w-4 h-4 mr-2" />
                  {translations[language].backToProjects.blogPost}
                </a>
              )}
            </div>

            <div className="prose prose-slate max-w-none text-white font-jakarta text-left">
              <PortableText
                value={project.body[language]}
                components={portableTextComponents}
              />
            </div>
          </article>
        </div>
      </div>
     
      <Footer />
    </>
  );
};

export default ProjectDetails;
