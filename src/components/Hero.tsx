import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section
      id="home"
      className="hero-section min-h-screen h-screen w-full flex items-end pb-16 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
        {/* Centered Text Section */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left w-full pb-8">
          {/* Large White Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
            {t.title.line1}
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
            {t.title.line2}
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
            {t.title.line3}
          </h1>

          {/* Black Subtext and Arrow in Two Columns */}
          <div className="flex flex-row items-center justify-between w-full mt-4">
            {/* Text Column */}
            <div className="flex flex-col gap-1">
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight leading-[0.8]">
                {t.subtitle.line1}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight leading-[0.8]">
                {t.subtitle.line2}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight leading-[0.8]">
                {t.subtitle.line3}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight leading-[0.8]">
                {t.subtitle.line4}
              </span>
            </div>

            {/* Arrow Column */}
            <div className="-ml-32 flex justify-center">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 
                hover:scale-125 flex items-center cursor-pointer"
              >
                <ArrowUpRight
                  className="w-auto h-36 sm:h-36 md:h-36"
                  strokeWidth={0.7}
                  strokeLinecap="butt"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
