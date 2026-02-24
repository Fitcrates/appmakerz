import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { usePopularPosts, usePrefetchPost } from '../../hooks/useBlogPosts';
import { urlFor } from '../../lib/sanity.client';
import { useProximityGlow, getProximityBorderGlowStyle } from '../../context/CursorGlowContext';

const PopularPostsNew = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const { language } = useLanguage();
  const t = translations[language].blog;
  
  const { data: popularPosts = [], isLoading, error } = usePopularPosts();
  const prefetchPost = usePrefetchPost();

  if (isLoading) {
    return (
      <div ref={containerRef} className="space-y-4">
        <h3 className="text-lg font-light text-white font-jakarta mb-6">{t.popularPosts}</h3>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-white/5 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef}>
        <h3 className="text-lg font-light text-white font-jakarta mb-6">{t.popularPosts}</h3>
        <p className="text-white/40 text-sm font-jakarta">Unable to load posts</p>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="text-lg font-light text-white font-jakarta mb-6"
      >
        {t.popularPosts}
      </motion.h3>
      
      <div className="space-y-4">
        {popularPosts.map((post: any, index: number) => (
          <PopularPostItem 
            key={post._id} 
            post={post} 
            index={index}
            language={language}
            t={t}
            prefetchPost={prefetchPost}
          />
        ))}
      </div>
    </div>
  );
};

const PopularPostItem: React.FC<{
  post: any;
  index: number;
  language: string;
  t: any;
  prefetchPost: (slug: string) => void;
}> = ({ post, index, language, t, prefetchPost }) => {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const glowIntensity = useProximityGlow(itemRef as React.RefObject<HTMLElement>, 150);

  const getTitle = () => {
    if (typeof post.title === 'string') return post.title;
    return post.title?.[language] || post.title?.en || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        ref={itemRef}
        to={`/blog/${post.slug.current}`}
        onMouseEnter={() => prefetchPost(post.slug.current)}
        className="flex items-center gap-4 group p-3 -mx-3 border border-transparent hover:border-white/10 transition-all duration-300"
        style={getProximityBorderGlowStyle(glowIntensity)}
      >
        {post.mainImage && (
          <div className="w-16 h-16 overflow-hidden flex-shrink-0">
            <img
              src={urlFor(post.mainImage).width(64).height(64).url()}
              alt={getTitle()}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-white font-jakarta group-hover:text-teal-300 transition-colors duration-200 line-clamp-2">
            {getTitle()}
          </h4>
          <p className="text-xs text-white/30 font-jakarta mt-1">
            {post.viewCount || 0} {t.views} • {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default PopularPostsNew;
