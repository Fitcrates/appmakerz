import type { Metadata } from 'next';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import UnsubscribePageClient from '@/components/next/UnsubscribePageClient';
import { getRequestLanguage } from '@/lib/request-language';
import { absoluteUrl } from '@/lib/site';
import { translations } from '@/translations/translations';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const title = translations[language].unsub.title.line1;
  const canonical = absoluteUrl('/unsubscribe');

  return {
    title,
    description: title,
    alternates: { canonical },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />
      <UnsubscribePageClient />
      <NextFooter />
    </div>
  );
}
