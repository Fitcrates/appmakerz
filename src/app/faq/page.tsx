import type { Metadata } from 'next';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import PrefetchLink from '@/components/next/PrefetchLink';
import FaqPageClient from '@/components/next/FaqPageClient';
import { faqContent } from '@/content/faq';
import { getRequestLanguage } from '@/lib/request-language';
import { absoluteUrl } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const content = faqContent[language];
  const canonical = absoluteUrl('/faq');

  return {
    title: content.title,
    description: content.subtitle,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: content.title,
      description: content.subtitle,
    },
  };
}

export default async function FaqPage() {
  const language = await getRequestLanguage();
  const content = faqContent[language];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrefetchLink href="/" className="inline-flex items-center text-white/40 hover:text-teal-300 transition-colors mb-12 group">
            <span className="font-jakarta text-sm">{content.backToHome}</span>
          </PrefetchLink>

          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-white/30 font-jakarta tracking-widest uppercase">{content.knowledgeBase}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-jakarta mb-4">{content.title}</h1>
            <p className="text-white/60 font-jakarta max-w-xl text-lg">{content.subtitle}</p>
          </div>

          <FaqPageClient content={content} />
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </main>

      <NextFooter />
    </div>
  );
}
