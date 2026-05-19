"use client";

import { motion } from "framer-motion";
import SpotlightText from "./SpotlightText";
import BurnSpotlightText from "./BurnSpotlightText";

interface ServiceDeliverablesNewProps {
  deliverables: string[];
  language: string;
}

export default function ServiceDeliverablesNew({ deliverables, language }: ServiceDeliverablesNewProps) {
  return (
    <section className="py-12 lg:py-32 bg-indigo-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-20">

          <div className="lg:sticky lg:top-32 self-start">
            <span className="text-xs tracking-[0.3em] uppercase text-teal-300/80 mb-4 block">
              {language === 'pl' ? 'W pakiecie' : "What's included"}
            </span>
            <BurnSpotlightText as="h2" className="text-4xl sm:text-5xl lg:text-6xl font-light font-oxanium text-white leading-tight mb-8" glowSize={200} baseDelay={100} charDelay={30} activateOnMount>
              {language === 'pl' ? 'Co dostajesz' : 'What you get'}
            </BurnSpotlightText>
            <SpotlightText as="p" className="text-white/50 font-light font-plex text-lg max-w-md leading-relaxed" glowSize={100}>
              {language === 'pl'
                ? 'Każdy element projektu jest starannie dopracowany. Przekuwam pomysły w solidne, skalowalne rozwiązania, dbając o najwyższą jakość na każdym etapie.'
                : 'Every project element is carefully refined. I turn ideas into solid, scalable solutions, ensuring the highest quality at every stage.'}
            </SpotlightText>
          </div>

          <div className="flex flex-col border-t border-white/10">
            {deliverables.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={`deliv-${index}`}
                className="group relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-500 px-4 sm:px-6 -mx-4 sm:-mx-6"
              >
                {/* Accent vertical line on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-300 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                <div className="text-white/20 font-oxanium text-2xl sm:text-4xl font-light group-hover:text-teal-300/50 transition-colors duration-500">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <SpotlightText as="p" className="text-white/80 font-light font-plex text-lg sm:text-xl leading-relaxed flex-grow" glowSize={150}>
                  {item}
                </SpotlightText>

                <div className="hidden sm:block">
                  <div className="w-10 h-px bg-white/20 group-hover:bg-teal-300/50 group-hover:w-20 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
