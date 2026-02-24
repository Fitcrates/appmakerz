import { useRef, useEffect, useState } from 'react';

interface TechItem {
  name: string;
}

const technologies: TechItem[] = [
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'TypeScript' },
  { name: 'Node.js' },
  { name: 'PostgreSQL' },
  { name: 'Tailwind CSS' },
  { name: 'Framer Motion' },
  { name: 'Three.js' },
  { name: 'Docker' },
  { name: 'AWS' },
  { name: 'Railway' },
  { name: 'Netlify' },
  { name: 'Vercel' },
  { name: 'Sanity' },
  { name: 'GraphQL' },
  { name: 'Prisma' },
  { name: 'Git' },
  { name: 'Figma' },
];

// Badge with corner decorations
const TechBadge: React.FC<{ tech: TechItem; isHighlighted: boolean }> = ({ tech, isHighlighted }) => {
  return (
    <div 
      className={`relative px-4 py-2 transition-all duration-300 flex-shrink-0 ${
        isHighlighted ? 'scale-110' : ''
      }`}
    >
      {/* Corner decorations */}
      <div className={`absolute top-0 left-0 w-2.5 h-2.5 border-t border-l transition-colors duration-300 ${
        isHighlighted ? 'border-teal-300' : 'border-white/20'
      }`} />
      <div className={`absolute top-0 right-0 w-2.5 h-2.5 border-t border-r transition-colors duration-300 ${
        isHighlighted ? 'border-teal-300' : 'border-white/20'
      }`} />
      <div className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l transition-colors duration-300 ${
        isHighlighted ? 'border-teal-300' : 'border-white/20'
      }`} />
      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r transition-colors duration-300 ${
        isHighlighted ? 'border-teal-300' : 'border-white/20'
      }`} />
      
      <span className={`font-jakarta text-sm whitespace-nowrap transition-colors duration-300 ${
        isHighlighted ? 'text-teal-300' : 'text-white/50'
      }`}>
        {tech.name}
      </span>
    </div>
  );
};

const TechStackNew: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set());

  // Update highlights based on center position
  useEffect(() => {
    const updateHighlights = () => {
      const container = scrollRef.current;
      if (!container) return;

      const centerX = window.innerWidth / 2;
      const badges = container.querySelectorAll('[data-badge]');
      const newHighlighted = new Set<number>();

      badges.forEach((badge, index) => {
        const badgeRect = badge.getBoundingClientRect();
        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const distance = Math.abs(badgeCenterX - centerX);
        
        if (distance < 120) {
          newHighlighted.add(index);
        }
      });

      setHighlightedIndices(newHighlighted);
    };

    const interval = setInterval(updateHighlights, 50);
    return () => clearInterval(interval);
  }, []);

  // Duplicate items multiple times for seamless infinite scroll (no gaps)
  const items = [...technologies, ...technologies, ...technologies, ...technologies];

  return (
    <section
      id="tech"
      className="relative py-2 sm:py-6 bg-indigo-950 overflow-hidden"
    >
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Center spotlight glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(94, 234, 212, 0.2) 0%, rgba(94, 234, 212, 0.08) 40%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      />

      {/* Infinite scrolling row */}
      <div className="relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex gap-8 animate-scroll-left"
          style={{
            width: 'max-content',
          }}
        >
          {items.map((tech, index) => (
            <div key={`${tech.name}-${index}`} data-badge>
              <TechBadge 
                tech={tech} 
                isHighlighted={highlightedIndices.has(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-indigo-950 via-indigo-950/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-indigo-950 via-indigo-950/90 to-transparent z-20 pointer-events-none" />

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TechStackNew;
