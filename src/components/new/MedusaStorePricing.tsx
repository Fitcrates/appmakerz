import { ArrowUpRight, Check } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import SpotlightText from '@/components/new/SpotlightText';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import { pricingCopy } from '@/data/pricing-copy';
import { budgetCalculatorQuery, budgetProjects } from '@/data/project-budget';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';

// Price next to what it buys. The layer stack answers the obvious doubt
// ("how can a Medusa store start this low?"): the core arrives ready, and the
// budget goes to the layers that make the store yours.
const copy = {
  pl: {
    heading: 'Ile kosztuje sklep na Medusa.js?',
    lead: 'Rdzeń Medusy daje od razu podstawowe wersje tego, czego potrzebuje sklep. Płacisz za to, co trzeba rozbudować i dopasować, a nie za budowę koszyka od zera.',
    layers: [
      { title: 'Storefront pod Twoją markę', body: 'Next.js, szybki, pod SEO, Twój wygląd' },
      { title: 'Konfiguracja pod Twój rynek', body: 'BLIK i Przelewy24, dostawy, historia cen pod Omnibus' },
      { title: 'Wdrożenie i przekazanie', body: 'hosting, monitoring, repozytorium i wszystkie dostępy' },
      { title: 'Rozbudowa tego, co podstawowe', body: 'rozszerzenia, bezpieczeństwo, wydajność, odporność na błędy i awarie' },
    ],
    added: 'dopisuję',
    core: 'Rdzeń Medusy',
    ready: 'gotowe w podstawowej postaci',
    coreNote: 'Komuś taka podstawa wystarczy. Inni potrzebują rozszerzeń albo bezpieczniejszej, wydajniejszej i odporniejszej implementacji. Tu wkraczam.',
    coreItems: ['katalog i warianty', 'koszyk i checkout', 'zamówienia i zwroty', 'promocje i cenniki', 'klienci i grupy', 'panel administracyjny', 'API do integracji'],
    label: 'Prosty sklep na Medusa.js',
    from: 'od',
    tax: 'netto',
    perks: ['Bez miesięcznego abonamentu platformy i płatnych aplikacji', 'Płacisz za hosting, kod zostaje Twój', 'Rośnie z Tobą: B2B, marketplace i integracje na tym samym silniku'],
    whyLabel: 'Dlaczego taniej',
    why: 'Narzędzia agentowe AI z MCP dla Medusy robią powtarzalną część pracy szybciej. Mój czas idzie na to, co odróżnia Twój sklep.',
    calculator: 'Oblicz koszt swojego sklepu',
    contact: 'Opowiedz o projekcie',
    scope: 'Migrację wyceniam po sprawdzeniu katalogu i danych do przeniesienia. Koszt integracji i zmian w procesie zakupowym zależy od systemów, które mają ze sobą współpracować.',
    shopify: 'Chcesz tylko najszybszego startu i zero myślenia o hostingu? Wtedy Shopify też ma sens. Powiem Ci to wprost.',
  },
  en: {
    heading: 'How much does a Medusa.js store cost?',
    lead: 'The Medusa core gives you basic versions of what a store needs from day one. You pay for what has to be extended and fitted, not for building a cart from scratch.',
    layers: [
      { title: 'A storefront for your brand', body: 'Next.js, fast, built for SEO, your look' },
      { title: 'Set up for your market', body: 'local payment methods, shipping, Omnibus price history' },
      { title: 'Launch and handover', body: 'hosting, monitoring, the repository and every access' },
      { title: 'Going beyond the basics', body: 'extensions, security, performance, resilience to errors and outages' },
    ],
    added: 'I build',
    core: 'Medusa core',
    ready: 'ready in basic form',
    coreNote: 'For some stores this base is enough. Others need extensions, or a more secure, faster and more resilient implementation. That is where I come in.',
    coreItems: ['catalogue and variants', 'cart and checkout', 'orders and returns', 'promotions and price lists', 'customers and groups', 'admin panel', 'integration API'],
    label: 'A simple Medusa.js store',
    from: 'from',
    tax: 'excl. VAT',
    perks: ['No monthly platform subscription or paid apps', 'You pay for hosting, the code stays yours', 'Grows with you: B2B, marketplace and integrations on the same engine'],
    whyLabel: 'Why it costs less',
    why: 'Agentic AI tools with MCP for Medusa do the repetitive part of the work faster. My time goes to what makes your store different.',
    calculator: 'Estimate your store budget',
    contact: 'Tell me about the project',
    scope: 'I quote migrations after reviewing the catalogue and the data you need to move. Integration and checkout costs depend on the systems that have to work together.',
    shopify: 'Only want the fastest start and no thinking about hosting? Then Shopify makes sense too. I will tell you so.',
  },
};

