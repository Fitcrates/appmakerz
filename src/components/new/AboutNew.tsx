import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import PrefetchLink from '@/components/next/PrefetchLink';
import SpotlightText from './SpotlightText';
import BurnSpotlightText from './BurnSpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { localizedPath } from '../../lib/i18n-routing';
import { translations } from '../../translations/translations';

const NoiseRevealImage: React.FC<{ src: string; alt: string; ariaLabel?: string; revealed: boolean }> = ({ src, alt, ariaLabel, revealed }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<Uint8Array | null>(null);
  const dimRef = useRef({ w: 0, h: 0 });
  const imgDataRef = useRef<ImageData | null>(null);
  const rafRef = useRef(0);
  const animStartRef = useRef(0);
  const prevRevealedRef = useRef(revealed);
  const noiseMinMaxRef = useRef({ min: 0, max: 255 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Fixed resolution that fits the container aspect ratio roughly (4:5)
    const w = 400;
    const h = 500;

    dimRef.current = { w, h };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) imgDataRef.current = ctx.createImageData(w, h);
    }

    const img = new window.Image();
    img.src = '/media/texture2.png';
    img.onload = () => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, w, h);
      const data = offCtx.getImageData(0, 0, w, h).data;
      const out = new Uint8Array(w * h);

      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const noiseWeight = 0.65;

      let minNoise = 255;
      let maxNoise = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];

          const lum = 255 - (0.299 * r + 0.587 * g + 0.114 * b);

          const dx = x - cx;
          const dy = y - cy;
          const dist = (Math.sqrt(dx * dx + dy * dy) / maxDist) * 255;

          const v = lum * noiseWeight + dist * (1 - noiseWeight);
          const val = Math.min(255, Math.max(0, v | 0));
          out[idx] = val;

          if (val < minNoise) minNoise = val;
          if (val > maxNoise) maxNoise = val;
        }
      }
      noiseMinMaxRef.current = { min: minNoise, max: maxNoise };
      noiseRef.current = out;
      setIsLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (revealed && !prevRevealedRef.current) {
      animStartRef.current = performance.now();
    }
    prevRevealedRef.current = revealed;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;
    const EDGE_SOFTNESS = 30;

    // indigo-950 matching
    const BG_R = 30; const BG_G = 27; const BG_B = 75;
    const LIGHTNING_R = 94; const LIGHTNING_G = 234; const LIGHTNING_B = 212;
    const LIGHTNING_THRESHOLD = 90;

    const render = () => {
      if (!active) return;

      const noise = noiseRef.current;
      const imageData = imgDataRef.current;
      if (!noise || !imageData) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      let cover = 1;

      if (revealed) {
        const ANIM_DUR = 3000; // dłuższy czas pojawiania/znikania (2.5s)
        const HOLD_REVEALED = 4000; // przytrzymanie na widocznym zdjęciu (4s)
        const CYCLE_MS = ANIM_DUR * 2 + HOLD_REVEALED; // całkowity cykl = 9s
        const elapsed = performance.now() - animStartRef.current;
        const cycleTime = elapsed % CYCLE_MS;

        // Używamy kierunkowych funkcji kwadratowych, aby zlikwidować "pustkę" przy pełnym zakryciu.
        // Dzięki temu uderzenie w cover=1 jest szybkie, a odbicie natychmiastowe.
        if (cycleTime < ANIM_DUR) {
          // Pojawianie się (cover 1 -> 0): szybki start, łagodne zakończenie
          const t = cycleTime / ANIM_DUR;
          cover = Math.pow(1 - t, 2);
        } else if (cycleTime < ANIM_DUR + HOLD_REVEALED) {
          cover = 0;
        } else {
          // Znikanie (cover 0 -> 1): łagodny start, gwałtowne zakończenie (szybkie uderzenie w 1)
          const t = (cycleTime - (ANIM_DUR + HOLD_REVEALED)) / ANIM_DUR;
          cover = Math.pow(t, 2);
        }
      } else {
        cover = 1;
      }

      if (cover === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        const { min, max } = noiseMinMaxRef.current;
        const threshold = (min - EDGE_SOFTNESS) + cover * (max - min + EDGE_SOFTNESS * 2);
        const px = imageData.data;

        for (let i = 0, pi = 0; i < noise.length; i++, pi += 4) {
          const nVal = noise[i];
          const diff = threshold - nVal;

          if (diff > -EDGE_SOFTNESS) {
            let r = BG_R, g = BG_G, b = BG_B;

            if (nVal < LIGHTNING_THRESHOLD) {
              const t = nVal / LIGHTNING_THRESHOLD;
              const lr = LIGHTNING_R + (BG_R - LIGHTNING_R) * t;
              const lg = LIGHTNING_G + (BG_G - LIGHTNING_G) * t;
              const lb = LIGHTNING_B + (BG_B - LIGHTNING_B) * t;

              const GLOW_WIDTH = 120;
              const edgeDist = Math.max(0, diff - EDGE_SOFTNESS);
              const fade = Math.min(1, edgeDist / GLOW_WIDTH);

              r = lr + (BG_R - lr) * fade;
              g = lg + (BG_G - lg) * fade;
              b = lb + (BG_B - lb) * fade;
            }

            if (diff >= EDGE_SOFTNESS) {
              px[pi] = r; px[pi + 1] = g; px[pi + 2] = b; px[pi + 3] = 255;
            } else {
              const a = ((diff + EDGE_SOFTNESS) / (EDGE_SOFTNESS * 2)) * 255;
              px[pi] = r; px[pi + 1] = g; px[pi + 2] = b; px[pi + 3] = a | 0;
            }
          } else {
            px[pi + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      if (!revealed) {
        return;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [revealed, isLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" role="img" aria-label={ariaLabel || alt}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 50vw"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

const AboutNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const imageInView = useInView(imageRef, { margin: '-10% 0px -10% 0px' });
  const { language } = useLanguage();
  const t = translations[language].about;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  return (
    <section id="about" ref={containerRef} className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-6 lg:mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30 ">{t.label}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div
            ref={imageRef}
            style={{ y: imageY, scale: imageScale, willChange: 'transform' }}
            className="relative aspect-[4/5] lg:sticky lg:top-32"
          >
            <div className="absolute inset-0 overflow-hidden">
              <NoiseRevealImage
                src="/media/o_mnie.webp"
                alt="Portrait of Arkadiusz Wawrzyniak, fullstack developer"
                ariaLabel="Professional portrait showing the developer at work"
                revealed={imageInView}
              />
            </div>

            <div className="absolute -top-4 -left-4 w-full h-full border border-teal-300/20" aria-hidden="true" />
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-teal-300" aria-hidden="true" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-teal-300" aria-hidden="true" />
          </motion.div>

          <div className="lg:pt-16">
            <div className="mb-12">
              <BurnSpotlightText
                as="h2"
                className="text-4xl sm:text-5xl lg:text-6xl font-light font-oxanium leading-[1.3] mb-2"
                glowSize={150}
                baseDelay={300}
                charDelay={35}
              >
                {t.heading}
              </BurnSpotlightText>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 mb-10"
            >
              <SpotlightText as="p" className="text-lg  font-light leading-relaxed" glowSize={120}>
                {t.description.p1}
              </SpotlightText>
              <SpotlightText as="p" className="text-lg  font-light leading-relaxed" glowSize={120}>
                {t.description.p2}
              </SpotlightText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mb-16"
            >
              <PrefetchLink href={localizedPath(language, '/about-me')} className="group inline-flex items-center gap-4" aria-label="Go to About Me page">
                <span className="text-white  group-hover:text-teal-300 transition-colors font-oxanium">
                  {language === 'pl' ? 'Poznaj mnie' : 'Get to know me'}
                </span>
                <span className="w-11 h-11 border border-white/20 flex items-center justify-center group-hover:bg-teal-300 group-hover:border-teal-300 transition-all">
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:text-indigo-950 transition-colors" />
                </span>
              </PrefetchLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10 items-center text-center lg:text-left"
              role="list"
              aria-label="Experience statistics"
            >
              {[
                { value: t.stats.years.value, label: t.stats.years.label, description: 'Years of professional experience' },
                { value: t.stats.projects.value, label: t.stats.projects.label, description: 'Completed projects' },
                { value: t.stats.dedication.value, label: t.stats.dedication.label, description: 'Dedication to quality' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  role="listitem"
                  aria-label={stat.description}
                >
                  <div className="mb-2">
                    <SpotlightText as="span" className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium" glowSize={80}>
                      {stat.value}
                    </SpotlightText>
                  </div>
                  <div className="text-xs text-teal-300  tracking-widest uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white/5 origin-left"
        aria-hidden="true"
      />
    </section>
  );
};

export default AboutNew;
