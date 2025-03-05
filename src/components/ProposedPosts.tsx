import React from 'react';
import { Link,  } from 'react-router-dom';
import { urlFor } from '../lib/sanity.client';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { useProposedPosts } from '../hooks/useBlogPosts';
import type { Post, Category } from '../types/sanity.types';

interface ProposedPostsProps {
  posts?: Post[];
}

const ProposedPosts: React.FC<ProposedPostsProps> = ({ posts: propPosts }) => {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const { data: fetchedPosts = [], isLoading } = useProposedPosts();
  
  // Use provided posts if available, otherwise use fetched posts
  const posts = propPosts && propPosts.length > 0 ? propPosts : fetchedPosts;

  const getTitle = (post: Post) => {
    if (!post?.title) return '';
    return typeof post.title === 'string' ? post.title : (post.title[language] || post.title.en || '');
  };

  // Helper function to get category title based on language
  const getCategoryTitle = (category) => {
    if (typeof category === 'string') return category;
    if (!category || !category.title) return '';
    return category.title[language] || category.title.en || '';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-16 bg-white/10 rounded-lg mb-4"></div>
          <div className="h-16 bg-white/10 rounded-lg mb-4"></div>
          <div className="h-16 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <p className="text-white/60 font-jakarta">{t.noRelatedPosts}</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/blog/${post.slug.current}`}
          className="block group"
        >
          <div className="flex items-start space-x-4">
            {post.mainImage && (
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/40">
                <img
                  src={urlFor(post.mainImage).width(80).height(80).url()}
                  alt={getTitle(post)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-white group-hover:text-teal-300 transition-colors line-clamp-2 font-jakarta">
                {getTitle(post)}
              </h3>
              <p className="text-sm text-white/60 mt-1 font-jakarta">
              {post.viewCount || 0} {t.views} • {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {post.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-teal-300/80 text-black font-jakarta"
                    >
                      {getCategoryTitle(category)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProposedPosts;
