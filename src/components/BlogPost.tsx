import React from 'react';
import { urlFor } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface BlogPostProps {
  post: Post;
  allPosts?: Post[];
}

const BlogPost: React.FC<BlogPostProps> = ({ post, allPosts = [] }) => {
  const { language } = useLanguage();
  const t = translations[language].blog.post;

  // Handle both old and new post formats
  const getTitle = () => {
    if (typeof post.title === 'string') return post.title;
    return post.title?.[language] || post.title?.en || '';
  };

  const getExcerpt = () => {
    if (typeof post.excerpt === 'string') return post.excerpt;
    return post.excerpt?.[language] || post.excerpt?.en || '';
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start mb-16 lg:space-x-6">
      {/* Image Section */}
      {post.mainImage && (
        <div className="w-full lg:w-1/2 overflow-hidden rounded-lg shadow-lg">
          <img
            src={urlFor(post.mainImage).width(800).height(600).url()}
            alt={getTitle()}
            className="object-cover w-full h-72 lg:h-96"
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="mt-6 lg:mt-0 lg:w-1/2 p-6 rounded-xl"
        style={{ backgroundColor: '#140F2D' }}
      >
        {/* Category */}
        <p className="text-sm text-teal-300 uppercase mb-2">
          {post.categories?.length > 0 
            ? post.categories.join(', ') 
            : t.category}
        </p>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white dark:text-white hover:underline mb-4">
          {getTitle()}
        </h2>

        {/* Excerpt */}
        <p className="text-white dark:text-white text-sm leading-relaxed mb-4">
          {getExcerpt()}
        </p>

        {/* Read More Link */}
        <a
          href={`/posts/${post.slug.current}`}
          className="inline-block text-teal-300 underline hover:text-teal-400 text-sm"
        >
          {t.readMore}
        </a>

        {/* Author Section */}
        <div className="flex items-center mt-6">
          {post.author?.image && (
            <img
              className="w-10 h-10 rounded-full object-cover object-center"
              src={urlFor(post.author.image).width(40).height(40).url()}
              alt={post.author.name || t.author}
              loading="lazy"
              width="40"
              height="40"
            />
          )}
          <div className="ml-4">
            <p className="text-sm text-gray-300 dark:text-gray-400">{post.author?.role || t.role}</p>
            <h3 className="text-sm font-medium text-teal-300 dark:text-white">{post.author?.name}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
