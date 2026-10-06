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
      heading: "ELECTRIFY\nYOUR BUSINESS\nONLINE",
      metaTitle: "Medusa.js stores & marketplaces, websites and AI apps",
      metaDescription: "Online stores and multi-vendor marketplaces on Medusa.js, plus websites, web apps and AI tools on Next.js. Built around your offer and the way you sell.",
      seoHeading: "Fullstack Medusa.js developer building online stores and multi-vendor marketplaces, plus websites and AI apps in Next.js",
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
          { title: "STORES & MARKETPLACES", description: "Built on Medusa.js. Full control, zero SaaS platform limitations." },
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

    // Proof Section (ProofNew)
    proof: {
      label: "[ Proof ]",
      heading: "Proven in production",
      intro: "I design and build commerce systems that handle real payments, orders, sellers and integrations.",
      bar: [
        { value: "Medusa.js", label: "Marketplace in production" },
        { value: "Stripe Connect", label: "Split payments and payouts" },
        { value: "Featured by Mercur", label: "External case study" },
        { value: "5.0", label: "Google review rating" },
      ],
      flagship: {
        eyebrow: "Artovnia · multi-vendor marketplace on Medusa.js",
        title: "A marketplace I designed and built from the ground up",
        body: "Architecture, backend, seller panel and storefront. Independent makers run their own shops here, and a buyer pays once for a cart filled from several of them.",
        imageAlt: "Artovnia marketplace storefront with featured handmade products",
        features: [
          { title: "One cart, many sellers", description: "The buyer pays once and the order splits into the shops that fulfil it." },
          { title: "Commissions and payouts", description: "Rates and payout holds are settings, not code. Every payment is attributed to the right seller." },
          { title: "Sync with sellers' own shops", description: "Sellers already on Shopify, WooCommerce, PrestaShop, Shoper or BaseLinker keep them. Stock and orders match in both places." },
          { title: "EU marketplace rules", description: "DAC7, DSA and the Omnibus Directive run as separate modules that can be updated as the law changes." },
        ],
        failure: {
          heading: "Robust by design",
          body: "An integration stops responding? The operation can be safely retried. The same webhook arrives twice? It does not cause a second effect. A process breaks off halfway? The state can be reconciled and restored. Critical operations leave a trail that shows what actually happened.",
          chips: ["Retries and queues", "Idempotent operations", "Reconciliation", "Audit trail", "Dead-letter handling", "Race-condition safety"],
        },
        cta: "See how it works",
        visit: "Visit artovnia.com",
      },
      mercur: {
        label: "External case study",
        body: "Mercur, a marketplace platform built for the Medusa.js ecosystem, wrote up Artovnia as one of its case studies, alongside projects like Skylum.",
        link: "Read the case study",
      },
      reviews: {
        heading: "From people I have worked with",
        ratingLabel: "5 out of 5 stars",
        readMore: "Read the full review",
        close: "Close",
        translated: "Translated from Polish",
        link: "See reviews on Google",
        items: [
          {
            author: "Clara G.",
            text: "I genuinely couldn't imagine a better person to design my landing page. What I found the most helpful was not just that Arkadiusz could develop the whole website, but he also has an astounding knowledge of B2B marketing. He knows the kind of solutions that actually reach customers. He proposes different approaches and is very transparent on which solution might be better even if it's cheaper. On the other hand, he presents great reasoning why sometimes the time and cost-consuming approach might be better if long-term it buys me peace of mind, and most importantly, more customers.\n\nI can already see the results - my landing page is doing great and I'm planning on cooperating with AppCrates more in the future, aiming at new target groups and maybe even building my main page infrastructure from the ground up.\n\nOh, and on top of that I loved how responsive Arkadiusz is! I usually receive his answers in a couple of hours (or faster) and he's the most professional expert I communicated with in a long time.\n\nThis is a lengthy review as you can see but it's just that I genuinely think he's that great to work with and he brings actual results. Couldn't recommend him more!!",
            translated: false,
          },
          {
            author: "David C.",
            text: "I've been working with Arkadiusz for some time and have had a great experience. He's reliable, easy to communicate with, and genuinely cares about the quality of his work. He understands what the business needs, suggests thoughtful solutions, and takes real ownership of the project. I'm very happy with our cooperation and would gladly recommend him.",
            translated: false,
          },
          {
            author: "Weronika G.",
            text: "I highly recommend it. My portfolio is exactly what I envisioned, including moving elements, animations, an English translation and the ability to add my own materials. Thanks!",
            translated: true,
          },
        ],
      },
    },

    // About Section (AboutNew)
    about: {
      label: "[ 01 - About ]",
      heading: "You talk to\nthe person who\nbuilds your system",
      description: {
        p1: "No account manager and no hand-offs. The person who talks to you about your business model also designs the architecture, writes the backend and the storefront, and answers when something needs to change.",
        p2: "We start with how you sell: who pays, who ships, who gets paid and when. The technology follows from those answers. You get the code, access to everything, and a panel where you edit content yourself.",
      },
      stats: {
        years: { value: "1", label: "Person from first call to launch" },
        projects: { value: "100%", label: "Of the code is yours" },
        dedication: { value: "0%", label: "Platform fee on your sales" },
      },
    },

    // Projects Section (ProjectsNew)
    projects: {
      label: "[ 02 - Work ]",
      heading: "Selected Projects",
      viewAction: "View",
      cta: "Want to work together?",
      clickToZoom: "Click to zoom",
      items: {
        artovnia: {
          title: "Artovnia E-Commerce",
          category: "Medusa.js marketplace",
          description: "Multi-vendor e-commerce marketplace built on Medusa.js with a Next.js storefront. Features advanced product management, rich features, secure Stripe payment processing, and a seamless checkout experience optimized for conversions.",
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
          title: "HWA / 火 - Korean BBQ",
          category: "Premium Frontend Experience",
          description: "A conceptual frontend project simulating a luxury Korean BBQ restaurant. Built with Next.js featuring cinematic GSAP ScrollTrigger animations, a custom CSS architecture, and full i18n support."
        },
        lumier: {
          title: "Interior Lighting Design Demo",
          category: "Landing Page",
          description: "Professional demo website for an interior lighting design company. Built around light, motion, and code. Real-time 3D rendering, GSAP, Canvas - no compromises on performance."
        }
      },
    },

    // Services Section (ServicesNew)
    services: {
      label: "[ 02 - Services ]",
      heading: "What I can build for you",
      intro: "My specialisation is Medusa.js: online stores, multi-vendor marketplaces and commerce integrations written around your business model.",
      hubLink: "How a Medusa.js project works",
      more: "See details",
      cta: "Consult Your Project",
      items: {
        shopify: {
          number: "04",
          title: "Shopify stores & custom storefronts",
          punchline: "Launch quickly today - without limiting tomorrow's growth.",
          description: "Shopify stores for every stage of growth: from focused theme-based launches to custom headless storefronts built with Next.js or TanStack, tailored integrations and conversion-focused UX.",
          href: "/services/shopify-development",
        },
        websites: {
          number: "03",
          title: "Websites",
          punchline: "A site that brings in clients - not just looks good.",
          description: "Modern business websites and landing pages on Next.js: lightning-fast load times, solid SEO and high conversion - ready for traffic from day one.",
          href: "/services/professional-website-development",
        },
        ecommerce: {
          number: "01",
          title: "Medusa.js online stores",
          punchline: "Full control over your store - no commissions, no growth ceiling.",
          description: "B2C and B2B online stores on Medusa.js: open-source commerce, flexible checkout, product logic and integrations without the limits of closed SaaS platforms.",
          href: "/services/e-commerce-shops-medusa-js",
        },
        marketplace: {
          number: "02",
          title: "Medusa.js multi-vendor marketplaces",
          punchline: "A platform for many sellers, built around your business model.",
          description: "Marketplace platforms on Medusa.js with vendor accounts, commission logic, custom payments and operational flows designed for scalable multi-vendor commerce.",
          href: "/services/marketplace-multi-vendor-medusa-js",
        },
        ai: {
          number: "05",
          title: "AI integrations & automation",
          punchline: "Less repetitive work, more time for what actually matters.",
          description: "AI chatbots, RAG assistants, process automations and integrations with business data - solutions that genuinely lighten the load and speed up customer handling.",
          href: "/services/ai-integrations",
        },
        apps: {
          number: "06",
          title: "Custom web applications",
          punchline: "A system built around your business, not the other way around.",
          description: "Web apps, B2B dashboards, MVPs and SaaS platforms built around real business logic - with clean architecture and room to scale.",
          href: "/services/custom-web-applications",
        },
      },
    },

    // Solutions Section (SolutionsNew)
    solutions: {
      label: "[ 04 - Solutions ]",
      heading: "How can I help?",
      cta: "Let's talk about your project",
      items: {
        landing: {
          number: "01",
          title: "Landing Pages & Business Websites",
          problem: "Getting traffic, but not enough inquiries?",
          description: "Conversion- and SEO-focused landing pages on Next.js - fast loading, responsive, modern design, high conversion rates and excellent scalability.",
        },
        ecommerce: {
          number: "02",
          title: "Medusa.js & Shopify Online Stores",
          problem: "Your platform starting to hold you back?",
          description: "Medusa.js when your sales logic needs full control and code you own, or Shopify, from a fast theme-based launch to a custom headless storefront on Next.js.",
        },
        marketplace: {
          number: "03",
          title: "Marketplaces & Multi-Vendor Platforms",
          problem: "Looking to build a platform for multiple sellers?",
          description: "Medusa.js marketplaces with custom commission logic, split payments and vendor account management, tailored to your business model from the first line of code.",
        },
        webApps: {
          number: "04",
          title: "Custom Web Applications",
          problem: "No off-the-shelf tool fits your workflow?",
          description: "Web applications and internal systems on Next.js - built around real business logic, with architecture that grows alongside your company.",
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
      label: "[ 06 - Contact ]",
      heading: "Let's work together",
      info: {
        email: { label: "Email", value: "kontakt@appcrates.pl" },
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
        description: "AppCrates - online stores and marketplaces on Medusa.js, websites and web apps on Next.js, AI implementations.",
      },
      navigation: "Navigation",
      connect: "Connect",
      links: {
        email: "Email",
        github: "GitHub",
        linkedin: "LinkedIn",
        blog: "Blog",
        marketplaceGuide: "Marketplace guide",
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
      subtitle: "Notes from production: Medusa.js, marketplaces, e-commerce, Next.js and AI.",
      latestSection: {
        label: "[ 05 - Blog ]",
        heading: "Latest from the blog",
        subtitle: "Fresh notes on Medusa.js, e-commerce, AI and the decisions behind modern digital products.",
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
      externalArticle: "Article",
      contactCta: "Contact me ",
      projects: "Projects",
      onThisPage: "On this page",
      previousProject: "Previous project",
      nextProject: "Next project",
      allProjects: "Project navigation",
      moreTech: "more",
      closingTitle: "Interested in something similar?",
      closingText: "Tell me what you need and you will get a concrete scope, timeline and price.",
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
      heading: "ELEKTRYZUJ\nSWÓJ BIZNES\nW SIECI",
      metaTitle: "Sklepy i marketplace na Medusa.js, strony i aplikacje AI",
      metaDescription: "Sklepy internetowe i marketplace multi-vendor na Medusa.js, a do tego strony, aplikacje webowe i narzędzia AI na Next.js. Budowane pod to, jak sprzedajesz.",
      seoHeading: "Fullstack developer Medusa.js: sklepy, marketplace, strony i aplikacje AI w Next.js",
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
          { title: "SKLEPY I MARKETPLACE", description: "Na Medusa.js. Pełna kontrola, zero ograniczeń platform SaaS." },
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

    // Proof Section (ProofNew)
    proof: {
      label: "[ Dowody ]",
      heading: "Sprawdzone w produkcji",
      intro: "Projektuję i buduję systemy commerce, które obsługują prawdziwe płatności, zamówienia, sprzedawców i integracje.",
      bar: [
        { value: "Medusa.js", label: "Marketplace na produkcji" },
        { value: "Stripe Connect", label: "Podział płatności i wypłaty" },
        { value: "Case study Mercur", label: "Zewnętrzna publikacja" },
        { value: "5,0", label: "Średnia w opiniach Google" },
      ],
      flagship: {
        eyebrow: "Artovnia · marketplace multi-vendor na Medusa.js",
        title: "Marketplace, który zaprojektowałem i zbudowałem od podstaw",
        body: "Architektura, backend, panel sprzedawcy i storefront. Twórcy prowadzą tu własne sklepy, a kupujący płaci raz za koszyk złożony u kilku z nich.",
        imageAlt: "Strona główna marketplace Artovnia z wyróżnionymi produktami rękodzieła",
        features: [
          { title: "Jeden koszyk, wielu sprzedawców", description: "Klient płaci raz, a zamówienie rozdziela się na sklepy, które je realizują." },
          { title: "Prowizje i wypłaty", description: "Stawki i okres wstrzymania wypłat to ustawienia, nie kod. Każda płatność trafia do właściwego sprzedawcy." },
          { title: "Synchronizacja ze sklepami sprzedawców", description: "Kto sprzedaje już na Shopify, WooCommerce, PrestaShop, Shoperze czy przez BaseLinkera, nie zaczyna od zera. Stany i zamówienia zgadzają się w obu miejscach." },
          { title: "Wymogi prawne UE", description: "DAC7, DSA i dyrektywa Omnibus działają jako osobne moduły, które da się aktualizować razem z przepisami." },
        ],
        failure: {
          heading: "Odporne na awarie z założenia",
          body: "Integracja przestaje odpowiadać? Operacja może zostać bezpiecznie ponowiona. Ten sam webhook dociera drugi raz? Nie tworzy drugiego skutku. Proces urywa się w połowie? Stan można uzgodnić i odtworzyć. Krytyczne operacje pozostawiają ślad pozwalający sprawdzić, co faktycznie się wydarzyło.",
          chips: ["Ponawianie i kolejki", "Idempotentne operacje", "Uzgadnianie stanu", "Audit trail", "Dead-letter queue", "Ochrona przed race condition"],
        },
        cta: "Zobacz, jak to działa",
        visit: "Wejdź na artovnia.com",
      },
      mercur: {
        label: "Zewnętrzne case study",
        body: "Mercur, platforma marketplace zbudowana dla ekosystemu Medusa.js, opisał Artovnię w swoim case study, obok projektów takich jak Skylum.",
        link: "Przeczytaj case study",
      },
      reviews: {
        heading: "Opinie ze współpracy",
        ratingLabel: "5 na 5 gwiazdek",
        readMore: "Czytaj całą opinię",
        close: "Zamknij",
        translated: "Przetłumaczone z angielskiego",
        link: "Zobacz opinie w Google",
        items: [
          {
            author: "Clara G.",
            text: "Naprawdę nie wyobrażam sobie lepszej osoby do zaprojektowania mojego landing page'a. Najbardziej pomocne było nie tylko to, że Arkadiusz potrafił zbudować całą stronę, ale też jego imponująca wiedza o marketingu B2B. Wie, jakie rozwiązania faktycznie docierają do klientów. Proponuje różne podejścia i otwarcie mówi, które rozwiązanie może być lepsze, nawet jeśli jest tańsze. Z drugiej strony świetnie uzasadnia, dlaczego czasem bardziej czasochłonne i kosztowne podejście się opłaca, jeśli w dłuższej perspektywie daje spokój, a przede wszystkim więcej klientów.\n\nJuż widzę efekty - mój landing page radzi sobie świetnie i planuję dalszą współpracę z AppCrates: nowe grupy docelowe, a może nawet zbudowanie od podstaw infrastruktury mojej głównej strony.\n\nA do tego bardzo podoba mi się, jak szybko Arkadiusz odpowiada! Zwykle dostaję odpowiedź w ciągu kilku godzin (albo szybciej) i to najbardziej profesjonalny ekspert, z jakim od dawna mam kontakt.\n\nJak widać, to długa opinia, ale po prostu naprawdę uważam, że świetnie się z nim współpracuje i przynosi realne efekty. Polecam z całego serca!!",
            translated: true,
          },
          {
            author: "David C.",
            text: "Współpracuję z Arkadiuszem od jakiegoś czasu i mam świetne doświadczenia. Jest rzetelny, łatwo się z nim komunikować i naprawdę dba o jakość swojej pracy. Rozumie potrzeby firmy, proponuje przemyślane rozwiązania i bierze pełną odpowiedzialność za projekt. Jestem bardzo zadowolony z naszej współpracy i z przyjemnością go polecam.",
            translated: true,
          },
          {
            author: "Weronika G.",
            text: "Bardzo polecam. Moje portfolio jest dokładnie takie, jak sobie wymarzyłam (łącznie z ruchomymi elementami, animacjami, tłumaczeniem na angielski, możliwością samodzielnego dodawania materiałów). Dzięki!",
            translated: false,
          },
        ],
      },
    },

    // About Section (AboutNew)
    about: {
      label: "[ 01 - O mnie ]",
      heading: "Rozmawiasz z tym,\nkto pisze\nTwój system",
      description: {
        p1: "Nie ma tu account managera ani przekazywania projektu dalej. Ta sama osoba, która rozmawia z Tobą o modelu biznesowym, projektuje architekturę, pisze backend i storefront, a potem odpowiada, gdy trzeba coś zmienić.",
        p2: "Zaczynamy od tego, jak sprzedajesz: kto płaci, kto wysyła, kto dostaje pieniądze i kiedy. Technologia wynika z tych odpowiedzi. Dostajesz kod, dostęp do wszystkiego i panel, w którym sam zmieniasz treści.",
      },
      stats: {
        years: { value: "1", label: "Osoba od rozmowy do wdrożenia" },
        projects: { value: "100%", label: "Kodu należy do Ciebie" },
        dedication: { value: "0%", label: "Prowizji platformy od sprzedaży" },
      },
    },

    // Projects Section (ProjectsNew)
    projects: {
      label: "[ 03 - Projekty ]",
      heading: "Wybrane Projekty",
      viewAction: "Zobacz",
      cta: "Chcesz współpracować?",
      clickToZoom: "Kliknij, aby powiększyć",
      items: {
        artovnia: {
          title: "Artovnia E-Commerce",
          category: "Marketplace Medusa.js",
          description: "Marketplace multi-vendor zbudowany na Medusa.js ze storefrontem w Next.js. Zaawansowane zarządzanie produktami, rozbudowane funkcje, bezpieczne płatności Stripe i płynna realizacja zamówień zoptymalizowana pod konwersje.",
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
          title: "HWA / 火 - Premium Korean BBQ",
          category: "Koncepcyjny Projekt Frontendowy",
          description: "W pełni immersyjna platforma symulująca stronę luksusowej restauracji. Stworzona w Next.js z kinowymi animacjami GSAP ScrollTrigger, dedykowanym systemem CSS i pełnym wsparciem dla wielojęzyczności."
        },
        lumier: {
          title: "Demo strona designu oświetlenia wnętrz",
          category: "Landing Page",
          description: "Profesjonalna strona demonstracyjna dla firmy zajmującej się designem oświetlenia wnętrz. Zbudowane wokół światła, ruchu i kodu. Rendering 3D w czasie rzeczywistym, GSAP, Canvas - bez kompromisów w wydajności."
        }
      },
    },


    // Services Section (ServicesNew)
    services: {
      label: "[ 02 - Usługi ]",
      heading: "Co mogę dla Ciebie zbudować",
      intro: "Specjalizuję się w Medusa.js: sklepy internetowe, marketplace multi-vendor i integracje commerce pisane pod Twój model biznesowy.",
      hubLink: "Jak wygląda wdrożenie Medusa.js",
      more: "Zobacz szczegóły",
      cta: "Skonsultuj Swój Projekt",
      items: {
        shopify: {
          number: "04",
          title: "Sklepy Shopify i custom storefronty",
          punchline: "Szybki start dziś - bez ograniczania jutrzejszego wzrostu.",
          description: "Sklepy Shopify na każdy etap rozwoju: od sprawnych wdrożeń na motywie po customowe storefronty headless na Next.js lub TanStack, dedykowane integracje i UX nastawiony na konwersję.",
          href: "/uslugi/shopify-development",
        },
        websites: {
          number: "03",
          title: "Strony internetowe",
          punchline: "Strona, która przyciąga klientów - nie tylko wygląda.",
          description: "Nowoczesne strony firmowe i landing page na Next.js: błyskawiczne ładowanie, solidne SEO i wysoka konwersja - gotowe na ruch od pierwszego dnia.",
          href: "/uslugi/professional-website-development",
        },
        ecommerce: {
          number: "01",
          title: "Sklepy internetowe na Medusa.js",
          punchline: "Sklep z pełną kontrolą - bez prowizji, bez sufitu wzrostu.",
          description: "Sklepy B2C i B2B na Medusa.js: open-source commerce, elastyczny checkout, logika produktów i integracje bez ograniczeń zamkniętych platform SaaS.",
          href: "/uslugi/e-commerce-shops-medusa-js",
        },
        marketplace: {
          number: "02",
          title: "Marketplace multi-vendor na Medusa.js",
          punchline: "Platforma dla wielu sprzedawców, zbudowana pod Twój model biznesowy.",
          description: "Platformy marketplace na Medusa.js z kontami sprzedawców, logiką prowizji, płatnościami i procesami operacyjnymi dla skalowalnej sprzedaży multi-vendor.",
          href: "/uslugi/marketplace-multi-vendor-medusa-js",
        },
        ai: {
          number: "05",
          title: "Wdrożenia AI i automatyzacje",
          punchline: "Mniej powtarzalnej pracy, więcej czasu na to, co ważne.",
          description: "Chatboty AI, asystenci RAG, automatyzacje procesów i integracje z danymi firmowymi - rozwiązania, które realnie odciążają zespół i przyspieszają obsługę klientów.",
          href: "/uslugi/ai-integrations",
        },
        apps: {
          number: "06",
          title: "Dedykowane aplikacje webowe",
          punchline: "System dopasowany do Twojej firmy, nie firma dopasowana do systemu.",
          description: "Aplikacje webowe, panele B2B, MVP i platformy SaaS budowane pod konkretną logikę biznesową - z czystą architekturą i przestrzenią do skalowania.",
          href: "/uslugi/custom-web-applications",
        },
      },
    },

    // Solutions Section (SolutionsNew)
    solutions: {
      label: "[ 04 - Rozwiązania ]",
      heading: "Jak mogę pomóc?",
      cta: "Porozmawiajmy o Twoim projekcie",
      items: {
        landing: {
          number: "01",
          title: "Strony Landing Page i Firmowe",
          problem: "Masz ruch, ale mało zapytań?",
          description: "Landing page na Next.js zoptymalizowany pod konwersję i SEO - szybkie ładowanie, responsywne, nowoczesny design, wysoka konwersja, doskonała skalowalność. ",
        },
        ecommerce: {
          number: "02",
          title: "Sklepy na Medusa.js i Shopify",
          problem: "Platforma zaczyna ograniczać Twój rozwój?",
          description: "Medusa.js, gdy logika sprzedaży wymaga pełnej kontroli i własnego kodu, albo Shopify, od szybkiego startu na motywie po custom storefront headless na Next.js.",
        },
        marketplace: {
          number: "03",
          title: "Marketplace i Platformy Multi-Vendor",
          problem: "Chcesz zbudować platformę dla wielu sprzedawców?",
          description: "Marketplace na Medusa.js z własną logiką prowizji, podziałem płatności i zarządzaniem kontami sprzedawców, dopasowany do modelu biznesowego od pierwszej linii kodu.",
        },
        webApps: {
          number: "04",
          title: "Dedykowane Aplikacje Webowe",
          problem: "Żadne gotowe narzędzie nie pasuje do Twojego procesu?",
          description: "Aplikacje webowe i systemy wewnętrzne na Next.js - budowane pod realną logikę biznesową, z architekturą, która rośnie razem z firmą.",
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
      label: "[ 06 - Kontakt ]",
      heading: "Pracujmy razem",
      info: {
        email: { label: "Email", value: "kontakt@appcrates.pl" },
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
        description: "AppCrates - sklepy i marketplace na Medusa.js, strony i aplikacje webowe na Next.js, wdrożenia AI.",
      },
      navigation: "Nawigacja",
      connect: "Połącz się",
      links: {
        email: "Email",
        github: "GitHub",
        linkedin: "LinkedIn",
        blog: "Blog",
        marketplaceGuide: "Przewodnik marketplace",
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
      subtitle: "Notatki z produkcji: Medusa.js, marketplace, e-commerce, Next.js i AI.",
      latestSection: {
        label: "[ 05 - Blog ]",
        heading: "Najnowsze wpisy z bloga",
        subtitle: "Świeże notatki o Medusa.js, e-commerce, AI i decyzjach stojących za nowoczesnymi produktami cyfrowymi.",
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
      externalArticle: "Artykuł",
      contactCta: "Skontaktuj się",
      projects: "Projekty",
      onThisPage: "Na tej stronie",
      previousProject: "Poprzedni projekt",
      nextProject: "Następny projekt",
      allProjects: "Nawigacja po projektach",
      moreTech: "więcej",
      closingTitle: "Potrzebujesz czegoś podobnego?",
      closingText: "Napisz, czego potrzebujesz - dostaniesz konkretny zakres, termin i cenę.",
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
