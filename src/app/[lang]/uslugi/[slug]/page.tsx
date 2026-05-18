import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { Check } from 'lucide-react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import FaqAccordionList from '@/components/next/FaqAccordionList';
import PrefetchLink from '@/components/next/PrefetchLink';
import ChatWidget from '@/components/next/ChatWidget';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import { getServiceLanding, getSitemapEntries, urlFor } from '@/lib/sanity.server';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';

interface LocalizedServiceLandingPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const revalidate = 3600;
export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const { serviceLandings } = await getSitemapEntries();

  return SUPPORTED_LANGUAGES.flatMap((lang) => (
    serviceLandings.map((service) => ({
      lang,
      slug: service.slug,
    }))
  ));
}

export async function generateMetadata({ params }: LocalizedServiceLandingPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const landing = await getServiceLanding(slug);

  if (!landing?._id) {
    return {
      title: language === 'pl' ? 'Usługa' : 'Service',
      alternates: { canonical: absoluteUrl(localizedPath(language, '/')) },
    };
  }

  const title = getLocalizedText(landing.title, language);
  const intro = getLocalizedText(landing.intro, language);
  const metaTitle = getLocalizedText(landing.seo?.metaTitle, language, title);
  const metaDescription = getLocalizedText(landing.seo?.metaDescription, language, intro);
  const path = `/uslugi/${landing.slug.current}`;
  const canonical = absoluteUrl(localizedPath(language, path));
  const ogImage = landing.seo?.ogImage
    ? urlFor(landing.seo.ogImage).width(1200).height(630).fit('crop').auto('format').url()
    : landing.heroImage
      ? urlFor(landing.heroImage).width(1200).height(630).fit('crop').auto('format').url()
      : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: landing.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', path)),
        pl: absoluteUrl(localizedPath('pl', path)),
        'x-default': absoluteUrl(localizedPath('pl', path)),
      },
    },
    robots: landing.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
    },
  };
}

