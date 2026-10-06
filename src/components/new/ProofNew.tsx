import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Fingerprint, History, Inbox, RefreshCw, Scale, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import PrefetchLink from '@/components/next/PrefetchLink';
import BurnSpotlightText from './BurnSpotlightText';
import ReviewCard from './ReviewCard';
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

const reviewGridCols: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
};

const fadeIn = (inView: boolean, delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: inView ? { opacity: 1, y: 0 } : {},
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

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

  return (
    <section id="proof" className="relative py-20 lg:py-24 bg-indigo-950 overflow-hidden">
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
            <motion.p
              {...fadeIn(headerInView, 0.3)}
              className="lg:col-span-5 text-lg font-light leading-relaxed text-white/70"
            >
              {t.intro}
            </motion.p>
          </div>

          {/* ── Proof bar ── */}
          <motion.dl
            {...fadeIn(headerInView, 0.45)}
            className="mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 border-y border-white/10"
          >
            {t.bar.map((item, index) => (
              <div
                key={item.label}
                className={`py-6 px-4 sm:px-6 flex flex-col-reverse gap-2 ${index % 2 === 1 ? 'border-l border-white/10' : ''} ${index >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}
              >
                <dt className="text-[11px] tracking-[0.18em] uppercase text-white/65">{item.label}</dt>
                <dd className="font-oxanium font-light text-2xl sm:text-3xl text-teal-300">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ── Flagship case: Artovnia ── */}
        <div ref={flagshipRef} className="mt-16 lg:mt-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div {...fadeIn(flagshipInView)} className="lg:col-span-7">
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
                  sizes="(max-width: 1024px) 92vw, 58vw"
                />
              </PrefetchLink>
            </motion.div>

            <motion.div {...fadeIn(flagshipInView, 0.2)} className="lg:col-span-5">
              <span className="block text-[11px] tracking-[0.18em] uppercase text-teal-300">
                {t.flagship.eyebrow}
              </span>
              <h3 className="mt-4 font-oxanium text-3xl sm:text-4xl font-light leading-tight text-white">
                {t.flagship.title}
              </h3>
              <p className="mt-5 font-light leading-relaxed text-white/70">{t.flagship.body}</p>

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
            </motion.div>
          </div>

          {/* What the system handles, in the client's terms */}
          <motion.ol
            {...fadeIn(flagshipInView, 0.35)}
            className="mt-12 lg:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10"
          >
            {t.flagship.features.map((feature, index) => (
              <li key={feature.title} className="border-t border-white/10 py-6">
                <span className="font-oxanium text-sm font-light tabular-nums text-teal-300/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-3 font-oxanium text-lg font-light leading-snug text-white">{feature.title}</h4>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/60">{feature.description}</p>
              </li>
            ))}
          </motion.ol>

          {/* Beyond the happy path */}
          <motion.div
            {...fadeIn(flagshipInView, 0.45)}
            className="ac-card mt-8 p-6 sm:p-8 lg:p-12"
          >
            <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5">
                <h4 className="font-oxanium text-2xl sm:text-3xl font-light text-white">{t.flagship.failure.heading}</h4>
                <p className="mt-4 font-light leading-relaxed text-white/70">{t.flagship.failure.body}</p>
              </div>
              <ul className="lg:col-span-7 flex flex-wrap gap-3 lg:justify-end">
                {t.flagship.failure.chips.map((chip, index) => {
                  const Icon = failureIcons[index] ?? ShieldCheck;
                  return (
                    <li key={chip} className={styles.pill}>
                      <Icon className="w-4 h-4 shrink-0 text-teal-300" strokeWidth={1.75} aria-hidden="true" />
                      {chip}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── External validation + client reviews ── */}
        <div ref={reviewsRef} className="mt-12 lg:mt-16">
          {/* The only outside source on a Medusa.js build, so the name carries
              the weight here, not the label. */}
          <motion.a
            {...fadeIn(reviewsInView)}
            href={MERCUR_CASE_STUDY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`ac-card ac-card--sm group grid lg:grid-cols-12 gap-5 lg:gap-12 items-center p-6 sm:p-8 lg:px-10`}
          >
            <div className="relative lg:col-span-3">
              <span className="block font-oxanium text-3xl sm:text-4xl font-light tracking-wide text-white">Mercur</span>
              <span className="mt-2 block text-[11px] tracking-[0.18em] uppercase text-teal-300">{t.mercur.label}</span>
            </div>
            <p className="relative lg:col-span-6 font-light leading-relaxed text-white/75">{t.mercur.body}</p>
            <span className={`${styles.pill} relative lg:col-span-3 justify-self-start lg:justify-self-end group-hover:border-teal-300/45 group-hover:text-white`}>
              {t.mercur.link}
              <ArrowUpRight
                className="w-4 h-4 text-teal-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </motion.a>

          <motion.h3
            {...fadeIn(reviewsInView, 0.15)}
            className="mt-12 lg:mt-14 font-oxanium text-2xl sm:text-3xl font-light text-white"
          >
            {t.reviews.heading}
          </motion.h3>

          {/* Two reviews sit side by side, three get a column each from lg up.
              Long ones are clamped in the card and open in full in a dialog. */}
          <div className={`mt-8 grid gap-6 lg:gap-8 ${reviewGridCols[Math.min(t.reviews.items.length, 3)] ?? ''}`}>
            {t.reviews.items.map((review, index) => (
              <ReviewCard
                key={review.author}
                author={review.author}
                text={review.text}
                source={review.translated ? `Google · ${t.reviews.translated}` : 'Google'}
                quote={(text) => (language === 'pl' ? `„${text}”` : `“${text}”`)}
                ratingLabel={t.reviews.ratingLabel}
                readMoreLabel={t.reviews.readMore}
                closeLabel={t.reviews.close}
                motionProps={fadeIn(reviewsInView, 0.25 + index * 0.1)}
              />
            ))}
          </div>

          <motion.a
            {...fadeIn(reviewsInView, 0.45)}
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-teal-300 hover:text-teal-200 transition-colors"
          >
            {t.reviews.link}
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" aria-hidden="true" />
    </section>
  );
};

export default ProofNew;
