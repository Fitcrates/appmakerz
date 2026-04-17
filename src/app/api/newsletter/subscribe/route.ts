import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/sanity.write.server';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const categories = Array.isArray(body?.categories)
      ? body.categories.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];

    if (!email || categories.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Email and at least one category are required.' },
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