export default function MedusaStorePricing({ language, startingPrice }: { language: Language; startingPrice: number }) {
  const t = copy[language];
  const amount = new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'en-GB', {
    style: 'currency', currency: 'PLN', maximumFractionDigits: 0, useGrouping: 'always',
  }).format(startingPrice);
  const calculatorHref = `${localizedPath(language, '/kalkulator')}?${budgetCalculatorQuery('ecommerce', [])}`;

  return (
    <section aria-labelledby="medusa-store-pricing" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl lg:mb-14">
          <div id="medusa-store-pricing">
            <BurnSpotlightText
              as="h2"
              className="font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl"
              glowSize={180}
              baseDelay={100}
              charDelay={30}
            >
              {t.heading}
            </BurnSpotlightText>
          </div>
          <div className="mt-5">
            <SpotlightText as="p" className="font-plex text-lg font-light leading-relaxed text-white/65!" glowSize={130}>{t.lead}</SpotlightText>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div className="flex flex-col gap-2.5">
            {t.layers.map((layer) => (
              <div key={layer.title} className="ac-card ac-card--sm grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 sm:px-7">
                <span className="flex flex-col gap-1">
                  <SpotlightText className="font-oxanium text-lg text-white! sm:text-xl" glowSize={110}>{layer.title}</SpotlightText>
                  <SpotlightText className="font-plex text-sm font-light text-white/65!" glowSize={100}>{layer.body}</SpotlightText>
                </span>
                <span className="rounded-full bg-orange-300/15 px-3 py-1 font-plex text-xs text-orange-200">{t.added}</span>
              </div>
            ))}
            <div className="flex grow flex-col gap-4 rounded-[20px] bg-teal-300/10 px-5 py-6 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <SpotlightText className="font-oxanium text-xl text-teal-200!" glowSize={100}>{t.core}</SpotlightText>
                <span className="rounded-full bg-teal-300 px-3 py-1 font-plex text-xs text-indigo-950">{t.ready}</span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {t.coreItems.map((item) => (
                  <li key={item} className="rounded-full bg-indigo-950/60 px-3.5 py-1.5">
                    <SpotlightText className="font-plex text-sm text-white/85!" glowSize={70}>{item}</SpotlightText>
                  </li>
                ))}
              </ul>
              <SpotlightText as="p" className="font-plex text-sm leading-relaxed text-white/75!" glowSize={110}>{t.coreNote}</SpotlightText>
            </div>
          </div>

          <div className="ac-card flex flex-col gap-6 p-6 sm:p-8">
            <SpotlightText className="font-plex text-xs uppercase tracking-[0.2em] text-white/60!" glowSize={90}>{t.label}</SpotlightText>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-plex text-lg text-white/70">{t.from}</span>
              <span className="font-oxanium text-5xl font-light leading-none text-white sm:text-6xl">{amount}</span>
              <span className="font-plex text-base text-white/65">{t.tax}</span>
            </p>
            <SpotlightText as="p" className="font-plex text-base font-light leading-relaxed text-white/70!" glowSize={120}>
              {pricingCopy[language].base[budgetProjects.ecommerce.base].description}
            </SpotlightText>
            <ul className="flex flex-col gap-3">
              {t.perks.map((perk) => (
                <li key={perk} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2.5 font-plex text-base leading-relaxed text-white/85">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 text-teal-300" />
                  <SpotlightText className="text-white/85!" glowSize={100}>{perk}</SpotlightText>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1.5 rounded-2xl bg-indigo-950/70 p-5">
              <span className="font-plex text-xs uppercase tracking-[0.15em] text-teal-300">{t.whyLabel}</span>
              <SpotlightText className="font-plex text-sm leading-relaxed text-white/75!" glowSize={110}>{t.why}</SpotlightText>
            </div>
            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrefetchLink
                href={calculatorHref}
                className="inline-flex items-center justify-center gap-2 bg-teal-300 px-6 py-4 font-plex font-medium text-indigo-950 transition-colors hover:bg-teal-200"
              >
                {t.calculator} <ArrowUpRight aria-hidden="true" size={16} />
              </PrefetchLink>
              <PrefetchLink
                href={localizedPath(language, '/#contact')}
                className="inline-flex items-center justify-center border border-white/25 px-6 py-4 font-plex text-white transition-colors hover:border-teal-300/60 hover:text-teal-200"
              >
                {t.contact}
              </PrefetchLink>
            </div>
            <SpotlightText as="p" className="font-plex text-sm leading-relaxed text-white/55!" glowSize={110}>{t.scope}</SpotlightText>
            <SpotlightText as="p" className="font-plex text-sm leading-relaxed text-white/55!" glowSize={110}>{t.shopify}</SpotlightText>
          </div>
        </div>
      </div>
    </section>
  );
}
