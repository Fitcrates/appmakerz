"use client";

import React, { useRef, useState, useCallback } from 'react';

interface SpotlightTextProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  baseClassName?: string;
  glowClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  glowSize?: number;
  glowColor?: string;
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

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (React.isValidElement<{ children?: React.ReactNode; className?: string }>(node)) {
    if (node.type === 'br') {
      return '\n';
    }

    const className = node.props.className ?? '';
    const startsNewLine = className.split(/\s+/).includes('block');
    return `${startsNewLine ? '\n' : ''}${extractTextContent(node.props.children)}`;
  }

  return '';
}

const SpotlightText: React.FC<SpotlightTextProps> = ({ 
  children, 
  text,
  className = '', 
  baseClassName = '',
  as: Component = 'span',
  glowSize = 120,
  glowColor = GLOW_COLOR
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const spotlightElement =
      containerRef.current.classList.contains('spotlight-text-single')
        ? containerRef.current
        : containerRef.current.querySelector<HTMLElement>('.spotlight-text-single');
    const rect = (spotlightElement || containerRef.current).getBoundingClientRect();

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  const maskGradient = `radial-gradient(circle ${glowSize}px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,${CENTER_OPACITY}) 0%, rgba(0,0,0,${MID_OPACITY}) ${MID_POSITION}%, rgba(0,0,0,0) 100%)`;
  const content = text ?? children;
  const spotlightText = typeof text === 'string' ? text : extractTextContent(content);
  const glowStyle = {
    '--spotlight-mask': maskGradient,
    '--spotlight-color': glowColor,
    '--spotlight-blur': `${Math.max(10, Math.round(glowSize * 0.18))}px`,
  } as React.CSSProperties;

  if (content === undefined || content === null) {
    return null;
  }

  if (text === undefined && Component === 'span' && React.isValidElement<{ className?: string; style?: React.CSSProperties }>(children)) {
    const child = children;

    return (
      <span
        ref={containerRef as React.RefObject<HTMLSpanElement>}
        className="relative cursor-default inline-block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ isolation: 'isolate' }}
      >
        {React.cloneElement(child, {
          className: `spotlight-text-single ${className} ${baseClassName} ${child.props.className ?? ''}`,
          style: { ...child.props.style, ...glowStyle },
          'data-spotlight-text': spotlightText,
        } as any)}
      </span>
    );
  }

  const element = (
    <Component
      className={`text-white/90 spotlight-text-single ${className} ${baseClassName}`}
      style={glowStyle}
      data-spotlight-text={spotlightText}
    >
      {content}
    </Component>
  );

  if (Component === 'span') {
    return (
      <span
        ref={containerRef as React.RefObject<HTMLSpanElement>}
        className="relative cursor-default inline-block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ isolation: 'isolate' }}
      >
        {element}
      </span>
    );
  }

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="relative block cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ isolation: 'isolate' }}
    >
      {element}
    </div>
  );
};

export default SpotlightText;
