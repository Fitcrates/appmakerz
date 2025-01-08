import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderTitle = (line: string, index: number) => {
    if (isMobile) {
      return (
        <h1 key={index} className="text-2xl font-light text-white font-jakarta">
          {line}
        </h1>
      );
    }
    return (
      <h1
        key={index}
        className="text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta leading-snug -mt-4"
        style={{
          animationDelay: `${(index + 1) * 0.1}s`
        }}
      >
        {line}
      </h1>
    );
  };

  return (
    <section className="hero-section min-h-screen h-screen w-full flex items-end pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-8">
          {/* Text Container */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-2 md:space-y-0">
            {[t.title.line1, t.title.line2, t.title.line3].map((line, index) => renderTitle(line, index))}
          </div>

          {/* Desktop View: Black Subtext and Arrow in Two Columns */}
          <div className="hidden md:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-6">
            {/* Text Column */}
            <div className="text-left flex flex-col leading-loose">
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                {t.subtitle.line1}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                {t.subtitle.line2}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                {t.subtitle.line3}
              </span>
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                {t.subtitle.line4}
              </span>
            </div>

            {/* Arrow Section */}
            <div
              className="flex items-end md:ml-8 mt-6 md:mt-0 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <ArrowDown
                className={`w-12 h-12 transition-transform duration-300 ${
                  isHovered ? 'transform translate-y-2' : ''
                }`}
              />
            </div>
          </div>

          {/* Mobile View: Black Subtext */}
          <div className="md:hidden text-center mt-8">
            <span className="text-lg text-black tracking-wide font-jakarta font-extralight block">
              {t.subtitle.line1}
            </span>
            <span className="text-lg text-black tracking-wide font-jakarta font-extralight block">
              {t.subtitle.line2}
            </span>
            <span className="text-lg text-black tracking-wide font-jakarta font-extralight block">
              {t.subtitle.line3}
            </span>
            <span className="text-lg text-black tracking-wide font-jakarta font-extralight block">
              {t.subtitle.line4}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
