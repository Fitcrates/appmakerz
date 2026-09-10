import type { GuideJurisdiction } from '@/lib/marketplace-guide';
import type { Language } from '@/lib/language';
import styles from './MarketplaceGuide.module.css';

const LABEL: Record<GuideJurisdiction, Record<Language, string>> = {
  eu: { pl: 'UE', en: 'EU' },
  pl: { pl: 'PL', en: 'PL' },
};

const TITLE: Record<GuideJurisdiction, Record<Language, string>> = {
  eu: {
    pl: 'Obowiązek wynika z prawa UE i dotyczy każdego rynku unijnego. Szczegóły wdrożenia bywają krajowe.',
    en: 'The obligation comes from EU law and applies on every EU market. Implementation details can be national.',
  },
  pl: {
    pl: 'Rozdział opisuje polskie rejestry, progi lub terminy. Na innym rynku UE trzeba sprawdzić odpowiednik.',
    en: 'The chapter covers Polish registers, thresholds or deadlines. Another EU market needs its own equivalent.',
  },
};

/**
 * Two states, deliberately coarse. The guide is not a per-country compliance
 * database, so the badge answers one question: does this chapter transfer to
 * another EU market, or is it Polish detail.
 */
export default function JurisdictionBadge({
  jurisdiction,
  language,
}: {
  jurisdiction?: GuideJurisdiction;
  language: Language;
}) {
  if (!jurisdiction) return null;

  return (
    <span
      className={jurisdiction === 'pl' ? styles.badgePl : styles.badgeEu}
      title={TITLE[jurisdiction][language]}
    >
      {LABEL[jurisdiction][language]}
    </span>
  );
}
