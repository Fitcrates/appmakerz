"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useInView } from "framer-motion";

interface BurnSpotlightTextProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  glowSize?: number;
  baseDelay?: number;
  charDelay?: number;
  burnDuration?: number;
  activateOnMount?: boolean;
}

// ============================================
// CONFIGURATION - ADJUST THESE VALUES
// ============================================
const GLOW_COLOR = "#5eead4"; // teal-300
const CENTER_OPACITY = 1;
const MID_OPACITY = 0.8;
const MID_POSITION = 60;
// ============================================

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractTextContent(node.props.children);
  }

  return "";
}

// Individual character with burn animation
const BurnChar: React.FC<{
  char: string;
  delay: number;
  burnDuration: number;
  isSpace?: boolean;
  onRevealed?: () => void;
  isActive: boolean;
}> = ({ char, delay, burnDuration, isSpace, onRevealed, isActive }) => {
  const [state, setState] = useState<"hidden" | "burning" | "revealed">("hidden");

  useEffect(() => {
    if (!isActive) return;

    setState("hidden");
    const burnTimer = setTimeout(() => setState("burning"), delay);
    const revealTimer = setTimeout(() => {
      setState("revealed");
      onRevealed?.();
    }, delay + burnDuration);
    return () => {
      clearTimeout(burnTimer);
      clearTimeout(revealTimer);
    };
  }, [delay, burnDuration, onRevealed, isActive]);

  if (isSpace) return <span> </span>;
  if (char === "\n") return <br />;

  return (
    <span className="relative inline">
      <span
        className={`relative transition-all duration-200 ${
          state === "hidden"
            ? "opacity-0 blur-sm"
            : state === "burning"
              ? "opacity-100 text-teal-300 blur-[1px]"
              : "opacity-100 text-white/90 blur-0"
        }`}
        style={
          state === "burning"
            ? { textShadow: `0 0 12px ${GLOW_COLOR}, 0 0 24px ${GLOW_COLOR}` }
            : undefined
        }
      >
        {char}
      </span>

      {state === "burning" && (
        <>
          <span className="absolute -top-1 left-1/2 w-1 h-1 bg-teal-300 rounded-full animate-ping" />
          <span
            className="absolute -bottom-1 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-ping"
            style={{ animationDelay: "50ms" }}
          />
          <span
            className="absolute top-0 -right-1 w-0.5 h-0.5 bg-teal-200 rounded-full animate-ping"
            style={{ animationDelay: "100ms" }}
          />
        </>
      )}
    </span>
  );
};

const BurnSpotlightText: React.FC<BurnSpotlightTextProps> = ({
  children,
  text,
  className = "",
  as: Component = "span",
  glowSize = 120,
  baseDelay = 0,
  charDelay = 40,
  burnDuration = 250,
  activateOnMount = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [burnComplete, setBurnComplete] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasActivated, setHasActivated] = useState(activateOnMount);
  const revealedCount = useRef(0);
  const textContent = text ?? extractTextContent(children);
  const totalChars = textContent.replace(/\s/g, "").length;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    revealedCount.current = 0;
    setBurnComplete(false);
  }, [textContent]);

  useEffect(() => {
    if (isInView) {
      setHasActivated(true);
    }
  }, [isInView]);

  const handleCharRevealed = useCallback(() => {
    revealedCount.current += 1;
    if (revealedCount.current >= totalChars) {
      setTimeout(() => setBurnComplete(true), 400);
    }
  }, [totalChars]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !burnComplete) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [burnComplete],
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  const maskGradient = `radial-gradient(circle ${glowSize}px at calc(${mousePos.x}px + 24px) calc(${mousePos.y}px + 24px), rgba(0,0,0,${CENTER_OPACITY}) 0%, rgba(0,0,0,${MID_OPACITY}) ${MID_POSITION}%, rgba(0,0,0,0) 100%)`;
  const glowStyle = burnComplete
    ? ({
        '--spotlight-mask': maskGradient,
        '--spotlight-color': GLOW_COLOR,
        '--spotlight-blur': `${Math.max(10, Math.round(glowSize * 0.18))}px`,
      } as React.CSSProperties)
    : undefined;

  if (!hasMounted) {
    return (
      <div
        ref={containerRef}
        className="relative cursor-default inline-block w-full"
        style={{ isolation: "isolate", overflowWrap: "break-word" }}
      >
        <Component className={className}>{textContent}</Component>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative cursor-default inline-block w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ isolation: "isolate", overflowWrap: "break-word" }}
    >
      {/* Base text layer - character by character burn animation */}
      <Component
        className={`${burnComplete ? "spotlight-text-single" : ""} ${className}`}
        style={glowStyle}
        data-spotlight-text={burnComplete ? textContent : undefined}
      >
        {textContent.split("").map((char: string, i: number) => (
          <BurnChar
            key={i}
            char={char}
            delay={baseDelay + i * charDelay}
            burnDuration={burnDuration}
            isSpace={char === " "}
            onRevealed={char !== " " ? handleCharRevealed : undefined}
            isActive={hasActivated}
          />
        ))}
      </Component>
    </div>
  );
};

export default BurnSpotlightText;
