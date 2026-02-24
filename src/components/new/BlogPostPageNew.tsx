import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { getPost, getPosts, getPostBody } from '../../lib/sanity.client';
import { getCache, setCache } from '../../utils/cache';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { usePrefetchPost } from '../../hooks/useBlogPosts';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { urlFor } from '../../lib/sanity.client';
import { PortableText } from '@portabletext/react';
import { portableTextComponentsNew } from './PortableTextComponentsNew';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import HeaderNew from './HeaderNew';
import FooterNew from './FooterNew';
import { CursorGlowProvider } from '../../context/CursorGlowContext';

const PopularPostsNew = lazy(() => import('./PopularPostsNew'));

// Utility functions
const getTitle = (post: any, language: string) => {
  if (!post?.title) return '';
  return typeof post.title === 'string' ? post.title : (post.title[language] || post.title.en || '');
};

const getExcerpt = (post: any, language: string) => {
  if (!post?.excerpt) return '';
  return typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt[language] || post.excerpt.en || '');
};

const getBody = (post: any, language: string) => {
  if (!post?.body) return [];
  return Array.isArray(post.body) ? post.body : (post.body[language] || post.body.en || []);
};

// Loading skeleton
const PostSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
    <div className="space-y-8">
      <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-96 bg-white/5 rounded animate-pulse" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${85 + Math.random() * 15}%` }} />
        ))}
      </div>
    </div>
  </div>
);

