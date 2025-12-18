// src/Blog.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Contact from "./components/Contact";
import BlogPost from "./components/BlogPost";
import PopularPosts from "./components/PopularPosts";
import NewsletterModal from "./components/NewsletterModal";
import BlogHero from "./components/BlogHero"; // Add this import
import type { Post } from "./types/sanity.types";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { ChevronLeft, ChevronRight, Search, ArrowUpRight } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { translations } from "./translations/translations";
import Footer from "./components/Footer";
import { usePosts, usePrefetchPost } from "./hooks/useBlogPosts";

const POSTS_PER_PAGE = 5;

const Blog = () => {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const location = useLocation();

  const { data: posts = [], isLoading, error } = usePosts();
  const prefetchPost = usePrefetchPost();

  useEffect(() => {
    const element = document.getElementById("blog-posts");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useScrollToTop();

  const getTitle = React.useCallback(
    (post: Post) => {
      if (typeof post.title === "string") return post.title;
      return post.title?.[language] || post.title?.en || "";
    },
    [language]
  );

  const getExcerpt = React.useCallback(
    (post: Post) => {
      if (typeof post.excerpt === "string") return post.excerpt;
      return post.excerpt?.[language] || post.excerpt?.en || "";
    },
    [language]
  );

  const getBodyText = React.useCallback((post: Post) => {
    if (!post.body) return "";
    return post.body
      .filter((block) => block._type === "block")
      .map((block) => {
        if (!block.children) return "";
        return block.children.map((child) => child.text || "").join(" ");
      })
      .join(" ");
  }, []);

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
    document
      .getElementById("blog-posts")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <Header />
      <main className="relative">
        {/* New Compact Hero Section */}
        <BlogHero />

        {/* Blog Content Section */}
        <section id="blog-posts" className="bg-[#140F2D] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Newsletter Subscribe Button */}
            <div className="mb-4 text-left">
              <button
                onClick={() => setIsNewsletterOpen(true)}
                className="inline-flex items-center rounded-md border border-transparent font-jakarta text-white hover:text-teal-300"
              >
                {t.newsletter}
                <ArrowUpRight className="-mr-1 ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 transform text-white/50" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                          onTouchStart={() => prefetchPost(post.slug.current)}
                          className="group block"
                          state={{
                            summary: post,
                            fromBlogList: true,
                          }}
                        >
                          <BlogPost post={post} />
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-white disabled:opacity-50"
                      >
                        <ChevronLeft />
                      </button>
                      <span className="text-white">
                        {t.page} {currentPage} {t.of}{" "}
                        {Math.ceil(filteredPosts.length / POSTS_PER_PAGE)}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage ===
                          Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
                        }
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
                  <div className="rounded-lg p-4 ring-1 ring-white/40">
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
