import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CHAT_ALLOWED_METHODS = new Set(['POST', 'OPTIONS']);

export function middleware(request: NextRequest) {
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
  matcher: ['/api/chat/:path*'],
};
