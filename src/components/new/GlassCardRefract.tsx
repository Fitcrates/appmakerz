"use client";

import { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./GlassCardRefract.module.css";

/** Extra turn the pointer adds, in degrees at the far edges of the card. */
const POINTER_RY = 2.5;
/** Extra pitch the pointer adds, in degrees. */
const POINTER_RX = 2;
/** Must match the pane's border-radius in the stylesheet. */
const RADIUS = 24;
/** Width of the curved rim that bends light, in CSS pixels. */
const BEZEL = 22;
/** Largest shift of the backdrop at the very edge, in CSS pixels. */
const REFRACTION = 26;
/** Extra bend per channel: blue refracts more than red, which splits the rim. */
const DISPERSION = [1, 1.1, 1.2];
/** Keeps one colour channel of each displaced copy; the three sum back to white. */
const CHANNELS = [
  "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
];

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
};

/**
 * Builds a displacement map for a rounded rectangle. Red and green encode the
 * x and y shift around 128. Only the rim carries a shift, and it points inward,
 * so the backdrop near the edge is pulled from under the card like a thick
 * convex lip, while the middle of the pane stays flat and readable.
 */
function buildMap(w: number, h: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const hw = w / 2;
  const hh = h / 2;
  const r = Math.min(RADIUS, hw, hh);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const qx = Math.abs(px) - (hw - r);
      const qy = Math.abs(py) - (hh - r);

      let nx = 0;
      let ny = 0;
      let dist: number;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        dist = r - len;
        nx = (qx / len) * Math.sign(px);
        ny = (qy / len) * Math.sign(py);
      } else if (qx > qy) {
        dist = r - qx;
        nx = Math.sign(px);
      } else {
        dist = r - qy;
        ny = Math.sign(py);
      }

      // Steepest at the silhouette, flat once the rim meets the face.
      const t = dist < BEZEL ? 1 - Math.max(0, dist) / BEZEL : 0;
      const m = t * t * (3 - 2 * t) * t;

      const i = (y * w + x) * 4;
      img.data[i] = 128 - nx * m * 127;
      img.data[i + 1] = 128 - ny * m * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

/** How far the slab extrudes behind its face, in CSS pixels. */
const DEPTH = 9;
/** Room around the card for the wall's light to bloom into. */
const PAD = 48;

type SideWallProps = { id: string; w: number; h: number; dx: number };

/**
 * The slab's thickness: the face's silhouette swept back by the depth, minus
 * the face itself, so only the exposed side and bottom walls are painted and
 * nothing sits behind the clear front. Light travels inside that wall and
 * scatters out of it at a few hot spots; their bloom is kept off the face.
 */
