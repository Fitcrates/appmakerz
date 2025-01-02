import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Contact from './components/Contact';
import BlogPost from './components/BlogPost';
import PopularPosts from './components/PopularPosts';
import { getPosts } from './lib/sanity.client';
import type { Post } from './types/sanity.types';
import { useScrollToTop } from './hooks/useScrollToTop';
import { ArrowDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { translations } from './translations/translations';
import ProposedPosts from './components/ProposedPosts';
import Footer from './components/Footer';

const POSTS_PER_PAGE = 5;

const Blog = () => {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
// State to manage hover
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Scroll to the blog posts section when the component mounts
    const element = document.getElementById('blog-posts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useScrollToTop();

  useEffect(() => {
    const filtered = posts.filter((post) => {
      // Handle both string and object title formats
      const getTitle = () => {
        if (typeof post.title === 'string') return post.title;
        return (post.title?.[language] || post.title?.en || '');
      };

      // Handle both string and object excerpt formats
      const getExcerpt = () => {
        if (typeof post.excerpt === 'string') return post.excerpt;
        return (post.excerpt?.[language] || post.excerpt?.en || '');
      };

      // Handle both array and object body formats
      const getBody = () => {
        if (Array.isArray(post.body)) return post.body;
        return (post.body?.[language] || post.body?.en || []);
      };

      const titleMatch = getTitle().toLowerCase().includes(searchQuery.toLowerCase());
      const tagsMatch = post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const contentMatch = post.body ? searchInPortableText(getBody()) : false;
      const excerptMatch = getExcerpt().toLowerCase().includes(searchQuery.toLowerCase());

      return titleMatch || tagsMatch || contentMatch || excerptMatch;
    });
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to the first page when search changes
  }, [searchQuery, posts, language]);

  const searchInPortableText = (blocks: any[]) => {
    return blocks.some((block) => {
      if (block._type === 'block' && block.children) {
        return block.children.some(
          (child: any) =>
            child.text &&
            child.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return false;
    });
  };

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
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section
        id="blog-hero"
        className="hero-section  min-h-screen h-screen w-full flex items-end pb-24 overflow-x-hidden"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 h-full">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-8">
            {/* Centered Text Section */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              {/* Large White Headings */}
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-snug -mt-4">
                {t.header1}
              </h1>
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-snug -mt-4">
                {t.header2}
              </h1>
            </div>

            {/* Desktop View: Black Subtext and Arrow in Two Columns */}
            <div className="hidden md:flex flex-row items-center justify-end w-full mt-20 md:mt-16 -mb-20 -space-x-6 md:-space-x-6">
              {/* Text Column */}
              <div className="text-left flex flex-col leading-loose">
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.header3}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.header4}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.header5}
                </span>
                <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mt-1">
                  {t.header6}
                </span>
              </div>

              {/* Arrow Section */}
            <div
              className="flex items-end md:ml-8 mt-6 md:mt-0 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)} // Handle hover start
              onMouseLeave={() => setIsHovered(false)} // Handle hover end
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
                  <ArrowDown
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
            <div className="md:hidden flex flex-col items-center justify-center w-full mt-12 mb-36">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-6 bg-teal-300 text-gray-900 rounded-full hover:bg-teal-600 transition-colors duration-300 flex items-center space-x-2 font-jakarta font-medium text-lg"
              >
                <span>Learn More</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

        {/* Blog Content Section */}
        <section id="blog-posts" className="py-16 bg-[#140F2D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {loading ? (
                  <div className="text-white">{t.loading}</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <>
                    {/* Blog Posts */}
                    <div className="space-y-8">
                      {getCurrentPagePosts().map((post) => (
                        <Link key={post._id} to={`/blog/${post.slug.current}`}>
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
    </div>
  );
};

export default Blog;
