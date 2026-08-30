import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ChevronRight, LibraryBig } from 'lucide-react';
import { notFound } from 'next/navigation';
import GuideBody from '@/components/marketplace-guide/GuideBody';
import GuideProgress from '@/components/marketplace-guide/GuideProgress';
import GuideSearch from '@/components/marketplace-guide/GuideSearch';
import PrefetchLink from '@/components/next/PrefetchLink';
import styles from '@/components/marketplace-guide/MarketplaceGuide.module.css';
import { localizedPath } from '@/lib/i18n-routing';
import { guideHeadingId } from '@/lib/marketplace-guide-shared';
import { absoluteUrl } from '@/lib/site';
import {
  type GuideBlock,
  getMarketplaceGuide,
  getMarketplaceGuideChapter,
  getMarketplaceGuideNavigation,
} from '@/lib/marketplace-guide';
import { MARKETPLACE_GUIDE_SLUGS } from '@/lib/marketplace-guide-manifest';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo';

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.flatMap((lang) => MARKETPLACE_GUIDE_SLUGS.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const language = lang as Language;
  const chapter = getMarketplaceGuideChapter(language, slug);
  if (!chapter) notFound();
  const path = `/marketplace-guide/${chapter.slug}`;
  const canonical = absoluteUrl(localizedPath(language, path));
  return {
    title: `${chapter.title} | ${language === 'pl' ? 'Przewodnik marketplace' : 'Marketplace guide'}`,
    description: chapter.description,
    alternates: {
      canonical,
      languages: {
        pl: absoluteUrl(localizedPath('pl', path)),
        en: absoluteUrl(localizedPath('en', path)),
        'x-default': absoluteUrl(localizedPath('pl', path)),
      },
    },
    robots: { index: true, follow: true },
    openGraph: { type: 'article', url: canonical, title: chapter.title, description: chapter.description, siteName: 'AppCrates', images: [DEFAULT_SOCIAL_IMAGE], locale: language === 'pl' ? 'pl_PL' : 'en_US', publishedTime: '2026-08-30', modifiedTime: '2026-08-30' },
    twitter: { card: 'summary_large_image', title: chapter.title, description: chapter.description, images: [DEFAULT_SOCIAL_IMAGE] },
  };
}

export default async function MarketplaceGuideChapterPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const language = lang as Language;
  const guide = getMarketplaceGuide(language);
  const chapter = getMarketplaceGuideChapter(language, slug);
  if (!chapter) notFound();
  const navigation = getMarketplaceGuideNavigation(language);
  const previous = guide.chapters[chapter.order - 1];
  const next = guide.chapters[chapter.order + 1];
  const headings = chapter.blocks.filter(
    (block): block is Extract<GuideBlock, { type: 'heading' }> => block.type === 'heading' && block.level === 2
  );
  const path = `/marketplace-guide/${chapter.slug}`;
  const cleanTitle = chapter.title.replace(/^\d+\.\s*/, '');
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: language === 'pl' ? 'Strona główna' : 'Home', item: absoluteUrl(localizedPath(language, '/')) },
      { '@type': 'ListItem', position: 2, name: guide.title, item: absoluteUrl(localizedPath(language, '/marketplace-guide')) },
      { '@type': 'ListItem', position: 3, name: cleanTitle, item: absoluteUrl(localizedPath(language, path)) },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cleanTitle,
    description: chapter.description,
    inLanguage: language,
    datePublished: guide.reviewedAt,
    dateModified: guide.reviewedAt,
    mainEntityOfPage: absoluteUrl(localizedPath(language, path)),
    author: { '@type': 'Organization', name: 'AppCrates', url: absoluteUrl(localizedPath(language, '/')) },
    publisher: { '@type': 'Organization', name: 'AppCrates', url: absoluteUrl(localizedPath(language, '/')) },
  };

  return (
    <>
      <div className={styles.articleGrid}>
        <aside className={styles.sidebar} aria-label={language === 'pl' ? 'Rozdziały przewodnika' : 'Guide chapters'}>
          <PrefetchLink className={styles.sidebarHome} href={localizedPath(language, '/marketplace-guide')}><LibraryBig aria-hidden="true" size={15} /> {language === 'pl' ? 'Wszystkie rozdziały' : 'All chapters'}</PrefetchLink>
          <div className={styles.sidebarNav}>
            {guide.chapters.map((item) => (
              <PrefetchLink key={item.slug} className={item.slug === chapter.slug ? styles.activeChapter : ''} href={localizedPath(language, `/marketplace-guide/${item.slug}`)} aria-current={item.slug === chapter.slug ? 'page' : undefined}>
                <span>{item.id === 'legal' ? '§' : item.id.padStart(2, '0')}</span>
                <span>{item.title.replace(/^\d+\.\s*/, '')}</span>
              </PrefetchLink>
            ))}
          </div>
        </aside>

        <article className={styles.article}>
          <details className={styles.mobileNav}>
            <summary>{language === 'pl' ? 'Rozdziały przewodnika' : 'Guide chapters'}</summary>
            <div>{guide.chapters.map((item) => <PrefetchLink key={item.slug} href={localizedPath(language, `/marketplace-guide/${item.slug}`)}>{item.id === 'legal' ? '§' : item.id.padStart(2, '0')} - {item.title.replace(/^\d+\.\s*/, '')}</PrefetchLink>)}</div>
          </details>
          <nav className={styles.breadcrumbs} aria-label={language === 'pl' ? 'Okruszki' : 'Breadcrumbs'}>
            <PrefetchLink href={localizedPath(language, '/')}>{language === 'pl' ? 'Strona główna' : 'Home'}</PrefetchLink>
            <ChevronRight aria-hidden="true" size={13} />
            <PrefetchLink href={localizedPath(language, '/marketplace-guide')}>{language === 'pl' ? 'Przewodnik marketplace' : 'Marketplace guide'}</PrefetchLink>
            <ChevronRight aria-hidden="true" size={13} />
            <span>{chapter.id === 'legal' ? '§' : chapter.id.padStart(2, '0')}</span>
          </nav>
          <header className={styles.articleHeader}>
            <div className={styles.articleMeta}>{language === 'pl' ? 'Rozdział' : 'Chapter'} {chapter.id === 'legal' ? '§' : chapter.id.padStart(2, '0')}</div>
            <h1>{cleanTitle}</h1>
          </header>
          <GuideBody blocks={chapter.blocks} language={language} slug={chapter.slug} />
          <div className={styles.serviceCta}>
            <strong>{language === 'pl' ? 'Potrzebujesz wdrożyć te procesy w realnym marketplace?' : 'Need to implement these processes in a real marketplace?'}</strong>
            <p>{language === 'pl' ? 'Projektuję platformy multi-vendor wraz z onboardingiem, płatnościami, moderacją i procesami operacyjnymi.' : 'I design multi-vendor platforms with onboarding, payments, moderation, and operational workflows.'}</p>
            <PrefetchLink href={localizedPath(language, '/uslugi/marketplace-multi-vendor-medusa-js')}>{language === 'pl' ? 'Zobacz usługę budowy marketplace' : 'Explore marketplace development'} <ArrowRight aria-hidden="true" size={15} /></PrefetchLink>
          </div>
          <nav className={styles.articlePager} aria-label={language === 'pl' ? 'Nawigacja między rozdziałami' : 'Chapter navigation'}>
            {previous ? <PrefetchLink href={localizedPath(language, `/marketplace-guide/${previous.slug}`)}><ArrowLeft aria-hidden="true" size={17} /><span><small>{language === 'pl' ? 'Poprzedni' : 'Previous'}</small><strong>{previous.title.replace(/^\d+\.\s*/, '')}</strong></span></PrefetchLink> : <span />}
            {next ? <PrefetchLink href={localizedPath(language, `/marketplace-guide/${next.slug}`)}><span><small>{language === 'pl' ? 'Następny' : 'Next'}</small><strong>{next.title.replace(/^\d+\.\s*/, '')}</strong></span><ArrowRight aria-hidden="true" size={17} /></PrefetchLink> : null}
          </nav>
        </article>

        <aside className={styles.toc} aria-label={language === 'pl' ? 'Na tej stronie' : 'On this page'}>
          <GuideSearch language={language} chapters={navigation} compact />
          {headings.length ? <><strong>{language === 'pl' ? 'Na tej stronie' : 'On this page'}</strong>{headings.map((heading) => <a key={heading.text} href={`#${guideHeadingId(heading.text)}`}>{heading.text}</a>)}</> : null}
          <GuideProgress language={language} slug={chapter.slug} total={guide.chapters.length} />
        </aside>
      </div>
      <script id="marketplace-guide-breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script id="marketplace-guide-article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}
