import { useEffect, useRef } from 'react';

interface TechItem {
  name: string;
  path: string;
  logoUrl?: string;
}

const iconPath = (_key: string, fallback: string) => fallback;
const awsPath = '';

const technologies: TechItem[] = [
  {
    name: 'React',
    path: iconPath('siReact', iconPath('siReactjs', '')),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/react.svg',
  },
  {
    name: 'Next.js',
    path: iconPath('siNextdotjs', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg',
  },
  {
    name: 'TypeScript',
    path: iconPath('siTypescript', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/typescript.svg',
  },
  {
    name: 'Medusa.js',
    path: iconPath('siMedusa', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/medusa.svg',
  },
  {
    name: 'Stripe',
    path: iconPath('siStripe', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/stripe.svg',
  },
  {
    name: 'Node.js',
    path: iconPath('siNodedotjs', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nodedotjs.svg',
  },
  {
    name: 'PostgreSQL',
    path: iconPath('siPostgresql', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/postgresql.svg',
  },
  {
    name: 'Tailwind CSS',
    path: iconPath('siTailwindcss', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tailwindcss.svg',
  },
  {
    name: 'Framer Motion',
    path: iconPath('siFramer', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/framer.svg',
  },
  {
    name: 'Three.js',
    path: iconPath('siThreedotjs', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/threedotjs.svg',
  },
  {
    name: 'Docker',
    path: iconPath('siDocker', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg',
  },
  {
    name: 'AWS',
    path: awsPath,
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonwebservices.svg',
  },
  {
    name: 'Railway',
    path: iconPath('siRailway', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/railway.svg',
  },
  {
    name: 'AWS S3',
    path: iconPath('siAmazons3', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazons3.svg',
  },
  {
    name: 'Resend',
    path: iconPath('siResend', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/resend.svg',
  },
  {
    name: 'Netlify',
    path: iconPath('siNetlify', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/netlify.svg',
  },
  {
    name: 'Vercel',
    path: iconPath('siVercel', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vercel.svg',
  },
  {
    name: 'Sanity',
    path: iconPath('siSanity', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/sanity.svg',
  },
  {
    name: 'GraphQL',
    path: iconPath('siGraphql', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/graphql.svg',
  },
  {
    name: 'Prisma',
    path: iconPath('siPrisma', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/prisma.svg',
  },
  {
    name: 'Git',
    path: iconPath('siGit', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/git.svg',
  },
  {
    name: 'Figma',
    path: iconPath('siFigma', ''),
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/figma.svg',
  },
];

const LOGICAL_SET = [...technologies, ...technologies];

const Badge = ({ name, path, logoUrl }: TechItem) => (
  <div
    data-badge
    data-lit="0"
    className="flex flex-shrink-0 items-center gap-2.5 px-6 py-2 text-white/35 opacity-70 transition-all duration-300 [&[data-lit='1']]:text-white [&[data-lit='1']]:opacity-100"
  >
    {path ? (
      <svg viewBox="0 0 26 26" width={18} height={18} fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    ) : logoUrl ? (
      <img
        src={logoUrl}
        alt=""
        aria-hidden="true"
        className="h-6 w-6 object-contain opacity-90"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    ) : (
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
    )}
    <span className="whitespace-nowrap text-[13px] font-medium tracking-[0.02em]">{name}</span>
  </div>
);

const TechStackNew = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    let badges: HTMLElement[] = [];
    let raf = 0;
    let lastHL = 0;

    const measure = () => {
      badges = Array.from(slider.querySelectorAll<HTMLElement>('[data-badge]'));
    };

    const tick = (now: number) => {
      if (now - lastHL > 50) {
        lastHL = now;
        const trackRect = track.getBoundingClientRect();
        const cx = trackRect.left + trackRect.width / 2;
        badges.forEach((badge) => {
          const rect = badge.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          badge.dataset.lit = Math.abs(center - cx) < 110 ? '1' : '0';
        });
      }

      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener('resize', measure);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="tech" className="relative overflow-hidden bg-indigo-950 py-3">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

      <style>{`
        @keyframes tech-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        .tech-marquee-track {
          animation: tech-marquee 64s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-marquee-track {
            animation: none !important;
            transform: translate3d(0, 0, 0) !important;
          }
        }
      `}</style>

      <div ref={trackRef} className="overflow-hidden">
        <div
          ref={sliderRef}
          className="tech-marquee-track flex items-center"
          style={{ width: 'max-content', willChange: 'transform', backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-shrink-0">
            {LOGICAL_SET.map((tech, index) => (
              <Badge key={`${tech.name}-${index}`} {...tech} />
            ))}
          </div>
          <div className="flex flex-shrink-0">
            {LOGICAL_SET.map((tech, index) => (
              <Badge key={`${tech.name}-2-${index}`} {...tech} />
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-indigo-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-indigo-950 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default TechStackNew;