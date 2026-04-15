type CacheEnvelope<T> = {
  __cacheVersion: 1;
  __cachedAt: number;
  __ttlMs: number;
  value: T;
};

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function setCache(key: string, value: any, ttlMs: number = DEFAULT_TTL_MS) {
  const payload: CacheEnvelope<any> = {
    __cacheVersion: 1,
    __cachedAt: Date.now(),
    __ttlMs: Math.max(1, ttlMs),
    value,
  };

  sessionStorage.setItem(key, JSON.stringify(payload));
}

export function getCache<T>(key: string): T | null {
  const item = sessionStorage.getItem(key);
  if (!item) return null;

  try {
    const parsed = JSON.parse(item);

    // Backward compatibility for older cache entries stored as raw value.
    if (!parsed || parsed.__cacheVersion !== 1) {
      return parsed as T;
    }

    const isExpired = Date.now() - parsed.__cachedAt > parsed.__ttlMs;
    if (isExpired) {
      sessionStorage.removeItem(key);
      return null;
    }

    return parsed.value as T;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
}
