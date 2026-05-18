import { Globe, ShoppingCart, Store, Bot, Settings } from 'lucide-react';
import type { PricingConfig } from '@/lib/calculator/types';
import type { PricingCopy } from '@/data/pricing-copy';

const serviceIcons: Record<string, React.ReactNode> = {
  website: <Globe className="h-8 w-8 text-teal-300" />,
  ecommerce: <ShoppingCart className="h-8 w-8 text-teal-300" />,
  marketplace: <Store className="h-8 w-8 text-teal-300" />,
  ai: <Bot className="h-8 w-8 text-teal-300" />,
  saas: <Settings className="h-8 w-8 text-teal-300" />,
};

type StepServiceTypeProps = {
  config: PricingConfig;
  copy: PricingCopy['services'];
  selectedService: string;
  onSelect: (serviceKey: string) => void;
  noPriceHint: string;
};

export default function StepServiceType({ config, copy, selectedService, onSelect, noPriceHint }: StepServiceTypeProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(config.services).map(([key, service]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={`group relative min-h-[190px] border p-6 text-left transition-colors ${selectedService === key ? 'border-teal-300 bg-white/[0.06]' : 'border-white/10 bg-transparent hover:border-white/25 hover:bg-white/[0.03]'}`}
        >
          <span className="mb-5 block" aria-hidden="true">{serviceIcons[key]}</span>
          <span className="block font-oxanium text-2xl font-light text-white transition-colors group-hover:text-teal-300">{copy[key]?.label || service.label}</span>
          <span className="mt-4 block text-sm leading-relaxed text-white/60">{copy[key]?.description}</span>
          {service.noPrice ? <span className="mt-4 block text-xs uppercase tracking-[0.18em] text-teal-300">{noPriceHint}</span> : null}
          <span className="absolute -bottom-px -left-px h-px w-0 bg-teal-300 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
