import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Contact from './components/Contact';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations/translations';
import Footer from './components/Footer';

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

const Pricing = () => {
  const { language } = useLanguage();
  const t = translations[language].pricing;
  const [isHovered, setIsHovered] = useState(false);

  useScrollToTop();

  const handlePlanClick = (planName) => {
    const contactSection = document.getElementById('contact'); 
    const searchParams = new URLSearchParams();
    searchParams.set('plan', planName);
    const url = new URL(window.location.href);
    url.hash = 'contact';
    window.history.replaceState({}, '', `${url.hash}?${searchParams.toString()}`);
    window.dispatchEvent(new Event('hashchange'));
  
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
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
    <>
      <Header />
      <main>
      <div className="fixed-bg"></div>

<section 
  id="pricing-hero" 
  className="min-h-screen h-screen w-full flex items-end pb-20 overflow-x-hidden"

>
<div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
<div className="flex flex-col lg:flex-row justify-between items-center lg:items-end w-full">
              {/* Text Container */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta  leading-none  -mt-1">
                  {t.title}
                </h1>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta  leading-none  -mt-1">
                  {t.subtitle}
                </h1>
              </div>

              {/* Desktop View: Black Subtext and Arrow */}
              <div className="hidden lg:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-12">
                {/* Text Column */}
                <div className="text-left flex flex-col leading-loose">
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight ">
                    {t.right1}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight ">
                    {t.right2}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight ">
                    {t.right3}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight ">
                    {t.right4}
                  </span>
                </div>

                {/* Arrow Section */}
                <div
                  className="flex items-end md:ml-8 mt-6 md:mt-0 cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <a
                    href="#pricing-plans"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-1000 flex items-center"
                  >
                    {isHovered ? (
                      <ArrowDownRight
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
              <div className="lg:hidden flex flex-col items-center justify-center w-full mt-16 mb-56">
                <button
                  onClick={() => {
                    document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="GlowButton py-2 px-4 flex items-center space-x-2 font-jakarta font-normal text-base"
                >
                  <span>{t.monthly}</span>
                  {isHovered ? (
        <ArrowDownRight className="w-6 h-6" />
      ) : (
        <ArrowUpRight className="w-4 h-4" />
      )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <motion.section 
          id="pricing-plans"
          className="py-16"
          style={{ backgroundColor: '#140F2D' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-gradient-to-br from-[#140F2D] to-white/15 rounded-lg p-8 flex flex-col hover:shadow-lg hover:shadow-teal-500 hover:bg-[#140F2D]/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-light text-white mb-4 font-jakarta">{plan.name}</h3>
                <p className="text-3xl text-teal-300 mb-8 font-jakarta">{plan.price}</p>
                <p className="text-white/80 mb-4 font-jakarta font-light">{plan.description}</p>
                <ul className="flex-grow space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start text-white font-light"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                    >
                      <span className="mr-2">•</span>
                      <span className="font-jakarta">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
  onClick={() => handlePlanClick(plan.name)}
  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
  className="GlowButton font-jakarta bg-teal-300 text-gray-900 px-4 py-2 text-sm inline-flex items-center justify-center gap-2 mx-auto hover:bg-teal-400 active:scale-95"
>
  <span>{t.monthly}</span>
  {isHovered ? (
        <ArrowDownRight className="w-6 h-6" />
      ) : (
        <ArrowUpRight className="w-4 h-4" />
      )}
</motion.button>



              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      <Contact />
      <Footer />
    </>
  );
};

export default Pricing;
