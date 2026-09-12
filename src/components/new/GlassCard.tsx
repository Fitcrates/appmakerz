"use client";

import { useCallback, useEffect, useRef } from "react";
import styles from "./GlassCard.module.css";

/** Extra turn the pointer adds, in degrees at the far edges of the card. */
const POINTER_RY = 2.5;
/** Extra pitch the pointer adds, in degrees. */
const POINTER_RX = 2;

type GlassCardProps = {
  children: React.ReactNode;
  /** Classes for the glass pane itself: padding, radius, layout box. */
  className?: string;
  /** Classes for the content layer that floats above the glass. */
  contentClassName?: string;
  /**
   * Resting turn of the sheet, in degrees. Positive turns the sheet to face
   * right, so cards left of the copy take positive values and cards right of
   * it negative ones: both then face the middle of the hero.
   */
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
};

/**
 * One filtered face over an offset back face. The exposed back face gives the
 * slab thickness without drawing a second frame inside the content area.
 *
 * The pointer only ever writes CSS custom properties on the wrapper node, so a
 * moving cursor never re-renders React and never touches the tree that the
 * hero's laser layer is already animating.
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  contentClassName = "",
  rotateY = 0,
  rotateX = 0,
  rotateZ = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handleEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const el = ref.current;
    if (!el) return;
    // Measured once per hover. Reading the rect on every move would force a
    // layout each frame, on top of the laser animation behind the card.
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
      const nx = x - 0.5;
      const ny = y - 0.5;

      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--pointer-ry", `${(nx * POINTER_RY).toFixed(2)}deg`);
      el.style.setProperty("--pointer-rx", `${(-ny * POINTER_RX).toFixed(2)}deg`);
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

  return (
    <div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      className={`${styles.card} group`}
      style={
        {
          "--base-ry": `${rotateY}deg`,
          "--base-rx": `${rotateX}deg`,
          "--base-rz": `${rotateZ}deg`,
          "--depth-x": rotateY > 0 ? "-7px" : "7px",
          "--light-x": rotateY > 0 ? "0%" : "100%",
        } as React.CSSProperties
      }
    >
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.back} aria-hidden="true" />

      <div className={`${styles.pane} ${className}`}>
        <span className={styles.cursor} aria-hidden="true" />
        <div className={`${styles.content} ${contentClassName}`}>{children}</div>
      </div>
      <span className={styles.rim} aria-hidden="true" />
    </div>
  );
};

export default GlassCard;
