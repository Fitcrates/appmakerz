import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import { TechBadge } from '@/components/project/TechBadge';
import type { Language } from '@/lib/language';

interface TechChipsProps {
  technologies: string[];
  language: Language;
}

// Reuses the badge list from the project pages rather than a second, plainer
// chip style: same brand icons, same fallback monogram for anything unmapped,
// so the stack reads identically wherever it appears on the site. Laid out on
// a grid of equal cells rather than a wrapping row, so the badges line up.
export default function TechChips({ technologies, language }: TechChipsProps) {
  if (!technologies.length) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs tracking-[0.3em] uppercase text-white/55">
          {language === 'pl' ? 'Stack' : 'Stack'}
        </span>
        <div className="mt-4 max-w-3xl">
          <BurnSpotlightText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-oxanium"
            glowSize={180}
            baseDelay={100}
            charDelay={30}
          >
            {language === 'pl' ? 'Czym pracuję' : 'What I work with'}
          </BurnSpotlightText>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {technologies.filter(Boolean).map((name) => (
            <li key={name} className="grid">
              <TechBadge name={name} size="md" tone="always" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
