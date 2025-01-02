import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

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

const About = () => {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section
      id="about"
      className="py-20"
      style={{ backgroundColor: '#140F2D' }}
    >
      <div className="max-w-7xl mx-auto mb-16 px-4 sm:px-6 lg:px-8 mt-4">
        {/* Heading */}
        <motion.div 
          className="text-left text-4xl sm:text-6xl mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="text-white font-medium font-jakarta">{t.heading.part1}</span>{' '}
          <span className="text-teal-300 animated-word font-medium font-jakarta">{t.heading.part2}</span>{' '}
          <span className="text-white font-medium font-jakarta">{t.heading.part3}</span>{' '}
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center mt-36"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Development Card */}
          <motion.div 
            variants={cardVariants}
            className="h-96 w-full max-w-2xl lg:max-w-md rounded-lg transition-all duration-300 flex flex-col relative mb-8 lg:mb-0 hover:scale-105"
          >
            {/* Number */}
            <div className="absolute top-0 text-white text-sm font-jakarta">01</div>
            {/* Image container */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-56 h-28">
              <div className="w-full h-3/4 bg-red-500 rounded-full blur-2xl transform -rotate-[2deg]"></div>
            </div>
            
            {/* Text container */}
            <div className="h-1/2 py-20 flex flex-col mt-auto">
              <h3 className="text-2xl font-light text-white text-left mt-0 font-jakarta font-medium">
                {t.cards.development.title}
              </h3>
              <p className="text-white text-left mt-4 font-light font-jakarta">
                {t.cards.development.description}
              </p>
            </div>
          </motion.div>

          {/* Design Card */}
          <motion.div 
            variants={cardVariants}
            className="h-96 w-full max-w-2xl lg:max-w-md rounded-lg transition-all duration-300 flex flex-col relative mb-8 lg:mb-0 hover:scale-105"
          >
            {/* Number */}
            <div className="absolute top-0 text-white text-sm font-jakarta">02</div>
            {/* Image container */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 h-28">
              <div className="w-full h-3/4 bg-teal-500 rounded-full blur-2xl transform -rotate-[2deg]"></div>
            </div>
            
            {/* Text container */}
            <div className="h-1/2 py-20 flex flex-col mt-auto">
              <h3 className="text-2xl font-light text-white text-left mt-0 font-jakarta font-medium">
                {t.cards.design.title}
              </h3>
              <p className="text-white text-left mt-4 font-light font-jakarta">
                {t.cards.design.description}
              </p>
            </div>
          </motion.div>

          {/* Strategy Card */}
          <motion.div 
            variants={cardVariants}
            className="h-96 w-full max-w-2xl lg:max-w-md rounded-lg transition-all duration-300 flex flex-col relative hover:scale-105"
          >
            {/* Number */}
            <div className="absolute top-0 text-white text-sm font-jakarta">03</div>
            {/* Image container */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 h-28">
              <div className="w-full h-3/4 bg-purple-500 rounded-full blur-2xl transform -rotate-[2deg]"></div>
            </div>
            
            {/* Text container */}
            <div className="h-1/2 py-20 flex flex-col mt-auto">
              <h3 className="text-2xl font-light text-white text-left mt-0 font-jakarta font-medium">
                {t.cards.strategy.title}
              </h3>
              <p className="text-white text-left mt-4 font-light font-jakarta">
                {t.cards.strategy.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
