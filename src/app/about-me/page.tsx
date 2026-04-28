import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import SpotlightText from "@/components/new/SpotlightText";

import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import { getAboutMe, urlFor } from '@/lib/sanity.server';
import { getRequestLanguage } from '@/lib/request-language';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getRequestLanguage();
  const about = await getAboutMe('about-me');

  if (!about?._id) {
    return {
      title: language === 'pl' ? 'O mnie' : 'About me',
      alternates: { canonical: absoluteUrl('/about-me') },
    };
  }

  const title = getLocalizedText(
    about.title,
    language,
    language === 'pl' ? 'O mnie' : 'About me'
  );
  const intro = getLocalizedText(about.intro, language);
  const seoTitle = getLocalizedText(
    about.seo?.metaTitle,
    language,
    title
  );
  const seoDescription = getLocalizedText(
    about.seo?.metaDescription,
    language,
    intro
  );
  const canonical =
    about.seo?.canonicalUrl || absoluteUrl('/about-me');
  const ogImageUrl = about.seo?.ogImage
    ? urlFor(about.seo.ogImage)
      .width(1200)
      .height(630)
      .fit('crop')
      .auto('format')
      .url()
    : about.heroImage
      ? urlFor(about.heroImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .auto('format')
        .url()
      : undefined;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: about.seo?.keywords,
    alternates: { canonical },
    robots: about.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
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

  const title = getLocalizedText(
    about.title,
    language,
    language === 'pl' ? 'O mnie' : 'About me'
  );
  const intro = getLocalizedText(about.intro, language);
  const story = getLocalizedArray<any>(about.story, language);
  const highlights = getLocalizedArray<string>(
    about.highlights,
    language
  );
  const ctaProjects = getLocalizedText(
    about.ctaProjects,
    language,
    language === 'pl' ? 'Zobacz projekty' : 'View projects'
  );
  const ctaContact = getLocalizedText(
    about.ctaContact,
    language,
    language === 'pl' ? 'Skontaktuj się' : 'Get in touch'
  );
  const heroImageUrl = about.heroImage
    ? urlFor(about.heroImage).width(1800).auto('format').url()
    : '';

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
        {/* Hero section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
          <div className="grid lg:grid-cols-2 gap-2 lg:gap-16 items-center">
            {/* Right: logo on mobile first, text content */}
            <div className="order-2 lg:order-2">

              <div className="mt-0 md:mt-8">
                <BurnSpotlightText
                  as="h1"
                  className="text-5xl sm:text-6xl lg:text-8xl font-light text-white font-jakarta leading-tight"
                  glowSize={200}
                  baseDelay={200}
                >
                  {title}
                </BurnSpotlightText>
              </div>

              {intro ? (
                <SpotlightText
                  text={intro}
                  className="text-white/40 font-jakarta font-light text-lg max-w-xl mt-8 leading-relaxed"
                  glowSize={200}

                />
              ) : null}

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <PrefetchLink
                  href="/#services"
                  className="group relative px-10 py-5 bg-teal-300 text-indigo-950 font-jakarta font-medium overflow-hidden transition-all duration-500 min-w-[230px] text-center hover:shadow-[0_0_60px_rgba(94,234,212,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                >
                  <span className="relative z-10">{ctaProjects}</span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </PrefetchLink>

                <PrefetchLink
                  href="/#contact"
                  className="group px-10 py-5 border border-white/20 text-white font-jakarta font-medium hover:border-teal-300 transition-all duration-500 relative overflow-hidden min-w-[230px] text-center focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                >
                  <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">
                    {ctaContact}
                  </span>
                  <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </PrefetchLink>
              </div>
            </div>

            {/* Left: logo */}
            <div className="order-1 lg:order-1 flex justify-center lg:justify-start">
              <img
                src="/media/AppcratesLogo.webp"
                alt="AppCrates Logo"
                className="w-40 lg:w-full max-w-sm lg:max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        {/* Photo + Highlights */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/10 pt-16">
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              {/* Photo — 2 cols */}
              {heroImageUrl ? (
                <div className="lg:col-span-2 lg:sticky lg:top-28">
                  <div className="relative w-full max-w-xs mx-auto lg:max-w-none aspect-[3/4] overflow-hidden">
                    <img
                      src={heroImageUrl}
                      alt={about.heroImage?.alt || title}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                    <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-teal-300/30" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-teal-300/30" />
                  </div>

                  <div className="mt-6 text-center lg:text-left">
                    <p className="text-white font-jakarta text-lg font-light">
                      Arkadiusz Wawrzyniak
                    </p>
                    <p className="text-teal-300/60 font-jakarta text-sm mt-1">
                      Fullstack Web Developer
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Info — 3 cols */}
              <div
                className={
                  heroImageUrl
                    ? 'lg:col-span-3 space-y-8'
                    : 'lg:col-span-5 space-y-8'
                }
              >
                {/* Highlights */}
                {highlights.length ? (
                  <div>
                    <SpotlightText
                      as="h2"
                      className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta mb-8"
                    >
                      {language === 'pl'
                        ? 'Specjalizacje'
                        : 'Specializations'}
                    </SpotlightText>

                    <div className="space-y-0">
                      {highlights.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="group flex items-center gap-6 py-4 border-b border-white/5 hover:border-teal-300/20 transition-all duration-500 hover:pl-2"
                        >
                          <span className="text-[10px] tracking-[0.2em] text-teal-300/30 font-jakarta tabular-nums group-hover:text-teal-300/70 transition-colors duration-500 notranslate">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-white/50 font-jakarta font-light text-[15px] group-hover:text-white/80 transition-colors duration-500">
                            {item}
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-white/5 to-transparent group-hover:from-teal-300/10 transition-colors duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Story / Portable Text */}
                {story.length ? (
                  <div>
                    <SpotlightText
                      as="h2"
                      className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta mb-6"
                    >
                      {language === 'pl'
                        ? 'Kim jestem'
                        : 'Who am I'}
                    </SpotlightText>
                    <div className="prose prose-invert prose-lg max-w-none font-jakarta font-light prose-p:text-white/60 prose-p:leading-relaxed prose-headings:text-white prose-headings:font-light prose-a:text-teal-300 prose-strong:text-white/80">
                      <PortableText
                        value={story}
                        components={portableTextComponentsServer}
                      />
                    </div>
                  </div>
                ) : null}

                {/* CTA bottom */}
                <div className="border-t border-white/10 pt-10 mt-10">
                  <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                    <SpotlightText
                      as="p"
                      className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta mb-6"
                    >
                      {language === 'pl'
                        ? 'Zainteresowany współpracą?'
                        : 'Interested in working together?'}
                    </SpotlightText>
                    <PrefetchLink
                      href="/#contact"
                      className="group px-10 py-5 border border-white/20 text-white font-jakarta font-medium hover:border-teal-300 transition-all duration-500 relative overflow-hidden min-w-[230px] text-center focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                    >
                      <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">
                        {language === 'pl' ? 'Napisz do mnie' : 'Get in touch'}
                      </span>
                      <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </PrefetchLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </main>

      <NextFooter />
    </div>
  );
}