const BlogPostPageNew = () => {
  const prefetchPost = usePrefetchPost();
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPost, setNextPost] = useState<any>(null);
  const [previousPost, setPreviousPost] = useState<any>(null);
  const { language } = useLanguage();
  const t = translations[language].blog;
  const navigate = useNavigate();
  const location = useLocation();

  useScrollToTop();

  const cacheKey = `${slug}-${language}`;
  
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    setLoading(true);
    setError(null);
    
    async function fetchData() {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }
      
      try {
        const summaryFromState = location.state?.summary;
        const blogPosts = summaryFromState ? null : getCache<any[]>('blogPosts');
        const cachedSummary = blogPosts?.find((p: any) => p.slug.current === slug);
        const summary = summaryFromState || cachedSummary;
        
        let postData: any = null;
        let posts: any[] = [];
        
        if (summary) {
          const bodyData = await getPostBody(slug);
          postData = { ...summary, ...(bodyData as Record<string, unknown>) };
          posts = await getPosts() as any[];
        } else {
          const results = await Promise.all([getPost(slug), getPosts()]);
          postData = results[0];
          posts = results[1] as any[];
        }
        
        if (!isMounted) return;
        if (!postData?._id) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        const sortedPosts = posts
          .filter((p: any) => p._id !== postData._id)
          .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        
        const allPostsSorted = [...posts].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        const currentIndex = allPostsSorted.findIndex(p => p._id === postData._id);
        const prevPost = currentIndex > 0 ? allPostsSorted[currentIndex - 1] : null;
        const nextP = currentIndex < allPostsSorted.length - 1 ? allPostsSorted[currentIndex + 1] : null;
        
        setCache(cacheKey, { post: postData, allPosts: sortedPosts.slice(0, 5), nextPost: nextP, previousPost: prevPost });
        
        setPost(postData);
        setAllPosts(sortedPosts.slice(0, 5));
        setPreviousPost(prevPost);
        setNextPost(nextP);
        setLoading(false);
        
        if (postData._id) {
          fetch('/.netlify/functions/incrementViewCount', {
            method: 'POST',
            body: JSON.stringify({ postId: postData._id }),
            headers: { 'Content-Type': 'application/json' },
          }).catch(() => {});
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, location.state]);

  const baseImageUrl = post?.mainImage 
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : `https://appcrates.pl/media/default-og-image.png`;
  
  const ogImageUrl = baseImageUrl + (baseImageUrl.includes('?') ? '&' : '?') + 'cb=' + Date.now();
  const baseUrl = 'https://appcrates.pl';
  const canonicalUrl = post?.slug ? `${baseUrl}/blog/${post.slug.current}` : baseUrl;

  if (loading) {
    return (
      <CursorGlowProvider>
        <div className="bg-indigo-950 min-h-screen">
          <HeaderNew />
          <PostSkeleton />
          <FooterNew />
        </div>
      </CursorGlowProvider>
    );
  }

  if (error || !post) {
    return (
      <CursorGlowProvider>
        <div className="bg-indigo-950 min-h-screen">
          <HeaderNew />
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white font-jakarta mb-4">Post not found</h1>
              <p className="text-white/40 font-jakarta mb-8">{error || 'The post you are looking for does not exist.'}</p>
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-teal-300 font-jakarta hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
          <FooterNew />
        </div>
      </CursorGlowProvider>
    );
  }

  return (
    <CursorGlowProvider>
      <Helmet prioritizeSeoTags={true}>
        <title>{getTitle(post, language)} | AppCrates</title>
        <meta name="description" content={getExcerpt(post, language)} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={getTitle(post, language)} />
        <meta property="og:description" content={getExcerpt(post, language)} /> 
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getTitle(post, language)} />
        <meta name="twitter:description" content={getExcerpt(post, language)} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <div className="bg-indigo-950 min-h-screen">
        <HeaderNew />
        
        <main className="pt-32 pb-24">
          {/* Hero section with image */}
          {post.mainImage && (
            <div className="relative h-[50vh] lg:h-[60vh] mb-16">
              <img
                src={urlFor(post.mainImage).auto('format').fit('max').url()}
                alt={getTitle(post, language)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-transparent" />
            </div>
          )}

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-sm text-white/40 font-jakarta mb-8"
            >
              <Link to="/" className="hover:text-teal-300 transition-colors">
                {translations[language].navigation.home}
              </Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-teal-300 transition-colors">
                {translations[language].navigation.blog}
              </Link>
              <span>/</span>
              <span className="text-white/60 truncate max-w-[200px]">{getTitle(post, language)}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-light text-white font-jakarta leading-tight mb-8"
            >
              {getTitle(post, language)}
            </motion.h1>

            {/* Author and date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 mb-12 pb-12 border-b border-white/10"
            >
              {post.author?.image && (
                <img
                  src={urlFor(post.author.image).width(56).height(56).url()}
                  alt={post.author.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-white font-jakarta">{post.author?.name}</p>
                <p className="text-white/40 text-sm font-jakarta">
                  {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {post.viewCount && ` • ${post.viewCount} views`}
                </p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="blog-content"
            >
              <PortableText
                value={getBody(post, language)}
                components={portableTextComponentsNew}
              />
            </motion.article>

            {/* Author box */}
            {post.author && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 p-8 border border-white/10"
              >
                <div className="flex items-center gap-6">
                  {post.author.image && (
                    <img
                      src={urlFor(post.author.image).width(80).height(80).url()}
                      alt={post.author.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-1">
                      {t.author}
                    </p>
                    <h3 className="text-xl text-white font-jakarta">{post.author.name}</h3>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-8">
              {previousPost ? (
                <Link
                  to={`/blog/${previousPost.slug.current}`}
                  className="group flex items-center gap-4 flex-1"
                  onMouseEnter={() => prefetchPost(previousPost.slug.current)}
                >
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                    <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-1">Previous</p>
                    <p className="text-white font-jakarta group-hover:text-teal-300 transition-colors truncate">
                      {getTitle(previousPost, language)}
                    </p>
                  </div>
                </Link>
              ) : <div />}

              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug.current}`}
                  className="group flex items-center gap-4 flex-1 justify-end text-right"
                  onMouseEnter={() => prefetchPost(nextPost.slug.current)}
                >
                  <div className="min-w-0">
                    <p className="text-xs text-white/30 font-jakarta tracking-widest uppercase mb-1">Next</p>
                    <p className="text-white font-jakarta group-hover:text-teal-300 transition-colors truncate">
                      {getTitle(nextPost, language)}
                    </p>
                  </div>
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-indigo-950 transition-colors" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Popular Posts */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div className="border-t border-white/10 pt-16">
              <Suspense fallback={<div className="h-64 animate-pulse bg-white/5" />}>
                <PopularPostsNew />
              </Suspense>
            </div>
          </div>
        </main>

        <FooterNew />
      </div>
    </CursorGlowProvider>
  );
};

export default BlogPostPageNew;
