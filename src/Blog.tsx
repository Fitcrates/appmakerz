import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Contact from './components/Contact';
import BlogPost from './components/BlogPost';
import PopularPosts from './components/PopularPosts';
import NewsletterModal from './components/NewsletterModal';
import type { Post } from './types/sanity.types';
import { useScrollToTop } from './hooks/useScrollToTop';
import { ArrowDownRight, ChevronLeft, ChevronRight, Search, ArrowUpRight } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations/translations';
import ProposedPosts from './components/ProposedPosts';
import Footer from './components/Footer';
import { usePosts, usePrefetchPost } from './hooks/useBlogPosts';

const POSTS_PER_PAGE = 5;

const Blog = () => {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const { data: posts = [], isLoading, error } = usePosts();
  const prefetchPost = usePrefetchPost();

  useEffect(() => {
    // Scroll to the blog posts section when the component mounts
    const element = document.getElementById('blog-posts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useScrollToTop();

  // Memoize expensive text extraction functions
  const getTitle = React.useCallback((post: Post) => {
    if (typeof post.title === 'string') return post.title;
    return (post.title?.[language] || post.title?.en || '');
  }, [language]);

  const getExcerpt = React.useCallback((post: Post) => {
    if (typeof post.excerpt === 'string') return post.excerpt;
    return (post.excerpt?.[language] || post.excerpt?.en || '');
  }, [language]);

  const getBodyText = React.useCallback((post: Post) => {
    if (!post.body) return '';
    return post.body
      .filter(block => block._type === 'block')
      .map(block => {
        if (!block.children) return '';
        return block.children
          .map(child => child.text || '')
          .join(' ');
      })
      .join(' ');
  }, []);

  // Memoize filtered posts to avoid unnecessary re-filtering
  useEffect(() => {
    if (posts.length === 0) return;
    
    const query = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      const title = getTitle(post).toLowerCase();
      const excerpt = getExcerpt(post).toLowerCase();
      const bodyText = getBodyText(post).toLowerCase();

      return (
        title.includes(query) || 
        excerpt.includes(query) || 
        bodyText.includes(query)
      );
    });

    setFilteredPosts(filtered);
  }, [posts, searchQuery, language, getTitle, getExcerpt, getBodyText]);

  const getCurrentPagePosts = () => {
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <div className="fixed-bg"></div>

          <section 
            id="blog-hero" 
            className="min-h-screen h-screen w-full flex items-end pb-20 overflow-x-hidden"
  
>
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end w-full">
              {/* Text Container */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta  leading-none -mt-1">
                  {t.header1}
                </h1>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tight font-jakarta  leading-none -mt-1">
                  {t.header2}
                </h1>
              </div>

              {/* Desktop View: Black Subtext and Arrow */}
              <div className="hidden lg:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-12">
                {/* Text Column */}
                <div className="text-left flex flex-col leading-loose">
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
                    {t.header3}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
                    {t.header4}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
                    {t.header5}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-[-0.015em] font-jakarta font-extralight">
                    {t.header6}
                  </span>
                </div>

                {/* Arrow Section */}
                <div
                  className="flex items-end md:ml-8 mt-6 md:mt-0 cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <a
                    href="#blog-posts"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-1000 flex items-center"
                  >
                    {isHovered ? (
                      <ArrowDownRight
                        className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0 transition-transform duration-1000 transform rotate-360"
                        strokeWidth={0.7}
                        strokeLinecap="butt"
                      />
                    ) : (
                      <ArrowUpRight
                        className="w-20 h-72 sm:w-72 sm:h-72 md:w-72 md:h-72 mb-0 transition-transform duration-1000"
                        strokeWidth={0.7}
                        strokeLinecap="butt"
                      />
                    )}
                  </a>
                </div>
              </div>

              {/* Mobile View: Centered Button */}
              <div className="lg:hidden flex flex-col items-center justify-center w-full mt-16 mb-56">
                <button
                  onClick={() => {
                    document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="GlowButton flex items-center space-x-2 font-jakarta font-normal text-base relative z-10 "
                >
                  <span>{t.readMore}</span>
                  {isHovered ? (
        <ArrowDownRight className="w-6 h-6" />
      ) : (
        <ArrowUpRight className="w-4 h-4" />
      )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section id="blog-posts" className="py-16 bg-[#140F2D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Newsletter Subscribe Button */}
      <div className="text-left mb-4">
        <button
          onClick={() => setIsNewsletterOpen(true)}
          className="inline-flex items-center  border border-transparent hover:text-teal-300 font-jakarta rounded-md text-white"
        >
          {t.newsletter}
          <ArrowUpRight className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="text-white">{t.loading}</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <>
                    {/* Blog Posts */}
                    <div className="space-y-8">
                      {getCurrentPagePosts().map((post) => (
                        <Link
                          key={post._id} 
                          to={`/blog/${post.slug.current}`}
                          onMouseEnter={() => prefetchPost(post.slug.current)}
                          onTouchStart={() => prefetchPost(post.slug.current)} // Add touch support for mobile
                          className="block group"
                          state={{ 
                            summary: post, // Pass summary to BlogPostPage for caching
                            fromBlogList: true // Flag to indicate navigation from blog list
                          }}
                        >
                          <BlogPost post={post} />
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-white disabled:opacity-50"
                      >
                        <ChevronLeft />
                      </button>
                      <span className="text-white">
                        {t.page} {currentPage} {t.of} {Math.ceil(filteredPosts.length / POSTS_PER_PAGE)}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredPosts.length / POSTS_PER_PAGE)}
                        className="px-4 py-2 text-white disabled:opacity-50"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="ring-1 rounded-lg p-4 ring-white/40">
                    <PopularPosts posts={posts.slice(0, 5)} />
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
      
      
      
      {/* Newsletter Modal */}
      <NewsletterModal 
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </div>
  );
};

export default Blog;
