import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface PageHeroProps {
  pageName: 'pricing' | 'blog';
}

const PageHero = ({ pageName }: PageHeroProps) => {
  const { language } = useLanguage();
  const t = translations[language][pageName];

  return (
    <section
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        backgroundImage: `url(https://i.postimg.cc/VsR5xjyL/tlohero.png)`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      className="min-h-screen h-screen w-full flex items-end bg-fixed pb-16 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-start justify-end h-full">
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-light text-white mb-4 font-jakarta">
              {t.title}
            </h1>
            <p className="text-2xl text-teal-300 font-light font-jakarta max-w-2xl">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
