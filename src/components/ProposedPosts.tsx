import React from 'react';
import { urlFor } from '../lib/sanity.client';
import { Link } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: any;
  publishedAt: string;
  categories?: Array<{
    title: string;
  }>;
  tags?: Array<{
    title: string;
  }>;
}

interface ProposedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

const ProposedPosts: React.FC<ProposedPostsProps> = ({ currentPost, allPosts }) => {
  // Filter posts with the same category or tags, excluding the current post
  const relatedPosts = allPosts
    .filter(post => {
      if (post._id === currentPost._id) return false;

      // Check for matching categories
      const hasMatchingCategory = currentPost.categories?.some(category =>
        post.categories?.some(postCategory => postCategory.title === category.title)
      ) ?? false;

      // Check for matching tags
      const hasMatchingTag = currentPost.tags?.some(tag =>
        post.tags?.some(postTag => postTag.title === tag.title)
      ) ?? false;

      return hasMatchingCategory || hasMatchingTag;
    })
    .slice(0, 5); // Limit to 5 posts

  if (relatedPosts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Proposed Posts
        </h2>

        <div className="grid gap-6">
          {relatedPosts.map((post) => (
            <Link 
              to={`/blog/${post.slug.current}`}
              key={post._id}
              className="flex items-center space-x-4 group"
            >
              {post.mainImage && (
                <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                  <img
                    src={urlFor(post.mainImage).width(80).height(80).url()}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-500">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposedPosts;
