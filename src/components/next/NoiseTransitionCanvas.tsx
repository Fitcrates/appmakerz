// src/components/next/NoiseTransitionCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';

type Phase = 'pre-cover' | 'cover' | 'hold' | 'reveal';

interface NoiseTransitionCanvasProps {
  phase: Phase;
}

// --- Konfiguracja Timingu (Musi odpowiadać RouteTransitionProvider) ---
// COVER_ANIM_MS: Czas trwania animacji zapełniania ekranu. 
// Dopasuj do COVER_DURATION_MS w RouteTransitionProvider.
const COVER_ANIM_MS = 1400;

// REVEAL_ANIM_MS: Czas trwania animacji odsłaniania nowej strony.
// Dopasuj do REVEAL_DURATION_MS w RouteTransitionProvider.
const REVEAL_ANIM_MS = 1400;

// EDGE_SOFTNESS: Szerokość miękkiego przejścia (rozmycia) na krawędzi błyskawicy.
// Zwiększ by krawędzie były bardziej rozmyte, zmniejsz by były twarde i ostre.
const EDGE_SOFTNESS = 30;

/* ── Transition colours ── */
// Indigo-900 (Background)
const BG_R = 49;
const BG_G = 46;
const BG_B = 129;

// Teal-300 (Lightning nodes)
const LIGHTNING_R = 94;
const LIGHTNING_G = 234;
const LIGHTNING_B = 212;

const LIGHTNING_THRESHOLD = 90; // Pixels below this noise value will have a teal tint

/* ── Canvas resolution scale (lower = faster, slightly softer edges) ── */
const RESOLUTION_SCALE = 0.35;

/* ── Easing ── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}



export default function NoiseTransitionCanvas({
  phase,
}: NoiseTransitionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<Uint8Array | null>(null);
  const dimRef = useRef({ w: 0, h: 0 });
  const imgDataRef = useRef<ImageData | null>(null);
  const rafRef = useRef(0);
  const animStartRef = useRef(0);
  const prevPhaseRef = useRef(phase);

  /* Load texture and generate map once on mount */
  useEffect(() => {
    const w = Math.ceil(window.innerWidth * RESOLUTION_SCALE);
    const h = Math.ceil(window.innerHeight * RESOLUTION_SCALE);
    dimRef.current = { w, h };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) imgDataRef.current = ctx.createImageData(w, h);
    }

    const img = new Image();
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
      const noiseWeight = 0.65; // 65% texture, 35% radial distance

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];

          // Invert luminance so bright lightning pixels appear first (lower threshold)
          const lum = 255 - (0.299 * r + 0.587 * g + 0.114 * b);

          const dx = x - cx;
          const dy = y - cy;
          const dist = (Math.sqrt(dx * dx + dy * dy) / maxDist) * 255;

          const v = lum * noiseWeight + dist * (1 - noiseWeight);
          out[idx] = Math.min(255, Math.max(0, v | 0));
        }
      }
      noiseRef.current = out;
    };
  }, []);

  /* Kick animation whenever phase changes */
  useEffect(() => {
    if (phase !== prevPhaseRef.current) {
      animStartRef.current = performance.now();
      prevPhaseRef.current = phase;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;

      const noise = noiseRef.current;
      const imageData = imgDataRef.current;
      if (!noise || !imageData) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const { w, h } = dimRef.current;
      const elapsed = performance.now() - animStartRef.current;

      /* Compute how much of the screen should be covered (0–1) */
      let cover: number;
      if (phase === 'pre-cover') {
        cover = 0;
      } else if (phase === 'cover') {
        cover = easeInOutCubic(Math.min(elapsed / COVER_ANIM_MS, 1));
      } else if (phase === 'hold') {
        cover = 1;
      } else {
        // reveal – reverse dissolve
        cover = 1 - easeInOutCubic(Math.min(elapsed / REVEAL_ANIM_MS, 1));
      }

      const px = imageData.data;
      // Threshold with overshoot so edge-softness works at 0 % and 100 %
      const threshold =
        cover * (255 + EDGE_SOFTNESS * 2) - EDGE_SOFTNESS;

      for (let i = 0, pi = 0; i < noise.length; i++, pi += 4) {
        const nVal = noise[i];
        const diff = threshold - nVal;

        if (diff > -EDGE_SOFTNESS) {
          let r = BG_R, g = BG_G, b = BG_B;

          if (nVal < LIGHTNING_THRESHOLD) {
            const t = nVal / LIGHTNING_THRESHOLD; // 0 = pure lightning, 1 = pure background
            const lr = LIGHTNING_R + (BG_R - LIGHTNING_R) * t;
            const lg = LIGHTNING_G + (BG_G - LIGHTNING_G) * t;
            const lb = LIGHTNING_B + (BG_B - LIGHTNING_B) * t;

            // Fade the teal glow back to indigo as the transition wave passes
            const GLOW_WIDTH = 120;
            const edgeDist = Math.max(0, diff - EDGE_SOFTNESS);
            const fade = Math.min(1, edgeDist / GLOW_WIDTH);

            r = lr + (BG_R - lr) * fade;
            g = lg + (BG_G - lg) * fade;
            b = lb + (BG_B - lb) * fade;
          }

          if (diff >= EDGE_SOFTNESS) {
            // fully opaque
            px[pi] = r;
            px[pi + 1] = g;
            px[pi + 2] = b;
            px[pi + 3] = 255;
          } else {
            // soft edge
            const a = ((diff + EDGE_SOFTNESS) / (EDGE_SOFTNESS * 2)) * 255;
            px[pi] = r;
            px[pi + 1] = g;
            px[pi + 2] = b;
            px[pi + 3] = a | 0;
          }
        } else {
          // fully transparent
          px[pi + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const needsMore =
        (phase === 'cover' && elapsed < COVER_ANIM_MS) ||
        (phase === 'reveal' && elapsed < REVEAL_ANIM_MS);

      if (needsMore) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        imageRendering: 'auto',
        pointerEvents: 'none',
      }}
    />
  );
}
