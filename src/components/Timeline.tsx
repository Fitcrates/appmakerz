import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';



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

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrev(),
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

 

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
        <div className="flex flex-col-reverse xl:flex-row">
          {/* Timeline Content - Left Side */}
          <motion.div 
            className="relative w-full xl:w-1/2 h-[26rem] md:h-[32rem] xl:h-[35rem]"
            variants={timelineVariants}
            ref={timelineRef}
          >
            
            {/* Timeline Content - Centered with flex */}
            <div {...swipeHandlers} className="relative h-[21.5rem] md:h-full w-full flex items-center justify-center  md:ml-16 lg:ml-24 xl:ml-[12rem]">
  <AnimatePresence mode="wait">
    <motion.div
      key={activeIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-20 max-w-[95%] sm:max-w-[28rem] md:max-w-[28rem] h-[23rem] md:h-[23rem] min-h-[20rem] max-h-[21rem] md:min-h-[21.25rem] md:max-h-[23rem] flex flex-col items-center justify-center px-6  py-8 md:px-8 md:py-10"
    >
      {/* Card with Soft Glow */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center -z-10">
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-white/10 via-[#140F2D] to-[#140F2D] ring-1 ring-white/40 shadow-lg shadow-teal-300/40"></div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
        <span className="absolute -top-4 right-0 md:top-0 md:left-0 text-lg font-light font-jakarta text-teal-300 mb-2">{timelineItems[activeIndex].lp}</span>
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
                className="relative left-0 right-0 -bottom-4 flex flex-col items-center z-20 pb-10"
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
{/* Website Build SVG - Right Side */}
<motion.div 
  className="relative w-full xl:w-1/2 flex items-center justify-center xl:justify-end pr-0 md:pr-0 xl:pr-0"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, delay: 0.3 }}
>
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[400px] h-[300px]">
    {/* Main Background with subtle gradient */}
    <rect width="400" height="300" fill="url(#backgroundGradient)" rx="8" ry="8" />
    <rect width="400" height="300" fill="url(#noiseMask)" rx="8" ry="8" opacity="0.03" />
    <g className="grid-pattern" opacity="0.07">
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`h-${i}`} x1="0" y1={i * 15} x2="400" y2={i * 15} stroke="#5EEAD4" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 27 }).map((_, i) => (
        <line key={`v-${i}`} x1={i * 15} y1="0" x2={i * 15} y2="300" stroke="#5EEAD4" strokeWidth="0.5" />
      ))}
    </g>
    
    {/* Device mockup frame - stays constant */}
    <g id="deviceFrame" opacity="1">
      <rect x="30" y="15" width="340" height="250" rx="10" ry="10" fill="#192339" />
      <rect x="35" y="20" width="330" height="240" rx="7" ry="7" fill="#0F1729" stroke="#2D3B58" strokeWidth="1" />
      <rect x="35" y="20" width="330" height="25" rx="7" ry="7" fill="#162033" />
      <circle cx="50" cy="32.5" r="4" fill="#F87171" />
      <circle cx="65" cy="32.5" r="4" fill="#FBBF24" />
      <circle cx="80" cy="32.5" r="4" fill="#34D399" />
      <rect x="170" y="26" width="120" height="13" rx="6.5" ry="6.5" fill="#2D3B58" />
      <circle cx="350" cy="32.5" r="4" fill="#6366F1" />
    </g>

    {/* Code editor panel - step 1 */}
    <g id="codeEditor" opacity={activeIndex >= 0 ? "1" : "0"}>
      <rect x="40" y="50" width="320" height="205" rx="3" ry="3" fill="#151E2C" />
      <rect x="40" y="50" width="45" height="205" fill="#0F1729" />
      
      {/* Line numbers */}
      {Array.from({ length: 18 }).map((_, i) => (
        <text key={`line-${i}`} x="55" y={65 + i * 11} fontFamily="monospace" fontSize="8" fill="#3B4D71" textAnchor="middle">{i+1}</text>
      ))}
      
      {/* Animated typing cursor for Stage 1 */}
      <rect 
        x={95 + (activeIndex === 0 ? Math.sin(Date.now()/200) * 25 : 0)}
        y="65" 
        width="2" 
        height="11" 
        fill="#5EEAD4" 
        opacity={activeIndex === 0 ? "1" : "0"}
      >
        {activeIndex === 0 && (
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        )}
      </rect>
      
      {/* Code lines with syntax highlighting */}
      <g opacity={activeIndex >= 0 ? "1" : "0"}>
        <text x="90" y="65" fontFamily="monospace" fontSize="9" fill="#c678dd">{'<!DOCTYPE'}</text>
        <text x="145" y="65" fontFamily="monospace" fontSize="9" fill="#e5c07b">{'html'}</text>
        <text x="170" y="65" fontFamily="monospace" fontSize="9" fill="#c678dd">{'>'}</text>
        
        <text x="90" y="76" fontFamily="monospace" fontSize="9" fill="#c678dd">{'<'}</text>
        <text x="98" y="76" fontFamily="monospace" fontSize="9" fill="#e06c75">{'html'}</text>
        <text x="123" y="76" fontFamily="monospace" fontSize="9" fill="#d19a66">{'lang'}</text>
        <text x="145" y="76" fontFamily="monospace" fontSize="9" fill="#c678dd">{'='}</text>
        <text x="152" y="76" fontFamily="monospace" fontSize="9" fill="#98c379">{'"en"'}</text>
        <text x="173" y="76" fontFamily="monospace" fontSize="9" fill="#c678dd">{'>'}</text>
        
        <text x="90" y="87" fontFamily="monospace" fontSize="9" fill="#c678dd">{'<'}</text>
        <text x="98" y="87" fontFamily="monospace" fontSize="9" fill="#e06c75">{'head'}</text>
        <text x="123" y="87" fontFamily="monospace" fontSize="9" fill="#c678dd">{'>'}</text>
      </g>
    </g>

    {/* Wireframe Overlay - Stage 1 */}
    <g id="wireframeStage" opacity={activeIndex === 0 ? "1" : activeIndex < 2 ? "0.7" : "0"}>
      <rect x="85" y="55" width="270" height="195" fill="url(#wireframeBackground)" stroke="#5EEAD4" strokeWidth="1" strokeDasharray={activeIndex === 0 ? "3,3" : "0"} rx="2" ry="2" />
      
      {/* Grid Layout */}
      <g opacity={activeIndex === 0 ? "1" : "0.3"} strokeDasharray={activeIndex === 0 ? "2,2" : "0"}>
        <line x1="85" y1="85" x2="355" y2="85" stroke="#5EEAD4" strokeWidth="1" />
        <line x1="85" y1="140" x2="355" y2="140" stroke="#5EEAD4" strokeWidth="1" />
        <line x1="85" y1="200" x2="355" y2="200" stroke="#5EEAD4" strokeWidth="1" />
        <line x1="175" y1="55" x2="175" y2="250" stroke="#5EEAD4" strokeWidth="1" />
        <line x1="265" y1="55" x2="265" y2="250" stroke="#5EEAD4" strokeWidth="1" />
      </g>
      
      {/* Wireframe elements */}
      <g>
        {/* Logo placeholder */}
        <rect x="100" y="65" width="50" height="15" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" />
        
        {/* Menu items */}
        <circle cx="200" cy="70" r="2" fill="#5EEAD4" />
        <circle cx="225" cy="70" r="2" fill="#5EEAD4" />
        <circle cx="250" cy="70" r="2" fill="#5EEAD4" />
        <circle cx="275" cy="70" r="2" fill="#5EEAD4" />
        <circle cx="300" cy="70" r="2" fill="#5EEAD4" />
        <circle cx="325" cy="70" r="2" fill="#5EEAD4" />
        
        {/* Hero section */}
        <rect x="100" y="95" width="240" height="40" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" />
        
        {/* Content elements */}
        <rect x="100" y="145" width="60" height="50" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" />
        <rect x="170" y="145" width="60" height="50" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" />
        <rect x="240" y="145" width="100" height="50" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" />
        
        {/* Footer elements */}
        <rect x="100" y="205" width="240" height="30" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" />
      </g>
      
      {/* Measuring guidelines and annotations that appear during wireframe stage */}
      <g opacity={activeIndex === 0 ? "1" : "0"}>
        <line x1="75" y1="95" x2="75" y2="135" stroke="#6366F1" strokeWidth="1" />
        <line x1="73" y1="95" x2="77" y2="95" stroke="#6366F1" strokeWidth="1" />
        <line x1="73" y1="135" x2="77" y2="135" stroke="#6366F1" strokeWidth="1" />
        <text x="65" y="115" fontFamily="Arial" fontSize="6" fill="#6366F1" textAnchor="end">40px</text>
        
        <line x1="100" y1="238" x2="340" y2="238" stroke="#6366F1" strokeWidth="1" />
        <line x1="100" y1="236" x2="100" y2="240" stroke="#6366F1" strokeWidth="1" />
        <line x1="340" y1="236" x2="340" y2="240" stroke="#6366F1" strokeWidth="1" />
        <text x="220" y="245" fontFamily="Arial" fontSize="6" fill="#6366F1" textAnchor="middle">240px</text>
      </g>
    </g>

    {/* Layout Structure - Stage 2 */}
    <g id="layoutStage" opacity={activeIndex === 1 ? "1" : "0"}>
      <rect x="85" y="55" width="270" height="195" fill="#151E2C" rx="2" ry="2" />
      
      {/* Header */}
      <rect x="85" y="55" width="270" height="30" fill="#1D2B44" rx="2" ry="2" />
      
      {/* Logo */}
      <rect x="100" y="65" width="50" height="15" rx="2" ry="2" fill="#2D3B58" />
      
      {/* Nav Links */}
      <rect x="185" y="65" width="155" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
      
      {/* Hero Section */}
      <rect x="85" y="85" width="270" height="60" fill="#1A2337" rx="0" ry="0" />
      
      {/* Hero Content Blocks */}
      <rect x="100" y="95" width="140" height="40" rx="2" ry="2" fill="#2D3B58" />
      <rect x="250" y="95" width="90" height="40" rx="2" ry="2" fill="#2D3B58" />
      
      {/* Content Sections */}
      <rect x="85" y="145" width="270" height="55" fill="#1D2B44" rx="0" ry="0" />
      <rect x="100" y="155" width="240" height="35" rx="2" ry="2" fill="#2D3B58" />
      
      {/* Footer */}
      <rect x="85" y="200" width="270" height="50" fill="#1A2337" rx="0" ry="0" />
      <rect x="100" y="210" width="150" height="10" rx="5" ry="5" fill="#2D3B58" />
      <rect x="100" y="225" width="90" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
      <rect x="250" y="225" width="90" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
      
      {/* Structure Highlights */}
      <rect x="85" y="85" width="270" height="1" fill="#5EEAD4" />
      <rect x="85" y="145" width="270" height="1" fill="#5EEAD4" />
      <rect x="85" y="200" width="270" height="1" fill="#5EEAD4" />
      
      {/* Grid system notation */}
      <g opacity="0.7">
        <line x1="175" y1="155" x2="175" y2="190" stroke="#5EEAD4" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="265" y1="155" x2="265" y2="190" stroke="#5EEAD4" strokeWidth="0.5" strokeDasharray="2,2" />
        <text x="175" y="153" fontFamily="monospace" fontSize="5" fill="#5EEAD4" textAnchor="middle">col-4</text>
        <text x="220" y="153" fontFamily="monospace" fontSize="5" fill="#5EEAD4" textAnchor="middle">col-4</text>
        <text x="265" y="153" fontFamily="monospace" fontSize="5" fill="#5EEAD4" textAnchor="middle">col-4</text>
      </g>
    </g>

    {/* Content Development - Stage 3 */}
    <g id="contentStage" opacity={activeIndex === 2 ? "1" : "0"}>
      <rect x="85" y="55" width="270" height="195" fill="#151E2C" rx="2" ry="2" />
      
      {/* Header */}
      <rect x="85" y="55" width="270" height="30" fill="#1D2B44" rx="2" ry="2" />
      
      {/* Logo */}
      <rect x="100" y="67.5" width="50" height="10" rx="2" ry="2" fill="#5EEAD4" />
      
      {/* Nav Links */}
      <rect x="200" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
      <rect x="225" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
      <rect x="250" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
      <rect x="275" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
      <rect x="300" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
      
      {/* Hero Section */}
      <rect x="85" y="85" width="270" height="60" fill="#1A2337" rx="0" ry="0" />
      
      {/* Hero Content */}
      <rect x="100" y="95" width="140" height="8" rx="1" ry="1" fill="#5EEAD4" />
      <rect x="100" y="108" width="120" height="8" rx="1" ry="1" fill="#5EEAD4" opacity="0.7" />
      <rect x="100" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="#6366F1" />
      <circle cx="295" cy="115" r="20" fill="#5EEAD4" opacity="0.6" />
      
      {/* Content Section */}
      <rect x="85" y="145" width="270" height="55" fill="#1D2B44" rx="0" ry="0" />
      
      {/* Content Blocks */}
      <g transform="translate(100, 155)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="#6366F1" opacity="0.8" />
      </g>
      
      <g transform="translate(180, 155)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="#6366F1" opacity="0.8" />
      </g>
      
      <g transform="translate(260, 155)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="#6366F1" opacity="0.8" />
      </g>
      
      {/* Footer */}
      <rect x="85" y="200" width="270" height="50" fill="#1A2337" rx="0" ry="0" />
      <rect x="100" y="210" width="150" height="5" rx="2.5" ry="2.5" fill="#5EEAD4" opacity="0.5" />
      <rect x="100" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="155" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="210" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="265" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
    </g>

    {/* Visual Design - Stage 4 */}
    <g id="visualDesignStage" opacity={activeIndex === 3 ? "1" : "0"}>
      <rect x="85" y="55" width="270" height="195" fill="#151E2C" rx="2" ry="2" />
      <rect x="85" y="55" width="270" height="195" fill="url(#pageGradient)" opacity="0.2" rx="2" ry="2" />
      
      {/* Header with Glass Effect */}
      <g opacity="0.95">
        <rect x="85" y="55" width="270" height="30" fill="#1D2B44" rx="2" ry="2" />
        <rect x="85" y="55" width="270" height="30" fill="url(#glassEffect)" rx="2" ry="2" />
      </g>
      
      {/* Logo */}
      <rect x="100" y="67.5" width="50" height="10" rx="2" ry="2" fill="url(#logoGradient)" />
      
      {/* Nav Links with Hover Effect */}
      <rect x="200" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.8" />
      <rect x="225" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      <rect x="250" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      <rect x="275" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      <rect x="300" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      
      {/* Hero Section with Background */}
      <rect x="85" y="85" width="270" height="60" fill="#1A2337" rx="0" ry="0" />
      <rect x="85" y="85" width="270" height="60" fill="url(#heroBackgroundPattern)" opacity="0.4" rx="0" ry="0" />
      
      {/* Hero Content */}
      <rect x="100" y="95" width="140" height="8" rx="1" ry="1" fill="url(#textGradient)" />
      <rect x="100" y="108" width="120" height="8" rx="1" ry="1" fill="url(#textGradient)" opacity="0.7" />
      
      {/* Glowing Button */}
      <rect x="100" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="url(#buttonGradient)" />
      <rect x="100" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
      </rect>
      
      {/* Hero Image */}
      <circle cx="295" cy="115" r="20" fill="url(#imageGradient)" />
      <circle cx="295" cy="115" r="22" fill="none" stroke="#5EEAD4" strokeWidth="0.5" opacity="0.5" />
      
      {/* Content Section with Depth */}
      <rect x="85" y="145" width="270" height="55" fill="#1D2B44" rx="0" ry="0" />
      <rect x="85" y="145" width="270" height="55" fill="url(#contentSectionGradient)" opacity="0.3" rx="0" ry="0" />
      
      {/* Content Cards with Shadow */}
      <g transform="translate(100, 155)" filter="url(#cardShadow)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect width="70" height="35" rx="2" ry="2" fill="url(#cardGradient)" opacity="0.3" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.8" />
      </g>
      
      <g transform="translate(180, 155)" filter="url(#cardShadow)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect width="70" height="35" rx="2" ry="2" fill="url(#cardGradient)" opacity="0.3" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.8" />
      </g>
      
      <g transform="translate(260, 155)" filter="url(#cardShadow)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect width="70" height="35" rx="2" ry="2" fill="url(#cardGradient)" opacity="0.3" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.8" />
      </g>
      
      {/* Footer with Texture */}
      <rect x="85" y="200" width="270" height="50" fill="#1A2337" rx="0" ry="0" />
      <rect x="85" y="200" width="270" height="50" fill="url(#footerTexture)" opacity="0.1" rx="0" ry="0" />
      <rect x="100" y="210" width="150" height="5" rx="2.5" ry="2.5" fill="url(#textGradient)" opacity="0.5" />
      
      {/* Footer Links */}
      <rect x="100" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="155" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="210" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="265" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
    </g>

    {/* Interactive Elements - Stage 5 */}
    <g id="interactiveStage" opacity={activeIndex === 4 ? "1" : "0"}>
      {/* Base Site from Visual Design Stage */}
      <rect x="85" y="55" width="270" height="195" fill="#151E2C" rx="2" ry="2" />
      <rect x="85" y="55" width="270" height="195" fill="url(#pageGradient)" opacity="0.2" rx="2" ry="2" />
      
      {/* Header with Glass Effect */}
      <g opacity="0.95">
        <rect x="85" y="55" width="270" height="30" fill="#1D2B44" rx="2" ry="2" />
        <rect x="85" y="55" width="270" height="30" fill="url(#glassEffect)" rx="2" ry="2" />
      </g>
      
      {/* Logo */}
      <rect x="100" y="67.5" width="50" height="10" rx="2" ry="2" fill="url(#logoGradient)" />
      
      {/* Nav Links with Hover Effect */}
      <rect x="200" y="67.5" width="15" height="10" rx="1" ry="1" fill="#44cfbd" opacity="1">
        <animate attributeName="y" values="67.5;66.5;67.5" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="225" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      <rect x="250" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      <rect x="275" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      <rect x="300" y="67.5" width="15" height="10" rx="1" ry="1" fill="#5EEAD4" opacity="0.6" />
      
      {/* Hero Section */}
      <rect x="85" y="85" width="270" height="60" fill="#1A2337" rx="0" ry="0" />
      <rect x="85" y="85" width="270" height="60" fill="url(#heroBackgroundPattern)" opacity="0.4" rx="0" ry="0" />
      
      {/* Hero Content */}
      <rect x="100" y="95" width="140" height="8" rx="1" ry="1" fill="url(#textGradient)" />
      <rect x="100" y="108" width="120" height="8" rx="1" ry="1" fill="url(#textGradient)" opacity="0.7" />
      
      {/* Glowing Button WITH HOVER STATE */}
      <g>
        <rect x="100" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="#5EEAD4" />
        <rect x="102" y="123" width="76" height="11" rx="5.5" ry="5.5" fill="#151E2C" />
        <rect x="105" y="126" width="70" height="5" rx="2.5" ry="2.5" fill="#5EEAD4" opacity="0.8" />
        <rect x="100" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="strokeWidth" values="1;1.5;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>
      
      {/* Hero Image with Animation */}
      <circle cx="295" cy="115" r="20" fill="url(#imageGradient)" />
      <circle cx="295" cy="115" r="22" fill="none" stroke="#5EEAD4" strokeWidth="0.5" opacity="0.5">
        <animate attributeName="r" values="22;23;22" dur="3s" repeatCount="indefinite" />
      </circle>
      
      {/* Form Input with Cursor */}
      <rect x="210" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
      <rect x="215" y="126" width="45" height="5" rx="2.5" ry="2.5" fill="#5EEAD4" opacity="0.3" />
      <rect x="265" y="126" width="2" height="5" fill="#5EEAD4">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
      
      {/* Content Section */}
      <rect x="85" y="145" width="270" height="55" fill="#1D2B44" rx="0" ry="0" />
      <rect x="85" y="145" width="270" height="55" fill="url(#contentSectionGradient)" opacity="0.3" rx="0" ry="0" />
      
      {/* Interactive Cards */}
      <g transform="translate(100, 155)" filter="url(#cardShadow)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect width="70" height="35" rx="2" ry="2" fill="url(#cardGradient)" opacity="0.4" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.8" />
        <rect width="70" height="35" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="4s" begin="1s" repeatCount="indefinite" />
        </rect>
      </g>
      
      <g transform="translate(180, 152)" filter="url(#cardShadow)">
        <rect width="70" height="38" rx="2" ry="2" fill="#3D4B68" />
        <rect width="70" height="38" rx="2" ry="2" fill="url(#cardGradient)" opacity="0.5" />
        <rect x="5" y="7" width="60" height="5" rx="1" ry="1" fill="url(#textGradient)" />
        <rect x="5" y="17" width="55" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="22" width="50" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="27" width="40" height="5" rx="2.5" ry="2.5" fill="#44cfbd" />
        <rect width="70" height="38" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1.5" opacity="0.7" />
      </g>
      
      <g transform="translate(260, 155)" filter="url(#cardShadow)">
        <rect width="70" height="35" rx="2" ry="2" fill="#2D3B58" />
        <rect width="70" height="35" rx="2" ry="2" fill="url(#cardGradient)" opacity="0.4" />
        <rect x="5" y="5" width="60" height="5" rx="1" ry="1" fill="url(#textGradient)" opacity="0.8" />
        <rect x="5" y="15" width="55" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="20" width="50" height="3" rx="1" ry="1" fill="url(#textGradient)" opacity="0.6" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.8" />
        <rect width="70" height="35" rx="2" ry="2" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="4s" begin="2s" repeatCount="indefinite" />
        </rect>
      </g>
      
      {/* Footer with Clickable Elements */}
      <rect x="85" y="200" width="270" height="50" fill="#1A2337" rx="0" ry="0" />
      <rect x="85" y="200" width="270" height="50" fill="url(#footerTexture)" opacity="0.1" rx="0" ry="0" />
      <rect x="100" y="210" width="150" height="5" rx="2.5" ry="2.5" fill="url(#textGradient)" opacity="0.5" />
      
      {/* Footer Links with Hover */}
      <rect x="100" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="155" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="210" y="225" width="45" height="15" rx="2" ry="2" fill="#2D3B58" />
      <rect x="265" y="224" width="45" height="17" rx="2" ry="2" fill="#3D4B68">
        <animate attributeName="fill" values="#3D4B68;#44cfbd;#3D4B68" dur="3s" repeatCount="indefinite" />
      </rect>
    </g>

    {/* Final Polish - Stage 6 */}
    <g id="finalPolishStage" opacity={activeIndex === 5 ? "1" : "0"}>
      {/* Base Site */}
      <rect x="85" y="55" width="270" height="195" fill="#151E2C" rx="4" ry="4" />
      <rect x="85" y="55" width="270" height="195" fill="url(#pageGradient)" opacity="0.2" rx="4" ry="4" />
      
      {/* Header with Glass Effect */}
      <g opacity="0.95">
        <rect x="85" y="55" width="270" height="30" fill="#1D2B44" rx="4" ry="4" />
        <rect x="85" y="55" width="270" height="30" fill="url(#glassEffect)" rx="4" ry="4" />
        <rect x="85" y="55" width="270" height="15" fill="white" opacity="0.05" rx="4" ry="4" />
      </g>
      
      {/* Professional Logo */}
      <rect x="100" y="67.5" width="50" height="10" rx="5" ry="5" fill="url(#logoGradient)" filter="url(#logoGlow)" />
      
      {/* Nav Links */}
      <rect x="200" y="67.5" width="15" height="10" rx="5" ry="5" fill="#5EEAD4" opacity="0.8" />
      <rect x="225" y="67.5" width="15" height="10" rx="5" ry="5" fill="#5EEAD4" opacity="0.8" />
      <rect x="250" y="67.5" width="15" height="10" rx="5" ry="5" fill="#5EEAD4" opacity="0.8" />
      <rect x="275" y="67.5" width="15" height="10" rx="5" ry="5" fill="#5EEAD4" opacity="0.8" />
      <rect x="300" y="67.5" width="15" height="10" rx="5" ry="5" fill="#5EEAD4" opacity="0.8" />
      
      {/* Hero Section with Dynamic Background */}
      <rect x="85" y="85" width="270" height="60" fill="#1A2337" rx="0" ry="0" />
      <rect x="85" y="85" width="270" height="60" fill="url(#heroBackgroundPattern)" opacity="0.4" rx="0" ry="0" />
      <rect x="85" y="85" width="270" height="60" fill="url(#heroGlow)" opacity="0.3" rx="0" ry="0">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
      </rect>
      
      {/* Refined Typography */}
      <rect x="100" y="95" width="140" height="8" rx="4" ry="4" fill="url(#textGradient)" filter="url(#textShadow)" />
      <rect x="100" y="108" width="120" height="8" rx="4" ry="4" fill="url(#textGradient)" opacity="0.7" filter="url(#textShadow)" />
      
      {/* Polished Button */}
      <g filter="url(#buttonFilter)">
        <rect x="100" y="121" width="80" height="15" rx="7.5" ry="7.5" fill="url(#buttonGradient)" />
        <rect x="102" y="123" width="76" height="11" rx="5.5" ry="5.5" fill="#151E2C" opacity="0.5" />
        <rect x="105" y="126" width="70" height="5" rx="2.5" ry="2.5" fill="#FFFFFF" opacity="0.9" />
      </g>
      
      {/* Stylized Image */}
      <circle cx="295" cy="115" r="20" fill="url(#imageGradient)" filter="url(#imageFilter)" />
      <circle cx="295" cy="115" r="22" fill="none" stroke="url(#imageOutlineGradient)" strokeWidth="1" opacity="0.7" />
      <circle cx="295" cy="115" r="16" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
      
      {/* Subtle Animation Effect */}
      <circle cx="290" cy="110" r="3" fill="#FFFFFF" opacity="0.5" filter="url(#glow)" />
      
      {/* Content Section with Layered Background */}
      <rect x="85" y="145" width="270" height="55" fill="#1D2B44" rx="0" ry="0" />
      <rect x="85" y="145" width="270" height="55" fill="url(#contentSectionGradient)" opacity="0.3" rx="0" ry="0" />
      <path d="M85,145 C115,155 175,150 220,160 S290,165 355,155 L355,200 L85,200 Z" fill="#2D3B58" opacity="0.2" />
      
      {/* Styled Cards with Depth */}
      <g transform="translate(100, 155)" filter="url(#enhancedCardShadow)">
        <rect width="70" height="35" rx="4" ry="4" fill="#2D3B58" />
        <rect width="70" height="35" rx="4" ry="4" fill="url(#cardGradient)" opacity="0.4" />
        <rect x="5" y="5" width="60" height="5" rx="2.5" ry="2.5" fill="url(#textGradient)" opacity="0.9" />
        <rect x="5" y="15" width="55" height="3" rx="1.5" ry="1.5" fill="url(#textGradient)" opacity="0.7" />
        <rect x="5" y="20" width="50" height="3" rx="1.5" ry="1.5" fill="url(#textGradient)" opacity="0.7" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.9" />
        <rect width="70" height="35" rx="4" ry="4" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0.5" />
        <rect width="70" height="10" rx="4" ry="4" fill="url(#cardHighlight)" opacity="0.1" />
      </g>
      
      <g transform="translate(180, 155)" filter="url(#enhancedCardShadow)">
        <rect width="70" height="35" rx="4" ry="4" fill="#2D3B58" />
        <rect width="70" height="35" rx="4" ry="4" fill="url(#cardGradient)" opacity="0.4" />
        <rect x="5" y="5" width="60" height="5" rx="2.5" ry="2.5" fill="url(#textGradient)" opacity="0.9" />
        <rect x="5" y="15" width="55" height="3" rx="1.5" ry="1.5" fill="url(#textGradient)" opacity="0.7" />
        <rect x="5" y="20" width="50" height="3" rx="1.5" ry="1.5" fill="url(#textGradient)" opacity="0.7" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.9" />
        <rect width="70" height="35" rx="4" ry="4" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0.5" />
        <rect width="70" height="10" rx="4" ry="4" fill="url(#cardHighlight)" opacity="0.1" />
      </g>
      
      <g transform="translate(260, 155)" filter="url(#enhancedCardShadow)">
        <rect width="70" height="35" rx="4" ry="4" fill="#2D3B58" />
        <rect width="70" height="35" rx="4" ry="4" fill="url(#cardGradient)" opacity="0.4" />
        <rect x="5" y="5" width="60" height="5" rx="2.5" ry="2.5" fill="url(#textGradient)" opacity="0.9" />
        <rect x="5" y="15" width="55" height="3" rx="1.5" ry="1.5" fill="url(#textGradient)" opacity="0.7" />
        <rect x="5" y="20" width="50" height="3" rx="1.5" ry="1.5" fill="url(#textGradient)" opacity="0.7" />
        <rect x="5" y="25" width="40" height="5" rx="2.5" ry="2.5" fill="url(#buttonGradient)" opacity="0.9" />
        <rect width="70" height="35" rx="4" ry="4" fill="none" stroke="#5EEAD4" strokeWidth="1" opacity="0.5" />
        <rect width="70" height="10" rx="4" ry="4" fill="url(#cardHighlight)" opacity="0.1" />
      </g>
      
      {/* Footer with Refined Design */}
      <rect x="85" y="200" width="270" height="50" fill="#1A2337" rx="0" ry="0" />
      <rect x="85" y="200" width="270" height="50" fill="url(#footerTexture)" opacity="0.15" rx="0" ry="0" />
      <rect x="85" y="200" width="270" height="1" fill="#5EEAD4" opacity="0.3" />
      <rect x="100" y="210" width="150" height="5" rx="2.5" ry="2.5" fill="url(#textGradient)" opacity="0.6" filter="url(#textShadow)" />
      
      {/* Footer Links */}
      <g transform="translate(100, 225)">
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="url(#footerLinkGradient)" opacity="0.3" />
        <rect x="5" y="5" width="35" height="5" rx="2.5" ry="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
      
      <g transform="translate(155, 225)">
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="url(#footerLinkGradient)" opacity="0.3" />
        <rect x="5" y="5" width="35" height="5" rx="2.5" ry="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
      
      <g transform="translate(210, 225)">
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="url(#footerLinkGradient)" opacity="0.3" />
        <rect x="5" y="5" width="35" height="5" rx="2.5" ry="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
      
      <g transform="translate(265, 225)">
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="#2D3B58" />
        <rect width="45" height="15" rx="7.5" ry="7.5" fill="url(#footerLinkGradient)" opacity="0.3" />
        <rect x="5" y="5" width="35" height="5" rx="2.5" ry="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>
      
      {/* Final Polish Details */}
      <rect x="85" y="55" width="270" height="195" rx="4" ry="4" fill="none" stroke="url(#borderGradient)" strokeWidth="1" opacity="0.5" />
      <rect x="84" y="54" width="272" height="197" rx="5" ry="5" fill="none" stroke="#5EEAD4" strokeWidth="0.5" opacity="0.2" filter="url(#glow)" />
      
      {/* Loading state animation */}
      <g transform="translate(220, 265)">
        <circle cx="0" cy="0" r="3" fill="#5EEAD4" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" begin="0s" repeatCount="indefinite" />
        </circle>
        <circle cx="10" cy="0" r="3" fill="#5EEAD4" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="0" r="3" fill="#5EEAD4" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Status indicator */}
      <g transform="translate(350, 235)">
        <circle cx="0" cy="0" r="5" fill="#34D399" filter="url(#glow)">
          <animate attributeName="r" values="5;5.5;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="7" fill="none" stroke="#34D399" strokeWidth="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
    </g>

    {/* Progress Indicators */}
    <g id="stageIndicators">
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <g key={`step-${step}`} className="stage-indicator" opacity="1">
          <circle 
            cx={70 + step * 50} 
            cy="280" 
            r="5" 
            fill={activeIndex === step ? "#5EEAD4" : "#2D3B58"} 
            stroke="#5EEAD4" 
            strokeWidth="1"
            opacity={activeIndex === step ? "1" : "0.5"}
          />
          <circle 
            cx={70 + step * 50} 
            cy="280" 
            r="9" 
            fill="none" 
            stroke="#5EEAD4" 
            strokeWidth="0.5" 
            opacity={activeIndex === step ? "0.5" : "0"}
          >
            {activeIndex === step && (
              <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
            )}
          </circle>
          <text 
            x={70 + step * 50} 
            y="286" 
            fontFamily="sans-serif" 
            fontSize="7" 
            fill="#FFFFFF" 
            textAnchor="middle" 
            opacity={activeIndex === step ? "1" : "0"}
          >
            {step + 1}
          </text>
        </g>
      ))}
    </g>

    {/* Process Labels - Small at Bottom */}
    <g id="processLabels" opacity="0.7">
      <text x="70" y="295" fontFamily="sans-serif" fontSize="6" fill="#FFFFFF" textAnchor="middle" opacity={activeIndex === 0 ? "1" : "0.6"}>Wireframe</text>
      <text x="120" y="295" fontFamily="sans-serif" fontSize="6" fill="#FFFFFF" textAnchor="middle" opacity={activeIndex === 1 ? "1" : "0.6"}>Structure</text>
      <text x="170" y="295" fontFamily="sans-serif" fontSize="6" fill="#FFFFFF" textAnchor="middle" opacity={activeIndex === 2 ? "1" : "0.6"}>Content</text>
      <text x="220" y="295" fontFamily="sans-serif" fontSize="6" fill="#FFFFFF" textAnchor="middle" opacity={activeIndex === 3 ? "1" : "0.6"}>Visual Design</text>
      <text x="270" y="295" fontFamily="sans-serif" fontSize="6" fill="#FFFFFF" textAnchor="middle" opacity={activeIndex === 4 ? "1" : "0.6"}>Interaction</text>
      <text x="320" y="295" fontFamily="sans-serif" fontSize="6" fill="#FFFFFF" textAnchor="middle" opacity={activeIndex === 5 ? "1" : "0.6"}>Polish</text>
    </g>

    {/* Definitions for gradients, filters, etc. */}
    <defs>
      {/* Main Background */}
      <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      
      <pattern id="noiseMask" width="100" height="100" patternUnits="userSpaceOnUse">
        {Array.from({ length: 600 }).map((_, i) => (
          <circle 
            key={`noise-${i}`} 
            cx={Math.random() * 100} 
            cy={Math.random() * 100} 
            r={Math.random() * 0.5} 
            fill="#FFFFFF"
          />
        ))}
      </pattern>
      
      {/* Logo Gradient */}
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="100%" stopColor="#2DD4BF" />
      </linearGradient>
      
      {/* Text Gradient */}
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      
      {/* Button Gradient */}
      <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
      
      {/* Image Gradient */}
      <radialGradient id="imageGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </radialGradient>
      
      <linearGradient id="imageOutlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      
      {/* Card Gradient */}
      <linearGradient id="cardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
      </linearGradient>
      
      <linearGradient id="cardHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      
      {/* Page Gradient */}
      <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
      </linearGradient>
      
      {/* Content Section Gradient */}
      <linearGradient id="contentSectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
      </linearGradient>
      
      {/* Footer Link Gradient */}
      <linearGradient id="footerLinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0.1" />
      </linearGradient>
      
      {/* Border Gradient */}
      <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#5EEAD4" />
      </linearGradient>
      
      {/* Hero Section Background Pattern */}
      <pattern id="heroBackgroundPattern" patternUnits="userSpaceOnUse" width="60" height="60">
        <path d="M0,30 L30,0 L60,30 L30,60 L0,30" stroke="#5EEAD4" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M30,0 L60,30 L30,60 L0,30 L30,0" stroke="#6366F1" strokeWidth="0.5" fill="none" opacity="0.3" />
      </pattern>
      
      {/* Footer Texture */}
      <pattern id="footerTexture" patternUnits="userSpaceOnUse" width="100" height="100">
        {Array.from({ length: 100 }).map((_, i) => (
          <circle 
            key={`texture-${i}`} 
            cx={Math.random() * 100} 
            cy={Math.random() * 100} 
            r={Math.random() * 1 + 0.5} 
            fill="#5EEAD4" 
            opacity={Math.random() * 0.5}
          />
        ))}
      </pattern>
      
      {/* Glass Effect */}
      <linearGradient id="glassEffect" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      
      {/* Hero Glow */}
      <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
      </radialGradient>
      
      {/* Wireframe Background */}
      <linearGradient id="wireframeBackground" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0.7" />
      </linearGradient>
      
      {/* Filters */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      <filter id="textShadow" x="-5%" y="-5%" width="110%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.5" />
      </filter>
      
      <filter id="buttonFilter" x="-10%" y="-10%" width="120%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      <filter id="imageFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
      </filter>
      
      <filter id="enhancedCardShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#5EEAD4" floodOpacity="0.1" />
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