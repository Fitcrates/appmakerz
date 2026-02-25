import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
});

export function urlFor(source: any) {
  return builder.image(source);
}
