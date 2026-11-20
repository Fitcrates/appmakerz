import { ArrowUpRight } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { pricingCopy } from '@/data/pricing-copy';
import { budgetCalculatorQuery, budgetProjects } from '@/data/project-budget';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';

const copy = {
  pl: {
    heading: 'Ile kosztuje sklep na Medusa.js?',
    from: 'od',
    tax: 'netto',
    scope: 'Migrację wyceniam po sprawdzeniu katalogu i danych do przeniesienia. Koszt integracji i zmian w procesie zakupowym zależy od systemów, które mają ze sobą współpracować, oraz od Twojego modelu sprzedaży.',
    calculator: 'Oblicz orientacyjny koszt sklepu',
  },
  en: {
    heading: 'How much does a Medusa.js store cost?',
    from: 'from',
    tax: 'excluding VAT',
    scope: 'I quote migrations after reviewing the catalogue and the data you need to move. Integration and checkout costs depend on the systems you need to connect and how you sell.',
    calculator: 'Estimate your store budget',
  },
};

export default function MedusaStorePricing({ language, startingPrice }: { language: Language; startingPrice: number }) {
  const t = copy[language];
  const amount = new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'en-GB', {
    style: 'currency', currency: 'PLN', maximumFractionDigits: 0, useGrouping: 'always',
  }).format(startingPrice);
  const calculatorHref = `${localizedPath(language, '/kalkulator')}?${budgetCalculatorQuery('ecommerce', [])}`;

  return (
    <section aria-labelledby="medusa-store-pricing" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 border border-white/10 bg-white/4 p-6 sm:p-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
        <div>
          <h2 id="medusa-store-pricing" className="font-oxanium text-2xl font-light text-white sm:text-3xl">
            {t.heading}
          </h2>
          <p className="mt-3 font-plex text-teal-200">
            {t.from} <strong className="text-xl font-medium">{amount}</strong> {t.tax}
          </p>
        </div>
        <div className="space-y-3 font-plex text-base leading-relaxed text-white/70">
          <p>{pricingCopy[language].base[budgetProjects.ecommerce.base].description}</p>
          <p>{t.scope}</p>
          <PrefetchLink href={calculatorHref} className="inline-flex items-center gap-2 font-medium text-teal-200 underline-offset-4 hover:underline">
            {t.calculator} <ArrowUpRight aria-hidden="true" size={16} />
          </PrefetchLink>
        </div>
      </div>
    </section>
  );
}
