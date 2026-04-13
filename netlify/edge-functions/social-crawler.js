// netlify/edge-functions/social-crawler.js
// Dynamic rendering for crawlers: serves bot-friendly HTML for key routes in a Vite SPA.

const BASE_URL = 'https://appcrates.pl';
const DEFAULT_SANITY_PROJECT_ID = '867nk643';
const DEFAULT_SANITY_DATASET = 'production';

const BOT_USER_AGENT_PATTERNS = [
  'googlebot',
  'google-inspectiontool',
  'googleother',
  'adsbot-google',
  'bingbot',
  'duckduckbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'discordbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'gptbot',
  'chatgpt-user',
  'claude-user',
  'claudebot',
  'claude-web',
  'anthropic',
  'perplexitybot',
  'bytespider',
  'petalbot',
  'python-requests',
  'curl/',
  'wget/',
  'go-http-client',
  'node-fetch',
  'axios/'
];

function isBotUserAgent(userAgent) {
  const ua = (userAgent || '').toLowerCase();
  return BOT_USER_AGENT_PATTERNS.some((pattern) => ua.includes(pattern));
}

function hasKnownAssistantUtm(url) {
  const utmSource = (url.searchParams.get('utm_source') || '').toLowerCase();
  return /(chatgpt|openai|claude|anthropic|perplexity)/i.test(utmSource);
}

function isLikelyAssistantFetcher(request, userAgent) {
  const ua = (userAgent || '').toLowerCase();
  const accept = (request.headers.get('accept') || '').toLowerCase();
  const secFetchMode = (request.headers.get('sec-fetch-mode') || '').toLowerCase();
  const secFetchDest = (request.headers.get('sec-fetch-dest') || '').toLowerCase();
  const secChUa = request.headers.get('sec-ch-ua') || '';

  const looksLikeCompatibilityUa = ua.includes('mozilla/5.0') && ua.includes('compatible;');
  const looksLikeDocumentFetch = accept.includes('text/html') || accept === '*/*';
  const hasBrowserNavigationHints = secFetchMode === 'navigate' || secFetchDest === 'document';
  const hasClientHints = secChUa.length > 0;

  return looksLikeCompatibilityUa && looksLikeDocumentFetch && !hasBrowserNavigationHints && !hasClientHints;
}

