import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

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

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const projects = [
    {
      title: {
        en: t.animeSearch.title,
        pl: t.animeSearch.title
      },
      description: {
        en: t.animeSearch.description,
        pl: t.animeSearch.description
      },
      topImage: "media\\ansearch.webp",
      backgroundImage: "media/tlokarta1.webp",
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
      topImage: "media\\flixapp.webp",
      backgroundImage: "media/tlokarta2.webp",
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
      topImage: "media\\moja strona2.webp",
      backgroundImage: "media/tlokarta3.webp",
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
      topImage: "media\\glide1.webp",
      backgroundImage: "media/tlokarta1.webp",
      slug: 'cleaning-managament-app'
    }
  ];

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
          if (img.dataset.src) {
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
  }, []);

  const handleImageLoad = (slug: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [slug]: true
    }));
  };

  return (
    <section 
      id="projects"
      className="py-22 sm:py-20 bg-[#140F2D] overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  lg:-mt-5">
        {/* Heading */}
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
          <span className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta text-left lg:text-right mt-2 lg:mt-0 lg:-mb-10">
            {t.categories.all}
          </span>
        </motion.div>

        {/* Swiper Slider */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Swiper
            className="custom-swiper"
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
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
          >
            {projects.map((project) => (
              <SwiperSlide key={project.slug}>
                <motion.div
                  variants={cardVariants}
                  className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
                  ring-2 ring-white ring-opacity-80 flex flex-col relative mb-8 lg:mb-0"
                >
                  {/* Top Image Section */}
                  <div className="h-1/2 relative overflow-hidden transform hover:scale-110 transition duration-300">
                    <div 
                      className={`absolute inset-0 bg-gray-800 transition-opacity duration-500 ${
                        imagesLoaded[project.slug] ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <img
                      data-src={project.topImage}
                      alt={project.title[language]}
                      className={`lazy-image w-full h-full object-cover transition-opacity duration-500 ${
                        imagesLoaded[project.slug] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(project.slug)}
                      loading="lazy"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="h-1/2 p-4 flex flex-col relative">
                    <img
                      data-src={project.backgroundImage}
                      alt={project.title[language]}
                      className="lazy-image absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="relative z-10">
                      <h3 className="text-white text-2xl font-jakarta font-light mt-2">{project.title[language]}</h3>
                      <p className="text-sm text-white font-jakarta font-light leading-relaxed tracking-[0.015em] mt-6">{project.description[language]}</p>
                      
                      <div className="fixed bottom-12 md:bottom-12 sm:bottom-14 lg:bottom-4">
                        <Link
                          to={`/project/${project.slug}`}
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

            {/* Add custom pagination container */}
            <div className="swiper-pagination"></div>
          </Swiper>
          
          {/* Navigation Buttons Container */}
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
