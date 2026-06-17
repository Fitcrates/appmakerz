'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import SpotlightText from '@/components/new/SpotlightText';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

interface PhilosophyTiltCardProps {
  title: string;
  desc: string;
  number: string;
  className?: string;
  containerHeight?: string;
  containerWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
}

export default function PhilosophyTiltCard({
  title,
  desc,
  number,
  className = '',
  containerHeight = '100%',
  containerWidth = '100%',
  rotateAmplitude = 7,
  scaleOnHover = 1.015,
}: PhilosophyTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
    setGlowPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleMouseEnter() {
    setIsHovered(true);
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: '1000px',
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full w-full"
      >
        <div
          className={`group relative z-10 flex min-h-[220px] h-full flex-col overflow-hidden border border-teal-300/15 p-7 shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors duration-500 sm:p-8 ${
            isHovered ? 'border-teal-300/45 shadow-[0_26px_82px_rgba(0,0,0,0.34)]' : ''
          }`}
          style={{ transform: 'translateZ(28px)' }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/35 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(360px circle at ${glowPosition.x}px ${glowPosition.y}px, rgba(94,234,212,0.11), transparent 42%)`,
            }}
          />

          <div className="relative z-10 mb-8 flex items-center gap-4">
            <span className="font-oxanium text-sm tracking-[0.28em] text-teal-300/70">
              {number}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-teal-300/25 to-transparent" />
          </div>

          <div className="relative z-10">
            <SpotlightText as="h3" className="font-oxanium text-2xl font-light text-white sm:text-3xl" glowSize={130}>
              {title}
            </SpotlightText>
            <SpotlightText as="p" className="mt-5 max-w-xl font-plex text-base font-light leading-relaxed text-white/62" glowSize={120}>
              {desc}
            </SpotlightText>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
