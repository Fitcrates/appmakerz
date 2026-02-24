import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CrackImageProps {
  src: string;
  alt?: string;
  className?: string;
  gridSize?: number;
  cycleInterval?: number;
  transitionDuration?: number;
}

interface TileOffset {
  imageX: number;
  imageY: number;
  scale: number;
  rotation: number;
}

const CrackImage: React.FC<CrackImageProps> = ({
  src,
  className = '',
  gridSize = 4,
  cycleInterval = 4000,
  transitionDuration = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animationPhase, setAnimationPhase] = useState(0); // 0: aligned, 1: warped1, 2: warped2
  const [offsets, setOffsets] = useState<TileOffset[]>([]);
  const [offsets2, setOffsets2] = useState<TileOffset[]>([]);

  const totalTiles = gridSize * gridSize;

  // Generate random offsets for warping effect - image shifts within fixed tiles
  const generateOffsets = (intensity: number = 1) => {
    const newOffsets: TileOffset[] = [];
    for (let i = 0; i < totalTiles; i++) {
      newOffsets.push({
        imageX: (Math.random() - 0.5) * 100 * intensity, // -50 to 50 px image shift
        imageY: (Math.random() - 0.5) * 100 * intensity,
        scale: 0.85 + Math.random() * 0.3, // 0.85 to 1.15 scale
        rotation: (Math.random() - 0.5) * 6, // -3 to 3 degrees
      });
    }
    return newOffsets;
  };

  // Initialize offsets
  useEffect(() => {
    setOffsets(generateOffsets(1));
    setOffsets2(generateOffsets(0.7));
  }, [totalTiles]);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Cycle through phases: aligned -> warped1 -> warped2 -> aligned
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => {
        const nextPhase = (prev + 1) % 3;
        if (nextPhase === 1) {
          // Generate new random offsets for first warped state
          setOffsets(generateOffsets(1));
          setOffsets2(generateOffsets(0.7));
        }
        return nextPhase;
      });
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [cycleInterval]);

  // Get current offset based on animation phase
  const getCurrentOffset = (tileId: number): TileOffset => {
    if (animationPhase === 0) {
      return { imageX: 0, imageY: 0, scale: 1, rotation: 0 };
    } else if (animationPhase === 1) {
      return offsets[tileId] || { imageX: 0, imageY: 0, scale: 1, rotation: 0 };
    } else {
      return offsets2[tileId] || { imageX: 0, imageY: 0, scale: 1, rotation: 0 };
    }
  };

  const tileWidth = dimensions.width / gridSize;
  const tileHeight = dimensions.height / gridSize;

  // Generate tiles
  const tiles = useMemo(() => {
    const result = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        result.push({
          id: index,
          row,
          col,
          x: col * tileWidth,
          y: row * tileHeight,
        });
      }
    }
    return result;
  }, [gridSize, tileWidth, tileHeight]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-indigo-900/20" />
      
      {/* Tiles with glass-like warping - tiles stay fixed, image shifts within */}
      {tiles.map((tile) => {
        const offset = getCurrentOffset(tile.id);
        const isWarped = animationPhase !== 0;
        
        return (
          <div
            key={tile.id}
            className="absolute overflow-hidden"
            style={{
              width: tileWidth,
              height: tileHeight,
              left: tile.x,
              top: tile.y,
            }}
          >
            {/* Image slice - shifts within the fixed tile creating glass refraction effect */}
            <motion.div
              className="absolute"
              style={{
                width: dimensions.width * 1.3, // Larger to allow shifting without gaps
                height: dimensions.height * 1.3,
                left: -tile.x - dimensions.width * 0.15,
                top: -tile.y - dimensions.height * 0.15,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={false}
              animate={{
                x: offset.imageX,
                y: offset.imageY,
                scale: offset.scale,
                rotate: offset.rotation,
              }}
              transition={{
                duration: transitionDuration,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
            
            {/* Chromatic aberration effect when warped */}
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,100,0.15) 0%, transparent 50%, rgba(0,200,255,0.15) 100%)',
              }}
              animate={{
                opacity: isWarped ? 0.4 : 0,
              }}
              transition={{
                duration: transitionDuration * 0.5,
              }}
            />
          </div>
        );
      })}

      {/* Grid lines overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(94, 234, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(94, 234, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / gridSize}% ${100 / gridSize}%`,
        }}
        animate={{
          opacity: animationPhase === 0 ? 0.1 : 0.4,
        }}
        transition={{
          duration: transitionDuration * 0.5,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-teal-300/30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-teal-300/30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-teal-300/30" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-teal-300/30" />
    </div>
  );
};

export default CrackImage;
