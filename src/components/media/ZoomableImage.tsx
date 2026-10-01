'use client';

import { useImageLightbox, type LightboxItem } from '@/components/media/ImageLightbox';
import type { Language } from '@/lib/language';

export type { LightboxItem };

/**
 * An inline image that zooms to full screen on click. `group` is the set it
 * belongs to (browsable with the arrows), `index` its place in it.
 */
export default function ZoomableImage({
  src,
  alt,
  className = '',
  language,
  group,
  index = 0,
  rounded = true,
}: {
  src: string;
  alt: string;
  className?: string;
  language?: Language;
  group: LightboxItem[];
  index?: number;
  /** Off when a surrounding frame does the rounding. */
  rounded?: boolean;
}) {
  const { open, lightbox } = useImageLightbox(group, language);

  return (
    <>
      <button
        type="button"
        onClick={() => open(index)}
        aria-label={alt}
        aria-haspopup="dialog"
        className={`group/zoom block w-full cursor-zoom-in overflow-hidden ${rounded ? 'rounded-xl' : ''} focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950`}
      >
        <img
          src={src}
          alt={alt}
          className={`transition-transform duration-500 group-hover/zoom:scale-[1.01] ${className}`}
          loading="lazy"
          decoding="async"
          data-zoom-src={group[index]?.fullSrc}
        />
      </button>
      {lightbox}
    </>
  );
}
