import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import Header from ''
const Projects = () => {
  const projects = [
    {
      title: "Custom Website",
      description: "A simple, but modern website for your brand. Fullstack development",
      image: "https://i.postimg.cc/fLSHZffM/man1.png",
      tech: ["React", "Tailwind", "Vite"],
      github: "https://github.com",
      live: "https://example.com"
    },
    {
      title: "Custom App",
      description: "A custom app for your medium and small business. Streamline your data processing with a custom app",
      image: "https://i.postimg.cc/G9ws5dmv/fsimage.jpg",
      tech: ["React", "Appsheets"],
      github: "https://github.com",
      live: "https://example.com"
    },
    {
      title: "Portfolio Website",
      description: "A modern portfolio website showcasing projects and skills",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800",
      tech: ["React"],
      github: "https://github.com",
      live: "https://example.com"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Projects</h2>
          <p className="mt-4 text-xl text-gray-600">Some of my recent work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-600"
            >
              <div className="relative -mt-10 mb-6">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full text-sm text-white shadow-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a 
                    href={project.github}
                    className="flex items-center text-gray-700 hover:text-indigo-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={20} className="mr-1" />
                    Code
                  </a>
                  <a 
                    href={project.live}
                    className="flex items-center text-gray-700 hover:text-indigo-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={20} className="mr-1" />
                    Live
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
