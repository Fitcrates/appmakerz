import React, { useEffect, useRef } from "react";

const TailwindConnectPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with glowing logo */}
      <header className="pt-20 pb-16 flex flex-col items-center">
        <div className="relative mb-2">
          <svg className="w-20 h-20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M25 15C20 15 17 18 15 24C17.5 20 20 19 23 20C24.5 20.5 25.5 22 27 23.5C29 26 31.5 29 37.5 29C42.5 29 45.5 26 47.5 20C45 24 42.5 25 39.5 24C38 23.5 37 22 35.5 20.5C33.5 18 31 15 25 15ZM12.5 29C7.5 29 4.5 32 2.5 38C5 34 7.5 33 10.5 34C12 34.5 13 36 14.5 37.5C16.5 40 19 43 25 43C30 43 33 40 35 34C32.5 38 30 39 27 38C25.5 37.5 24.5 36 23 34.5C21 32 18.5 29 12.5 29Z" 
              fill="url(#tailwind-glow)"
            />
            <defs>
              <radialGradient id="tailwind-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25 29) rotate(90) scale(25)">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 bg-cyan-500/50 blur-xl rounded-full"></div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-1">connect</h1>
        <div className="text-sm font-medium tracking-widest uppercase text-gray-400">
          June 20, 2023 • 6PM
        </div>
        <div className="text-xs uppercase tracking-widest text-gray-500">
          Cambridge • Ontario
        </div>
      </header>

      {/* Event Card */}
      <div className="max-w-sm mx-auto bg-gray-900/80 rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-800">
          <div>
            <div className="text-xs text-gray-400">Tapestry Hall</div>
            <div className="text-xs text-gray-500">74 Grand Ave S</div>
          </div>
          
          {/* Barcode */}
          <div className="w-24 h-12">
            <svg viewBox="0 0 96 48" className="w-full h-full">
              {[...Array(20)].map((_, i) => (
                <rect 
                  key={i} 
                  x={i * 5} 
                  y="0" 
                  width={Math.random() > 0.7 ? 3 : 1} 
                  height="48" 
                  fill="rgba(255,255,255,0.4)" 
                />
              ))}
            </svg>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-400">In-person</div>
            <div className="text-xs text-gray-500">150 guests</div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="max-w-md mx-auto mt-16 text-center px-4">
        <p className="text-xl font-medium text-gray-200">
          Come hang out with us for the night and see what we've been working on.
        </p>
        
        <button className="mt-6 px-6 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300 inline-flex items-center space-x-2 hover:border-cyan-700 transition-colors">
          <span>Connect 2023 is sold out</span>
        </button>
      </div>

      {/* 3D Grid Map with Pointer */}
      <div className="mt-20 h-[400px]">
        <TailwindConnectMap />
      </div>

      {/* Extra event information */}
      <div className="max-w-2xl mx-auto mt-16 px-4 pb-20">
        <h2 className="text-sm font-medium tracking-widest uppercase text-cyan-500 mb-4">Connect 2023</h2>
        <h3 className="text-2xl font-bold text-white mb-6">Be a part of the first official Tailwind CSS event.</h3>
        
        <p className="text-gray-400 mb-8">
          Come hang out with 150 fellow developers and designers to talk shop, enjoy a 
          few drinks, and get a preview of all the new stuff the Tailwind CSS team has been
          working on.
        </p>
        
        <div className="border-t border-gray-800 pt-6">
          <h4 className="font-medium text-white mb-2">Location</h4>
          <p className="text-gray-400">
            Tapestry Hall<br />
            74 Grand Avenue South, Cambridge, ON
          </p>
        </div>
      </div>
    </div>
  );
};

const TailwindConnectMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animation initialization
    const container = containerRef.current;
    if (!container) return;
    
    // Animate the grid lines to fade in
    const gridLines = container.querySelectorAll('.grid-line');
    gridLines.forEach((line, index) => {
      if (line instanceof HTMLElement) {
        setTimeout(() => {
          line.style.opacity = '1';
        }, 100 + index * 20); // Faster animation for lines
      }
    });
    
    // Animate the pointer to appear
    const pointer = container.querySelector('.pointer');
    if (pointer instanceof HTMLElement) {
      setTimeout(() => {
        pointer.style.opacity = '1';
        pointer.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 500);
    }
    
    // Animate the glow to pulse
    const glow = container.querySelector('.pointer-glow');
    if (glow instanceof HTMLElement) {
      setTimeout(() => {
        glow.style.opacity = '1';
      }, 800);
    }
    
    // Animate the beam
    const beam = container.querySelector('.pointer-beam');
    if (beam instanceof HTMLElement) {
      setTimeout(() => {
        beam.style.opacity = '0.7';
        beam.style.height = '150px';
      }, 1000);
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden" ref={containerRef}>
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black/70"></div>
      
      {/* 3D Grid */}
      <div 
        className="absolute inset-0" 
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Grid container with perspective transformation */}
        <div 
          className="absolute inset-0"
          style={{ 
            transform: 'rotateX(60deg) translateZ(0px)',
            transformOrigin: 'center bottom'
          }}
        >
          {/* Horizontal grid lines */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={`h-${i}`}
              className="grid-line absolute w-full h-px bg-cyan-900/20"
              style={{ 
                top: `${i * 5}%`, 
                opacity: 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            />
          ))}
          
          {/* Vertical grid lines */}
          {[...Array(25)].map((_, i) => (
            <div 
              key={`v-${i}`}
              className="grid-line absolute h-full w-px bg-cyan-900/20" 
              style={{ 
                left: `${i * 4}%`, 
                opacity: 0,
                transition: 'opacity 0.5s ease-in-out',
              }}
            />
          ))}
          
          {/* Pointer element */}
          <div 
            className="pointer absolute"
            style={{ 
              left: '50%', 
              top: '40%', 
              opacity: 0,
              transform: 'translate(-50%, -50%) scale(0.5)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              zIndex: 20,
            }}
          >
            {/* Pointer dot */}
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50 relative z-20"></div>
            
            {/* Pointer glow effect */}
            <div 
              className="pointer-glow absolute w-12 h-12 rounded-full bg-cyan-400/20 -top-6 -left-6 z-10 animate-pulse"
              style={{ 
                opacity: 0,
                transition: 'opacity 1s ease-out',
              }}
            ></div>
            
            {/* Pointer beam */}
            <div 
              className="pointer-beam absolute w-px bg-gradient-to-b from-cyan-400 to-transparent left-1.5 -bottom-3"
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
      
      {/* Add some atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/5 to-transparent mix-blend-overlay"></div>
    </div>
  );
};

export default TailwindConnectPage;
