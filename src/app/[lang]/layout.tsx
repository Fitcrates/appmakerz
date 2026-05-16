import { notFound } from 'next/navigation';
import NextProviders from '@/components/next/NextProviders';
import { SUPPORTED_LANGUAGES, isLanguage, type Language } from '@/lib/language';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LanguageLayout({ children, params }: LanguageLayoutProps) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  return <NextProviders initialLanguage={lang as Language}>{children}</NextProviders>;
}
