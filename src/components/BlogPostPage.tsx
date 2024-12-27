//individual blog post page
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost, incrementPostView } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';
import Header from './Header';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanity.client';
import { portableTextComponents } from './PortableTextComponents';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        if (slug) {
          const fetchedPost = await getPost(slug);
          if (!isMounted) return;

          if (fetchedPost?._id) {
            // First set the post with an optimistically incremented view count
            setPost({
              ...fetchedPost,
              viewCount: (fetchedPost.viewCount || 0) + 1
            });
            setLoading(false);

            // Then update the server in the background
            try {
              const updatedPost = await incrementPostView(fetchedPost._id);
              if (!isMounted) return;
              // Only update if the server count is different from our optimistic update
              if (updatedPost.viewCount !== (fetchedPost.viewCount || 0) + 1) {
                setPost(prev => prev ? { ...prev, viewCount: updatedPost.viewCount } : null);
              }
            } catch (err) {
              console.error('Error incrementing view count:', err);
              // Revert to original count if the server update failed
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

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Handle both old and new post formats
  const getTitle = (post: Post) => {
    if (typeof post.title === 'string') return post.title;
    return post.title?.[language] || post.title?.en || '';
  };

  const getBody = (post: Post) => {
    if (Array.isArray(post.body)) return post.body;
    return post.body?.[language] || post.body?.en || [];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mx-auto"
      style={{ backgroundColor: '#140F2D' }}
      >
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 pt-[5cm]">
          <article className="prose lg:prose-xl">
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
        </main>
      </div>
    </motion.div>
  );
};

export default BlogPostPage;
