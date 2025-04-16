import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

// Import the SVG as a URL
import websiteBuildSvgUrl from '../../src/websiteBuildSvg.svg';

// Define global window interface extension for SVG animation function
declare global {
  interface Window {
    setWebsiteBuildStep?: (step: number) => void;
  }
}

interface TimelineItem {
  number: string;
  title: string;
  text: string;
  lp: string;
}

interface TimelineProps {
  items?: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(typeof window !== 'undefined' && window.innerWidth >= 768);
  const [svgContent, setSvgContent] = useState<string>('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language].timeline;

  // Load SVG content
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(websiteBuildSvgUrl);
        const svgText = await response.text();
        // Remove the script tags from the SVG to avoid execution issues
        const cleanedSvgText = svgText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        setSvgContent(cleanedSvgText);
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    };
    
    loadSvg();
  }, []);

  // Custom function to control the SVG animation steps
  const updateSvgStep = (stepNum: number) => {
    if (!svgContainerRef.current) return;
    
    const svg = svgContainerRef.current.querySelector('svg');
    if (!svg) return;
    
    // Reset all steps
    for (let i = 1; i <= 6; i++) {
      const stepGroup = svg.querySelector(`#step${i}`);
      if (stepGroup) {
        const elements = stepGroup.children;
        for (let j = 0; j < elements.length; j++) {
          elements[j].setAttribute('opacity', '0');
        }
      }
    }
    
    // Show steps up to current
    for (let i = 1; i <= stepNum; i++) {
      const stepGroup = svg.querySelector(`#step${i}`);
      if (stepGroup) {
        const elements = stepGroup.children;
        for (let j = 0; j < elements.length; j++) {
          elements[j].setAttribute('opacity', i === stepNum ? '1' : '0.8');
        }
      }
    }
  };

  // Update SVG visualization when activeIndex changes
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    
    // We start drawing from step 1 (Contact)
    const svgStep = activeIndex + 1;
    
    // Use a short timeout to ensure the SVG is in the DOM
    setTimeout(() => {
      updateSvgStep(svgStep);
    }, 100);
  }, [svgContent, activeIndex]);

  // Timeline content with translations
  const timelineContent: Record<string, TimelineItem[]> = {
    en: [
      {
        lp: '1',
        number: 'Contact',
        title: 'Contact Us',
        text: 'Fill out our contact form and we will respond as soon as possible. We value your time and strive to reply promptly to discuss your projects potential.'
      },
      {
        lp: '2',
        number: 'Planning',
        title: 'Project Planning',
        text: 'Together we will assess your budget and needs. We plan the technology stack and project roadmap, ensuring every requirement and idea is considered for optimal results.'
      },
    
      {
        lp: '3',
        number: 'Design',
        title: 'UI/UX Design',
        text: 'Based on our initial assessment, your target audience, and your preferences, we prepare a bespoke graphic design for your app or website to maximize engagement and impact.'
      },
      {
        lp: '4',
        number: 'Development',
        title: 'Agile Development',
        text: 'Throughout development, we maintain a constant feedback loop with you to build features, optimize performance, and ensure the product matches your vision.'
      },
      {
        lp: '5',
        number: 'Deployment',
        title: 'Deployment & Launch',
        text: 'Once design and development are complete, we deploy your application to the most suitable and reliable services, ensuring security, scalability, and performance.'
      },
      {
        lp: '6',
        number: 'Training',
        title: 'Training & Handover',
        text: 'We provide comprehensive training and documentation, empowering you to maintain, update, and expand your app with confidence.'
      }
    ],
    pl: [
      {
        lp: '1',
        number: 'Kontakt',
        title: 'Skontaktuj się z nami',
        text: 'Wypełnij formularz kontaktowy, a my odpowiemy najszybciej jak to możliwe. Szanujemy Twój czas i zależy nam na sprawnej komunikacji, aby omówić potencjał Twojego projektu.'
      },
      {
        lp: '2',
        number: 'Planowanie',
        title: 'Planowanie Projektu',
        text: 'Wspólnie ocenimy Twój budżet i potrzeby. Zaplanujemy technologię oraz harmonogram projektu, dbając o każdy wymóg i pomysł dla uzyskania najlepszych efektów.'
      },
      {
        lp: '3',
        number: 'Projektowanie',
        title: 'Projekt Graficzny',
        text: 'Na podstawie wstępnej analizy, grupy docelowej oraz Twoich preferencji przygotujemy indywidualny projekt graficzny aplikacji lub strony, aby zwiększyć zaangażowanie i skuteczność.'
      },
      {
        lp: '4',
        number: 'Rozwój',
        title: 'Rozwój Aplikacji',
        text: 'Podczas rozwoju projektu utrzymujemy stały kontakt i pętlę informacji zwrotnej, by tworzyć funkcje, optymalizować wydajność i realizować Twoją wizję.'
      },
      {
        lp: '5',
        number: 'Wdrożenie',
        title: 'Wdrożenie i Start',
        text: 'Po zakończeniu projektowania i rozwoju wdrażamy aplikację na najbardziej optymalne i bezpieczne serwery, zapewniając skalowalność i wysoką wydajność.'
      },
      {
        lp: '6',
        number: 'Szkolenie',
        title: 'Szkolenie i Przekazanie',
        text: 'Zapewniamy pełne szkolenie i dokumentację, dzięki czemu z łatwością będziesz mógł zarządzać, aktualizować i rozwijać swoją aplikację.'
      }
    ]
  };

  // Use language context for timeline items
  const timelineItems: TimelineItem[] = timelineContent[language] || timelineContent.en;

  // Calculate progress percentage
  const progressPercentage = (activeIndex / (timelineItems.length - 1)) * 100;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const timelineVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: isHorizontal ? 0 : -20, y: isHorizontal ? -20 : 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.6,
      },
    },
  };

  /// Handle window resize safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsHorizontal(window.innerWidth >= 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Navigation handlers
  const goToPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < timelineItems.length - 1 ? prev + 1 : prev));
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div 
      className="w-full bg-[#140F2D] font-jakarta text-white pb-16 md:pb-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-16 gap-2 xl:gap-4">
          <motion.h1 
            className="text-4xl sm:text-6xl text-white font-normal font-jakarta"
            variants={headingVariants}
          >
            {t.heading}  
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta lg:text-right mt-2 lg:mt-0 lg:-mb-8"
            variants={headingVariants}
          >
            {t.subtitle} 
          </motion.p>
        </div>
        <div className="flex flex-col xl:flex-row">
          {/* Timeline Content - Left Side */}
          <motion.div 
            className="relative w-full xl:w-1/2"
            style={{ height: '600px' }}
            variants={timelineVariants}
            ref={timelineRef}
          >
            
            {/* Timeline Content - Centered with flex */}
            <div className="relative h-full w-full flex items-center justify-center  md:ml-16 lg:ml-24 xl:ml-[12rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative z-20 max-w-[95%] sm:max-w-[28rem] md:max-w-[28rem] h-[23rem] md:h-[23rem] min-h-[20rem] max-h-[23rem] md:min-h-[21.25rem] md:max-h-[23rem] flex flex-col items-center justify-center px-6 py-8 md:px-8 md:py-10"
                >
                  {/* Card with Soft Glow */}
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center -z-10">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-white/10 via-[#140F2D] to-[#140F2D] ring-1 ring-white/40 shadow-lg shadow-teal-300/40"></div>
                  </div>
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
                    <span className="absolute top-0 left-0 text-lg font-light font-jakarta text-teal-300 mb-2">{timelineItems[activeIndex].lp}</span>
                    <h4 className={`text-3xl md:text-4xl font-bold font-jakarta text-white mb-4 ${isHorizontal ? 'md:text-left' : 'text-left w-full'}`}>{timelineItems[activeIndex].title}</h4>
                    <p className={`text-base font-jakarta leading-relaxed text-white/80 ${isHorizontal ? 'md:text-left' : 'text-left w-full'}`}>{timelineItems[activeIndex].text}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation Buttons - Only show on desktop (horizontal) */}
            {isHorizontal && (
              <>
                <motion.button 
                  onClick={goToPrev}
                  disabled={activeIndex === 0}
                  className={`absolute z-30 text-white hover:text-teal-300 p-2 focus:outline-none transition-all duration-300 top-16 -left-4 ${activeIndex === 0 ? 'opacity-30' : 'opacity-100 hover:scale-110'}`}
                  variants={buttonVariants}
                >
                  {/* Up Arrow for desktop */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </motion.button>

                <motion.button 
                  onClick={goToNext}
                  disabled={activeIndex === timelineItems.length - 1}
                  className={`absolute z-30 text-white hover:text-teal-300 p-2 focus:outline-none transition-all duration-300 bottom-16 -left-4 ${activeIndex === timelineItems.length - 1 ? 'opacity-30' : 'opacity-100 hover:scale-110'}`}
                  variants={buttonVariants}
                >
                  {/* Down Arrow for desktop */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.button>
              </>
            )}

            {/* Timeline Years with Progress Bar - Desktop */}
            {isHorizontal && (
              <motion.div 
                className="absolute left-2 top-0 h-full flex flex-col justify-center z-20"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Fixed height container to ensure proper spacing */}
                <div className="relative h-[21rem]">
                  {/* Timeline vertical background line */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-white/10 rounded-full"></div>
                  
                  {/* Timeline vertical progress line */}
                  <div 
                    className="absolute left-0 top-0 w-1 bg-teal-300 rounded-full transition-all duration-500"
                    style={{ height: `${progressPercentage}%` }}
                  ></div>
                  
                  {/* Evenly spaced timeline items with absolute positioning */}
                  {timelineItems.map((item, idx) => {
                    // Calculate exact positioning for each dot based on index
                    const topPosition = idx * (94 / (timelineItems.length - 1));
                    
                    return (
                      <div 
                        key={idx}
                        className="absolute flex items-center cursor-pointer"
                        style={{ top: `${topPosition}%`, left: 0 }}
                        onClick={() => goToIndex(idx)}
                      >
                        {/* Dot centered on the vertical line */}
                        <div 
                          className={`absolute left-8 -mt-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                            idx === activeIndex
                              ? 'border-teal-300 bg-teal-300/80 shadow-lg animate-pulse'
                              : idx < activeIndex
                                ? 'border-teal-300 bg-teal-300/50'
                                : 'border-white/30 bg-white/10'
                          }`}
                        ></div>
                        
                        {/* Year label */}
                        <span 
                          className={`text-lg -mt-1 font-light font-jakarta ml-12 ${
                            idx === activeIndex 
                              ? 'text-teal-300' 
                              : idx < activeIndex
                                ? 'text-teal-300/60'
                                : 'text-white opacity-50'
                          }`}
                        >
                          {item.number}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Mobile Timeline Years (Dots) with Progress Indicator */}
            {!isHorizontal && (
              <motion.div 
                className="absolute left-0 right-0 bottom-12 flex flex-col items-center z-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                {/* Horizontal progress bar for mobile */}
                <div className="relative w-64 h-1 bg-white/10 rounded-full mb-4">
                  <div 
                    className="absolute left-0 top-0 h-full bg-teal-300 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                {/* Dots for mobile */}
                <div className="flex justify-center items-center gap-3">
                  {timelineItems.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => goToIndex(idx)}
                      className={`w-3 h-3 rounded-full cursor-pointer border-2 transition-all duration-300 ${
                        idx === activeIndex
                          ? 'border-teal-300 bg-teal-300/80 shadow-lg animate-pulse'
                          : idx < activeIndex
                            ? 'border-teal-300 bg-teal-300/50'
                            : 'border-white/30 bg-white/10'
                      }`}
                    ></div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Website Build SVG - Right Side */}
<motion.div 
  className="relative w-full xl:w-1/2 flex items-center justify-center xl:justify-end pr-0 md:pr-0 xl:pr-0"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, delay: 0.3 }}
>
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[400px] h-[300px]">
    {/* Background */}
    <rect width="400" height="300" fill="#140F2D" rx="8" ry="8" />
    
    {/* Step 1: Wireframes/Outlines */}
    <g id="step1">
      {/* Browser frame */}
      <rect x="50" y="40" width="300" height="220" rx="5" ry="5" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      {/* Browser top bar */}
      <rect x="50" y="40" width="300" height="30" rx="5" ry="5" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      {/* Browser buttons */}
      <circle cx="65" cy="55" r="5" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      <circle cx="85" cy="55" r="5" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      <circle cx="105" cy="55" r="5" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      {/* URL bar outline */}
      <rect x="130" y="45" width="200" height="20" rx="10" ry="10" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      {/* Wireframe hero section */}
      <rect x="70" y="90" width="260" height="80" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      {/* Wireframe content blocks */}
      <rect x="70" y="180" width="260" height="20" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
      <rect x="70" y="210" width="260" height="20" fill="none" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity={activeIndex >= 0 ? "1" : "0"} />
    </g>

    {/* Step 2: Structural Elements */}
    <g id="step2">
      {/* Browser frame */}
      <rect x="50" y="40" width="300" height="220" rx="5" ry="5" fill="#2E2853" stroke="#5EEAD4" strokeWidth="2" opacity={activeIndex >= 1 ? "1" : "0"} />
      {/* Browser top bar */}
      <rect x="50" y="40" width="300" height="30" rx="5" ry="5" fill="#211D4A" stroke="#5EEAD4" strokeWidth="2" opacity={activeIndex >= 1 ? "1" : "0"} />
      {/* Browser buttons */}
      <circle cx="65" cy="55" r="5" fill="#F87171" opacity={activeIndex >= 1 ? "1" : "0"} />
      <circle cx="85" cy="55" r="5" fill="#FBBF24" opacity={activeIndex >= 1 ? "1" : "0"} />
      <circle cx="105" cy="55" r="5" fill="#34D399" opacity={activeIndex >= 1 ? "1" : "0"} />
      {/* URL bar */}
      <rect x="130" y="45" width="200" height="20" rx="10" ry="10" fill="#3D3A6B" stroke="#5EEAD4" strokeWidth="1" opacity={activeIndex >= 1 ? "1" : "0"} />
      {/* Header */}
      <rect x="70" y="80" width="260" height="40" fill="#211D4A" opacity={activeIndex >= 1 ? "1" : "0"} />
      {/* Navigation */}
      <rect x="180" y="85" width="140" height="30" rx="5" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity={activeIndex >= 1 ? "1" : "0"} />
      <circle cx="200" cy="100" r="3" fill="#5EEAD4" opacity={activeIndex >= 1 ? "1" : "0"} />
      <circle cx="230" cy="100" r="3" fill="#5EEAD4" opacity={activeIndex >= 1 ? "1" : "0"} />
      <circle cx="260" cy="100" r="3" fill="#5EEAD4" opacity={activeIndex >= 1 ? "1" : "0"} />
      <circle cx="290" cy="100" r="3" fill="#5EEAD4" opacity={activeIndex >= 1 ? "1" : "0"} />
      {/* Logo placeholder */}
      <rect x="80" y="90" width="80" height="20" rx="3" ry="3" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity={activeIndex >= 1 ? "1" : "0"} />
    </g>

    {/* Step 3: Content Blocks */}
    <g id="step3">
      {/* Hero section */}
      <rect x="70" y="130" width="260" height="80" fill="#211D4A" opacity={activeIndex >= 2 ? "1" : "0"} />
      {/* Hero title */}
      <rect x="90" y="140" width="180" height="10" rx="2" ry="2" fill="#5EEAD4" opacity={activeIndex >= 2 ? "1" : "0"} />
      <rect x="90" y="155" width="160" height="10" rx="2" ry="2" fill="#5EEAD4" opacity={activeIndex >= 2 ? "1" : "0"} />
      {/* Hero image placeholder */}
      <rect x="270" y="140" width="40" height="40" rx="5" ry="5" fill="#5EEAD4" opacity={activeIndex >= 2 ? "1" : "0"} />
      {/* Hero button */}
      <rect x="90" y="180" width="80" height="20" rx="10" ry="10" fill="#5EEAD4" opacity={activeIndex >= 2 ? "1" : "0"} />
      {/* Content section */}
      <rect x="70" y="220" width="260" height="30" fill="#211D4A" opacity={activeIndex >= 2 ? "1" : "0"} />
      {/* Content blocks */}
      <rect x="80" y="225" width="60" height="20" rx="2" ry="2" fill="#3D3A6B" opacity={activeIndex >= 2 ? "1" : "0"} />
      <rect x="150" y="225" width="60" height="20" rx="2" ry="2" fill="#3D3A6B" opacity={activeIndex >= 2 ? "1" : "0"} />
      <rect x="220" y="225" width="60" height="20" rx="2" ry="2" fill="#3D3A6B" opacity={activeIndex >= 2 ? "1" : "0"} />
    </g>

    {/* Step 4: Styling/Colors */}
    <g id="step4">
      {/* Gradient overlay for hero */}
      <rect x="70" y="130" width="260" height="80" fill="url(#heroGradient)" opacity={activeIndex >= 3 ? "1" : "0"} />
      {/* More refined button */}
      <rect x="90" y="180" width="80" height="20" rx="10" ry="10" fill="#5EEAD4" opacity={activeIndex >= 3 ? "1" : "0"} />
      <rect x="92" y="182" width="76" height="16" rx="8" ry="8" fill="#211D4A" opacity={activeIndex >= 3 ? "1" : "0"} />
      {/* Styled text content */}
      <rect x="80" y="225" width="60" height="20" rx="2" ry="2" fill="url(#contentGradient)" opacity={activeIndex >= 3 ? "1" : "0"} />
      <rect x="150" y="225" width="60" height="20" rx="2" ry="2" fill="url(#contentGradient)" opacity={activeIndex >= 3 ? "1" : "0"} />
      <rect x="220" y="225" width="60" height="20" rx="2" ry="2" fill="url(#contentGradient)" opacity={activeIndex >= 3 ? "1" : "0"} />
    </g>

    {/* Step 5: Interactive Elements */}
    <g id="step5">
      {/* Hover state on button */}
      <rect x="90" y="180" width="80" height="20" rx="10" ry="10" fill="#2DD4BF" className="interactive" opacity={activeIndex >= 4 ? "1" : "0"} />
      {/* Interactive navigation */}
      <circle cx="200" cy="100" r="4" fill="#2DD4BF" className="interactive" opacity={activeIndex >= 4 ? "1" : "0"} />
      {/* Active form element */}
      <rect x="270" y="180" width="40" height="20" rx="2" ry="2" fill="#211D4A" stroke="#5EEAD4" strokeWidth="2" opacity={activeIndex >= 4 ? "1" : "0"} />
      {/* Cursor */}
      <rect x="275" y="185" width="2" height="10" fill="#5EEAD4" opacity={activeIndex >= 4 ? (activeIndex === 4 ? "1" : "0.7") : "0"}>
        {activeIndex === 4 && (
          <animate attributeName="opacity" values="0;1;0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
        )}
      </rect>
    </g>

    {/* Step 6: Final Polish */}
    <g id="step6">
      {/* Shadow effect for depth */}
      <rect x="50" y="40" width="300" height="220" rx="5" ry="5" fill="none" opacity={activeIndex >= 5 ? "1" : "0"} filter="url(#shadow)" />
      {/* Reflection effect on browser top */}
      <rect x="55" y="42" width="290" height="10" rx="3" ry="3" fill="white" opacity={activeIndex >= 5 ? "0.1" : "0"} />
      {/* Subtle animation dots */}
      <circle cx="150" cy="250" r="3" fill="#5EEAD4" opacity={activeIndex >= 5 ? "1" : "0"}>
        {activeIndex >= 5 && (
          <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin="0s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="170" cy="250" r="3" fill="#5EEAD4" opacity={activeIndex >= 5 ? "1" : "0"}>
        {activeIndex >= 5 && (
          <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin="0.3s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="190" cy="250" r="3" fill="#5EEAD4" opacity={activeIndex >= 5 ? "1" : "0"}>
        {activeIndex >= 5 && (
          <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin="0.6s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Status indicator */}
      <circle cx="350" cy="250" r="5" fill="#34D399" opacity={activeIndex >= 5 ? "1" : "0"}>
        {activeIndex >= 5 && (
          <animate attributeName="fill" values="#34D399;#10B981;#34D399" dur="3s" repeatCount="indefinite" />
        )}
      </circle>
    </g>

    {/* Definitions for gradients, filters, etc. */}
    <defs>
      <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#211D4A" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="contentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3D3A6B" />
        <stop offset="100%" stopColor="#211D4A" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#5EEAD4" floodOpacity="0.3" />
      </filter>
    </defs>
  </svg>
</motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Timeline;