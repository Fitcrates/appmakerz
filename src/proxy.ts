import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLanguage, type Language } from '@/lib/language';

const CHAT_ALLOWED_METHODS = new Set(['POST', 'OPTIONS']);
const LEGACY_PUBLIC_PATHS = [
  '/about-me',
  '/blog',
  '/faq',
  '/kalkulator',
  '/marketplace-guide',
  '/privacy-policy',
  '/project',
  '/unsubscribe',
  '/uslugi',
];

// Where "/" sends a visitor whose Accept-Language names neither language we
// publish, and every client that sends no such header at all, which is most
// crawlers. It matches the x-default in the hreflang cluster: the commercial
// strategy reaches Europe through the English pages, so an unmatched visitor
// belongs on /en. Changing this means changing x-default in
// src/app/[lang]/layout.tsx and the sitemap's alternates too, or the site goes
// back to telling Google one thing and doing another.
const HOMEPAGE_FALLBACK_LANGUAGE: Language = 'en';

// Accept-Language is a q-weighted list, e.g. "pl-PL,pl;q=0.9,en-US;q=0.8".
// Highest q wins, and entries that share a q keep header order because
// Array.prototype.sort is stable. Region subtags are dropped: pl-PL and pl are
// the same page here. Returns null when nothing in the header is a language we
// serve, including the "*" wildcard and a q=0 rejection.
function preferredLanguage(header: string | null): Language | null {
  if (!header) return null;

  const ranked = header
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';');
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith('q='));
      const parsed = quality ? Number.parseFloat(quality.slice(2)) : 1;

      return {
        base: tag.trim().toLowerCase().split('-')[0],
        quality: Number.isFinite(parsed) ? parsed : 0,
      };
    })
    .filter((entry) => entry.base && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  return ranked.find((entry) => isLanguage(entry.base))?.base as Language | undefined ?? null;
}

// "/" has no page of its own: every route lives under /[lang]. This must always
// end in a redirect, whatever the method and whatever the header says, or the
// homepage falls through the router and renders global-not-found.
function redirectHomepage(request: NextRequest) {
  const language = preferredLanguage(request.headers.get('accept-language')) ?? HOMEPAGE_FALLBACK_LANGUAGE;
  const url = request.nextUrl.clone();
  url.pathname = `/${language}`;

  // 302, not the 301 used below. The destination varies per request, and a
  // browser that cached a permanent redirect would pin the visitor to whichever
  // language they happened to ask for on their first ever visit, with no way
  // back short of clearing the cache. Vary documents the dependency and
  // no-store keeps Netlify's edge from handing one visitor's language to the
  // next. 301 and 302 are both understood by every crawler; it was 308, which
  // `permanent: true` in next.config.ts emits, that social scrapers stopped at.
  const response = NextResponse.redirect(url, 302);
  response.headers.set('Vary', 'Accept-Language');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

function shouldRedirectToDefaultLanguage(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (isLanguage(firstSegment)) {
    return false;
  }

  return LEGACY_PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return redirectHomepage(request);
  }

  if (request.method === 'GET' && shouldRedirectToDefaultLanguage(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/pl${request.nextUrl.pathname}`;
    return NextResponse.redirect(url, 301);
  }

  if (request.nextUrl.pathname.startsWith('/api/chat') && !CHAT_ALLOWED_METHODS.has(request.method)) {
    return NextResponse.json(
      { error: 'Method not allowed' },
      {
        status: 405,
        headers: {
          Allow: 'POST',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  return NextResponse.next();
}

// '/' is matched despite being the most requested route in the site, which
// costs it an edge-function hop and that function's cold start. It used to be
// excluded, with a flat "/" -> "/pl" rule in next.config.ts covering it, but
// next.config redirects are checked before the proxy runs, so reading
// Accept-Language is only possible from here.
export const config = {
  matcher: ['/', '/about-me/:path*', '/blog/:path*', '/faq/:path*', '/kalkulator/:path*', '/marketplace-guide/:path*', '/privacy-policy/:path*', '/project/:path*', '/unsubscribe/:path*', '/uslugi/:path*', '/api/chat/:path*'],
};
