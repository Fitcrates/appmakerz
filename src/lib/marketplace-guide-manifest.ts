import guideManifest from '@/content/marketplace-guide/manifest.json';

export const MARKETPLACE_GUIDE_REVIEWED_AT = guideManifest.reviewedAt;
export const MARKETPLACE_GUIDE_SLUGS = guideManifest.chapters.map((chapter) => chapter.slug);

