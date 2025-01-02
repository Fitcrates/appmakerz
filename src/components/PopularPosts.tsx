import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlFor } from '../lib/sanity.client';
import { getPopularPosts } from '../lib/sanity.client';
import type { Post } from '../types/sanity.types';
import { translations } from '../translations/translations';
import { useLanguage } from '../context/LanguageContext';

const PopularPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const t = translations[language].popularPosts;

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const popularPosts = await getPopularPosts();
        setPosts(popularPosts);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
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
      <h3 className="text-xl font-bold mb-4 text-white">{t.title}</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link 
            key={post._id} 
            to={`/blog/${post.slug.current}`}
            className="flex items-center gap-3 group"
          >
            {post.mainImage && (
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/40">
                <img
                  src={urlFor(post.mainImage).width(64).height(64).url()}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-white group-hover:text-teal-300 transition-colors duration-200 line-clamp-2">
                {post.title?.[language] || post.title?.en}
              </h4>
              <p className="text-sm text-white">
                {post.viewCount || 0} {t.views} • {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;