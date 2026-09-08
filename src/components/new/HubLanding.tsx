import PrefetchLink from '@/components/next/PrefetchLink';
import FaqAccordionList from '@/components/next/FaqAccordionList';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import HeroPulsePath from '@/components/new/HeroPulsePath';
import ServiceStatsNew from '@/components/new/ServiceStatsNew';
import ServiceModelsNew from '@/components/new/ServiceModelsNew';
import HubCapabilities from '@/components/new/HubCapabilities';
import HubFit from '@/components/new/HubFit';
import HubIntegrations from '@/components/new/HubIntegrations';
import HubEvidence from '@/components/new/HubEvidence';
import GuideCtaSection from '@/components/new/GuideCtaSection';
import TechChips from '@/components/new/TechChips';
import ServiceCtaNew from '@/components/new/ServiceCtaNew';
import HubMedia from '@/components/new/HubMedia';
import { urlFor } from '@/lib/sanity.server';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import type {
  LocalizedFaqItem,
  Post,
  ServiceCapability,
  ServiceIntegration,
  HubMediaEntry,
  ServiceLanding,
  ServiceModel,
} from '@/types/sanity.types';

interface HubLandingProps {
  landing: ServiceLanding;
  language: Language;
  relatedPosts: Post[];
  guideChapterLinks: Array<{ slug: string; title: string }>;
}

