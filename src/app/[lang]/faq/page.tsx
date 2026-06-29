import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import PrefetchLink from '@/components/next/PrefetchLink';
import FaqPageClient from '@/components/next/FaqPageClient';
import ChatWidget from '@/components/next/ChatWidget';
import { faqContent } from '@/content/faq';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';

interface LocalizedFaqPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 86400;
export const dynamic = 'force-static';

export async function generateMetadata({ params }: LocalizedFaqPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const content = faqContent[language];
  const canonical = absoluteUrl(localizedPath(language, '/faq'));

  return {
    title: content.title,
    description: content.subtitle,
    keywords: language === 'pl'
      ? ['faq', 'często zadawane pytania', 'web development', 'appcrates']
      : ['faq', 'frequently asked questions', 'web development', 'appcrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/faq')),
        pl: absoluteUrl(localizedPath('pl', '/faq')),
        'x-default': absoluteUrl(localizedPath('pl', '/faq')),
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title: content.title,
      description: content.subtitle,
      siteName: 'AppCrates',
      images: [{
        url: DEFAULT_SOCIAL_IMAGE,
        width: SOCIAL_IMAGE_WIDTH,
        height: SOCIAL_IMAGE_HEIGHT,
        alt: content.title,
        type: 'image/png',
      }],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.subtitle,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: content.title }],
    },
  };
}

export default async function LocalizedFaqPage({ params }: LocalizedFaqPageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const content = faqContent[language];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrefetchLink href={localizedPath(language, '/')} className="inline-flex items-center text-white/70 hover:text-teal-300 transition-colors mb-12 group">
            <span className=" text-sm">{content.backToHome}</span>
          </PrefetchLink>
          <div className="mb-16">
            <span className="text-xs text-white/30 tracking-widest uppercase">{content.knowledgeBase}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4 mt-6">{content.title}</h1>
            <p className="text-white/60 max-w-xl text-lg">{content.subtitle}</p>
          </div>
          <FaqPageClient content={content} />
        </div>
        <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </main>
      <NextFooter />
      <ChatWidget />
    </div>
  );
}
