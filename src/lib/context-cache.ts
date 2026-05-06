import 'server-only';

import { buildAIContext } from '@/lib/ai-context';
import type { Language } from '@/lib/language';

const TTL_MS = 1000 * 60 * 60;

const cache: Partial<Record<Language, { value: string; expiresAt: number }>> = {};

export async function getCachedAIContext(language: Language = 'pl'): Promise<string> {
  const now = Date.now();
  const current = cache[language];

  if (current && current.expiresAt > now) {
    return current.value;
  }

  const value = await buildAIContext(language);
  cache[language] = { value, expiresAt: now + TTL_MS };
  return value;
}
