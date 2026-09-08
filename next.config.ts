import type { NextConfig } from 'next';

type SanityRedirect = {
  source?: string;
  destination?: string;
  permanent?: boolean;
};

// Redirects are resolved once, at build time, and baked into the routing layer.
// The alternative — looking them up in src/proxy.ts — would put a Sanity fetch
// on the edge path of every request just to serve the handful of URLs that have
// ever moved. A new redirect costs a rebuild, which the existing Sanity webhook
// already triggers.
async function fetchSanityRedirects(): Promise<SanityRedirect[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    return [];
  }

  const query = '*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}';
  const url = `https://${projectId}.api.sanity.io/v2024-02-20/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[redirects] Sanity returned ${response.status}; building without CMS redirects.`);
      return [];
    }
    const body = (await response.json()) as { result?: SanityRedirect[] };
    return Array.isArray(body.result) ? body.result : [];
  } catch (error) {
    // A build must not fail because the CMS was briefly unreachable. Losing a
    // redirect degrades to a 404 on an old URL; failing the build takes the
    // whole site down.
    console.warn('[redirects] Could not reach Sanity; building without CMS redirects.', error);
    return [];
  }
}

function normalizePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react', 'framer-motion'],
    // Every routable page lives under /[lang], which owns <html>. Paths matching
    // no route need their own document: src/app/global-not-found.tsx.
    globalNotFound: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    const cmsRedirects = (await fetchSanityRedirects())
      .map((entry) => ({
        source: normalizePath(entry.source || ''),
        destination: normalizePath(entry.destination || ''),
        permanent: entry.permanent !== false,
      }))
      .filter((entry) => entry.source && entry.destination && entry.source !== entry.destination);

    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // "/" used to render its own copy of the homepage alongside /pl: two
      // indexable pages, two self-canonicals and two conflicting hreflang
      // clusters for one piece of content. /pl is the version in the sitemap,
      // so it wins and "/" folds into it.
      {
        source: '/',
        destination: '/pl',
        permanent: true,
      },
      ...cmsRedirects,
    ];
  },
  // These used to live in netlify.toml, where they silently did nothing:
  // Netlify only applies custom headers to files it serves from its own
  // backing store, not to URLs handled by a function — which is every HTML
  // page here. Verified against production: /favicon.ico carried
  // X-Frame-Options while / did not. Emitting them from Next puts them on the
  // rendered responses.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
