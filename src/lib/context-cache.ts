import 'server-only';

import { buildAIContextIndex, selectAIContext } from '@/lib/ai-context';
import type { Language } from '@/lib/language';

const TTL_MS = 1000 * 60 * 60;

type CachedContextIndex = Awaited<ReturnType<typeof buildAIContextIndex>>;

const cache: Partial<Record<Language, { value: CachedContextIndex; expiresAt: number }>> = {};

export async function getCachedAIContext(language: Language = 'pl', query: string = ''): Promise<string> {
  const now = Date.now();
  const current = cache[language];

  if (current && current.expiresAt > now) {
    return selectAIContext(current.value, query, language);
  }

  const value = await buildAIContextIndex(language);
  cache[language] = { value, expiresAt: now + TTL_MS };
  return selectAIContext(value, query, language);
}
