import type { Language } from '@/lib/language';

export type PricingCopyOption = {
  label: string;
  description?: string;
};

export type PricingCopy = {
  services: Record<string, PricingCopyOption>;
  base: Record<string, PricingCopyOption>;
  cms: Record<string, PricingCopyOption>;
  features: Record<string, PricingCopyOption>;
  deadline: Record<string, PricingCopyOption>;
  disclaimer: string;
};

export const pricingCopy: Record<Language, PricingCopy> = {
  pl: {
    services: {
      website: {
        label: 'Strona internetowa / landing page',
        description:
          'Dla firm, usług, marek osobistych i ofert, które mają wyglądać profesjonalnie i zdobywać zapytania.',
      },
      ecommerce: {
        label: 'Sklep internetowy',
        description:
          'Dla sprzedaży produktów online z koszykiem, płatnościami, zamówieniami i wygodną obsługą sprzedaży.',
      },
      marketplace: {
        label: 'Platforma marketplace',
        description:
          'Dla biznesu, w którym wielu sprzedawców, partnerów lub dostawców działa na jednej wspólnej platformie.',
      },
      ai: {
        label: 'Wdrożenie AI w firmie',
        description:
          'Dla automatyzacji, chatbotów, pracy z dokumentami i procesów, które można usprawnić przy pomocy AI.',
      },
      saas: {
        label: 'Aplikacja webowa / SaaS',
        description:
          'Dla dedykowanego narzędzia online, panelu klienta, systemu rezerwacji, platformy lub aplikacji biznesowej.',
      },
    },

    base: {
      simple_landing: {
        label: 'Prosta strona ofertowa',
        description:
          'Dobry wybór na start: jedna konkretna strona prezentująca ofertę, usługę lub kampanię.',
      },
      template: {
        label: 'Szybszy start na gotowym układzie',
        description:
          'Strona oparta o sprawdzony układ, dopasowana wizualnie do Twojej marki. Szybciej i taniej niż projekt od zera.',
      },
      custom: {
        label: 'Indywidualny projekt od zera',
        description:
          'Najlepsze, gdy strona ma mocniej wyróżniać markę i być zaprojektowana specjalnie pod Twoją ofertę.',
      },
      have_design: {
        label: 'Mam gotowy projekt graficzny',
        description:
          'Wybierz to, jeśli masz już projekt, makietę lub plik z designem i potrzebujesz wdrożenia.',
      },
      medusa_basic: {
        label: 'Kompletny sklep internetowy',
        description:
          'Podstawa sklepu: katalog produktów, koszyk, zamówienia, płatności i panel do obsługi sprzedaży.',
      },
      medusa_marketplace: {
        label: 'Podstawa marketplace',
        description:
          'Fundament platformy z wieloma sprzedawcami, produktami, zamówieniami i podstawowym zarządzaniem.',
      },
    },

    cms: {
      none: {
        label: 'Bez panelu edycji treści',
        description:
          'Dobra opcja, jeśli treści zmieniają się rzadko i mogą być aktualizowane okazjonalnie po stronie wykonawcy.',
      },
      sanity_form: {
        label: 'Panel do edycji treści',
        description:
          'Prosty panel, w którym bez wiedzy technicznej zmienisz teksty, zdjęcia, wpisy lub wybrane sekcje strony.',
      },
      sanity_visual: {
        label: 'Wygodniejsza edycja z podglądem',
        description:
          'Bardziej komfortowa edycja treści z podglądem strony. Dobre, jeśli oferta lub treści często się zmieniają.',
      },
    },

    features: {
      extra_pages: {
        label: 'Dodatkowe podstrony',
        description:
          'Dodatkowe widoki, np. O mnie, Oferta, Realizacje, Cennik, FAQ, Kontakt lub osobne strony usług.',
      },
      blog: {
        label: 'Blog / aktualności',
        description:
          'Miejsce na artykuły, poradniki, case studies lub aktualności, które mogą wspierać widoczność w Google.',
      },
      contact_form: {
        label: 'Formularz kontaktowy',
        description:
          'Klienci mogą wysłać zapytanie bezpośrednio ze strony, a wiadomość trafia na Twój email.',
      },
      newsletter: {
        label: 'Zbieranie adresów email',
        description:
          'Formularz zapisu do newslettera, listy oczekujących lub bazy zainteresowanych klientów.',
      },
      i18n: {
        label: 'Więcej niż jeden język',
        description:
          'Strona, sklep lub platforma dostępna np. po polsku i angielsku.',
      },
      animations: {
        label: 'Animacje i efekt premium',
        description:
          'Subtelny ruch, przejścia i interakcje, które sprawiają, że strona wygląda nowocześniej.',
      },
      seo_setup: {
        label: 'Podstawowa optymalizacja pod Google',
        description:
          'Ustawienie podstaw technicznych, tytułów, opisów i struktury, żeby strona miała lepszy start w wyszukiwarce.',
      },
      analytics: {
        label: 'Statystyki odwiedzin',
        description:
          'Podłączenie narzędzi, które pokazują, ile osób odwiedza stronę i skąd przychodzą.',
      },
      cookie_banner: {
        label: 'Baner cookies / zgody',
        description:
          'Prosty mechanizm zgód na cookies i narzędzia analityczne.',
      },
      performance: {
        label: 'Przyspieszenie strony',
        description:
          'Optymalizacja ładowania, obrazów i podstaw technicznych, żeby strona działała szybciej.',
      },

      stripe: {
        label: 'Płatności kartą i online',
        description:
          'Obsługa płatności online, statusów płatności i bezpiecznego procesu zakupu.',
      },
      p24: {
        label: 'Przelewy24 / BLIK',
        description:
          'Popularne w Polsce metody płatności, takie jak szybkie przelewy i BLIK.',
      },
      shipping: {
        label: 'Integracja dostaw',
        description:
          'Połączenie z dostawcą wysyłek lub brokerem kurierskim, żeby usprawnić nadawanie paczek.',
      },
      product_filters: {
        label: 'Filtrowanie produktów',
        description:
          'Klienci mogą łatwiej znaleźć produkty po kategorii, cenie, cechach lub innych parametrach.',
      },
      product_variants: {
        label: 'Warianty produktów',
        description:
          'Obsługa produktów w różnych wersjach, np. rozmiarach, kolorach, pojemnościach lub konfiguracjach.',
      },
      discounts: {
        label: 'Kody rabatowe i promocje',
        description:
          'Możliwość tworzenia promocji, kodów zniżkowych i prostych akcji sprzedażowych.',
      },
      reviews: {
        label: 'Opinie klientów o produktach',
        description:
          'Sekcja opinii, która zwiększa zaufanie i pomaga klientom podjąć decyzję o zakupie.',
      },
      email_notifications: {
        label: 'Powiadomienia email',
        description:
          'Automatyczne wiadomości o zamówieniu, płatności, zmianie statusu lub innych ważnych zdarzeniach.',
      },
      product_import: {
        label: 'Import produktów z pliku',
        description:
          'Możliwość przeniesienia większej liczby produktów z arkusza lub pliku, zamiast dodawania ich ręcznie.',
      },
      admin_custom: {
        label: 'Dostosowanie panelu do Twojego biznesu',
        description:
          'Drobne zmiany w panelu i procesach, żeby sklep lepiej pasował do Twojego sposobu pracy.',
      },
      inpost_integration: {
        label: 'Integracja z InPost / paczkomatami',
        description:
          'Możliwość nadawania paczek przez InPost, w tym automatyczne generowanie etykiet i wysyłka do paczkomatów.',
      },
      courier_integration: {
        label: 'Integracja z kurierem lub brokerem dostaw',
        description:
          'Połączenie z firmą kurierską lub brokerem (np. Furgonetka, Sendello), żeby usprawnić logistykę.',
      },
      advanced_shipping_rules: {
        label: 'Bardziej rozbudowane zasady dostawy',
        description:
          'Złożone reguły dostawy: darmowa dostawa od kwoty, różne strefy, wagi lub wymiary.',
      },
      advanced_product_filters: {
        label: 'Rozbudowane filtrowanie produktów',
        description:
          'Zaawansowane filtry po wielu parametrach, cechach, dostępności lub producencie.',
      },
      custom_checkout: {
        label: 'Dostosowany proces zakupu',
        description:
          'Zmiany w koszyku i finalizacji zamówienia pod Twoje potrzeby, np. dodatkowe pola, branding lub kroki.',
      },
      custom_product_page: {
        label: 'Indywidualna karta produktu',
        description:
          'Niestandardowy wygląd i funkcjonalność strony produktu, która wyróżni ofertę.',
      },
      product_recommendations: {
        label: 'Polecane i podobne produkty',
        description:
          'Sekcja z rekomendacjami, która podpowiada klientom powiązane lub komplementarne produkty.',
      },
      wishlist: {
        label: 'Lista ulubionych produktów',
        description:
          'Funkcja zapisywania produktów na później i łatwego do nich powrotu.',
      },
      customer_account_extended: {
        label: 'Rozszerzone konto klienta',
        description:
          'Bogatszy profil klienta z historią zamówień, adresami, preferencjami i statusami.',
      },
      email_templates_custom: {
        label: 'Dostosowane wiadomości email',
        description:
          'Spersonalizowane maile transakcyjne zgodne z identyfikacją wizualną marki.',
      },
      invoice_integration: {
        label: 'Integracja z fakturami lub księgowością',
        description:
          'Automatyczne generowanie faktur lub synchronizacja z programem księgowym.',
      },
      erp_integration: {
        label: 'Integracja z magazynem lub systemem sprzedaży',
        description:
          'Synchronizacja stanów magazynowych, cen i zamówień z systemem ERP lub magazynem.',
      },
      loyalty_program: {
        label: 'Program lojalnościowy',
        description:
          'System punktów, rabatów lub statusów dla stałych klientów.',
      },
      subscriptions: {
        label: 'Produkty cykliczne lub subskrypcje',
        description:
          'Możliwość sprzedaży produktów w modelu abonamentowym lub cyklicznych zamówień.',
      },
      b2b_pricing: {
        label: 'Ceny dla klientów firmowych',
        description:
          'Osobne ceny, rabaty i warunki dla klientów biznesowych i hurtowych.',
      },
      multi_region: {
        label: 'Sprzedaż na kilka rynków',
        description:
          'Obsługa wielu regionów, walut i zasad podatkowych dla sprzedaży zagranicznej.',
      },

      vendor_accounts: {
        label: 'Konta sprzedawców',
        description:
          'Sprzedawcy mogą mieć własne konta i dostęp do swojej części platformy.',
      },
      vendor_onboarding: {
        label: 'Zgłoszenia i weryfikacja sprzedawców',
        description:
          'Proces przyjmowania nowych sprzedawców, zbierania danych i ręcznego lub półautomatycznego zatwierdzania.',
      },
      vendor_dash: {
        label: 'Panel dla sprzedawców',
        description:
          'Sprzedawcy mogą zarządzać swoimi produktami, zamówieniami i podstawowymi danymi.',
      },
      product_approval: {
        label: 'Zatwierdzanie produktów przez admina',
        description:
          'Produkty dodane przez sprzedawców mogą wymagać akceptacji przed publikacją.',
      },
      orders_split: {
        label: 'Zamówienia od wielu sprzedawców',
        description:
          'Obsługa sytuacji, gdy jeden klient kupuje produkty od kilku sprzedawców w jednym zamówieniu.',
      },
      stripe_connect: {
        label: 'Rozliczenia ze sprzedawcami',
        description:
          'Automatyczne dzielenie płatności między platformę i sprzedawców.',
      },
      commissions: {
        label: 'Prowizje platformy',
        description:
          'Ustalanie, ile platforma zarabia na sprzedaży sprzedawców lub partnerów.',
      },
      payouts: {
        label: 'Wypłaty dla sprzedawców',
        description:
          'Proces rozliczania i wypłacania pieniędzy sprzedawcom po sprzedaży.',
      },
      ratings: {
        label: 'Oceny sprzedawców',
        description:
          'Klienci mogą oceniać sprzedawców, co pomaga budować zaufanie na platformie.',
      },
      disputes: {
        label: 'Obsługa reklamacji i sporów',
        description:
          'Prosty proces zgłaszania problemów między klientem, sprzedawcą i administratorem platformy.',
      },
      notifications: {
        label: 'Powiadomienia dla klientów i sprzedawców',
        description:
          'Automatyczne informacje o zamówieniach, statusach, zgłoszeniach i ważnych akcjach na platformie.',
      },
      advanced_search: {
        label: 'Lepsza wyszukiwarka produktów',
        description:
          'Wygodniejsze wyszukiwanie produktów po nazwie, kategorii, cechach lub sprzedawcy.',
      },

      chatbot_basic: {
        label: 'Chatbot odpowiadający na pytania',
        description:
          'Asystent na stronie, który odpowiada klientom na podstawowe pytania o ofertę lub firmę.',
      },
      chatbot_rag: {
        label: 'Chatbot z wiedzą z dokumentów firmy',
        description:
          'Asystent korzystający z Twoich dokumentów, regulaminów, FAQ lub materiałów firmowych.',
      },
      ai_search: {
        label: 'Wyszukiwanie informacji w dokumentach',
        description:
          'Narzędzie, które pomaga szybko znaleźć odpowiedzi w plikach, dokumentach, ofertach lub bazie wiedzy.',
      },
      ai_cms: {
        label: 'AI pomagające tworzyć treści',
        description:
          'Wsparcie w generowaniu opisów, wpisów, odpowiedzi lub treści w panelu zarządzania.',
      },
      ai_support: {
        label: 'Automatyczna obsługa klienta',
        description:
          'AI może pomagać w odpowiadaniu na powtarzalne pytania klientów i obsłudze prostych zgłoszeń.',
      },
      ai_workflow: {
        label: 'Automatyzacja procesu w firmie',
        description:
          'Dedykowany przepływ pracy, który oszczędza czas przy powtarzalnych zadaniach.',
      },
      ai_integration: {
        label: 'Połączenie AI z Twoimi systemami',
        description:
          'Integracja AI z narzędziami, których już używasz, np. formularzami, CRM, bazą wiedzy lub panelem.',
      },

      user_accounts: {
        label: 'Konta użytkowników',
        description:
          'Użytkownicy mogą logować się, mieć swój profil i dostęp do wybranych funkcji aplikacji.',
      },
      dashboard: {
        label: 'Panel użytkownika',
        description:
          'Widok dla klienta, pracownika lub partnera z najważniejszymi informacjami i akcjami.',
      },
      admin_panel: {
        label: 'Panel administracyjny',
        description:
          'Miejsce do zarządzania użytkownikami, treściami, danymi i działaniem aplikacji.',
      },
      payments: {
        label: 'Płatności lub abonament',
        description:
          'Sprzedaż dostępu, subskrypcje, opłaty cykliczne lub płatne funkcje aplikacji.',
      },
      integrations: {
        label: 'Połączenia z innymi narzędziami',
        description:
          'Integracje z CRM, księgowością, kalendarzem, magazynem, formularzami lub innymi systemami.',
      },
      data_management: {
        label: 'Zarządzanie danymi w aplikacji',
        description:
          'Dodawanie, edycja, filtrowanie i porządkowanie danych potrzebnych w Twoim procesie.',
      },
    },

    deadline: {
      relaxed: {
        label: 'Elastyczny termin',
        description:
          'Najbezpieczniejsza opcja budżetowo. Dobra, jeśli nie trzeba startować natychmiast.',
      },
      standard: {
        label: 'Standardowy termin',
        description:
          'Rozsądny kompromis między tempem prac a spokojnym dopracowaniem projektu.',
      },
      fast: {
        label: 'Szybsza realizacja',
        description:
          'Dla projektów, które muszą ruszyć szybciej. Zwykle wymaga sprawnych decyzji, ograniczenia zmian po drodze oraz zmiany priorytetu innych projektów.',
      },
    },

    disclaimer:
      'To orientacyjny zakres budżetu, a nie finalna oferta. Dokładną cenę, termin i plan działania ustalimy po krótkiej rozmowie o Twoim biznesie.',
  },

  en: {
    services: {
      website: {
        label: 'Website / landing page',
        description:
          'For companies, services, personal brands and offers that need to look professional and generate enquiries.',
      },
      ecommerce: {
        label: 'Online store',
        description:
          'For selling products online with a cart, payments, orders and convenient sales management.',
      },
      marketplace: {
        label: 'Marketplace platform',
        description:
          'For a business where multiple sellers, partners or vendors operate on a single shared platform.',
      },
      ai: {
        label: 'AI implementation for business',
        description:
          'For automation, chatbots, working with documents and processes that can be improved with AI.',
      },
      saas: {
        label: 'Web application / SaaS',
        description:
          'For a custom online tool, client panel, booking system, platform or business application.',
      },
    },

    base: {
      simple_landing: {
        label: 'Simple offer page',
        description:
          'A good choice to start: one focused page presenting an offer, service or campaign.',
      },
      template: {
        label: 'Faster start with a ready-made layout',
        description:
          'A page built on a proven layout, visually matched to your brand. Faster and cheaper than a design from scratch.',
      },
      custom: {
        label: 'Individual design from scratch',
        description:
          'Best when the page needs to strongly differentiate the brand and be designed specifically for your offer.',
      },
      have_design: {
        label: 'I have a ready-made graphic design',
        description:
          'Choose this if you already have a design, mockup or design file and need it implemented.',
      },
      medusa_basic: {
        label: 'Complete online store',
        description:
          'Store foundation: product catalogue, cart, orders, payments and a sales management panel.',
      },
      medusa_marketplace: {
        label: 'Marketplace foundation',
        description:
          'Foundation of a platform with multiple sellers, products, orders and basic management.',
      },
    },

    cms: {
      none: {
        label: 'No content editing panel',
        description:
          'A good option if content changes rarely and can be updated occasionally by the developer.',
      },
      sanity_form: {
        label: 'Content editing panel',
        description:
          'A simple panel where you can change texts, images, posts or selected sections without technical knowledge.',
      },
      sanity_visual: {
        label: 'Easier editing with preview',
        description:
          'More comfortable content editing with a page preview. Good if the offer or content changes frequently.',
      },
    },

    features: {
      extra_pages: {
        label: 'Additional subpages',
        description:
          'Additional views, e.g. About me, Offer, Portfolio, Pricing, FAQ, Contact or separate service pages.',
      },
      blog: {
        label: 'Blog / news',
        description:
          'A place for articles, guides, case studies or news that can support visibility in Google.',
      },
      contact_form: {
        label: 'Contact form',
        description:
          'Clients can send an enquiry directly from the page, and the message lands in your email.',
      },
      newsletter: {
        label: 'Email collection',
        description:
          'A newsletter signup form, waiting list or base of interested clients.',
      },
      i18n: {
        label: 'More than one language',
        description:
          'The page, store or platform available e.g. in Polish and English.',
      },
      animations: {
        label: 'Animations and premium effect',
        description:
          'Subtle motion, transitions and interactions that make the page look more modern.',
      },
      seo_setup: {
        label: 'Basic Google optimisation',
        description:
          'Setting up technical basics, titles, descriptions and structure so the page has a better start in search results.',
      },
      analytics: {
        label: 'Visit statistics',
        description:
          'Connecting tools that show how many people visit the page and where they come from.',
      },
      cookie_banner: {
        label: 'Cookie banner / consents',
        description:
          'A simple consent mechanism for cookies and analytics tools.',
      },
      performance: {
        label: 'Page speed boost',
        description:
          'Optimising loading, images and technical basics so the page runs faster.',
      },

      stripe: {
        label: 'Card and online payments',
        description:
          'Handling online payments, payment statuses and a secure checkout process.',
      },
      p24: {
        label: 'Przelewy24 / BLIK',
        description:
          'Popular Polish payment methods such as fast transfers and BLIK.',
      },
      shipping: {
        label: 'Delivery integration',
        description:
          'Connection with a shipping provider or courier broker to streamline parcel dispatch.',
      },
      product_filters: {
        label: 'Product filtering',
        description:
          'Clients can more easily find products by category, price, features or other parameters.',
      },
      product_variants: {
        label: 'Product variants',
        description:
          'Handling products in different versions, e.g. sizes, colours, capacities or configurations.',
      },
      discounts: {
        label: 'Discount codes and promotions',
        description:
          'Ability to create promotions, discount codes and simple sales campaigns.',
      },
      reviews: {
        label: 'Customer product reviews',
        description:
          'A review section that builds trust and helps clients make purchase decisions.',
      },
      email_notifications: {
        label: 'Email notifications',
        description:
          'Automatic messages about orders, payments, status changes or other important events.',
      },
      product_import: {
        label: 'Product import from file',
        description:
          'Ability to move a larger number of products from a spreadsheet or file instead of adding them manually.',
      },
      admin_custom: {
        label: 'Panel tailored to your business',
        description:
          'Small changes to the panel and processes so the store better fits your way of working.',
      },
      inpost_integration: {
        label: 'InPost / parcel locker integration',
        description:
          'Integration with InPost for parcel locker shipping, including label generation.',
      },
      courier_integration: {
        label: 'Courier or shipping broker integration',
        description:
          'Connection with a courier company or broker (e.g. Furgonetka, Sendello) to streamline logistics.',
      },
      advanced_shipping_rules: {
        label: 'Advanced shipping rules',
        description:
          'Complex shipping rules: free shipping thresholds, zones, weight or dimension-based rates.',
      },
      advanced_product_filters: {
        label: 'Advanced product filtering',
        description:
          'Advanced filters across multiple parameters, attributes, availability or brand.',
      },
      custom_checkout: {
        label: 'Custom checkout process',
        description:
          'Customisations to the cart and checkout flow to match your needs, e.g. extra fields, branding or steps.',
      },
      custom_product_page: {
        label: 'Custom product page',
        description:
          'Custom layout and functionality for product pages that make your offer stand out.',
      },
      product_recommendations: {
        label: 'Related and recommended products',
        description:
          'A recommendations section that suggests related or complementary products to customers.',
      },
      wishlist: {
        label: 'Favourites / wishlist',
        description:
          'A save-for-later feature so customers can easily return to products.',
      },
      customer_account_extended: {
        label: 'Extended customer account',
        description:
          'Richer customer profile with order history, addresses, preferences and statuses.',
      },
      email_templates_custom: {
        label: 'Custom email templates',
        description:
          'Personalised transactional emails aligned with your brand identity.',
      },
      invoice_integration: {
        label: 'Invoice or accounting integration',
        description:
          'Automatic invoice generation or sync with accounting software.',
      },
      erp_integration: {
        label: 'Warehouse or ERP integration',
        description:
          'Syncing stock levels, prices and orders with an ERP or warehouse system.',
      },
      loyalty_program: {
        label: 'Loyalty programme',
        description:
          'Points, discounts or tiered status system for repeat customers.',
      },
      subscriptions: {
        label: 'Subscriptions or recurring products',
        description:
          'Ability to sell products on a subscription or recurring order model.',
      },
      b2b_pricing: {
        label: 'B2B / wholesale pricing',
        description:
          'Separate prices, discounts and terms for business and wholesale clients.',
      },
      multi_region: {
        label: 'Multi-region sales',
        description:
          'Support for multiple regions, currencies and tax rules for international sales.',
      },

      vendor_accounts: {
        label: 'Seller accounts',
        description:
          'Sellers can have their own accounts and access to their part of the platform.',
      },
      vendor_onboarding: {
        label: 'Seller applications and verification',
        description:
          'A process for accepting new sellers, collecting data and manual or semi-automatic approval.',
      },
      vendor_dash: {
        label: 'Seller panel',
        description:
          'Sellers can manage their products, orders and basic data.',
      },
      product_approval: {
        label: 'Admin product approval',
        description:
          'Products added by sellers may require acceptance before publication.',
      },
      orders_split: {
        label: 'Orders from multiple sellers',
        description:
          'Handling situations where one customer buys products from several sellers in a single order.',
      },
      stripe_connect: {
        label: 'Seller settlements',
        description:
          'Automatic splitting of payments between the platform and sellers.',
      },
      commissions: {
        label: 'Platform commission',
        description:
          'Setting how much the platform earns on sales from sellers or partners.',
      },
      payouts: {
        label: 'Seller payouts',
        description:
          'A process for settling and paying out money to sellers after a sale.',
      },
      ratings: {
        label: 'Seller ratings',
        description:
          'Clients can rate sellers, which helps build trust on the platform.',
      },
      disputes: {
        label: 'Complaint and dispute handling',
        description:
          'A simple process for reporting issues between the client, seller and platform administrator.',
      },
      notifications: {
        label: 'Notifications for clients and sellers',
        description:
          'Automatic information about orders, statuses, applications and important actions on the platform.',
      },
      advanced_search: {
        label: 'Better product search',
        description:
          'More convenient product searching by name, category, features or seller.',
      },

      chatbot_basic: {
        label: 'Chatbot answering questions',
        description:
          'An on-site assistant that answers client questions about the offer or company.',
      },
      chatbot_rag: {
        label: 'Chatbot with company document knowledge',
        description:
          'An assistant that uses your documents, regulations, FAQ or company materials.',
      },
      ai_search: {
        label: 'Searching information in documents',
        description:
          'A tool that helps quickly find answers in files, documents, offers or a knowledge base.',
      },
      ai_cms: {
        label: 'AI helping create content',
        description:
          'Support in generating descriptions, posts, replies or content in the management panel.',
      },
      ai_support: {
        label: 'Automatic customer service',
        description:
          'AI can help answer repetitive client questions and handle simple tickets.',
      },
      ai_workflow: {
        label: 'Business process automation',
        description:
          'A dedicated workflow that saves time on repetitive tasks.',
      },
      ai_integration: {
        label: 'Connecting AI with your systems',
        description:
          'AI integration with tools you already use, e.g. forms, CRM, knowledge base or panel.',
      },

      user_accounts: {
        label: 'User accounts',
        description:
          'Users can log in, have their profile and access selected application features.',
      },
      dashboard: {
        label: 'User panel',
        description:
          'A view for the client, employee or partner with the most important information and actions.',
      },
      admin_panel: {
        label: 'Administrative panel',
        description:
          'A place for managing users, content, data and application operations.',
      },
      payments: {
        label: 'Payments or subscription',
        description:
          'Selling access, subscriptions, recurring fees or paid application features.',
      },
      integrations: {
        label: 'Connections with other tools',
        description:
          'Integrations with CRM, accounting, calendar, warehouse, forms or other systems.',
      },
      data_management: {
        label: 'Data management in the application',
        description:
          'Adding, editing, filtering and organising data needed in your process.',
      },
    },

    deadline: {
      relaxed: {
        label: 'Flexible deadline',
        description:
          'The safest budget option. Good when there is no need to launch immediately.',
      },
      standard: {
        label: 'Standard deadline',
        description:
          'A reasonable compromise between pace of work and calm project refinement.',
      },
      fast: {
        label: 'Faster delivery',
        description:
          'For projects that need to launch sooner. Usually requires quick decisions, limiting changes along the way and shifting priority of other projects.',
      },
    },

    disclaimer:
      'This is an estimated budget range, not a final offer. The exact price, timeline and plan will be confirmed after a short conversation about your business.',
  },
};