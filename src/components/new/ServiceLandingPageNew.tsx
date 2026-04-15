import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PortableText } from '@portabletext/react';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import HeaderNew from './HeaderNew';
import FooterNew from './FooterNew';
import NotFound from '../NotFound';
import SpotlightText from './SpotlightText';
import BurnSpotlightText from './BurnSpotlightText';
import { useLanguage } from '../../context/LanguageContext';
import { getServiceLanding, urlFor } from '../../lib/sanity.client';
import { portableTextComponentsNew } from './PortableTextComponentsNew';
import type { ServiceLanding } from '../../types/sanity.types';

function normalizePortableTextValue(value: unknown): any[] {
  if (!value) return [];

  const normalize = (input: unknown): any[] => {
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (!trimmed) return [];
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          return normalize(JSON.parse(trimmed));
        } catch {
          return [{
            _type: 'block',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', text: trimmed, marks: [] }],
          }];
        }
      }
      return [{
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', text: trimmed, marks: [] }],
      }];
    }

    if (!Array.isArray(input)) return [];

    return input
      .map((item: any) => {
        if (!item || typeof item !== 'object') return null;
        if (item._type === 'image') return item;
        if (item._type !== 'block') return null;

        const children = Array.isArray(item.children)
          ? item.children
              .map((child: any) => {
                if (!child || child._type !== 'span') return null;
                const text = typeof child.text === 'string'
                  ? child.text
                  : child.text == null
                    ? ''
                    : JSON.stringify(child.text);
                return { ...child, text, marks: Array.isArray(child.marks) ? child.marks : [] };
              })
              .filter(Boolean)
          : [];

        if (!children.length) return null;

        return {
          ...item,
          _type: 'block',
          style: typeof item.style === 'string' ? item.style : 'normal',
          markDefs: Array.isArray(item.markDefs) ? item.markDefs : [],
          children,
        };
      })
      .filter(Boolean);
  };

  return normalize(value);
}

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group"
      >
        <h3 className="text-white font-jakarta font-medium text-lg group-hover:text-teal-300 transition-colors">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-white/60 font-jakarta font-light pb-6 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const ServiceLandingPageNew: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landing, setLanding] = useState<ServiceLanding | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLanding = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getServiceLanding(slug);

        if (!isMounted) return;

        if (!data?._id) {
          setError('Service page not found');
          setLanding(null);
        } else {
          setLanding(data as ServiceLanding);
        }
      } catch {
        if (isMounted) {
          setError('Failed to load service page');
          setLanding(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchLanding();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const title = useMemo(() => {
    if (!landing?.title) return '';
    return landing.title[language] || landing.title.en || landing.title.pl || '';
  }, [landing, language]);

  const eyebrow = useMemo(() => {
    if (!landing?.eyebrow) return language === 'pl' ? 'Usługa' : 'Service';
    return landing.eyebrow[language] || landing.eyebrow.en || landing.eyebrow.pl || '';
  }, [landing, language]);

  const intro = useMemo(() => {
    if (!landing?.intro) return '';
    return landing.intro[language] || landing.intro.en || landing.intro.pl || '';
  }, [landing, language]);

  const ctaLabel = useMemo(() => {
    if (!landing?.ctaLabel) return language === 'pl' ? 'Porozmawiajmy o projekcie' : 'Let’s talk about your project';
    return landing.ctaLabel[language] || landing.ctaLabel.en || landing.ctaLabel.pl || '';
  }, [landing, language]);

  const problems = useMemo(() => {
    if (!landing?.problems) return [];
    return landing.problems[language] || landing.problems.en || landing.problems.pl || [];
  }, [landing, language]);

  const deliverables = useMemo(() => {
    if (!landing?.deliverables) return [];
    return landing.deliverables[language] || landing.deliverables.en || landing.deliverables.pl || [];
  }, [landing, language]);

  const processSteps = useMemo(() => {
    if (!landing?.processSteps) return [];
    return landing.processSteps[language] || landing.processSteps.en || landing.processSteps.pl || [];
  }, [landing, language]);

  const faq = useMemo(() => {
    if (!landing?.faq) return [];
    return landing.faq[language] || landing.faq.en || landing.faq.pl || [];
  }, [landing, language]);

  const richContent = useMemo(() => {
    if (!landing?.content) return [];
    const raw = landing.content[language] || landing.content.en || landing.content.pl || [];
    return normalizePortableTextValue(raw);
  }, [landing, language]);

  const stats = useMemo(() => {
    if (!landing?.stats) return [];
    return landing.stats[language] || landing.stats.en || landing.stats.pl || [];
  }, [landing, language]);

  const ctaSecondaryLabel = useMemo(() => {
    if (!landing?.ctaSecondaryLabel) return language === 'pl' ? 'Zobacz projekty' : 'View projects';
    return landing.ctaSecondaryLabel[language] || landing.ctaSecondaryLabel.en || landing.ctaSecondaryLabel.pl || (language === 'pl' ? 'Zobacz projekty' : 'View projects');
  }, [landing, language]);

  const seoTitle = landing?.seo?.metaTitle?.[language] || landing?.seo?.metaTitle?.en || title;
  const seoDescription = landing?.seo?.metaDescription?.[language] || landing?.seo?.metaDescription?.en || intro;

  const heroImageUrl = landing?.heroImage ? urlFor(landing.heroImage).width(1600).auto('format').url() : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-950 text-white flex items-center justify-center font-jakarta">
        <span className="text-white/50">Loading...</span>
      </div>
    );
  }

  if (error || !landing) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {landing?.seo?.keywords?.length ? (
          <meta name="keywords" content={landing.seo.keywords.join(', ')} />
        ) : null}
        {landing?.seo?.canonicalUrl ? <link rel="canonical" href={landing.seo.canonicalUrl} /> : null}
        {landing?.seo?.noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      </Helmet>

      <HeaderNew />

      <main ref={mainRef} className="min-h-screen bg-indigo-950">
       

        {/* ===== HERO ===== */}
        <section ref={heroRef} className="relative min-h-[60vh] lg:min-h-[75vh] flex items-end overflow-hidden ">
          
          {heroImageUrl ? (
            <div className="absolute inset-0 z-0">
              
              <img
                src={heroImageUrl}
                alt=""
                role="presentation"
                className="w-full h-full object-cover opacity-25"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/60 to-indigo-950/40" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-indigo-950" />
          )}
          

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 mt-20 w-full">

            <span className="text-xs tracking-[0.3em] uppercase text-teal-300/80 font-jakarta">
              {eyebrow}
            </span>
           

            <div className="max-w-4xl">
              <BurnSpotlightText as="h1" className="text-4xl sm:text-5xl lg:text-7xl font-light text-white font-jakarta leading-tight" glowSize={200} baseDelay={200} charDelay={25}>
                {title}
              </BurnSpotlightText>
            </div>

            {intro ? (
              <div className="mt-8 max-w-2xl">
                <SpotlightText as="p" className="text-white/60 text-lg sm:text-xl font-jakarta font-light leading-relaxed" glowSize={150}>
                  {intro}
                </SpotlightText>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="/#contact"
                className="group relative px-10 py-5 bg-teal-300 text-indigo-950 font-jakarta font-medium overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] text-center focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
              >
                <span className="relative z-10">{ctaLabel}</span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </a>
              <a
                href="/#projects"
                className="group px-10 py-5 border border-white/20 text-white font-jakarta font-medium hover:border-teal-300 transition-all duration-500 relative overflow-hidden text-center focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
              >
                <span className="relative z-10 group-hover:text-indigo-950 transition-colors duration-500">
                  {ctaSecondaryLabel}
                </span>
                <div className="absolute inset-0 bg-teal-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </a>
            </div>
          </div>

          <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10 z-10 hidden lg:block" aria-hidden="true" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10 z-10 hidden lg:block" aria-hidden="true" />
        </section>

        {/* ===== STATS BAR ===== */}
        {stats.length > 0 ? (
          <section className="border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map((stat: { value: string; label: string }, index: number) => (
                  <div
                    key={`stat-${index}`}
                    className={`py-8 lg:py-10 px-6 ${index > 0 ? 'border-l border-white/10' : ''}`}
                  >
                    <p className="text-3xl sm:text-4xl font-light text-teal-300 font-jakarta notranslate">
                      {stat.value}
                    </p>
                    <p className="text-white/50 font-jakarta text-sm mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== PROBLEMS ===== */}
        {problems.length > 0 ? (
          <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
                {language === 'pl' ? 'Brzmi znajomo?' : 'Sound familiar?'}
              </span>
              <div className="mt-4 mb-12 max-w-3xl">
                <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-jakarta" glowSize={180} baseDelay={100} charDelay={30}>
                  {language === 'pl' ? 'Problemy, które rozwiązuję' : 'Problems I solve'}
                </BurnSpotlightText>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {problems.map((item: string, index: number) => (
                  <div
                    key={`prob-${index}`}
                    className="group border border-white/10 p-6 sm:p-8 hover:border-teal-300/30 transition-all duration-300 bg-white/[0.02]"
                  >
                    <div className="relative w-8 h-8 rounded-full bg-red-400/10 border border-red-400 flex items-center justify-center mb-4 overflow-hidden">
                      <span className="text-[0.82rem] text-red-400 font-jakarta font-medium tracking-wider notranslate relative z-10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/40 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
                    </div>
                    <SpotlightText as="p" className="text-white/80 font-jakarta font-light leading-relaxed" glowSize={120}>
                      {item}
                    </SpotlightText>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== DELIVERABLES ===== */}
        {deliverables.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                <div>
                  <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
                    {language === 'pl' ? 'W pakiecie' : "What's included"}
                  </span>
                  <div className="mt-4 mb-8">
                    <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-jakarta" glowSize={180} baseDelay={100} charDelay={30}>
                      {language === 'pl' ? 'Co dostajesz' : 'What you get'}
                    </BurnSpotlightText>
                  </div>
                  <a
                    href="/#contact"
                    className="group inline-flex items-center gap-4"
                  >
                    <span className="text-lg text-white font-jakarta group-hover:text-teal-300 transition-colors">
                      <SpotlightText glowSize={100}>{ctaLabel}</SpotlightText>
                    </span>
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-indigo-950 transition-colors" />
                    </div>
                  </a>
                </div>
                <div>
                  {deliverables.map((item: string, index: number) => (
                    <div
                      key={`del-${index}`}
                      className="flex items-start gap-4 py-5 border-b border-white/10"
                    >
                      <div className="relative w-6 h-6 rounded-full bg-teal-300/10 border border-teal-300/30 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        <Check className="w-3.5 h-3.5 text-teal-300 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-300/50 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
                      </div>
                      <SpotlightText as="p" className="text-white/70 font-jakarta font-light leading-relaxed" glowSize={120}>
                      {item}
                    </SpotlightText>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== PROCESS ===== */}
        {processSteps.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
                  {language === 'pl' ? 'Jak pracuję' : 'How I work'}
                </span>
                <div className="mt-4">
                  <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-jakarta" glowSize={180} baseDelay={100} charDelay={30}>
                    {language === 'pl' ? 'Proces współpracy' : 'Process'}
                  </BurnSpotlightText>
                </div>
              </div>
              <div className="relative">
                <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-teal-300/20 to-transparent overflow-visible" aria-hidden="true">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-teal-300 to-transparent animate-[pulse-line_8s_ease-in-out_infinite] blur-[2px]" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {processSteps.map((step: string, index: number) => (
                    <div key={`step-${index}`} className="relative group">
                      <div className="absolute -top-4 -left-3 w-8 h-8 rounded-full bg-indigo-950 border border-teal-300/30 flex items-center justify-center z-10">
                        <span className="text-teal-300 text-xs font-jakarta font-medium notranslate">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-teal-300/30 transition-all duration-500 h-full group-hover:bg-white/[0.06]">
                        <SpotlightText as="p" className="text-white/75 font-jakarta font-light leading-relaxed mt-2" glowSize={100}>
                        {step}
                      </SpotlightText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== RICH CONTENT ===== */}
        {richContent.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-invert max-w-none">
                <PortableText value={richContent} components={portableTextComponentsNew} />
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== FAQ ===== */}
        {faq.length > 0 ? (
          <section className="py-20 lg:py-24 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
           
                <div className="mt-4">
                  <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl font-light text-white font-jakarta" glowSize={180} baseDelay={100} charDelay={30}>
                    {language === 'pl' ? 'Często zadawane pytania' : 'Frequently asked questions'}
                  </BurnSpotlightText>
                </div>
              </div>
              <div className="border-t border-white/10">
                {faq.map((item, index) => (
                  <FaqItem key={`faq-${index}`} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== BOTTOM CTA ===== */}
        <section className="py-20 lg:py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <BurnSpotlightText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-jakarta" glowSize={200} baseDelay={100} charDelay={30}>
                {language === 'pl' ? 'Gotowy, żeby zacząć?' : 'Ready to get started?'}
              </BurnSpotlightText>
            </div>
            <div className="mb-10 max-w-2xl mx-auto">
              <SpotlightText as="p" className="text-white/50 font-jakarta font-light text-lg" glowSize={150}>
                {language === 'pl'
                  ? 'Porozmawiajmy o Twoim projekcie. Bezpłatna konsultacja, bez zobowiązań.'
                  : "Let's talk about your project. Free consultation, no obligations."}
              </SpotlightText>
            </div>
            <a
              href="/#contact"
              className="group relative inline-block px-12 py-5 bg-teal-300 text-indigo-950 font-jakarta font-medium overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-indigo-950"
            >
              <span className="relative z-10">{ctaLabel}</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </a>
          </div>
        </section>
      </main>

      <FooterNew />
    </>
  );
};

export default ServiceLandingPageNew;
