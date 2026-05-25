import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import ChatWidget from '@/components/next/ChatWidget';
import PrefetchLink from '@/components/next/PrefetchLink';
import PricingCalculator from '@/components/calculator/PricingCalculator';
import { pricingCopy } from '@/data/pricing-copy';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';
import { translations } from '@/translations/translations';

interface LocalizedCalculatorPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 86400;
export const dynamic = 'force-static';

export async function generateMetadata({ params }: LocalizedCalculatorPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const t = translations[language].calculator;
  const canonical = absoluteUrl(localizedPath(language, '/kalkulator'));

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: language === 'pl'
      ? ['kalkulator wyceny', 'cena strony www', 'koszt sklepu internetowego', 'wycena projektu', 'appcrates']
      : ['pricing calculator', 'website cost', 'ecommerce price', 'project estimate', 'appcrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/kalkulator')),
        pl: absoluteUrl(localizedPath('pl', '/kalkulator')),
        'x-default': absoluteUrl(localizedPath('pl', '/kalkulator')),
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: t.meta.title,
      description: t.meta.description,
      siteName: 'AppCrates',
      images: [{
        url: DEFAULT_SOCIAL_IMAGE,
        width: SOCIAL_IMAGE_WIDTH,
        height: SOCIAL_IMAGE_HEIGHT,
        alt: t.meta.title,
        type: 'image/png',
      }],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: t.meta.title }],
    },
  };
}

export default async function LocalizedCalculatorPage({ params }: LocalizedCalculatorPageProps) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const t = translations[language].calculator;
  const disclaimer = pricingCopy[language].disclaimer;

  return (
    <div className="min-h-screen bg-indigo-950 text-white">
      <NextHeader />
      <main className="relative overflow-hidden pt-32 pb-24">
       
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10" aria-hidden="true" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10" aria-hidden="true" />

        <section className="relative z-10 mx-auto mb-16 max-w-5xl px-4 sm:px-6 lg:px-8">
          <PrefetchLink href={localizedPath(language, '/')} className="mb-12 inline-flex text-sm text-white/40 transition-colors hover:text-teal-300">
            {t.page.backHome}
          </PrefetchLink>
          <span className="block text-xs uppercase tracking-[0.3em] text-white/30">{t.page.label}</span>
          <h1 className="mt-6 max-w-4xl font-oxanium text-4xl font-light leading-[1.15] text-white sm:text-6xl lg:text-7xl">
            {t.page.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/60">
            {t.page.subtitle}
          </p>
          <p className="mt-4 max-w-2xl border-l border-teal-300/40 pl-4 text-sm font-light leading-relaxed text-white/45">
            {disclaimer}
          </p>
        </section>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <PricingCalculator />
        </div>
      </main>
      <NextFooter />
      <ChatWidget />
    </div>
  );
}
