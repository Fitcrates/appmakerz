import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/sanity.write.server';
import { checkServerRateLimit, getRequestIp } from '@/lib/server-rate-limit';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: Request) {
  try {
    const rateLimit = await checkServerRateLimit({
      scope: 'newsletter-subscribe',
      identifier: getRequestIp(request),
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (rateLimit.limited) {
      return NextResponse.json(
        { success: false, message: 'Too many requests.' },
        { status: 429, headers: NO_STORE_HEADERS }
      );
    }

    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const categories = Array.isArray(body?.categories)
      ? body.categories.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const result = await subscribeToNewsletter(email, categories);
    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Newsletter subscribe route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
