import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Fingerprint, History, Inbox, RefreshCw, Scale, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import PrefetchLink from '@/components/next/PrefetchLink';
import BurnSpotlightText from './BurnSpotlightText';
import SpotlightText from './SpotlightText';
import ReviewCard, { trackPointer } from './ReviewCard';
import ReviewDeck from './ReviewDeck';
import reviewStyles from './ReviewCard.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { localizedPath } from '../../lib/i18n-routing';
import { translations } from '../../translations/translations';
import styles from './ProofNew.module.css';

const CASE_STUDY_SLUG = 'multivendor-e-commerce-platform';
const ARTOVNIA_URL = 'https://artovnia.com/';
const MERCUR_CASE_STUDY_URL = 'https://www.mercurjs.com/case-studies/artovnia';
// The cid opens the whole business profile, so the link keeps working as
// reviews are added. The share links only point at a single review.
const GOOGLE_REVIEWS_URL = 'https://maps.google.com/?cid=7009445637550924812';
// Same order as the chips in translations, which follow the paragraph:
// retries, idempotency, reconciliation, audit trail, then dead-letter and
// race conditions as the deeper layer.
const failureIcons = [RefreshCw, Fingerprint, Scale, History, Inbox, ShieldCheck];

// Where each proof bar entry leads, in the order of translations.proof.bar:
// the running system, the payouts card in the deck, then the review deck
// twice: Mercur is its top card, and a card id would be a dead target once
// the reader has flipped past it.
const barTargets = ['proof-flagship', 'proof-payouts', 'proof-reviews', 'proof-reviews'];
const deckIds: Record<number, string> = { 1: 'proof-payouts' };

const fadeIn = (inView: boolean, delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// scrollIntoView honours each target's scroll-margin-top, which for deck
// cards is their resting position in the stack. A plain hash jump would also
// trigger HomePageClient's hashchange handler, which scrolls with a fixed
// header offset and ignores it.
const scrollToTarget = (event: React.MouseEvent<HTMLAnchorElement>) => {
  const target = document.getElementById(event.currentTarget.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ block: 'start' });
};

