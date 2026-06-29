import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '867nk643';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.BACKEND_SANITY_TOKEN;

if (!token) {
  throw new Error('Missing BACKEND_SANITY_TOKEN.');
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2025-02-19',
});

const textBlock = (key, text, style = 'normal') => ({
  _key: key,
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
});

const document = {
  _id: 'service-shopify-development',
  _type: 'serviceLanding',
  title: {
    en: 'Shopify Stores — From Fast Launch to Custom Storefront',
    pl: 'Sklepy Shopify — od szybkiego startu po custom storefront',
  },
  slug: { _type: 'slug', current: 'shopify-development' },
  serviceType: 'shopify-development',
  isLocalLanding: false,
  eyebrow: {
    en: 'Shopify Development',
    pl: 'Wdrożenia Shopify',
  },
  intro: {
    en: 'I design and build Shopify stores matched to your business stage — from a focused theme-based launch to a fully custom headless storefront on Next.js or TanStack. You get the speed and reliability of Shopify with a customer experience shaped around your brand, products, and growth plan.',
    pl: 'Projektuję i wdrażam sklepy Shopify dopasowane do etapu rozwoju biznesu — od sprawnego startu na gotowym motywie po w pełni customowy storefront headless na Next.js lub TanStack. Otrzymujesz szybkość i niezawodność Shopify oraz doświadczenie zakupowe zbudowane wokół Twojej marki, produktów i planu wzrostu.',
  },
  problems: {
    en: [
      'You want to launch quickly, but a generic template does not express the quality of your brand',
      'Your current Shopify theme is slow, difficult to maintain, or limits conversion-focused changes',
      'You need subscriptions, bundles, B2B pricing, multilingual sales, or integrations that must work as one coherent system',
      'Your team spends too much time on manual work between Shopify, ERP, CRM, fulfilment, and marketing tools',
      'You have outgrown a standard storefront and need full control over UX without replacing Shopify as the commerce engine',
      'You need a technical partner who can choose the right level of customisation instead of pushing the most expensive architecture',
    ],
    pl: [
      'Chcesz szybko rozpocząć sprzedaż, ale generyczny szablon nie oddaje jakości Twojej marki',
      'Obecny motyw Shopify jest wolny, trudny w utrzymaniu lub ogranicza zmiany nastawione na konwersję',
      'Potrzebujesz subskrypcji, zestawów, cen B2B, sprzedaży wielojęzycznej albo integracji działających jako jeden spójny system',
      'Zespół traci czas na ręczną pracę pomiędzy Shopify, ERP, CRM, fulfilmentem i narzędziami marketingowymi',
      'Standardowy storefront przestał wystarczać i potrzebujesz pełnej kontroli nad UX bez wymiany Shopify jako silnika commerce',
      'Potrzebujesz partnera technicznego, który dobierze właściwy poziom customizacji zamiast proponować najdroższą architekturę',
    ],
  },
  deliverables: {
    en: [
      'Discovery and recommendation: theme customisation, custom theme, or headless Shopify',
      'Store information architecture and conversion-focused customer journeys',
      'Responsive Shopify storefront aligned with your visual identity',
      'Product catalogue, collections, variants, markets, taxes, shipping, and payment configuration',
      'Custom sections, product logic, and integrations required by your business model',
      'For headless projects: a custom Next.js or TanStack storefront connected through Shopify APIs',
      'Analytics, SEO foundations, performance optimisation, and pre-launch testing',
      'Deployment, handover, documentation, and post-launch development options',
    ],
    pl: [
      'Analiza i rekomendacja: modyfikacja motywu, custom theme albo headless Shopify',
      'Architektura informacji sklepu i ścieżki zakupowe nastawione na konwersję',
      'Responsywny storefront Shopify spójny z identyfikacją wizualną marki',
      'Konfiguracja katalogu, kolekcji, wariantów, Shopify Markets, podatków, dostaw i płatności',
      'Dedykowane sekcje, logika produktowa i integracje wymagane przez Twój model biznesowy',
      'Dla projektów headless: customowy storefront na Next.js lub TanStack połączony przez API Shopify',
      'Analityka, fundamenty SEO, optymalizacja wydajności i testy przed startem',
      'Wdrożenie, przekazanie, dokumentacja i możliwość dalszego rozwoju po uruchomieniu',
    ],
  },
  processSteps: {
    en: [
      'Discovery — we define your products, markets, operational needs, and growth priorities',
      'Architecture choice — I recommend a theme-based, custom-theme, or headless approach with clear trade-offs',
      'UX and scope — we map the storefront, customer journeys, integrations, timeline, and budget',
      'Implementation — I build the store, custom features, content sections, and integrations',
      'Quality assurance — we test mobile UX, checkout, payments, shipping, analytics, SEO, and performance',
      'Launch and growth — deployment, training, documentation, and an agreed plan for further iterations',
    ],
    pl: [
      'Analiza — definiujemy produkty, rynki, potrzeby operacyjne i priorytety wzrostu',
      'Wybór architektury — rekomenduję motyw, custom theme lub headless wraz z jasnym omówieniem kompromisów',
      'UX i zakres — planujemy storefront, ścieżki klienta, integracje, harmonogram i budżet',
      'Implementacja — buduję sklep, dedykowane funkcje, sekcje treściowe i integracje',
      'Kontrola jakości — testujemy mobile UX, checkout, płatności, dostawy, analitykę, SEO i wydajność',
      'Start i rozwój — wdrożenie, szkolenie, dokumentacja oraz uzgodniony plan kolejnych iteracji',
    ],
  },
  faq: {
    en: [
      {
        _key: 'shopify-faq-en-1',
        question: 'Do I need a custom headless Shopify storefront?',
        answer: 'Not always. A well-selected theme with thoughtful customisation is often the best option for a fast, cost-effective launch. Headless makes sense when your brand needs a highly distinctive experience, advanced performance, complex content, or frontend logic that a standard Shopify theme cannot deliver. I recommend the simplest architecture that meets your real goals.',
      },
      {
        _key: 'shopify-faq-en-2',
        question: 'Can you build the storefront with Next.js or TanStack?',
        answer: 'Yes. I build custom Shopify storefronts with Next.js or the TanStack ecosystem, using Shopify as the commerce backend. The right framework depends on the project, hosting strategy, content needs, team skills, and the level of control required.',
      },
      {
        _key: 'shopify-faq-en-3',
        question: 'Can you customise an existing Shopify theme?',
        answer: 'Yes. I can improve an existing theme, add reusable sections, refine product and collection pages, improve mobile UX, optimise performance, and implement custom features without rebuilding the whole store when that would not create enough value.',
      },
      {
        _key: 'shopify-faq-en-4',
        question: 'Can you migrate my current store to Shopify?',
        answer: 'Yes. Migration can cover products, variants, collections, customers, content, redirects, and selected order data. Before implementation I audit the source platform and prepare a migration plan that protects SEO and reduces disruption.',
      },
      {
        _key: 'shopify-faq-en-5',
        question: 'Do you integrate Shopify with other business systems?',
        answer: 'Yes. I can integrate Shopify with ERP, CRM, fulfilment, invoicing, marketing, analytics, product information, and other APIs. The goal is a reliable flow of data and less manual work, not another fragile collection of disconnected apps.',
      },
      {
        _key: 'shopify-faq-en-6',
        question: 'Will I be able to manage the store myself?',
        answer: 'Yes. Products, collections, orders, discounts, markets, and content remain manageable through Shopify. I also build reusable content sections and provide handover documentation or training so your team can operate the store confidently.',
      },
    ],
    pl: [
      {
        _key: 'shopify-faq-pl-1',
        question: 'Czy potrzebuję customowego sklepu Shopify headless?',
        answer: 'Nie zawsze. Dobrze dobrany motyw z przemyślanymi modyfikacjami często jest najlepszym rozwiązaniem dla szybkiego i opłacalnego startu. Headless ma sens, gdy marka potrzebuje wyjątkowego doświadczenia, wysokiej wydajności, rozbudowanych treści lub logiki frontendu, której nie zapewni standardowy motyw Shopify. Rekomenduję najprostszą architekturę, która realizuje rzeczywiste cele.',
      },
      {
        _key: 'shopify-faq-pl-2',
        question: 'Czy możesz zbudować storefront na Next.js lub TanStack?',
        answer: 'Tak. Buduję customowe storefronty Shopify na Next.js lub w ekosystemie TanStack, wykorzystując Shopify jako backend commerce. Wybór frameworka zależy od projektu, hostingu, potrzeb contentowych, kompetencji zespołu i wymaganego poziomu kontroli.',
      },
      {
        _key: 'shopify-faq-pl-3',
        question: 'Czy możesz zmodyfikować istniejący motyw Shopify?',
        answer: 'Tak. Mogę rozwinąć istniejący motyw, dodać wielokrotnego użytku sekcje, ulepszyć strony produktów i kolekcji, poprawić mobile UX, zoptymalizować wydajność oraz wdrożyć dedykowane funkcje bez przebudowy całego sklepu, jeśli nie przyniosłaby ona wystarczającej wartości.',
      },
      {
        _key: 'shopify-faq-pl-4',
        question: 'Czy możesz przenieść mój obecny sklep na Shopify?',
        answer: 'Tak. Migracja może objąć produkty, warianty, kolekcje, klientów, treści, przekierowania oraz wybrane dane zamówień. Przed wdrożeniem audytuję platformę źródłową i przygotowuję plan migracji chroniący SEO oraz ograniczający zakłócenia sprzedaży.',
      },
      {
        _key: 'shopify-faq-pl-5',
        question: 'Czy integrujesz Shopify z innymi systemami firmy?',
        answer: 'Tak. Mogę połączyć Shopify z ERP, CRM, fulfilmentem, fakturowaniem, marketingiem, analityką, systemem informacji produktowej i innymi API. Celem jest niezawodny przepływ danych i mniej ręcznej pracy, a nie kolejny kruchy zestaw niepołączonych aplikacji.',
      },
      {
        _key: 'shopify-faq-pl-6',
        question: 'Czy będę w stanie samodzielnie zarządzać sklepem?',
        answer: 'Tak. Produkty, kolekcje, zamówienia, rabaty, rynki i treści nadal obsługujesz w Shopify. Tworzę też sekcje treściowe wielokrotnego użytku i przekazuję dokumentację lub szkolenie, aby Twój zespół mógł pewnie prowadzić sklep.',
      },
    ],
  },
  content: {
    en: [
      textBlock('shopify-content-en-1', 'The right Shopify architecture for your stage', 'h3'),
      textBlock('shopify-content-en-2', 'A new brand does not need the same architecture as an established store with multiple markets, complex integrations, and a large content operation. I begin by matching the technical approach to your current needs and the next realistic stage of growth.'),
      textBlock('shopify-content-en-3', 'Theme-based Shopify', 'h3'),
      textBlock('shopify-content-en-4', 'The fastest route to a reliable store. I select or refine a proven theme, adapt it to your brand, configure commerce essentials, and add the custom sections needed to make the storefront feel intentional rather than generic.'),
      textBlock('shopify-content-en-5', 'Custom Shopify theme', 'h3'),
      textBlock('shopify-content-en-6', 'A strong middle ground when you need a distinctive experience while keeping Shopify’s native theme workflow. The design, sections, templates, and product experience are built around your business without introducing a separate frontend stack.'),
      textBlock('shopify-content-en-7', 'Headless Shopify with Next.js or TanStack', 'h3'),
      textBlock('shopify-content-en-8', 'For brands that need complete frontend freedom, advanced content, or application-like customer journeys. Shopify remains the dependable commerce engine while the custom storefront gives us precise control over UX, performance, and integrations.'),
    ],
    pl: [
      textBlock('shopify-content-pl-1', 'Właściwa architektura Shopify dla Twojego etapu', 'h3'),
      textBlock('shopify-content-pl-2', 'Nowa marka nie potrzebuje tej samej architektury co rozwinięty sklep działający na wielu rynkach, z rozbudowanymi integracjami i dużą ilością treści. Zaczynam od dopasowania rozwiązania technicznego do obecnych potrzeb i kolejnego realistycznego etapu wzrostu.'),
      textBlock('shopify-content-pl-3', 'Shopify na motywie', 'h3'),
      textBlock('shopify-content-pl-4', 'Najszybsza droga do niezawodnego sklepu. Dobieram lub rozwijam sprawdzony motyw, dopasowuję go do marki, konfiguruję kluczowe elementy sprzedaży i dodaję dedykowane sekcje, dzięki którym storefront jest przemyślany, a nie generyczny.'),
      textBlock('shopify-content-pl-5', 'Customowy motyw Shopify', 'h3'),
      textBlock('shopify-content-pl-6', 'Dobry kompromis, gdy potrzebujesz wyróżniającego doświadczenia, ale chcesz zachować natywny workflow motywów Shopify. Design, sekcje, szablony i doświadczenie produktowe powstają wokół Twojego biznesu bez dokładania osobnego stosu frontendowego.'),
      textBlock('shopify-content-pl-7', 'Headless Shopify na Next.js lub TanStack', 'h3'),
      textBlock('shopify-content-pl-8', 'Dla marek potrzebujących pełnej swobody frontendu, zaawansowanych treści lub ścieżek klienta przypominających aplikację. Shopify pozostaje niezawodnym silnikiem commerce, a customowy storefront daje pełną kontrolę nad UX, wydajnością i integracjami.'),
    ],
  },
  ctaLabel: {
    en: 'Plan your Shopify store',
    pl: 'Zaplanuj sklep Shopify',
  },
  ctaSecondaryLabel: {
    en: 'View my projects',
    pl: 'Zobacz moje projekty',
  },
  stats: {
    en: [
      { _key: 'shopify-stat-en-1', value: '3 paths', label: 'theme, custom theme, or headless' },
      { _key: 'shopify-stat-en-2', value: '2 stacks', label: 'Next.js or TanStack for headless' },
      { _key: 'shopify-stat-en-3', value: '100%', label: 'matched to your business stage' },
      { _key: 'shopify-stat-en-4', value: 'API-first', label: 'ready for business integrations' },
    ],
    pl: [
      { _key: 'shopify-stat-pl-1', value: '3 ścieżki', label: 'motyw, custom theme lub headless' },
      { _key: 'shopify-stat-pl-2', value: '2 stacki', label: 'Next.js lub TanStack dla headless' },
      { _key: 'shopify-stat-pl-3', value: '100%', label: 'dopasowania do etapu biznesu' },
      { _key: 'shopify-stat-pl-4', value: 'API-first', label: 'gotowości na integracje firmowe' },
    ],
  },
  seo: {
    metaTitle: {
      en: 'Shopify Development | Custom & Headless Stores',
      pl: 'Sklepy Shopify | Custom i headless development',
    },
    metaDescription: {
      en: 'Shopify stores from theme launches to custom headless storefronts on Next.js or TanStack. UX, integrations, migration, performance, and growth.',
      pl: 'Sklepy Shopify od wdrożeń na motywie po custom headless na Next.js lub TanStack. UX, integracje, migracje, wydajność i dalszy rozwój.',
    },
    keywords: [
      'Shopify development',
      'tworzenie sklepów Shopify',
      'Shopify developer',
      'custom Shopify store',
      'Shopify headless',
      'Shopify Next.js',
      'Shopify TanStack',
      'custom Shopify theme',
      'migracja do Shopify',
      'integracje Shopify',
    ],
    noIndex: false,
  },
  publishedAt: '2026-06-29T10:00:00.000Z',
};

