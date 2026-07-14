import React from 'react';

// Circuit paths aligned with the hero image electrical lines.
// Angular paths (L commands) to match the circuit board aesthetic.
const BEAMS = [
  // Upper left circuit - starts from left, goes right with angular turns
  {
    d: 'M -50 120 L 150 120 L 150 80 L 350 80 L 350 150 L 500 150 L 500 100 L 700 100 L 700 180 L 850 180',
    delay: 0,
    duration: 2,
    repeatDelay: 4,
  },
  // Upper right circuit - starts from right, goes left with angular turns
  {
    d: 'M 2020 100 L 1800 100 L 1800 60 L 1600 60 L 1600 140 L 1450 140 L 1450 90 L 1250 90 L 1250 160 L 1100 160',
    delay: 1.5,
    duration: 2,
    repeatDelay: 5,
  },
  // Left side vertical circuit - drops down from upper left area
  {
    d: 'M 200 -50 L 200 100 L 280 100 L 280 250 L 200 250 L 200 380',
    delay: 0.5,
    duration: 1.5,
    repeatDelay: 6,
  },
  // Right side vertical circuit - drops down from upper right area
  {
    d: 'M 1720 -50 L 1720 80 L 1640 80 L 1640 220 L 1720 220 L 1720 350',
    delay: 2.5,
    duration: 1.5,
    repeatDelay: 6,
  },
  // Center descending circuit - from globe area down
  {
    d: 'M 960 200 L 960 300 L 1020 300 L 1020 400 L 960 400 L 960 500',
    delay: 3,
    duration: 1.8,
    repeatDelay: 7,
  },
  // Lower left diagonal circuit
  {
    d: 'M -50 600 L 100 600 L 100 550 L 250 550 L 250 620 L 400 620',
    delay: 4,
    duration: 1.5,
    repeatDelay: 8,
  },
  // Lower right diagonal circuit
  {
    d: 'M 2020 580 L 1850 580 L 1850 530 L 1700 530 L 1700 600 L 1550 600',
    delay: 5,
    duration: 1.5,
    repeatDelay: 8,
  },
];

// framer-motion drove stroke-dashoffset from JS, so every one of the 14 paths
// wrote an attribute on the main thread each frame. The same motion expressed
// as CSS keyframes runs without JS. `repeatDelay` has no CSS equivalent, so it
// is folded into the cycle: the beam travels over the first `duration` seconds
// of a `duration + repeatDelay` cycle and then sits invisible until it wraps.
const EASE_IN_OUT = 'cubic-bezier(0.42, 0, 0.58, 1)';

const pct = (value: number) => `${+(value * 100).toFixed(3)}%`;

function buildKeyframes() {
  return BEAMS.map((beam, index) => {
    const cycle = beam.duration + beam.repeatDelay;
    const travel = beam.duration / cycle;

    return `
@keyframes laser-dash-${index} {
  0% { stroke-dashoffset: 2100; }
  ${pct(travel)} { stroke-dashoffset: -100; }
  100% { stroke-dashoffset: -100; }
}
@keyframes laser-core-${index} {
  0% { stroke-dashoffset: 2060; }
  ${pct(travel)} { stroke-dashoffset: -60; }
  100% { stroke-dashoffset: -60; }
}
@keyframes laser-fade-${index} {
  0% { opacity: 0; }
  ${pct(travel * 0.1)} { opacity: 1; }
  ${pct(travel * 0.9)} { opacity: 1; }
  ${pct(travel)} { opacity: 0; }
  100% { opacity: 0; }
}`;
  }).join('\n');
}

function beamAnimation(index: number, track: 'dash' | 'core') {
  const beam = BEAMS[index];
  const cycle = beam.duration + beam.repeatDelay;

  return [
    `laser-${track}-${index} ${cycle}s ${EASE_IN_OUT} ${beam.delay}s infinite both`,
    `laser-fade-${index} ${cycle}s ${EASE_IN_OUT} ${beam.delay}s infinite both`,
  ].join(', ');
}

const HeroPulsePath: React.FC = () => {
  return (
    <div className="hero-laser-field absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      <style>{buildKeyframes()}</style>

      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* One shared glow filter instead of seven. The region is sized to
              the union bounding box of all beams plus the ~18px (3 sigma)
              a stdDeviation of 6 actually needs — the old 300% x 300% region
              made WebKit blur roughly nine times more pixels than required. */}
          <filter
            id="laserGlow"
            x="-2%"
            y="-3%"
            width="104%"
            height="106%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glowing beams. The filter is applied once to the whole group; the
            class (not a `filter` attribute) carries it so that Safari can swap
            in a GPU-accelerated drop-shadow via @supports in globals.css. */}
        <g className="laser-glow-group">
          {BEAMS.map((beam, index) => (
            <path
              key={`glow-${beam.delay}`}
              d={beam.d}
              stroke="#5eead4"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="100 2000"
              style={{ animation: beamAnimation(index, 'dash') }}
            />
          ))}
        </g>

        {/* Brighter core of each laser — unfiltered, as before. The 0.8 peak
            opacity lives on stroke-opacity so the fade keyframes can be shared
            with the glow layer. */}
        <g>
          {BEAMS.map((beam, index) => (
            <path
              key={`core-${beam.delay}`}
              d={beam.d}
              stroke="#ffffff"
              strokeOpacity="0.8"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="60 2000"
              style={{ animation: beamAnimation(index, 'core') }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default HeroPulsePath;
