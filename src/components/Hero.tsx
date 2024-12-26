7import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section
      id="home"
      className="hero-section min-h-screen h-screen w-full flex items-center md:items-end pb-16 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end px-4 sm:px-6 lg:px-8">
        {/* Left Section: Heading */}
        <div className="flex flex-col justify-center md:justify-end mb-8 md:mb-0 text-center md:text-left">
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
        <div className="flex flex-col md:flex-row md:items-end justify-center space-y-4 md:space-y-0 md:space-x-2">
          {/* Text Column */}
          <div className="flex flex-col gap-0 text-center md:text-left">
            <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
              {t.subtitle.line1}
            </span>
            <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
              {t.subtitle.line2}
            </span>
            <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
              {t.subtitle.line3}
            </span>
            <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
              {t.subtitle.line4}
            </span>
          </div>

          {/* Arrow Column */}
          <div className="flex justify-end md:justify-end ml-0 md:ml-4">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 
              hover:scale-125 flex items-center md:items-end cursor-pointer"
            >
              <ArrowUpRight
                className="w-16 h-24 md:w-auto md:h-32 md:h-60 -mb-8 md:-mb-16"
                strokeWidth={0.7}
                strokeLinecap="butt"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
