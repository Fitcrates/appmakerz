import React, { useRef, useState, useCallback } from 'react';

interface SpotlightTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  glowSize?: number;
}

// ============================================
// SPOTLIGHT CONFIGURATION - ADJUST THESE VALUES
// ============================================
// Glow color - change to any color (hex, rgb, hsl)
const GLOW_COLOR = '#5eead4'; // teal-300

// Mask opacity at center (1 = fully visible, 0 = invisible)
const CENTER_OPACITY = 1;

// Mask opacity at middle of gradient (controls brightness spread)
// Higher = brighter/wider glow, Lower = dimmer/tighter glow
const MID_OPACITY = 0.8;

// Position of mid opacity in gradient (0-100%)
// Lower = tighter glow, Higher = wider spread
const MID_POSITION = 60;
// ============================================

const SpotlightText: React.FC<SpotlightTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span',
  glowSize = 120
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  // Build the mask gradient using configuration values
  const maskGradient = `radial-gradient(circle ${glowSize}px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,${CENTER_OPACITY}) 0%, rgba(0,0,0,${MID_OPACITY}) ${MID_POSITION}%, rgba(0,0,0,0) 100%)`;

  // For span elements, use inline-block to ensure proper positioning
  return (
    <span 
      ref={containerRef}
      className="relative cursor-default inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ isolation: 'isolate' }}
    >
      {/* Base text - adjust opacity here (text-white/90 = 90% white) */}
      <Component className={`text-white/90 ${className}`}>
        {children}
      </Component>
      
      {/* Glow text layer - positioned to match base text exactly */}
      <Component 
        className={`absolute top-0 left-0 w-full h-full pointer-events-none select-none z-20 ${className}`}
        style={{
          color: GLOW_COLOR,
          WebkitMaskImage: maskGradient,
          maskImage: maskGradient,
          // Ensure identical text rendering
          textRendering: 'inherit',
          WebkitFontSmoothing: 'inherit',
          MozOsxFontSmoothing: 'inherit',
        }}
        aria-hidden="true"
      >
        {children}
      </Component>
    </span>
  );
};

export default SpotlightText;