const STATIC_PAGE_META = {
  '/': {
    en: {
      title: 'AppCrates - Fullstack Web Developer | React, Next.js, TypeScript',
      description: 'Fullstack web developer in Poland building modern web applications, e-commerce platforms and custom business solutions for global clients.',
      h1: 'AppCrates - Fullstack Web Development'
    },
    pl: {
      title: 'AppCrates - Programista Fullstack | React, Next.js, TypeScript',
      description: 'Tworze nowoczesne aplikacje webowe, strony internetowe, sklepy internetowe i rozwiazania dla firm w Polsce i globalnie.',
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

function pickLocalizedArray(field, language) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (Array.isArray(field[language])) return field[language];
  if (Array.isArray(field.en)) return field.en;
  if (Array.isArray(field.pl)) return field.pl;
  return [];
}

function hasLanguageVariant(field, language) {
  if (!field || typeof field === 'string') return false;
  return Boolean(field[language]);
}

function resolveContentLanguage({ requestedLanguage, path, doc }) {
  if (path.startsWith('/uslugi/')) {
    return 'pl';
  }

  if (requestedLanguage === 'pl' || requestedLanguage === 'en') {
    return requestedLanguage;
  }

  if (hasLanguageVariant(doc?.title, 'pl') || hasLanguageVariant(doc?.intro, 'pl') || hasLanguageVariant(doc?.excerpt, 'pl')) {
    return 'pl';
  }

  return requestedLanguage || 'en';
}

function renderPortableTextToHtml(blocks, { projectId, dataset } = {}) {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  const parts = [];
  let currentListType = null;

  const closeOpenList = () => {
    if (currentListType) {
      parts.push(`</${currentListType}>`);
      currentListType = null;
    }
  };

  for (const block of blocks) {
    if (!block) continue;

    if (block._type === 'image') {
      closeOpenList();
      const imageUrl = imageUrlFromSanityAsset(block, projectId, dataset);
      if (imageUrl) {
        const alt = escapeHtml(block?.alt || '');
        parts.push(`<img src="${escapeHtml(imageUrl)}" alt="${alt}" loading="lazy" />`);
      }
      continue;
    }

    if (!block || block._type !== 'block') continue;

    const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
    const markDefByKey = new Map(markDefs.map((def) => [def?._key, def]));

    const text = (Array.isArray(block.children) ? block.children : [])
      .map((child) => {
        if (child?._type !== 'span') return '';

        let rendered = escapeHtml(child.text || '');
        const marks = Array.isArray(child.marks) ? child.marks : [];

        for (const mark of marks) {
          if (mark === 'strong') {
            rendered = `<strong>${rendered}</strong>`;
            continue;
          }
          if (mark === 'em') {
            rendered = `<em>${rendered}</em>`;
            continue;
          }

          const def = markDefByKey.get(mark);
          if (def?._type === 'link' && def.href) {
            const href = escapeHtml(def.href);
            rendered = `<a href="${href}" rel="noopener noreferrer">${rendered}</a>`;
          }
        }

        return rendered;
      })
      .join('')
      .trim();

    if (!text) continue;

    if (block.listItem) {
      const listTag = block.listItem === 'number' ? 'ol' : 'ul';
      if (currentListType !== listTag) {
        closeOpenList();
        parts.push(`<${listTag}>`);
        currentListType = listTag;
      }
      parts.push(`<li>${text}</li>`);
      continue;
    }

    closeOpenList();

    const style = block.style || 'normal';
    if (style === 'h2') {
      parts.push(`<h2>${text}</h2>`);
    } else if (style === 'h3') {
      parts.push(`<h3>${text}</h3>`);
    } else {
      parts.push(`<p>${text}</p>`);
    }
  }

  closeOpenList();

  return parts.join('\n');
}

function renderServiceLandingBodyHtml({ doc, language, projectId, dataset }) {
  const eyebrow = pickLocalizedValue(doc?.eyebrow, language);
  const intro = pickLocalizedValue(doc?.intro, language);
  const ctaPrimary = pickLocalizedValue(doc?.ctaLabel, language);
  const ctaSecondary = pickLocalizedValue(doc?.ctaSecondaryLabel, language);
  const city = doc?.city || '';
  const serviceType = doc?.serviceType || '';
  const stats = pickLocalizedArray(doc?.stats, language);
  const problems = pickLocalizedArray(doc?.problems, language);
  const deliverables = pickLocalizedArray(doc?.deliverables, language);
  const processSteps = pickLocalizedArray(doc?.processSteps, language);
  const faqItems = pickLocalizedArray(doc?.faq, language);
  const richContentBlocks = pickLocalizedArray(doc?.content, language);

  const t = language === 'pl'
    ? {
        problems: 'Problemy, które rozwiązuję',
        deliverables: 'Co otrzymasz',
        process: 'Proces współpracy',
        faq: 'FAQ'
      }
    : {
        problems: 'Problems I Solve',
        deliverables: 'What You Get',
        process: 'Delivery Process',
        faq: 'FAQ'
      };

  const parts = [];
  if (eyebrow) {
    parts.push(`<p>${escapeHtml(eyebrow)}</p>`);
  }
  if (intro) {
    parts.push(`<p>${escapeHtml(intro)}</p>`);
  }

  if (city || serviceType) {
    parts.push(`<p>${escapeHtml([serviceType, city].filter(Boolean).join(' • '))}</p>`);
  }

  if (stats.length) {
    parts.push(`<section><h2>${escapeHtml(language === 'pl' ? 'Najważniejsze liczby' : 'Key Stats')}</h2><ul>${stats
      .map((item) => `<li><strong>${escapeHtml(item?.value || '')}</strong> ${escapeHtml(item?.label || '')}</li>`)
      .join('')}</ul></section>`);
  }

  if (problems.length) {
    parts.push(`<section><h2>${escapeHtml(t.problems)}</h2><ul>${problems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`);
  }

  if (deliverables.length) {
    parts.push(`<section><h2>${escapeHtml(t.deliverables)}</h2><ul>${deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`);
  }

  if (processSteps.length) {
    parts.push(`<section><h2>${escapeHtml(t.process)}</h2><ol>${processSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></section>`);
  }

  if (faqItems.length) {
    parts.push(`<section><h2>${escapeHtml(t.faq)}</h2>${faqItems
      .map((item) => `<h3>${escapeHtml(item?.question || '')}</h3><p>${escapeHtml(item?.answer || '')}</p>`)
      .join('')}</section>`);
  }

  const richContentHtml = renderPortableTextToHtml(richContentBlocks, { projectId, dataset });
  if (richContentHtml) {
    parts.push(richContentHtml);
  }

  if (ctaPrimary || ctaSecondary) {
    parts.push(`<section><h2>${escapeHtml(language === 'pl' ? 'Następny krok' : 'Next Step')}</h2><p>${escapeHtml([ctaPrimary, ctaSecondary].filter(Boolean).join(' • '))}</p></section>`);
  }

  return parts.join('\n');
}

function buildHtml({ title, description, canonicalUrl, alternateBaseUrl, ogType = 'website', ogImageUrl, h1, bodyHtml, jsonLd, language }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl);
  const safeAlternateBase = escapeHtml(alternateBaseUrl || canonicalUrl);
  const safeAlternateEn = `${safeAlternateBase}${safeAlternateBase.includes('?') ? '&' : '?'}lang=en`;
  const safeAlternatePl = `${safeAlternateBase}${safeAlternateBase.includes('?') ? '&' : '?'}lang=pl`;
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
  <link rel="alternate" href="${safeAlternateEn}" hreflang="en" />
  <link rel="alternate" href="${safeAlternatePl}" hreflang="pl" />
  <link rel="alternate" href="${safeAlternateBase}" hreflang="x-default" />

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
    ${bodyHtml || `<p>${safeDescription}</p>`}
  </main>
</body>
</html>`;
}

async function buildDynamicDocumentHtml({ url, path, language, context }) {
  const isBlogPost = path.startsWith('/blog/');
  const isProject = path.startsWith('/project/');
  const isServiceLanding = path.startsWith('/uslugi/');
  const isAboutMe = path === '/about-me';

  if (!isBlogPost && !isProject && !isServiceLanding && !isAboutMe) {
    return null;
  }

  const rawSlug = isAboutMe
    ? 'about-me'
    : isBlogPost
      ? path.replace('/blog/', '')
      : isProject
        ? path.replace('/project/', '')
        : path.replace('/uslugi/', '');
  const slug = rawSlug.replace(/\/+$/, '').trim();
  if (!slug) return null;

  const projectId = Deno.env.get('SANITY_PROJECT_ID') || context.env.SANITY_PROJECT_ID || DEFAULT_SANITY_PROJECT_ID;
  const dataset = Deno.env.get('SANITY_DATASET') || context.env.SANITY_DATASET || DEFAULT_SANITY_DATASET;
  if (!projectId) return null;

  const safeSlug = slug.replace(/"/g, '\\"');
  const query = isBlogPost
    ? `*[_type == "post" && slug.current == "${safeSlug}"][0]{
        title { en, pl },
        slug,
        author->{ name },
        mainImage,
        excerpt { en, pl },
        body { en, pl },
        publishedAt,
        seo {
          metaTitle { en, pl },
          metaDescription { en, pl },
          ogImage,
          noIndex
        }
      }`
    : isProject
      ? `*[_type == "project" && slug.current == "${safeSlug}"][0]{
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
      }`
      : isServiceLanding
        ? `*[_type == "serviceLanding" && slug.current == "${safeSlug}"][0]{
        title { en, pl },
        slug,
        serviceType,
        city,
        eyebrow { en, pl },
        heroImage,
        intro { en, pl },
        problems { en, pl },
        deliverables { en, pl },
        processSteps { en, pl },
        faq { en, pl },
        content { en, pl },
        ctaLabel { en, pl },
        ctaSecondaryLabel { en, pl },
        stats { en, pl },
        seo {
          metaTitle { en, pl },
          metaDescription { en, pl },
          ogImage,
          noIndex
        }
      }`
        : `*[_type == "aboutMe" && slug.current == "${safeSlug}"][0]{
        title { en, pl },
        slug,
        heroImage,
        intro { en, pl },
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

  const resolvedLanguage = resolveContentLanguage({
    requestedLanguage: language,
    path,
    doc
  });

  const title =
    pickLocalizedValue(doc?.seo?.metaTitle, resolvedLanguage) ||
    pickLocalizedValue(doc?.title, resolvedLanguage) ||
    'AppCrates';

  const description =
    pickLocalizedValue(doc?.seo?.metaDescription, resolvedLanguage) ||
    pickLocalizedValue(doc?.excerpt, resolvedLanguage) ||
    pickLocalizedValue(doc?.intro, resolvedLanguage) ||
    pickLocalizedValue(doc?.description, resolvedLanguage) ||
    'AppCrates web development content.';

  const bodyBlocks = isBlogPost
    ? (Array.isArray(doc?.body) ? doc.body : (doc?.body?.[resolvedLanguage] || doc?.body?.en || doc?.body?.pl || []))
    : [];
  const bodyHtml = isBlogPost
    ? renderPortableTextToHtml(bodyBlocks, { projectId, dataset })
    : isServiceLanding
      ? renderServiceLandingBodyHtml({ doc, language: resolvedLanguage, projectId, dataset })
      : '';

  const canonicalUrl = isBlogPost
    ? `${BASE_URL}/blog/${slug}`
    : isProject
      ? `${BASE_URL}/project/${slug}`
      : isServiceLanding
        ? `${BASE_URL}/uslugi/${slug}`
        : `${BASE_URL}/about-me`;
  const ogImageUrl =
    imageUrlFromSanityAsset(doc?.seo?.ogImage, projectId, dataset) ||
    imageUrlFromSanityAsset(doc?.heroImage, projectId, dataset) ||
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
        inLanguage: resolvedLanguage
      }
    : isProject
      ? {
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
        inLanguage: resolvedLanguage
      }
      : isServiceLanding
        ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: title,
        description,
        image: ogImageUrl,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          name: 'AppCrates'
        },
        areaServed: 'Worldwide',
        inLanguage: resolvedLanguage
      }
        : {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Arkadiusz Wawrzyniak',
        description,
        image: ogImageUrl,
        url: canonicalUrl,
        jobTitle: 'Fullstack Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'AppCrates'
        },
        inLanguage: resolvedLanguage
      };

  return buildHtml({
    title,
    description,
    canonicalUrl,
    alternateBaseUrl: canonicalUrl,
    ogType: isBlogPost ? 'article' : isProject ? 'website' : isServiceLanding ? 'website' : 'profile',
    ogImageUrl,
    h1: title,
    bodyHtml,
    jsonLd,
    language: resolvedLanguage
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
    alternateBaseUrl: canonicalUrl,
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

  const url = new URL(request.url);
  const path = url.pathname;
  const userAgent = request.headers.get('user-agent') || '';

  const likelyAssistantFetcher = isLikelyAssistantFetcher(request, userAgent);
  const shouldPrerender =
    isBotUserAgent(userAgent) ||
    (hasKnownAssistantUtm(url) && likelyAssistantFetcher) ||
    likelyAssistantFetcher;

  if (!shouldPrerender) {
    return context.next();
  }

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
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Vary': 'User-Agent, Accept-Language'
        }
      });
    }

    const staticHtml = buildStaticDocumentHtml({ path, language });
    if (staticHtml) {
      return new Response(staticHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Vary': 'User-Agent, Accept-Language'
        }
      });
    }

    return context.next();
  } catch (error) {
    console.error('social-crawler edge function error:', error);
    return context.next();
  }
}
