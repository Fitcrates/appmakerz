"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useElementActivity } from '@/hooks/useElementActivity';
import styles from './CrackImage.module.css';

interface CrackImageProps {
  src: string;
  alt?: string;
  className?: string;
  gridSize?: number;
  cycleInterval?: number;
  transitionDuration?: number;
  bleed?: number;
}

interface TileOffset {
  imageX: number;
  imageY: number;
  scale: number;
  rotation: number;
}

const ALIGNED: TileOffset = { imageX: 0, imageY: 0, scale: 1, rotation: 0 };

function generateOffsets(count: number, intensity: number): TileOffset[] {
  return Array.from({ length: count }, () => ({
    imageX: (Math.random() - 0.5) * 2.5 * intensity,
    imageY: (Math.random() - 0.5) * 2.5 * intensity,
    scale: 1.18 + Math.random() * 0.20 * intensity,
    rotation: (Math.random() - 0.5) * 15 * intensity,
  }));
}

export default function CrackImage({
  src, alt = '', className = '', gridSize = 4, cycleInterval = 4000,
  transitionDuration = 1.5, bleed = 0.05,
}: CrackImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopMotion = useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true);
  const active = useElementActivity(containerRef, !reducedMotion);
  const [loadedImage, setLoadedImage] = useState<{ source: string; url: string } | null>(null);
  const [frame, setFrame] = useState<{ phase: number; offsets: TileOffset[] }>({ phase: 0, offsets: [] });
  const size = Math.max(1, Math.floor(gridSize));
  const count = size * size;
  const overscan = 1 + 2 * Math.max(0, bleed);

  // One update per phase, only while visible. CSS handles interpolation;
  // no dimension reads, window resize handler, or per-tile Motion instances.
  useEffect(() => {
    if (!active) return;
    let phase = 0;
    const timer = window.setInterval(() => {
      phase = (phase + 1) % 3;
      const offsets = phase ? generateOffsets(count, (phase === 1 ? 1 : 0.7) * (desktopMotion ? 1 : 0.35)) : [];
      setFrame({ phase, offsets: desktopMotion ? offsets : offsets.map(offset => ({ ...offset, scale: 1.08, rotation: 0 })) });
    }, Math.max(cycleInterval, transitionDuration * 1000));
    return () => window.clearInterval(timer);
  }, [active, count, cycleInterval, transitionDuration, desktopMotion]);

  return (
    <div
      ref={containerRef}
      className={`${styles.root} ${className}`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      data-animated={active ? 'true' : 'false'}
      data-detail={desktopMotion ? 'full' : 'compact'}
      data-warped={active && frame.phase !== 0 ? 'true' : 'false'}
      style={{
        '--grid-size': size,
        '--duration': `${Math.max(0, transitionDuration)}s`,
        '--overscan': overscan,
      } as CSSProperties}
    >
      {/* Tiles reuse the decoded responsive source rather than the full original. */}
      <div className={styles.base}>
        <Image src={src} alt="" fill sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw" className={styles.image}
          onLoad={event => setLoadedImage({ source: src, url: event.currentTarget.currentSrc })} />
      </div>

      {active && loadedImage?.source === src && Array.from({ length: count }, (_, id) => {
        const col = id % size;
        const row = Math.floor(id / size);
        const offset = frame.offsets[id] ?? ALIGNED;
        const extra = (overscan - 1) / 2;
        return (
          <div key={id} className={styles.tile} aria-hidden="true" style={{
            width: `${100 / size}%`, height: `${100 / size}%`,
            left: `${col * 100 / size}%`, top: `${row * 100 / size}%`,
          }}>
            <div className={styles.slice} style={{
              width: `${size * overscan * 100}%`, height: `${size * overscan * 100}%`,
              left: `${-(col + size * extra) * 100}%`, top: `${-(row + size * extra) * 100}%`,
              backgroundImage: `url(${JSON.stringify(loadedImage.url)})`,
              transformOrigin: `${(col + size * extra + 0.5) / (size * overscan) * 100}% ${(row + size * extra + 0.5) / (size * overscan) * 100}%`,
              transform: `translate(${offset.imageX * 8 / overscan}%, ${offset.imageY * 8 / overscan}%) scale(${offset.scale}) rotate(${offset.rotation}deg)`,
            }} />
          </div>
        );
      })}
      <div className={styles.grid} aria-hidden="true" />
    </div>
  );
}
