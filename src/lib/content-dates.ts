/**
 * Freshness signals for crawlers.
 *
 * Sanity stamps every document with `_updatedAt` on each save, which also fires
 * for trivial edits (a typo, a reordered link). Announcing those as `dateModified`
 * teaches crawlers to discount the signal, so an editor can set `updatedAt`
 * manually to mark a genuinely meaningful revision; it wins when present.
 */
export interface DatedDocument {
  updatedAt?: string;
  _updatedAt?: string;
  publishedAt?: string;
}

function toIso(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** Date to expose as `dateModified` / `modifiedTime` / sitemap `lastmod`. */
export function getModifiedDate(doc?: DatedDocument | null) {
  if (!doc) return undefined;
  return toIso(doc.updatedAt) || toIso(doc._updatedAt) || toIso(doc.publishedAt);
}

/** Date to expose as `datePublished` / `publishedTime`. */
export function getPublishedDate(doc?: DatedDocument | null) {
  if (!doc) return undefined;
  return toIso(doc.publishedAt) || toIso(doc._updatedAt);
}

/** Most recent modified date across a set of documents, for index/static pages. */
export function getLatestModifiedDate(docs: Array<DatedDocument | null | undefined>) {
  const timestamps = docs
    .map((doc) => getModifiedDate(doc))
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime());

  if (!timestamps.length) return undefined;
  return new Date(Math.max(...timestamps)).toISOString();
}
