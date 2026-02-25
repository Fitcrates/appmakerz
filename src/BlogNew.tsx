import { useState, useEffect, useRef, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations/translations';
import { usePosts, usePrefetchPost } from './hooks/useBlogPosts';
import { urlFor } from './lib/sanity.client';
import BurnSpotlightText from './components/new/BurnSpotlightText';
import SpotlightText from './components/new/SpotlightText';
import HeaderNew from './components/new/HeaderNew';
import FooterNew from './components/new/FooterNew';
import { CursorGlowProvider } from './context/CursorGlowContext';
import { useProximityGlow, getProximityBorderGlowStyle } from './context/CursorGlowContext';

// Blog post card component - Row layout with image left, content right
const BlogPostCard: React.FC<{ post: any; index: number; language: 'en' | 'pl' }> = ({ post, index, language }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const glowIntensity = useProximityGlow(cardRef as RefObject<HTMLElement>, 200);
  const prefetchPost = usePrefetchPost();

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
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link 
        to={`/blog/${post.slug.current}`} 
        className="group block"
        onMouseEnter={() => prefetchPost(post.slug.current)}
        onFocus={() => prefetchPost(post.slug.current)}
        onTouchStart={() => prefetchPost(post.slug.current)}
      >
        <div 
          className="relative overflow-hidden border border-white/10 hover:border-teal-300/30 transition-all duration-500"
          style={getProximityBorderGlowStyle(glowIntensity)}
        >
          <div className="flex flex-col md:flex-row md:h-[250px]">
            {/* Image - Left side */}
            {post.mainImage && (
              <div className="relative w-full md:w-72 lg:w-80 h-48 md:h-full flex-shrink-0 overflow-hidden">
                <img
                  src={urlFor(post.mainImage).width(400).height(300).url()}
                  alt={getTitle()}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-indigo-950/30 group-hover:bg-indigo-950/10 transition-colors duration-500" />
              </div>
            )}

            {/* Content - Right side */}
            <div className="flex-1 p-4 flex flex-col">
              <div>
                {/* Category & Date */}
                <div className="flex items-center gap-4 mb-4">
                  {post.categories && post.categories.length > 0 && (
                    <span className="text-xs px-3 py-1 bg-teal-300/10 text-teal-300 font-jakarta tracking-wider uppercase">
                      {typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0]?.title?.[language] || post.categories[0]?.title?.en || ''}
                    </span>
                  )}
                  <span className="text-xs text-white/30 font-jakarta">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-light text-white font-jakarta mb-3 group-hover:text-teal-300 transition-colors duration-300 line-clamp-2">
                  {getTitle()}
                </h3>

                {/* Excerpt */}
                <p className="text-white/40 font-jakarta font-light text-sm leading-relaxed line-clamp-3">
                  {getExcerpt()}
                </p>
              </div>

              {/* Read more */}
              <div className="flex items-center gap-2 mt-2 text-white/50 group-hover:text-teal-300 transition-colors duration-300">
                <span className="text-sm font-jakarta">{translations[language as 'en' | 'pl'].blog.readMore}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-teal-300/0 group-hover:border-teal-300/50 transition-colors duration-500" />
        </div>
      </Link>
    </motion.div>
  );
};

const BlogNew = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const t = translations[language].blog;
  
  const { data: posts = [], isLoading } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts by search
  const filteredPosts = posts.filter((post: any) => {
    const title = typeof post.title === 'string' ? post.title : post.title?.[language] || post.title?.en || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Paginate
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <CursorGlowProvider>
      <Helmet>
        <title>{t.title} | AppCrates</title>
        <meta name="description" content={t.subtitle} />
      </Helmet>

      <div className="bg-indigo-950 min-h-screen">
        <HeaderNew />
        
        <main className="pt-32 pb-24">
          <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero section */}
            <div className="mb-16 lg:mb-24">
              {/* Section label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-jakarta">
                  [ Blog ]
                </span>
              </motion.div>

              {/* Title */}
              <div className=" mb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <BurnSpotlightText
                    as="h1"
                    className="text-5xl sm:text-6xl lg:text-8xl font-light text-white font-jakarta"
                    glowSize={180}
                    baseDelay={200}
                    charDelay={35}
                  >
                    {t.title}
                  </BurnSpotlightText>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/40 font-jakarta font-light text-lg max-w-xl"
              >
                <SpotlightText as="p" className="text-lg font-jakarta font-light" glowSize={100}>
                  {t.subtitle}
                </SpotlightText>
              </motion.div>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <div className="relative max-w-md">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  placeholder={t.search || "Search posts..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-teal-300 pl-8 pr-4 py-3 text-white font-jakarta placeholder:text-white/30 outline-none transition-colors"
                />
              </div>
            </motion.div>

            {/* Posts list */}
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-white/10 animate-pulse flex flex-col md:flex-row">
                    <div className="w-full md:w-72 lg:w-80 h-48 md:h-auto bg-white/5" />
                    <div className="flex-1 p-4 space-y-4">
                      <div className="h-4 bg-white/5 rounded w-1/4" />
                      <div className="h-6 bg-white/5 rounded w-3/4" />
                      <div className="h-4 bg-white/5 rounded w-full" />
                      <div className="h-4 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div id="blog-posts" className="space-y-6">
                  {paginatedPosts.map((post: any, index: number) => (
                    <BlogPostCard key={post._id} post={post} index={index} language={language} />
                  ))}
                </div>

                {/* No results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-white/40 font-jakarta">{t.noPosts}</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-16">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 border font-jakarta text-sm transition-all duration-300 ${
                          currentPage === i + 1
                            ? 'border-teal-300 bg-teal-300 text-indigo-950'
                            : 'border-white/10 text-white/50 hover:border-teal-300 hover:text-teal-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <FooterNew />
      </div>
    </CursorGlowProvider>
  );
};

export default BlogNew;
