import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDownRight, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import * as THREE from "three";

// TypeScript declaration for deviceMemory API
interface NavigatorDeviceMemory extends Navigator {
  deviceMemory?: number;
}

// TypeScript interfaces
interface NebulaElementProps {
  position: string;
  animationClass: string;
  colorFrom: string;
  colorTo: string;
  borderRadius: string;
  blendMode: string;
  brightness: string;
  blurRadius: string;
  lowPowerMode: string | boolean;
  isLoaded: boolean;
  priority?: boolean;
}

interface ShootingStar {
  mesh: THREE.Line;
  material: THREE.LineBasicMaterial;
  geometry: THREE.BufferGeometry;
  start: THREE.Vector3;
  end: THREE.Vector3;
  progress: number;
  createdAt: number;
  duration: number;
}

interface ThreeObjects {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  stars: THREE.Points | null;
  material: THREE.ShaderMaterial | null;
  shootingStars: ShootingStar[];
  animationFrameId: number | null;
}

// Optimized Nebula Element Component
const NebulaElement: React.FC<NebulaElementProps> = ({
  position,
  animationClass,
  colorFrom,
  colorTo,
  borderRadius,
  blendMode,
  brightness,
  blurRadius,
  lowPowerMode,
  isLoaded,
  priority = false,
}) => {
  // Skip rendering entirely on extreme low-power devices for non-priority elements
  if (lowPowerMode === "extreme" && !priority) return null;

  return (
    <div
      className={`absolute ${position} origin-center ${
        isLoaded ? animationClass : ""
      } rounded-[${borderRadius}] bg-gradient-to-br from-${colorFrom} to-${colorTo} brightness-${brightness} mix-blend-${blendMode}`}
      style={{
        willChange: "transform",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        filter: `blur(${blurRadius})`,
        contain: "paint",
        contentVisibility: lowPowerMode ? "auto" : "visible",
        animationTimeline: lowPowerMode ? "scroll" : "auto",
      }}
    />
  );
};

