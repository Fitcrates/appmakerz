import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import { getAboutMe, urlFor } from '@/lib/sanity.server';
import { getRequestLanguage } from '@/lib/request-language';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const about = await getAboutMe('about-me');

  if (!about?._id) {
    return {
      title: language === 'pl' ? 'O mnie' : 'About me',
      alternates: { canonical: absoluteUrl('/about-me') },
    };
  }

  const title = getLocalizedText(about.title, language, language === 'pl' ? 'O mnie' : 'About me');
  const intro = getLocalizedText(about.intro, language);
  const seoTitle = getLocalizedText(about.seo?.metaTitle, language, title);
  const seoDescription = getLocalizedText(about.seo?.metaDescription, language, intro);
  const canonical = about.seo?.canonicalUrl || absoluteUrl('/about-me');
  const ogImageUrl = about.seo?.ogImage
    ? urlFor(about.seo.ogImage).width(1200).height(630).fit('crop').auto('format').url()
    : about.heroImage
      ? urlFor(about.heroImage).width(1200).height(630).fit('crop').auto('format').url()
      : undefined;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: about.seo?.keywords,
    alternates: { canonical },
    robots: about.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'profile',
      url: canonical,
      title: seoTitle,
      description: seoDescription,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function AboutMePage() {
  const language = await getRequestLanguage();
  const about = await getAboutMe('about-me');

  if (!about?._id) {
    notFound();
  }

  const title = getLocalizedText(about.title, language, language === 'pl' ? 'O mnie' : 'About me');
  const intro = getLocalizedText(about.intro, language);
  const story = getLocalizedArray<any>(about.story, language);
  const highlights = getLocalizedArray<string>(about.highlights, language);
  const ctaProjects = getLocalizedText(about.ctaProjects, language, language === 'pl' ? 'Zobacz projekty' : 'View projects');
  const ctaContact = getLocalizedText(about.ctaContact, language, language === 'pl' ? 'Skontaktuj się' : 'Get in touch');
  const heroImageUrl = about.heroImage ? urlFor(about.heroImage).width(1800).auto('format').url() : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arkadiusz Wawrzyniak',
    url: about.seo?.canonicalUrl || absoluteUrl('/about-me'),
    image: heroImageUrl || undefined,
    jobTitle: 'Fullstack Developer',
    description: intro || undefined,
    sameAs: [],
  };

  return (
    <div className="min-h-screen bg-indigo-950">
      <NextHeader />

      <main className="min-h-screen bg-indigo-950 pt-24 pb-24">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <BurnSpotlightText as="h1" className="text-4xl lg:text-5xl xl:text-6xl font-light text-white font-jakarta leading-tight" glowSize={200} baseDelay={200}>
            {title}
          </BurnSpotlightText>
          <div className="border-t border-white/10 pt-6 sm:pt-14 mt-6">
            {intro ? <p className="text-white/60 text-lg font-jakarta font-light mt-8 leading-relaxed">{intro}</p> : null}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="space-y-6 order-2 lg:order-1">
              {highlights.length ? (
                <div className="border border-white/10 p-6 sm:p-8 bg-white/[0.02]">
                  <h2 className="text-2xl font-light text-white font-jakarta mb-5">{language === 'pl' ? 'Najważniejsze' : 'Highlights'}</h2>
                  <ul className="space-y-3">
                    {highlights.map((item, index) => (
                      <li key={`${item}-${index}`} className="text-white/70 font-jakarta font-light flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-teal-300 rounded-full mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="border border-white/10 p-6 sm:p-8 bg-white/[0.02]">
                <h3 className="text-white font-jakarta text-xl font-light mb-6">{language === 'pl' ? 'Przejdź dalej' : 'Continue exploring'}</h3>
                <div className="flex flex-col space-y-4">
                  <PrefetchLink href="/#services" className="group inline-flex items-center gap-3 text-white font-jakarta hover:text-teal-300 transition-colors">
                    <span>{ctaProjects}</span>
                  </PrefetchLink>
                  <PrefetchLink href="/#contact" className="group inline-flex items-center gap-3 text-white font-jakarta hover:text-teal-300 transition-colors">
                    <span>{ctaContact}</span>
                  </PrefetchLink>
                </div>
              </div>
            </div>

            {heroImageUrl ? (
              <div className="order-1 lg:order-2 lg:sticky lg:top-28">
                <div className="relative w-full max-w-sm mx-auto lg:max-w-none aspect-[4/5]">
                  <div className="absolute inset-0 overflow-hidden border border-white/10 bg-white/[0.02]">
                    <img
                      src={heroImageUrl}
                      alt={about.heroImage?.alt || title}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {story.length ? (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="border-t border-white/10 pt-10">
              <PortableText value={story} components={portableTextComponentsServer} />
            </div>
          </section>
        ) : null}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>

      <NextFooter />
    </div>
  );
}
