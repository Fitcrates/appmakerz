'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MotionValue, useTransform } from 'framer-motion';
import * as THREE from 'three';

// ============================================
// TYPES
// ============================================
interface MonolithProps {
  scrollProgress: MotionValue<number>;
}

interface MonolithMeshProps {
  progress: number;
}

// ============================================
// MONOLITH LAYER - Individual slab of the monolith
// ============================================
interface LayerProps {
  position: [number, number, number];
  targetY: number;
  progress: number;
  emissiveIntensity: number;
}

const MonolithLayer: React.FC<LayerProps> = ({ 
  position, 
  targetY, 
  progress, 
  emissiveIntensity 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Layer dimensions
  const width = 1.6;
  const height = 0.45;
  const depth = 0.8;
  
  // Smooth interpolation for layer separation
  const separationProgress = useMemo(() => {
    // Phase 2: layers start separating at 0.2-0.4
    const start = 0.2;
    const end = 0.4;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  }, [progress]);
  
  // Surface detail extrusion (Phase 4)
  const detailProgress = useMemo(() => {
    const start = 0.6;
    const end = 0.8;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  }, [progress]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Smooth Y position interpolation
    const currentY = meshRef.current.position.y;
    const newY = THREE.MathUtils.lerp(currentY, position[1] + targetY * separationProgress, 0.08);
    meshRef.current.position.y = newY;
    
    // Scale X slightly for surface detail effect
    const scaleX = 1 + detailProgress * 0.02;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scaleX, 0.1);
    
    // Update emissive intensity
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      materialRef.current.emissiveIntensity,
      emissiveIntensity,
      0.1
    );
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth, 8, 4, 4]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#0d0d12"
        roughness={0.6}
        metalness={0.2}
        emissive="#5eead4"
        emissiveIntensity={0}
      />
    </mesh>
  );
};

// ============================================
// CONNECTION LINE - Single line using native Three.js
// ============================================
interface SingleLineProps {
  start: [number, number, number];
  end: [number, number, number];
  opacity: number;
}

const SingleLine: React.FC<SingleLineProps> = ({ start, end, opacity }) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([...start, ...end]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);
  
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: '#5eead4',
      transparent: true,
      opacity: opacity,
    });
  }, [opacity]);

  return <primitive object={new THREE.Line(geometry, material)} />;
};

// ============================================
// CONNECTION LINES - Energy lines between layers
// ============================================
interface ConnectionLinesProps {
  progress: number;
  separationProgress: number;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ 
  progress, 
  separationProgress 
}) => {
  // Phase 3: lines appear at 0.4-0.6
  const lineOpacity = useMemo(() => {
    const start = 0.4;
    const end = 0.55;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  }, [progress]);

  // Calculate line positions based on separation
  const lineConfigs = useMemo(() => {
    const xPositions = [-0.3, 0, 0.3];
    const configs: Array<{ 
      start: [number, number, number]; 
      end: [number, number, number]; 
      key: string 
    }> = [];
    
    // Lines between bottom and middle layer
    xPositions.forEach((xPos, i) => {
      const y1 = -0.5 + 0.25 - separationProgress * 0.3;
      const y2 = 0 - 0.25;
      configs.push({
        start: [xPos, y1, 0.1],
        end: [xPos, y2, 0.1],
        key: `line-bottom-${i}`
      });
    });
    
    // Lines between middle and top layer
    xPositions.forEach((xPos, i) => {
      const y1 = 0 + 0.25;
      const y2 = 0.5 - 0.25 + separationProgress * 0.3;
      configs.push({
        start: [xPos, y1, 0.1],
        end: [xPos, y2, 0.1],
        key: `line-top-${i}`
      });
    });
    
    return configs;
  }, [separationProgress]);

  if (lineOpacity <= 0) return null;

  return (
    <group>
      {lineConfigs.map(({ start, end, key }) => (
        <SingleLine
          key={key}
          start={start}
          end={end}
          opacity={lineOpacity * 0.6}
        />
      ))}
    </group>
  );
};

// ============================================
// ENERGY PULSE - Traveling pulse along connections
// ============================================
interface EnergyPulseProps {
  progress: number;
  separationProgress: number;
}

