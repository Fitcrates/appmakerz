import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { usePopularPosts, usePrefetchPost } from '../hooks/useBlogPosts';
import { urlFor } from '../lib/sanity.client';

const PopularPosts = () => {
  const { language } = useLanguage();
  const t = translations[language].blog;
  
  const { data: popularPosts = [], isLoading, error } = usePopularPosts();
  const prefetchPost = usePrefetchPost();

  if (isLoading) {
    return (
      <div className="shadow-sm rounded-lg p-6 sticky top-4 ring-1 ring-white/40"
      style={{ backgroundColor: '#140F2D' }}
      >
        <h3 className="text-xl font-bold mb-4 text-white">{t.title}</h3>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-16 bg-white rounded-lg mb-4"></div>
            <div className="h-16 bg-white rounded-lg mb-4"></div>
            <div className="h-16 bg-white rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shadow-sm rounded-lg p-6 sticky top-4 ring-1 ring-white/40"
      style={{ backgroundColor: '#140F2D' }}
      >
        <h3 className="text-xl font-bold mb-4 text-white">{t.title}</h3>
        <div className="space-y-4">
          <p className="text-white">Error fetching popular posts: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg sticky top-4"
    style={{ backgroundColor: '#140F2D' }}
    >
      <h3 className="text-xl font-bold mb-4 text-white">{t.popularPosts}</h3>
      <div className="space-y-4">
        {popularPosts.map((post) => (
          <Link 
            key={post._id} 
            to={`/blog/${post.slug.current}`}
            onMouseEnter={() => prefetchPost(post.slug.current)}
            className="flex items-center gap-3 group"
          >
            {post.mainImage && (
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/40">
                <img
                  src={urlFor(post.mainImage).width(64).height(64).url()}
                  alt={typeof post.title === 'string' ? post.title : post.title?.[language] || post.title?.en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-white group-hover:text-teal-300 transition-colors duration-200 line-clamp-2">
                {typeof post.title === 'string' ? post.title : post.title?.[language] || post.title?.en}
              </h4>
              <p className="text-sm text-white/60">
                {post.viewCount || 0} {t.views} • {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {post.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-teal-300/80 text-black"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
