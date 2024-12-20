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


const POSTS_PER_PAGE = 5;

const Blog = () => {
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

  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col w-full">
        <section
          id="blog-hero"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            backgroundImage: `url(https://i.postimg.cc/VsR5xjyL/tlohero.png)`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className="min-h-screen h-screen w-full flex items-end bg-fixed pb-16"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-end px-4 sm:px-8">
            {/* Left Section: Heading */}
            <div className="flex flex-col justify-end mb-8 md:mb-0">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
                Blog 
              </h1>
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-light text-white tracking-tight font-jakarta font-normal leading-[0.9]">
                Posts
              </h1>
            </div>

            {/* Right Section: Text + Arrow */}
            <div className="flex items-end space-x-2 md:-space-x-6">
              {/* Text Column */}
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-0">
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                    Latest work diaries
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                    travel
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                    fitness, diet
                  </span>
                  <span className="text-lg sm:text-xl md:text-3xl text-black tracking-wide font-jakarta font-extralight -mb-2">
                    and motivation.
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
                  className="text-white hover:text-indigo-500 text-shadow-fuchsia transform transition-transform duration-300 
                  hover:scale-125 flex items-end cursor-pointer"
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




        {/* Blog Posts Section */}
        <section id="blog-posts" className="py-20"
        style={{ backgroundColor: '#140F2D' }}
        >

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
              <div className="w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts by title, content, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-teal-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-inner"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Popular Posts for Mobile */}
            <div className="lg:hidden mb-8">
              <PopularPosts />
            </div>

            
            {loading ? (
              <div className="text-center">
                <p className="text-xl text-gray-600">Loading posts...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-xl text-red-600">{error}</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center">
                <p className="text-xl text-gray-600">
                  {searchQuery
                    ? 'No posts found matching your search.'
                    : 'No posts available.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-8">
                  <div className="flex-1 space-y-8">
                    {currentPosts.map((post, index) => (
                      <Link key={post._id} to={`/blog/${post.slug.current}`}>
                        <BlogPost post={post} isReversed={index % 2 === 1} />
                      </Link>
                    ))}
                  </div>

                  {/* Popular Posts Sidebar for Desktop */}
                  <div className="hidden lg:block w-80">
                    <PopularPosts />
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full text-white hover:bg-teal-100 disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 text-white rounded-full ${
                            currentPage === pageNumber
                              ? 'bg-teal-300 text-white'
                              : 'hover:bg-teal-100'
                          }`}
                          aria-label={`Page ${pageNumber}`}
                        >
                          {pageNumber}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full text-white hover:bg-teal-100 disabled:opacity-50"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <Contact />
        <footer className="bg-[#140F2D] text-xs text-white py-8 text-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Portfolio of Arkadiusz Wawrzyniak. <br /> Graphic design by Weronika Grzesiowska</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Blog;
