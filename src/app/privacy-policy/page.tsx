import type { Metadata } from 'next';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import { privacyPolicyContent } from '@/content/privacy-policy';
import { getRequestLanguage } from '@/lib/request-language';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const content = privacyPolicyContent[language];
  const canonical = absoluteUrl('/privacy-policy');

  return {
    title: content.title,
    description: content.sections[0]?.paragraphs[0],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: content.title,
      description: content.sections[0]?.paragraphs[0],
    },
  };
}

export default async function PrivacyPolicyPage() {
  const language = await getRequestLanguage();
  const content = privacyPolicyContent[language];

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="inline-flex items-center text-white/40 hover:text-teal-300 transition-colors mb-12 group">
            <span className="font-jakarta text-sm">{content.backToHome}</span>
          </a>

          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-white/30 font-jakarta tracking-widest uppercase">{content.legalLabel}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-jakarta mb-4">{content.title}</h1>
            <p className="text-white/40 font-jakarta">{content.lastUpdated}</p>
          </div>

          <div className="space-y-12">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl sm:text-2xl font-light text-white font-jakarta mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-white/60 font-jakarta leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <NextFooter />
    </div>
  );
}
