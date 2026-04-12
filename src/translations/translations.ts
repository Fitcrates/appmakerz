export const translations = {
  en: {
    // ============================================
    // NEW COMPONENTS TRANSLATIONS
    // ============================================

    // Navigation (HeaderNew)
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      services: "Services",
      solutions: "Solutions",
      blog: "Blog",
      contact: "Contact",
      letsTalk: "Let's Talk",
    },

    // Hero Section (HeroNew)
    hero: {
      label: "Fullstack Developer",
      heading: "ELECTRIFY\nYOUR BUSINESS\nONLINE",
      seoHeading: "Fullstack Web Developer — React & Next.js Applications, Websites and e-commerce shops and marketplaces | AppCrates",
      subtitle: "I build online shops, landing pages, and AI-powered apps that grow your business. Complete solutions from start to finish.",
      cta: {
        viewWork: "VIEW MORE",
        getInTouch: "GET IN TOUCH",
      },
      scroll: "Scroll",
    },

    // About Section (AboutNew)
    about: {
      label: "[ 01 — About ]",
      heading: "Solutions that\ngrow your\nbusiness",
      description: {
        p1: "I help businesses succeed online. Whether you need an e-commerce shop to sell products, a landing page that converts visitors into customers, or AI-powered apps to automate your workflows — I deliver complete solutions from start to finish.",
        p2: "You get a partner who understands your business goals. I handle everything: design, development, content management systems you can update yourself, and ongoing support. No technical knowledge needed on your end.",
      },
      stats: {
        years: { value: "2+", label: "Years" },
        projects: { value: "10+", label: "Projects" },
        dedication: { value: "100%", label: "Dedication" },
      },
    },

    // Projects Section (ProjectsNew)
    projects: {
      label: "[ 02 — Work ]",
      heading: "Selected Projects",
      viewAction: "View",
      cta: "Want to work together?",
      items: {
        artovnia: {
          title: "Artovnia E-Commerce",
          category: "Web Development",
          description: "Full-stack multi-vendor e-commerce marketplace built with Next.js and Node.js. Features advanced product management, rich features, secure Stripe payment processing, and a seamless checkout experience optimized for conversions.",
        },
        animeSearch: {
          title: "Anime Search Platform",
          category: "Web Application",
          description: "Responsive web application with REST API integration, advanced search with filters, and a personalized recommendation engine. Built with React and TypeScript.",
        },
        flixstock: {
          title: "FlixStock Mobile",
          category: "Mobile App",
          description: "Cross-platform mobile app for real-time inventory management. Features barcode scanning, cloud synchronization, and offline-first architecture.",
        },
        portfolio: {
          title: "Alfa Romeo Demo",
          category: "3d Web Design",
          description: "Interactive Three.js car experience with custom-built physics, sound system, dynamic lighting, and cinematic presentation.",
        },
          homebudget: {
          title: "AI Home Budget",
          category: "AI app",
          description: "Aplikacja do śledzenia budżetu wykorzystująca AI. Automatyczne czytanie rachunków i dodawanie do kategorii i wydatków. Analizy, prognozy i porady AI"

        },
        spaWebsite: {
          title: "Glow & Serenity Spa Website",
          category: "Landing Page with CMS",
          description: "High-converting spa website with client-friendly content management system. Owners can update services, prices, and promotions themselves without technical help. Increased bookings by 40% in first month."
        },
        koreanBbq: {
          title: "HWA / 火 — Korean BBQ",
          category: "Premium Frontend Experience",
          description: "A conceptual frontend project simulating a luxury Korean BBQ restaurant. Built with Next.js featuring cinematic GSAP ScrollTrigger animations, a custom CSS architecture, and full i18n support."
        }
      },
    },

    // Services Section (ServicesNew)
    services: {
      label: "[ 03 — Services ]",
      heading: "What I Do",
      cta: "Let's discuss your project",
      items: {
        webDev: {
          number: "01",
          title: "E-Commerce Shops & Marketplaces",
          description: "Complete online stores where you can sell your products. Secure payment processing, inventory tracking, and everything you need to run your business online. Multi-vendor marketplaces supported.",
        },
        backend: {
          number: "02",
          title: "Landing Pages You Control",
          description: "High-converting landing pages with easy content management. Update text, images, and offers yourself without calling a developer. Perfect for marketing campaigns and product launches.",
        },
        ecommerce: {
          number: "03",
          title: "AI-Powered Applications",
          description: "Smart apps that automate your business workflows. From AI chatbots to automated data processing — solutions that save you time and money.",
        },
        responsive: {
          number: "04",
          title: "Complete A-Z Solutions",
          description: "Full-service support from initial concept to launch and beyond. Works perfectly on phones, tablets, and computers. I handle everything so you can focus on your business.",
        },
      },
    },

    // Solutions Section (SolutionsNew)
    solutions: {
      label: "[ 04 — Solutions ]",
      heading: "How Can I Help?",
      cta: "Let's discuss your project",
      items: {
        landing: {
          number: "01",
          title: "Landing Pages",
          problem: "Need a high-converting page?",
          description: "Custom landing pages designed for maximum conversions — with sub-2s load times, SEO-friendly markup, responsive design, and seamless lead capture forms. Perfect for product launches, SaaS signups, and marketing campaigns. Built with Next.js for optimal performance.",
        },
        ecommerce: {
          number: "02",
          title: "E-Commerce & Online Shops",
          problem: "Want to sell online?",
          description: "Secure, scalable e-commerce solutions with Stripe integration, real-time inventory management, product filtering, and conversion-optimized checkout flows. Whether you're launching a small shop or scaling to thousands of products — stores that sell.",
        },
        marketplace: {
          number: "03",
          title: "Marketplaces & Platforms",
          problem: "Building a multi-vendor platform?",
          description: "Scalable marketplace platforms with user authentication, Stripe Connect payment integration, and admin dashboards for complete control. Built with Next.js and Node.js.",
        },
        webApps: {
          number: "04",
          title: "Web Applications",
          problem: "Need custom software?",
          description: "Custom web applications built with React, Next.js, and Node.js. Real-time features via WebSockets, intuitive UI/UX, role-based authentication, and admin dashboards — solving complex business problems with clean, maintainable code.",
        },
        seo: {
          number: "05",
          title: "SEO-Optimized Sites",
          problem: "Not ranking on Google?",
          description: "Websites built with SEO best practices: semantic HTML, fast performance, proper meta tags, and structured data for better search rankings.",
        },
      },
    },

    // Contact Section (ContactNew)
    contact: {
      label: "[ 05 — Contact ]",
      heading: "Let's work together",
      info: {
        email: { label: "Email", value: "appcratesdev@gmail.com" },
        phone: { label: "Phone", value: "+48 733 433 230" },
        location: { label: "Location", value: "Wrocław, Poland" },
      },
      form: {
        name: { label: "Name", placeholder: "Your name" },
        email: { label: "Email", placeholder: "your@email.com" },
        message: { label: "Message", placeholder: "Tell me about your project..." },
        submit: "Send Message",
        sending: "Sending...",
        privacy: {
          text: "By submitting, you agree to our",
          link: "Privacy Policy",
        },
        success: {
          title: "Message Sent!",
          message: "Thank you for reaching out. I'll get back to you soon.",
        },
      },
    },

    // Footer (FooterNew)
    footer: {
      newsletter: {
        title: "Subscribe to newsletter",
        description: "Get updates on new projects, articles, and insights.",
        placeholder: "Enter your email",
        button: "Subscribe",
        subscribing: "Subscribing...",
        success: "Successfully subscribed!",
      },
      brand: {
        description: "AppCrates — crafting exceptional digital experiences through modern web development.",
      },
      navigation: "Navigation",
      connect: "Connect",
      links: {
        email: "Email",
        github: "GitHub",
        linkedin: "LinkedIn",
        blog: "Blog",
      },
      legal: {
        privacy: "Privacy",
        unsubscribe: "Unsubscribe",
      },
      backToTop: "Top",
      copyright: "© {year} AppCrates",
    },

    // Blog (BlogNew)
    blog: {
      title: "Blog",
      subtitle: "Thoughts, tutorials, and insights",
      search: "Search posts...",
      categories: "Categories",
      all: "All",
      readMore: "Read More",
      publishedAt: "Published",
      readingTime: "min read",
      views: "views",
      loading: "Loading posts...",
      noPosts: "No posts found",
      page: "Page",
      of: "of",
      post: {
        readArticle: "Read Article",
        minRead: "min read",
        share: "Share",
        relatedPosts: "Related Posts",
        backToBlog: "Back to Blog",
        author: "Author",
      },
    },

    // Blog Promo Modal
    modalblog: {
      heading: "Check out my blog!",
      subtitle: "Discover tutorials, insights, and thoughts on web development.",
      button: "Visit Blog",
      close: "Close",
    },

    // Navigation alias (for components using navigation.home etc)
    navigation: {
      home: "Home",
      about: "About",
      projects: "Projects",
      services: "Services",
      solutions: "Solutions",
      blog: "Blog",
      contact: "Contact",
    },

    // Project Details
    projectDetails: {
      backToProjects: "Back to Projects",
      liveDemo: "Live Demo",
      sourceCode: "Source Code",
      blogPost: "Blog Post",
    },

    // Newsletter Modal
    modal: {
      title: {
        line1: "Subscribe to newsletter",
        line2: "Enter your email",
      },
      subtitle: {
        line1: "Select categories you're interested in:",
        line2: "Subscribe",
        line3: "Cancel",
      },
      notify: "Successfully subscribed! Thank you.",
    },

    // Unsubscribe
    unsub: {
      title: {
        line1: "Unsubscribe from Newsletter",
        line2: "Email address",
        line3: "Enter your email address",
        line4: "Unsubscribe",
      },
      note: {
        line1: "You have been successfully unsubscribed from our newsletter.",
        line2: "You will be redirected to the homepage.",
      },
      error: {
        line1: "Unsubscribe Error",
        line2: "There was an error processing your unsubscribe request.",
        line3: "Try manual unsubscribe",
      },
    },
  },

  pl: {
    // ============================================
    // NEW COMPONENTS TRANSLATIONS - POLISH
    // ============================================

    // Navigation (HeaderNew)
    nav: {
      home: "Strona główna",
      about: "O mnie",
      projects: "Projekty",
      services: "Usługi",
      solutions: "Rozwiązania",
      blog: "Blog",
      contact: "Kontakt",
      letsTalk: "Porozmawiajmy",
    },

    // Hero Section (HeroNew)
    hero: {
      label: "Fullstack Developer",
      heading: "ELEKTRYZUJ\nSWÓJ BIZNES\nW SIECI",
      seoHeading: "Fullstack Web Developer — Strony, aplikacje, sklepy i marketplace w React & Next.js | AppCrates",
      subtitle: "Tworzę sklepy internetowe, landing page i aplikacje AI, które rozwijają Twój biznes. Kompleksowe rozwiązania od początku do końca.",
      cta: {
        viewWork: "ZOBACZ WIĘCEJ",
        getInTouch: "SKONTAKTUJ SIĘ",
      },
      scroll: "Przewiń",
    },

    // About Section (AboutNew)
    about: {
      label: "[ 01 — O mnie ]",
      heading: "Rozwiązania, które\nrozwijają Twój\nbiznes",
      description: {
        p1: "Pomagam firmom odnosić sukcesy w internecie. Czy potrzebujesz sklepu internetowego do sprzedaży produktów, landing page który zamienia odwiedzających w klientów, czy aplikacji AI automatyzujących procesy — dostarczam kompletne rozwiązania od początku do końca.",
        p2: "Zyskujesz partnera, który rozumie cele Twojego biznesu. Zajmuję się wszystkim: projektem, programowaniem, systemami zarządzania treścią które możesz sam aktualizować, oraz stałym wsparciem. Nie potrzebujesz wiedzy technicznej.",
      },
      stats: {
        years: { value: "2+", label: "Lata" },
        projects: { value: "10+", label: "Projektów" },
        dedication: { value: "100%", label: "Zaangażowania" },
      },
    },

    // Projects Section (ProjectsNew)
    projects: {
      label: "[ 03 — Projekty ]",
      heading: "Wybrane Projekty",
      viewAction: "Zobacz",
      cta: "Chcesz współpracować?",
      items: {
        artovnia: {
          title: "Artovnia E-Commerce",
          category: "Web Development",
          description: "Full-stack marketplace e-commerce zbudowany z Next.js i Node.js. Zaawansowane zarządzanie produktami, rozbudowane funkcje, bezpieczne płatności Stripe i płynna realizacja zamówień zoptymalizowana pod konwersje.",
        },
        animeSearch: {
          title: "Platforma Wyszukiwania Anime",
          category: "Aplikacja Webowa",
          description: "Responsywna aplikacja webowa z integracją REST API, zaawansowanym wyszukiwaniem z filtrami i spersonalizowanym silnikiem rekomendacji. Zbudowana z React i TypeScript.",
        },
        flixstock: {
          title: "FlixStock Mobile",
          category: "Aplikacja Mobilna",
          description: "Wieloplatformowa aplikacja mobilna do zarządzania magazynem w czasie rzeczywistym. Skanowanie kodów kreskowych, synchronizacja w chmurze i architektura offline-first.",
        },
        portfolio: {
          title: "Alfa Romeo Demo",
          category: "3d Web Design",
          description: "Interaktywne doświadczenie samochodu w Three.js z autorską fizyką, dźwiękiem, dynamicznym oświetleniem i filmową prezentacją.",
        },
        homebudget: {
          title: "AI Budżet Domowy",
          category: "AI app",
          description: "Aplikacja do śledzenia budżetu wykorzystująca AI. Automatyczne czytanie rachunków i dodawanie do kategorii i wydatków. Analizy, prognozy i porady AI"

        },
        spaWebsite: {
          title: "Strona Spa Glow & Serenity",
          category: "Landing Page z CMS",
          description: "Wysokokonwertująca strona spa z łatwym systemem zarządzania treścią dla właścicieli. Właściciele mogą samodzielnie aktualizować usługi, ceny i promocje bez pomocy programisty. Wzrost rezerwacji o 40% w pierwszym miesiącu."
        },
        koreanBbq: {
          title: "HWA / 火 — Premium Korean BBQ",
          category: "Koncepcyjny Projekt Frontendowy",
          description: "W pełni immersyjna platforma symulująca stronę luksusowej restauracji. Stworzona w Next.js z kinowymi animacjami GSAP ScrollTrigger, dedykowanym systemem CSS i pełnym wsparciem dla wielojęzyczności."
        }
      },
    },

    // Services Section (ServicesNew)
    services: {
      label: "[ 02 — Usługi ]",
      heading: "Co robię",
      cta: "Porozmawiajmy o Twoim projekcie",
      items: {
        webDev: {
          number: "01",
          title: "Sklepy Internetowe i Marketplace",
          description: "Kompletne sklepy online, gdzie możesz sprzedawać swoje produkty. Bezpieczne płatności, śledzenie stanów magazynowych i wszystko czego potrzebujesz do prowadzenia biznesu online. Obsługa platform multi-vendor.",
        },
        backend: {
          number: "02",
          title: "Landing Page Które Kontrolujesz",
          description: "Strony konwertujące z łatwym zarządzaniem treścią. Aktualizuj teksty, zdjęcia i oferty sam, bez dzwonienia do programisty. Idealne na kampanie marketingowe i premiery produktów.",
        },
        ecommerce: {
          number: "03",
          title: "Aplikacje Wykorzystujące AI",
          description: "Inteligentne aplikacje automatyzujące procesy w Twojej firmie. Od chatbotów AI po automatyczne przetwarzanie danych — rozwiązania oszczędzające Twój czas i pieniądze.",
        },
        responsive: {
          number: "04",
          title: "Kompleksowe Rozwiązania A-Z",
          description: "Pełne wsparcie od początkowej koncepcji przez uruchomienie aż po dalszą obsługę. Działa perfekcyjnie na telefonach, tabletach i komputerach. Zajmuję się wszystkim, abyś mógł skupić się na biznesie.",
        },
      },
    },

    // Solutions Section (SolutionsNew)
    solutions: {
      label: "[ 04 — Rozwiązania ]",
      heading: "Jak mogę pomóc?",
      cta: "Porozmawiajmy o Twoim projekcie",
      items: {
        landing: {
          number: "01",
          title: "Strony Landing Page",
          problem: "Potrzebujesz strony konwertującej?",
          description: "Niestandardowe strony landing zaprojektowane dla maksymalnych konwersji — z czasem ładowania poniżej 2s, znacznikami przyjaznymi SEO, responsywnym designem i płynnymi formularzami pozyskiwania leadów. Idealne do premier produktów, rejestracji SaaS i kampanii marketingowych. Zbudowane z Next.js dla optymalnej wydajności.",
        },
        ecommerce: {
          number: "02",
          title: "E-Commerce i Sklepy Online",
          problem: "Chcesz sprzedawać online?",
          description: "Bezpieczne, skalowalne rozwiązania e-commerce z integracją Stripe, zarządzaniem magazynem w czasie rzeczywistym, filtrowaniem produktów i procesami zakupowymi zoptymalizowanymi pod konwersje. Czy uruchamiasz mały sklep czy skalujesz do tysięcy produktów — sklepy, które sprzedają.",
        },
        marketplace: {
          number: "03",
          title: "Marketplace i Platformy",
          problem: "Budujesz platformę multi-vendor?",
          description: "Skalowalne platformy marketplace z uwierzytelnianiem użytkowników, integracją płatności Stripe Connect i panelami administracyjnymi dla pełnej kontroli. Zbudowane z Next.js i Node.js.",
        },
        webApps: {
          number: "04",
          title: "Aplikacje Webowe",
          problem: "Potrzebujesz niestandardowego oprogramowania?",
          description: "Niestandardowe aplikacje webowe zbudowane z React, Next.js i Node.js. Funkcje czasu rzeczywistego przez WebSockets, intuicyjny UI/UX, uwierzytelnianie oparte na rolach i panele administracyjne — rozwiązywanie złożonych problemów biznesowych z czystym, łatwym w utrzymaniu kodem.",
        },
        seo: {
          number: "05",
          title: "Strony Zoptymalizowane SEO",
          problem: "Nie pozycjonujesz się w Google?",
          description: "Strony zbudowane zgodnie z najlepszymi praktykami SEO: semantyczny HTML, szybka wydajność, odpowiednie meta tagi i dane strukturalne dla lepszych pozycji w wyszukiwarkach.",
        },
      },
    },

    // Contact Section (ContactNew)
    contact: {
      label: "[ 05 — Kontakt ]",
      heading: "Pracujmy razem",
      info: {
        email: { label: "Email", value: "appcratesdev@gmail.com" },
        phone: { label: "Telefon", value: "+48 733 433 230" },
        location: { label: "Lokalizacja", value: "Wrocław, Polska" },
      },
      form: {
        name: { label: "Imię", placeholder: "Twoje imię" },
        email: { label: "Email", placeholder: "twoj@email.com" },
        message: { label: "Wiadomość", placeholder: "Opowiedz mi o swoim projekcie..." },
        submit: "Wyślij wiadomość",
        sending: "Wysyłanie...",
        privacy: {
          text: "Wysyłając, zgadzasz się na naszą",
          link: "Politykę Prywatności",
        },
        success: {
          title: "Wiadomość wysłana!",
          message: "Dziękuję za kontakt. Odezwę się wkrótce.",
        },
      },
    },

    // Footer (FooterNew)
    footer: {
      newsletter: {
        title: "Subskrybuj newsletter",
        description: "Otrzymuj aktualizacje o nowych projektach, artykułach i spostrzeżeniach.",
        placeholder: "Wpisz swój email",
        button: "Subskrybuj",
        subscribing: "Subskrybowanie...",
        success: "Pomyślnie zasubskrybowano!",
      },
      brand: {
        description: "AppCrates — tworzę wyjątkowe cyfrowe doświadczenia poprzez nowoczesny web development.",
      },
      navigation: "Nawigacja",
      connect: "Połącz się",
      links: {
        email: "Email",
        github: "GitHub",
        linkedin: "LinkedIn",
        blog: "Blog",
      },
      legal: {
        privacy: "Prywatność",
        unsubscribe: "Wypisz się",
      },
      backToTop: "Góra",
      copyright: "© {year} AppCrates",
    },

    // Blog (BlogNew)
    blog: {
      title: "Blog",
      subtitle: "Przemyślenia, tutoriale i spostrzeżenia",
      search: "Szukaj wpisów...",
      categories: "Kategorie",
      all: "Wszystkie",
      readMore: "Czytaj więcej",
      publishedAt: "Opublikowano",
      readingTime: "min czytania",
      views: "wyświetlenia",
      loading: "Ładowanie wpisów...",
      noPosts: "Nie znaleziono wpisów",
      page: "Strona",
      of: "z",
      post: {
        readArticle: "Czytaj artykuł",
        minRead: "min czytania",
        share: "Udostępnij",
        relatedPosts: "Powiązane wpisy",
        backToBlog: "Wróć do bloga",
        author: "Autor",
      },
    },

    // Blog Promo Modal
    modalblog: {
      heading: "Sprawdź mój blog!",
      subtitle: "Odkryj tutoriale, spostrzeżenia i przemyślenia o web development.",
      button: "Odwiedź blog",
      close: "Zamknij",
    },

    // Navigation alias (for components using navigation.home etc)
    navigation: {
      home: "Strona główna",
      about: "O mnie",
      projects: "Projekty",
      services: "Usługi",
      solutions: "Rozwiązania",
      blog: "Blog",
      contact: "Kontakt",
    },

    // Project Details
    projectDetails: {
      backToProjects: "Wróć do projektów",
      liveDemo: "Demo na żywo",
      sourceCode: "Kod źródłowy",
      blogPost: "Post na blogu",
    },

    // Newsletter Modal
    modal: {
      title: {
        line1: "Subskrybuj newsletter",
        line2: "Wpisz swój email",
      },
      subtitle: {
        line1: "Wybierz kategorie, które Cię interesują:",
        line2: "Subskrybuj",
        line3: "Anuluj",
      },
      notify: "Pomyślnie zasubskrybowano! Dziękuję.",
    },

    // Unsubscribe
    unsub: {
      title: {
        line1: "Wypisz się z newslettera",
        line2: "Adres email",
        line3: "Wpisz swój adres email",
        line4: "Wypisz się",
      },
      note: {
        line1: "Pomyślnie wypisano z newslettera.",
        line2: "Zostaniesz przekierowany na stronę główną.",
      },
      error: {
        line1: "Błąd wypisywania",
        line2: "Wystąpił błąd podczas przetwarzania żądania wypisania.",
        line3: "Spróbuj wypisać się ręcznie",
      },
    },
  },
};