const EnergyPulse: React.FC<EnergyPulseProps> = ({ progress, separationProgress }) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  
  // Only show pulse in Phase 3+
  const visible = progress > 0.45;
  
  // Pulse intensity increases in Phase 4
  const intensity = useMemo(() => {
    if (progress < 0.6) return 0.5;
    if (progress < 0.8) return 0.5 + (progress - 0.6) * 2.5; // 0.5 to 1.0
    return 1.0;
  }, [progress]);

  useFrame((_, delta) => {
    if (!pulseRef.current || !visible) return;
    
    timeRef.current += delta * 0.4;
    
    // Oscillate Y position
    const yRange = 0.8 + separationProgress * 0.4;
    const y = Math.sin(timeRef.current) * yRange;
    pulseRef.current.position.y = y;
    
    // Subtle X drift
    pulseRef.current.position.x = Math.sin(timeRef.current * 0.7) * 0.1;
  });

  if (!visible) return null;

  return (
    <mesh ref={pulseRef} position={[0, 0, 0.45]}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial 
        color="#5eead4" 
        transparent 
        opacity={intensity * 0.8}
      />
    </mesh>
  );
};

// ============================================
// MAIN MONOLITH MESH - The evolving object
// ============================================
const MonolithMesh: React.FC<MonolithMeshProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Layer configuration
  const layerPositions = [-0.5, 0, 0.5]; // Base Y positions
  const layerTargets = [-0.3, 0, 0.3]; // Separation targets
  
  // Calculate separation progress for connection lines
  const separationProgress = useMemo(() => {
    const start = 0.2;
    const end = 0.4;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  }, [progress]);
  
  // Emissive intensity per phase
  const emissiveIntensity = useMemo(() => {
    if (progress < 0.2) return 0; // Phase 1: no glow
    if (progress < 0.4) return (progress - 0.2) * 0.5; // Phase 2: subtle inner light
    if (progress < 0.6) return 0.1 + (progress - 0.4) * 0.25; // Phase 3: connection glow
    if (progress < 0.8) return 0.15 + (progress - 0.6) * 0.5; // Phase 4: increased glow
    return 0.25 - (progress - 0.8) * 0.1; // Phase 5: stabilize/calm
  }, [progress]);
  
  // Camera push-in effect (Phase 4-5)
  const cameraZ = useMemo(() => {
    if (progress < 0.6) return 0;
    return (progress - 0.6) * 0.3; // Subtle push in
  }, [progress]);
  
  // Rotation based on scroll
  const targetRotationY = useMemo(() => {
    // Max ±8 degrees = ±0.14 radians
    const baseRotation = (progress - 0.5) * 0.28;
    // Slow down in final phase
    if (progress > 0.8) {
      return baseRotation * (1 - (progress - 0.8) * 2);
    }
    return baseRotation;
  }, [progress]);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Smooth rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    
    // Subtle Z translate (parallax)
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      cameraZ,
      0.05
    );
    
    // Very subtle floating motion
    const time = Date.now() * 0.0005;
    groupRef.current.position.y = Math.sin(time) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Three layers of the monolith */}
      {layerPositions.map((yPos, index) => (
        <MonolithLayer
          key={index}
          position={[0, yPos, 0]}
          targetY={layerTargets[index]}
          progress={progress}
          emissiveIntensity={emissiveIntensity}
        />
      ))}
      
      {/* Connection lines between layers */}
      <ConnectionLines 
        progress={progress}
        separationProgress={separationProgress}
      />
      
      {/* Energy pulse */}
      <EnergyPulse 
        progress={progress}
        separationProgress={separationProgress}
      />
    </group>
  );
};

// ============================================
// SCENE SETUP
// ============================================
interface SceneProps {
  progress: number;
}

const Scene: React.FC<SceneProps> = ({ progress }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[2, 4, 2]}
        intensity={0.4}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight
        position={[-2, 2, -2]}
        intensity={0.15}
        color="#5eead4"
      />
      
      {/* The monolith */}
      <MonolithMesh progress={progress} />
    </>
  );
};

// ============================================
// MAIN COMPONENT - Canvas wrapper
// ============================================
const Monolith3D: React.FC<MonolithProps> = ({ scrollProgress }) => {
  // Convert MotionValue to regular number for R3F
  const progressValue = useTransform(scrollProgress, [0, 1], [0, 1]);
  
  // Use state to track progress for R3F
  const progressRef = useRef(0);
  
  // Subscribe to motion value changes
  progressValue.on('change', (v) => {
    progressRef.current = v;
  });

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, 4], 
          fov: 35,
          near: 0.1,
          far: 100
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <SceneWithProgress progressRef={progressRef} />
      </Canvas>
    </div>
  );
};

// Helper component to access progress inside Canvas
const SceneWithProgress: React.FC<{ progressRef: React.MutableRefObject<number> }> = ({ progressRef }) => {
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    setProgress(progressRef.current);
  });
  
  return <Scene progress={progress} />;
};

export default Monolith3D;
