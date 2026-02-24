import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { Link } from 'react-router-dom';
import { usePrefetchRoute } from '../hooks/usePrefetchRoute';
import { getProject } from '../lib/sanity.client';

import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Animation variants remain the same
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

const titleVariants = {
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

const Projects = () => {
  const { language } = useLanguage();
  const t = translations[language].projects;
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [preloadedImages, setPreloadedImages] = useState<{[key: string]: boolean}>({});
  const [shouldPreload, setShouldPreload] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<any>(null);
  const prefetchRoute = usePrefetchRoute();
  const [isSafari, setIsSafari] = useState(false);

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const projects = [
    {
      title: {
        en: t.artovnia.title,
        pl: t.artovnia.title
      },
      description: {
        en: t.artovnia.description,
        pl: t.artovnia.description
      },
      topImages: [
        "media\\artovniaImage.webp",
        "media\\artovniaImageLight2.webp"
      ],
      backgroundImage: "media/tlokarta1.webp",
      slug: 'multivendor-e-commerce-platform'
    },
    {
      title: {
        en: t.animeSearch.title,
        pl: t.animeSearch.title
      },
      description: {
        en: t.animeSearch.description,
        pl: t.animeSearch.description
      },
      topImages: ["media\\ansearch.webp"],
      backgroundImage: "media/tlokarta2.webp",
      slug: 'anime-platform'
    },
    {
      title: {
        en: t.mobileApp.title,
        pl: t.mobileApp.title
      },
      description: {
        en: t.mobileApp.description,
        pl: t.mobileApp.description
      },
      topImages: ["media\\packstock.webp"],
      backgroundImage: "media/tlokarta3.webp",
      slug: 'flixstock-app'
    },
    {
      title: {
        en: t.portfolio.title,
        pl: t.portfolio.title
      },
      description: {
        en: t.portfolio.description,
        pl: t.portfolio.description
      },
      topImages: ["media\\mojaStrona2.webp"],
      backgroundImage: "media/tlokarta1.webp",
      slug: 'personal-portfolio-website'
    },
    {
      title: {
        en: t.cleaningApp.title,
        pl: t.cleaningApp.title
      },
      description: {
        en: t.cleaningApp.description,
        pl: t.cleaningApp.description
      },
      topImages: ["media\\glide1.webp"],
      backgroundImage: "media/tlokarta2.webp",
      slug: 'cleaning-managament-app'
    }
  ];

  // Detect Safari browser
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsSafari(
      ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1 && ua.indexOf('android') === -1
    );
  }, []);

  // Safari-specific touch handling
  useEffect(() => {
    if (!isSafari) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.pageX;
      const startY = touch.pageY;
      
      let isScrolling: boolean | null = null;
      
      const handleTouchMove = (e: TouchEvent) => {
        if (!e.touches.length) return;
        
        const touch = e.touches[0];
        const currentX = touch.pageX;
        const currentY = touch.pageY;
        
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Determine direction if we haven't yet
        if (isScrolling === null) {
          isScrolling = diffY > diffX;
        }
        
        // If scrolling vertically, prevent swiper from capturing the event
        if (isScrolling && swiperRef.current) {
          e.stopPropagation();
          // Temporarily disable swiping
          if (swiperRef.current.swiper) {
            swiperRef.current.swiper.allowTouchMove = false;
          }
        }
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        // Re-enable swiping
        if (swiperRef.current && swiperRef.current.swiper) {
          setTimeout(() => {
            swiperRef.current.swiper.allowTouchMove = true;
          }, 300);
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    };
    
    const sectionElement = sectionRef.current;
    if (sectionElement) {
      sectionElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    }
    
    return () => {
      if (sectionElement) {
        sectionElement.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [isSafari]);

  // Preload function
  const preloadImage = (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => ({ ...prev, [src]: true }));
        resolve(true);
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Set up intersection observer for the section
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '500px', // Start preloading when 500px away from the section
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !shouldPreload) {
          setShouldPreload(true);
          observer.disconnect();
        }
      });
    }, options);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize current image indices for all projects
  useEffect(() => {
    const initialIndices: {[key: string]: number} = {};
    projects.forEach(project => {
      initialIndices[project.slug] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, []);

  // Image rotation logic - switch images every 5 seconds for projects with multiple images
  useEffect(() => {
    const intervals: {[key: string]: NodeJS.Timeout} = {};
    
    projects.forEach(project => {
      if (project.topImages.length > 1) {
        intervals[project.slug] = setInterval(() => {
          setCurrentImageIndex(prev => ({
            ...prev,
            [project.slug]: (prev[project.slug] + 1) % project.topImages.length
          }));
        }, 5000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [projects]);

  // Preload images when shouldPreload becomes true
  useEffect(() => {
    if (!shouldPreload) return;

    const preloadAllImages = async () => {
      try {
        // Preload first two projects
        const initialPreloadImages = projects.slice(0, 2).flatMap(project => [
          ...project.topImages,
          project.backgroundImage
        ]);

        await Promise.all(initialPreloadImages.map(src => preloadImage(src)));
        
        // Preload remaining images after a delay
        setTimeout(() => {
          const remainingImages = projects.slice(2).flatMap(project => [
            ...project.topImages,
            project.backgroundImage
          ]);
          Promise.all(remainingImages.map(src => preloadImage(src)));
        }, 3000);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadAllImages();
  }, [shouldPreload]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src && !preloadedImages[img.dataset.src]) {
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        }
      });
    }, options);

    const images = document.querySelectorAll('.lazy-image');
    images.forEach(img => observer.observe(img));

    return () => {
      images.forEach(img => observer.unobserve(img));
    };
  }, [preloadedImages, currentImageIndex]);

  const handleImageLoad = useCallback((slug: string, imageIndex?: number) => {
    const key = imageIndex !== undefined ? `${slug}-${imageIndex}` : slug;
    setImagesLoaded(prev => ({
      ...prev,
      [key]: true
    }));
  }, []);


  const isCurrentImageLoaded = useCallback((project: any) => {
    const currentIndex = currentImageIndex[project.slug] || 0;
    const key = `${project.slug}-${currentIndex}`;
    return imagesLoaded[key] || false;
  }, [currentImageIndex, imagesLoaded]);
  
  const prefetchProject = async (slug: string) => {
    try {
      const data = await getProject(slug);
      localStorage.setItem(`project-${slug}`, JSON.stringify(data));
    } catch (err) {
      console.error("Prefetch failed", err);
    }
  };
  
  const handleMouseEnter = (slug: string) => {
    prefetchProject(slug);
  };
  
  // Navigate to project detail page
  const navigateToProject = async (slug: string) => {

    // Prefetch first, then navigate
  
    await prefetchProject(slug);
  
    window.location.href = `/project/${slug}`;
  
  };

  return (
    <section 
      ref={sectionRef}
      id="projects"
      className="py-0 sm:py-20 bg-[#140F2D] overscroll-none"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:-mt-5">
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-2 lg:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <span className="text-4xl sm:text-6xl text-white font-normal font-jakarta">
            {t.title} 
          </span>
          <span className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta lg:text-right mt-2 lg:mt-0 lg:-mb-8">
            {t.categories.all}
          </span>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={isSafari ? "safari-swiper-container" : ""}
        >
          <Swiper
            ref={swiperRef}
            className="custom-swiper"
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              el: '.swiper-pagination',
              type: 'bullets',
              bulletActiveClass: 'swiper-pagination-bullet-active',
              renderBullet: (_index, className) => `<span class="${className} notranslate"></span>`
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
              disabledClass: 'swiper-button-disabled'
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            touchEventsTarget="wrapper"
            touchRatio={1}
            touchAngle={45}
            preventClicks={false}
            preventClicksPropagation={false}
            slideToClickedSlide={true}
            grabCursor={true}
            resistance={true}
            resistanceRatio={0.85}
            watchOverflow={true}
            touchMoveStopPropagation={false}
            cssMode={true}
            {...(isSafari ? {
              touchReleaseOnEdges: true,
              preventInteractionOnTransition: true,
              longSwipes: false,
              longSwipesRatio: 0.5,
              threshold: 10
            } : {})}
          >
            {projects.map((project) => (
              <SwiperSlide key={project.slug}>
  <motion.div
    variants={cardVariants}
    className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
    ring-1 ring-white/20 ring-opacity-80 flex flex-col relative mb-8 lg:mb-0 mx-auto"
  >
    <div 
      className="h-1/2 relative overflow-hidden cursor-pointer"
      onClick={() => navigateToProject(project.slug)}
      onMouseEnter={() => handleMouseEnter(project.slug)}
    >
      <div 
        className={`absolute inset-0 bg-gray-800 transition-opacity duration-500 ${
          isCurrentImageLoaded(project) ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {project.topImages.map((image: string, index: number) => {
        const isCurrentImage = (currentImageIndex[project.slug] || 0) === index;
        const imageKey = `${project.slug}-${index}`;
        return (
          <img
            key={`${project.slug}-${index}`}
            src={preloadedImages[image] ? image : undefined}
            data-src={image}
            alt={project.title[language]}
            className={`lazy-image absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isCurrentImage && imagesLoaded[imageKey] ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleImageLoad(project.slug, index)}
            style={{ zIndex: isCurrentImage ? 2 : 1 }}
          />
        );
      })}
    </div>

    <div className="h-1/2 p-4 flex flex-col relative">
      <img
        src={preloadedImages[project.backgroundImage] ? project.backgroundImage : undefined}
        data-src={project.backgroundImage}
        alt={project.title[language]}
        className="lazy-image absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-white text-2xl font-jakarta font-light mt-2">{project.title[language]}</h3>
        <p className="text-sm text-white font-jakarta font-light leading-relaxed tracking-[0.015em] mt-6">{project.description[language]}</p>
        
        <div className="mt-auto pt-4">
          <Link
            to={`/project/${project.slug}`}
            onMouseEnter={() => handleMouseEnter(project.slug)}
            className="inline-flex items-center text-white hover:text-teal-300"
          >
            {t.viewProject} <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
</SwiperSlide>
            ))}

            <div className="swiper-pagination"></div>
          </Swiper>
          
          <div className="swiper-navigation-buttons">
            <button className="swiper-button-prev" aria-label="Previous slide"></button>
            <button className="swiper-button-next" aria-label="Next slide"></button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;