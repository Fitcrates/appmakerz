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
        {/* Content Section */}
        <div className="flex flex-col md:flex-row justify-between items-end w-full">
          {/* Left Section: Heading */}
          <div className="flex flex-col justify-end text-center md:text-left mb-8 md:mb-0">
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

          {/* Right Section: Text + Arrow */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full md:w-auto">
            {/* Text Column */}
            <div className="flex flex-col gap-2 text-center md:text-left">
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

            {/* Arrow Column */}
            <div className="flex justify-end ml-0 md:ml-4 mt-4 md:mt-0">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 
                hover:scale-125 flex items-end cursor-pointer"
              >
                <ArrowUpRight
                  className="w-16 h-16 md:w-32 md:h-32"
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
