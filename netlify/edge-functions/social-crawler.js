// netlify/edge-functions/social-crawler.js
export default async function(request, context) {
    // Get the URL path
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Only process blog post routes
    if (!path.startsWith('/blog/')) {
      return context.next();
    }
    
    // Extract blog post slug from URL
    const slug = path.split('/blog/')[1];
    
    // Check if it's a social media crawler
    const userAgent = request.headers.get('user-agent') || '';
    const isSocialCrawler = /facebookexternalhit|twitterbot|linkedinbot|pinterest|slackbot|telegrambot|whatsapp|discordbot|googlebot/i.test(userAgent);
    
    // If not a social crawler, continue to the SPA
    if (!isSocialCrawler) {
      return context.next();
    }
    
    try {
      // Fetch post data from Sanity using direct API access
      const projectId = Deno.env.get("SANITY_PROJECT_ID") || context.env.SANITY_PROJECT_ID;
      const dataset = Deno.env.get("SANITY_DATASET") || context.env.SANITY_DATASET || "production";
      
      if (!projectId) {
        console.error("Missing Sanity project ID in environment variables");
        return context.next();
      }
      
      // Create a direct GROQ query to Sanity
      const query = encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]{
        _id,
        title {
          en,
          pl
        },
        slug,
        author->{
          name,
          image
        },
        mainImage,
        publishedAt,
        excerpt {
          en,
          pl
        },
        viewCount,
        categories
      }`);
      
      const sanityUrl = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`;
      const response = await fetch(sanityUrl);
      
      if (!response.ok) {
        console.error("Error fetching from Sanity:", response.statusText);
        return context.next();
      }
      
      const data = await response.json();
      const post = data.result;
      
      if (!post) {
        return context.next(); // Post not found, fall back to SPA
      }
      
      // Generate image URL using similar logic to urlFor
      const imageBuilder = (source) => {
        if (!source || !source.asset || !source.asset._ref) {
          return null;
        }
        
        // Extract image ID from reference
        const imgId = source.asset._ref
          .replace('image-', '')
          .replace('-webp', '')
          .replace('-jpg', '')
          .replace('-png', '');
        
        
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imgId}.webp?w=1200&h=630&fit=crop&auto=format`;
      };
      
      // Generate OG image URL
      const ogImageUrl = post?.mainImage 
        ? imageBuilder(post.mainImage)
        : `https://appcrates.pl/media/default-og-image.png`;
      
      // Get title and excerpt based on your component logic
      const getTitle = (post) => {
        if (!post?.title) return 'AppCrates Blog';
        return typeof post.title === 'string' ? post.title : (post.title.en || '');
      };
      
      const getExcerpt = (post) => {
        if (!post?.excerpt) return '';
        return typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt.en || '');
      };
      
      const baseUrl = 'https://appcrates.pl';
      const canonicalUrl = `${baseUrl}/blog/${slug}`;
      
      // Generate HTML specifically for social crawlers
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${getTitle(post)}</title>
            <meta name="description" content="${getExcerpt(post)}" />
            <link rel="canonical" href="${canonicalUrl}" />
            
            <!-- Open Graph -->
            <meta property="og:type" content="article" />
            <meta property="og:title" content="${getTitle(post)}" />
            <meta property="og:description" content="${getExcerpt(post)}" />
            <meta property="og:url" content="${canonicalUrl}" />
            <meta property="og:image" content="${ogImageUrl}" />
            <meta property="og:image:url" content="${ogImageUrl}" />
            <meta property="og:image:secure_url" content="${ogImageUrl}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/webp" />
            <meta property="og:site_name" content="AppCrates" />
            <meta property="og:updated_time" content="${new Date().toISOString()}" />
            <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            
            <!-- Twitter card -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${getTitle(post)}" />
            <meta name="twitter:description" content="${getExcerpt(post)}" />
            <meta name="twitter:image" content="${ogImageUrl}" />
          </head>
          <body>
            <h1>${getTitle(post)}</h1>
            <p>${getExcerpt(post)}</p>
            <script>
              // Regular users who somehow end up here will be redirected
              if (!/(bot|crawler|spider|facebook|twitter|linkedin|pinterest|slack|telegram|whatsapp|discord)/i.test(navigator.userAgent)) {
                window.location.href = '${canonicalUrl}';
              }
            </script>
          </body>
        </html>
      `;
      
      // Return the HTML with appropriate headers
      return new Response(html, {
        headers: {
          'content-type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      console.error('Edge function error:', error);
      return context.next(); // Fall back to SPA on error
    }
  }