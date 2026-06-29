import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import ChatWidget from '@/components/next/ChatWidget';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import CyberPhilosophyLayout, { type CyberPhilosophyContent } from '@/components/new/CyberPhilosophyLayout';
import type { PhilosophyProcessStep } from '@/components/new/PhilosophyProcess';
import { getAboutMe, urlFor } from '@/lib/sanity.server';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, type Language } from '@/lib/language';
import { getImageAlt } from '@/lib/image-alt';
import {
  DEFAULT_SOCIAL_IMAGE,
  getSanitySocialImageUrl,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from '@/lib/seo';

interface LocalizedAboutMePageProps {
  params: Promise<{ lang: string }>;
}

type LocalizedSanityCard = {
  _key?: string;
  title?: string;
  description?: string;
  image?: any;
};

function getSanityImageUrl(image: any, width: number = 1800): string | undefined {
  return image ? urlFor(image).width(width).auto('format').url() : undefined;
}

function getLocalizedCards(value: unknown, language: Language) {
  return getLocalizedArray<LocalizedSanityCard>(value, language)
    .map((card) => ({
      title: card.title || '',
      desc: card.description || '',
    }))
    .filter((card) => card.title || card.desc);
}

function getLocalizedImageCards(value: unknown, language: Language) {
  return getLocalizedArray<LocalizedSanityCard>(value, language)
    .map((card) => ({
      title: card.title || '',
      desc: card.description || '',
      img: getSanityImageUrl(card.image, 900),
      alt: card.image ? getImageAlt(card.image, card.title || '') : undefined,
    }))
    .filter((card) => card.title || card.desc);
}

export const revalidate = 3600;
export const dynamic = 'force-static';

export async function generateMetadata({ params }: LocalizedAboutMePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const about = await getAboutMe('about-me');
  const fallbackTitle = language === 'pl' ? 'O mnie' : 'About me';

  if (!about?._id) {
    return { title: fallbackTitle, alternates: { canonical: absoluteUrl(localizedPath(language, '/about-me')) } };
  }

  const title = getLocalizedText(about.title, language, fallbackTitle);
  const intro = getLocalizedText(about.intro, language);
  const seoTitle = getLocalizedText(about.seo?.metaTitle, language, title);
  const seoDescription = getLocalizedText(about.seo?.metaDescription, language, intro);
  const canonical = about.seo?.canonicalUrl || absoluteUrl(localizedPath(language, '/about-me'));
  const ogImageUrl = about.seo?.ogImage
    ? getSanitySocialImageUrl(about.seo.ogImage)
    : about.heroImage
      ? getSanitySocialImageUrl(about.heroImage)
      : DEFAULT_SOCIAL_IMAGE;
  const imageAlt = getImageAlt(about.seo?.ogImage || about.heroImage, seoTitle);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: about.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/about-me')),
        pl: absoluteUrl(localizedPath('pl', '/about-me')),
        'x-default': absoluteUrl(localizedPath('pl', '/about-me')),
      },
    },
    robots: about.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'profile',
      url: canonical,
      title: seoTitle,
      description: seoDescription,
      siteName: 'AppCrates',
      images: [
        {
          url: ogImageUrl,
          width: SOCIAL_IMAGE_WIDTH,
          height: SOCIAL_IMAGE_HEIGHT,
          alt: imageAlt,
        },
      ],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [{ url: ogImageUrl, alt: imageAlt }],
    },
  };
}

export default async function LocalizedAboutMePage({ params }: LocalizedAboutMePageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const about = await getAboutMe('about-me');

  if (!about?._id) {
    notFound();
  }

  const intro = getLocalizedText(about.intro, language);
  const highlights = getLocalizedArray<{ _key?: string; label?: string; url?: string } | string>(
    about.highlights,
    language,
  );
  const heroImageUrl = about.heroImage ? urlFor(about.heroImage).width(1800).auto('format').url() : '';
  const content: CyberPhilosophyContent = {
    hero: {
      eyebrow: getLocalizedText(about.hero?.eyebrow, language),
      title: getLocalizedText(about.hero?.title, language),
      accent: getLocalizedText(about.hero?.accent, language),
      subtitle: getLocalizedText(about.hero?.subtitle, language),
      question: getLocalizedText(about.hero?.question, language),
      portrait: getSanityImageUrl(about.hero?.portrait, 900),
      portraitAlt: about.hero?.portrait ? getImageAlt(about.hero.portrait, 'Arkadiusz Wawrzyniak') : undefined,
      mindLabels: getLocalizedArray<string>(about.hero?.mindLabels, language),
    },
    founderStatement: {
      headline: getLocalizedText(about.founderStatement?.headline, language),
      accent: getLocalizedText(about.founderStatement?.accent, language),
      paragraphs: getLocalizedArray<string>(about.founderStatement?.paragraphs, language),
    },
    principlesSection: {
      eyebrow: getLocalizedText(about.principlesSection?.eyebrow, language),
      title: getLocalizedText(about.principlesSection?.title, language),
      accent: getLocalizedText(about.principlesSection?.accent, language),
      cards: getLocalizedCards(about.principlesSection?.cards, language),
    },
    processSection: {
      eyebrow: getLocalizedText(about.processSection?.eyebrow, language),
      title: getLocalizedText(about.processSection?.title, language),
      accent: getLocalizedText(about.processSection?.accent, language),
      steps: getLocalizedArray<PhilosophyProcessStep>(about.processSection?.steps, language),
    },
    beyondCodeSection: {
      eyebrow: getLocalizedText(about.beyondCodeSection?.eyebrow, language),
      title: getLocalizedText(about.beyondCodeSection?.title, language),
      accent: getLocalizedText(about.beyondCodeSection?.accent, language),
      cards: getLocalizedImageCards(about.beyondCodeSection?.cards, language),
    },
    ctaSection: {
      headlineLines: getLocalizedArray<string>(about.ctaSection?.headlineLines, language),
      accent: getLocalizedText(about.ctaSection?.accent, language),
      highlights: getLocalizedArray<{ _key?: string; label?: string; url?: string } | string>(
        about.ctaSection?.highlights,
        language,
      ),
      primaryButton: getLocalizedText(about.ctaSection?.primaryButton, language),
      secondaryButton: getLocalizedText(about.ctaSection?.secondaryButton, language),
    },
    backgrounds: {
      hero: getSanityImageUrl(about.backgrounds?.hero, 1800),
      process: getSanityImageUrl(about.backgrounds?.process, 1800),
      beyondCode: getSanityImageUrl(about.backgrounds?.beyondCode, 1800),
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arkadiusz Wawrzyniak',
    url: absoluteUrl(localizedPath(language, '/about-me')),
    image: heroImageUrl || undefined,
    jobTitle: 'Fullstack Developer',
    description: intro || undefined,
  };

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />
      <main className="-mb-px min-h-screen bg-indigo-950">
        <CyberPhilosophyLayout language={language} highlights={highlights} content={content} />
        <Script id="person-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
      <div className="relative z-10 bg-indigo-950">
        <NextFooter />
      </div>
      <ChatWidget />
    </div>
  );
}
