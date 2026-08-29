/**
 * Technology name -> brand icon + brand colour.
 *
 * Icons come from Simple Icons (single-path, monochrome SVG) and are applied as
 * a CSS mask, which is what lets us paint them in the brand colour on hover
 * without shipping a coloured asset per technology.
 *
 * Only mapped slugs are ever requested, so there are no 404s and no broken
 * glyphs - anything unmapped falls back to a monogram tile.
 */

const ICON_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@16/icons';

export interface TechIcon {
  slug: string;
  color: string;
}

/** Keys are normalized names: lowercase, alphanumerics only. */
const TECH_ICONS: Record<string, TechIcon> = {
  // Languages & runtimes
  typescript: { slug: 'typescript', color: '#3178C6' },
  javascript: { slug: 'javascript', color: '#F7DF1E' },
  nodejs: { slug: 'nodedotjs', color: '#5FA04E' },
  node: { slug: 'nodedotjs', color: '#5FA04E' },
  deno: { slug: 'deno', color: '#70FFAF' },
  bun: { slug: 'bun', color: '#FBF0DF' },
  python: { slug: 'python', color: '#3776AB' },
  php: { slug: 'php', color: '#777BB4' },
  go: { slug: 'go', color: '#00ADD8' },
  golang: { slug: 'go', color: '#00ADD8' },
  rust: { slug: 'rust', color: '#F74C00' },
  html: { slug: 'html5', color: '#E34F26' },
  html5: { slug: 'html5', color: '#E34F26' },
  css: { slug: 'css', color: '#663399' },
  css3: { slug: 'css', color: '#663399' },
  sass: { slug: 'sass', color: '#CC6699' },

  // Frontend frameworks
  react: { slug: 'react', color: '#61DAFB' },
  reactrouter: { slug: 'reactrouter', color: '#CA4245' },
  nextjs: { slug: 'nextdotjs', color: '#FFFFFF' },
  next: { slug: 'nextdotjs', color: '#FFFFFF' },
  vue: { slug: 'vuedotjs', color: '#4FC08D' },
  vuejs: { slug: 'vuedotjs', color: '#4FC08D' },
  nuxt: { slug: 'nuxt', color: '#00DC82' },
  svelte: { slug: 'svelte', color: '#FF3E00' },
  sveltekit: { slug: 'svelte', color: '#FF3E00' },
  angular: { slug: 'angular', color: '#DD0031' },
  astro: { slug: 'astro', color: '#BC52EE' },
  remix: { slug: 'remix', color: '#FFFFFF' },
  redux: { slug: 'redux', color: '#764ABC' },
  reactquery: { slug: 'reactquery', color: '#FF4154' },
  tanstackquery: { slug: 'reactquery', color: '#FF4154' },
  tanstacktable: { slug: 'reactquery', color: '#FF4154' },
  jquery: { slug: 'jquery', color: '#0769AD' },
  threejs: { slug: 'threedotjs', color: '#FFFFFF' },
  three: { slug: 'threedotjs', color: '#FFFFFF' },
  framermotion: { slug: 'framer', color: '#0055FF' },
  framer: { slug: 'framer', color: '#0055FF' },
  gsap: { slug: 'greensock', color: '#88CE02' },
  greensock: { slug: 'greensock', color: '#88CE02' },

  // Styling & UI
  tailwindcss: { slug: 'tailwindcss', color: '#06B6D4' },
  tailwind: { slug: 'tailwindcss', color: '#06B6D4' },
  bootstrap: { slug: 'bootstrap', color: '#7952B3' },
  mui: { slug: 'mui', color: '#007FFF' },
  materialui: { slug: 'mui', color: '#007FFF' },
  shadcnui: { slug: 'shadcnui', color: '#FFFFFF' },
  radixui: { slug: 'radixui', color: '#FFFFFF' },
  storybook: { slug: 'storybook', color: '#FF4785' },
  figma: { slug: 'figma', color: '#F24E1E' },
  blender: { slug: 'blender', color: '#E87D0D' },

  // Backend & data
  express: { slug: 'express', color: '#FFFFFF' },
  nestjs: { slug: 'nestjs', color: '#E0234E' },
  fastify: { slug: 'fastify', color: '#FFFFFF' },
  django: { slug: 'django', color: '#092E20' },
  laravel: { slug: 'laravel', color: '#FF2D20' },
  graphql: { slug: 'graphql', color: '#E10098' },
  trpc: { slug: 'trpc', color: '#2596BE' },
  prisma: { slug: 'prisma', color: '#2D3748' },
  drizzle: { slug: 'drizzle', color: '#C5F74F' },
  drizzleorm: { slug: 'drizzle', color: '#C5F74F' },
  postgresql: { slug: 'postgresql', color: '#4169E1' },
  postgres: { slug: 'postgresql', color: '#4169E1' },
  mysql: { slug: 'mysql', color: '#4479A1' },
  mongodb: { slug: 'mongodb', color: '#47A248' },
  redis: { slug: 'redis', color: '#FF4438' },
  sqlite: { slug: 'sqlite', color: '#003B57' },
  supabase: { slug: 'supabase', color: '#3FCF8E' },
  firebase: { slug: 'firebase', color: '#DD2C00' },
  elasticsearch: { slug: 'elasticsearch', color: '#005571' },
  algolia: { slug: 'algolia', color: '#003DFF' },
  socketio: { slug: 'socketdotio', color: '#FFFFFF' },
  openapi: { slug: 'openapiinitiative', color: '#6BA539' },
  swagger: { slug: 'swagger', color: '#85EA2D' },
  zod: { slug: 'zod', color: '#3E67B1' },

  // Commerce & CMS
  medusa: { slug: 'medusa', color: '#8B5CF6' },
  medusajs: { slug: 'medusa', color: '#8B5CF6' },
  shopify: { slug: 'shopify', color: '#7AB55C' },
  woocommerce: { slug: 'woocommerce', color: '#96588A' },
  prestashop: { slug: 'prestashop', color: '#DF0067' },
  wordpress: { slug: 'wordpress', color: '#21759B' },
  elementor: { slug: 'elementor', color: '#92003B' },
  webflow: { slug: 'webflow', color: '#146EF5' },
  sanity: { slug: 'sanity', color: '#F03E2F' },
  contentful: { slug: 'contentful', color: '#2478CC' },
  strapi: { slug: 'strapi', color: '#4945FF' },
  stripe: { slug: 'stripe', color: '#635BFF' },
  paypal: { slug: 'paypal', color: '#003087' },

  // Infrastructure & tooling
  docker: { slug: 'docker', color: '#2496ED' },
  kubernetes: { slug: 'kubernetes', color: '#326CE5' },
  nginx: { slug: 'nginx', color: '#009639' },
  linux: { slug: 'linux', color: '#FCC624' },
  vercel: { slug: 'vercel', color: '#FFFFFF' },
  netlify: { slug: 'netlify', color: '#00C7B7' },
  railway: { slug: 'railway', color: '#FFFFFF' },
  cloudflare: { slug: 'cloudflare', color: '#F38020' },
  githubactions: { slug: 'githubactions', color: '#2088FF' },
  github: { slug: 'github', color: '#FFFFFF' },
  gitlab: { slug: 'gitlab', color: '#FC6D26' },
  git: { slug: 'git', color: '#F05032' },
  sentry: { slug: 'sentry', color: '#362D59' },

  // Build & test
  vite: { slug: 'vite', color: '#646CFF' },
  vitest: { slug: 'vitest', color: '#6E9F18' },
  jest: { slug: 'jest', color: '#C21325' },
  cypress: { slug: 'cypress', color: '#69D3A7' },
  eslint: { slug: 'eslint', color: '#4B32C3' },
  prettier: { slug: 'prettier', color: '#F7B93E' },
  webpack: { slug: 'webpack', color: '#8DD6F9' },
  npm: { slug: 'npm', color: '#CB3837' },
  pnpm: { slug: 'pnpm', color: '#F69220' },

  // Services & integrations
  resend: { slug: 'resend', color: '#FFFFFF' },
  mailchimp: { slug: 'mailchimp', color: '#FFE01B' },
  anthropic: { slug: 'anthropic', color: '#D97757' },
  claude: { slug: 'claude', color: '#D97757' },
  n8n: { slug: 'n8n', color: '#EA4B71' },
  zapier: { slug: 'zapier', color: '#FF4F00' },
  make: { slug: 'make', color: '#6D00CC' },
  notion: { slug: 'notion', color: '#FFFFFF' },
  discord: { slug: 'discord', color: '#5865F2' },
  googleanalytics: { slug: 'googleanalytics', color: '#E37400' },
  googletagmanager: { slug: 'googletagmanager', color: '#246FDB' },
};

const NORMALIZE = /[^a-z0-9]/g;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(NORMALIZE, '');
}

/**
 * Resolves an icon for a free-text technology name. Version suffixes are
 * dropped word by word, so "Node.js 24 LTS", "React 19" and "Tailwind CSS v4"
 * all land on the right icon.
 */
export function resolveTechIcon(name: string): TechIcon | null {
  if (!name) {
    return null;
  }

  const words = name.replace(/[()[\]]/g, ' ').split(/\s+/).filter(Boolean);

  for (let end = words.length; end > 0; end -= 1) {
    const candidate = TECH_ICONS[normalize(words.slice(0, end).join(''))];
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

export function techIconUrl(slug: string): string {
  return `${ICON_CDN}/${slug}.svg`;
}

/** First letter used by the fallback tile, so unmapped tech still reads as a mark. */
export function techMonogram(name: string): string {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : '#';
}
