"use client";

import { useRef, useCallback, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useElementActivity } from "@/hooks/useElementActivity";

type GlowVars = Record<string, string>;

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 172, s: 66, l: 64 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number): GlowVars {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: GlowVars = {};
  for (let i = 0; i < opacities.length; i += 1) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four",
  "--gradient-five", "--gradient-six", "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]): GlowVars {
  const vars: GlowVars = {};
  for (let i = 0; i < 7; i += 1) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  /** Run the light around the border continuously; the cursor takes over on hover. */
  animated?: boolean;
  /** Seconds for one full orbit. */
  orbitDuration?: number;
  /** Edge proximity (0-100) held while orbiting — how bright the idle glow sits. */
  idleProximity?: number;
  /** Offset outline peeking out behind the plate. */
  offsetFrame?: boolean;
  offsetShift?: number;
  colors?: string[];
  fillOpacity?: number;
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 14,
  glowColor = "172 66 64",
  backgroundColor = "#1e1b4b",
  borderRadius = 0,
  glowRadius = 52,
  glowIntensity = 2.2,
  coneSpread = 12,
  animated = false,
  orbitDuration = 9,
  idleProximity = 62,
  offsetFrame = true,
  offsetShift = 14,
  colors = ["#5eead4", "#22d3ee", "#818cf8"],
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(110);
  const pointerRef = useRef(false);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const interactive = useMediaQuery("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const active = useElementActivity(cardRef, !reducedMotion);

  const readPointer = useCallback((el: HTMLElement, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;

    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1) * 100;

    let angle = 0;
    if (dx !== 0 || dy !== 0) {
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }
    return { proximity, angle };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Touch scrolling must never trigger geometry reads or repaint the masks.
    if (e.pointerType !== "mouse" || !active || !interactive) return;
    const card = cardRef.current;
    if (!card) return;
    const { proximity, angle } = readPointer(card, e.clientX, e.clientY);
    pointerRef.current = true;
    // Keep the orbit in sync so it resumes from wherever the cursor left off.
    angleRef.current = angle;
    card.style.setProperty("--edge-proximity", proximity.toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, [active, interactive, readPointer]);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = false;
    lastTsRef.current = 0;
    if (animated && active) cardRef.current?.style.setProperty("--edge-proximity", `${idleProximity}`);
  }, [animated, active, idleProximity]);

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !active || !interactive || !card) return;

    card.classList.add("sweep-active");
    card.style.setProperty("--edge-proximity", `${idleProximity}`);
    card.style.setProperty("--cursor-angle", `${angleRef.current}deg`);

    const step = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!pointerRef.current) {
        angleRef.current = (angleRef.current + (360 * dt) / (orbitDuration * 1000)) % 360;
        card.style.setProperty("--cursor-angle", `${angleRef.current.toFixed(2)}deg`);
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
      pointerRef.current = false;
      card.classList.remove("sweep-active");
    };
  }, [animated, active, interactive, orbitDuration, idleProximity]);

  return (
    <div
      className={`border-glow-wrap ${className}`}
      data-effects={reducedMotion ? "static" : interactive ? "full" : "compact"}
      data-animate={active && animated ? "true" : "false"}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        "--offset-shift": `${offsetShift}px`,
        "--orbit-duration": `${orbitDuration}s`,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      } as React.CSSProperties}
    >
      {offsetFrame ? <span className="border-glow-offset" aria-hidden="true" /> : null}

      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        className="border-glow-card"
      >
        <span className="edge-light" aria-hidden="true" />
        <span className="border-glow-trails" aria-hidden="true"><i /><i /><i /><i /></span>
        <div className="border-glow-inner">{children}</div>
      </div>
    </div>
  );
}
