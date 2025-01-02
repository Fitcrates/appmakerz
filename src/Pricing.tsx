import React from 'react';
import Header from './components/Header';
import Contact from './components/Contact';
import { ArrowUpRight } from 'lucide-react';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations/translations';
import Footer from './components/Footer';

const PricingTable = () => {
  const { language } = useLanguage();
  const t = translations[language].pricing;

  const handlePlanClick = (planName) => {
    const url = new URL(window.location.href);
    url.hash = 'contact';
    const searchParams = new URLSearchParams();
    searchParams.set('plan', planName);
    window.history.replaceState({}, '', `${url.hash}?${searchParams.toString()}`);
    window.dispatchEvent(new Event('hashchange'));
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const plans = [
    {
      name: t.entry.title,
      price: t.entry.price,
      description: t.entry.description,
      features: t.entry.features,
    },
    {
      name: t.basic.title,
      price: t.basic.price,
      description: t.basic.description,
      features: t.basic.features,
    },
    {
      name: t.custom.title,
      price: t.custom.price,
      description: t.custom.description,
      features: t.custom.features,
    },
    {
      name: t.portfolio.title,
      price: t.portfolio.price,
      description: t.portfolio.description,
      features: t.portfolio.features,
    },
    {
      name: t.customWebsite.title,
      price: t.customWebsite.price,
      description: t.customWebsite.description,
      features: t.customWebsite.features,
    },
  ];

  return (
    <div>
      <section
        id="pricing-hero"
        className="hero-section min-h-screen h-screen w-full flex items-end pb-24 overflow-x-hidden"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-8">
            {/* Centered Text Section */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              {/* Large White Headings */}
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-snug -mt-4">
                {t.title}
              </h1>
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-snug -mt-4">
                {t.subtitle}
              </h1>
            </div>

            {/* Desktop View: Black Subtext and Arrow in Two Columns */}
            <div className="hidden md:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-6">
              {/* Text Column */}
              <div className="text-left flex flex-col leading-loose">
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.right1}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.right2}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.right3}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.right4}
                </span>
              </div>

              {/* Arrow Section - Positioned to the Right */}
              <div className="flex items-end md:ml-8 mt-6 md:mt-0">
                <a
                  href="#pricing-boxes"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('pricing-boxes')?.scrollIntoView({ behavior: 'smooth' });
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
            <div className="md:hidden flex flex-col items-center justify-center w-full mt-12 mb-36">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing-boxes')?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Pricing Cards Grid */}
      <section
        id="pricing-boxes"
        className="py-16"
        style={{ backgroundColor: '#140F2D' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#140F2D] to-white/5 backdrop-blur-sm rounded-lg p-8 flex flex-col hover:shadow-lg hover:shadow-teal-500/50 hover:bg-white/10 transition-colors"
            >
              <h3 className="text-2xl font-light text-white mb-4 font-jakarta">{plan.name}</h3>
              <p className="text-3xl text-teal-300 mb-8 font-jakarta">{plan.price}</p>
              <p className="text-white/80 mb-4 font-jakarta font-light">{plan.description}</p>
              <ul className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start text-white font-light"
                  >
                    <span className="mr-2">•</span>
                    <span className="font-jakarta">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanClick(plan.name)}
                className="w-full py-3 px-6 bg-teal-300 text-gray-900 rounded-full hover:shadow-lg hover:shadow-teal-500/50 transition-colors duration-300 flex items-center justify-center space-x-2 font-jakarta"
              >
                <span>{t.monthly}</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Pricing = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PricingTable />
      </main>
      <Contact />
      <Footer />
    </div>
  );
};

export default Pricing;
