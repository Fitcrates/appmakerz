exports.handler = async function(event, context) {
    const path = event.path;
    const userAgent = event.headers['user-agent'] || '';
    
    // Check if this is a social media crawler
    const isSocialCrawler = 
      userAgent.toLowerCase().includes('facebook') || 
      userAgent.toLowerCase().includes('linkedin') ||
      userAgent.toLowerCase().includes('twitter');
    
    // Only handle blog posts for social crawlers
    if (isSocialCrawler && path.startsWith('/blog/')) {
      // Extract slug from path
      const slug = path.replace('/blog/', '');
      
      // Here you would fetch post data from your Sanity API
      // For now, we'll just return some placeholder HTML
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Blog Post - AppCrates</title>
              <meta property="og:title" content="Blog Post - AppCrates">
              <meta property="og:description" content="Blog post description">
              <meta property="og:image" content="https://appcrates.pl/media/default-og-image.png?cb=${Date.now()}">
              <meta property="og:url" content="https://appcrates.pl/blog/${slug}">
              <meta property="og:type" content="article">
            </head>
            <body>
              <h1>This page is optimized for social media crawlers</h1>
              <p>Please visit <a href="https://appcrates.pl/blog/${slug}">our website</a> to view the actual content.</p>
            </body>
          </html>
        `
      };
    }
    
    // Let the normal site handling take over for non-social crawlers
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Not a social crawler" })
    };
  };