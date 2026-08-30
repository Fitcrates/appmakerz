import 'server-only';

import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  limited: boolean;
  remaining: number;
  resetAt: number;
};

const fallback = new Map<string, RateLimitState>();
const STORE_NAME = 'appcrates-rate-limits';
const MAX_CAS_ATTEMPTS = 4;

export function getRequestIp(request: Request) {
  return request.headers.get('x-nf-client-connection-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown';
}

function hashKey(scope: string, identifier: string) {
  return createHash('sha256').update(`${scope}:${identifier}`).digest('hex');
}

function checkFallback(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = fallback.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    fallback.set(key, { count: 1, resetAt });

    if (fallback.size > 2_000) {
      for (const [candidateKey, value] of fallback) {
        if (value.resetAt <= now) fallback.delete(candidateKey);
      }
    }

    return { limited: false, remaining: Math.max(0, limit - 1), resetAt };
  }

  if (current.count >= limit) {
    return { limited: true, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { limited: false, remaining: Math.max(0, limit - current.count), resetAt: current.resetAt };
}

export async function checkServerRateLimit(input: {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  const key = hashKey(input.scope, input.identifier);

  try {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' });

    for (let attempt = 0; attempt < MAX_CAS_ATTEMPTS; attempt += 1) {
      const now = Date.now();
      const current = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' }) as
        | { data: RateLimitState; etag: string }
        | null;

      if (!current || current.data.resetAt <= now) {
        const resetAt = now + input.windowMs;
        const next = { count: 1, resetAt };
        const write = current?.etag
          ? await store.setJSON(key, next, { onlyIfMatch: current.etag })
          : await store.setJSON(key, next, { onlyIfNew: true });

        if (write.modified) {
          return { limited: false, remaining: Math.max(0, input.limit - 1), resetAt };
        }

        continue;
      }

      if (current.data.count >= input.limit) {
        return { limited: true, remaining: 0, resetAt: current.data.resetAt };
      }

      const nextCount = current.data.count + 1;
      const write = await store.setJSON(
        key,
        { count: nextCount, resetAt: current.data.resetAt },
        { onlyIfMatch: current.etag },
      );

      if (write.modified) {
        return {
          limited: false,
          remaining: Math.max(0, input.limit - nextCount),
          resetAt: current.data.resetAt,
        };
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Distributed rate limit unavailable; using process-local fallback.', error);
    }
  }

  return checkFallback(key, input.limit, input.windowMs);
}
