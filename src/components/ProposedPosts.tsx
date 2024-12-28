import React from 'react';
import { Link } from 'react-router-dom';
import { urlFor } from '../lib/sanity.client';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface Post {
  _id: string;
  title: {
    en: string;
    pl: string;
  } | string;
  slug: {
    current: string;
  };
  mainImage: any;
  publishedAt: string;
  categories?: string[];
  tags?: string[];
  viewCount?: number;
}

interface ProposedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

const ProposedPosts: React.FC<ProposedPostsProps> = ({ currentPost, allPosts }) => {
  const { language } = useLanguage();
  const t = translations[language].popularPosts;

  // Debug logging
  console.log('Current post:', {
    id: currentPost._id,
    categories: currentPost.categories,
  });

  console.log('All posts:', allPosts.map(post => ({
    id: post._id,
    categories: post.categories,
  })));

  // Filter posts with the same category, excluding the current post
  const relatedPosts = allPosts
    .filter(post => {
      // Skip current post
      if (post._id === currentPost._id) {
        return false;
      }

      // Check for matching categories
      const hasMatchingCategory = 
        currentPost.categories?.length && post.categories?.length
          ? currentPost.categories.some(category => 
              post.categories?.includes(category)
            )
          : false;

      console.log('Match result:', {
        postId: post._id,
        currentCategories: currentPost.categories,
        postCategories: post.categories,
        hasMatchingCategory,
      });

      return hasMatchingCategory;
    })
    .slice(0, 5); // Limit to 5 posts

  console.log('Final related posts:', relatedPosts);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {relatedPosts.map((post) => (
        <Link 
          key={post._id} 
          to={`/blog/${post.slug.current}`}
          className="flex items-center gap-3 group"
        >
          {post.mainImage && (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/40">
              <img
                src={urlFor(post.mainImage).width(64).height(64).url()}
                alt={typeof post.title === 'string' ? post.title : (post.title?.[language] || post.title?.en)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-medium text-white group-hover:text-teal-300 transition-colors duration-200 line-clamp-2">
              {typeof post.title === 'string' ? post.title : (post.title?.[language] || post.title?.en)}
            </h4>
            <p className="text-sm text-white">
              {post.viewCount || 0} {t.views} • {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProposedPosts;
