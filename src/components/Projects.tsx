import React, { useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';


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

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const projects = [
    { 
      id: 0,
      title: t.categories.anime.title,
      description: `${t.categories.anime.description.line1} ${t.categories.anime.description.line2} ${t.categories.anime.description.line3} ${t.categories.anime.description.line4}`,
      topImage: "media\\ansearch.webp",
      backgroundImage: "media/tlokarta1.webp",
      link: "https://animecrates.netlify.app/",
      viewText: t.viewProject
    },
    {
      id: 1,
      title: t.categories.mobile.title,
      description: `${t.categories.mobile.description.line1} ${t.categories.mobile.description.line2} ${t.categories.mobile.description.line3} ${t.categories.mobile.description.line4}`,
      topImage: "media\\flixapp.png",
      backgroundImage: "media/tlokarta2.webp",
      link: "https://www.appsheet.com/start/9a9a55ba-971a-44dd-bb24-67241f296c46",
      viewText: t.viewProject
    },
    {
      id: 2,
      title: t.categories.web.title,
      description: `${t.categories.web.description.line1} ${t.categories.web.description.line2} ${t.categories.web.description.line3} ${t.categories.web.description.line4}`,
      topImage: "media\\moja strona2.png",
      backgroundImage: "media/tlokarta3.webp",
      link: "#",
      viewText: t.viewProject
    },
    {
      id: 3,
      title: t.categories.design.title,
      description: `${t.categories.design.description.line1} ${t.categories.design.description.line2} ${t.categories.design.description.line3} ${t.categories.design.description.line4}`,
      topImage: "media\\glide1.png",
      backgroundImage: "media/tlokarta1.webp",
      link: "#",
      viewText: t.viewProject
    }
  ];

  return (
    <section 
      id="projects"
      className="py-20 sm:py-40 bg-[#140F2D] overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-36">
        {/* Heading */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-16 gap-2 sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <span className="text-5xl sm:text-7xl text-white font-normal font-jakarta">
            {t.title}
          </span>
          <span className="text-xl sm:text-3xl text-teal-300 font-biglight font-jakarta text-left sm:text-right mt-2 sm:mt-0 sm:-mb-10">
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
  spaceBetween={30}
  slidesPerView={1}
  pagination={{ clickable: true, el: '.swiper-pagination' }}
  modules={[Navigation, Pagination]}
  navigation={{
    prevEl: navigationPrevRef.current,
    nextEl: navigationNextRef.current,
  }}
  onInit={(swiper) => {
    swiper.params.navigation.prevEl = navigationPrevRef.current;
    swiper.params.navigation.nextEl = navigationNextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }}
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
              <SwiperSlide key={project.id}>
                <motion.div
                  variants={cardVariants}
                  className="h-[30rem] w-full max-w-2xl lg:max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 
                  ring-2 ring-white ring-opacity-80 flex flex-col relative mb-8 lg:mb-0"
          
                >
                  {/* Top Image Section */}
                  <div className="h-2/5 relative overflow-hidden bg-[#140F2D] transform hover:scale-110 transition duration-300">
                    <img
                      src={project.topImage}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="h-3/5 p-4 flex flex-col relative">
                    <img
                      src={project.backgroundImage}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="relative z-10 h-full flex flex-col">
                      <div>
                        <h3 className="text-2xl font-light text-white text-left mt-2 font-jakarta font-normal">
                          {project.title}
                        </h3>
                        <p className="text-white text-left mt-8 font-extralight font-jakarta leading-relaxed tracking-wide text-left text-sm">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        <a
                          href={project.link}
                          target={project.link !== "#" ? "_blank" : undefined}
                          rel={project.link !== "#" ? "noopener noreferrer" : undefined}
                          className="text-white hover:text-teal-300 transition duration-300 inline-flex items-center space-x-1"
                        >
                          <span>{project.viewText}</span>
                          <ArrowUpRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}

            {/* Add custom pagination container */}
            <div className="swiper-pagination"></div>
          </Swiper>

          {/* Custom Navigation Buttons */}
<div className="flex justify-center items-center space-x-4">
  <button
    ref={navigationPrevRef}
    className="text-white px-4 py-2 rounded hover:text-teal-400 transition"
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
  <button
    ref={navigationNextRef}
    className="text-white px-4 py-2 rounded hover:text-teal-400 transition"
  >
    <ChevronRight className="w-6 h-6" />
  </button>
</div>

        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
