import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, incrementPostView, getPosts } from '../lib/sanity.client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import type { Post } from '../types/sanity.types';
import Header from './Header';
import Footer from './Footer';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanity.client';
import { portableTextComponents } from './PortableTextComponents';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import PopularPosts from './PopularPosts';
import ProposedPosts from './ProposedPosts';
import { translations } from '../translations/translations';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPost, setNextPost] = useState<Post | null>(null);
  const [previousPost, setPreviousPost] = useState<Post | null>(null);
  const { language } = useLanguage();
  const t = translations[language].blog;
  const navigate = useNavigate();

  // Call useScrollToTop at the top level
  useScrollToTop();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (slug) {
          const [fetchedPost, posts] = await Promise.all([
            getPost(slug),
            getPosts()
          ]);
          
          if (!isMounted) return;

          if (fetchedPost?._id) {
            // Update current post
            setPost(fetchedPost);
            
            // Sort posts by publishedAt
            const sortedPosts = posts
              .filter(p => p._id !== fetchedPost._id)
              .sort((a, b) => 
                new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
              );
            
            // Filter related posts by category
            const relatedPosts = sortedPosts
              .filter(p => {
                if (!fetchedPost.categories || !p.categories) return false;
                return fetchedPost.categories.some(cat => 
                  p.categories.includes(cat)
                );
              })
              .slice(0, 5);

            // Set remaining posts for popular section
            const popularPosts = sortedPosts
              .filter(p => !relatedPosts.find(rp => rp._id === p._id))
              .slice(0, 3);
            
            setAllPosts(popularPosts);
            setRelatedPosts(relatedPosts);

            // Find current post index in the full list
            const allPostsSorted = [...posts].sort((a, b) => 
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
            const currentIndex = allPostsSorted.findIndex(p => p._id === fetchedPost._id);
            
            // Set next and previous posts
            if (currentIndex > 0) {
              setPreviousPost(allPostsSorted[currentIndex - 1]);
            } else {
              setPreviousPost(null);
            }
            
            if (currentIndex < allPostsSorted.length - 1) {
              setNextPost(allPostsSorted[currentIndex + 1]);
            } else {
              setNextPost(null);
            }

            setLoading(false);

            // Increment view count in the background
            incrementPostView(fetchedPost._id).catch(console.error);
          } else {
            setError('Post not found');
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [slug, language]);


  useEffect(() => {
    if (post && !loading) {
      console.log('OG Image URL:', ogImageUrl);
      // Create and dispatch the event immediately after post data is loaded
      const dispatchReadyEvent = () => {
        if (typeof window !== 'undefined' && window.document) {
          const event = new Event('reactHelmetsReady');
          window.document.dispatchEvent(event);
          console.log('Dispatched reactHelmetsReady event');
        }
      };
  
      // Small delay to ensure React Helmet has updated the DOM
      setTimeout(dispatchReadyEvent, 500);
    }
  }, [post, loading]);


  // useEffect for preventing orphans
  useEffect(() => {
    const preventOrphans = () => {
      document.querySelectorAll('.blog-content p').forEach((el) => {
        // Replace the last space before common words with a non-breaking space
        el.innerHTML = el.innerHTML.replace(
                    /\s(a|I|the|a|an|to|of|in|on|and|or|but|for|with|by|as|at|from|into|is|was|were|are|be|been|have|has|had|will|would|should|could|can|may|might)\s/g, 
 
          ' $1&nbsp;'
        );
        
        // Prevent the last two words from being separated
        el.innerHTML = el.innerHTML.replace(
          /\s([^\s]+)$/,
          '&nbsp;$1'
        );
      });
    };

    if (post) {
      // Small delay to ensure content is rendered
      setTimeout(preventOrphans, 100);
    }
  }, [post]);

  const getTitle = (post: Post) => {
    if (!post?.title) return '';
    return typeof post.title === 'string' ? post.title : (post.title[language] || post.title.en || '');
  };

  const getExcerpt = (post: Post) => {

    if (!post?.excerpt) return '';

    return typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt[language] || post.excerpt.en || '');

  };

  const getBody = (post: Post) => {
    if (!post?.body) return [];
    return Array.isArray(post.body) ? post.body : (post.body[language] || post.body.en || []);
};
// Generate the OG image URL if post exists

const cacheBuster = Date.now();
const ogImageUrl = post?.mainImage 
  ? `${urlFor(post.mainImage).width(1200).height(630).url()}?cb=${cacheBuster}`
  : `https://appcrates.pl/media/default-og-image.png?cb=${cacheBuster}`;


// Base URL for canonical and OG URLs

const baseUrl = 'https://appcrates.pl';

const canonicalUrl = post?.slug ? `${baseUrl}/blog/${post.slug.current}` : baseUrl;



if (loading) {

return (

  <div className="min-h-screen flex items-center justify-center bg-[#140F2D]">

    <div className="text-white text-center">Loading project...</div>

  </div>

);

}



if (error || !post) {

return (

  <div className="min-h-screen flex items-center justify-center bg-[#140F2D]">

    <div className="text-white text-center">{error || 'Post not found'}</div>

  </div>

);

}


return (
    <>
      
      <Helmet prioritizeSeoTags={true}>
  {/* Force removal of any existing OG tags */}
  <meta property="og:placeholder" content="true" />
  
  <title>{getTitle(post)}</title>
  <meta name="description" content={getExcerpt(post)} />
  <link rel="canonical" href={canonicalUrl} />
  
  {/* Open Graph with cache-busting */}
  <meta property="og:type" content="article" />
  <meta property="og:title" content={getTitle(post)} />
  <meta property="og:description" content={getExcerpt(post)} /> 
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="AppCrates" />
  <meta property="og:updated_time" content={Date.now().toString()} />
  
  {/* Twitter card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={getTitle(post)} />
  <meta name="twitter:description" content={getExcerpt(post)} />
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
            <span className="text-white">{getTitle(post)}</span>
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
                  {getTitle(post)}
                </h1>
                <div className="flex items-center text-white mb-6 space-x-3">
                  {post.author?.image && (
                    <img
                      src={urlFor(post.author.image).width(40).height(40).url()}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
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
    src={urlFor(post.mainImage)
      .auto('format')
      .fit('max')
      .url()}
    alt={getTitle(post)}
    className="w-full h-auto rounded-lg shadow-lg mb-8"
  />


                )}
                <div className="text-white text-left font-jakarta blog-content">
                  <PortableText
                    value={getBody(post)}
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

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-16 sticky top-24">
                {/* Popular Posts */}
                <div className="bg-[#140F2D] shadow-sm rounded-lg p-6 ring-1 ring-white/40">
                  <PopularPosts posts={allPosts} />
                </div>

                {/* Related Posts */}
                <div className="bg-[#140F2D] shadow-sm rounded-lg p-6 ring-1 ring-white/40">
                  <h2 className="text-xl font-bold mb-4 text-white">{t.relatedPosts}</h2>
                  <ProposedPosts posts={relatedPosts} />
                </div>
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
