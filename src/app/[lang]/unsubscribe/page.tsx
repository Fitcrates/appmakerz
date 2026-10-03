import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import UnsubscribePageClient from '@/components/next/UnsubscribePageClient';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, type Language } from '@/lib/language';
import { translations } from '@/translations/translations';

interface LocalizedUnsubscribePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LocalizedUnsubscribePageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  const language = lang as Language;
  const title = translations[language].unsub.title.line1;
  const canonical = absoluteUrl(localizedPath(language, '/unsubscribe'));

  return {
    title,
    description: title,
    alternates: { canonical },
    robots: { index: false, follow: false },
  };
}

export default async function LocalizedUnsubscribePage({ params }: LocalizedUnsubscribePageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />
      {/* useSearchParams() needs its own boundary. It used to borrow the one
          from [lang]/loading.tsx, which was removed because that boundary made
          every page stream and answer unknown slugs with 200 instead of 404. */}
      <Suspense fallback={null}>
        <UnsubscribePageClient />
      </Suspense>
      <NextFooter />
    </div>
  );
}
