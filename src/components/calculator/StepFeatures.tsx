import type { PriceOption } from '@/lib/calculator/types';
import type { PricingCopyOption } from '@/data/pricing-copy';

type StepFeaturesProps = {
  options?: Record<string, PriceOption>;
  copy?: Record<string, PricingCopyOption>;
  selected: string[];
  onToggle: (featureKey: string) => void;
  pricePrefix: string;
};

export default function StepFeatures({ options, copy, selected, onToggle, pricePrefix }: StepFeaturesProps) {
  const entries = Object.entries(options || {});

  if (!entries.length) {
    return <p className="text-white/55">Brak dodatkowych funkcji do wyboru dla tej usługi.</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {entries.map(([key, option]) => (
        <label key={key} className={`group cursor-pointer border p-5 transition-colors ${selected.includes(key) ? 'border-teal-300 bg-white/[0.06]' : 'border-white/10 bg-transparent hover:border-white/25 hover:bg-white/[0.03]'}`}>
          <span className="flex items-start gap-3">
            <input type="checkbox" checked={selected.includes(key)} onChange={() => onToggle(key)} className="mt-1 h-4 w-4 accent-teal-300" />
            <span>
              <span className="block font-oxanium text-xl font-light text-white transition-colors group-hover:text-teal-300">{copy?.[key]?.label || option.label}</span>
              {copy?.[key]?.description ? <span className="mt-2 block text-sm leading-relaxed text-white/60">{copy[key].description}</span> : null}
              {option.max > 0 ? <span className="mt-3 block text-xs uppercase tracking-[0.16em] text-white/35">{pricePrefix}: {option.min.toLocaleString('pl-PL')} – {option.max.toLocaleString('pl-PL')} zł</span> : null}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
