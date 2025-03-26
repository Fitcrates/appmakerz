import React, { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import * as THREE from "three";

const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    let scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer, 
        stars: THREE.Points, 
        material: THREE.ShaderMaterial, 
        clock: THREE.Clock, 
        shootingStars: any[] = [];
    const numStars = 2500;

    const createShootingStar = (frequency: number) => {
      // Possible start positions (screen corners with randomization)
      const startPositions = [
        {
          start: new THREE.Vector3(
            5 + (Math.random() - 0.5) * 5,
            5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(-5, -5, -5)
        },
        {
          start: new THREE.Vector3(
            -5 + (Math.random() - 0.5) * 5,
            5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(5, -5, -5)
        },
        {
          start: new THREE.Vector3(
            5 + (Math.random() - 0.5) * 5,
            -5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(-5, 5, -5)
        },
        {
          start: new THREE.Vector3(
            -5 + (Math.random() - 0.5) * 5,
            -5 + (Math.random() - 0.5) * 5,
            -5
          ),
          end: new THREE.Vector3(5, 5, -5)
        }
      ];

      const { start, end } = startPositions[Math.floor(Math.random() * startPositions.length)];

      const geometry = new THREE.BufferGeometry().setFromPoints([
        start,
        start // Initially duplicate start point
      ]);

      const starMaterial = new THREE.LineBasicMaterial({ 
        color: 0x29e7cd, 
        transparent: true, 
        opacity: 0.8 
      });

      const shootingStar = new THREE.Line(geometry, starMaterial);
      scene.add(shootingStar);

      return {
        mesh: shootingStar,
        start,
        end,
        progress: 0,
        createdAt: clock.getElapsedTime(),
        duration: 1 // duration of shooting star animation
      };
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current?.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];

      for (let i = 0; i < numStars; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        vertices.push(x, y, z);
      }

      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          precision mediump float;
          varying vec3 vColor;
          void main() {
            vColor = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 2.5; // Star size
          }
        `,
        fragmentShader: `
          precision mediump float;
          uniform float time;
          varying vec3 vColor;
          
          void main() {
            float twinkle = mix(0.3, 1.0, abs(sin(time + vColor.x * 2.0 + vColor.y * 3.0)));
            vec3 baseColor = vec3(41.0 / 255.0, 231.0 / 255.0, 205.0 / 255.0);
            vec3 shiftColor = baseColor + 0.2 * abs(sin(time * 0.5));
            gl_FragColor = vec4(shiftColor, twinkle);
          }
        `,
        transparent: true,
      });

      stars = new THREE.Points(geometry, material);
      scene.add(stars);

      clock = new THREE.Clock();
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      
      material.uniforms.time.value = clock.getElapsedTime();
      stars.rotation.y += 0.0005;

      const currentTime = clock.getElapsedTime();

      // Control the frequency of shooting stars
      const shootingStarFrequency = 0.005; // Adjust this value to control frequency
      if (Math.random() < shootingStarFrequency) {
        shootingStars.push(createShootingStar(shootingStarFrequency));
      }

      shootingStars = shootingStars.filter(star => {
        const elapsed = currentTime - star.createdAt;
        if (elapsed > star.duration) {
          scene.remove(star.mesh);
          return false;
        }
        
        star.progress = elapsed / star.duration;
        
        const currentPos = new THREE.Vector3(
          star.start.x + (star.end.x - star.start.x) * star.progress,
          star.start.y + (star.end.y - star.start.y) * star.progress,
          star.start.z + (star.end.z - star.start.z) * star.progress
        );
        
        const positions = star.mesh.geometry.attributes.position.array;
        positions[0] = star.start.x;
        positions[1] = star.start.y;
        positions[2] = star.start.z;
        positions[3] = currentPos.x;
        positions[4] = currentPos.y;
        positions[5] = currentPos.z;
        star.mesh.geometry.attributes.position.needsUpdate = true;
        
        star.mesh.material.opacity = 1 - star.progress;
        
        return true;
      });

      renderer.render(scene, camera);
    };

    init();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []); 
  return (
    <>
      <div className="fixed-bg"></div>
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

      {/* Desktop View: Black Subtext and Arrow */}
      <div className="hidden lg:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-12">
        {/* Text Column */}
        <div className="text-left flex flex-col leading-loose">
          <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
            {t.subtitle.line1}
          </span>
          <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
            {t.subtitle.line2}
          </span>
          <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
            {t.subtitle.line3}
          </span>
          <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
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
