import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import { TechBadgeList } from '@/components/project/TechBadge';
import type { Language } from '@/lib/language';

interface TechChipsProps {
  technologies: string[];
  language: Language;
}

// Reuses the badge list from the project pages rather than a second, plainer
// chip style: same brand icons, same fallback monogram for anything unmapped,
// so the stack reads identically wherever it appears on the site.
export default function TechChips({ technologies, language }: TechChipsProps) {
  if (!technologies.length) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs tracking-[0.3em] uppercase text-white/30">
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
        <TechBadgeList items={technologies} size="md" tone="always" className="mt-10 max-w-4xl" />
      </div>
    </section>
  );
}
