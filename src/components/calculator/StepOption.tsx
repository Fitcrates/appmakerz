import type { PriceOption } from '@/lib/calculator/types';
import type { PricingCopyOption } from '@/data/pricing-copy';

type StepOptionProps = {
  options?: Record<string, PriceOption>;
  copy?: Record<string, PricingCopyOption>;
  value?: string;
  onChange: (value: string) => void;
  pricePrefix: string;
  noCost: string;
};

export default function StepOption({ options, copy, value, onChange, pricePrefix, noCost }: StepOptionProps) {
  const entries = Object.entries(options || {});

  if (!entries.length) {
    return <p className="text-white/55">Ten krok nie ma dostępnych opcji dla wybranej usługi.</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map(([key, option]) => (
        <label key={key} className={`group flex cursor-pointer items-start justify-between gap-4 border p-5 transition-colors ${value === key ? 'border-teal-300 bg-white/[0.06]' : 'border-white/10 bg-transparent hover:border-white/25 hover:bg-white/[0.03]'}`}>
          <span>
            <span className="block font-oxanium text-xl font-light text-white transition-colors group-hover:text-teal-300">{copy?.[key]?.label || option.label}</span>
            {copy?.[key]?.description ? <span className="mt-2 block text-sm leading-relaxed text-white/60">{copy[key].description}</span> : null}
            <span className="mt-3 block text-xs uppercase tracking-[0.16em] text-white/35">
              {option.max === 0 ? noCost : `${pricePrefix}: ${option.min.toLocaleString('pl-PL')} – ${option.max.toLocaleString('pl-PL')} zł`}
            </span>
          </span>
          <input type="radio" checked={value === key} onChange={() => onChange(key)} className="mt-1 h-4 w-4 flex-shrink-0 accent-teal-300" />
        </label>
      ))}
    </div>
  );
}
