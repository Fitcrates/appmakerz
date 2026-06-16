import React from 'react';

interface AboutHeroDistortedImageProps {
  src: string;
  alt: string;
}

export default function AboutHeroDistortedImage({ src, alt }: AboutHeroDistortedImageProps) {
  return (
    <div className="about-hero-distortion relative w-full max-w-xs mx-auto lg:max-w-none aspect-[3/4] overflow-hidden">
      <svg className="absolute size-0" aria-hidden="true">
        <filter id="aboutHeroDistortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.018"
            numOctaves="2"
            seed="8"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="12s"
              repeatCount="indefinite"
              values="0.006 0.018;0.006 0.018;0.04 0.12;0.015 0.04;0.006 0.018;0.006 0.018"
              keyTimes="0;0.66;0.70;0.74;0.84;1"
            />
          </feTurbulence>

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          >
            <animate
              attributeName="scale"
              dur="12s"
              repeatCount="indefinite"
              values="0;0;22;8;0;0"
              keyTimes="0;0.66;0.70;0.74;0.84;1"
            />
          </feDisplacementMap>
        </filter>
      </svg>

      <img
        src={src}
        alt={alt}
        className="about-hero-img relative z-10 w-full h-full object-cover object-top"
        loading="eager"
        decoding="async"
      />

      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="about-hero-rgb about-hero-rgb-red"
      />

      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="about-hero-rgb about-hero-rgb-cyan"
      />

      <div className="absolute inset-0 z-20 border border-white/10 pointer-events-none" />
    </div>
  );
}
