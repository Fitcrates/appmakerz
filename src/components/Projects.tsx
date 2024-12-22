import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Projects = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;

  return (
    <section 
    id="projects"
    className="py-20 sm:py-40 bg-[#140F2D] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-36">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-16 gap-4">
          <span className="text-5xl sm:text-7xl text-white font-normal font-jakarta">
            {t.title}
          </span>
          <span className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta text-left sm:text-right sm:-mb-10">
            {t.categories.all}
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-28 justify-items-center">
          {/* Custom Website Card */}
          <div
            className="h-96 w-full max-w-sm md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-1/2 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="https://i.postimg.cc/bJNbW8y3/stronaapp.png"
                alt="Custom Website"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-1/2 p-6 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/7YkLfyC9/tlokarta1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left -mt-2 font-jakarta font-normal">
                {t.categories.web.title}
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm">
                {t.categories.web.description.line1}
              </p>
              <span className="text-white text-left font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm block mt-1">
                {t.categories.web.description.line2}
              </span>
              <div className="absolute bottom-6 left-6 space-x-2">
                <a
                  href="#"
                  className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                >
                  <span>{t.viewProject}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Custom App Card */}
          <div
            className="h-96 w-full max-w-sm md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-1/2 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="https://i.postimg.cc/G9ws5dmv/fsimage.jpg"
                alt="Mobile App"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-1/2 p-6 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/VksLWBWb/tlokarta2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left -mt-2 font-jakarta font-normal">
                {t.categories.mobile.title}
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm">
                {t.categories.mobile.description.line1}
              </p>
              <span className="text-white text-left font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm block mt-1">
                {t.categories.mobile.description.line2}
              </span>
              <div className="absolute bottom-6 left-6 space-x-2">
                <a
                  href="#"
                  className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                >
                  <span>{t.viewProject}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Portfolio Website Card */}
          <div
            className="h-96 w-full max-w-sm md:w-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-1/2 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800"
                alt="Portfolio Website"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-1/2 p-6 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/jS8qgwM3/tlokarta3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left -mt-2 font-jakarta font-normal">
                {t.categories.design.title}
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm">
                {t.categories.design.description.line1}
              </p>
              <span className="text-white text-left font-extralight font-jakarta leading-snug tracking-normal text-justify text-sm block mt-1">
                {t.categories.design.description.line2}
              </span>
              <div className="absolute bottom-6 left-6 space-x-2">
                <a
                  href="#"
                  className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                >
                  <span>{t.viewProject}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
