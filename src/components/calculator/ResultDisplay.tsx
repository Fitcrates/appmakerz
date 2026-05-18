import type { PriceResult, ServiceConfig } from '@/lib/calculator/types';

type ResultDisplayProps = {
  price: PriceResult;
  service?: ServiceConfig;
  disclaimer: string;
  label: string;
  noPriceTitle: string;
};

export default function ResultDisplay({ price, service, disclaimer, label, noPriceTitle }: ResultDisplayProps) {
  const noPrice = Boolean(service?.noPrice);

  return (
    <div className="relative border border-teal-300/30 bg-white/[0.03] p-6">
      <div className="absolute -top-2 -left-2 h-4 w-4 border-l-2 border-t-2 border-teal-300" aria-hidden="true" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 border-r-2 border-b-2 border-teal-300" aria-hidden="true" />
      <p className="text-xs uppercase tracking-[0.24em] text-teal-300">{label}</p>
      {noPrice ? (
        <h3 className="mt-4 font-oxanium text-3xl font-light text-white sm:text-4xl">{noPriceTitle}</h3>
      ) : (
        <h3 className="mt-4 font-oxanium text-4xl font-light text-white sm:text-5xl">
          {price.min.toLocaleString('pl-PL')} – {price.max.toLocaleString('pl-PL')} zł
        </h3>
      )}
      <p className="mt-4 text-sm leading-relaxed text-white/50">{disclaimer}</p>
    </div>
  );
}
