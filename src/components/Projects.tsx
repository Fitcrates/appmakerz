import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { ShieldX } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Projects = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;

  return (
    <section 
    id="projects"
    className="py-20 sm:py-40 bg-[#140F2D] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-36">
        {/* Heading */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-16 gap-2 sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <span className="text-5xl sm:text-7xl text-white font-normal font-jakarta">
            {t.title}
          </span>
          <span className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta text-left sm:text-right mt-2 sm:mt-0 sm:-mb-10">
            {t.categories.all}
          </span>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Custom Website Card */}
          <motion.div
            key={0}
            variants={cardVariants}
            className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative mb-8 lg:mb-0"
          >
            {/* Top Image Section */}
            <div className="h-2/5 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="public\media\moja strona2.png"
                alt="Custom Website"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-3/5 p-8 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/7YkLfyC9/tlokarta1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left mt-2 font-jakarta font-normal">
                {t.categories.web.title}
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-relaxed tracking-wide text-left text-sm">
                {t.categories.web.description.line1} {t.categories.web.description.line2} {t.categories.web.description.line3} {t.categories.web.description.line4}
              </p>
              
              <div className="absolute bottom-8 left-8 space-x-2">
                <a
                  href="#"
                  className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                >
                  <span>{t.viewProject}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

         {/* Custom App Card */}
          <motion.div
            key={1}
            variants={cardVariants}
            className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative mb-8 lg:mb-0"
          >
            {/* Top Image Section */}
            <div className="h-2/5 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="public\media\flixapp.png"
                alt="Mobile App"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-3/5 p-8 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/VksLWBWb/tlokarta2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left mt-2 font-jakarta font-normal">
                {t.categories.mobile.title}
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-wide text-left text-sm">
                {t.categories.mobile.description.line1} {t.categories.mobile.description.line2} {t.categories.mobile.description.line3} 
              </p>
              <span className="text-white text-left mt-1 font-extralight font-jakarta leading-snug tracking-wide text-left text-sm">
                {t.categories.mobile.description.line4}
              </span>
              <div className="absolute bottom-8 left-8 space-x-2">
                <a
                  href="https://www.appsheet.com/start/9a9a55ba-971a-44dd-bb24-67241f296c46"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                >
                  <span>{t.viewProject}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Design Card */}
          <motion.div
            key={2}
            variants={cardVariants}
            className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            {/* Top Image Section */}
            <div className="h-2/5 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
              <img
                src="public\media\glide1.png"
                alt="Design"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div
              className="h-3/5 p-8 flex flex-col relative"
              style={{
                backgroundImage: 'url(https://i.postimg.cc/jS8qgwM3/tlokarta3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
              }}
            >
              <h3 className="text-2xl font-light text-white text-left mt-2 font-jakarta font-normal">
                {t.categories.design.title} 
              </h3>
              <p className="text-white text-left mt-8 font-extralight font-jakarta leading-snug tracking-wide text-left text-sm">
                {t.categories.design.description.line1} {t.categories.design.description.line2} {t.categories.design.description.line3}
              </p>
              <div className="absolute bottom-8 left-8 space-x-2">
                <a
                  href="#"
                  className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                >
                  <span>Private</span>
                  <ShieldX className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
