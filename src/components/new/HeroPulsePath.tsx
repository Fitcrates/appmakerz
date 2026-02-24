import React from 'react';
import { motion } from 'framer-motion';

// Laser beam component - travels along a path with glowing trail
const LaserBeam: React.FC<{
  path: string;
  delay?: number;
  duration?: number;
  repeatDelay?: number;
}> = ({ path, delay = 0, duration = 3, repeatDelay = 4 }) => {
  return (
    <svg
      className="absolute w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient that creates the laser beam effect - short glowing segment */}
        <linearGradient id={`laserGradient-${delay}`} gradientUnits="userSpaceOnUse">
          <motion.stop
            offset="0%"
            stopColor="#5eead4"
            stopOpacity="0"
            animate={{
              stopOpacity: [0, 0, 0],
            }}
          />
          <motion.stop
            offset="0%"
            stopColor="#5eead4"
            stopOpacity="0"
          />
          <motion.stop
            offset="50%"
            stopColor="#5eead4"
            stopOpacity="1"
          />
          <motion.stop
            offset="100%"
            stopColor="#5eead4"
            stopOpacity="0"
          />
        </linearGradient>

        {/* Strong glow filter for laser effect */}
        <filter id={`laserGlow-${delay}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The laser beam - animated stroke-dashoffset creates traveling effect */}
      <motion.path
        d={path}
        stroke="#5eead4"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#laserGlow-${delay})`}
        strokeDasharray="100 2000"
        initial={{ strokeDashoffset: 2100, opacity: 0 }}
        animate={{ 
          strokeDashoffset: -100,
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          strokeDashoffset: {
            duration: duration,
            repeat: Infinity,
            repeatDelay: repeatDelay,
            delay: delay,
            ease: "easeInOut",
          },
          opacity: {
            duration: duration,
            repeat: Infinity,
            repeatDelay: repeatDelay,
            delay: delay,
            times: [0, 0.1, 0.9, 1],
            ease: "easeInOut",
          },
        }}
      />

      {/* Brighter core of the laser */}
      <motion.path
        d={path}
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="60 2000"
        initial={{ strokeDashoffset: 2060, opacity: 0 }}
        animate={{ 
          strokeDashoffset: -60,
          opacity: [0, 0.8, 0.8, 0],
        }}
        transition={{
          strokeDashoffset: {
            duration: duration,
            repeat: Infinity,
            repeatDelay: repeatDelay,
            delay: delay,
            ease: "easeInOut",
          },
          opacity: {
            duration: duration,
            repeat: Infinity,
            repeatDelay: repeatDelay,
            delay: delay,
            times: [0, 0.1, 0.9, 1],
            ease: "easeInOut",
          },
        }}
      />
    </svg>
  );
};

const HeroPulsePath: React.FC = () => {
  // Circuit paths aligned with the hero image electrical lines
  // Using angular paths (L commands) to match the circuit board aesthetic
  const paths = [
    // Upper left circuit - starts from left, goes right with angular turns
    // Matches the pink circuit line from upper left going toward center
    "M -50 120 L 150 120 L 150 80 L 350 80 L 350 150 L 500 150 L 500 100 L 700 100 L 700 180 L 850 180",
    
    // Upper right circuit - starts from right, goes left with angular turns
    // Matches the pink circuit line from upper right going toward center
    "M 2020 100 L 1800 100 L 1800 60 L 1600 60 L 1600 140 L 1450 140 L 1450 90 L 1250 90 L 1250 160 L 1100 160",
    
    // Left side vertical circuit - drops down from upper left area
    "M 200 -50 L 200 100 L 280 100 L 280 250 L 200 250 L 200 380",
    
    // Right side vertical circuit - drops down from upper right area
    "M 1720 -50 L 1720 80 L 1640 80 L 1640 220 L 1720 220 L 1720 350",
    
    // Center descending circuit - from globe area down
    "M 960 200 L 960 300 L 1020 300 L 1020 400 L 960 400 L 960 500",
    
    // Lower left diagonal circuit
    "M -50 600 L 100 600 L 100 550 L 250 550 L 250 620 L 400 620",
    
    // Lower right diagonal circuit
    "M 2020 580 L 1850 580 L 1850 530 L 1700 530 L 1700 600 L 1550 600",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Multiple laser beams with staggered timing - aligned with image circuits */}
      {/* Upper circuits */}
      <LaserBeam path={paths[0]} delay={0} duration={2} repeatDelay={4} />
      <LaserBeam path={paths[1]} delay={1.5} duration={2} repeatDelay={5} />
      
      {/* Vertical circuits */}
      <LaserBeam path={paths[2]} delay={0.5} duration={1.5} repeatDelay={6} />
      <LaserBeam path={paths[3]} delay={2.5} duration={1.5} repeatDelay={6} />
      
      {/* Center circuit */}
      <LaserBeam path={paths[4]} delay={3} duration={1.8} repeatDelay={7} />
      
      {/* Lower circuits */}
      <LaserBeam path={paths[5]} delay={4} duration={1.5} repeatDelay={8} />
      <LaserBeam path={paths[6]} delay={5} duration={1.5} repeatDelay={8} />
    </div>
  );
};

export default HeroPulsePath;
