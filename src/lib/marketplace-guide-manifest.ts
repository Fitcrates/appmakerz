import guideManifest from '@/content/marketplace-guide/manifest.json';

/** When the legal sources behind the compliance track were last checked. Shown
 *  to readers; it carries meaning, so editing copy must not move it. */
export const MARKETPLACE_GUIDE_REVIEWED_AT = guideManifest.reviewedAt;

/** When the guide files last changed. This is what the sitemap reports, because
 *  a metadata or wording edit is a change to the page even when no source was
 *  re-reviewed. */
export const MARKETPLACE_GUIDE_UPDATED_AT =
  (guideManifest as { updatedAt?: string }).updatedAt || guideManifest.reviewedAt;
export const MARKETPLACE_GUIDE_SLUGS = guideManifest.chapters.map((chapter) => chapter.slug);

/** Chapters the sitemap should carry. The legal disclaimer is reachable and
 *  linked, but it answers no search query and would only compete with the
 *  substantive chapters. */
export const MARKETPLACE_GUIDE_INDEXABLE_SLUGS = guideManifest.chapters
  .filter((chapter) => !(chapter as { noIndex?: boolean }).noIndex)
  .map((chapter) => chapter.slug);

export const MARKETPLACE_GUIDE_NOINDEX_SLUGS = new Set(
  guideManifest.chapters
    .filter((chapter) => (chapter as { noIndex?: boolean }).noIndex)
    .map((chapter) => chapter.slug)
);

