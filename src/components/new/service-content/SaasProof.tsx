'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import PrefetchLink from '@/components/next/PrefetchLink';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';

// Proof for the web application page: 3DPCC, a SaaS ERP built and run by me.
// The screenshots are the ones already published in the 3DPCC case study
// (Sanity assets), so nothing here shows data that is not public yet.
const CDN = 'https://cdn.sanity.io/images/867nk643/production/';

const screens = [
  {
    id: 'order',
    src: `${CDN}08ebe287ea2e876ec13f0a840c715e3aa0f95aa3-1586x992.webp`,
    width: 1586,
    height: 992,
    label: { pl: 'Zamówienie', en: 'Order' },
    alt: {
      pl: 'Zamówienie ORD-000214 w 3DPCC: cztery etapy (potwierdzenie, płatność, produkcja, wysyłka), pozycje, marża produktu i log aktywności',
      en: '3DPCC order ORD-000214 with four lifecycle steps (confirmation, payment, production, shipping), order items, product margin, and an activity log',
    },
  },
  {
    id: 'calculator',
    src: `${CDN}8189689583b18b53327d6517584e6ad6e2d91b64-1576x998.webp`,
    width: 1576,
    height: 998,
    label: { pl: 'Kalkulator', en: 'Calculator' },
    alt: {
      pl: 'Kalkulator kosztu wydruku w 3DPCC: materiał, czas druku i pracy oraz ustawienia zamówienia po lewej, sugerowana wycena 39,95 EUR i rozbicie kosztów po prawej',
      en: '3DPCC print cost calculator: material, print and labor time, and order settings on the left, suggested quote of 39.95 EUR and a landed cost breakdown on the right',
    },
  },
  {
    id: 'warehouse',
    src: `${CDN}7dd33b50170a9308005687beeeed905b060cadb7-1582x994.webp`,
    width: 1582,
    height: 994,
    label: { pl: 'Magazyn', en: 'Warehouse' },
    alt: {
      pl: 'Magazyn filamentów w 3DPCC: szpule PLA, PETG i TPU z kosztem za gram, stanem, ilością w użyciu i ilością dostępną',
      en: '3DPCC filament warehouse: PLA, PETG, and TPU spools listed with cost per gram, stock, quantity in use, and quantity available',
    },
  },
  {
    id: 'analytics',
    src: `${CDN}9f15e8af60d3153a0de13cb819dbb5fff897bdaf-1590x989.webp`,
    width: 1590,
    height: 989,
    label: { pl: 'Analityka', en: 'Analytics' },
    alt: {
      pl: 'Panel analityki 3DPCC: wartość i liczba zamówień, marża wycenionych zamówień i przychód z 30 dni z ostrzeżeniami o brakujących kosztach',
      en: '3DPCC analytics panel: order value, order count, margin of costed orders, and a 30-day revenue chart with cost gap warnings',
    },
  },
] as const;

const copy = {
  pl: {
    eyebrow: 'Dowód: 3DPCC',
    heading: 'Jak wygląda aplikacja, którą zbudowałem od zera?',
    intro: '3DPCC to SaaS ERP dla drukarni i farm druku 3D. Zaprojektowałem go, napisałem i rozwijam sam. Zaczął jako kalkulator wycen, dziś prowadzi zamówienia, magazyn, produkcję i konta wielu firm.',
    points: [
      'Zamówienie jako maszyna stanów, od szkicu po wysyłkę, powiązana z magazynem',
      'Rezerwacje stanów, które nie zdublują się przy powtórzonym żądaniu',
      'Kolejka produkcji: zamówienia stają się zadaniami druku na konkretnych drukarkach, a nieudany wydruk wraca do kolejki i zdejmuje materiał ze stanu',
      'Firmy z wieloma użytkownikami i dostępem zależnym od planu w Stripe',
    ],
    numbers: [
      { value: '16', label: 'języków interfejsu' },
      { value: '2', label: 'warstwy izolacji danych klientów' },
      { value: 'OpenAPI 3.1', label: 'udokumentowane API' },
    ],
    tabs: 'Ekrany 3DPCC',
    caseStudy: 'Przeczytaj case study',
    blog: 'Migracja produkcji w 7 godzin',
    site: 'Zobacz 3dpcc.com',
  },
  en: {
    eyebrow: 'Proof: 3DPCC',
    heading: 'What does an app I built from scratch look like?',
    intro: '3DPCC is a SaaS ERP for 3D print shops and print farms. I designed it, wrote it and keep developing it on my own. It started as a quoting calculator; today it runs orders, stock, production and accounts for many companies.',
    points: [
      'Orders as a state machine, from draft to shipping, tied to the warehouse',
      'Stock reservations that do not double up when a request is repeated',
      'Production queue: orders become print jobs on specific printers, and a failed print goes back to the queue and takes its material from stock',
      'Companies with many users and access based on their Stripe plan',
    ],
    numbers: [
      { value: '16', label: 'interface languages' },
      { value: '2', label: 'layers of customer data isolation' },
      { value: 'OpenAPI 3.1', label: 'documented API' },
    ],
    tabs: '3DPCC screens',
    caseStudy: 'Read the case study',
    blog: 'A production migration in 7 hours',
    site: 'Visit 3dpcc.com',
  },
};

