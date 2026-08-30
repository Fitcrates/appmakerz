import { NextResponse } from 'next/server';
import { incrementPostViewCount } from '@/lib/sanity.write.server';
import { checkServerRateLimit, getRequestIp } from '@/lib/server-rate-limit';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    if (/bot|crawler|spider|preview|facebookexternalhit|slurp/i.test(userAgent)) {
      return NextResponse.json({ success: true, ignored: true }, { headers: NO_STORE_HEADERS });
    }

    const body = await request.json();
    const postId = typeof body?.postId === 'string' ? body.postId.trim() : '';

    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const rateLimit = await checkServerRateLimit({
      scope: `blog-view:${postId}`,
      identifier: getRequestIp(request),
      limit: 1,
      windowMs: 6 * 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return NextResponse.json({ success: true, ignored: true }, { headers: NO_STORE_HEADERS });
    }

    const result = await incrementPostViewCount(postId);
    return NextResponse.json(result, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Blog views route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to increment view count.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
