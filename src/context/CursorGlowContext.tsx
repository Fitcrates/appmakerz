import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorGlowContextType {
  cursorPos: CursorPosition;
}

const CursorGlowContext = createContext<CursorGlowContextType>({ cursorPos: { x: 0, y: 0 } });

export const useCursorGlow = () => useContext(CursorGlowContext);

export const CursorGlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Use RAF for smoother updates and less jitter
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      // Update CSS custom properties directly for spotlight
      document.documentElement.style.setProperty('--spotlight-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--spotlight-y', `${e.clientY}px`);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <CursorGlowContext.Provider value={{ cursorPos }}>
      {children}
    </CursorGlowContext.Provider>
  );
};

// Simplified hook - returns static 0 to avoid performance issues
// The spotlight effect is now handled purely via CSS
export const useProximityGlow = (_elementRef: React.RefObject<HTMLElement>, _maxDistance = 150) => {
  // Disabled to prevent jitter - using CSS-only spotlight instead
  return 0;
};

// Simplified - no dynamic glow styles to prevent jitter
export const getProximityGlowStyle = (_intensity: number) => ({});

export const getProximityBorderGlowStyle = (_intensity: number) => ({});
