import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import NextProviders from '@/components/next/NextProviders';
import { DEFAULT_LANGUAGE } from '@/lib/language';
import { siteUrl } from '@/lib/site';
import CookieConsentNew from '@/components/new/CookieConsentNew';
import './globals.css';


export const viewport: Viewport = {
  themeColor: '#140F2D',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AppCrates',
    template: '%s | AppCrates',
  },
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
  robots: 'index, follow',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
    "email": "appcratesdev@gmail.com",
    "location": "Wrocław, Poland",
    "telephone": "+48733433230",
    "priceRange": "$$",
    "areaServed": "Worldwide",
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
    <html lang={DEFAULT_LANGUAGE}>
      <head>
        <link rel="preload" href="/fonts/PlusJakartaSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <Script id="google-tag-bootstrap" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
          `}
        </Script>
        {googleTagId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="afterInteractive" />
            <Script id="google-tag-config" strategy="afterInteractive">
              {`
                gtag('js', new Date());
                gtag('config', '${googleTagId}', {
                  send_page_view: true
                });
              `}
            </Script>
          </>
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      </head>
      <body className="bg-indigo-950 text-white antialiased">
        <NextProviders>
          {children}
          <CookieConsentNew />
        </NextProviders>
      </body>
    </html>
  );
}
