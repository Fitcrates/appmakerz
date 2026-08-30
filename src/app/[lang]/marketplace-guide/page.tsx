import type { Metadata } from 'next';
import { ArrowUpRight, CalendarDays, LibraryBig } from 'lucide-react';
import { notFound } from 'next/navigation';
import GuideSearch from '@/components/marketplace-guide/GuideSearch';
import PrefetchLink from '@/components/next/PrefetchLink';
import styles from '@/components/marketplace-guide/MarketplaceGuide.module.css';
import { absoluteUrl } from '@/lib/site';
import { localizedPath } from '@/lib/i18n-routing';
import { getMarketplaceGuide, getMarketplaceGuideNavigation } from '@/lib/marketplace-guide';
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
        'x-default': absoluteUrl(localizedPath('pl', path)),
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
            <div><strong>25+</strong><span>{language === 'pl' ? 'rozdziałów operacyjnych' : 'operational chapters'}</span></div>
            <div><strong>78</strong><span>{language === 'pl' ? 'tabel i decyzji' : 'tables and decisions'}</span></div>
          </div>
        </div>
        <div className={styles.chapterGrid}>
          {guide.chapters.map((chapter) => (
            <PrefetchLink key={chapter.slug} className={styles.chapterCard} href={localizedPath(language, `/marketplace-guide/${chapter.slug}`)}>
              <span className={styles.chapterNumber}>{chapter.id === 'legal' ? '§' : chapter.id.padStart(2, '0')}<ArrowUpRight aria-hidden="true" size={16} /></span>
              <h2>{chapter.title.replace(/^\d+\.\s*/, '')}</h2>
              <p>{chapter.description}</p>
            </PrefetchLink>
          ))}
        </div>
      </section>
      <script id="marketplace-guide-index-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
