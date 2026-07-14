interface ElectricLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ElectricLogo({ src, alt, className = '' }: ElectricLogoProps) {


  return (
    <div className={`relative aspect-square ${className}`}>
      {/* SVG FILTERS: two variants of the same electric distortion.
          `electric-logo-filter` is the reference version (Chrome/Firefox).
          `electric-logo-filter-lite` is picked up by Safari only, via the
          @supports block on .electric-logo-ring in globals.css — WebKit runs
          filter graphs on the CPU every frame, so it gets fewer octaves.

          Both variants generate each turbulence ONCE and feed it into two
          feOffsets. The previous four feTurbulence primitives came in
          identical pairs (same type/baseFrequency/numOctaves/seed), so the
          output is unchanged while the noise cost is halved. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="electric-logo-filter" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noiseA" seed="1" />
            <feOffset in="noiseA" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700;0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feOffset in="noiseA" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0;-700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noiseB" seed="2" />
            <feOffset in="noiseB" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490;0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feOffset in="noiseB" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0;-490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>

          <filter id="electric-logo-filter-lite" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="noiseA" seed="1" />
            <feOffset in="noiseA" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700;0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feOffset in="noiseA" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0;-700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="noiseB" seed="2" />
            <feOffset in="noiseB" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490;0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feOffset in="noiseB" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0;-490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      <div className="relative h-full w-full min-w-[200px] min-h-[200px]">
        {/* CLEAN LOGO (z-20): completely unaffected by the filter */}
        <div className="absolute inset-0 z-20 overflow-hidden rounded-full">
          <img src={src} alt={alt} className="h-full w-full object-contain" />
        </div>

        {/* MAIN ELECTRIC BORDER (filtered): clean absolute border with
            no margins or offsets that cause shifting at small sizes. */}
        <div className="electric-logo-ring absolute inset-0 z-10 rounded-full border-2 border-[#5eead4]" />

        {/* BACKGROUND GLOW (-z-10, blur 18px): the deepest decorative
            layer. A very wide, heavily blurred teal ring that spills behind
            the whole element. Gives the impression the electric ring is
            emitting ambient light onto the surrounding page area. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-full  border-2 border-[#5eead4]/90"
          style={{
            transform: 'scale(1.0)',
            filter: 'blur(18px)',
          }}
        />
      </div>
    </div>
  );
}
