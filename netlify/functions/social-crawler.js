// Assuming you have a function to fetch post data (like Sanity)
const post = await getBlogPost(slug); // Implement this based on your data source
const ogImage = post?.ogImage || 'https://appcrates.pl/media/default-og-image.png';

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
        <title>${post?.title || 'Blog Post - AppCrates'}</title>
        <meta property="og:title" content="${post?.title || 'Blog Post - AppCrates'}">
        <meta property="og:description" content="${post?.description || 'Blog post description'}">
        <meta property="og:image" content="${ogImage}">
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
