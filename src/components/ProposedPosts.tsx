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
  posts: Post[];
}

const ProposedPosts: React.FC<ProposedPostsProps> = ({ posts }) => {
  const { language } = useLanguage();
  const t = translations[language].blog;

  const getTitle = (post: Post) => {
    if (!post?.title) return '';
    return typeof post.title === 'string' ? post.title : (post.title[language] || post.title.en || '');
  };

  if (!posts || posts.length === 0) {
    return <p className="text-white/60">{t.noRelatedPosts}</p>;
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
              <h3 className="font-medium text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                {getTitle(post)}
              </h3>
              <p className="text-sm text-white/60 mt-1">
                {new Date(post.publishedAt).toLocaleDateString()} • {post.viewCount || 0} {t.views}
              </p>
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {post.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60"
                    >
                      {category}
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
