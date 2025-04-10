import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getPosts } from '../lib/sanity.client';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { urlFor } from '../lib/sanity.client';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from './PortableTextComponents';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

// Lazy load secondary components
const PopularPosts = lazy(() => import('./PopularPosts'));
const ProposedPosts = lazy(() => import('./ProposedPosts'));

// Utility functions moved outside component for better performance
const getTitle = (post, language) => {
  if (!post?.title) return '';
  return typeof post.title === 'string' ? post.title : (post.title[language] || post.title.en || '');
};

const getExcerpt = (post, language) => {
  if (!post?.excerpt) return '';
  return typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt[language] || post.excerpt.en || '');
};

const getBody = (post, language) => {
  if (!post?.body) return [];
  return Array.isArray(post.body) ? post.body : (post.body[language] || post.body.en || []);
};

// Loading skeleton component
const PostSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white/5 h-10 w-3/4 rounded animate-pulse mb-4"></div>
        <div className="flex items-center mb-6 space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse"></div>
          <div>
            <div className="h-4 w-24 bg-teal-300/20 rounded animate-pulse"></div>
            <div className="h-3 w-32 bg-white/5 rounded animate-pulse mt-1"></div>
          </div>
        </div>
        <div className="w-full h-64 rounded-lg bg-white/5 animate-pulse mb-8"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-white/5 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white/5 rounded-lg p-6 mb-8 h-64 animate-pulse"></div>
        <div className="bg-white/5 rounded-lg p-6 h-64 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [previousPost, setPreviousPost] = useState(null);
  const { language } = useLanguage();
  const t = translations[language].blog;
  const navigate = useNavigate();

  // Call useScrollToTop at the top level
  useScrollToTop();

  // Create memoized cache key that changes only when slug or language changes
  const cacheKey = `${slug}-${language}`;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    // Try to get from sessionStorage first
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { post, allPosts, relatedPosts, nextPost, previousPost } = JSON.parse(cachedData);
        setPost(post);
        setAllPosts(allPosts);
        setRelatedPosts(relatedPosts);
        setNextPost(nextPost);
        setPreviousPost(previousPost);
        setLoading(false);
        
        // Increment view count asynchronously
        if (post?._id) {
          fetch('/.netlify/functions/incrementViewCount', {
            method: 'POST',
            body: JSON.stringify({ postId: post._id }),
            headers: { 'Content-Type': 'application/json' },
            // Use a short timeout for non-critical operation
            signal: AbortSignal.timeout(5000) 
          }).catch(() => {/* Silently fail - this is non-critical */});
        }
        
        // Still fetch data in background to update cache
        fetchData(true);
        return;
      } catch (e) {
        console.error('Error parsing cached data', e);
      }
    }

    // Fetch data if no cache or cache parsing failed
    fetchData();

    function fetchData(isBackgroundRefresh = false) {
      if (!isBackgroundRefresh) {
        setLoading(true);
      }

      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      Promise.all([
        getPost(slug),
        getPosts()
      ])
      .then(([fetchedPost, posts]) => {
        if (!isMounted || signal.aborted) return;
        
        if (!fetchedPost?._id) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        // Process posts and set state
        const sortedPosts = posts
          .filter(p => p._id !== fetchedPost._id)
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        
        // Find related posts by category
        const relatedPostsData = sortedPosts
          .filter(p => {
            if (!fetchedPost.categories || !p.categories) return false;
            return fetchedPost.categories.some(cat => p.categories.includes(cat));
          })
          .slice(0, 5);
        
        // Set popular posts (not related)
        const popularPostsData = sortedPosts
          .filter(p => !relatedPostsData.find(rp => rp._id === p._id))
          .slice(0, 3);
        
        // Find next and previous posts
        const allPostsSorted = [...posts].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        const currentIndex = allPostsSorted.findIndex(p => p._id === fetchedPost._id);
        const prevPost = currentIndex > 0 ? allPostsSorted[currentIndex - 1] : null;
        const nextP = currentIndex < allPostsSorted.length - 1 ? allPostsSorted[currentIndex + 1] : null;
        
        // Cache the data
        const dataToCache = {
          post: fetchedPost,
          allPosts: popularPostsData,
          relatedPosts: relatedPostsData,
          nextPost: nextP,
          previousPost: prevPost
        };
        
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        } catch (e) {
          console.error('Error caching data', e);
        }
        
        // Update state
        setPost(fetchedPost);
        setAllPosts(popularPostsData);
        setRelatedPosts(relatedPostsData);
        setPreviousPost(prevPost);
        setNextPost(nextP);
        setLoading(false);
        
        // Increment view count asynchronously only on initial load, not on background refresh
        if (!isBackgroundRefresh && fetchedPost._id) {
          fetch('/.netlify/functions/incrementViewCount', {
            method: 'POST',
            body: JSON.stringify({ postId: fetchedPost._id }),
            headers: { 'Content-Type': 'application/json' },
            // Use a short timeout for non-critical operation
            signal: AbortSignal.timeout(5000) 
          }).catch(() => {/* Silently fail - this is non-critical */});
        }
      })
      .catch(err => {
        if (isMounted && !signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setLoading(false);
        }
      });
    }

    // Cleanup
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, language, cacheKey]);

  // Apply orphan prevention after post content loads
  useEffect(() => {
    if (post) {
      const preventOrphans = () => {
        document.querySelectorAll('.blog-content p').forEach((el) => {
          el.innerHTML = el.innerHTML.replace(
            /\s(a|I|the|a|an|to|of|in|on|and|or|but|for|with|by|as|at|from|into|is|was|were|are|be|been|have|has|had|will|would|should|could|can|may|might)\s/g,
            ' $1&nbsp;'
          );
          
          el.innerHTML = el.innerHTML.replace(
            /\s([^\s]+)$/,
            '&nbsp;$1'
          );
        });
      };

      // Small delay to ensure content is rendered
      const timer = setTimeout(preventOrphans, 100);
      return () => clearTimeout(timer);
    }
  }, [post]);

  // Create OG image URL
  const baseImageUrl = post?.mainImage 
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : `https://appcrates.pl/media/default-og-image.png`;
  
  const ogImageUrl = baseImageUrl + (baseImageUrl.includes('?') ? '&' : '?') + 'cb=' + Date.now();
  const baseUrl = 'https://appcrates.pl';
  const canonicalUrl = post?.slug ? `${baseUrl}/blog/${post.slug.current}` : baseUrl;

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-[#140F2D] min-h-screen text-white py-8">
          <PostSkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#140F2D]">
          <div className="text-white text-center">{error || 'Post not found'}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet prioritizeSeoTags={true}>
        <title>{getTitle(post, language)}</title>
        <meta name="description" content={getExcerpt(post, language)} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={getTitle(post, language)} />
        <meta property="og:description" content={getExcerpt(post, language)} /> 
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:url" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:site_name" content="AppCrates" />
        <meta property="og:updated_time" content={new Date().toISOString()} />
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        
        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getTitle(post, language)} />
        <meta name="twitter:description" content={getExcerpt(post, language)} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <Header />
      <main className="bg-[#140F2D] min-h-screen text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Directory Navigation */}
          <div className="flex items-center space-x-2 text-sm mt-16 text-white/60">
            <Link to="/" className="hover:text-white transition-colors">
              {translations[language].navigation.home}
            </Link>
            <span>›</span>
            <a
              href="/blog"
              className="hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                navigate('/blog');
                setTimeout(() => {
                  const element = document.getElementById('blog-posts');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              {translations[language].navigation.blog}
            </a>
            <span>›</span>
            <span className="text-white">{getTitle(post, language)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl text-white font-bold mb-4">
                  {getTitle(post, language)}
                </h1>
                <div className="flex items-center text-white mb-6 space-x-3">
                  {post.author?.image && (
                    <img
                      src={urlFor(post.author.image).width(40).height(40).url()}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="font-medium text-teal-300">{post.author?.name}</p>
                    <p className="text-sm">
                      {new Date(post.publishedAt).toLocaleDateString()} • {post.viewCount || 0} views
                    </p>
                  </div>
                </div>
                {post.mainImage && (
                  <img
                    src={urlFor(post.mainImage).auto('format').fit('max').url()}
                    alt={getTitle(post, language)}
                    className="w-full h-auto rounded-lg shadow-lg mb-8"
                    loading="eager" // Load main image eagerly as it's important
                  />
                )}
                <div className="text-white text-left font-jakarta blog-content">
                  <PortableText
                    value={getBody(post, language)}
                    components={portableTextComponents}
                  />
                </div>

                {/* Author Section */}
                {post.author && (
                  <div className="mt-12 p-6 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      {post.author.image && (
                        <img
                          src={urlFor(post.author.image).width(80).height(80).url()}
                          alt={post.author.name}
                          className="w-16 h-16 rounded-full mr-4 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white font-jakarta">{post.author.name}</h3>
                        <p className="text-white/70 font-jakarta">{t.author}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation between posts */}
                <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  {previousPost ? (
                    <Link
                      to={`/blog/${previousPost.slug.current}`}
                      className="flex items-center text-teal-300 hover:text-teal-400 group font-jakarta"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="line-clamp-1">
                        {typeof previousPost.title === 'string'
                          ? previousPost.title
                          : previousPost.title?.[language] || previousPost.title?.en}
                      </span>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {nextPost && (
                    <Link
                      to={`/blog/${nextPost.slug.current}`}
                      className="flex items-center text-teal-300 hover:text-teal-400 group ml-auto font-jakarta"
                    >
                      <span className="line-clamp-1">
                        {typeof nextPost.title === 'string'
                          ? nextPost.title
                          : nextPost.title?.[language] || nextPost.title?.en}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </motion.article>
            </div>

            {/* Sidebar - Lazy loaded with Suspense */}
            <aside className="lg:col-span-1">
              <div className="space-y-16 sticky top-24">
                <Suspense fallback={<div className="bg-white/5 rounded-lg p-6 h-64 animate-pulse"></div>}>
                  {/* Popular Posts */}
                  <div className="bg-[#140F2D] shadow-sm rounded-lg p-6 ring-1 ring-white/40">
                    <PopularPosts posts={allPosts} />
                  </div>
                </Suspense>

                <Suspense fallback={<div className="bg-white/5 rounded-lg p-6 h-64 animate-pulse"></div>}>
                  {/* Related Posts */}
                  <div className="bg-[#140F2D] shadow-sm rounded-lg p-6 ring-1 ring-white/40">
                    <h2 className="text-xl font-bold mb-4 text-white">{t.relatedPosts}</h2>
                    <ProposedPosts posts={relatedPosts} />
                  </div>
                </Suspense>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPostPage;
