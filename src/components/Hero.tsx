import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section
      id="home"
      className="hero-section min-h-screen h-screen w-full flex items-end pb-24 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-8">
          {/* Centered Text Section */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Large White Headings */}
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
              {t.title.line1}
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
              {t.title.line2}
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
              {t.title.line3}
            </h1>
          </div>

          {/* Desktop View: Black Subtext and Arrow in Two Columns */}
          <div className="hidden md:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-16 -space-x-6 md:-space-x-6">
            {/* Text Column */}
            <div className="text-left flex flex-col leading-loose">
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight">
                {t.subtitle.line1}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight">
                {t.subtitle.line2}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight">
                {t.subtitle.line3}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight">
                {t.subtitle.line4}
              </span>
            </div>

            {/* Arrow Section - Positioned to the Right */}
            <div className="flex items-end md:ml-8 mt-6 md:mt-0">
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 hover:scale-125 flex items-center cursor-pointer"
              >
                <ArrowUpRight
                  className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0"
                  strokeWidth={0.7}
                  strokeLinecap="butt"
                />
              </a>
            </div>
          </div>

          {/* Mobile View: Centered Button */}
          <div className="md:hidden flex flex-col items-center justify-center w-full mt-28 mb-96">
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-6 bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center space-x-2 font-jakarta font-medium text-lg"
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
