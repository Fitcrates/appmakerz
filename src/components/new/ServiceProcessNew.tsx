"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SpotlightText from "./SpotlightText";
import BurnSpotlightText from "./BurnSpotlightText";

interface ServiceProcessNewProps {
  processSteps: string[];
  language: string;
}

export default function ServiceProcessNew({ processSteps, language }: ServiceProcessNewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="py-12 lg:py-32 relative overflow-hidden bg-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <span className="text-xs tracking-[0.3em] uppercase text-teal-300/80 mb-4 block">
            {language === 'pl' ? 'Krok po kroku' : 'Step by step'}
          </span>
          <BurnSpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-6xl font-light font-oxanium text-white" glowSize={200} baseDelay={100} charDelay={30} activateOnMount>
            {language === 'pl' ? 'Proces współpracy' : 'Process'}
          </BurnSpotlightText>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-px bg-white/10 sm:-translate-x-1/2" />

          <motion.div
            className="absolute left-[27px] sm:left-1/2 top-0 w-px bg-teal-300 origin-top sm:-translate-x-1/2 shadow-[0_0_15px_rgba(94,234,212,0.5)]"
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />

          <div className="space-y-12 sm:space-y-24">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16 ${isEven ? 'sm:flex-row-reverse' : ''}`}>

                  {/* Number Circle */}
                  <div className="absolute left-0 sm:left-1/2 top-0 sm:top-1/2 -translate-y-0 sm:-translate-y-1/2 sm:-translate-x-1/2 w-14 h-14 rounded-full bg-indigo-950 border border-teal-300/30 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(94,234,212,0.1)] backdrop-blur-sm">
                    <span className="text-teal-300 font-oxanium text-xl">{String(index + 1).padStart(2, '0')}</span>
                    {/* Inner pulse */}
                    <div className="absolute inset-0 rounded-full border border-teal-300/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full sm:w-1/2 pl-20 sm:pl-0 ${isEven ? 'sm:pr-16 text-left sm:text-right' : 'sm:pl-16 text-left'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden"
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-300/0 via-teal-300/0 to-teal-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Decorative corner */}
                      <div className={`absolute top-0 ${isEven ? 'left-0 border-l border-t' : 'right-0 border-r border-t'} w-8 h-8 border-teal-300/30 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 ${isEven ? '-translate-x-2 group-hover:translate-x-0' : 'translate-x-2 group-hover:translate-x-0'} group-hover:translate-y-0`} />

                      <SpotlightText as="p" className="text-white/75 font-light font-plex leading-relaxed text-lg" glowSize={120}>
                        {step}
                      </SpotlightText>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
