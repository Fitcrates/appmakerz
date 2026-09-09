import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import NextProviders from '@/components/next/NextProviders';
import CookieConsentNew from '@/components/new/CookieConsentNew';
import ScrollBlurOverlay from '@/components/new/ScrollBlurOverlay';
import CursorAura from '@/components/next/CursorAura';
import DeferredChatWidget from '@/components/next/DeferredChatWidget';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isLanguage, type Language } from '@/lib/language';
import { siteUrl } from '@/lib/site';
import { DEFAULT_SOCIAL_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo';
import '../globals.css';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export const viewport: Viewport = {
  themeColor: '#140F2D',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AppCrates',
    template: '%s | AppCrates',
  },
  description: 'AppCrates builds high-performance websites, web applications, AI tools, and headless e-commerce platforms with Next.js and React.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/media/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/media/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/media/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/media/site.webmanifest',
  alternates: {
    languages: {
      en: '/en',
      pl: '/pl',
      // The commercial strategy targets Europe through the English pages, so a
      // visitor whose language matches neither cluster belongs on /en, not /pl.
      'x-default': '/en',
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'AppCrates',
    images: [{
      url: DEFAULT_SOCIAL_IMAGE,
      width: SOCIAL_IMAGE_WIDTH,
      height: SOCIAL_IMAGE_HEIGHT,
      alt: 'AppCrates',
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: 'AppCrates' }],
  },
};

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// This is the site's root layout: every public route lives under /[lang], so
// owning <html> here is what lets `lang` carry the real language into the
// served markup. It used to sit in src/app/layout.tsx, which had no access to
// the route params and therefore hardcoded "pl" onto the English pages too.
export default async function LanguageLayout({ children, params }: LanguageLayoutProps) {
  const { lang } = await params;

  // Deliberately does not call notFound() on an unknown segment. This layout now
  // owns <html>, and throwing here would leave the 404 boundary with no document
  // to render into. Every page under /[lang] validates the segment itself, so an
  // unknown one still 404s — it just does so inside valid markup.
  const language = isLanguage(lang) ? (lang as Language) : DEFAULT_LANGUAGE;
  const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AppCrates",
    "url": "https://appcrates.pl",
    "description": "AppCrates: Websites, landing pages, custom AI Applications, RAG Implementation, Next.js / TanStack Migrations, Web Platforms, and Medusa.js eCommerce development.",
    "inLanguage": ["en", "pl"]
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "AppCrates",
    "url": "https://appcrates.pl",
    "logo": "https://appcrates.pl/media/android-chrome-512x512.png",
    "image": "https://appcrates.pl/media/default-og-image.png",
    "description": "Strony internetowe, landing pages, specjalistyczne wdrażanie aplikacji Web i rozwiązań AI (RAG) w firmach. Modernizacje i migracje systemów na architekturę Next.js i TanStack. Audytowanie pod kątem WCAG / GDPR oraz projektowanie potężnych platform ecommerce i marketplace na Medusa.js i platform typy Headless.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Wrocław",
      "addressCountry": "PL"
    },
    "email": "kontakt@appcrates.pl",
    "location": "Wrocław, Poland",
    "telephone": "+48733433230",
    "priceRange": "$$",
    "areaServed": "Worldwide",
    // sameAs is how Google reconciles this entity with the same operator's
    // profiles elsewhere; founder ties the technical writing on the blog to the
    // business rather than leaving it authored by an unconnected Person.
    "sameAs": [
      "https://github.com/Fitcrates",
      "https://www.linkedin.com/in/arkadiusz-wawrzyniak-5a536015a"
    ],
    "founder": {
      "@type": "Person",
      "name": "Arkadiusz Wawrzyniak",
      "url": "https://appcrates.pl/pl/about-me",
      "jobTitle": "Fullstack Developer",
      "worksFor": { "@type": "Organization", "name": "AppCrates" },
      "sameAs": [
        "https://github.com/Fitcrates",
        "https://www.linkedin.com/in/arkadiusz-wawrzyniak-5a536015a"
      ],
      "knowsAbout": [
        "Medusa.js",
        "Marketplace development",
        "Headless commerce",
        "Next.js",
        "Stripe Connect"
      ]
    },
    "serviceType": [
      "AI Applications & RAG",
      "AI Automation & Implementation",
      "Medusa.js E-Commerce Stores",
      "Medusa.js Marketplaces",
      "Legacy to Next.js Migrations",
      "TanStack Architecture upgrades",
      "Custom Web Platforms",
      "Landing Pages & SEO",
      "WCAG & GDPR Auditing"
    ],
    "knowsAbout": [
      "Artificial Intelligence", "RAG", "LLM", "Next.js", "React", "TanStack", "Medusa.js",
      "Headless Commerce", "WCAG Web Accessibility", "Typescript", "Node.js"
    ]
  };

  return (
    <html lang={language}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preload" href="/fonts/IBM_Plex_Sans/IBMPlexSans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Oxanium-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      </head>
      <body className="bg-indigo-950 text-white antialiased">
        <NextProviders initialLanguage={language}>
          {children}
          <CookieConsentNew />
          <ScrollBlurOverlay />
          <CursorAura />
          <DeferredChatWidget />
        </NextProviders>
        {/* React warns about any literal <script> it renders on the client, and
            this layout re-renders on soft navigation, so the consent defaults go
            through next/script too. It injects outside the React tree.

            afterInteractive runs before the lazyOnload loader below, so the
            consent command is already sitting at the head of dataLayer by the
            time gtag.js starts reading it. */}
        <Script id="google-tag-bootstrap" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        {googleTagId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="lazyOnload" />
            <Script id="google-tag-config" strategy="lazyOnload">
              {`
                gtag('js', new Date());
                gtag('config', '${googleTagId}', {
                  send_page_view: true
                });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
