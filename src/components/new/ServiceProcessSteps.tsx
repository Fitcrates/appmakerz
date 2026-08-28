"use client";

import { motion } from "framer-motion";
import SpotlightText from "./SpotlightText";
import BurnSpotlightText from "./BurnSpotlightText";

interface ServiceProcessStepsProps {
  steps: string[];
  language: string;
}

export default function ServiceProcessSteps({ steps, language }: ServiceProcessStepsProps) {
  if (!steps.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-indigo-950 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">

          <div className="self-start">
            <span className="text-xs tracking-[0.3em] uppercase text-teal-300/80 mb-4 block">
              {language === 'pl' ? 'Krok po kroku' : 'Step by step'}
            </span>
            <BurnSpotlightText
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white leading-tight"
              glowSize={180}
              baseDelay={100}
              charDelay={30}
            >
              {language === 'pl' ? 'Proces współpracy' : 'How we work'}
            </BurnSpotlightText>
          </div>

          <ol className="relative">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;

              return (
                <motion.li
                  key={`process-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
                  className="group grid grid-cols-[auto_1fr] gap-6 sm:gap-8"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-indigo-950/40 font-oxanium text-xs tracking-widest text-teal-200/85 shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-500 group-hover:border-teal-300/30 group-hover:bg-indigo-950/60 group-hover:text-teal-200 group-hover:shadow-[0_0_22px_rgba(94,234,212,0.18)] sm:h-12 sm:w-12">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {!isLast ? (
                      <span
                        aria-hidden="true"
                        className="my-3 w-px flex-1 bg-gradient-to-b from-white/[0.16] to-white/[0.04]"
                      />
                    ) : null}
                  </div>

                  <div className={isLast ? "pt-2" : "pb-10 sm:pb-12"}>
                    <SpotlightText
                      as="p"
                      className="text-white/70 font-plex font-light text-lg sm:text-xl leading-relaxed group-hover:text-white/90 transition-colors duration-500"
                      glowSize={150}
                    >
                      {step}
                    </SpotlightText>
                  </div>
                </motion.li>
              );
            })}
          </ol>

        </div>
      </div>
    </section>
  );
}
