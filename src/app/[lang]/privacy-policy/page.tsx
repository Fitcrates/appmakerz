import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import PrefetchLink from '@/components/next/PrefetchLink';
import ChatWidget from '@/components/next/ChatWidget';
import { privacyPolicyContent } from '@/content/privacy-policy';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';

interface LocalizedPrivacyPolicyPageProps {
  params: Promise<{ lang: string }>;
}

export const revalidate = 86400;
export const dynamic = 'force-static';

export async function generateMetadata({ params }: LocalizedPrivacyPolicyPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const content = privacyPolicyContent[language];
  const canonical = absoluteUrl(localizedPath(language, '/privacy-policy'));
  const description = content.sections[0]?.paragraphs[0];

  return {
    title: content.title,
    description,
    keywords: language === 'pl'
      ? ['polityka prywatności', 'rodo', 'gdpr', 'appcrates']
      : ['privacy policy', 'gdpr', 'appcrates'],
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', '/privacy-policy')),
        pl: absoluteUrl(localizedPath('pl', '/privacy-policy')),
        'x-default': absoluteUrl(localizedPath('pl', '/privacy-policy')),
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title: content.title,
      description,
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
      description,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: content.title }],
    },
  };
}

export default async function LocalizedPrivacyPolicyPage({ params }: LocalizedPrivacyPolicyPageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const content = privacyPolicyContent[language];

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrefetchLink href={localizedPath(language, '/')} className="inline-flex items-center text-white/70 hover:text-teal-300 transition-colors mb-12 group">
            <span className=" text-sm">{content.backToHome}</span>
          </PrefetchLink>
          <div className="mb-16">
            <span className="text-xs text-white/30 tracking-widest uppercase">{content.legalLabel}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-oxanium font-light mb-4 mt-6">{content.title}</h1>
            <p className="text-white/70">{content.lastUpdated}</p>
          </div>
          <div className="space-y-12">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl sm:text-2xl text-white font-oxanium font-light mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-white/60 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <NextFooter />
      <ChatWidget />
    </div>
  );
}
