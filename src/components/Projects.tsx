import React from 'react';
import { ArrowUpRight, ShieldX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const Projects = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;

  return (
    <section id="projects" className="py-20 sm:py-40 bg-[#140F2D] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-36">
        {/* Heading */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-16 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={titleVariants}
        >
          <span className="text-5xl sm:text-7xl text-white font-normal font-jakarta">
            {t.title}
          </span>
          <span className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta text-right sm:-mb-10">
            {t.categories.all}
          </span>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Custom Website Card */}
          <motion.div
            key={0}
            variants={cardVariants}
            className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative mb-8 lg:mb-0"
          >
            <div className="h-2/5 bg-[#140F2D] overflow-hidden">
              <img
                src="/media/moja strona2.png"
                alt="Custom Website"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-3/5 p-6 flex flex-col relative">
              {/* Background Image */}
              <img
                src="/media/tlokarta1.webp"
                alt="Custom Website"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <h3 className="text-2xl font-light text-white mt-2 font-jakarta z-10">
                {t.categories.web.title}
              </h3>
              <p className="text-white mt-4 font-jakarta font-light leading-relaxed text-sm z-10">
                {t.categories.web.description.line1}{' '}
                {t.categories.web.description.line2}{' '}
                {t.categories.web.description.line3}{' '}
                {t.categories.web.description.line4}
              </p>
              <a
                href="#"
                className="text-white hover:text-teal-300 mt-auto inline-flex items-center space-x-1 z-10"
              >
                <span>{t.viewProject}</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Custom App Card */}
          <motion.div
            key={1}
            variants={cardVariants}
            className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative mb-8 lg:mb-0"
          >
            <div className="h-2/5 bg-[#140F2D] overflow-hidden">
              <img
                src="/media/flixapp.png"
                alt="Mobile App"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-3/5 p-6 flex flex-col relative">
              {/* Background Image */}
              <img
                src="/media/tlokarta2.webp"
                alt="Mobile App"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <h3 className="text-2xl font-light text-white mt-2 font-jakarta z-10">
                {t.categories.mobile.title}
              </h3>
              <p className="text-white mt-4 font-jakarta font-light leading-snug text-sm z-10">
                {t.categories.mobile.description.line1}{' '}
                {t.categories.mobile.description.line2}{' '}
                {t.categories.mobile.description.line3}
              </p>
              <span className="text-white mt-1 font-jakarta font-light leading-snug tracking-wide text-sm z-10">
                {t.categories.mobile.description.line4}
              </span>
              <a
                href="https://www.appsheet.com/start/9a9a55ba-971a-44dd-bb24-67241f296c46"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-teal-300 mt-auto inline-flex items-center space-x-1 z-10"
              >
                <span>{t.viewProject}</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Design Card */}
          <motion.div
            key={2}
            variants={cardVariants}
            className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
            ring-1 ring-white ring-opacity-80 flex flex-col relative"
          >
            <div className="h-2/5 bg-[#140F2D] overflow-hidden">
              <img
                src="/media/glide1.png"
                alt="Design"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-3/5 p-6 flex flex-col relative">
              {/* Background Image */}
              <img
                src="/media/tlokarta3.webp"
                alt="Private app"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <h3 className="text-2xl font-light text-white mt-2 font-jakarta z-10">
                {t.categories.design.title}
              </h3>
              <p className="text-white mt-4 font-jakarta font-light leading-snug text-sm z-10">
                {t.categories.design.description.line1}{' '}
                {t.categories.design.description.line2}{' '}
                {t.categories.design.description.line3}
              </p>
              <a
                href="#"
                className="text-white hover:text-teal-300 mt-auto inline-flex items-center space-x-1 z-10"
              >
                <span>Private</span>
                <ShieldX className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
