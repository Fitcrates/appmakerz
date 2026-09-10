// TEMPORARY: renders the unpublished hub draft so the layout can be reviewed
// before anything goes public. Delete this route once the draft is published.
import { notFound } from 'next/navigation';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import HubLanding from '@/components/new/HubLanding';
import { getMarketplaceGuideChapter, getMarketplaceGuideTracks } from '@/lib/marketplace-guide';
import { isLanguage, type Language } from '@/lib/language';

export const dynamic = 'force-dynamic';

const DRAFT_ID = 'drafts.serviceLanding-medusa-js-development';

async function fetchDraft() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.BACKEND_SANITY_TOKEN;
  const query = `*[_id == "${DRAFT_ID}"][0]{
    ..., relatedPosts[]->{_id, title{en,pl}, slug, excerpt{en,pl}, categories[]->{_id, title{en,pl}}}
  }`;
  const url = `https://${projectId}.api.sanity.io/v2024-02-20/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  const body = await res.json();
  return body.result;
}

export default async function HubPreviewPage({ params }: { params: Promise<{ lang: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const { lang } = await params;
  if (!isLanguage(lang)) {
    notFound();
  }
  const language = lang as Language;
  const landing = await fetchDraft();

  if (!landing?._id) {
    notFound();
  }

  const guideChapterLinks = (landing.guideCta?.chapters ?? [])
    .map((slug: string) => {
      const chapter = getMarketplaceGuideChapter(language, slug);
      return chapter ? { slug, title: chapter.title } : null;
    })
    .filter(Boolean) as Array<{ slug: string; title: string }>;

  const guideTracks = getMarketplaceGuideTracks(language);

  return (
    <>
      <NextHeader />
      <HubLanding
        landing={landing}
        language={language}
        relatedPosts={landing.relatedPosts ?? []}
        guideChapterLinks={guideChapterLinks}
        guideChapterCount={guideTracks.reduce((total, track) => total + track.chapters.length, 0)}
        guideTrackCount={guideTracks.length}
      />
      <NextFooter />
    </>
  );
}
