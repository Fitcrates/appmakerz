import type { Metadata } from 'next';
import { CalendarDays, LibraryBig } from 'lucide-react';
import { notFound } from 'next/navigation';
import GuideSearch from '@/components/marketplace-guide/GuideSearch';
import GuideTrackSwitcher from '@/components/marketplace-guide/GuideTrackSwitcher';
import styles from '@/components/marketplace-guide/MarketplaceGuide.module.css';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { getMarketplaceGuide, getMarketplaceGuideNavigation, getMarketplaceGuideTracks } from '@/lib/marketplace-guide';
import { isLanguage, type Language } from '@/lib/language';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo';

type PageProps = { params: Promise<{ lang: string }> };

export const dynamic = 'force-static';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const language = lang as Language;
  const guide = getMarketplaceGuide(language);
  const path = '/marketplace-guide';
  const canonical = absoluteUrl(localizedPath(language, path));
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical,
      languages: {
        pl: absoluteUrl(localizedPath('pl', path)),
        en: absoluteUrl(localizedPath('en', path)),
        'x-default': absoluteUrl(localizedPath('en', path)),
      },
    },
    robots: { index: true, follow: true },
    openGraph: { type: 'website', url: canonical, title: guide.title, description: guide.description, siteName: 'AppCrates', images: [DEFAULT_SOCIAL_IMAGE], locale: language === 'pl' ? 'pl_PL' : 'en_US' },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description, images: [DEFAULT_SOCIAL_IMAGE] },
  };
}

export default async function MarketplaceGuideIndex({ params }: PageProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const language = lang as Language;
  const guide = getMarketplaceGuide(language);
  const navigation = getMarketplaceGuideNavigation(language);
  const tracks = getMarketplaceGuideTracks(language);
  const tableCount = guide.chapters.reduce(
    (total, chapter) => total + chapter.blocks.filter((block) => block.type === 'table').length,
    0
  );
  const date = new Intl.DateTimeFormat(language === 'pl' ? 'pl-PL' : 'en-GB', { dateStyle: 'long', timeZone: 'Europe/Warsaw' }).format(new Date(`${guide.reviewedAt}T12:00:00+02:00`));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: guide.title,
    description: guide.description,
    inLanguage: language,
    dateModified: guide.reviewedAt,
    url: absoluteUrl(localizedPath(language, '/marketplace-guide')),
    hasPart: guide.chapters.map((chapter) => ({ '@type': 'Article', name: chapter.title, url: absoluteUrl(localizedPath(language, `/marketplace-guide/${chapter.slug}`)) })),
  };

  return (
    <>
      <section className={styles.indexHero}>
        <div className={styles.eyebrow}><LibraryBig aria-hidden="true" size={16} /> {language === 'pl' ? 'Baza wiedzy AppCrates' : 'AppCrates knowledge base'}</div>
        <h1>{guide.title}</h1>
        <p>{guide.subtitle}</p>
        <div className={styles.reviewBadge}><CalendarDays aria-hidden="true" size={15} /> {language === 'pl' ? 'Stan źródeł:' : 'Sources reviewed:'} {date}</div>
        <GuideSearch language={language} chapters={navigation} />
      </section>
      <section className={styles.indexContent}>
        <div className={styles.indexIntro}>
          <div className={styles.indexNote}>
            <h2>{language === 'pl' ? 'Od decyzji biznesowej do dowodu wykonania' : 'From a business decision to evidence of execution'}</h2>
            <p>{guide.description}</p>
          </div>
          <div className={styles.indexStats}>
            <div><strong>{guide.chapters.length}</strong><span>{language === 'pl' ? 'rozdziałów w bazie wiedzy' : 'chapters in the knowledge base'}</span></div>
            {/* Counted from the data: a hardcoded number went stale the moment
                the second track was added. */}
            <div><strong>{tableCount}</strong><span>{language === 'pl' ? 'tabel i checklist' : 'tables and checklists'}</span></div>
          </div>
        </div>
        <GuideTrackSwitcher
          language={language}
          tracks={tracks.map((track) => ({
            key: track.key,
            shortTitle: track.shortTitle,
            title: track.title,
            subtitle: track.subtitle,
            description: track.description,
            chapterCount: track.chapters.length,
            sections: track.sections.map((section) => ({
              title: section.title,
              chapters: section.chapters.map((chapter) => ({
                id: chapter.id,
                slug: chapter.slug,
                title: chapter.title,
                description: chapter.description,
              })),
            })),
          }))}
        />
      </section>
      <script id="marketplace-guide-index-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
