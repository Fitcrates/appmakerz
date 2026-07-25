import type { Config } from '@netlify/functions';

// Why this exists: the site is prerendered, but a cache miss still wakes the
// Next.js server function in the project's functions region. On a low-traffic
// site that container is usually cold, and a cold start measured 2.7-4.5 s TTFB
// against 0.15 s warm — the "nothing happens for 4 seconds after I type the
// address" symptom.
//
// Fetching the public URLs rather than pinging the function directly means the
// request lands in the durable cache, which is global and shared — so a Warsaw
// edge miss is served from storage instead of waking the function. The nearby
// edge PoP this warms is the one next to the functions region, not the
// visitor's, so the durable fill is the part that actually matters. It also
// keeps the container warm, which covers the window right after a deploy or a
// webhook purge when the durable entry is gone.

const PATHS = [
  '/',
  '/pl',
  '/en',
  '/pl/blog',
  '/en/blog',
  '/pl/about-me',
  '/pl/faq',
  '/pl/kalkulator',
];

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'https://appcrates.pl').replace(/\/$/, '');

export default async () => {
  const results = await Promise.all(
    PATHS.map(async (path) => {
      const startedAt = Date.now();

      try {
        const response = await fetch(`${SITE_URL}${path}`, {
          headers: { 'user-agent': 'appcrates-cache-warmer' },
          redirect: 'manual',
        });

        // Drain the body so the request is a genuine cache fill, not just headers.
        await response.arrayBuffer();

        return {
          path,
          status: response.status,
          ms: Date.now() - startedAt,
          cache: response.headers.get('cache-status'),
        };
      } catch (error) {
        return {
          path,
          error: error instanceof Error ? error.message : 'unknown error',
          ms: Date.now() - startedAt,
        };
      }
    })
  );

  const slow = results.filter((result) => result.ms > 1500);
  if (slow.length) {
    console.warn('Cache warmer saw slow responses:', JSON.stringify(slow));
  }

  return new Response(JSON.stringify({ warmed: results }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config: Config = {
  schedule: '*/5 * * * *',
};