const Hero: React.FC = () => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language].hero;
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lowPowerMode, setLowPowerMode] = useState<"extreme" | "moderate" | false>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Store Three.js objects for proper cleanup
  const threeObjects = useRef<ThreeObjects>({
    scene: null,
    camera: null,
    renderer: null,
    stars: null,
    material: null,
    shootingStars: [],
    animationFrameId: null,
  });

  // Initialize audio with proper cleanup
  useEffect(() => {
    // Create audio element
    const audio = new Audio("/media/orion-nebula.mp3");
    audio.loop = true;
    audioRef.current = audio;

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle sound toggle with error handling
  const toggleSound = useCallback(() => {
    if (!audioRef.current) return;

    if (isSoundPlaying) {
      audioRef.current.pause();
    } else {
      // Play with a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio play failed:", error);
        });
      }
    }

    setIsSoundPlaying(!isSoundPlaying);
  }, [isSoundPlaying]);

  // Set up the Three.js starry background with proper cleanup
  useEffect(() => {
    // Enhanced device capability detection
    const navigator = window.navigator as NavigatorDeviceMemory;
    
    const isLowPower =
      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
      (navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency < 4) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Detect extreme low power (more aggressive throttling)
    const isExtremeLowPower =
      (navigator.deviceMemory && navigator.deviceMemory < 2) ||
      (navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency < 2) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const devicePowerMode = isExtremeLowPower
      ? "extreme" as const
      : isLowPower
      ? "moderate" as const
      : false;
      
    setLowPowerMode(devicePowerMode);

    // Reference to current value of threeObjects to avoid stale closures
    const threeRef = threeObjects.current;
    
    let lastShootingStarTime = 0;
    
    // Adjust shooting star interval based on device power
    const shootingStarInterval = devicePowerMode === "extreme" 
      ? 12 
      : devicePowerMode === "moderate" 
      ? 8 
      : 6;

    const clock = new THREE.Clock();

    // Create a shooting star with improved memory management
    const createShootingStar = (): ShootingStar | null => {
      // Skip on extreme low power devices
      if (devicePowerMode === "extreme") return null;
      
      if (!threeRef.scene) return null;
      
      // Mathematical adjustments for natural motion
      const startPositions = [
        {
          start: new THREE.Vector3(
            5 + (Math.random() - 0.5) * 5,
            5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(-5, -5, -5),
        },
        {
          start: new THREE.Vector3(
            -5 + (Math.random() - 0.5) * 5,
            5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(5, -5, -5),
        },
        {
          start: new THREE.Vector3(
            5 + (Math.random() - 0.5) * 5,
            -5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(-5, 5, -5),
        },
        {
          start: new THREE.Vector3(
            -5 + (Math.random() - 0.5) * 5,
            -5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(5, 5, -5),
        },
      ];

      const { start, end } = startPositions[
        Math.floor(Math.random() * startPositions.length)
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints([start, start]);

      const starMaterial = new THREE.LineBasicMaterial({
        color: 0x29e7cd,
        transparent: true,
        opacity: 0.8,
      });

      const shootingStar = new THREE.Line(geometry, starMaterial);
      threeRef.scene.add(shootingStar);

      return {
        mesh: shootingStar,
        material: starMaterial,
        geometry: geometry,
        start,
        end,
        progress: 0,
        createdAt: clock.getElapsedTime(),
        duration: 1,
      };
    };

    // Initialize Three.js scene
    const init = () => {
      // Setup scene
      threeRef.scene = new THREE.Scene();
      threeRef.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      threeRef.camera.position.z = 5;

      // Calculate star count based on device power
      const getStarCount = () => {
        if (devicePowerMode === "extreme") return 800;
        if (devicePowerMode === "moderate") return 1500;
        return 2500;
      };

      const numStars = getStarCount();

      // Create renderer with proper settings
      threeRef.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      threeRef.renderer.setSize(window.innerWidth, window.innerHeight);
      threeRef.renderer.setPixelRatio(
        devicePowerMode ? 1 : window.devicePixelRatio
      );

      if (canvasRef.current) {
        canvasRef.current.appendChild(threeRef.renderer.domElement);
      }

      // Create star field with appropriate density
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];

      for (let i = 0; i < numStars; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        vertices.push(x, y, z);
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      // Optimized shader with lowered complexity for low power devices
      const getFragmentShader = () => {
        if (devicePowerMode === "extreme") {
          return `
            precision lowp float;
            varying vec3 vColor;
            
            void main() {
              vec3 baseColor = vec3(41.0 / 255.0, 231.0 / 255.0, 205.0 / 255.0);
              gl_FragColor = vec4(baseColor, 0.7);
            }
          `;
        }
        
        return `
          precision mediump float;
          uniform float time;
          varying vec3 vColor;
          
          void main() {
            float twinkle = mix(0.3, 1.0, abs(sin(time + vColor.x * 2.0 + vColor.y * 3.0)));
            vec3 baseColor = vec3(41.0 / 255.0, 231.0 / 255.0, 205.0 / 255.0);
            vec3 shiftColor = baseColor + 0.2 * abs(sin(time * 0.5));
            gl_FragColor = vec4(shiftColor, twinkle);
          }
        `;
      };

      threeRef.material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          precision mediump float;
          varying vec3 vColor;
          void main() {
            vColor = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = ${devicePowerMode === "extreme" ? "1.5" : "2.5"};
          }
        `,
        fragmentShader: getFragmentShader(),
        transparent: true,
      });

      threeRef.stars = new THREE.Points(geometry, threeRef.material);
      threeRef.scene.add(threeRef.stars);

      // Frame rate control
      let lastFrameTime = 0;
      const targetFPS = devicePowerMode === "extreme" 
        ? 20 
        : devicePowerMode === "moderate" 
        ? 30 
        : 60;
      const frameInterval = 1000 / targetFPS;

      // Animation loop with frame rate limiting
      const animate = (timestamp: number) => {
        threeRef.animationFrameId = requestAnimationFrame(animate);
        
        // Skip frames to maintain target FPS
        if (timestamp && lastFrameTime && timestamp - lastFrameTime < frameInterval) {
          return;
        }
        
        lastFrameTime = timestamp;
        
        if (threeRef.material) {
          threeRef.material.uniforms.time.value = clock.getElapsedTime();
        }
        
        // Slow down rotation for better performance
        const rotationSpeed = devicePowerMode === "extreme" 
          ? 0.0001 
          : devicePowerMode === "moderate" 
          ? 0.0003 
          : 0.0005;
          
        if (threeRef.stars) {
          threeRef.stars.rotation.y += rotationSpeed;
        }

        const elapsedTime = clock.getElapsedTime();

        // Reduce shooting star frequency on low power devices
        if (
          devicePowerMode !== "extreme" &&
          elapsedTime - lastShootingStarTime > shootingStarInterval
        ) {
          const newStar = createShootingStar();
          if (newStar) {
            threeRef.shootingStars.push(newStar);
          }
          lastShootingStarTime = elapsedTime;
        }

        // Properly clean up shooting stars to prevent memory leaks
        for (let i = threeRef.shootingStars.length - 1; i >= 0; i--) {
          const star = threeRef.shootingStars[i];
          const starElapsed = elapsedTime - star.createdAt;
          
          if (starElapsed > star.duration) {
            // Proper cleanup
            if (threeRef.scene) {
              threeRef.scene.remove(star.mesh);
            }
            star.material.dispose();
            star.geometry.dispose();
            threeRef.shootingStars.splice(i, 1);
            continue;
          }
          
          star.progress = starElapsed / star.duration;
          
          const positions = star.mesh.geometry.attributes.position.array as Float32Array;
          positions[0] = star.start.x;
          positions[1] = star.start.y;
          positions[2] = star.start.z;
          positions[3] = star.start.x + (star.end.x - star.start.x) * star.progress;
          positions[4] = star.start.y + (star.end.y - star.start.y) * star.progress;
          positions[5] = star.start.z + (star.end.z - star.start.z) * star.progress;
          star.mesh.geometry.attributes.position.needsUpdate = true;
          
          star.material.opacity = 1 - star.progress;
        }

        if (threeRef.renderer && threeRef.scene && threeRef.camera) {
          threeRef.renderer.render(threeRef.scene, threeRef.camera);
        }
      };

      animate(0);
    };

    init();

    // Handle window resize with throttling
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (threeRef.camera && threeRef.renderer) {
          threeRef.camera.aspect = window.innerWidth / window.innerHeight;
          threeRef.camera.updateProjectionMatrix();
          threeRef.renderer.setSize(window.innerWidth, window.innerHeight);
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Complete cleanup to prevent memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      
      // Cancel animation frame
      if (threeRef.animationFrameId !== null) {
        cancelAnimationFrame(threeRef.animationFrameId);
      }
      
      // Clean up Three.js objects
      if (threeRef.stars) {
        if (threeRef.stars.geometry) threeRef.stars.geometry.dispose();
        if (threeRef.scene) {
          threeRef.scene.remove(threeRef.stars);
        }
      }
      
      if (threeRef.material) threeRef.material.dispose();
      
      // Clean up all shooting stars
      threeRef.shootingStars.forEach((star) => {
        if (star.mesh) {
          if (threeRef.scene) {
            threeRef.scene.remove(star.mesh);
          }
          if (star.geometry) star.geometry.dispose();
          if (star.material) star.material.dispose();
        }
      });
      
      // Clean up renderer
      if (threeRef.renderer) {
        threeRef.renderer.dispose();
        threeRef.renderer.forceContextLoss();
        if (threeRef.renderer.domElement && threeRef.renderer.domElement.parentNode) {
          threeRef.renderer.domElement.parentNode.removeChild(threeRef.renderer.domElement);
        }
      }
      
      // Clear references
      threeRef.scene = null;
      threeRef.camera = null;
      threeRef.renderer = null;
      threeRef.stars = null;
      threeRef.material = null;
      threeRef.shootingStars = [];
    };
  }, []);

  // Handle CSS animation and gradient setup
  useEffect(() => {
    if (!gradientRef.current) return;

    // Define colors at root level for better performance
    document.documentElement.style.setProperty("--color-a", "#100b2b");
    document.documentElement.style.setProperty("--color-b", "#347d77");
    document.documentElement.style.setProperty("--color-c", "#f2545b");

    // Enhanced device capability detection
    const navigator = window.navigator as NavigatorDeviceMemory;
    
    const isLowPower =
      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
      (navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency < 4) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Detect extreme low power (more aggressive throttling)
    const isExtremeLowPower =
      (navigator.deviceMemory && navigator.deviceMemory < 2) ||
      (navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency < 2) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    setLowPowerMode(
      isExtremeLowPower ? "extreme" : isLowPower ? "moderate" : false
    );

    // Stagger loading to improve initial render
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    // Clean up
    return () => {
      clearTimeout(loadTimer);
      document.documentElement.style.removeProperty("--color-a");
      document.documentElement.style.removeProperty("--color-b");
      document.documentElement.style.removeProperty("--color-c");
    };
  }, []);

  // Determine blur radius based on device capability and screen size
  const getBlurRadius = useCallback(() => {
    if (lowPowerMode === "extreme") return "15px";
    if (lowPowerMode === "moderate") return "25px";
    return window.innerWidth < 768 ? "30px" : "40px";
  }, [lowPowerMode]);

  // Get appropriate animation class based on device capability
  const getAnimationClass = useCallback((defaultClass: string) => {
    if (!isLoaded) return "";
    if (lowPowerMode === "extreme") return "animate-nebula-minimal";
    if (lowPowerMode === "moderate") {
      if (defaultClass.includes("2")) return "animate-nebula-simple-2";
      if (defaultClass.includes("3")) return "animate-nebula-simple-3";
      return "animate-nebula-simple-4";
    }
    return defaultClass;
  }, [isLoaded, lowPowerMode]);

    
  return (
    <>
      {/* Nebula-like animated gradient background */}
      <div 
        ref={gradientRef}
        className="fixed top-0 left-0 w-full h-full z-[-2] 
          bg-gradient-to-tr from-[--color-a] via-[--color-b] to-[--color-c] duration-500 ease-in 
          [transition-property:_--color-a,_--color-b,_--color-c]"
        // Enhanced GPU acceleration with backface-visibility and perspective for deeper hardware acceleration
        style={{
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          WebkitBackfaceVisibility: "hidden",
          WebkitPerspective: "1000px",
          contain: "layout paint size",
          contentVisibility: "auto",
        }}
      >
        {/* Upper-left corner specific blob - covers the very corner */}
        <div className={`absolute left-[-15%] top-[-10%] h-[80%] w-[50%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-1") : ""
        } rounded-[40%_60%_50%_20%] bg-gradient-to-br from-[--color-a] to-[--color-a] 
          blur-[50px] brightness-10 mix-blend-overlay`} 
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* Upper-left blob - dark blue, larger area */}
        <div className={`absolute left-[0%] top-[0%] h-[100%] w-[90%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-3") : ""
        } rounded-[40%_80%_60%_70%] bg-gradient-to-br from-[--color-a] to-[--color-a]/90 
          blur-[50px] brightness-10 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* Secondary dark blue blob - additional coverage for left side */}
        <div className={`absolute left-[-10%] top-[10%] h-[20%] w-[60%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-3") : ""
        } rounded-[70%_60%_80%_50%] bg-gradient-to-tr from-[--color-a] to-[--color-a]/99
          blur-[50px] brightness-10 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* Lower areas - teal/cyan - MOVED MORE TO THE RIGHT */}
        <div className={`absolute left-[35%] top-[50%] h-[70%] w-[65%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-5") : ""
        } rounded-[40%_60%_50%_50%] bg-gradient-to-tr from-[--color-b]/40 to-[--color-b]/99 
          blur-[50px] brightness-120 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* MAIN Upper-right blob - coral/pink */}
        <div className={`absolute left-[40%] top-[-5%] h-[80%] w-[70%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-1") : ""
        } rounded-[40%_60%_30%_70%] bg-gradient-to-bl from-[--color-c] to-[--color-c]/90 
          blur-[45px] brightness-10 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* Secondary upper-right pink blob for more coverage */}
        <div className={`absolute left-[60%] top-[0%] h-[60%] w-[50%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-4") : ""
        } rounded-[50%_60%_40%_60%] bg-gradient-to-r from-[--color-c]/90 to-[--color-c] 
          blur-[55px] brightness-10 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* Far right pink extension */}
        <div className={`absolute left-[75%] top-[10%] h-[50%] w-[40%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-4") : ""
        } rounded-[30%_70%_40%_60%] bg-gradient-to-tl from-[--color-c]/90 to-[--color-c]/90 
          blur-[45px] brightness-100 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
  
        {/* Small transition blob - minimal color B influence */}
        <div className={`absolute left-[30%] top-[30%] h-[40%] w-[40%] origin-center ${
          isLoaded ? getAnimationClass("animate-nebula-3") : ""
        } rounded-[50%_60%_40%_60%] bg-gradient-to-tl from-[--color-a]/90 to-[--color-b]/99 
          blur-[55px] brightness-10 mix-blend-overlay`}
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            filter: `blur(${getBlurRadius()})`,
            contain: "paint",
            contentVisibility: lowPowerMode ? "auto" : "visible",
          }}
        />
      </div>
    
      {/* Three.js starry background */}
      <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-[-1]"></div>

      <section 
        id="hero" 
        className="min-h-screen h-screen w-full flex items-end pb-20 overflow-x-hidden"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end w-full">
            {/* Text Container */}
            <div className="hidden lg:flex flex-col items-start text-left">
              {[t.title.line1, t.title.line2, t.title.line3].map((line, index) => (
                <div
                  key={index}
                  className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta leading-none -mt-1"
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Desktop View: Subtext and Arrow */}
            <div className="hidden lg:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-12">
              {/* Text Column */}
              <div className="text-left flex flex-col leading-loose">
                <span className="text-lg sm:text-xl md:text-3xl text-white tracking-[-0.015em] font-jakarta font-extralight">
                  {t.subtitle.line1}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-white tracking-[-0.015em] font-jakarta font-extralight">
                  {t.subtitle.line2}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-white tracking-[-0.015em] font-jakarta font-extralight">
                  {t.subtitle.line3}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-white tracking-[-0.015em] font-jakarta font-extralight">
                  {t.subtitle.line4}
                </span>
              </div>

              {/* Arrow Section */}
              <div
                className="flex items-end md:ml-8 mt-6 md:mt-0 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-1000 flex items-center"
                >
                  {isHovered ? (
                    <ArrowDownRight
                      className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0 transition-transform duration-1000 transform rotate-360"
                      strokeWidth={0.7}
                      strokeLinecap="butt"
                    />
                  ) : (
                    <ArrowUpRight
                      className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0 transition-transform duration-1000"
                      strokeWidth={0.7}
                      strokeLinecap="butt"
                    />
                  )}
                </a>
              </div>
            </div>

            {/* Mobile View: Centered Text and Button */}
            <div className="lg:hidden flex flex-col items-center justify-center w-full h-full -translate-y-3/4">
              {/* Centered Text */}
              <div className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta leading-none mb-4 text-center">
                {[t.title.line1, t.title.line2, t.title.line3].map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
              {/* Centered Button */}
              <div className="GlowButton font-normal">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex items-center space-x-2 font-jakarta text-base relative z-10"
                >
                  <span>{t.learnMore}</span>
                  {isHovered ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
