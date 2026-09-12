"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ShoppingCart, Cpu, PanelsTopLeft, Blocks } from "lucide-react";
import Image from "next/image";
import SpotlightText from "./SpotlightText";
import BurnSpotlightText from "./BurnSpotlightText";
import HeroPulsePath from "./HeroPulsePath";
import GlassCard from "./GlassCard";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../translations/translations";
import { useHeroMotion } from "../../hooks/useHeroMotion";
import styles from "./HeroNewv2.module.css";

const stackIcons = [ShoppingCart, Cpu, PanelsTopLeft, Blocks];
const cardAngles = [14, 11, -11, -14];
const cardRolls = [4, 2, -4, -3];
const headingClassName = "text-4xl sm:text-6xl lg:text-[44px] xl:text-[56px] 2xl:text-[72px] [@media(max-height:800px)]:xl:text-[48px] [@media(max-height:700px)]:xl:text-[40px] font-light font-oxanium tracking-normal leading-[1.1] uppercase whitespace-pre-wrap";

type StackCardProps = {
  item: { title: string; description: string };
  index: number;
};

const StackCard: React.FC<StackCardProps> = ({ item, index }) => {
  const Icon = stackIcons[index];
  return (
    <GlassCard
      rotateY={cardAngles[index]}
      rotateX={index % 2 === 0 ? -4 : 3}
      rotateZ={cardRolls[index]}
      className="p-6 xl:p-7 2xl:p-8 min-h-[190px] lg:min-h-[200px]"
      contentClassName="flex flex-col gap-5"
    >
      {/* Icon container */}
      <div className="flex-shrink-0 w-10 h-10 text-cyan-100 flex items-center justify-center relative transition-colors duration-500">
        <Icon className="w-full h-full relative z-10 motion-safe:group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
        {/* Glowing effect behind icon */}
        <div className={`${styles.iconGlow} absolute inset-0 bg-teal-300/20 blur-xl rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>

      {/* Text */}
      <div className="flex flex-col relative z-10">
        <span className="text-[15px] lg:text-[14px] xl:text-[15px] font-medium text-white/90 group-hover:text-teal-300 transition-colors duration-300 tracking-[0.015em] uppercase mb-0.5 xl:mb-1 font-oxanium">
          {item.title}
        </span>
        <p className="text-[13px] leading-relaxed text-slate-200/85 group-hover:text-white/80 transition-colors duration-300">
          {item.description}
        </p>
      </div>
    </GlassCard>
  );
};

const HeroNewv2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Use t for the main v1 header strings, tV2 for the benefits
  const t = translations[language].hero;
  const tV2 = translations[language].heroV2;

  const { y, cardsY, reducedMotion, desktopMotion } = useHeroMotion(containerRef);

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className={`${styles.hero} relative min-h-screen flex items-center overflow-hidden bg-indigo-950`}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/media/herotest.webp"
          alt="Abstract AppCrates hero background"
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
      <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-24 xl:py-0 lg:min-h-screen lg:flex lg:items-center">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-10 2xl:gap-16 items-center lg:items-stretch w-full">

          {/* ── Left stack ──
               No opacity in the entry animation, on this column or the one
               opposite: an ancestor below full opacity becomes a backdrop root
               in Chromium, which cuts the cards' backdrop-filter off from the
               page behind them. The glass would then switch on mid-load. */}
          <motion.div
            style={{ y: cardsY }}
            initial={desktopMotion ? { x: -24 } : false}
            animate={{ x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.parallax} order-2 lg:order-1 lg:col-span-3 flex flex-col justify-center gap-8 lg:gap-14 xl:gap-16`}
          >
            {tV2.stack.items.slice(0, 2).map((item, index) => (
              <StackCard key={item.title} item={item} index={index} />
            ))}
          </motion.div>

          {/* ── Centre: Monumental Headline + Copy + CTA (from v1) ── */}
          <motion.div
            style={{ y }}
            className={`${styles.parallax} order-1 lg:order-2 lg:col-span-6 flex flex-col items-center text-center`}
          >
            <h1 className="sr-only">{t.seoHeading}</h1>

            {/* Eyebrow */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 lg:mb-4 xl:mb-6 2xl:mb-8 [@media(max-height:800px)]:mb-4"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-white/90">
                {t.label}
              </span>
            </motion.div>

            {/* Heading */}
            <div
              className="mb-8 lg:mb-4 xl:mb-6 2xl:mb-8 [@media(max-height:800px)]:mb-4"
              aria-hidden="true"
            >
              {!desktopMotion ? <div className={headingClassName}>{t.heading}</div> : <BurnSpotlightText
                as="div"
                className={headingClassName}
                glowSize={200}
                baseDelay={500}
                charDelay={40}
                activateOnMount
              >
                {t.heading}
              </BurnSpotlightText>}
            </div>

            {/* Subtitle */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.35 }}
              className="max-w-xl mx-auto mb-12 lg:mb-6 xl:mb-8 2xl:mb-12 [@media(max-height:800px)]:mb-6 [@media(max-height:700px)]:mb-4 flex flex-col gap-5"
            >
              <SpotlightText
                as="p"
                className="text-lg sm:text-xl lg:text-sm xl:text-base 2xl:text-xl [@media(max-height:700px)]:text-xs font-light text-white/80"
                glowSize={100}
              >
                {t.subtitle}
              </SpotlightText>
              <p className="text-lg sm:text-xl lg:text-sm xl:text-base 2xl:text-xl [@media(max-height:700px)]:text-xs font-medium text-teal-300">
                {t.punchline}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 [@media(max-height:700px)]:gap-4"
            >
              <a
                href="#about"
                className="group relative px-10 py-5 lg:py-4 xl:py-5 2xl:py-5 [@media(max-height:700px)]:py-3 bg-teal-300 text-indigo-950 font-normal rounded-none overflow-hidden transition-all duration-500 min-w-[230px] lg:min-w-[160px] xl:min-w-[200px] 2xl:min-w-[230px] hover:shadow-[0_0_60px_rgba(94,234,212,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-300 text-center"
                aria-label="Find out more about me"
              >
                <span className="relative z-10">{t.cta.viewWork}</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </a>

              <a
                href="#contact"
                className="group px-10 py-5 lg:py-4 xl:py-5 2xl:py-5 [@media(max-height:700px)]:py-3 border border-white/20 text-white font-normal rounded-none hover:border-teal-300 transition-all duration-500 relative overflow-hidden min-w-[230px] lg:min-w-[160px] xl:min-w-[200px] 2xl:min-w-[230px] focus:outline-none focus:ring-2 focus:ring-teal-300 text-center"
                aria-label="Contact me to discuss your project"
              >
                <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">
                  {t.cta.getInTouch}
                </span>
                <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right stack ── */}
          <motion.div
            style={{ y: cardsY }}
            initial={desktopMotion ? { x: 24 } : false}
            animate={{ x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.parallax} order-3 lg:col-span-3 flex flex-col justify-center gap-8 lg:gap-14 xl:gap-16`}
          >
            {tV2.stack.items.slice(2, 4).map((item, index) => (
              <StackCard key={item.title} item={item} index={index + 2} />
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={scrollToNext}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        className="absolute bottom-12 [@media(max-height:800px)]:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex [@media(max-height:700px)]:!hidden flex-col items-center gap-3 text-white/30 hover:text-teal-300 transition-colors cursor-pointer group focus:outline-none focus:text-teal-300"
        aria-label={t.scroll}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">
          {t.scroll}
        </span>
        <div className={styles.scrollArrow}>
          <ArrowDown className="w-4 h-4" />
        </div>
      </motion.button>


    </section>
  );
};

export default HeroNewv2;
