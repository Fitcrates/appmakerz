import { siteUrl } from '@/lib/site';

const DEFAULT_INDEXNOW_KEY = 'a7b3046128424b9a86c1c9fc931eb0bf';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_REQUEST = 10000;

export type IndexNowResult = {
  submitted: boolean;
  urlCount: number;
  status?: number;
  error?: string;
};

function getIndexNowKey() {
  return process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY;
}

function getHost() {
  return new URL(siteUrl).host;
}

function getKeyLocation() {
  return `${siteUrl}/${getIndexNowKey()}.txt`;
}

function uniqueAbsoluteUrls(urls: string[]) {
  return Array.from(new Set(
    urls
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => {
        try {
          return new URL(url, siteUrl).toString();
        } catch {
          return '';
        }
      })
      .filter((url) => url.startsWith(siteUrl))
  ));
}

export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  const urlList = uniqueAbsoluteUrls(urls).slice(0, MAX_URLS_PER_REQUEST);

  if (!urlList.length) {
    return { submitted: false, urlCount: 0 };
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        host: getHost(),
        key: getIndexNowKey(),
        keyLocation: getKeyLocation(),
        urlList,
      }),
    });

    return {
      submitted: response.ok,
      urlCount: urlList.length,
      status: response.status,
      error: response.ok ? undefined : await response.text().catch(() => response.statusText),
    };
  } catch (error) {
    return {
      submitted: false,
      urlCount: urlList.length,
      error: error instanceof Error ? error.message : 'IndexNow request failed',
    };
  }
}