// Sits right under the hero, before the services list: the reader sees a
// running system, the hard parts it handles, an outside source that wrote it
// up, and what clients said, before being asked to read about the offer.
//
// Artovnia is presented as proof of what can be built, not as the spec of the
// offer, so business rules stay phrased as settings and lists stay open.
const ProofNew: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].proof;

  const headerRef = useRef<HTMLDivElement>(null);
  const flagshipRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });
  const flagshipInView = useInView(flagshipRef, { once: true, margin: '-100px' });
  const reviewsInView = useInView(reviewsRef, { once: true, margin: '-100px' });

  const caseStudyHref = localizedPath(language, `/project/${CASE_STUDY_SLUG}`);

  // The four features and the failure-handling block are one deck: what the
  // system does, then what it does when something goes wrong. From lg up the
  // chips sit under the failure paragraph; below lg that card would run to a
  // full screen, so the chips get a card of their own there instead.
  const { failure } = t.flagship;
  const deck = [
    ...t.flagship.features.map((feature) => ({ title: feature.title, body: feature.description, chips: 'none' as const })),
    { title: failure.heading, body: failure.body, chips: 'desktop' as const },
    { title: failure.chipsHeading, body: null, chips: 'mobile' as const },
  ];

  const chips = (
    <ul className="flex flex-wrap gap-2.5">
      {failure.chips.map((chip, chipIndex) => {
        const Icon = failureIcons[chipIndex] ?? ShieldCheck;
        return (
          <li key={chip} className={styles.pill}>
            <Icon className="w-4 h-4 shrink-0 text-teal-300" strokeWidth={1.75} aria-hidden="true" />
            {chip}
          </li>
        );
      })}
    </ul>
  );

  return (
    <section id="proof" className={`${styles.section} relative py-20 lg:py-24 bg-indigo-950`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div ref={headerRef}>
          <motion.div {...fadeIn(headerInView)} className="mb-6 lg:mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-white/55">{t.label}</span>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <BurnSpotlightText
                as="h2"
                className="text-4xl sm:text-5xl lg:text-6xl font-light font-oxanium leading-[1.15]"
                glowSize={150}
                baseDelay={200}
                charDelay={40}
              >
                {t.heading}
              </BurnSpotlightText>
            </div>
            <motion.div {...fadeIn(headerInView, 0.3)} className="lg:col-span-5">
              <SpotlightText as="p" className="text-lg font-light leading-relaxed !text-white/70" glowSize={120}>
                {t.intro}
              </SpotlightText>
            </motion.div>
          </div>

          {/* ── Proof bar: a table of contents for the section ── */}
          <motion.div
            {...fadeIn(headerInView, 0.45)}
            className="mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 border-y border-white/10"
          >
            {t.bar.map((item, index) => (
              <a
                key={item.label}
                href={`#${barTargets[index]}`}
                onClick={scrollToTarget}
                className={`${styles.anchor} group row-span-2 grid grid-rows-[subgrid] gap-y-2 py-6 px-4 sm:px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-300/60 ${index % 2 === 1 ? 'border-l border-white/10' : ''} ${index >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}
              >
                <span className="row-start-1 flex items-start justify-between gap-3">
                  <span className="font-oxanium font-light text-2xl sm:text-3xl text-teal-300">{item.value}</span>
                  <ArrowDown
                    className="mt-2 w-4 h-4 shrink-0 text-white/30 transition-all duration-300 group-hover:text-teal-300 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="row-start-2 text-[11px] tracking-[0.18em] uppercase text-white/65 transition-colors group-hover:text-white">
                  {item.label}
                </span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── Flagship case: Artovnia ── */}
        <div id="proof-flagship" ref={flagshipRef} className="mt-16 lg:mt-20 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Stays in view while the deck on the right scrolls past it. */}
            {/* Sticky only from lg: below that the column sits above the deck
                and would pin itself over the cards. */}
            <motion.div {...fadeIn(flagshipInView)} className="lg:col-span-6 lg:sticky lg:top-28">
              <PrefetchLink
                href={caseStudyHref}
                className="group relative block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                aria-label={t.flagship.cta}
              >
                <div className={styles.halo} aria-hidden="true" />
                <Image
                  src="/media/ArtovniaNobgMock.webp"
                  alt={t.flagship.imageAlt}
                  width={1618}
                  height={972}
                  className="relative w-full h-auto transition-transform duration-700 motion-safe:group-hover:-translate-y-1.5"
                  sizes="(max-width: 1024px) 92vw, 48vw"
                />
              </PrefetchLink>

              <div className="mt-6 lg:mt-8 lg:pr-8">
                <span className="block text-[11px] tracking-[0.18em] uppercase text-teal-300">
                  {t.flagship.eyebrow}
                </span>
                <div className="mt-4">
                  <SpotlightText as="h3" className="font-oxanium text-3xl sm:text-4xl font-light leading-tight text-white" glowSize={140}>
                    {t.flagship.title}
                  </SpotlightText>
                </div>
                <div className="mt-5">
                  <SpotlightText as="p" className="font-light leading-relaxed !text-white/70" glowSize={120}>
                    {t.flagship.body}
                  </SpotlightText>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <PrefetchLink href={caseStudyHref} className="group inline-flex items-center gap-4">
                    <span className="text-white group-hover:text-teal-300 transition-colors font-oxanium">
                      {t.flagship.cta}
                    </span>
                    <span className="w-11 h-11 border border-white/20 flex items-center justify-center group-hover:bg-teal-300 group-hover:border-teal-300 transition-all">
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:text-indigo-950 transition-colors" aria-hidden="true" />
                    </span>
                  </PrefetchLink>
                  <a
                    href={ARTOVNIA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-teal-300 transition-colors"
                  >
                    {t.flagship.visit}
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* What the system handles, in the client's terms, ending with
                what it does when something goes wrong. */}
            <motion.ol {...fadeIn(flagshipInView, 0.2)} className={`${styles.stack} lg:col-span-6`}>
              {deck.map((card, index) => (
                <li
                  key={card.title}
                  id={deckIds[index]}
                  className={`${styles.stackCard} ac-card grid grid-cols-[1.75rem_1fr] gap-x-4 p-6 ${card.chips === 'mobile' ? 'lg:hidden' : ''}`}
                  style={{ '--i': index } as React.CSSProperties}
                >
                  {/* First row is the header band: the only part that stays
                      visible once the next card has slid over this one. */}
                  <span className="font-oxanium text-sm font-light leading-6 lg:leading-7 tabular-nums text-teal-300/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.stackTitle}>
                    <SpotlightText as="h4" className="font-oxanium text-lg lg:text-xl font-light leading-6 lg:leading-7 text-white" glowSize={110}>
                      {card.title}
                    </SpotlightText>
                  </div>
                  {card.body ? (
                    <div className="col-start-2 mt-3 lg:mt-4">
                      <SpotlightText as="p" className="font-light leading-relaxed !text-white/65" glowSize={110}>
                        {card.body}
                      </SpotlightText>
                      {card.chips === 'desktop' ? <div className="mt-6 hidden lg:block">{chips}</div> : null}
                    </div>
                  ) : null}
                  {/* Full card width: the longest chip needs the room the
                      number column would take. */}
                  {card.chips === 'mobile' ? <div className="col-span-2 mt-3">{chips}</div> : null}
                </li>
              ))}
            </motion.ol>
          </div>
        </div>

        {/* ── Voices from outside: Mercur's write-up and client reviews ── */}
        <div id="proof-reviews" ref={reviewsRef} className="mt-16 lg:mt-24 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <motion.div {...fadeIn(reviewsInView)} className="lg:col-span-5 lg:sticky lg:top-28">
              <SpotlightText as="h3" className="font-oxanium text-3xl sm:text-4xl font-light leading-tight text-white" glowSize={140}>
                {t.reviews.heading}
              </SpotlightText>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-teal-300 hover:text-teal-200 transition-colors"
              >
                {t.reviews.link}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </motion.div>

            {/* Mercur opens the deck as the only outside source on a Medusa.js
                build; it has no stars, so it reads as a different kind of
                voice. Only its pill is a link: a card-wide link swapped the
                cursor dot for the link ring, which then vanished in the
                spotlight glow. */}
            <motion.div {...fadeIn(reviewsInView, 0.15)} className="lg:col-span-7">
              <ReviewDeck
                prevLabel={t.reviews.prev}
                nextLabel={t.reviews.next}
                hint={t.reviews.dragHint}
                cards={[
                  {
                    id: 'mercur',
                    node: (
                      <div
                        className={`ac-card ac-card--sm ${reviewStyles.glow} flex flex-col p-6 sm:p-8`}
                        onPointerMove={trackPointer}
                      >
                        <span className="text-[11px] tracking-[0.18em] uppercase text-teal-300">{t.mercur.label}</span>
                        <span className="mt-5 block font-oxanium text-4xl font-light tracking-wide text-white">Mercur</span>
                        <SpotlightText as="p" className="mt-5 font-light leading-relaxed !text-white/75" glowSize={120}>
                          {t.mercur.body}
                        </SpotlightText>
                        <div className="mt-auto pt-6">
                          <a
                            href={MERCUR_CASE_STUDY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.pill} group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60`}
                          >
                            {t.mercur.link}
                            <ArrowUpRight
                              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
                    ),
                  },
                  ...t.reviews.items.map((review) => ({
                    id: review.author,
                    node: (
                      <ReviewCard
                        author={review.author}
                        text={review.text}
                        source={review.translated ? `Google · ${t.reviews.translated}` : 'Google'}
                        quote={(text) => (language === 'pl' ? `„${text}”` : `“${text}”`)}
                        ratingLabel={t.reviews.ratingLabel}
                        readMoreLabel={t.reviews.readMore}
                        closeLabel={t.reviews.close}
                        className="p-6 sm:p-8"
                        clampLines={7}
                      />
                    ),
                  })),
                ]}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" aria-hidden="true" />
    </section>
  );
};

export default ProofNew;
