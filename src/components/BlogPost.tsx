import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, incrementPostView, getPosts } from '../lib/sanity.client';
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

  // useEffect for preventing orphans
  useEffect(() => {
    const preventOrphans = () => {
      document.querySelectorAll('.blog-content p').forEach((el) => {
        // Replace the last space before common words with a non-breaking space
        el.innerHTML = el.innerHTML.replace(
          /\s(a|I|the|an|to|of|in|on|and|or|but)\s/g, 
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

  const getBody = (post: Post) => {
    if (!post?.body) return [];
    return Array.isArray(post.body) ? post.body : (post.body[language] || post.body.en || []);
};

if (!post) {
  return (
  <div className="min-h-screen flex items-center justify-center bg-[#140F2D]">
  <div className="text-white text-center">Loading project...</div>
</div>
)}


return (
    <>
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
                    src={urlFor(post.mainImage).width(1200).height(800).url()}
                    alt={getTitle(post)}
                    className="w-full rounded-lg shadow-lg mb-8"
                  />
                )}
                <div className="text-white text-left font-jakarta blog-content">
                  <PortableText
                    value={getBody(post)}
                    components={portableTextComponents}
                  />
                </div>

                {/* Post Navigation */}
                <div className="mt-16 flex justify-between items-center">
                  {previousPost ? (
                    <Link 
                      to={`/blog/${previousPost.slug?.current}`}
                      className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                    >
                      <span>←</span>
                      <span>{getTitle(previousPost)}</span>
                    </Link>
                  ) : <div />}
                  
                  {nextPost ? (
                    <Link 
                      to={`/blog/${nextPost.slug?.current}`}
                      className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                    >
                      <span>{getTitle(nextPost)}</span>
                      <span>→</span>
                    </Link>
                  ) : <div />}
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
