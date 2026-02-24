import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

// Enhanced animation variants
const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const tabsContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.4
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 20 
    }
  }
};

const tagVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.2,
      type: "spring", 
      stiffness: 500, 
      damping: 15 
    }
  }
};

const featureVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 10 
    }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.3,
      type: "spring", 
      stiffness: 200, 
      damping: 15 
    }
  },
  hover: { 
    scale: 1.05,
    backgroundColor: "#2dd4bf", // Darker teal on hover
    boxShadow: "0 0 15px rgba(45, 212, 191, 0.5)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  }
};

const PricingComponent = () => {
  const { language } = useLanguage();
  const t = translations[language].pricing;
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("websites");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation control based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('pricing-plans');
      if (section) {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        setIsVisible(isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Go to contact form with selected plan
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

  // Define a mapping between category keys and their translated values
  const categoryKeyToTranslation = {
    "websites": t.tabs.websites,
    "platforms": t.tabs.platforms,
    "appsheets": t.tabs.appsheets
  };

  // Temporary translation until Wordpress is in offer
  const comingSoon = {
    en: {
      message: 'Coming soon... Wordpress websites',
    },
    pl: {
      message: 'Już wkrótce... Strony internetowe z Wordpress.',
    },
  };

  const plans = [
    { 
      name: t.singlePage.title, 
      price: t.singlePage.price, 
      description: t.singlePage.description, 
      features: t.singlePage.features, 
      tag: t.singlePage.tag, 
      categoryKey: "websites"
    },
    { 
      name: t.portfolio.title, 
      price: t.portfolio.price, 
      description: t.portfolio.description, 
      features: t.portfolio.features, 
      tag: t.portfolio.tag, 
      categoryKey: "websites"
    },
    { 
      name: t.portfolioPlus.title, 
      price: t.portfolioPlus.price, 
      description: t.portfolioPlus.description, 
      features: t.portfolioPlus.features, 
      tag: t.portfolioPlus.tag, 
      categoryKey: "websites"
    },
    { 
      name: t.customWebsite.title, 
      price: t.customWebsite.price, 
      description: t.customWebsite.description, 
      features: t.customWebsite.features, 
      tag: t.customWebsite.tag, 
      categoryKey: "platforms"
    },
    { 
      name: t.entry.title, 
      price: t.entry.price, 
      description: t.entry.description, 
      features: t.entry.features, 
      tag: t.entry.tag, 
      categoryKey: "appsheets"
    },
    { 
      name: t.basic.title, 
      price: t.basic.price, 
      description: t.basic.description, 
      features: t.basic.features, 
      tag: t.basic.tag, 
      categoryKey: "appsheets"
    },
    { 
      name: t.custom.title, 
      price: t.custom.price, 
      description: t.custom.description, 
      features: t.custom.features, 
      tag: t.custom.tag, 
      categoryKey: "appsheets"
    },
  ];

  // Use the category keys array instead of translated texts
  const categoryKeys = ["websites", "platforms", "appsheets"];
  
  // Filter plans by the categoryKey rather than the translated text
  const filteredPlans = plans.filter(plan => plan.categoryKey === selectedCategoryKey);

  return (
    <div id="pricing" className="pb-16  bg-[#140F2D]">
      <motion.section 
        id="pricing-plans"
        className="py-20 sm:py-20 "
        variants={sectionVariants}
        initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header Section with enhanced animations */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          variants={headerVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-2 lg:gap-4">
            <motion.span 
              className="text-4xl sm:text-6xl text-white font-normal font-jakarta"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              
              {t.title} <span > {t.subtitle} </span>
            </motion.span>
            <motion.span 
              className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta lg:text-right mt-2 lg:mt-0 lg:-mb-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t.right1}
            </motion.span>
          </div>
        </motion.div>
        
        {/* Category selector with tab animations */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-center gap-4 mb-8 border-b border-white/20"
          variants={tabsContainerVariants}
        >  
          {categoryKeys.map((categoryKey, index) => (
            <motion.button
              key={categoryKey}
              variants={tabVariants}
              onClick={() => setSelectedCategoryKey(categoryKey)}
              className={`min-w-[140px] md:min-w-[160px] px-4 py-2 text-sm font-jakarta font-normal text-center transition-all relative
                ${selectedCategoryKey === categoryKey 
                  ? "text-teal-300" 
                  : "text-white hover:text-teal-300"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {categoryKeyToTranslation[categoryKey]}
              {selectedCategoryKey === categoryKey && (
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-300"
                  layoutId="tabIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
  
        {/* Card grid with staggered animations */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategoryKey}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-gradient-to-br from-white/10 via-[#140F2D] to-[#140F2D] rounded-lg p-8 flex flex-col transition-all duration-300 ring-1 ring-white/10 relative mt-6 "
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 0 25px rgba(45, 212, 191, 0.2)",
                  borderColor: "rgba(45, 212, 191, 0.5)"
                }}
              >
                {/* Subtle background glow effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-500/5 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Tag with spring animation */}
                <motion.div 
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-300 text-black px-3 py-1 rounded-lg text-sm text-center shadow-lg font-medium"
                  variants={tagVariants}
                >
                  {plan.tag}
                </motion.div>
                
                <h3 className="text-2xl font-light text-white mb-4 mt-4 relative z-10">{plan.name}</h3>
                <motion.p 
                  className="text-3xl text-teal-300 mb-8 relative z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {plan.price}
                </motion.p>
                
                <p className="text-white/80 mb-6 relative z-10">{plan.description}</p>
                
                <ul className="flex-grow space-y-4 mb-8 relative z-10">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-start text-white font-light"
                      variants={featureVariants}
                      custom={featureIndex}
                    >
                      <CheckCircle className="w-5 h-5 mr-2 text-teal-300 flex-shrink-0 mt-0.5" />
                      <span className="text-base">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.button
                  onClick={() => handlePlanClick(plan.name)}
                  onMouseEnter={() => setHoveredButton(`plan-${index}`)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="GlowButton font-jakarta bg-teal-300 text-gray-900 px-6 py-3 inline-flex items-center justify-center gap-2 mx-auto rounded-md relative z-10"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="font-medium">{t.monthly}</span>
                  {hoveredButton === `plan-${index}` ? (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0}}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowDownRight className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.section>
  
      {/* Coming soon message with subtle animation */}
      <motion.div 
        className="flex justify-center items-center h-24 text-white font-jakarta bg-[#140F2D]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {comingSoon[language].message}
        </motion.div>
      </motion.div>
    </div>
  );
};
  
export default PricingComponent;
