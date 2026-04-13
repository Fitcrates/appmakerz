import { memo, useEffect, useRef } from 'react';

interface TechItem {
  name: string;
  logoUrl: string;
}

const technologies: TechItem[] = [
  {
    name: 'React',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/react.svg',
  },
  {
    name: 'Next.js',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nextdotjs.svg',
  },
  {
    name: 'TypeScript',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/typescript.svg',
  },
  {
    name: 'Medusa.js',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/medusa.svg',
  },
  {
    name: 'Stripe',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/stripe.svg',
  },
  {
    name: 'Node.js',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/nodedotjs.svg',
  },
  {
    name: 'PostgreSQL',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/postgresql.svg',
  },
  {
    name: 'Tailwind CSS',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tailwindcss.svg',
  },
  {
    name: 'Framer Motion',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/framer.svg',
  },
  {
    name: 'Three.js',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/threedotjs.svg',
  },
  {
    name: 'Docker',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg',
  },
  {
    name: 'AWS',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonwebservices.svg',
  },
  {
    name: 'Railway',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/railway.svg',
  },
  {
    name: 'AWS S3',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazons3.svg',
  },
  {
    name: 'Resend',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/resend.svg',
  },
  {
    name: 'Netlify',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/netlify.svg',
  },
  {
    name: 'Vercel',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/vercel.svg',
  },
  {
    name: 'Sanity',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/sanity.svg',
  },
  {
    name: 'GraphQL',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/graphql.svg',
  },
  {
    name: 'Prisma',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/prisma.svg',
  },
  {
    name: 'Git',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/git.svg',
  },
  {
    name: 'Figma',
    logoUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/figma.svg',
  },
];

const LOGICAL_SET = [...technologies, ...technologies];

const Badge = memo(({ name, logoUrl }: TechItem) => (
  <div
    data-badge
    data-lit="0"
    className="flex flex-shrink-0 items-center gap-2.5 px-6 py-2 text-white/35 opacity-70 transition-all duration-300 [&[data-lit='1']]:text-white [&[data-lit='1']]:opacity-100"
  >
    <img
      src={logoUrl}
      alt=""
      aria-hidden="true"
      className="block h-[18px] w-[18px] object-contain"
      loading="lazy"
      decoding="async"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
    <span className="whitespace-nowrap text-[13px] font-medium tracking-[0.02em]">{name}</span>
  </div>
));

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