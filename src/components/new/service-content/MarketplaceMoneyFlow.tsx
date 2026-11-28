import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import SpotlightText from '@/components/new/SpotlightText';
import type { Language } from '@/lib/language';

// The money path of a marketplace, drawn instead of listed: buyer, one cart,
// the split, then platform fee and sellers with a hold before payout. The
// refund runs the other way, so it gets its own dashed lane underneath.
const copy = {
  pl: {
    caption: 'Przepływ pieniędzy w marketplace: od płatności kupującego, przez podział, do wypłaty sprzedawcy, oraz droga zwrotu.',
    steps: [
      { label: '01', title: 'Kupujący', body: 'płaci raz, jedną metodą' },
      { label: '02', title: 'Jeden koszyk', body: 'produkty kilku sprzedawców, zamówienie dzielone na części' },
      { label: '03', title: 'Podział płatności', body: 'operator, np. Stripe Connect, rozdziela kwotę' },
    ],
    fee: { title: 'Prowizja platformy', body: 'stała, procent albo per kategoria' },
    seller: 'Sprzedawca',
    hold: 'okno zwrotów',
    payout: 'wypłata',
    refund: 'Zwrot po wypłacie? System cofa przelew u sprzedawcy i część prowizji, a pieniądze wracają do kupującego.',
    note: 'Każda strzałka to decyzja, którą podejmujemy przed kodem: kto płaci prowizję, ile trwa wstrzymanie, kto pokrywa zwrot.',
  },
  en: {
    caption: 'Money flow in a marketplace: from the buyer’s payment, through the split, to the seller payout, plus the refund path.',
    steps: [
      { label: '01', title: 'Buyer', body: 'pays once, with one method' },
      { label: '02', title: 'One cart', body: 'items from several sellers, one order split into parts' },
      { label: '03', title: 'Payment split', body: 'a provider such as Stripe Connect divides the amount' },
    ],
    fee: { title: 'Platform fee', body: 'flat, percentage or per category' },
    seller: 'Seller',
    hold: 'refund window',
    payout: 'payout',
    refund: 'Refund after payout? The system reverses the seller transfer and part of the fee, and the money goes back to the buyer.',
    note: 'Every arrow is a decision we make before any code: who pays the fee, how long the hold lasts, who covers a refund.',
  },
};

function Connector() {
  return (
    <span aria-hidden="true" className="flex items-center justify-center text-teal-300/70">
      <ArrowDown className="h-5 w-5 lg:hidden" />
      <ArrowRight className="hidden h-5 w-5 lg:block" />
    </span>
  );
}

export default function MarketplaceMoneyFlow({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <figure className="mt-12">
      <figcaption className="sr-only">{t.caption}</figcaption>
      <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.5fr)] lg:gap-4">
        {t.steps.map((step) => (
          <div key={step.label} className="contents">
            <div className="ac-card ac-card--sm flex flex-col gap-2 p-5 lg:min-h-[9.5rem]">
              <span className="font-plex text-xs text-teal-300">{step.label}</span>
              <SpotlightText className="font-oxanium text-lg text-white!" glowSize={90}>{step.title}</SpotlightText>
              <SpotlightText className="font-plex text-sm font-light leading-relaxed text-white/65!" glowSize={90}>{step.body}</SpotlightText>
            </div>
            <Connector />
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 rounded-[20px] bg-teal-300/10 px-5 py-4">
            <SpotlightText className="font-oxanium text-base text-teal-200!" glowSize={90}>{t.fee.title}</SpotlightText>
            <SpotlightText className="font-plex text-sm font-light text-white/65!" glowSize={90}>{t.fee.body}</SpotlightText>
          </div>
          {['A', 'B', 'C'].map((letter) => (
            <div key={letter} className="ac-card ac-card--sm flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3">
              <SpotlightText className="font-oxanium text-base text-white!" glowSize={80}>{`${t.seller} ${letter}`}</SpotlightText>
              <span className="flex items-center gap-1.5 font-plex text-xs">
                <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-white/70">{t.hold}</span>
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-white/40" />
                <span className="rounded-full bg-teal-300/15 px-2.5 py-1 text-teal-200">{t.payout}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-dashed border-orange-300/45 bg-orange-300/[0.06] px-5 py-4 font-plex text-sm leading-relaxed text-orange-100/90">
        <ArrowLeft aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
        <SpotlightText className="text-orange-100/90!" glowSize={110}>{t.refund}</SpotlightText>
      </div>

      <div className="mt-5 max-w-3xl">
        <SpotlightText as="p" className="font-plex text-sm font-light leading-relaxed text-white/55!" glowSize={110}>{t.note}</SpotlightText>
      </div>
    </figure>
  );
}
