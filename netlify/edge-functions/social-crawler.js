// netlify/edge-functions/social-crawler.js
// Serves pre-rendered HTML with full OG/Twitter meta for social media crawlers.
// Regular users are served the SPA as usual.
export default async function(request, context) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Only process blog post and project routes
    const isBlogPost = path.startsWith('/blog/');
    const isProject = path.startsWith('/project/');
    
    if (!isBlogPost && !isProject) {
      return context.next();
    }
    
    // Check if it's a social media crawler
    const userAgent = request.headers.get('user-agent') || '';
    const isSocialCrawler = /facebookexternalhit|twitterbot|linkedinbot|pinterest|slackbot|telegrambot|whatsapp|discordbot|googlebot/i.test(userAgent);
    
    if (!isSocialCrawler) {
      return context.next();
    }
    
    try {
      const projectId = Deno.env.get("SANITY_PROJECT_ID") || context.env.SANITY_PROJECT_ID;
      const dataset = Deno.env.get("SANITY_DATASET") || context.env.SANITY_DATASET || "production";
      
      if (!projectId) {
        console.error("Missing Sanity project ID in environment variables");
        return context.next();
      }
      
      let slug, docType;
      if (isBlogPost) {
        slug = path.split('/blog/')[1];
        docType = 'post';
      } else {
        slug = path.split('/project/')[1];
        docType = 'project';
      }
      
      // Remove trailing slash if present
      slug = slug.replace(/\/$/, '');
      
      // Build GROQ query depending on document type
      const query = docType === 'post'
        ? encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]{
            _id,
            title { en, pl },
            slug,
            author->{ name, image },
            mainImage,
            publishedAt,
            excerpt { en, pl },
            viewCount,
            categories,
            seo {
              metaTitle { en, pl },
              metaDescription { en, pl },
              ogImage,
              noIndex
            }
          }`)
        : encodeURIComponent(`*[_type == "project" && slug.current == "${slug}"][0]{
            _id,
            title { en, pl },
            slug,
            mainImage,
            description { en, pl },
            publishedAt,
            technologies,
            seo {
              metaTitle { en, pl },
              metaDescription { en, pl },
              ogImage,
              noIndex
            }
          }`);
      
      const sanityUrl = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`;
      const response = await fetch(sanityUrl);
      
      if (!response.ok) {
        console.error("Error fetching from Sanity:", response.statusText);
        return context.next();
      }
      
      const data = await response.json();
      const doc = data.result;
      
      if (!doc) {
        return context.next();
      }
      
      // If noIndex is set, don't serve to crawlers
      if (doc.seo?.noIndex) {
        return context.next();
      }
      
      // Generate image URL
      const imageBuilder = (source) => {
        if (!source || !source.asset || !source.asset._ref) {
          return null;
        }
        const imgId = source.asset._ref
          .replace('image-', '')
          .replace('-webp', '')
          .replace('-jpg', '')
          .replace('-png', '');
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imgId}.webp?w=1200&h=630&fit=crop&auto=format`;
      };
      
      // Use SEO override image, then main image, then default
      const ogImageUrl = (doc.seo?.ogImage && imageBuilder(doc.seo.ogImage))
        || (doc.mainImage && imageBuilder(doc.mainImage))
        || `https://appcrates.pl/media/default-og-image.png`;
      
      // Get title - use SEO override if available, then document title
      const getTitle = (doc) => {
        if (doc.seo?.metaTitle?.en) return doc.seo.metaTitle.en;
        if (!doc.title) return 'AppCrates';
        return typeof doc.title === 'string' ? doc.title : (doc.title.en || '');
      };
      
      // Get description - use SEO override, then excerpt/description
      const getDescription = (doc) => {
        if (doc.seo?.metaDescription?.en) return doc.seo.metaDescription.en;
        if (doc.excerpt) {
          return typeof doc.excerpt === 'string' ? doc.excerpt : (doc.excerpt.en || '');
        }
        if (doc.description) {
          return typeof doc.description === 'string' ? doc.description : (doc.description.en || '');
        }
        return '';
      };
      
      const baseUrl = 'https://appcrates.pl';
      const canonicalUrl = isBlogPost
        ? `${baseUrl}/blog/${slug}`
        : `${baseUrl}/project/${slug}`;
      
      const title = getTitle(doc);
      const description = getDescription(doc);
      
      // Build structured data (JSON-LD)
      const structuredData = isBlogPost ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": ogImageUrl,
        "url": canonicalUrl,
        "datePublished": doc.publishedAt || '',
        "author": {
          "@type": "Person",
          "name": doc.author?.name || 'AppCrates'
        },
        "publisher": {
          "@type": "Organization",
          "name": "AppCrates",
          "url": baseUrl
        }
      } : {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": title,
        "description": description,
        "image": ogImageUrl,
        "url": canonicalUrl,
        "author": {
          "@type": "Organization",
          "name": "AppCrates"
        }
      };
      
      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="${isBlogPost ? 'article' : 'website'}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:url" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:site_name" content="AppCrates" />
    <meta property="og:updated_time" content="${new Date().toISOString()}" />
    
    <!-- Twitter card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  </head>
  <body>
    <h1>${title}</h1>
    <p>${description}</p>
    <script>
      if (!/(bot|crawler|spider|facebook|twitter|linkedin|pinterest|slack|telegram|whatsapp|discord)/i.test(navigator.userAgent)) {
        window.location.href = '${canonicalUrl}';
      }
    </script>
  </body>
</html>`;
      
      return new Response(html, {
        headers: {
          'content-type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      console.error('Edge function error:', error);
      return context.next();
    }
  }