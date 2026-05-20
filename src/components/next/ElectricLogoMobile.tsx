interface ElectricLogoMobileProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ElectricLogoMobile({ src, alt, className = '' }: ElectricLogoMobileProps) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 6px 2px rgba(94,234,212,0.25), 0 0 16px 4px rgba(94,234,212,0.08); }
          100% { box-shadow: 0 0 12px 4px rgba(94,234,212,0.45), 0 0 28px 8px rgba(94,234,212,0.18); }
        }
      `}</style>

      {/* ROTATING ELECTRIC RING: conic gradient masked to a thin ring.
          GPU-accelerated rotate, no SVG filters, never clips or flickers. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, #5eead4 40deg, transparent 80deg, #5eead4 120deg, transparent 160deg, #5eead4 200deg, transparent 240deg, #5eead4 280deg, transparent 320deg, #5eead4 360deg)',
          WebkitMask: 'radial-gradient(transparent 62%, black 63%, black 69%, transparent 70%)',
          mask: 'radial-gradient(transparent 62%, black 63%, black 69%, transparent 70%)',
          animation: 'spin 4s linear infinite',
        }}
      />

      {/* PULSATING GLOW: multi-layer box-shadow with opacity pulse */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          animation: 'pulse-glow 2.5s ease-in-out infinite alternate',
          boxShadow:
            '0 0 8px 2px rgba(94,234,212,0.35), 0 0 20px 5px rgba(94,234,212,0.15)',
        }}
      />

      {/* CLEAN LOGO */}
      <div className="absolute inset-0 z-10 overflow-hidden rounded-full">
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      </div>
    </div>
  );
}
