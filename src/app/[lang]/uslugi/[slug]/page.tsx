import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { PortableText } from '@portabletext/react';
import { ArrowUpRight } from 'lucide-react';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import FaqAccordionList from '@/components/next/FaqAccordionList';
import PrefetchLink from '@/components/next/PrefetchLink';
import ChatWidget from '@/components/next/ChatWidget';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import ServiceDeliverablesNew from '@/components/new/ServiceDeliverablesNew';
import ServiceProcessNew from '@/components/new/ServiceProcessNew';
import HeroPulsePath from '@/components/new/HeroPulsePath';
import { portableTextComponentsServer } from '@/components/next/PortableTextComponentsServer';
import { getPosts, getProjects, getServiceLanding, getServiceLandings, getSitemapEntries, urlFor } from '@/lib/sanity.server';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { getImageAlt } from '@/lib/image-alt';
import {
  DEFAULT_SOCIAL_IMAGE,
  getSanitySocialImageUrl,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from '@/lib/seo';
import type { Post, Project, ServiceLanding } from '@/types/sanity.types';

interface LocalizedServiceLandingPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const STOP_WORDS = new Set([
  'and', 'or', 'the', 'for', 'with', 'your', 'you', 'from', 'that', 'this', 'are', 'can', 'how',
  'oraz', 'dla', 'bez', 'jak', 'czy', 'ktore', 'które', 'twoj', 'twój', 'twoja', 'strony', 'strona',
  'aplikacje', 'aplikacja', 'internetowe', 'internetowa', 'online', 'web', 'development',
]);

function tokenizeForRelated(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function scoreRelated(haystack: string, keywords: string[]) {
  const normalized = ` ${tokenizeForRelated(haystack).join(' ')} `;
  return keywords.reduce((score, keyword) => (
    normalized.includes(` ${keyword} `) ? score + 1 : score
  ), 0);
}

function getRelatedItems<T>(items: T[], getText: (item: T) => string, keywords: string[], limit = 3) {
  const scored = items
    .map((item, index) => ({ item, index, score: scoreRelated(getText(item), keywords) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const related = scored.filter((entry) => entry.score > 0).slice(0, limit).map((entry) => entry.item);
  return related.length ? related : scored.slice(0, limit).map((entry) => entry.item);
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
  const canonical = landing.seo?.canonicalUrl || absoluteUrl(localizedPath(language, path));
  const ogImage = landing.seo?.ogImage
    ? getSanitySocialImageUrl(landing.seo.ogImage)
    : landing.heroImage
      ? getSanitySocialImageUrl(landing.heroImage)
      : DEFAULT_SOCIAL_IMAGE;
  const imageAlt = getImageAlt(landing.seo?.ogImage || landing.heroImage, metaTitle);

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
      siteName: 'AppCrates',
      images: [{
        url: ogImage,
        width: SOCIAL_IMAGE_WIDTH,
        height: SOCIAL_IMAGE_HEIGHT,
        alt: imageAlt,
      }],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [{ url: ogImage, alt: imageAlt }],
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

  const [serviceLandings, projects, posts] = await Promise.all([
    getServiceLandings().catch(() => []),
    getProjects().catch(() => []),
    getPosts().catch(() => []),
  ]);

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
  const relatedKeywords = Array.from(new Set(tokenizeForRelated([
    title,
    eyebrow,
    intro,
    landing.serviceType || '',
    landing.city || '',
    landing.seo?.keywords?.join(' ') || '',
  ].join(' '))));
  const manualServices = Array.isArray(landing.relatedServices) ? landing.relatedServices : [];
  const manualProjects = Array.isArray(landing.relatedProjects) ? landing.relatedProjects : [];
  const manualPosts = Array.isArray(landing.relatedPosts) ? landing.relatedPosts : [];
  const automaticServices = (serviceLandings as ServiceLanding[])
    .filter((service) => service.slug?.current && service.slug.current !== landing.slug.current)
    .slice(0, 8);
  const automaticProjects = getRelatedItems<Project>(
    projects as Project[],
    (project) => [
      getLocalizedText(project.title, language),
      getLocalizedText(project.description, language),
      getLocalizedText(project.homepageTitle, language),
      getLocalizedText(project.homepageDescription, language),
      getLocalizedText(project.category, language),
      project.technologies?.join(' ') || '',
    ].join(' '),
    relatedKeywords,
    3
  );
  const automaticPosts = getRelatedItems<Post>(
    posts as Post[],
    (post) => [
      getLocalizedText(post.title, language),
      getLocalizedText(post.excerpt, language),
      Array.isArray(post.categories)
        ? post.categories.map((category: any) => getLocalizedText(category?.title || category, language)).join(' ')
        : '',
      post.tags?.join(' ') || '',
    ].join(' '),
    relatedKeywords,
    3
  );
  const otherServices = (manualServices.length ? manualServices : automaticServices)
    .filter((service) => service.slug?.current && service.slug.current !== landing.slug.current)
    .slice(0, 8);
  const relatedProjects = (manualProjects.length ? manualProjects : automaticProjects)
    .filter((project) => project.slug?.current)
    .slice(0, 3);
  const relatedPosts = (manualPosts.length ? manualPosts : automaticPosts)
    .filter((post) => post.slug?.current)
    .slice(0, 3);
  const hasInternalLinks = otherServices.length > 0 || relatedProjects.length > 0 || relatedPosts.length > 0;

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

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: getLocalizedText(landing.seo?.metaDescription, language, intro),
    provider: {
      '@type': 'Organization',
      name: 'AppCrates',
      url: absoluteUrl(localizedPath(language, '/')),
    },
    url: absoluteUrl(localizedPath(language, path)),
    ...(heroImageUrl ? { image: heroImageUrl } : {}),
    ...(landing.serviceType ? { serviceType: landing.serviceType } : {}),
    ...(landing.city ? { areaServed: { '@type': 'City', name: landing.city } } : {}),
  };

  return (
    <>
      <NextHeader />

      <main className="min-h-screen bg-indigo-950">
        <section className="relative min-h-[60vh] lg:min-h-[75vh] flex items-end overflow-hidden">
          {heroImageUrl ? (
            <div className="absolute inset-0 z-0">
              <Image src={heroImageUrl} alt={getImageAlt(landing.heroImage, title)} unoptimized fill priority sizes="100vw" className="object-cover opacity-25" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/60 to-indigo-950/40" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-indigo-950" />
          )}

          <HeroPulsePath />

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
                    className={`py-8 lg:py-10 px-6 ${index > 0 ? ' md:border-x border-white/10' : ''}`}
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
                    className="group relative bg-indigo-950 pt-4 pb-4 sm:p-8  hover:bg-white/[0.03] transition-all duration-700"
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
          <ServiceDeliverablesNew deliverables={deliverables} language={language} />
        ) : null}

        {processSteps.length > 0 ? (
          <ServiceProcessNew processSteps={processSteps} language={language} />
        ) : null}

        {richContent.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert">
              <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium mb-8"
                  glowSize={180}
                  baseDelay={100}
                  charDelay={30}>
                {language === 'pl' ? 'Jak wygląda ta usługa w praktyce' : 'How this service works in practice'}
              </BurnSpotlightText>
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

        {hasInternalLinks ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 flex flex-col items-center justify-center text-center lg:mb-16">
                <SpotlightText as="h2" className="mt-6 max-w-3xl text-center text-3xl sm:text-4xl lg:text-5xl font-light font-oxanium text-white leading-tight">
                  {language === 'pl' ? 'Jeśli chcesz zobaczyć jak to wygląda w praktyce' : 'If you want to see how this looks in practice'}
                </SpotlightText>
                <SpotlightText as="p" className="mt-5 max-w-2xl text-center text-white/50 font-light leading-relaxed">
                  {language === 'pl'
                    ? 'Jeśli jesteś na tym etapie, to prawdopodobnie zastanawiasz się jak to działa w praktyce albo czy ma sens w Twoim przypadku. Poniżej masz konkretne przykłady i tematy, które rozwijają ten kierunek.'
                    : 'If you are at this stage, you are probably wondering how this works in practice or whether it makes sense for you. Below you will find concrete examples and topics that expand on this direction.'}
                </SpotlightText>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {otherServices.length > 0 ? (
                  <section className="border border-white/10 p-6 sm:p-7">
                    <SpotlightText as="h3" className="font-oxanium text-xl font-light text-white">
                      {language === 'pl' ? 'Pozostałe usługi' : 'Other services'}
                    </SpotlightText>
                    <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                      {language === 'pl' ? 'Powiązane obszary' : 'Related areas'}
                    </p>
                    <div className="mt-6 divide-y divide-white/10">
                      {otherServices.map((service) => {
                        const serviceTitle = getLocalizedText(service.title, language);
                        const serviceIntro = getLocalizedText(service.intro, language);

                        return (
                          <PrefetchLink
                            key={service._id}
                            href={localizedPath(language, `/uslugi/${service.slug.current}`)}
                            className="group flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                          >
                            <span>
                              <span className="block font-oxanium text-base text-white/80 transition-colors group-hover:text-teal-300">
                                {serviceTitle}
                              </span>
                              {serviceIntro ? (
                                <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-white/70">
                                  {serviceIntro}
                                </span>
                              ) : null}
                            </span>
                            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-teal-300" />
                          </PrefetchLink>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {relatedProjects.length > 0 ? (
                  <section className="border border-white/10 p-6 sm:p-7">
                    <SpotlightText as="h3" className="font-oxanium text-xl font-light text-white">
                      {language === 'pl' ? 'Powiązane projekty' : 'Related projects'}
                    </SpotlightText>
                    <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                      {language === 'pl' ? 'Realne wdrożenia' : 'Real implementations'}
                    </p>
                    <div className="mt-6 space-y-5">
                      {relatedProjects.map((project) => {
                        const projectTitle = getLocalizedText(project.title, language);
                        const projectDescription = getLocalizedText(project.homepageDescription, language, getLocalizedText(project.description, language));
                        const projectImageUrl = project.mainImage
                          ? urlFor(project.mainImage).width(320).height(180).fit('crop').auto('format').url()
                          : '';

                        return (
                          <PrefetchLink
                            key={project._id}
                            href={localizedPath(language, `/project/${project.slug.current}`)}
                            className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-4"
                          >
                            <div className="relative h-16 overflow-hidden bg-white/5">
                              {projectImageUrl ? (
                                <Image
                                  src={projectImageUrl}
                                  alt={projectTitle}
                                  fill
                                  sizes="80px"
                                  className="object-cover opacity-75 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                                />
                              ) : null}
                            </div>
                            <span className="min-w-0">
                              <span className="line-clamp-2 block font-oxanium text-base leading-snug text-white/80 transition-colors group-hover:text-teal-300">
                                {projectTitle}
                              </span>
                              {projectDescription ? (
                                <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-white/70">
                                  {projectDescription}
                                </span>
                              ) : null}
                            </span>
                          </PrefetchLink>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {relatedPosts.length > 0 ? (
                  <section className="border border-white/10 p-6 sm:p-7">
                    <SpotlightText as="h3" className="font-oxanium text-xl font-light text-white">
                      {language === 'pl' ? 'Powiązane wpisy' : 'Related articles'}
                    </SpotlightText>
                    <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                      {language === 'pl' ? 'Tematy, które rozwijam' : 'Topics I expand on'}
                    </p>
                    <div className="mt-6 space-y-5">
                      {relatedPosts.map((post) => {
                        const postTitle = getLocalizedText(post.title, language);
                        const postExcerpt = getLocalizedText(post.excerpt, language);

                        return (
                          <PrefetchLink
                            key={post._id}
                            href={localizedPath(language, `/blog/${post.slug.current}`)}
                            className="group block border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
                          >
                            <span className="line-clamp-2 block font-oxanium text-base leading-snug text-white/80 transition-colors group-hover:text-teal-300">
                              {postTitle}
                            </span>
                            {postExcerpt ? (
                              <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-white/70">
                                {postExcerpt}
                              </span>
                            ) : null}
                            <span className="mt-3 inline-flex items-center gap-2 text-sm text-white/45 transition-colors group-hover:text-teal-300">
                              {language === 'pl' ? 'Czytaj wpis' : 'Read article'}
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </PrefetchLink>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
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
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="service-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema ? <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </>
  );
}
