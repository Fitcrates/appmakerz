import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLanguage } from '@/lib/language';

const CHAT_ALLOWED_METHODS = new Set(['POST', 'OPTIONS']);
const LEGACY_PUBLIC_PATHS = [
  '/about-me',
  '/blog',
  '/faq',
  '/kalkulator',
  '/privacy-policy',
  '/project',
  '/unsubscribe',
  '/uslugi',
];

function shouldRedirectToDefaultLanguage(pathname: string) {
  if (pathname === '/') {
    return true;
  }

  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (isLanguage(firstSegment)) {
    return false;
  }

  return LEGACY_PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest) {
  if (request.method === 'GET' && shouldRedirectToDefaultLanguage(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/pl${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`;
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

export const config = {
  matcher: ['/', '/about-me/:path*', '/blog/:path*', '/faq/:path*', '/kalkulator/:path*', '/privacy-policy/:path*', '/project/:path*', '/unsubscribe/:path*', '/uslugi/:path*', '/api/chat/:path*'],
};
