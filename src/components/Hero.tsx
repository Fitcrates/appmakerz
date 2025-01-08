import React, { memo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const Hero = memo(() => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section className="hero-section w-full flex items-end overflow-x-hidden">
      <div className="hero-content max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full relative">
          {/* Text Container */}
          <div className="hero-text flex flex-col items-center md:items-start w-full">
            {[t.title.line1, t.title.line2, t.title.line3].map((line, index) => (
              <h1
                key={index}
                className="hero-heading text-4xl sm:text-6xl md:text-8xl mb-2 md:mb-0"
                style={{
                  animationDelay: `${(index + 1) * 0.1}s`
                }}
              >
                {line}
              </h1>
            ))}
          </div>

          {/* Desktop View: Black Subtext and Arrow - Positioned absolutely on mobile */}
          <div className="fixed md:relative bottom-8 left-0 right-0 md:bottom-auto md:left-auto md:right-auto w-full md:w-auto flex justify-center md:justify-end">
            <div className="text-center md:text-left px-4 md:px-0">
              <span className="text-lg sm:text-xl md:text-3xl text-black tracking-normal font-extralight block">
                {t.subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
