interface ElectricLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ElectricLogo({ src, alt, className = '' }: ElectricLogoProps) {
  const borderColor = '#5eead4';
  const lightColor = '#5eead4';
  const gradientColor =  'rgba(30, 27, 75, 0.1)';
  const neutral900 = 'rgba(94, 234, 212, 0.4)';

  return (
    // ROOT: aspect-square container. Main wrapper that establishes
    // the square aspect ratio and holds the SVG filter, the gradient
    // frame, and all visual layers.
    <div className={`relative aspect-square ${className}`}>
      {/* SVG FILTER DEFINITIONS: hidden SVG that defines the animated
          turbulence displacement filter applied ONLY to the border.
          Four feTurbulence sources are offset vertically and horizontally
          with infinite loops, then blended with color-dodge and used
          to distort the border via feDisplacementMap (scale 30).
          Unique ID prevents collision with other components. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="turbulent-displace-about" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700;0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0;-700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed="2" />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490;0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed="2" />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0;-490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      {/* GRADIENT OUTER RING: adds a subtle 2px gradient padding around
          the whole element. It blends the teal accent color into the
          dark background, giving the border a soft "glowing frame"
          before any effects are applied. */}
      <div
        className="h-full w-full rounded-full p-[2px]"
        style={{
          background: `rgba(30, 27, 75, 0.1)`,
        }}
      >
        {/* INNER LAYER CONTAINER: holds the logo, the distorted border,
            and the glow layers. `relative` is required so absolute
            children position correctly on top of each other. */}
        <div className="relative h-full w-full">
          {/* CLEAN LOGO (z-20): renders the logo image completely UNAFFECTED
              by the SVG displacement filter. Highest z-index ensures it sits
              on top of all decorative layers so the image stays sharp. */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-full">
            <img src={src} alt={alt} className="h-full w-full object-contain" />
          </div>

          {/* BORDER OUTER SHELL (z-10): invisible structural shell
              (border opacity 0) with bottom/right padding that creates the
              offset "card stack" look from the original design. It positions
              the main electric border above overlays but below the logo. */}
          <div
            className="absolute inset-0 z-10 rounded-full border-2 border-[#5eead4]/0"
            style={{ paddingRight: '4px', paddingBottom: '4px' }}
          >
            {/* MAIN ELECTRIC BORDER (filtered): the ONLY element that
                receives the SVG displacement filter. It is an empty
                border-only div; because it has no content, only its own
                border gets distorted into the animated electric / lightning
                shape. The -4px offset replicates the stacked-card shadow. */}
            <div
              className="h-full w-full rounded-full border-2 border-[#5eead4]"
              style={{
                filter: 'url(#turbulent-displace-about)',
                marginTop: '-4px',
                marginLeft: '-4px',
              }}
            />
          </div>

          {/* GLOW LAYER 1 (z-5, blur 1px): a duplicate border with 60%
              opacity teal and a 1px blur. Sits behind the main border to
              add a sharp inner halo that makes the edge feel like it is
              vibrating with light. */}
            {/* removed border-2 */}
            
          <div
            className="pointer-events-none absolute inset-0 z-[5] rounded-full border-1 border-[#5eead4]/30"  
            style={{ filter: 'blur(1px)' }}
          />

          {/* GLOW LAYER 2 (z-5, blur 4px): same idea as Glow Layer 1 but
              with a wider 4px blur. Creates the medium-radius diffusion
              around the electric border so it looks like plasma rather
              than a thin line. */}
          <div
            className="pointer-events-none absolute inset-0 z-[5] rounded-full "
            style={{ borderColor: lightColor, filter: 'blur(4px)' }}
          />
        </div>

        
        {/* BACKGROUND GLOW (-z-10, blur 32px): the deepest decorative
            layer. A very wide, heavily blurred (32px) teal gradient that
            spills behind the whole element. Gives the impression the
            electric ring is emitting ambient light onto the surrounding
            page area. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-30"
          style={{
            transform: 'scale(1.2)',
            filter: 'blur(42px)',
            background: `linear-gradient(-30deg, ${lightColor}, transparent, ${borderColor})`,
          }}
        />
      </div>
    </div>
  );
}