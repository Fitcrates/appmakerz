// netlify/edge-functions/social-crawler.js
// Dynamic rendering for crawlers: serves bot-friendly HTML for key routes in a Vite SPA.

const BASE_URL = 'https://appcrates.pl';

const BOT_USER_AGENT_PATTERN = /(googlebot|bingbot|duckduckbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|applebot|gptbot|chatgpt-user|claudebot|anthropic-ai|perplexitybot|bytespider|petalbot)/i;

const STATIC_PAGE_META = {
  '/': {
    en: {
      title: 'AppCrates - Fullstack Web Developer | React, Next.js, TypeScript',
      description: 'Fullstack web developer in Poland building modern web applications, e-commerce platforms and custom business solutions for global clients.',
      h1: 'AppCrates - Fullstack Web Development'
    },
    pl: {
      title: 'AppCrates - Programista Fullstack | React, Next.js, TypeScript',
      description: 'Tworze nowoczesne aplikacje webowe, sklepy internetowe i rozwiazania dla firm w Polsce i globalnie.',
      h1: 'AppCrates - Tworzenie aplikacji webowych'
    }
  },
  '/blog': {
    en: {
      title: 'AppCrates Blog - Web Development, React, Next.js',
      description: 'Tutorials, practical guides and insights about React, Next.js, TypeScript and modern web development.',
      h1: 'AppCrates Blog'
    },
    pl: {
      title: 'Blog AppCrates - React, Next.js, Web Development',
      description: 'Poradniki i artykuly o React, Next.js, TypeScript i nowoczesnym tworzeniu stron internetowych.',
      h1: 'Blog AppCrates'
    }
  },
  '/faq': {
    en: {
      title: 'FAQ - AppCrates',
      description: 'Frequently asked questions about AppCrates services, delivery process, and web development collaboration.',
      h1: 'Frequently Asked Questions'
    },
    pl: {
      title: 'FAQ - AppCrates',
      description: 'Najczesciej zadawane pytania o uslugi AppCrates i wspolprace przy projektach webowych.',
      h1: 'Czesto zadawane pytania'
    }
  },
  '/privacy-policy': {
    en: {
      title: 'Privacy Policy - AppCrates',
      description: 'Privacy policy and data processing information for AppCrates website users and clients.',
      h1: 'Privacy Policy'
    },
    pl: {
      title: 'Polityka Prywatnosci - AppCrates',
      description: 'Polityka prywatnosci i informacje o przetwarzaniu danych uzytkownikow AppCrates.',
      h1: 'Polityka prywatnosci'
    }
  },
  '/unsubscribe': {
    en: {
      title: 'Unsubscribe - AppCrates',
      description: 'Manage your newsletter preferences and unsubscribe from AppCrates email updates.',
      h1: 'Unsubscribe from Newsletter'
    },
    pl: {
      title: 'Wypisz sie z newslettera - AppCrates',
      description: 'Zarzadzaj subskrypcja i wypisz sie z newslettera AppCrates.',
      h1: 'Wypisz sie z newslettera'
    }
  }
};

