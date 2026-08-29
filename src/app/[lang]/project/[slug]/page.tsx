import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import ChatWidget from '@/components/next/ChatWidget';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectFactBar from '@/components/project/ProjectFactBar';
import ProjectToc from '@/components/project/ProjectToc';
import ProjectSections from '@/components/project/ProjectSections';
import ProjectNextPrev from '@/components/project/ProjectNextPrev';
import { buildHeadingAnchors, buildToc, normalizeSections } from '@/components/project/sectionModel';
import { getAdjacentProjects, getProject, getSitemapEntries, urlFor } from '@/lib/sanity.server';
import { getLocalizedText } from '@/lib/localize';
import { absoluteUrl } from '@/lib/site';
import { getModifiedDate, getPublishedDate } from '@/lib/content-dates';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { getImageAlt } from '@/lib/image-alt';
import {
  DEFAULT_SOCIAL_IMAGE,
  getSanitySocialImageUrl,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from '@/lib/seo';
import { translations } from '@/translations/translations';

interface LocalizedProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const revalidate = 604800;
export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const { projects } = await getSitemapEntries();

  return SUPPORTED_LANGUAGES.flatMap((lang) => (
    projects.map((project) => ({
      lang,
      slug: project.slug,
    }))
  ));
}

export async function generateMetadata({ params }: LocalizedProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const project = await getProject(slug);

  if (!project?._id) {
    return {
      title: translations[language].projectDetails.backToProjects,
      alternates: { canonical: absoluteUrl(localizedPath(language, '/')) },
    };
  }

  const title = getLocalizedText(project.title, language);
  const description = getLocalizedText(project.description, language);
  const metaTitle = getLocalizedText(project.seo?.metaTitle, language, title);
  const metaDescription = getLocalizedText(project.seo?.metaDescription, language, description);
  const path = `/project/${project.slug.current}`;
  const canonical = project.seo?.canonicalUrl || absoluteUrl(localizedPath(language, path));
  const ogImage = project.seo?.ogImage
    ? getSanitySocialImageUrl(project.seo.ogImage)
    : project.mainImage
      ? getSanitySocialImageUrl(project.mainImage)
      : DEFAULT_SOCIAL_IMAGE;
  const imageAlt = getImageAlt(project.seo?.ogImage || project.mainImage, metaTitle);

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: project.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', path)),
        pl: absoluteUrl(localizedPath('pl', path)),
        'x-default': absoluteUrl(localizedPath('pl', path)),
      },
    },
    robots: project.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
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

export default async function LocalizedProjectPage({ params }: LocalizedProjectPageProps) {
  const { lang, slug } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const t = translations[language].projectDetails;
  const project = await getProject(slug);

  if (!project?._id) {
    notFound();
  }

  const adjacent = await getAdjacentProjects(slug).catch(() => ({ previous: null, next: null }));

  const title = getLocalizedText(project.title, language);
  const description = getLocalizedText(project.description, language);
  const heroImageUrl = project.mainImage
    ? urlFor(project.mainImage).width(1920).auto('format').quality(90).fit('max').url()
    : '';
  const path = `/project/${project.slug.current}`;

  // Authored sections when they exist, the legacy `body` wrapped in one rich
  // text section when they do not - both take the same rendering path.
  const sections = normalizeSections(project, language);
  const toc = buildToc(sections, language);
  const headingAnchors = buildHeadingAnchors(sections, language);
  const stackSection = sections.find((section) => section._type === 'projectTechStack');
  const hasAuthoredCta = sections.some((section) => section._type === 'projectCtaBand');

  const faqItems = sections
    .filter((section) => section._type === 'projectFaq')
    .flatMap((section) => (Array.isArray(section.items) ? section.items : []))
    .map((item: unknown) => {
      const faqItem = item && typeof item === 'object'
        ? item as { question?: unknown; answer?: unknown }
        : {};

      return {
        question: getLocalizedText(faqItem.question, language),
        answer: getLocalizedText(faqItem.answer, language),
      };
    })
    .filter((item) => item.question && item.answer);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: translations[language].navigation.home,
        item: absoluteUrl(localizedPath(language, '/')),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.projects,
        item: absoluteUrl(localizedPath(language, '/#projects')),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: absoluteUrl(localizedPath(language, path)),
      },
    ],
  };

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': absoluteUrl(localizedPath(language, path)),
    url: absoluteUrl(localizedPath(language, path)),
    name: title,
    description,
    inLanguage: language,
    datePublished: getPublishedDate(project),
    dateModified: getModifiedDate(project),
    ...(heroImageUrl ? { image: heroImageUrl } : {}),
    ...(project.technologies?.length ? { keywords: project.technologies.join(', ') } : {}),
    author: {
      '@type': 'Organization',
      name: 'AppCrates',
      url: absoluteUrl(localizedPath(language, '/')),
    },
  };

  const faqSchema = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: language,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <NextHeader />

      <main className="min-h-screen bg-indigo-950">
        <ProjectHero
          project={project}
          language={language}
          title={title}
          description={description}
          heroImageUrl={heroImageUrl}
          stackAnchor={stackSection?.anchor}
          labels={{
            home: translations[language].navigation.home,
            projects: t.projects,
            liveDemo: t.liveDemo,
            sourceCode: t.sourceCode,
            blogPost: t.blogPost,
            moreTech: (count: number) => `+${count} ${t.moreTech}`,
          }}
        />

        <ProjectFactBar project={project} language={language} />

        <ProjectToc entries={toc} label={t.onThisPage} />

        <ProjectSections sections={sections} headingAnchors={headingAnchors} language={language} />

        {!hasAuthoredCta ? (
          <section className="border-t border-white/10 bg-teal-300/[0.035] py-16 lg:py-24">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <p className="font-oxanium text-2xl font-light leading-tight text-white sm:text-3xl lg:text-4xl">
                {t.closingTitle}
              </p>
              <p className="mx-auto mt-5 max-w-2xl font-plex text-lg font-light leading-relaxed text-white/65">
                {t.closingText}
              </p>
              <a
                href={localizedPath(language, '/#contact')}
                className="group relative mt-10 inline-flex min-w-[230px] items-center justify-center overflow-hidden bg-teal-300 px-10 py-5 text-center font-normal text-indigo-950 transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
                aria-label={t.contactCta}
              >
                <span className="relative z-10">{t.contactCta}</span>
                <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
              </a>
            </div>
          </section>
        ) : null}

        <ProjectNextPrev
          previous={adjacent?.previous}
          next={adjacent?.next}
          language={language}
          labels={{ previous: t.previousProject, next: t.nextProject, all: t.allProjects }}
        />
      </main>

      <NextFooter />
      <ChatWidget />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="creativework-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      {faqSchema ? (
        <Script id="project-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
    </>
  );
}