export default async function LocalizedServiceLandingPage({ params }: LocalizedServiceLandingPageProps) {
  const { lang, slug } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const landing = await getServiceLanding(slug);

  if (!landing?._id) {
    notFound();
  }

  const title = getLocalizedText(landing.title, language);
  const eyebrow = getLocalizedText(landing.eyebrow, language, language === 'pl' ? 'Usługa' : 'Service');
  const intro = getLocalizedText(landing.intro, language);
  const ctaLabel = getLocalizedText(landing.ctaLabel, language, language === 'pl' ? 'Porozmawiajmy o projekcie' : 'Let\'s talk about your project');
  const ctaSecondaryLabel = getLocalizedText(landing.ctaSecondaryLabel, language, language === 'pl' ? 'Zobacz projekty' : 'View projects');
  const deliverables = getLocalizedArray<string>(landing.deliverables, language);
  const problems = getLocalizedArray<string>(landing.problems, language);
  const stats = getLocalizedArray<{ value: string; label: string }>(landing.stats, language);
  const processSteps = getLocalizedArray<string>(landing.processSteps, language);
  const faq = getLocalizedArray<{ question: string; answer: string }>(landing.faq, language);
  const richContent = getLocalizedArray<any>(landing.content, language);
  const heroImageUrl = landing.heroImage ? urlFor(landing.heroImage).width(1600).auto('format').url() : '';
  const path = `/uslugi/${landing.slug.current}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: language === 'pl' ? 'Strona główna' : 'Home', item: absoluteUrl(localizedPath(language, '/')) },
      { '@type': 'ListItem', position: 2, name: language === 'pl' ? 'Usługi' : 'Services', item: absoluteUrl(localizedPath(language, '/#services')) },
      { '@type': 'ListItem', position: 3, name: title, item: absoluteUrl(localizedPath(language, path)) },
    ],
  };

  const faqSchema = faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null;

  return (
    <>
      <NextHeader />

      <main className="min-h-screen bg-indigo-950">
        <section className="relative min-h-[60vh] lg:min-h-[75vh] flex items-end overflow-hidden">
          {heroImageUrl ? (
            <div className="absolute inset-0 z-0">
              <Image src={heroImageUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-25" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/60 to-indigo-950/40" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-indigo-950" />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 mt-20 w-full">
            <span className="text-xs tracking-[0.3em] uppercase text-teal-300/80 font-plex">{eyebrow}</span>
            <div className="max-w-4xl">
              <BurnSpotlightText as="h1" className="text-4xl sm:text-5xl lg:text-7xl font-light font-oxanium text-white leading-tight" glowSize={200} baseDelay={200} charDelay={25}>
                {title}
              </BurnSpotlightText>
            </div>
            {intro ? (
              <div className="mt-8 max-w-2xl">
                <SpotlightText as="p" className="text-white/60 text-lg sm:text-xl font-light font-plex leading-relaxed" glowSize={150}>
                  {intro}
                </SpotlightText>
              </div>
            ) : null}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <PrefetchLink
                href={localizedPath(language, '/#contact')}
                className="group relative px-10 py-5 bg-teal-300 text-indigo-950 font-normal overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] text-center focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
              >
                <span className="relative z-10">{ctaLabel}</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </PrefetchLink>
              <PrefetchLink
                href={localizedPath(language, '/#projects')}
                className="group px-10 py-5 border border-white/20 text-white font-normal hover:border-teal-300 transition-all duration-500 relative overflow-hidden text-center focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
              >
                <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">
                  {ctaSecondaryLabel}
                </span>
                <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </PrefetchLink>
            </div>
          </div>
        </section>

        {stats.length > 0 ? (
          <section className="border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map((stat: { value: string; label: string }, index: number) => (
                  <div
                    key={`stat-${index}`}
                    className={`py-8 lg:py-10 px-6 ${index > 0 ? 'border-l border-white/10' : ''}`}
                  >
                    <p className="text-3xl sm:text-4xl font-light font-oxanium text-teal-300 notranslate">
                      {stat.value}
                    </p>
                    <p className="text-white/50 text-sm mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {problems.length > 0 ? (
          <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs tracking-[0.3em] uppercase text-white/30">
                {language === 'pl' ? 'Brzmi znajomo?' : 'Sound familiar?'}
              </span>
              <div className="mt-4 mb-16 max-w-3xl">
                <BurnSpotlightText
                  as="h2"
                  className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium"
                  glowSize={180}
                  baseDelay={100}
                  charDelay={30}
                >
                  {language === 'pl'
                    ? 'Problemy, które rozwiązuję'
                    : 'Problems I solve'}
                </BurnSpotlightText>
              </div>

              <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06] overflow-hidden">
                {problems.map((item: string, index: number) => (
                  <div
                    key={`prob-${index}`}
                    className="group relative bg-indigo-950 p-8 sm:p-10 hover:bg-white/[0.03] transition-all duration-700"
                  >
                    {/* Animated corner accents */}
                    <div className="absolute top-0 left-0 w-0 h-px bg-red-400/60 group-hover:w-16 transition-all duration-500" />
                    <div className="absolute top-0 left-0 w-px h-0 bg-red-400/60 group-hover:h-16 transition-all duration-500" />
                    <div className="absolute bottom-0 right-0 w-0 h-px bg-red-400/60 group-hover:w-16 transition-all duration-500" />
                    <div className="absolute bottom-0 right-0 w-px h-0 bg-red-400/60 group-hover:h-16 transition-all duration-500" />

                    {/* Number with red glow pulse */}
                    <span className="relative text-5xl font-extralight notranslate mb-5 block w-fit bg-red-600 bg-clip-text text-transparent group-hover:animate-pulse">
                      <span className="absolute inset-0 bg-red-600 bg-clip-text text-transparent blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-700" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <SpotlightText
                      as="p"
                      className="text-white/60 font-light leading-relaxed group-hover:text-white/85 transition-colors duration-500"
                      glowSize={120}
                    >
                      {item}
                    </SpotlightText>

                    {/* Bottom glow on hover */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-400/0 to-transparent group-hover:via-red-400/40 transition-all duration-700"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {deliverables.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-white/30">{language === 'pl' ? 'W pakiecie' : "What's included"}</span>
                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white">{language === 'pl' ? 'Co dostajesz' : 'What you get'}</h2>
              </div>
              <div>
                {deliverables.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-start gap-4 py-5 border-b border-white/10">
                    <div className="w-6 h-6 rounded-full bg-teal-300/10 border border-teal-300/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-teal-300" />
                    </div>
                    <p className="text-white/70 font-light font-plex leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {processSteps.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white mb-12">{language === 'pl' ? 'Proces współpracy' : 'Process'}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={`${step}-${index}`} className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 h-full">
                    <span className="text-teal-300 text-xs notranslate">{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-white/75 font-light font-plex leading-relaxed mt-4">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {richContent.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert">
              <PortableText value={richContent} components={portableTextComponentsServer} />
            </div>
          </section>
        ) : null}

        {faq.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-light font-oxanium text-white text-center mb-12">{language === 'pl' ? 'Często zadawane pytania' : 'Frequently asked questions'}</h2>
              <div className="border-t border-white/10">
                <FaqAccordionList items={faq} />
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-20 lg:py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white" glowSize={200} baseDelay={100} charDelay={30}>
                {language === 'pl' ? 'Gotowy, żeby zacząć?' : 'Ready to get started?'}
              </BurnSpotlightText>
            </div>
            <div className="mb-10 max-w-2xl mx-auto">
              <SpotlightText as="p" className="text-white/50 font-light font-plex text-lg" glowSize={150}>
                {language === 'pl'
                  ? 'Porozmawiajmy o Twoim projekcie. Bezpłatna konsultacja, bez zobowiązań.'
                  : "Let's talk about your project. Free consultation, no obligations."}
              </SpotlightText>
            </div>
            <PrefetchLink
              href={localizedPath(language, '/#contact')}
              className="group relative inline-block px-12 py-5 bg-teal-300 text-indigo-950 font-normal overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
            >
              <span className="relative z-10">{ctaLabel}</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </PrefetchLink>
          </div>
        </section>
      </main>

      <NextFooter />
      <ChatWidget />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </>
  );
}
