import { useEffect } from 'react';

const SpotlightCursor: React.FC = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update CSS variables for text spotlight effect (used by .spotlight-glow CSS)
      document.documentElement.style.setProperty('--spotlight-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--spotlight-y', `${e.clientY}px`);
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // No visible elements - this component only updates CSS variables
  // The spotlight effect is rendered via CSS mask on .spotlight-glow elements
  return null;
};

export default SpotlightCursor;
