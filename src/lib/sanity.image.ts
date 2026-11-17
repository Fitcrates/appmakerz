import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('Missing Sanity image configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.');
}

const builder = createImageUrlBuilder({
  projectId,
  dataset,
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
