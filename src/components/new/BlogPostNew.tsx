import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { urlFor } from '../../lib/sanity.client';
import type { Post } from '../../types/sanity.types';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';

interface BlogPostNewProps {
  post: Post;
  index: number;
}

const BlogPostNew: React.FC<BlogPostNewProps> = ({ post, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const { language } = useLanguage();
  const t = translations[language].blog.post;

  const getTitle = () => {
    if (typeof post.title === 'string') return post.title;
    return post.title?.[language] || post.title?.en || '';
  };

  const getExcerpt = () => {
    if (typeof post.excerpt === 'string') return post.excerpt;
    return post.excerpt?.[language] || post.excerpt?.en || '';
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <a href={`/posts/${post.slug.current}`} className="group block h-full">
        <div className="relative overflow-hidden border border-white/10 hover:border-teal-300/30 transition-all duration-500 h-[480px] flex flex-col">
          {/* Image - fixed height */}
          <div className="relative h-48 flex-shrink-0 overflow-hidden bg-indigo-900/50">
            {post.mainImage ? (
              <>
                <img
                  src={urlFor(post.mainImage).width(800).height(400).url()}
                  alt={getTitle()}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-indigo-950/40 group-hover:bg-indigo-950/20 transition-colors duration-500" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-indigo-950" />
            )}
          </div>

          {/* Content - flex grow to fill remaining space */}
          <div className="p-6 flex-1 flex flex-col min-h-0">
            {/* Category - fixed height area */}
            <div className="flex gap-2 mb-3 h-6 flex-shrink-0">
              {post.categories && post.categories.length > 0 ? (
                post.categories.slice(0, 2).map((category: any, idx: number) => (
                  <span 
                    key={idx}
                    className="text-xs px-3 py-1 bg-teal-300/10 text-teal-300 font-jakarta tracking-wider uppercase"
                  >
                    {typeof category === 'string' ? category : category?.title?.[language] || category?.title?.en || ''}
                  </span>
                ))
              ) : null}
            </div>

            {/* Title - fixed height with line clamp */}
            <h3 className="text-lg lg:text-xl font-light text-white font-jakarta mb-3 group-hover:text-teal-300 transition-colors duration-300 line-clamp-2 flex-shrink-0">
              {getTitle()}
            </h3>

            {/* Excerpt - flexible but clamped */}
            <p className="text-white/40 font-jakarta font-light text-sm leading-relaxed line-clamp-3 flex-shrink-0 mb-4">
              {getExcerpt()}
            </p>

            {/* Spacer to push footer down */}
            <div className="flex-1" />

            {/* Footer - always at bottom */}
            <div className="flex items-center justify-between flex-shrink-0 pt-4 border-t border-white/5">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-900/50 flex-shrink-0">
                  {post.author?.image ? (
                    <img
                      src={urlFor(post.author.image).width(40).height(40).url()}
                      alt={post.author.name || t.author}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-300/20" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-jakarta truncate">{post.author?.name || 'Author'}</p>
                  <p className="text-xs text-white/30 font-jakarta">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Read more arrow */}
              <div className="w-9 h-9 border border-white/10 flex items-center justify-center group-hover:border-teal-300 group-hover:bg-teal-300 transition-all duration-300 flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-indigo-950 transition-colors" />
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-teal-300/0 group-hover:border-teal-300/50 transition-colors duration-500" />
        </div>
      </a>
    </motion.div>
  );
};

export default BlogPostNew;
