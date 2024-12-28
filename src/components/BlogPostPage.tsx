//individual blog post page
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost, incrementPostView, getPosts } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';
import Header from './Header';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanity.client';
import { portableTextComponents } from './PortableTextComponents';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import PopularPosts from './PopularPosts';
import ProposedPosts from './ProposedPosts';
import { translations } from '../translations/translations';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language].blog;

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
            setPost({
              ...fetchedPost,
              viewCount: (fetchedPost.viewCount || 0) + 1
            });
            
            // Sort posts by viewCount and exclude current post
            const sortedPosts = posts
              .filter(p => p._id !== fetchedPost._id)
              .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
            
            setAllPosts(sortedPosts);
            setLoading(false);

            try {
              const updatedPost = await incrementPostView(fetchedPost._id);
              if (!isMounted) return;
              if (updatedPost.viewCount !== (fetchedPost.viewCount || 0) + 1) {
                setPost(prev => prev ? { ...prev, viewCount: updatedPost.viewCount } : null);
              }
            } catch (err) {
              console.error('Error incrementing view count:', err);
              setPost(prev => prev ? { ...prev, viewCount: fetchedPost.viewCount } : null);
            }
          } else {
            setPost(null);
            setLoading(false);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to fetch post');
        setLoading(false);
        console.error('Error fetching post:', err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const getTitle = (post: Post) => {
    if (typeof post.title === 'string') return post.title;
    return post.title?.[language] || post.title?.en || '';
  };

  const getBody = (post: Post) => {
    if (Array.isArray(post.body)) return post.body;
    return post.body?.[language] || post.body?.en || [];
  };

  if (loading) return <div className="min-h-screen bg-[#140F2D]"><Header /><div className="pt-[5cm] text-white text-center">Loading...</div></div>;
  if (error) return <div className="min-h-screen bg-[#140F2D]"><Header /><div className="pt-[5cm] text-white text-center">{error}</div></div>;
  if (!post) return <div className="min-h-screen bg-[#140F2D]"><Header /><div className="pt-[5cm] text-white text-center">Post not found</div></div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="relative mx-auto bg-[#140F2D]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-[5cm]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <article className="prose lg:prose-xl lg:col-span-2">
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
              <div className="text-white">
                <PortableText
                  value={getBody(post)}
                  components={portableTextComponents}
                />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-16 sticky top-80">
                {/* Popular Posts */}
                  {allPosts.length > 0 ? (
                    <PopularPosts posts={allPosts.slice(0, 5)} />
                  ) : (
                    <p className="text-gray-400 text-sm">No posts available</p>
                  )}
                

                {/* Proposed Posts */}
                <div className="shadow-sm rounded-lg p-6 sticky top-4 ring-1 ring-white/40"
      style={{ backgroundColor: '#140F2D' }}
      >
                  <h2 className="text-xl font-bold mb-4 text-white">{t.relatedPosts}</h2>
                  {allPosts.length > 0 ? (
                    <ProposedPosts currentPost={post} allPosts={allPosts} />
                  ) : (
                    <p className="text-gray-400 text-sm">No related posts available</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
