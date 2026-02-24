import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Background image component
function BackgroundImage() {
  const { scene } = useThree();
  
  useEffect(() => {
    // Create and load the background texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/tinypng-cropedbackground-min.webp", (texture) => {
      // Create a large sphere for the background
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      // Flip the geometry inside out
      geometry.scale(-1, 1, 1);
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
      // Adjust the UV mapping for proper image display
      mesh.rotation.y = Math.PI;
    });
  }, [scene]);
  
  return null;
}

// Enhanced nebula cloud
function NebulaCloud() {
  const cloudRef = useRef<THREE.Group>(null);
  const cloudCount = 8;
  
  useFrame(({ clock }) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });
  
  const clouds = Array(cloudCount).fill(null).map((_, i) => {
    // Create random position within a sphere
    const radius = 6 + Math.random() * 4;
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    
    // Randomize cloud appearance
    const scale = 1.5 + Math.random() * 2;
    const opacity = 0.2 + Math.random() * 0.5;
    
    // Colors variation
    const colors = [
      "#4080ff", // Blue
      "#8040ff", // Purple
      "#ff40a0", // Pink
      "#40a0ff", // Light blue
      "#b0c0ff", // Soft blue
    ];
    
    const colorIndex = Math.floor(Math.random() * colors.length);
    
    return (
      <mesh 
        key={i} 
        position={[x, y, z]}
        scale={[scale, scale, scale]}
      >
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial 
          color={colors[colorIndex]}
          transparent={true}
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    );
  });
  
  return (
    <group ref={cloudRef}>
      {clouds}
    </group>
  );
}

// Enhanced star field with variable star sizes
function EnhancedStarField() {
  const starsRef = useRef<THREE.Points>(null);
  const [geometry] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const particleCount = 3000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Generate stars with varying distances, sizes and colors
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position (spherical distribution)
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Color (white to blue spectrum)
      const r = 0.7 + Math.random() * 0.3;
      const g = 0.7 + Math.random() * 0.3;
      const b = 0.9 + Math.random() * 0.1;
      
      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;
      
      // Random size
      sizes[i] = Math.random() * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geo;
  });
  
  const [shaderMaterial] = useState(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Star twinkling effect
          float twinkle = sin(time * 5.0 + position.x * 10.0 + position.y * 8.0 + position.z * 6.0) * 0.5 + 0.5;
          
          gl_PointSize = size * (300.0 / -mvPosition.z) * (0.3 + 0.7 * twinkle);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular points
          float r = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
          float intensity = 1.0 - smoothstep(0.0, 1.0, r);
          
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  });
  
  useFrame(({ clock }) => {
    if (starsRef.current && shaderMaterial.uniforms) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
      shaderMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  return (
    <points ref={starsRef}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}

// Central glowing orb with improved appearance
function GlowingOrb() {
  const orbRef = useRef<THREE.Group>(null);
  
  // Core of the orb
  const [coreMaterial] = useState(() => 
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("#80c0ff"),
      transparent: true,
      opacity: 0.8,
    })
  );
  
  // Outer glow
  const [glowMaterial] = useState(() => 
    new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color("#4080ff") },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          intensity *= 1.0 + 0.2 * sin(time * 2.0);
          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })
  );
  
  useFrame(({ clock }) => {
    if (orbRef.current) {
      // Pulsating effect
      const time = clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      orbRef.current.scale.set(scale, scale, scale);
      
      // Update glow shader
      if (glowMaterial.uniforms) {
        glowMaterial.uniforms.time.value = time;
      }
    }
  });
  
  return (
    <group ref={orbRef} position={[0, 0, -12]}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[3, 32, 32]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
    </group>
  );
}

// Dust particles
function DustParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const [geometry] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create a disk-like distribution for dust
      const radius = 5 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      
      positions[i3] = radius * Math.cos(angle);
      positions[i3 + 1] = (Math.random() - 0.5) * 5; // thin vertical spread
      positions[i3 + 2] = radius * Math.sin(angle) - 10; // offset to place near the orb
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  });
  
  const [material] = useState(() => 
    new THREE.PointsMaterial({
      size: 0.1,
      color: new THREE.Color("#80a0ff"),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </points>
  );
}

export default function CosmicScene() {
  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          pixelRatio: window.devicePixelRatio
        }}
      >
        <BackgroundImage />
        <EnhancedStarField />
        <NebulaCloud />
        <GlowingOrb />
        <DustParticles />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}