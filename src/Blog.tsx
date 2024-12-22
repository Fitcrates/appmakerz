import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useScrollToTop();

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

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const tagsMatch = post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const contentMatch = post.body ? searchInPortableText(post.body) : false;
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      return titleMatch || tagsMatch || contentMatch || excerptMatch;
    });
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to the first page when search changes
  }, [searchQuery, posts]);

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
      <main className="bg-[#140F2D]">
        {/* Hero Section */}
        <section
          id="blog-hero"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            backgroundImage: `url(https://i.postimg.cc/VsR5xjyL/tlohero.png)`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
          }}
          className="min-h-screen h-screen w-full flex items-end bg-fixed pb-16 relative"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-end px-4 sm:px-8 relative z-10">
            {/* Left Section: Heading */}
            <div className="flex flex-col justify-end mb-8 md:mb-0">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta leading-[0.9]">
                {t.header1}
              </h1>
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta leading-[0.9]">
                {t.header2}
              </h1>
            </div>

            {/* Right Section: Text + Arrow */}
            <div className="flex items-end space-x-2 md:-space-x-6">
              {/* Text Column */}
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-0">
                  <span className="text-lg sm:text-xl md:text-3xl text-gray-900 tracking-wide font-jakarta font-extralight -mb-2">
                    {t.header3}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-gray-900 tracking-wide font-jakarta font-extralight -mb-2">
                    {t.header4}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-gray-900 tracking-wide font-jakarta font-extralight -mb-2">
                    {t.header5}
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-gray-900 tracking-wide font-jakarta font-extralight -mb-2">
                    {t.header6}
                  </span>
                </div>
              </div>

              {/* Arrow Column */}
              <div className="flex justify-end ml-2 md:ml-4">
                <a
                  href="#blog-posts"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 hover:scale-125 flex items-end cursor-pointer"
                >
                  <ArrowUpRight
                    className="w-auto h-32 md:h-60 -mb-8 md:-mb-16"
                    strokeWidth={0.7}
                    strokeLinecap="butt"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section id="blog-posts" className="py-16">
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
                  <div className="bg-white/5 rounded-lg p-6 mb-8">
                    <h2 className="text-xl text-white mb-4 font-jakarta">{t.recentPosts}</h2>
                    <PopularPosts posts={posts.slice(0, 5)} />
                  </div>

                  <div className="bg-white/5 rounded-lg p-6">
                    <h2 className="text-xl text-white mb-4 font-jakarta">{t.categories}</h2>
                    <div className="space-y-2">
                      {/* Add your categories here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Contact />
    </div>
  );
};

export default Blog;
