import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface BurnSpotlightTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  glowSize?: number;
  baseDelay?: number;
  charDelay?: number;
  burnDuration?: number;
}

// ============================================
// CONFIGURATION - ADJUST THESE VALUES
// ============================================
const GLOW_COLOR = '#5eead4'; // teal-300
const CENTER_OPACITY = 1;
const MID_OPACITY = 0.8;
const MID_POSITION = 60;
// ============================================

// Individual character with burn animation
const BurnChar: React.FC<{ 
  char: string; 
  delay: number; 
  burnDuration: number;
  isSpace?: boolean;
  onRevealed?: () => void;
  isActive: boolean;
}> = ({ char, delay, burnDuration, isSpace, onRevealed, isActive }) => {
  const [state, setState] = useState<'hidden' | 'burning' | 'revealed'>('hidden');

  useEffect(() => {
    if (!isActive) return;
    
    const burnTimer = setTimeout(() => setState('burning'), delay);
    const revealTimer = setTimeout(() => {
      setState('revealed');
      onRevealed?.();
    }, delay + burnDuration);
    return () => {
      clearTimeout(burnTimer);
      clearTimeout(revealTimer);
    };
  }, [delay, burnDuration, onRevealed, isActive]);

  if (isSpace) return <span className="inline-block" style={{ width: '0.3em' }}>&nbsp;</span>;
  if (char === '\n') return <br />;

  return (
    <span className="relative inline">
      <span
        className={`relative transition-all duration-200 ${
          state === 'hidden' ? 'opacity-0 blur-sm' :
          state === 'burning' ? 'opacity-100 text-teal-300 blur-[1px]' :
          'opacity-100 text-white/90 blur-0'
        }`}
      >
        {char}
      </span>
      
      {state === 'burning' && (
        <>
          <span className="absolute inset-0 text-teal-300 blur-md animate-pulse z-0">{char}</span>
          <span className="absolute inset-0 text-teal-400 blur-lg opacity-80 z-0">{char}</span>
          <span className="absolute -top-1 left-1/2 w-1 h-1 bg-teal-300 rounded-full animate-ping" />
          <span className="absolute -bottom-1 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '50ms' }} />
          <span className="absolute top-0 -right-1 w-0.5 h-0.5 bg-teal-200 rounded-full animate-ping" style={{ animationDelay: '100ms' }} />
        </>
      )}
    </span>
  );
};

const BurnSpotlightText: React.FC<BurnSpotlightTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span',
  glowSize = 120,
  baseDelay = 0,
  charDelay = 40,
  burnDuration = 250
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [burnComplete, setBurnComplete] = useState(false);
  const revealedCount = useRef(0);
  const totalChars = children.replace(/\s/g, '').length;

  const handleCharRevealed = useCallback(() => {
    revealedCount.current += 1;
    if (revealedCount.current >= totalChars) {
      setTimeout(() => setBurnComplete(true), 400);
    }
  }, [totalChars]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !burnComplete) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [burnComplete]);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  const maskGradient = `radial-gradient(circle ${glowSize}px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,${CENTER_OPACITY}) 0%, rgba(0,0,0,${MID_OPACITY}) ${MID_POSITION}%, rgba(0,0,0,0) 100%)`;

  // Render characters with proper structure for both base and glow layers
  // Must match BurnChar structure exactly for alignment
  const renderChars = () => {
    return children.split('').map((char, i) => {
      if (char === ' ') return <span key={i} className="inline-block" style={{ width: '0.3em' }}>&nbsp;</span>;
      if (char === '\n') return <br key={i} />;
      return (
        <span key={i} className="relative inline">
          <span className="relative" style={{ color: GLOW_COLOR }}>
            {char}
          </span>
        </span>
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative cursor-default inline-block w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ isolation: 'isolate' }}
    >
      {/* Base text layer - character by character burn animation */}
      <Component className={`${className}`}>
        {children.split('').map((char, i) => (
          <BurnChar
            key={i}
            char={char}
            delay={baseDelay + i * charDelay}
            burnDuration={burnDuration}
            isSpace={char === ' '}
            onRevealed={char !== ' ' ? handleCharRevealed : undefined}
            isActive={isInView}
          />
        ))}
      </Component>
      
      {/* Glow layer - same character structure for proper alignment */}
      {burnComplete && (
        <Component 
          className={`absolute inset-0 pointer-events-none select-none z-20 ${className}`}
          style={{
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
          }}
          aria-hidden="true"
        >
          {renderChars()}
        </Component>
      )}
    </div>
  );
};

export default BurnSpotlightText;
