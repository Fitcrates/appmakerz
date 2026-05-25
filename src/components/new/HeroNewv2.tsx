"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import SpotlightText from "./SpotlightText";
import BurnSpotlightText from "./BurnSpotlightText";
import HeroPulsePath from "./HeroPulsePath";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations/translations";

const MedusaIcon = (props: any) => (
  <div className={props.className}>
    <Image src="/media/icons/medusa.svg" alt="Medusa" width={36} height={36} className="w-full h-full object-contain" />
  </div>
);

const NextjsIcon = (props: any) => (
  <div className={props.className}>
    <Image src="/media/icons/nextjs-white-logo.svg" alt="Next.js" width={36} height={36} className="w-full h-full object-contain" />
  </div>
);

const AIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" {...props}>
    {/* Box from 3 to 21 (width=18, height=18) */}
    <path d="M16 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-9" strokeWidth="1.5" strokeLinecap="round" />
    <text x="11.5" y="16.5" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="white" stroke="none" fontFamily="sans-serif">AI</text>
    <path d="M20 1l1.5 3.5L25 6l-3.5 1.5L20 11l-1.5-3.5L15 6l3.5-1.5z" fill="white" stroke="none" />
  </svg>
);

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Terminal body */}
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
    {/* Header line */}
    <path d="M3 8h18" strokeWidth="1.5" />
    {/* Header dots */}
    <circle cx="6" cy="6" r="0.8" fill="white" stroke="none" />
    <circle cx="8.5" cy="6" r="0.8" fill="white" stroke="none" />
    {/* Prompt */}
    <path d="M7 11l3 2.5L7 16" strokeWidth="1.5" />
    <path d="M12 16h5" strokeWidth="1.5" />
  </svg>
);

const stackIcons = [MedusaIcon, AIcon, NextjsIcon, CodeIcon];

const HeroNewv2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Use t for the main v1 header strings, tV2 for the benefits
  const t = translations[language].hero;
  const tV2 = translations[language].heroV2;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-indigo-950"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/media/herotest.webp"
          alt=""
          role="presentation"
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-indigo-950/80" />
      </div>

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <HeroPulsePath />

      {/* ── Main content ── */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0 lg:min-h-screen lg:flex lg:items-center">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 xl:gap-16 items-center lg:items-stretch w-full">

          {/* ── Left: Monumental Headline + Copy + CTA (from v1) ── */}
          <motion.div
            style={{ y, willChange: "transform" }}
            className="lg:col-span-8 flex flex-col"
          >
            <h1 className="sr-only">{t.seoHeading}</h1>

            {/* Eyebrow */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 [@media(max-height:800px)]:mb-4"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/90">
                {t.label}
              </span>
            </motion.div>

            {/* Heading */}
            <div
              className="mb-8 [@media(max-height:800px)]:mb-4"
              aria-hidden="true"
            >
              <BurnSpotlightText
                as="div"
                className="text-4xl sm:text-7xl lg:text-[90px] xl:text-[110px] [@media(max-height:800px)]:lg:text-[80px] [@media(max-height:700px)]:lg:text-[64px] font-light font-oxanium tracking-normal leading-[1.1] uppercase whitespace-pre-wrap"
                glowSize={200}
                baseDelay={500}
                charDelay={40}
                activateOnMount
              >
                {t.heading}
              </BurnSpotlightText>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.35 }}
              className="max-w-xl mb-12 [@media(max-height:800px)]:mb-8 [@media(max-height:700px)]:mb-6 flex flex-col gap-3"
            >
              <SpotlightText
                as="p"
                className="text-lg sm:text-xl [@media(max-height:700px)]:text-base font-light text-white/80"
                glowSize={100}
              >
                {t.subtitle}
              </SpotlightText>
              <p className="text-lg sm:text-xl [@media(max-height:700px)]:text-base font-medium text-teal-300">
                {t.punchline}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 [@media(max-height:700px)]:gap-4"
            >
              <a
                href="#about"
                className="group relative px-10 py-5 [@media(max-height:700px)]:py-4 bg-teal-300 text-indigo-950 font-normal overflow-hidden transition-all duration-500 min-w-[230px] hover:shadow-[0_0_60px_rgba(94,234,212,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-300 text-center"
                aria-label="Find out more about me"
              >
                <span className="relative z-10">{t.cta.viewWork}</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </a>

              <a
                href="#contact"
                className="group px-10 py-5 [@media(max-height:700px)]:py-4 border border-white/20 text-white font-normal hover:border-teal-300 transition-all duration-500 relative overflow-hidden min-w-[230px] focus:outline-none focus:ring-2 focus:ring-teal-300 text-center"
                aria-label="Contact me to discuss your project"
              >
                <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">
                  {t.cta.getInTouch}
                </span>
                <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: Cyber Olympus Glass Panel ── */}
          <motion.div
            style={{ y: rightY, willChange: "transform" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex justify-start lg:justify-end mt-8 lg:mt-0 lg:h-full"
          >
            <div className="relative w-full max-w-sm xl:max-w-md flex flex-col justify-between gap-4 h-full">
              {tV2.stack.items.map((item, index) => {
                const Icon = stackIcons[index];
                return (
                  <div
                    key={item.title}
                    className="group relative flex items-center sm:items-start gap-5 p-5 sm:p-6 rounded-2xl shadow-[0_4_20px_rgba(0,0,0,0.2)] transition-all duration-500 bg-indigo-950/20 backdrop-blur-md hover:bg-indigo-950/40 border border-white/[0.05] hover:border-teal-300/20 card-shine"
                  >
                    {/* Background subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-300/0 via-teal-300/0 to-teal-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Icon container */}
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center relative border border-transparent transition-colors duration-500">
                      <Icon className="w-8 h-8 sm:w-9 sm:h-9 relative z-10 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                      {/* Glowing effect behind icon */}
                      <div className="absolute inset-0 bg-teal-300/20 blur-xl rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col pt-0.5 relative z-10">
                      <span className="text-[14px] sm:text-[15px] font-medium text-white/90 group-hover:text-teal-300 transition-colors duration-300 tracking-[0.05em] uppercase mb-1 font-oxanium">
                        {item.title}
                      </span>
                      <p className="text-[13px] leading-relaxed text-white/50 group-hover:text-white/70 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        className="absolute bottom-12 [@media(max-height:800px)]:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex [@media(max-height:700px)]:!hidden flex-col items-center gap-3 text-white/30 hover:text-teal-300 transition-colors cursor-pointer group focus:outline-none focus:text-teal-300"
        aria-label={t.scroll}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">
          {t.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>


    </section>
  );
};

export default HeroNewv2;