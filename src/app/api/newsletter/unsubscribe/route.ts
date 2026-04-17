import { NextResponse } from 'next/server';
import { unsubscribeFromNewsletter } from '@/lib/sanity.write.server';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token.trim() : undefined;
    const email = typeof body?.email === 'string' ? body.email.trim() : undefined;

    if (!token && !email) {
      return NextResponse.json(
        { success: false, message: 'Token or email is required.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const result = await unsubscribeFromNewsletter({ token, email });
    if (!result.success) {
      return NextResponse.json(result, { status: 404, headers: NO_STORE_HEADERS });
    }

    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Newsletter unsubscribe route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process unsubscribe request.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
