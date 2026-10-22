import type { PromoPopoutContent, PromoPopoutProps } from '@/components/new/PromoPopout';
import { getImageAlt } from '@/lib/image-alt';
import { getLocalizedText } from '@/lib/localize';
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { getPromoPopout, urlFor } from '@/lib/sanity.server';

// Sanity asset ids end in the original size: image-<hash>-1122x1402-png.
const assetSize = (image: any) => {
  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(image?.asset?._ref ?? '');
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 4, height: 5 };
};

// Resolves the promoPopout document into plain props for both languages, so
// the client panel can follow the language switch without another fetch.
// Any failure only costs the panel, never the page.
export async function getPromoPopoutProps(): Promise<PromoPopoutProps | null> {
  const doc = await getPromoPopout().catch(() => null);
  if (!doc?._id || !doc.href) return null;

  const content = {} as Record<Language, PromoPopoutContent>;
  for (const language of SUPPORTED_LANGUAGES) {
    const title = getLocalizedText(doc.title, language);
    // The other language's graphic beats no graphic.
    const image = doc.image?.[language]?.asset ? doc.image[language] : doc.image?.en?.asset ? doc.image.en : doc.image?.pl;
    const { width, height } = assetSize(image);
    content[language] = {
      // 2x the panel's 20rem, so it stays sharp on retina screens.
      imageUrl: image?.asset ? urlFor(image).width(640).auto('format').quality(85).url() : '',
      imageAlt: getImageAlt(image, title),
      imageWidth: width,
      imageHeight: height,
      eyebrow: getLocalizedText(doc.eyebrow, language),
      title,
      body: getLocalizedText(doc.body, language),
      ctaLabel: getLocalizedText(doc.ctaLabel, language),
      tabLabel: getLocalizedText(doc.tabLabel, language, title),
    };
  }

  if (!content.en.title && !content.pl.title) return null;

  return {
    id: doc._id,
    href: doc.href,
    hideOn: Array.isArray(doc.hideOn) ? doc.hideOn : [],
    delaySeconds: typeof doc.delaySeconds === 'number' ? doc.delaySeconds : 10,
    snoozeDays: typeof doc.snoozeDays === 'number' ? doc.snoozeDays : 14,
    content,
  };
}
