import 'server-only';

import { unstable_cache } from 'next/cache';
import { buildAIContextIndex, selectAIContext } from '@/lib/ai-context';
import type { Language } from '@/lib/language';

type CachedContextIndex = Awaited<ReturnType<typeof buildAIContextIndex>>;

const getPersistedAIContextIndex = unstable_cache(
  async (language: Language): Promise<CachedContextIndex> => buildAIContextIndex(language),
  ['ai-context-index'],
  { revalidate: 3600, tags: ['ai-context'] },
);

const inFlight: Partial<Record<Language, Promise<CachedContextIndex>>> = {};

export async function getCachedAIContext(language: Language = 'pl', query: string = ''): Promise<string> {
  let pending = inFlight[language];

  if (!pending) {
    pending = getPersistedAIContextIndex(language).finally(() => {
      delete inFlight[language];
    });
    inFlight[language] = pending;
  }

  const value = await pending;
  return selectAIContext(value, query, language);
}
