import { NextRequest, NextResponse } from 'next/server';
import getSitemap from '@/app/sitemap';
import { submitIndexNow } from '@/lib/indexnow';

const SECRET = process.env.INDEXNOW_SECRET || process.env.SANITY_WEBHOOK_SECRET;

function isAuthorized(request: NextRequest) {
  if (!SECRET) {
    return false;
  }

  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const headerSecret = request.headers.get('x-indexnow-secret');

  return bearer === SECRET || headerSecret === SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as {
    submitAll?: boolean;
    urls?: string[];
  };

  const urls = body.submitAll
    ? (await getSitemap()).map((entry) => entry.url)
    : Array.isArray(body.urls) ? body.urls : [];

  const result = await submitIndexNow(urls);

  return NextResponse.json({
    ...result,
    mode: body.submitAll ? 'sitemap' : 'manual',
  });
}
