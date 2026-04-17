'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { urlFor } from '@/lib/sanity.image';
import { getLocalizedText } from '@/lib/localize';
import { translations } from '@/translations/translations';

interface BlogIndexClientProps {
  posts: any[];
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) => {
      const title = getLocalizedText(post.title, language);
      return title.toLowerCase().includes(normalizedQuery);
    });
  }, [language, posts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <>
      <div className="mb-16">
        <div className="relative max-w-md">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder={t.search || 'Search posts...'}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent border-b border-white/10 focus:border-teal-300 pl-8 pr-4 py-3 text-white font-jakarta placeholder:text-white/30 outline-none transition-colors"
          />
        </div>
      </div>

      {paginatedPosts.length ? (
        <div id="blog-posts" className="space-y-6">
          {paginatedPosts.map((post) => {
            const title = getLocalizedText(post.title, language);
            const excerpt = getLocalizedText(post.excerpt, language);
            const category = Array.isArray(post.categories) && post.categories.length > 0
              ? getLocalizedText(post.categories[0]?.title, language)
              : '';
            const imageUrl = post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : '';

            return (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="group block">
                <div className="relative overflow-hidden border border-white/10 hover:border-teal-300/30 transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:h-[250px]">
                    {imageUrl ? (
                      <div className="relative w-full md:w-72 lg:w-80 h-48 md:h-full flex-shrink-0 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-indigo-950/30 group-hover:bg-indigo-950/10 transition-colors duration-500" />
                      </div>
                    ) : null}

                    <div className="flex-1 p-4 flex flex-col">
                      <div>
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          {category ? (
                            <span className="text-xs px-3 py-1 bg-teal-300/10 text-teal-300 font-jakarta tracking-wider uppercase">
                              {category}
                            </span>
                          ) : null}
                          <span className="text-xs text-white/30 font-jakarta">
                            {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <h2 className="text-xl lg:text-2xl font-light text-white font-jakarta mb-3 group-hover:text-teal-300 transition-colors duration-300 line-clamp-2">
                          {title}
                        </h2>

                        <p className="text-white/40 font-jakarta font-light text-sm leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-white/50 group-hover:text-teal-300 transition-colors duration-300">
                        <span className="text-sm font-jakarta">{t.readMore}</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-teal-300/0 group-hover:border-teal-300/50 transition-colors duration-500" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-white/40 font-jakarta">{t.noPosts}</p>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex justify-center gap-2 mt-16">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrentPage(index + 1);
                document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-10 h-10 border font-jakarta text-sm transition-all duration-300 ${
                currentPage === index + 1
                  ? 'border-teal-300 bg-teal-300 text-indigo-950'
                  : 'border-white/10 text-white/50 hover:border-teal-300 hover:text-teal-300'
              }`}
            >
              <span className="notranslate">{index + 1}</span>
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