function shouldSkipPath(pathname) {
  if (pathname.startsWith('/.netlify/')) return true;
  if (pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/studio')) return true;
  if (pathname.startsWith('/assets/')) return true;
  if (pathname.startsWith('/media/')) return true;
  if (pathname.startsWith('/fonts/')) return true;
  if (pathname.startsWith('/static/')) return true;
  if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') return true;
  return /\.[a-z0-9]{2,8}$/i.test(pathname);
}

function getLanguage(url, request) {
  const langFromQuery = url.searchParams.get('lang');
  if (langFromQuery === 'pl' || langFromQuery === 'en') {
    return langFromQuery;
  }

  const acceptLanguage = (request.headers.get('accept-language') || '').toLowerCase();
  if (acceptLanguage.startsWith('pl') || acceptLanguage.includes(',pl') || acceptLanguage.includes(';q=pl')) {
    return 'pl';
  }

  return 'en';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function imageUrlFromSanityAsset(source, projectId, dataset) {
  const ref = source?.asset?._ref;
  if (!ref) return null;

  const parts = ref.split('-');
  if (parts.length < 4 || parts[0] !== 'image') return null;

  const id = parts[1];
  const dimensions = parts[2];
  const format = parts[3];
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=1200&h=630&fit=crop&auto=format`;
}

function pickLocalizedValue(field, language) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field[language]) return field[language];
  if (field.en) return field.en;
  if (field.pl) return field.pl;
  return '';
}

function buildHtml({ title, description, canonicalUrl, ogType = 'website', ogImageUrl, h1, jsonLd, language }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl);
  const safeImage = escapeHtml(ogImageUrl || `${BASE_URL}/media/default-og-image.png`);
  const safeH1 = escapeHtml(h1 || title);
  const locale = language === 'pl' ? 'pl_PL' : 'en_US';
  const altLocale = language === 'pl' ? 'en_US' : 'pl_PL';

  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${safeCanonical}" />
  <link rel="alternate" href="${BASE_URL}/?lang=en" hreflang="en" />
  <link rel="alternate" href="${BASE_URL}/?lang=pl" hreflang="pl" />
  <link rel="alternate" href="${BASE_URL}/" hreflang="x-default" />

  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:url" content="${safeCanonical}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:site_name" content="AppCrates" />
  <meta property="og:locale" content="${locale}" />
  <meta property="og:locale:alternate" content="${altLocale}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${safeImage}" />

  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <main>
    <h1>${safeH1}</h1>
    <p>${safeDescription}</p>
  </main>
</body>
</html>`;
}

async function buildDynamicDocumentHtml({ url, path, language, context }) {
  const isBlogPost = path.startsWith('/blog/');
  const isProject = path.startsWith('/project/');
  if (!isBlogPost && !isProject) {
    return null;
  }

  const rawSlug = isBlogPost ? path.replace('/blog/', '') : path.replace('/project/', '');
  const slug = rawSlug.replace(/\/+$/, '').trim();
  if (!slug) return null;

  const projectId = Deno.env.get('SANITY_PROJECT_ID') || context.env.SANITY_PROJECT_ID;
  const dataset = Deno.env.get('SANITY_DATASET') || context.env.SANITY_DATASET || 'production';
  if (!projectId) return null;

  const safeSlug = slug.replace(/"/g, '\\"');
  const query = isBlogPost
    ? `*[_type == "post" && slug.current == "${safeSlug}"][0]{
        title { en, pl },
        slug,
        author->{ name },
        mainImage,
        excerpt { en, pl },
        publishedAt,
        seo {
          metaTitle { en, pl },
          metaDescription { en, pl },
          ogImage,
          noIndex
        }
      }`
    : `*[_type == "project" && slug.current == "${safeSlug}"][0]{
        title { en, pl },
        slug,
        mainImage,
        description { en, pl },
        publishedAt,
        seo {
          metaTitle { en, pl },
          metaDescription { en, pl },
          ogImage,
          noIndex
        }
      }`;

  const sanityUrl = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const response = await fetch(sanityUrl);
  if (!response.ok) return null;

  const data = await response.json();
  const doc = data?.result;
  if (!doc || doc?.seo?.noIndex) return null;

  const title =
    pickLocalizedValue(doc?.seo?.metaTitle, language) ||
    pickLocalizedValue(doc?.title, language) ||
    'AppCrates';

  const description =
    pickLocalizedValue(doc?.seo?.metaDescription, language) ||
    pickLocalizedValue(doc?.excerpt, language) ||
    pickLocalizedValue(doc?.description, language) ||
    'AppCrates web development content.';

  const canonicalUrl = isBlogPost ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/project/${slug}`;
  const ogImageUrl =
    imageUrlFromSanityAsset(doc?.seo?.ogImage, projectId, dataset) ||
    imageUrlFromSanityAsset(doc?.mainImage, projectId, dataset) ||
    `${BASE_URL}/media/default-og-image.png`;

  const jsonLd = isBlogPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: ogImageUrl,
        url: canonicalUrl,
        datePublished: doc?.publishedAt || '',
        author: {
          '@type': 'Person',
          name: doc?.author?.name || 'AppCrates'
        },
        publisher: {
          '@type': 'Organization',
          name: 'AppCrates',
          url: BASE_URL
        },
        inLanguage: language
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: title,
        description,
        image: ogImageUrl,
        url: canonicalUrl,
        author: {
          '@type': 'Organization',
          name: 'AppCrates'
        },
        inLanguage: language
      };

  return buildHtml({
    title,
    description,
    canonicalUrl,
    ogType: isBlogPost ? 'article' : 'website',
    ogImageUrl,
    h1: title,
    jsonLd,
    language
  });
}

function buildStaticDocumentHtml({ path, language }) {
  const config = STATIC_PAGE_META[path];
  if (!config) return null;

  const localized = config[language] || config.en;
  const canonicalUrl = `${BASE_URL}${path === '/' ? '' : path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AppCrates',
    url: canonicalUrl,
    areaServed: 'Worldwide',
    description: localized.description,
    inLanguage: language === 'pl' ? 'pl-PL' : 'en-US'
  };

  return buildHtml({
    title: localized.title,
    description: localized.description,
    canonicalUrl,
    ogType: path === '/' ? 'website' : 'article',
    ogImageUrl: `${BASE_URL}/media/default-og-image.png`,
    h1: localized.h1,
    jsonLd,
    language
  });
}

export default async function(request, context) {
  if (request.method !== 'GET') {
    return context.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  if (!BOT_USER_AGENT_PATTERN.test(userAgent)) {
    return context.next();
  }

  const url = new URL(request.url);
  const path = url.pathname;
  if (shouldSkipPath(path)) {
    return context.next();
  }

  const language = getLanguage(url, request);

  try {
    const dynamicHtml = await buildDynamicDocumentHtml({ url, path, language, context });
    if (dynamicHtml) {
      return new Response(dynamicHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    const staticHtml = buildStaticDocumentHtml({ path, language });
    if (staticHtml) {
      return new Response(staticHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    return context.next();
  } catch (error) {
    console.error('social-crawler edge function error:', error);
    return context.next();
  }
}
