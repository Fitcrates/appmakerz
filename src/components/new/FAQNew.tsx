import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import HeaderNew from './HeaderNew';
import FooterNew from './FooterNew';

const FAQNew: React.FC = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [searchQuery, setSearchQuery] = useState('');

  const content = {
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Answers to help you understand what I do and how I can help your business grow.',
      faqs: [
        {
          question: 'What exactly do you do?',
          answer: 'I design and build premium web applications, modern marketing websites, and custom e-commerce platforms. I handle the full process end-to-end: strategy, UI/UX, front-end, back-end, integrations, optimization, and launch.'
        },
        {
          question: 'How can you help my business?',
          answer: 'I help businesses turn ideas into fast, scalable digital products that generate leads, streamline operations, and improve the customer experience. That can mean a conversion-focused landing page, an internal business tool, a custom marketplace, or a content-driven website built to support long-term growth.'
        },
        {
          question: 'Do you only build websites, or full web applications too?',
          answer: 'Both. I build classic business websites and portfolio pages, but I also create more advanced products such as SaaS-style applications, custom dashboards, AI-assisted tools, booking systems, and e-commerce platforms with custom business logic.'
        },
        {
          question: 'Can you build custom e-commerce or marketplace solutions?',
          answer: 'Yes. If your business needs something beyond a standard template shop, I can build custom e-commerce systems and multivendor marketplace solutions tailored to your workflow, product structure, vendors, and growth goals.'
        },
        {
          question: 'Where are you based and do you work with international clients?',
          answer: 'I am based in Wrocław, Poland, but I work with clients globally. Most of my projects are handled fully remotely, which allows for efficient collaboration regardless of location.'
        },
        {
          question: 'Do you offer on-site consultations or AI implementations locally?',
          answer: 'Yes — for businesses in Wrocław and the Lower Silesia region, I offer on-site consultations and hands-on AI implementations. This includes analyzing workflows, identifying automation opportunities, and implementing solutions such as internal AI tools or RAG-based systems directly within your company environment.'
        },
        {
          question: 'Does AI actually make sense for my business?',
          answer: 'Not always — and that is the honest answer. AI only makes sense when it solves a real problem or saves time and money. I start by analyzing your workflows and only then propose specific solutions. In many cases, simple automations bring more value than forcing AI into places where it is not needed.'
        },
        {
          question: 'Do you work with Headless CMS?',
          answer: 'Yes. Headless CMS is a great solution when you want a high-performance website with easy content management on the client side. It gives you more flexibility, better scalability, cleaner architecture, and a much better foundation for future expansion than many traditional setups.'
        },
        {
          question: 'Can you integrate AI into a product without blowing up the budget?',
          answer: 'Yes — and that is exactly the right way to approach it. I focus on practical AI implementations that solve a real business problem instead of forcing AI into everything just because it is trendy. The goal is to improve workflows, user experience, or automation in a way that actually makes financial sense.'
        },
        {
          question: 'What technologies and frameworks do you use?',
          answer: 'My core stack is based on modern JavaScript and TypeScript. I mainly work with React, Next.js, Vite, Bun, Node.js, and headless CMS solutions such as Sanity. For polished interfaces and smooth interactions, I also use tools like Framer Motion and build custom UI systems tailored to the project.'
        },
        {
          question: 'Do you create custom UI/UX or work from ready-made templates?',
          answer: 'I strongly prefer custom design work. Templates may be fast, but they rarely reflect the quality, character, and strategic goals of a serious brand. I build interfaces that are aligned with the product, the audience, and the business objective — not generic layouts dressed up with nicer colors.'
        },
        {
          question: 'Can you build visually advanced landing pages or portfolio websites?',
          answer: 'Absolutely. I create high-end landing pages and portfolio experiences with strong visual direction, refined motion, premium typography, and modern frontend execution. These projects are designed not just to look good, but to leave a memorable impression and support conversions.'
        },
        {
          question: 'Do you care about performance and loading speed?',
          answer: 'Very much. Performance is not an afterthought in my process. I build with clean architecture, optimized assets, sensible animation strategies, and modern rendering techniques so the final product feels fast, smooth, and reliable across devices.'
        },
        {
          question: 'Do you optimize websites for SEO and AI search engines?',
          answer: 'Absolutely. My projects are built with strong technical SEO foundations: semantic HTML, SSR where needed, structured data, performance optimization, and clean information architecture. This helps with Google visibility and also makes the site easier to interpret by modern AI-driven discovery tools.'
        },
        {
          question: 'Can you improve or extend an existing application?',
          answer: 'It depends on the technology stack. I work most efficiently with modern JavaScript/TypeScript-based applications (React, Next.js, Node.js). In those cases, I can improve architecture, add features, and optimize performance. For older stacks like PHP or Angular, I evaluate each project individually — sometimes it makes more sense to rebuild key parts instead of forcing changes into outdated architecture.'
        },
        {
          question: 'Do you build admin panels or custom internal tools?',
          answer: 'Yes. Not every valuable product is public-facing. I also build internal systems, panels, and process-oriented tools that help companies save time, reduce repetitive work, and organize operations more efficiently.'
        },
        {
          question: 'How long does a custom web project usually take?',
          answer: 'It depends on scope and complexity. A premium landing page or company website may take around 2–4 weeks. A more advanced web application, marketplace, or custom e-commerce system can take anywhere from several weeks to a few months. Before development starts, I estimate the scope as precisely as possible.'
        },
        {
          question: 'Do you offer ongoing support and maintenance?',
          answer: 'Yes. I work with clients long-term, which means I can continue improving, maintaining, and scaling the system after launch. This includes updates, security, bug fixing, feature expansion, and technical guidance as the business grows.'
        },
        {
          question: 'Who are your services best suited for?',
          answer: 'My services are best suited for businesses and founders who need something more thoughtful than a generic page builder result. If you care about quality, performance, scalability, visual impact, and a solution tailored to your business model, we will probably work very well together.'
        }
      ]
    },

    pl: {
      title: 'Często zadawane pytania',
      subtitle: 'Odpowiedzi, które pomogą Ci zrozumieć czym się zajmuję i jak mogę pomóc Twojej firmie.',
      faqs: [
        {
          question: 'Czym dokładnie się zajmujesz?',
          answer: 'Projektuję i tworzę nowoczesne strony internetowe, aplikacje webowe premium oraz dedykowane platformy e-commerce. Prowadzę cały proces end-to-end: od strategii i UI/UX, przez front-end i back-end, aż po integracje, optymalizację i wdrożenie.'
        },
        {
          question: 'W czym możesz pomóc mojej firmie?',
          answer: 'Pomagam firmom zamieniać pomysły w szybkie, skalowalne produkty cyfrowe, które wspierają sprzedaż, automatyzują procesy i poprawiają doświadczenie klientów. Może to być skuteczny landing page, narzędzie wewnętrzne, dedykowany marketplace albo rozbudowana strona oparta o content i SEO.'
        },
        {
          question: 'Czy tworzysz tylko strony internetowe, czy również pełne aplikacje webowe?',
          answer: 'Jedno i drugie. Realizuję klasyczne strony firmowe i portfolio, ale też bardziej zaawansowane produkty, takie jak aplikacje typu SaaS, panele administracyjne, narzędzia wspierane AI, systemy rezerwacji czy e-commerce z niestandardową logiką biznesową.'
        },
        {
          question: 'Czy możesz stworzyć dedykowany sklep internetowy albo marketplace?',
          answer: 'Tak. Jeśli Twój biznes potrzebuje czegoś więcej niż gotowego szablonu sklepu, mogę zaprojektować i wdrożyć dedykowany e-commerce lub platformę marketplace dopasowaną do Twojego modelu działania, produktów, sprzedawców i planów rozwoju.'
        },
        {
          question: 'Gdzie się znajdujesz i czy pracujesz z klientami zagranicznymi?',
          answer: 'Na co dzień działam we Wrocławiu, ale współpracuję z klientami z całego świata. Większość projektów realizuję w pełni zdalnie, co pozwala sprawnie prowadzić współpracę niezależnie od lokalizacji.'
        },
        {
          question: 'Czy oferujesz konsultacje i wdrożenia AI na miejscu?',
          answer: 'Tak — dla firm z Wrocławia i Dolnego Śląska oferuję konsultacje oraz wdrożenia na miejscu. Mogę przyjechać do firmy, przeanalizować procesy, znaleźć miejsca do automatyzacji i wdrożyć rozwiązania takie jak wewnętrzne narzędzia AI czy systemy RAG dopasowane do realnych potrzeb biznesu.'
        },
        {
          question: 'Czy AI ma sens w mojej firmie?',
          answer: 'Nie zawsze — i to jest uczciwa odpowiedź. AI ma sens tylko wtedy, gdy realnie rozwiązuje problem lub oszczędza czas i pieniądze. Dlatego najpierw analizuję procesy w firmie, a dopiero potem proponuję konkretne wdrożenia. W wielu przypadkach proste automatyzacje dają większy efekt niż „modne” rozwiązania AI wdrażane na siłę.'
        },
        {
          question: 'Czy pracujesz z Headless CMS?',
          answer: 'Tak. Headless CMS to świetne rozwiązanie dla firm, które chcą połączyć bardzo dobrą wydajność strony z wygodnym zarządzaniem treścią. Daje większą elastyczność, lepszą skalowalność, czystszą architekturę i dużo mocniejszą bazę do dalszego rozwoju niż wiele klasycznych rozwiązań.'
        },
        {
          question: 'Czy wdrażasz AI do aplikacji bez przepalania budżetu?',
          answer: 'Tak — i właśnie tak powinno się do tego podchodzić. Stawiam na praktyczne wdrożenia AI, które rozwiązują realny problem biznesowy, zamiast wrzucać sztuczną inteligencję wszędzie tylko dlatego, że jest modna. Liczy się sens, zwrot z inwestycji i konkretna wartość dla użytkownika lub zespołu.'
        },
        {
          question: 'Z jakich technologii i frameworków korzystasz?',
          answer: 'Pracuję głównie w oparciu o nowoczesny ekosystem JavaScript i TypeScript. Najczęściej wykorzystuję React, Next.js, Vite, Bun, Node.js oraz rozwiązania Headless CMS, takie jak Sanity. Do dopracowanych interfejsów i płynnych mikrointerakcji używam też narzędzi takich jak Framer Motion oraz tworzę własne systemy UI pod konkretny projekt.'
        },
        {
          question: 'Czy projektujesz własny UI/UX, czy pracujesz na gotowych template’ach?',
          answer: 'Zdecydowanie wolę rozwiązania szyte na miarę. Template może być szybki, ale bardzo rzadko dobrze oddaje charakter marki, jakość oferty i cele biznesowe. Tworzę interfejsy dopasowane do produktu, odbiorcy i strategii, a nie generyczne layouty przebrane za „premium”.'
        },
        {
          question: 'Czy tworzysz bardziej efektowne, premium landing page’e i strony portfolio?',
          answer: 'Tak. Realizuję landing page’e i strony portfolio z mocnym kierunkiem wizualnym, dopracowanym ruchem, dobrą typografią i nowoczesnym frontendem. Tego typu projekty mają nie tylko dobrze wyglądać, ale też budować zapamiętywalność marki i realnie wspierać konwersję.'
        },
        {
          question: 'Czy dbasz o wydajność i szybkość działania strony?',
          answer: 'Bardzo. Wydajność nie jest u mnie dodatkiem na końcu projektu. Projektuję rozwiązania w oparciu o czystą architekturę, zoptymalizowane assety, rozsądne podejście do animacji i nowoczesne techniki renderowania, żeby finalny produkt działał szybko i płynnie na różnych urządzeniach.'
        },
        {
          question: 'Czy pomagasz w pozycjonowaniu SEO i optymalizacji pod AI?',
          answer: 'Tak. Moje projekty mają mocne fundamenty technicznego SEO: semantyczny HTML, SSR tam, gdzie ma to sens, dane strukturalne, dobrą wydajność i przemyślaną architekturę informacji. Dzięki temu strona lepiej radzi sobie w Google i jest łatwiejsza do zrozumienia przez nowoczesne narzędzia oparte na AI.'
        },
        {
          question: 'Czy możesz wejść do istniejącego projektu i go rozwinąć?',
          answer: 'To zależy od technologii. Najlepiej pracuję z nowoczesnymi aplikacjami opartymi o JavaScript/TypeScript (React, Next.js, Node.js). W takich projektach mogę rozwijać funkcje, poprawiać architekturę i wydajność. W przypadku starszych technologii, takich jak PHP czy Angular, każdy projekt oceniam indywidualnie — często bardziej opłaca się przebudować kluczowe elementy niż na siłę rozwijać przestarzałą strukturę.'
        },
        {
          question: 'Czy tworzysz panele administracyjne i narzędzia wewnętrzne dla firm?',
          answer: 'Tak. Nie każdy wartościowy produkt jest skierowany do klienta końcowego. Tworzę również systemy wewnętrzne, dashboardy i narzędzia operacyjne, które pomagają firmom oszczędzać czas, ograniczać powtarzalną pracę i lepiej organizować procesy.'
        },
        {
          question: 'Ile czasu trwa realizacja strony lub aplikacji?',
          answer: 'To zależy od zakresu i poziomu złożoności. Premium landing page lub strona firmowa to zwykle około 2–4 tygodnie. Bardziej zaawansowana aplikacja webowa, marketplace albo dedykowany e-commerce może zająć od kilku tygodni do kilku miesięcy. Przed startem zawsze dokładnie określam zakres i estymację.'
        },
        {
          question: 'Czy oferujesz wsparcie i opiekę techniczną po wdrożeniu?',
          answer: 'Tak. Stawiam na współpracę długoterminową, więc po wdrożeniu mogę dalej rozwijać, utrzymywać i skalować system. Obejmuje to aktualizacje, bezpieczeństwo, poprawki błędów, rozbudowę funkcji i doradztwo techniczne wraz ze wzrostem Twojego biznesu.'
        },
        {
          question: 'Dla kogo najlepiej sprawdzi się współpraca ze mną?',
          answer: 'Najwięcej zyskają firmy i founderzy, którzy potrzebują czegoś lepszego niż efekt z gotowego page buildera. Jeśli zależy Ci na jakości, wydajności, skalowalności, mocnym wrażeniu wizualnym i rozwiązaniu dopasowanym do modelu biznesowego, najpewniej dogadamy się bardzo dobrze.'
        }
      ]
    }
  };

  const t = content[language];

  const filteredFaqs = t.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-indigo-950">
      <HeaderNew />

      <main className="pt-32 pb-24">
        <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center text-white/40 hover:text-teal-300 transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-jakarta text-sm">{language === 'pl' ? 'Wróć do strony głównej' : 'Back to Home'}</span>
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">

              <span className="text-xs text-white/30 font-jakarta tracking-widest uppercase">
                {language === 'pl' ? 'Baza wiedzy' : 'Knowledge Base'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white font-jakarta mb-4">
              {t.title}
            </h1>
            <p className="text-white/60 font-jakarta max-w-xl text-lg">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'pl' ? 'Szukaj pytań i odpowiedzi...' : 'Search questions and answers...'}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 font-jakarta text-base py-4 pl-12 pr-4 focus:outline-none focus:border-teal-300/50 transition-colors"
            />
          </motion.div>

          {/* FAQ Accordion */}
          <div className="border-t border-white/10">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <FAQAccordionItem key={index} faq={faq} index={index} isInView={isInView} />
              ))
            ) : (
              <div className="text-white/40 font-jakarta py-8 text-center">
                {language === 'pl' ? 'Nie znaleziono pasujących pytań.' : 'No matching questions found.'}
              </div>
            )}
          </div>

          {/* SEO Hidden Structured Data - Crucial for Google indexing */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": t.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        </div>
      </main>

      <FooterNew />
    </div>
  );
};

const FAQAccordionItem: React.FC<{ faq: { question: string; answer: string }; index: number; isInView: boolean }> = ({ faq, index, isInView }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group"
      >
        <h3 className="text-white font-jakarta text-lg group-hover:text-teal-300 transition-colors">{faq.question}</h3>
        <ChevronDown className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-white/60 font-jakarta font-light pb-6 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQNew;