const existing = await client.fetch(
  '*[_type == "serviceLanding" && slug.current == $slug][0]._id',
  { slug: document.slug.current },
);

const { _id, _type, ...fields } = document;
const result = existing
  ? await client.patch(existing).set(fields).commit()
  : await client.create(document);

console.log(`Shopify service saved as ${result._id}.`);

const comparisonPost = await client.fetch(
  '*[_type == "post" && slug.current == $slug][0]{_id, relatedServices[]{_ref}}',
  { slug: 'medusa-js-vs-shopify-uczciwe-porownanie-dla-polskich-sklepow-w-2026' },
);
const medusaServiceId = await client.fetch(
  '*[_type == "serviceLanding" && slug.current == $slug][0]._id',
  { slug: 'e-commerce-shops-medusa-js' },
);

if (comparisonPost?._id && medusaServiceId) {
  const relatedServiceIds = new Set(
    (comparisonPost.relatedServices || []).map((reference) => reference._ref),
  );
  relatedServiceIds.add(result._id);
  relatedServiceIds.add(medusaServiceId);

  await client
    .patch(comparisonPost._id)
    .set({
      relatedServices: [...relatedServiceIds].map((serviceId) => ({
        _key: `related-${serviceId}`,
        _type: 'reference',
        _ref: serviceId,
      })),
    })
    .commit();

  console.log('Comparison post linked to Shopify and Medusa.js services.');
}

const legacyServiceTypes = {
  'e-commerce-shops-medusa-js': 'ecommerce-development',
  'ai-automation-rpa-solutions': 'automation-backend',
};

for (const [slug, serviceType] of Object.entries(legacyServiceTypes)) {
  const serviceId = await client.fetch(
    '*[_type == "serviceLanding" && slug.current == $slug][0]._id',
    { slug },
  );

  if (serviceId) {
    await client.patch(serviceId).set({ serviceType }).commit();
  }
}

console.log('Legacy service types normalized.');
