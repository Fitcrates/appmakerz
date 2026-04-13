import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PortableText } from '@portabletext/react';
import { ArrowUpRight } from 'lucide-react';
import HeaderNew from './HeaderNew';
import FooterNew from './FooterNew';
import NotFound from '../NotFound';
import { useLanguage } from '../../context/LanguageContext';
import { getAboutMe, urlFor } from '../../lib/sanity.client';
import { portableTextComponentsNew } from './PortableTextComponentsNew';
import type { AboutMe } from '../../types/sanity.types';

const AboutMePageNew: React.FC = () => {
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [about, setAbout] = useState<AboutMe | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAboutMe('about-me');

        if (!isMounted) return;

        if (!data?._id) {
          setError(language === 'pl' ? 'Nie znaleziono strony O mnie' : 'About me page not found');
          setAbout(null);
        } else {
          setAbout(data as AboutMe);
        }
      } catch {
        if (isMounted) {
          setError(language === 'pl' ? 'Nie udało się załadować strony O mnie' : 'Failed to load about me page');
          setAbout(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchAbout();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const title = useMemo(() => {
    if (!about?.title) return language === 'pl' ? 'O mnie' : 'About me';
    return about.title[language] || about.title.en || about.title.pl || (language === 'pl' ? 'O mnie' : 'About me');
  }, [about, language]);

  const eyebrow = useMemo(() => {
    if (!about?.eyebrow) return language === 'pl' ? 'O mnie' : 'About me';
    return about.eyebrow[language] || about.eyebrow.en || about.eyebrow.pl || (language === 'pl' ? 'O mnie' : 'About me');
  }, [about, language]);

  const intro = useMemo(() => {
    if (!about?.intro) return '';
    return about.intro[language] || about.intro.en || about.intro.pl || '';
  }, [about, language]);

  const story = useMemo(() => {
    if (!about?.story) return [];
    return about.story[language] || about.story.en || about.story.pl || [];
  }, [about, language]);

  const highlights = useMemo(() => {
    if (!about?.highlights) return [];
    return about.highlights[language] || about.highlights.en || about.highlights.pl || [];
  }, [about, language]);

  const ctaProjects = useMemo(() => {
    if (!about?.ctaProjects) return language === 'pl' ? 'Zobacz projekty' : 'View projects';
    return about.ctaProjects[language] || about.ctaProjects.en || about.ctaProjects.pl || (language === 'pl' ? 'Zobacz projekty' : 'View projects');
  }, [about, language]);

  const ctaContact = useMemo(() => {
    if (!about?.ctaContact) return language === 'pl' ? 'Skontaktuj się' : 'Get in touch';
    return about.ctaContact[language] || about.ctaContact.en || about.ctaContact.pl || (language === 'pl' ? 'Skontaktuj się' : 'Get in touch');
  }, [about, language]);

  const seoTitle = about?.seo?.metaTitle?.[language] || about?.seo?.metaTitle?.en || title;
  const seoDescription = about?.seo?.metaDescription?.[language] || about?.seo?.metaDescription?.en || intro;
  const canonicalUrl = about?.seo?.canonicalUrl || `${window.location.origin}/about-me`;

  const heroImageUrl = about?.heroImage ? urlFor(about.heroImage).width(1800).auto('format').url() : '';
  const ogImageUrl = about?.seo?.ogImage
    ? urlFor(about.seo.ogImage).width(1200).height(630).fit('crop').auto('format').url()
    : heroImageUrl;

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Arkadiusz Wawrzyniak',
      url: canonicalUrl,
      image: heroImageUrl || undefined,
      jobTitle: 'Fullstack Developer',
      description: seoDescription || undefined,
      sameAs: [],
    }),
    [canonicalUrl, heroImageUrl, seoDescription]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-950 text-white flex items-center justify-center font-jakarta">
        <span className="text-white/50">Loading...</span>
      </div>
    );
  }

  if (error || !about) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {about?.seo?.keywords?.length ? <meta name="keywords" content={about.seo.keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
        {about?.seo?.noIndex ? (
          <meta name="robots" content="noindex,nofollow" />
        ) : (
          <meta name="robots" content="index,follow,max-image-preview:large" />
        )}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={seoTitle} />
        {seoDescription && <meta property="og:description" content={seoDescription} />}
        <meta property="og:url" content={canonicalUrl} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        {seoDescription && <meta name="twitter:description" content={seoDescription} />}
        {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <HeaderNew />

      <main className="min-h-screen bg-indigo-950 pt-16 lg:pt-24 pb-24">

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/10 pt-10 sm:pt-14">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white font-jakarta leading-tight mt-4">{title}</h1>
            {intro ? (
              <p className="text-white/60 text-lg font-jakarta font-light mt-8 leading-relaxed">{intro}</p>
            ) : null}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left column: Cards */}
            <div className="space-y-6 order-2 lg:order-1">
              {highlights.length ? (
                <div className="border border-white/10 p-6 sm:p-8 bg-white/[0.02]">
                  <h2 className="text-2xl font-light text-white font-jakarta mb-5">
                    {language === 'pl' ? 'Najważniejsze' : 'Highlights'}
                  </h2>
                  <ul className="space-y-3">
                    {highlights.map((item: string, index: number) => (
                      <li key={`${item}-${index}`} className="text-white/70 font-jakarta font-light flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-teal-300 rounded-full mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="border border-white/10 p-6 sm:p-8 bg-white/[0.02]">
                <h3 className="text-white font-jakarta text-xl font-light mb-6">
                  {language === 'pl' ? 'Przejdź dalej' : 'Continue exploring'}
                </h3>
                <div className="flex flex-col space-y-4">
                  <a
                    href="/#projects"
                    className="group inline-flex items-center gap-3 text-white font-jakarta hover:text-teal-300 transition-colors"
                  >
                    <span>{ctaProjects}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href="/#contact"
                    className="group inline-flex items-center gap-3 text-white font-jakarta hover:text-teal-300 transition-colors"
                  >
                    <span>{ctaContact}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right column: Photo with decorations */}
            {heroImageUrl ? (
              <div className="order-1 lg:order-2 lg:sticky lg:top-28">
                <div className="relative w-full max-w-sm mx-auto lg:max-w-none aspect-[4/5]">
                  <div className="absolute inset-0 overflow-hidden border border-white/10 bg-white/[0.02]">
                    <img
                      src={heroImageUrl}
                      alt={about.heroImage?.alt || title}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 w-full h-full border border-teal-300/20 pointer-events-none" aria-hidden="true" />
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-teal-300 pointer-events-none" aria-hidden="true" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-teal-300 pointer-events-none" aria-hidden="true" />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {story.length ? (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-20">
            <article className="prose prose-invert max-w-none text-left">
              <PortableText value={story as any} components={portableTextComponentsNew as any} />
            </article>
          </section>
        ) : null}

      </main>

      <FooterNew />
    </>
  );
};

export default AboutMePageNew;