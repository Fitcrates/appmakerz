import Image from 'next/image';
import { getLocalizedText } from '@/lib/localize';
import type { Language } from '@/lib/language';
import type { HubMediaEntry, HubMediaPlacement } from '@/types/sanity.types';

interface HubMediaProps {
  entries: HubMediaEntry[];
  slot: HubMediaPlacement;
  language: Language;
  /** Pre-resolved Sanity URLs, keyed by the entry's position in the array. */
  urls: Record<number, string>;
}

// A slot that renders only when the editor has actually put something in it.
// Placing these between sections rather than inside them means adding or
// removing a picture never disturbs the surrounding layout.
export default function HubMedia({ entries, slot, language, urls }: HubMediaProps) {
  const items = entries
    .map((entry, index) => ({ entry, url: urls[index] }))
    .filter(({ entry, url }) => entry?.placement === slot && Boolean(url));

  if (!items.length) {
    return null;
  }

  return (
    <section className="border-t border-white/10 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {items.map(({ entry, url }, index) => {
          const caption = getLocalizedText(entry.caption, language);
          const alt = entry.image?.alt || caption || '';

          return (
            <figure
              key={`${slot}-${index}`}
              className={`${index > 0 ? 'mt-12' : ''} ${entry.wide ? '' : 'mx-auto max-w-4xl'}`}
            >
              {/* `contain` so a device mockup or a tall screenshot is never
                  cropped just to fill the frame. */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={url}
                  alt={alt}
                  unoptimized
                  fill
                  sizes="(max-width: 1279px) calc(100vw - 32px), 1120px"
                  className="object-contain object-center"
                />
              </div>
              {caption ? (
                <figcaption className="mt-4 text-center font-plex text-sm font-light text-white/45">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