// The hub answers a different question than a service landing: not "buy this
// one thing" but "can this person build what I need, and where do I go next".
// So the order is proof → routing → scope, and the page links out of itself all
// the way down instead of funnelling into a single offer.
export default function HubLanding({
  landing,
  language,
  relatedPosts,
  guideChapterLinks,
}: HubLandingProps) {
  const title = getLocalizedText(landing.title, language);
  const eyebrow = getLocalizedText(landing.eyebrow, language, language === 'pl' ? 'Technologia' : 'Technology');
  const intro = getLocalizedText(landing.intro, language);
  const ctaLabel = getLocalizedText(
    landing.ctaLabel,
    language,
    language === 'pl' ? 'Porozmawiajmy o projekcie' : "Let's talk about your project"
  );
  const ctaSecondaryLabel = getLocalizedText(landing.ctaSecondaryLabel, language);

  const stats = getLocalizedArray<{ value: string; label: string }>(landing.stats, language);
  const models = getLocalizedArray<ServiceModel>(landing.models, language);
  const capabilities = getLocalizedArray<ServiceCapability>(landing.capabilities, language);
  const fitYes = getLocalizedArray<string>(landing.fitYes, language);
  const fitNo = getLocalizedArray<string>(landing.fitNo, language);
  const integrations = getLocalizedArray<ServiceIntegration>(landing.integrations, language);
  const faq = getLocalizedArray<LocalizedFaqItem>(landing.faq, language);
  const technologies = Array.isArray(landing.technologies) ? landing.technologies : [];

  // Sanity image refs are resolved once here, in the server component, so the
  // media slots stay plain presentational children.
  const media: HubMediaEntry[] = Array.isArray(landing.hubMedia) ? landing.hubMedia : [];
  const mediaUrls: Record<number, string> = {};
  media.forEach((entry, index) => {
    if (entry?.image?.asset) {
      mediaUrls[index] = urlFor(entry.image).width(1600).auto('format').url();
    }
  });
  const slot = (placement: HubMediaEntry['placement']) => (
    <HubMedia entries={media} slot={placement} language={language} urls={mediaUrls} />
  );

  return (
    <main className="min-h-screen bg-indigo-950">
      {/* No hero image: both service landings run one, so dropping it here is
          what tells a returning visitor within a second that this page has a
          different job. */}
      <section className="relative flex items-end overflow-hidden pt-40 pb-20 lg:pt-48 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-indigo-950" />
        <HeroPulsePath />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2 overflow-hidden font-plex text-sm text-white/70">
            <PrefetchLink href={localizedPath(language, '/')} className="transition-colors hover:text-teal-300">
              {language === 'pl' ? 'Strona główna' : 'Home'}
            </PrefetchLink>
            <span className="text-white/30">/</span>
            <PrefetchLink href={localizedPath(language, '/#services')} className="transition-colors hover:text-teal-300">
              {language === 'pl' ? 'Usługi' : 'Services'}
            </PrefetchLink>
            <span className="text-white/30">/</span>
            <span className="max-w-[250px] truncate text-white/60 sm:max-w-none">{title}</span>
          </div>

          <span className="font-plex text-xs uppercase tracking-[0.3em] text-teal-300/80">{eyebrow}</span>

          <div className="max-w-4xl">
            <BurnSpotlightText
              as="h1"
              className="font-oxanium text-4xl font-light leading-tight text-white sm:text-5xl lg:text-7xl"
              glowSize={200}
              baseDelay={200}
              charDelay={25}
            >
              {title}
            </BurnSpotlightText>
          </div>

          {intro ? (
            <div className="mt-8 max-w-2xl">
              <SpotlightText
                as="p"
                className="font-plex text-lg font-light leading-relaxed text-white/60 sm:text-xl"
                glowSize={150}
              >
                {intro}
              </SpotlightText>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <PrefetchLink
              href={localizedPath(language, '/#contact')}
              className="inline-block bg-teal-300 px-8 py-4 text-center font-normal text-indigo-950 transition-colors hover:bg-teal-200"
            >
              {ctaLabel}
            </PrefetchLink>
            {ctaSecondaryLabel ? (
              <PrefetchLink
                href={localizedPath(language, '/#projects')}
                className="inline-block border border-white/15 px-8 py-4 text-center text-white transition-colors hover:border-teal-300/50 hover:text-teal-300"
              >
                {ctaSecondaryLabel}
              </PrefetchLink>
            ) : null}
          </div>
        </div>
      </section>

      <ServiceStatsNew stats={stats} language={language} />

      {models.length > 0 ? <ServiceModelsNew models={models} language={language} /> : null}

      {slot('after-fork')}

      <HubCapabilities capabilities={capabilities} language={language} />

      {slot('after-capabilities')}

      <HubFit fitYes={fitYes} fitNo={fitNo} language={language} />

      {slot('after-fit')}

      <HubIntegrations integrations={integrations} language={language} />

      {slot('after-integrations')}

      <HubEvidence posts={relatedPosts} language={language} />

      {slot('after-evidence')}

      {landing.guideCta?.enabled ? (
        <GuideCtaSection chapters={guideChapterLinks} language={language} />
      ) : null}

      <TechChips technologies={technologies} language={language} />

      {faq.length > 0 ? (
        <section className="border-t border-white/10 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 lg:mb-16">
              <BurnSpotlightText
                as="h2"
                className="font-oxanium text-3xl font-light text-white sm:text-4xl lg:text-5xl"
                glowSize={180}
                baseDelay={100}
                charDelay={30}
              >
                {language === 'pl' ? 'Częste pytania' : 'Common questions'}
              </BurnSpotlightText>
            </div>
            <FaqAccordionList items={faq} />
          </div>
        </section>
      ) : null}

      {/* Deliberately no "related services / projects / posts" block: the hub
          links contextually the whole way down, so a generic box at the end
          would only dilute those links. */}
      <ServiceCtaNew
        ctaLabel={ctaLabel}
        language={language}
        heading={language === 'pl' ? 'Opowiedz, co ma robić Twój commerce' : 'Tell me what your commerce has to do'}
        body={
          language === 'pl'
            ? 'Nie zaczynamy od stacku. Zaczynamy od tego, którędy płyną pieniądze i kto za co odpowiada.'
            : 'We do not start with the stack. We start with where the money flows and who is responsible for what.'
        }
      />
    </main>
  );
}
