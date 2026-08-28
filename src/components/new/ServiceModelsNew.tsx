"use client";

import { motion } from "framer-motion";
import SpotlightText from "./SpotlightText";
import BurnSpotlightText from "./BurnSpotlightText";
import type { ServiceModel } from "@/types/sanity.types";

interface ServiceModelsNewProps {
  models: ServiceModel[];
  language: string;
}

export default function ServiceModelsNew({ models, language }: ServiceModelsNewProps) {
  if (!models.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-indigo-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="text-xs tracking-[0.3em] uppercase text-white/30">
          {language === 'pl' ? 'Dwie drogi' : 'Two routes'}
        </span>
        <div className="mt-4 mb-6 max-w-3xl">
          <BurnSpotlightText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium"
            glowSize={180}
            baseDelay={100}
            charDelay={30}
          >
            {language === 'pl' ? 'Wybierz model' : 'Pick your model'}
          </BurnSpotlightText>
        </div>
        <SpotlightText
          as="p"
          className="text-white/55 font-light font-plex text-lg max-w-2xl leading-relaxed mb-14"
          glowSize={120}
        >
          {language === 'pl'
            ? 'Ten sam silnik, dwa scenariusze wdrożenia. Nie musisz wiedzieć, który wybrać — to ustalamy na pierwszej rozmowie.'
            : 'Same engine, two rollout scenarios. You do not need to decide upfront — we settle it in the first conversation.'}
        </SpotlightText>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {models.map((model, index) => (
            <motion.div
              key={`model-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="hero-glass-card card-shine group relative flex flex-col rounded-2xl border border-white/[0.06] bg-indigo-950/20 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-500 hover:border-teal-300/25 hover:bg-indigo-950/40 lg:p-10"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-300/0 via-teal-300/0 to-teal-300/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col">
                <span className="self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-plex text-[0.65rem] uppercase tracking-[0.3em] text-teal-300/85 transition-colors duration-500 group-hover:border-teal-300/25">
                  {model.label}
                </span>

                <h3 className="mt-6 font-oxanium text-2xl font-light text-white sm:text-3xl">
                  {model.title}
                </h3>

                <p className="mt-4 font-plex text-base leading-relaxed text-white/60 sm:text-lg">
                  {model.audience}
                </p>

                {model.points?.length ? (
                  <>
                    <hr className="mt-8 h-px border-0 bg-gradient-to-r from-white/[0.14] via-white/[0.07] to-transparent" />
                    <ul className="mt-8 space-y-4">
                      {model.points.map((point, pointIndex) => (
                        <li
                          key={`model-${index}-point-${pointIndex}`}
                          className="flex gap-4 font-plex text-base leading-relaxed text-white/70"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.55rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-300/70 shadow-[0_0_10px_rgba(94,234,212,0.45)] transition-all duration-500 group-hover:bg-teal-300 group-hover:shadow-[0_0_16px_rgba(94,234,212,0.75)]"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
