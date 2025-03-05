import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, incrementPostView, getPosts } from '../lib/sanity.client';
import type { Post, Category } from '../types/sanity.types';
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

  // Helper function to get category ID regardless of format
  const getCategoryId = (category: string | Category): string => {
    if (typeof category === 'string') return category;
    return category._id;
  };

  // Helper function to check if two categories match
  const categoriesMatch = (cat1: string | Category, cat2: string | Category): boolean => {
    const id1 = getCategoryId(cat1);
    const id2 = getCategoryId(cat2);
    return id1 === id2;
  };

  // Helper function to get category title based on language
  const getCategoryTitle = (category) => {
    if (typeof category === 'string') return category;
    if (!category || !category.title) return '';
    return category.title[language] || category.title.en || '';
  };

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
                
                // Check if any category in fetchedPost matches any category in p
                return fetchedPost.categories.some(fetchedCat => 
                  p.categories.some(pCat => categoriesMatch(fetchedCat, pCat))
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
          console.error('Error fetching post:', err);
          setError('Failed to load post');
          setLoading(false);
        }
      }
    };

    setLoading(true);
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // useEffect for preventing orphans
  useEffect(() => {
    const preventOrphans = () => {
      // Target all text elements in the blog content
      const textElements = document.querySelectorAll('.prose p, .prose li, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6, .blog-content p, .blog-content li, .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6');
      
      textElements.forEach((el) => {
        // Replace the last space before common words with a non-breaking space
        el.innerHTML = el.innerHTML.replace(
          /\s(a|I|the|an|to|of|in|on|and|or|but|for|with|by|as|at|from|into|is|was|were|are|be|been|have|has|had|will|would|should|could|can|may|might)\s/g, 
          ' $1&nbsp;'
        );
        
        // Prevent the last two words from being separated
        el.innerHTML = el.innerHTML.replace(
          /\s([^\s<>]+)\s([^\s<>]+)$/,
          '&nbsp;$1&nbsp;$2'
        );
      });
    };

    if (post) {
      // Small delay to ensure content is rendered
      setTimeout(preventOrphans, 300); // Increased delay to ensure content is fully rendered
    }
  }, [post]);

  const getTitle = (post: Post) => {
    if (!post?.title) return '';
    return typeof post.title === 'string' ? post.title : (post.title[language] || post.title.en || '');
  };

  const getBody = (post: Post) => {
    if (!post?.body) return [];
    return Array.isArray(post.body) ? post.body : (post.body[language] || post.body.en || []);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#140F2D]">
        <div className="text-white text-center">Loading project...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4 font-jakarta">{t.error}</h1>
            <p className="text-white/70 mb-8 font-jakarta">{error || t.postNotFound}</p>
            <Link to="/blog" className="text-teal-300 hover:text-teal-400 font-jakarta">
              {t.backToBlog}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-[#140F2D] min-h-screen text-white font-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Directory Navigation */}
          <div className="flex items-center space-x-2 text-sm mt-12 mb-8 text-white/60">
            <Link to="/" className="hover:text-teal-300 transition-colors">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article>
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4 font-jakarta">
                    {getTitle(post)}
                  </h1>
                  <div className="flex items-center text-white/70 mb-6 font-jakarta">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.viewCount || 0} {t.views}</span>
                    {post.categories && post.categories.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 rounded-full bg-teal-300/80 text-black font-jakarta"
                            >
                              {getCategoryTitle(category)}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {post.mainImage && (
                    <div className="w-full h-[400px] rounded-lg overflow-hidden mb-8">
                      <img
                        src={urlFor(post.mainImage).width(1200).height(800).url()}
                        alt={getTitle(post)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </header>

                <div className="prose prose-lg prose-invert max-w-none font-jakarta blog-content">
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
              </article>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-8 sticky top-24">
                {/* Popular Posts */}
                <div className="bg-[#140F2D] shadow-sm rounded-lg p-6 ring-1 ring-white/40">
                  
                  <PopularPosts posts={allPosts} />
                </div>

                {/* Related Posts */}
                <div className="bg-[#140F2D] shadow-sm rounded-lg p-6 ring-1 ring-white/40">
                  <h2 className="text-xl font-bold mb-4 text-white font-jakarta">{t.relatedPosts}</h2>
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