const SideWall: React.FC<SideWallProps> = ({ id, w, h, dx }) => {
  const dy = DEPTH;
  const side = dx < 0 ? 0 : w;
  const r = Math.min(RADIUS, w / 2, h / 2);
  const face = <rect x="0" y="0" width={w} height={h} rx={r} />;
  const spots = (
    <>
      <ellipse cx={side + dx * 0.5} cy={h + dy * 0.5} rx="30" ry="28" fill={`url(#${id}-hot)`} />
      <ellipse cx={side + dx * 0.5} cy={h * 0.38} rx="16" ry="58" fill={`url(#${id}-hot)`} />
      <ellipse cx={dx < 0 ? w * 0.64 : w * 0.36} cy={h + dy * 0.5} rx="80" ry="14" fill={`url(#${id}-hot)`} />
    </>
  );

  return (
    <svg
      className={styles.wall}
      style={{ left: -PAD, top: -PAD }}
      width={w + PAD * 2}
      height={h + PAD * 2}
      viewBox={`${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={`${id}-wall`} maskUnits="userSpaceOnUse" x={-PAD} y={-PAD} width={w + PAD * 2} height={h + PAD * 2}>
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <rect key={k} x={dx * k} y={dy * k} width={w} height={h} rx={r} fill="#fff" />
          ))}
          <rect x="0" y="0" width={w} height={h} rx={r} fill="#000" />
        </mask>
        <mask id={`${id}-out`} maskUnits="userSpaceOnUse" x={-PAD} y={-PAD} width={w + PAD * 2} height={h + PAD * 2}>
          <rect x={-PAD} y={-PAD} width={w + PAD * 2} height={h + PAD * 2} fill="#fff" />
          <g fill="#000">{face}</g>
        </mask>
        <linearGradient id={`${id}-base`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={h + dy}>
          <stop offset="0" stopColor="#67e8f9" stopOpacity="0.28" />
          <stop offset="0.7" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="1" stopColor="#a5b4fc" stopOpacity="0.7" />
        </linearGradient>
        {/* White at the core, then the spectrum it splits into. */}
        <radialGradient id={`${id}-hot`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.22" stopColor="#cffafe" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#67e8f9" stopOpacity="0.6" />
          <stop offset="0.75" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <g mask={`url(#${id}-out)`} opacity="0.55">
        <g filter={`url(#${id}-bloom)`}>{spots}</g>
      </g>
      <g mask={`url(#${id}-wall)`}>
        <rect x={-PAD} y={-PAD} width={w + PAD * 2} height={h + PAD * 2} fill={`url(#${id}-base)`} />
        {spots}
      </g>
    </svg>
  );
};

/**
 * Experimental sibling of GlassCard. The pane samples the page through an SVG
 * filter that really displaces the backdrop along the rim and splits it into
 * three channels, instead of painting light bands over an opaque face.
 *
 * SVG references in backdrop-filter only render in Chromium, so other engines
 * get the same clear pane with a plain frost.
 */
const GlassCardRefract: React.FC<GlassCardProps> = ({
  children,
  className = "",
  contentClassName = "",
  rotateY = 0,
  rotateX = 0,
  rotateZ = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);
  const filterId = `glass-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [box, setBox] = useState<{ w: number; h: number; map: string | null } | null>(null);
  const lens = box?.map ? { ...box, map: box.map } : null;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    const chromium = !!brands?.some((b) => b.brand === "Chromium");

    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-transparency: no-preference)");
    const update = () => {
      // Layout size, not the rect: the card's 3D turn must not skew the shapes.
      const w = pane.offsetWidth;
      const h = pane.offsetHeight;
      if (!w || !h) return;
      const refract = chromium && media.matches;
      setBox((prev) =>
        prev && prev.w === w && prev.h === h && !!prev.map === refract
          ? prev
          : { w, h, map: refract ? buildMap(w, h) : null },
      );
    };

    const observer = new ResizeObserver(update);
    observer.observe(pane);
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  const handleEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const el = ref.current;
    if (!el) return;
    rect.current = el.getBoundingClientRect();
    el.style.setProperty("--glass-active", "1");
  }, []);

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    const r = rect.current;
    if (!el || !r || frame.current) return;

    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const x = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      const y = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--pointer-ry", `${((x - 0.5) * POINTER_RY).toFixed(2)}deg`);
      el.style.setProperty("--pointer-rx", `${(-(y - 0.5) * POINTER_RX).toFixed(2)}deg`);
    });
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    rect.current = null;
    el.style.setProperty("--glass-active", "0");
    el.style.setProperty("--pointer-ry", "0deg");
    el.style.setProperty("--pointer-rx", "0deg");
  }, []);

  // The slab is extruded away from the copy, so its lit side wall shows on
  // the outer side of each column and along the bottom.
  const depthX = rotateY > 0 ? -DEPTH : DEPTH;

  return (
    <div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      className={`${styles.card} group`}
      data-refract={lens ? "" : undefined}
      style={
        {
          "--base-ry": `${rotateY}deg`,
          "--base-rx": `${rotateX}deg`,
          "--base-rz": `${rotateZ}deg`,
          "--light-x": rotateY > 0 ? "0%" : "100%",
          "--lens": lens ? `url(#${filterId})` : undefined,
        } as React.CSSProperties
      }
    >
      {lens && (
        <svg className={styles.defs} width="0" height="0" aria-hidden="true" focusable="false">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={lens.w}
            height={lens.h}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={lens.map} x="0" y="0" width={lens.w} height={lens.h} preserveAspectRatio="none" result="map" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="frost" />
            {DISPERSION.map((k, i) => (
              // Fragments, not <g>: filter primitives must be direct children.
              <Fragment key={i}>
                <feDisplacementMap
                  in="frost"
                  in2="map"
                  scale={REFRACTION * k}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result={`d${i}`}
                />
                <feColorMatrix
                  in={`d${i}`}
                  type="matrix"
                  values={CHANNELS[i]}
                  result={`c${i}`}
                />
              </Fragment>
            ))}
            <feComposite in="c0" in2="c1" operator="arithmetic" k2="1" k3="1" result="c01" />
            <feComposite in="c01" in2="c2" operator="arithmetic" k2="1" k3="1" result="split" />
            <feColorMatrix in="split" type="saturate" values="1.35" />
          </filter>
        </svg>
      )}

      <span className={styles.edge} aria-hidden="true" style={{ "--depth-x": `${depthX}px` } as React.CSSProperties} />
      {box && <SideWall id={filterId} w={box.w} h={box.h} dx={depthX} />}

      <div ref={paneRef} className={`${styles.pane} ${className}`}>
        <span className={styles.sheen} aria-hidden="true" />
        <span className={styles.cursor} aria-hidden="true" />
        <div className={`${styles.content} ${contentClassName}`}>{children}</div>
      </div>
      <span className={styles.rim} aria-hidden="true" />
    </div>
  );
};

export default GlassCardRefract;
