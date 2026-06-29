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
      label: "Fullstack Web Developer",
      heading: "ELECTRIFY\nYOUR BUSINESS\nONLINE",
      metaTitle: "React & Next.js websites, apps, shops and marketplaces",
      seoHeading: "Fullstack Web Developer for React, Next.js, AI applications, websites, shops and marketplaces",
      subtitle: "Not every technology makes sense. I only build systems that actually work. Modern websites, online stores and AI tools that help businesses sell and grow.",
      punchline: "Your business. Your rules. Your system.",
      cta: {
        viewWork: "VIEW MORE",
        getInTouch: "START TO GROW",
      },
      scroll: "Scroll",
    },

    heroV2: {
      eyebrow: "Websites • Online stores • Business AI",
      seoHeading: "Modern websites, online stores and AI tools that help businesses sell and grow",
      headingPrefix: "I build modern",
      headingHighlight: "websites and online stores",
      headingSuffix: "that help your business grow",
      subtitle: "You get a fast website, a scalable store or a practical AI solution built around your offer, customers and sales process. From idea and design to launch, integrations and further growth.",
      cta: {
        primary: "View projects",
        secondary: "Let's talk",
      },
      benefits: [
        { title: "Launch faster", description: "Clear scope, modern delivery" },
        { title: "Ready to grow", description: "A site or store that scales" },
        { title: "Useful AI", description: "Automation where it saves time" },
        { title: "You own it", description: "No hidden lock-in" },
      ],
      stack: {
        title: "What this means for you",
        items: [
          { title: "STORES & MARKETPLACES", description: "Full control, zero SaaS platform limitations." },
          { title: "AI AUTOMATION", description: "AI integrations that save time and increase profits." },
          { title: "WEBSITES THAT SELL", description: "Fast, optimized, and built for conversion." },
          { title: "CUSTOM-TAILORED SYSTEMS", description: "Exactly what your business needs." },
        ],
      },
      proof: {
        label: "Built for",
        items: ["E-commerce", "Service businesses", "B2B platforms", "AI workflows"],
      },
      scroll: "Scroll down",
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
        years: { value: "80%", label: "Less manual work" },
        projects: { value: "100%", label: "Headless" },
        dedication: { value: "0", label: "Templates" },
      },
    },

    // Projects Section (ProjectsNew)
    projects: {
      label: "[ 02 — Work ]",
      heading: "Selected Projects",
      viewAction: "View",
      cta: "Want to work together?",
      clickToZoom: "Click to zoom",
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
          description: "Home budget tracking app utilizing AI. Automatic reading of bills and adding them to categories and expenses. Analyses, forecasts and AI advice"

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
        },
        lumier: {
          title: "Interior Lighting Design Demo",
          category: "Landing Page",
          description: "Professional demo website for an interior lighting design company. Built around light, motion, and code. Real-time 3D rendering, GSAP, Canvas — no compromises on performance."
        }
      },
    },

    // Services Section (ServicesNew)
    services: {
      label: "[ 02 — Services ]",
      heading: "What I can build for you",
      cta: "Consult Your Project",
      items: {
        shopify: {
          number: "01",
          title: "Shopify stores & custom storefronts",
          punchline: "Launch quickly today — without limiting tomorrow's growth.",
          description: "Shopify stores for every stage of growth: from focused theme-based launches to custom headless storefronts built with Next.js or TanStack, tailored integrations and conversion-focused UX.",
          href: "/services/shopify-development",
        },
        websites: {
          number: "02",
          title: "Websites",
          punchline: "A site that brings in clients — not just looks good.",
          description: "Modern business websites and landing pages on Next.js: lightning-fast load times, solid SEO and high conversion — ready for traffic from day one.",
          href: "/services/professional-website-development",
        },
        ecommerce: {
          number: "03",
          title: "Headless e-commerce stores",
          punchline: "Full control over your store — no commissions, no growth ceiling.",
          description: "B2C and B2B online stores on Medusa.js: open-source commerce, flexible checkout, product logic and integrations without the limits of closed SaaS platforms.",
          href: "/services/e-commerce-shops-medusa-js",
        },
        marketplace: {
          number: "04",
          title: "Multi-vendor marketplaces",
          punchline: "A platform for many sellers, built around your business model.",
          description: "Marketplace platforms on Medusa.js with vendor accounts, commission logic, custom payments and operational flows designed for scalable multi-vendor commerce.",
          href: "/services/marketplace-multi-vendor-medusa-js",
        },
        ai: {
          number: "05",
          title: "AI integrations & automation",
          punchline: "Less repetitive work, more time for what actually matters.",
          description: "AI chatbots, RAG assistants, process automations and integrations with business data — solutions that genuinely lighten the load and speed up customer handling.",
          href: "/services/ai-integrations",
        },
        apps: {
          number: "06",
          title: "Custom web applications",
          punchline: "A system built around your business, not the other way around.",
          description: "Web apps, B2B dashboards, MVPs and SaaS platforms built around real business logic — with clean architecture and room to scale.",
          href: "/services/custom-web-applications",
        },
      },
    },

    // Solutions Section (SolutionsNew)
    solutions: {
      label: "[ 04 — Solutions ]",
      heading: "How can I help?",
      cta: "Let's talk about your project",
      items: {
        landing: {
          number: "01",
          title: "Landing Pages & Business Websites",
          problem: "Getting traffic, but not enough inquiries?",
          description: "Conversion- and SEO-focused landing pages on Next.js — fast loading, responsive, modern design, high conversion rates and excellent scalability.",
        },
        ecommerce: {
          number: "02",
          title: "Shopify & Custom E-Commerce Stores",
          problem: "Your platform starting to hold you back?",
          description: "Shopify stores from fast theme-based launches to custom headless storefronts on Next.js or TanStack — plus Medusa.js when your commerce logic needs full open-source control.",
        },
        marketplace: {
          number: "03",
          title: "Marketplaces & Multi-Vendor Platforms",
          problem: "Looking to build a platform for multiple sellers?",
          description: "Marketplaces with custom commission logic, payments and vendor account management — tailored to your business model from the first line of code.",
        },
        webApps: {
          number: "04",
          title: "Custom Web Applications",
          problem: "No off-the-shelf tool fits your workflow?",
          description: "Web applications and internal systems on Next.js — built around real business logic, with architecture that grows alongside your company.",
        },
        seo: {
          number: "05",
          title: "SEO-Optimised Websites",
          problem: "Competitors ranking higher, despite your offer being better?",
          description: "Next.js sites with technical SEO built in from the ground up: fast loading, proper semantics, Core Web Vitals and structure that both users and Google understand.",
        },
      },
    },

    // Contact Section (ContactNew)
    contact: {
      label: "[ 06 — Contact ]",
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

    calculator: {
      meta: {
        title: "Project pricing calculator",
        description: "Estimate the budget for a website, store, marketplace, AI implementation or web app and send an inquiry with a clear project summary.",
      },
      page: {
        backHome: "Back to home",
        label: "[ Pricing calculator ]",
        heading: "Estimate your project before we talk",
        subtitle: "Answer a few simple questions. You will see an estimated budget range and send me a summary, so our first conversation starts with specifics.",
      },
      stepLabel: "Step",
      progressLabel: "Pricing calculator",
      selectedProject: "Selected project",
      noPriceHint: "Individual estimate after consultation",
      optionPricePrefix: "Estimated add-on range",
      noCost: "No extra cost",
      multiplier: "Timeline impact",
      titles: {
        service: "What do you want to build?",
        base: "How should we start?",
        cms: "Do you want to edit content yourself?",
        features: "What else should be included?",
        deadline: "How soon do you need it?",
        saas_questions: "What should the application include?",
        result: "Summary and inquiry",
      },
      result: {
        label: "Estimated budget",
        noPriceTitle: "This type of project needs a short consultation",
        formTitle: "Send this summary to me",
      },
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone, optional",
        message: "Message, optional",
        submit: "Send inquiry",
        sending: "Sending...",
        success: "Thank you. Your inquiry has been sent.",
        error: "Could not send the inquiry.",
      },
      buttons: {
        next: "Next",
        back: "Back",
        clear: "Clear",
        reset: "Estimate another project",
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
      latestSection: {
        label: "[ 05 — Blog ]",
        heading: "Latest from the blog",
        subtitle: "Fresh notes on web development, AI, e-commerce and the decisions behind modern digital products.",
        cta: "View all posts",
      },
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
        latestPosts: "Latest posts",
        shareOnFacebook: "Share on Facebook",
        shareOnX: "Share on X",
        shareOnReddit: "Share on Reddit",
        shareOnLinkedIn: "Share on LinkedIn",
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
      contactCta: "Contact me ",
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
      label: "Next.js + Medusa.js Developer",
      heading: "ELEKTRYZUJ\nSWÓJ BIZNES\nW SIECI",
      metaTitle: "Strony, aplikacje, sklepy i marketplace w React & Next.js",
      seoHeading: "Fullstack Web Developer tworzący strony, aplikacje AI, sklepy i marketplace w React oraz Next.js",
      subtitle: "Nie każda technologia ma sens. Buduję tylko te systemy, które naprawdę działają. Nowoczesne strony internetowe, sklepy online i narzędzia AI, które pomagają firmom sprzedawać i rosnąć.",
      punchline: "Twój biznes. Twoje zasady. Twój system.",
      cta: {
        viewWork: "ZOBACZ WIĘCEJ",
        getInTouch: "ZACZNIJ ROZWÓJ",
      },
      scroll: "Przewiń",
    },

    heroV2: {
      eyebrow: "Strony internetowe • Sklepy online • AI dla firm",
      seoHeading: "Nowoczesne strony internetowe, sklepy online i narzędzia AI, które pomagają firmom sprzedawać i rosnąć",
      headingPrefix: "Tworzę nowoczesne",
      headingHighlight: "strony i sklepy internetowe",
      headingSuffix: "które pomagają rozwijać biznes",
      subtitle: "Dostajesz szybką stronę, skalowalny sklep albo praktyczne rozwiązanie AI zbudowane wokół Twojej oferty, klientów i procesu sprzedaży. Od pomysłu i projektu po wdrożenie, integracje i dalszy rozwój.",
      cta: {
        primary: "ZOBACZ REALIZACJE",
        secondary: "ZACZNIJ ROZWÓJ",
      },
      benefits: [
        { title: "Szybszy start", description: "Jasny zakres i sprawne wdrożenie" },
        { title: "Gotowe na wzrost", description: "Strona albo sklep, który skaluje się z firmą" },
        { title: "AI w praktyce", description: "Automatyzacje tam, gdzie oszczędzają czas" },
        { title: "Pełna kontrola", description: "Bez ukrytych kosztów i zamknięcia w platformie" },
      ],
      stack: {
        title: "Co to oznacza dla Ciebie",
        items: [
          { title: "SKLEPY I MARKETPLACE", description: "Pełna kontrola, zero ograniczeń platform SaaS." },
          { title: "AUTOMATYZACJA Z AI", description: "Integracje AI, które oszczędzają czas i zwiększają zyski." },
          { title: "STRONY, KTÓRE SPRZEDAJĄ", description: "Szybkie, zoptymalizowane i tworzone pod konwersję." },
          { title: "SYSTEMY SZYTE NA MIARĘ", description: "Dokładnie takie, jakich potrzebuje Twój biznes." },
        ],
      },
      proof: {
        label: "Tworzę dla",
        items: ["E-commerce", "Firm usługowych", "Platform B2B", "Procesów AI"],
      },
      scroll: "Przewiń w dół",
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
        years: { value: "80%", label: "Mniej pracy ręcznej" },
        projects: { value: "100%", label: "Headless" },
        dedication: { value: "0", label: "Szablonów" },
      },
    },

    // Projects Section (ProjectsNew)
    projects: {
      label: "[ 03 — Projekty ]",
      heading: "Wybrane Projekty",
      viewAction: "Zobacz",
      cta: "Chcesz współpracować?",
      clickToZoom: "Kliknij, aby powiększyć",
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
        },
        lumier: {
          title: "Demo strona designu oświetlenia wnętrz",
          category: "Landing Page",
          description: "Profesjonalna strona demonstracyjna dla firmy zajmującej się designem oświetlenia wnętrz. Zbudowane wokół światła, ruchu i kodu. Rendering 3D w czasie rzeczywistym, GSAP, Canvas — bez kompromisów w wydajności."
        }
      },
    },


    // Services Section (ServicesNew)
    services: {
      label: "[ 02 — Usługi ]",
      heading: "Co mogę dla Ciebie zbudować",
      cta: "Skonsultuj Swój Projekt",
      items: {
        shopify: {
          number: "01",
          title: "Sklepy Shopify i custom storefronty",
          punchline: "Szybki start dziś — bez ograniczania jutrzejszego wzrostu.",
          description: "Sklepy Shopify na każdy etap rozwoju: od sprawnych wdrożeń na motywie po customowe storefronty headless na Next.js lub TanStack, dedykowane integracje i UX nastawiony na konwersję.",
          href: "/uslugi/shopify-development",
        },
        websites: {
          number: "02",
          title: "Strony internetowe",
          punchline: "Strona, która przyciąga klientów — nie tylko wygląda.",
          description: "Nowoczesne strony firmowe i landing page na Next.js: błyskawiczne ładowanie, solidne SEO i wysoka konwersja — gotowe na ruch od pierwszego dnia.",
          href: "/uslugi/professional-website-development",
        },
        ecommerce: {
          number: "03",
          title: "Sklepy headless e-commerce",
          punchline: "Sklep z pełną kontrolą — bez prowizji, bez sufitu wzrostu.",
          description: "Sklepy B2C i B2B na Medusa.js: open-source commerce, elastyczny checkout, logika produktów i integracje bez ograniczeń zamkniętych platform SaaS.",
          href: "/uslugi/e-commerce-shops-medusa-js",
        },
        marketplace: {
          number: "04",
          title: "Marketplace multi-vendor",
          punchline: "Platforma dla wielu sprzedawców, zbudowana pod Twój model biznesowy.",
          description: "Platformy marketplace na Medusa.js z kontami sprzedawców, logiką prowizji, płatnościami i procesami operacyjnymi dla skalowalnej sprzedaży multi-vendor.",
          href: "/uslugi/marketplace-multi-vendor-medusa-js",
        },
        ai: {
          number: "05",
          title: "Wdrożenia AI i automatyzacje",
          punchline: "Mniej powtarzalnej pracy, więcej czasu na to, co ważne.",
          description: "Chatboty AI, asystenci RAG, automatyzacje procesów i integracje z danymi firmowymi — rozwiązania, które realnie odciążają zespół i przyspieszają obsługę klientów.",
          href: "/uslugi/ai-integrations",
        },
        apps: {
          number: "06",
          title: "Dedykowane aplikacje webowe",
          punchline: "System dopasowany do Twojej firmy, nie firma dopasowana do systemu.",
          description: "Aplikacje webowe, panele B2B, MVP i platformy SaaS budowane pod konkretną logikę biznesową — z czystą architekturą i przestrzenią do skalowania.",
          href: "/uslugi/custom-web-applications",
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
          title: "Strony Landing Page i Firmowe",
          problem: "Masz ruch, ale mało zapytań?",
          description: "Landing page na Next.js zoptymalizowany pod konwersję i SEO — szybkie ładowanie, responsywne, nowoczesny design, wysoka konwersja, doskonała skalowalność. ",
        },
        ecommerce: {
          number: "02",
          title: "Sklepy Shopify i custom e-commerce",
          problem: "Platforma zaczyna ograniczać Twój rozwój?",
          description: "Sklepy Shopify od szybkiego startu na motywie po custom headless na Next.js lub TanStack — oraz Medusa.js, gdy logika commerce wymaga pełnej kontroli open-source.",
        },
        marketplace: {
          number: "03",
          title: "Marketplace i Platformy Multi-Vendor",
          problem: "Chcesz zbudować platformę dla wielu sprzedawców?",
          description: "Marketplace'y z własną logiką prowizji, płatności i zarządzania kontami sprzedawców — dopasowane do modelu biznesowego od pierwszej linii kodu.",
        },
        webApps: {
          number: "04",
          title: "Dedykowane Aplikacje Webowe",
          problem: "Żadne gotowe narzędzie nie pasuje do Twojego procesu?",
          description: "Aplikacje webowe i systemy wewnętrzne na Next.js — budowane pod realną logikę biznesową, z architekturą, która rośnie razem z firmą.",
        },
        seo: {
          number: "05",
          title: "Strony Zoptymalizowane pod SEO",
          problem: "Konkurencja jest wyżej w Google, choć Twoja oferta jest lepsza?",
          description: "Strony na Next.js z technicznym SEO od podstaw: szybkie ładowanie, poprawna semantyka, Core Web Vitals i struktura zrozumiała zarówno dla użytkowników, jak i dla Google.",
        },
      },
    },

    // Contact Section (ContactNew)
    contact: {
      label: "[ 06 — Kontakt ]",
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

    calculator: {
      meta: {
        title: "Kalkulator wyceny projektu",
        description: "Oszacuj budżet strony, sklepu, marketplace, wdrożenia AI albo aplikacji webowej i wyślij zapytanie z czytelnym podsumowaniem.",
      },
      page: {
        backHome: "Wróć na stronę główną",
        label: "[ Kalkulator wyceny ]",
        heading: "Oszacuj projekt zanim porozmawiamy",
        subtitle: "Odpowiedz na kilka prostych pytań. Zobaczysz orientacyjny zakres budżetu i wyślesz mi podsumowanie, dzięki czemu pierwsza rozmowa zacznie się od konkretów.",
      },
      stepLabel: "Krok",
      progressLabel: "Kalkulator wyceny",
      selectedProject: "Wybrany projekt",
      noPriceHint: "Wycena indywidualna po konsultacji",
      optionPricePrefix: "Orientacyjny zakres dodatku",
      noCost: "Bez dopłaty",
      multiplier: "Wpływ na termin",
      titles: {
        service: "Co chcesz zbudować?",
        base: "Od czego zaczynamy?",
        cms: "Czy chcesz samodzielnie edytować treści?",
        features: "Co jeszcze ma się znaleźć w projekcie?",
        deadline: "Jak szybko projekt ma być gotowy?",
        saas_questions: "Co powinna zawierać aplikacja?",
        result: "Podsumowanie i zapytanie",
      },
      result: {
        label: "Orientacyjny budżet",
        noPriceTitle: "Ten typ projektu wymaga krótkiej konsultacji",
        formTitle: "Wyślij mi to podsumowanie",
      },
      form: {
        name: "Imię",
        email: "Email",
        phone: "Telefon opcjonalnie",
        message: "Wiadomość opcjonalnie",
        submit: "Wyślij zapytanie",
        sending: "Wysyłanie...",
        success: "Dziękuję. Zapytanie zostało wysłane.",
        error: "Nie udało się wysłać zapytania.",
      },
      buttons: {
        next: "Dalej",
        back: "Wstecz",
        clear: "Wyczyść",
        reset: "Policz inny projekt",
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
      latestSection: {
        label: "[ 05 — Blog ]",
        heading: "Najnowsze wpisy z bloga",
        subtitle: "Świeże notatki o web developmencie, AI, e-commerce i decyzjach stojących za nowoczesnymi produktami cyfrowymi.",
        cta: "Zobacz wszystkie wpisy",
      },
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
        latestPosts: "Ostatnie wpisy",
        shareOnFacebook: "Udostępnij na Facebooku",
        shareOnX: "Udostępnij na X",
        shareOnReddit: "Udostępnij na Reddicie",
        shareOnLinkedIn: "Udostępnij na LinkedIn",
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
      contactCta: "Skontaktuj się",
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
