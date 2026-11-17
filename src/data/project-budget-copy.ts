import type { Language } from '@/lib/language';
import type { BudgetProject } from './project-budget';

interface ProjectCopy {
  label: string;
  subtitle: string;
  title: string;
  description: string;
  serviceLink: string;
  note: string;
  options: { title: string; description: string }[];
}

/** Formatted amounts, so copy never hard-codes a price that lives in the pricing config. */
export interface BudgetPrices {
  website: string;
  ecommerce: string;
  marketplace: string;
  saas: string;
  ai: string;
  onePage: string;
  large: string;
}

interface BudgetCopy {
  label: string;
  heading: string;
  intro: (prices: BudgetPrices) => string;
  choose: string;
  from: string;
  starting: string;
  estimate: string;
  individual: string;
  individualValue: string;
  tax: string;
  scope: string;
  scopeHint: string;
  summary: string;
  empty: string;
  selected: (count: number) => string;
  calculator: string;
  contact: string;
  disclaimer: string;
  stagesTitle: string;
  stages: string[];
  questions: (prices: BudgetPrices) => { title: string; answer: string }[];
  projects: Record<BudgetProject, ProjectCopy>;
}

export const projectBudgetCopy: Record<Language, BudgetCopy> = {
  pl: {
    label: '[ 06 - Cennik ]',
    heading: 'Ile kosztuje strona, sklep albo aplikacja?',
    intro: (p) => `Prosta strona na Next.js kosztuje od ${p.website} netto, sklep internetowy od ${p.ecommerce}, marketplace od ${p.marketplace}, aplikacja SaaS od ${p.saas}, a wdrożenie AI od ${p.ai}. Ostateczna kwota zależy od zakresu, procesów i integracji.`,
    choose: 'Co chcesz zbudować?',
    from: 'od',
    starting: 'Cena startowa',
    estimate: 'Szacunek dla wybranego zakresu',
    individual: 'Budżet Twojego projektu',
    individualValue: 'Wycena indywidualna',
    tax: 'netto + VAT',
    scope: 'Co ma znaleźć się w pierwszej wersji?',
    scopeHint: 'Zaznacz, czego potrzebujesz na start. Każdy element doprecyzujemy przed wyceną.',
    summary: 'Twój zakres na start',
    empty: 'Możesz zacząć od podstaw i doprecyzować szczegóły w rozmowie.',
    selected: (count) => `Wybrano elementy zakresu: ${count}.`,
    calculator: 'Policz wycenę dla tego zakresu',
    contact: 'Zapytaj o wycenę',
    disclaimer: 'Wycena jest bezpłatna i do niczego nie zobowiązuje. Kwoty są orientacyjne, netto.',
    stagesTitle: 'Jak powstaje wycena?',
    stages: ['Cel i potrzeby', 'Zakres pierwszego etapu', 'Konkretna wycena'],
    questions: (p) => [
      { title: `Jaka strona może kosztować od ${p.website} netto?`, answer: `Prosta, indywidualnie tworzona strona na Next.js z niewielkim zakresem treści i funkcji. Najprostsza strona jednostronicowa, bez dodatkowych funkcji, może kosztować już od ${p.onePage} netto. Liczbę widoków, projekt graficzny, sposób edycji treści i materiały ustalamy przed ofertą. Dodatkowe funkcje i integracje zwiększają zakres prac.` },
      { title: 'Ile może kosztować duży marketplace albo aplikacja SaaS?', answer: `Rozbudowane platformy z wieloma rolami użytkowników, rozliczeniami i integracjami mogą wymagać budżetu rzędu kilkuset tysięcy złotych, nawet ${p.large} netto. Pierwszą wersję zwykle da się uruchomić znacznie mniejszym kosztem i rozwijać etapami, kiedy widać, czego potrzebuje biznes.` },
      { title: 'Czy trzeba od razu budować cały system?', answer: 'Możemy zacząć od funkcji potrzebnych do uruchomienia biznesu, a pozostałe rozwijać etapami. Najpierw ustalamy, co ma znaleźć się w pierwszej wersji i co można zaplanować na później.' },
      { title: 'Co z hostingiem, domeną i utrzymaniem?', answer: 'Przy wycenie ustalamy też koszty działania systemu: hosting, domenę, zewnętrzne usługi, opłaty operatorów i ewentualną opiekę po wdrożeniu. Rozróżniamy budżet realizacji i późniejsze koszty utrzymania.' },
    ],
    projects: {
      website: {
        label: 'Strona Next.js', subtitle: 'Oferta, marka, zapytania', title: 'Strona zbudowana wokół Twojej oferty.',
        description: 'Od prostej strony firmowej po rozbudowany serwis. Zakres treści, projekt graficzny i funkcje decydują o budżecie.',
        serviceLink: 'Zobacz, jak buduję strony internetowe',
        note: 'Kwota startowa dotyczy prostej strony. Wybrane dodatki i większy zakres wymagają osobnej wyceny.',
        options: [
          { title: 'Edycja treści w CMS', description: 'Model treści i panel do samodzielnych zmian.' },
          { title: 'Blog lub aktualności', description: 'Wpisy, kategorie i szablony artykułów.' },
          { title: 'Kilka wersji językowych', description: 'Treści, adresy i nawigacja w kolejnych językach.' },
          { title: 'Więcej podstron', description: 'Osobne widoki usług, ofert lub realizacji.' },
        ],
      },
      ecommerce: {
        label: 'Sklep internetowy', subtitle: 'Sprzedaż i integracje', title: 'Sklep dopasowany do tego, jak sprzedajesz.',
        description: 'Katalog i koszyk to początek. Na koszt wpływają proces zakupu, logistyka, model produktów i połączenia z Twoimi narzędziami.',
        serviceLink: 'Zobacz, jak buduję sklepy internetowe',
        note: 'Zakres sklepu na Medusa.js dopasowujemy do procesów sprzedaży. Wdrożenie Shopify również wyceniam indywidualnie.',
        options: [
          { title: 'Edycja treści w CMS', description: 'Strony i materiały marketingowe pod Twoją kontrolą.' },
          { title: 'Integracja z ERP lub magazynem', description: 'Synchronizacja danych i obsługa błędów integracji.' },
          { title: 'Indywidualny checkout', description: 'Proces zakupu dopasowany do modelu sprzedaży.' },
          { title: 'Sprzedaż na kilku rynkach', description: 'Waluty, regiony i różne zasady sprzedaży.' },
        ],
      },
      marketplace: {
        label: 'Marketplace', subtitle: 'Wielu sprzedawców, jeden system', title: 'Platforma z własnymi zasadami działania.',
        description: 'Budżet zależy od sposobu obsługi sprzedawców, podziału zamówień i pieniędzy oraz reguł, które platforma ma egzekwować.',
        serviceLink: 'Zobacz, jak buduję platformy marketplace',
        note: 'Rozbudowany marketplace może wymagać budżetu kilkuset tysięcy złotych. Pierwszy etap ustalamy według potrzeb biznesu.',
        options: [
          { title: 'Podział płatności', description: 'Stripe Connect i przepływ środków między stronami.' },
          { title: 'Prowizje i wypłaty', description: 'Reguły rozliczeń, terminy i obsługa wyjątków.' },
          { title: 'Panele sprzedawców', description: 'Narzędzia do produktów, zamówień i obsługi sklepu.' },
          { title: 'Wiele języków', description: 'Lokalizacja platformy i treści sprzedawców.' },
        ],
      },
      saas: {
        label: 'Aplikacja / SaaS', subtitle: 'Narzędzie dla Twojego biznesu', title: 'Aplikacja, która rozwiązuje konkretny problem.',
        description: 'Liczba procesów, ról, integracji i wymagania dotyczące danych tworzą zakres prac. Najpierw ustalamy najważniejszy cel pierwszej wersji.',
        serviceLink: 'Zobacz, jak buduję aplikacje webowe',
        note: 'Duży system SaaS może osiągnąć budżet kilkuset tysięcy złotych. W kalkulatorze zbierzesz zakres do dokładniejszej wyceny.',
        options: [
          { title: 'Konta i role użytkowników', description: 'Dostęp do danych i funkcji dla różnych osób.' },
          { title: 'Płatności i subskrypcje', description: 'Abonamenty, dostęp i cykl życia płatności.' },
          { title: 'Integracje z narzędziami', description: 'Przepływ danych między aplikacją a innymi systemami.' },
          { title: 'Praca z danymi', description: 'Widoki, edycja, filtry i procesy biznesowe.' },
        ],
      },
      ai: {
        label: 'Wdrożenie AI', subtitle: 'Automatyzacja i wiedza firmy', title: 'AI tam, gdzie usprawnia codzienną pracę.',
        description: 'Zakres zależy od procesu, jakości danych, integracji i sposobu sprawdzania odpowiedzi. Dobieramy rozwiązanie do rzeczywistego zastosowania.',
        serviceLink: 'Zobacz, jak wdrażam AI w firmach',
        note: 'Budżet wdrożenia oraz późniejsze opłaty za modele i infrastrukturę omawiamy osobno.',
        options: [
          { title: 'Wiedza z dokumentów firmy', description: 'Przygotowanie źródeł, wyszukiwanie i odpowiedzi.' },
          { title: 'Automatyzacja procesu', description: 'Kolejne kroki pracy, decyzje i obsługa wyjątków.' },
          { title: 'Połączenie z systemami', description: 'Dane i działania w narzędziach, których już używasz.' },
          { title: 'Wsparcie obsługi klienta', description: 'Scenariusze rozmów i przekazanie sprawy człowiekowi.' },
        ],
      },
    },
  },
  en: {
    label: '[ 06 - Pricing ]',
    heading: 'How much does a website, store or app cost?',
    intro: (p) => `A simple Next.js website starts at ${p.website} excluding VAT, an online store at ${p.ecommerce}, a marketplace at ${p.marketplace}, a SaaS application at ${p.saas} and an AI implementation at ${p.ai}. The final amount depends on scope, workflows and integrations.`,
    choose: 'What would you like to build?',
    from: 'from',
    starting: 'Starting price',
    estimate: 'Estimate for your scope',
    individual: 'Your project budget',
    individualValue: 'Individually scoped',
    tax: 'excluding VAT',
    scope: 'What belongs in your first release?',
    scopeHint: 'Choose what you need at launch. We will clarify each item before quoting.',
    summary: 'Your starting scope',
    empty: 'Start with the essentials and work through the details together.',
    selected: (count) => `Scope items selected: ${count}.`,
    calculator: 'Estimate this scope',
    contact: 'Ask for a quote',
    disclaimer: 'Quotes are free and non-binding. Amounts are estimates excluding VAT.',
    stagesTitle: 'How is the quote made?',
    stages: ['Goals and needs', 'First-release scope', 'A concrete quote'],
    questions: (p) => [
      { title: `What kind of website starts at ${p.website} excluding VAT?`, answer: `A simple custom Next.js website with a small set of pages and features. The most basic one-page site without additional features can start at ${p.onePage} excluding VAT. We agree on layouts, design, content editing and materials before quoting. Additional features and integrations increase the scope.` },
      { title: 'How much can a large marketplace or SaaS application cost?', answer: `Large platforms with many user roles, settlements and integrations can require a budget of several hundred thousand PLN, even ${p.large} excluding VAT. The first release can usually launch for much less and grow in stages as the business shows what it needs.` },
      { title: 'Do I need to build the entire system at once?', answer: 'We can start with the features needed to launch your business and develop the rest in stages. First, we decide what belongs in the initial release and what can wait.' },
      { title: 'What about hosting, domains and maintenance?', answer: 'We also discuss running costs: hosting, domains, third-party services, provider fees and any ongoing support. The delivery budget and the costs of operating the system are considered separately.' },
    ],
    projects: {
      website: {
        label: 'Next.js website', subtitle: 'Your offer, brand and leads', title: 'A website built around your offer.',
        description: 'From a focused business website to a larger content platform. Content, design and functionality determine the budget.',
        serviceLink: 'See how I build websites',
        note: 'The starting amount covers a simple website. Additional features and a larger scope need a separate estimate.',
        options: [
          { title: 'Content management', description: 'Content models and an editor for your own updates.' },
          { title: 'Blog or news', description: 'Posts, categories and article templates.' },
          { title: 'Multiple languages', description: 'Content, URLs and navigation in additional languages.' },
          { title: 'Additional pages', description: 'Separate layouts for services, offers or projects.' },
        ],
      },
      ecommerce: {
        label: 'Online store', subtitle: 'Sales and integrations', title: 'A store that fits the way you sell.',
        description: 'A catalogue and a cart are the beginning. Checkout, logistics, product models and integrations shape the scope.',
        serviceLink: 'See how I build online stores',
        note: 'A Medusa.js store is scoped around your sales processes. Shopify implementations are also quoted individually.',
        options: [
          { title: 'Content management', description: 'Control your marketing pages and content.' },
          { title: 'ERP or warehouse integration', description: 'Data synchronisation and integration error handling.' },
          { title: 'Custom checkout', description: 'A purchase flow tailored to your business model.' },
          { title: 'Multiple markets', description: 'Currencies, regions and different sales rules.' },
        ],
      },
      marketplace: {
        label: 'Marketplace', subtitle: 'Many sellers, one platform', title: 'A platform with your own business rules.',
        description: 'Seller workflows, order and payment splitting, and the rules your platform must enforce determine the budget.',
        serviceLink: 'See how I build marketplace platforms',
        note: 'An extensive marketplace can require a budget of hundreds of thousands of PLN. The first stage follows your business needs.',
        options: [
          { title: 'Split payments', description: 'Stripe Connect and money moving between parties.' },
          { title: 'Commissions and payouts', description: 'Settlement rules, schedules and exception handling.' },
          { title: 'Seller dashboards', description: 'Tools for products, orders and store management.' },
          { title: 'Multiple languages', description: 'Localisation of the platform and seller content.' },
        ],
      },
      saas: {
        label: 'Web app / SaaS', subtitle: 'A tool for your business', title: 'An application solving a specific problem.',
        description: 'Workflows, roles, integrations and data requirements shape the scope. We start with the main goal of your first release.',
        serviceLink: 'See how I build web applications',
        note: 'A large SaaS system can reach hundreds of thousands of PLN. The calculator collects your scope for a more precise quote.',
        options: [
          { title: 'Accounts and roles', description: 'Access to data and features for different users.' },
          { title: 'Payments and subscriptions', description: 'Plans, access and the payment lifecycle.' },
          { title: 'Tool integrations', description: 'Data flowing between your app and other systems.' },
          { title: 'Working with data', description: 'Views, editing, filters and business workflows.' },
        ],
      },
      ai: {
        label: 'AI implementation', subtitle: 'Automation and company knowledge', title: 'AI that improves everyday work.',
        description: 'Scope depends on the workflow, data quality, integrations and how responses are evaluated. The solution follows the actual use case.',
        serviceLink: 'See how I implement AI',
        note: 'Implementation costs and ongoing model and infrastructure fees are discussed separately.',
        options: [
          { title: 'Company document knowledge', description: 'Source preparation, retrieval and answers.' },
          { title: 'Workflow automation', description: 'Work steps, decisions and exception handling.' },
          { title: 'System integrations', description: 'Data and actions in tools you already use.' },
          { title: 'Customer support', description: 'Conversation flows and handover to a person.' },
        ],
      },
    },
  },
};
