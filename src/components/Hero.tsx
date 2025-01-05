import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  // State to manage hover
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="home"
      className="hero-section min-h-screen h-screen w-full flex items-end pb-24 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full">
          {/* Centered Text Section */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Large White Headings */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl text-white tracking-tight font-jakarta font-normal leading-snug">
              {t.title.line1}
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-8xl text-white tracking-tight font-jakarta font-normal -mt-4 leading-snug">
              {t.title.line2}
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-8xl text-white tracking-tight font-jakarta font-normal -mt-4 leading-snug">
              {t.title.line3}
            </h1>
          </div>

          {/* Desktop View: Black Subtext and Arrow in Two Columns */}
          <div className="hidden md:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-12">
            {/* Text Column */}
            <div className="text-left flex flex-col leading-loose">
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-tight font-jakarta font-extralight -mt-1">
                {t.subtitle.line1}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-tight font-jakarta font-extralight -mt-1">
                {t.subtitle.line2}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-tight font-jakarta font-extralight -mt-1">
                {t.subtitle.line3}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-tight font-jakarta font-extralight -mt-1">
                {t.subtitle.line4}
              </span>
            </div>

            {/* Arrow Section */}
            <div
              className="flex items-end md:ml-8 mt-6 md:mt-0 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)} // Handle hover start
              onMouseLeave={() => setIsHovered(false)} // Handle hover end
            >
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white hover:text-indigo-500 transform transition-transform duration-1000 flex items-center"
              >
                {isHovered ? (
                  <ArrowDown
                    className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0 transition-transform duration-1000 transform rotate-360"
                    strokeWidth={0.7}
                    strokeLinecap="butt"
                  />
                ) : (
                  <ArrowUpRight
                    className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0 transition-transform duration-1000"
                    strokeWidth={0.7}
                    strokeLinecap="butt"
                  />
                )}
              </a>
            </div>
          </div>

          {/* Mobile View: Centered Button */}
          <div className="md:hidden flex flex-col items-center justify-center w-full mt-12 mb-36">
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-6 bg-teal-300 text-gray-900 rounded-full hover:bg-teal-600 transition-colors duration-300 flex items-center space-x-2 font-jakarta font-medium text-lg"
            >
              <span>Learn More</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
