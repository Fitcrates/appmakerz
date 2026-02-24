import React, { useEffect, useRef } from "react";

const TailwindConnectMap: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      
      // Animate all map elements
      const elements = container.querySelectorAll('.map-element');
      elements.forEach((el, index) => {
        if (el instanceof SVGElement) {
          setTimeout(() => {
            el.style.opacity = '1';
            // If the element has stroke-dashoffset, animate it
            if (el.style.strokeDashoffset) {
              el.style.strokeDashoffset = '0';
            }
          }, 100 + index * 10);
        }
      });
      
      // Animate the point of interest
      setTimeout(() => {
        const poi = container.querySelector('.map-poi');
        if (poi instanceof HTMLElement) {
          poi.style.opacity = '1';
          poi.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      }, 1200);
      
      // Animate pulse
      setTimeout(() => {
        const pulse = container.querySelector('.map-pulse');
        if (pulse instanceof HTMLElement) {
          pulse.style.opacity = '1';
        }
      }, 1500);
      
      // Animate beam
      setTimeout(() => {
        const beam = container.querySelector('.map-beam');
        if (beam instanceof HTMLElement) {
          beam.style.opacity = '0.7';
          beam.style.height = '150px';
        }
      }, 1800);
      
      // Animate label
      setTimeout(() => {
        const label = container.querySelector('.city-label');
        if (label instanceof HTMLElement) {
          label.style.opacity = '1';
          label.style.transform = 'translateY(0)';
        }
      }, 2000);
    }, []);
  
    return (
      <div 
        className="relative w-full h-[600px] overflow-hidden bg-gray-900" 
        ref={containerRef}
      >
        {/* Dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-black/90"></div>
        
        {/* 3D perspective container */}
        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              transform: 'rotateX(60deg) translateZ(0px)',
              transformOrigin: 'center bottom',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Circular map boundary */}
            <div className="relative w-4/5 h-4/5 rounded-full overflow-hidden border border-cyan-900/30 shadow-inner shadow-cyan-900/10">
              {/* Map SVG from Choram city */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div 
                  className="w-[120%] h-[120%] map-element"
                  style={{ 
                    opacity: 0, 
                    transition: 'opacity 1.5s ease-out',
                    background: `url(https://upload.wikimedia.org/wikipedia/commons/c/c1/Street_map_of_choram_city.svg) no-repeat center center`,
                    backgroundSize: 'cover',
                    filter: 'brightness(0.7) sepia(0.2) hue-rotate(160deg) saturate(0.8)'
                  }}
                ></div>
                
                {/* Overlay gradient for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 to-black/40 mix-blend-overlay"></div>
              </div>
              
              {/* Central point of interest */}
              <div 
                className="map-poi absolute left-1/2 top-1/2"
                style={{ 
                  opacity: 0,
                  transform: 'translate(-50%, -50%) scale(0.5)',
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                  zIndex: 20
                }}
              >
                {/* City label */}
                <div 
                  className="city-label absolute -top-16 left-1/2 -translate-x-1/2 text-cyan-300 font-bold text-lg tracking-wider"
                  style={{
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    textShadow: '0 0 10px rgba(56, 189, 248, 0.8)',
                    zIndex: 30
                  }}
                >
                  Wrocław
                </div>
                
                {/* Main dot */}
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-md shadow-cyan-500/50 relative z-20"></div>
                
                {/* Pulsating effect */}
                <div 
                  className="map-pulse absolute w-24 h-24 rounded-full bg-cyan-400/10 -top-12 -left-12 z-10 animate-pulse"
                  style={{ 
                    opacity: 0,
                    transition: 'opacity 1s ease-out',
                  }}
                ></div>
                
                {/* Beam */}
                <div 
                  className="map-beam absolute w-px bg-gradient-to-b from-cyan-400 to-transparent left-2 -bottom-3"
                  style={{ 
                    height: '0px',
                    opacity: 0,
                    transition: 'height 1.5s ease-out, opacity 1.5s ease-out',
                    zIndex: 5,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional atmosphere effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/30 to-transparent"></div>
        </div>
        
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
            }
            
            70% {
              transform: scale(1.2);
              box-shadow: 0 0 0 10px rgba(56, 189, 248, 0);
            }
            
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
            }
          }
        `}</style>
      </div>
    );
  };

export default TailwindConnectMap;