export default function SaasProof({ language }: { language: Language }) {
  const t = copy[language];
  const [active, setActive] = useState(0);
  const screen = screens[active];

  return (
    <section id="dowod-3dpcc" className="scroll-mt-28 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
          <span className="mb-4 block font-plex text-xs uppercase tracking-[0.3em] text-teal-300/80">{t.eyebrow}</span>
          <BurnSpotlightText
            as="h2"
            className="font-oxanium text-3xl font-light leading-tight text-white sm:text-4xl/tight lg:text-5xl/tight"
            glowSize={180}
            baseDelay={100}
            charDelay={30}
          >
            {t.heading}
          </BurnSpotlightText>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <div role="tablist" aria-label={t.tabs} className="mb-4 flex flex-wrap gap-2">
              {screens.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`saas-tab-${item.id}`}
                  aria-selected={active === index}
                  aria-controls="saas-screen"
                  onClick={() => setActive(index)}
                  className={`min-h-11 rounded-full px-4 py-2 font-plex text-sm transition-colors ${
                    active === index ? 'bg-teal-300 text-indigo-950' : 'bg-white/[0.06] text-white/75 hover:bg-white/[0.1] hover:text-white'
                  }`}
                >
                  {item.label[language]}
                </button>
              ))}
            </div>
            <div
              id="saas-screen"
              role="tabpanel"
              aria-labelledby={`saas-tab-${screen.id}`}
              className="overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03]"
            >
              <Image
                key={screen.id}
                src={screen.src}
                alt={screen.alt[language]}
                width={screen.width}
                height={screen.height}
                sizes="(max-width: 1023px) calc(100vw - 32px), 720px"
                className="h-auto w-full"
              />
            </div>
            <SpotlightText as="p" className="mt-3 font-plex text-sm leading-relaxed text-white/55!" glowSize={110}>
              {screen.alt[language]}
            </SpotlightText>
          </div>

          <div className="flex flex-col gap-8">
            <SpotlightText as="p" className="font-plex text-lg font-light leading-relaxed text-white/70!" glowSize={130}>
              {t.intro}
            </SpotlightText>

            <ul className="flex flex-col gap-3">
              {t.points.map((point) => (
                <li key={point} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-2.5 font-plex text-base leading-relaxed">
                  <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-teal-300" aria-hidden="true" />
                  <SpotlightText className="font-light text-white/80!" glowSize={110}>{point}</SpotlightText>
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-3 gap-3">
              {t.numbers.map((item) => (
                <div key={item.label} className="ac-card ac-card--sm flex flex-col gap-1.5 p-4">
                  <dt className="order-2">
                    <SpotlightText className="font-plex text-xs leading-snug text-white/60!" glowSize={70}>{item.label}</SpotlightText>
                  </dt>
                  <dd className="order-1 whitespace-nowrap font-oxanium text-lg font-light leading-tight text-teal-200 sm:text-xl">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrefetchLink
                href={localizedPath(language, '/project/3dpcc-erp-system-calculator-3d-print-farms')}
                className="inline-flex items-center justify-center gap-2 bg-teal-300 px-6 py-4 font-plex font-medium text-indigo-950 transition-colors hover:bg-teal-200"
              >
                {t.caseStudy} <ArrowUpRight aria-hidden="true" size={16} />
              </PrefetchLink>
              <PrefetchLink
                href={localizedPath(language, '/blog/3dpcc-production-migration-7-hours-downtime')}
                className="inline-flex items-center justify-center border border-white/25 px-6 py-4 font-plex text-white transition-colors hover:border-teal-300/60 hover:text-teal-200"
              >
                {t.blog}
              </PrefetchLink>
            </div>
            <a
              href="https://3dpcc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 font-plex text-sm text-teal-300 transition-colors hover:text-teal-200"
            >
              {t.site} <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
