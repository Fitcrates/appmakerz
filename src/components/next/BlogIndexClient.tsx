'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useLanguage } from '@/context/LanguageContext';
import { urlFor } from '@/lib/sanity.image';
import { getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import { translations } from '@/translations/translations';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import ResponsiveElectricLogo from '@/components/next/ResponsiveElectricLogo';

interface BlogIndexClientProps {
  posts: any[];
  featuredPosts?: any[];
  categories?: any[];
  title: string;
  subtitle: string;
}

function getCategorySlug(category: any): string {
  if (typeof category === 'string') return category.toLowerCase();
  return category?.slug?.current || '';
}

function getCategoryLabel(category: any, language: Language): string {
  if (typeof category === 'string') return category;
  return getLocalizedText(category?.title, language);
}

export default function BlogIndexClient({ posts, featuredPosts = [], categories = [], title, subtitle }: BlogIndexClientProps) {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const allCategoriesLabel = language === 'pl' ? 'Wszystkie' : 'All';

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      const title = getLocalizedText(post.title, language);
      const excerpt = getLocalizedText(post.excerpt, language);
      const tags = Array.isArray(post.tags) ? post.tags.join(' ') : '';
      const postCategories = Array.isArray(post.categories) ? post.categories : [];
      const categoryLabels = postCategories
        .map((category: any) => getCategoryLabel(category, language))
        .join(' ');
      const matchesSearch = !normalizedQuery
        || `${title} ${excerpt} ${tags} ${categoryLabels}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = !selectedCategory
        || postCategories.some((category: any) => getCategorySlug(category) === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [language, posts, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const promotedPosts = featuredPosts.slice(0, 6);
  const promotedHeading = language === 'pl' ? 'Polecane' : 'Featured';

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 mb-12 lg:mb-12 2xl:mb-16 items-center">
        <div className="order-2 lg:order-2">


          <div className="mb-8">
            <BurnSpotlightText
              as="h1"
              className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-white font-oxanium "
              glowSize={200}
              baseDelay={200}
            >
              {title}
            </BurnSpotlightText>
          </div>

          <div className="text-white/40  font-light text-lg max-w-xl">
            <p>{subtitle}</p>
          </div>
        </div>

        <div className="order-1 lg:order-1 flex justify-center lg:justify-start">
          <ResponsiveElectricLogo
            src="/media/AppcratesLogo.webp"
            alt="AppCrates Logo"
            desktopClassName="w-40 lg:w-64 xl:w-72 2xl:w-96"
            mobileClassName="w-40"
          />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/10 mb-12 gap-6 relative">
        
        {/* CATEGORIES TABS */}
        <div className="flex gap-6 lg:gap-8 overflow-x-auto w-full lg:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.length ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
                className={`relative whitespace-nowrap pb-4 text-[0.75rem] lg:text-[0.8rem] tracking-[0.15em] uppercase transition-colors duration-300 ${
                  selectedCategory === ''
                    ? 'text-teal-300 font-medium'
                    : 'text-white/40 hover:text-teal-300/70'
                }`}
              >
                {allCategoriesLabel}
                {selectedCategory === '' && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)]" />
                )}
              </button>

              {categories.map((category) => {
                const slug = getCategorySlug(category);
                const label = getLocalizedText(category.title, language);
                if (!slug || !label) return null;

                return (
                  <button
                    key={category._id || slug}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(slug);
                      setCurrentPage(1);
                    }}
                    className={`relative whitespace-nowrap pb-4 text-[0.75rem] lg:text-[0.8rem] tracking-[0.15em] uppercase transition-colors duration-300 ${
                      selectedCategory === slug
                        ? 'text-teal-300 font-medium'
                        : 'text-white/40 hover:text-teal-300/70'
                    }`}
                  >
                    {label}
                    {selectedCategory === slug && (
                      <motion.div layoutId="activeTab" className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)]" />
                    )}
                  </button>
                );
              })}
            </>
          ) : null}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full lg:w-72 flex-shrink-0 group pb-4 lg:pb-3">
          <Search className="absolute left-0 top-[35%] lg:top-[20%] -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-teal-300 transition-colors duration-300" />
          <input
            type="text"
            placeholder={t.search || 'Search posts...'}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent pl-7 pr-2 py-1 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-300"
          />
          <div className="absolute -bottom-[1px] left-0 w-0 group-focus-within:w-full h-[2px] bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)] transition-all duration-500 ease-out" />
        </div>
      </div>

      <div className={`grid gap-10 xl:gap-12 ${promotedPosts.length ? 'lg:grid-cols-[minmax(0,1fr)_18rem]' : ''}`}>
        <div>
          {paginatedPosts.length ? (
            <div id="blog-posts" className="space-y-6">
              {paginatedPosts.map((post) => {
                const postTitle = getLocalizedText(post.title, language);
                const excerpt = getLocalizedText(post.excerpt, language);
                const category = Array.isArray(post.categories) && post.categories.length > 0
                  ? getCategoryLabel(post.categories[0], language)
                  : '';
                const imageUrl = post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : '';

                return (
                  <PrefetchLink key={post._id} href={localizedPath(language, `/blog/${post.slug.current}`)} className="group block">
                    <div className="relative overflow-hidden border border-white/10 hover:border-teal-300/30 transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:h-[250px]">
                        {imageUrl ? (
                          <div className="relative w-full md:w-64 xl:w-80 h-48 md:h-full flex-shrink-0 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={postTitle}
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
                                <span className="text-[0.65rem] px-3 py-1 border border-teal-300/20 bg-teal-300/5 text-teal-300 tracking-[0.2em] uppercase group-hover:border-teal-300/40 group-hover:bg-teal-300/10 transition-colors duration-500">
                                  {category}
                                </span>
                              ) : null}
                              <span className="text-xs text-white/30 ">
                                {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>

                            <h2 className="text-xl lg:text-2xl font-light font-oxanium text-white  mb-3 group-hover:text-teal-300 transition-colors duration-300 line-clamp-2">
                              {postTitle}
                            </h2>

                            <p className="text-white/40  font-light text-sm leading-relaxed line-clamp-3">
                              {excerpt}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-2 text-white/50 group-hover:text-teal-300 transition-colors duration-300">
                            <span className="text-sm ">{t.readMore}</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-teal-300/0 group-hover:border-teal-300/50 transition-colors duration-500" />
                    </div>
                  </PrefetchLink>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white/40 ">{t.noPosts}</p>
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
                  className={`w-10 h-10 border  text-sm transition-all duration-300 ${currentPage === index + 1
                    ? 'border-teal-300 bg-teal-300 text-indigo-950'
                    : 'border-white/10 text-white/50 hover:border-teal-300 hover:text-teal-300'
                    }`}
                >
                  <span className="notranslate">{index + 1}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {promotedPosts.length ? (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="border-b border-white/10 pb-4 text-sm font-light text-white/75">
              {promotedHeading}
            </h2>
            <div className="mt-5 space-y-5">
              {promotedPosts.map((post) => {
                const postTitle = getLocalizedText(post.title, language);
                const imageUrl = post.mainImage ? urlFor(post.mainImage).width(96).height(72).fit('crop').auto('format').url() : '';

                return (
                  <PrefetchLink
                    key={post._id}
                    href={localizedPath(language, `/blog/${post.slug.current}`)}
                    className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-3"
                  >
                    <div className="relative h-16 overflow-hidden bg-white/5">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={postTitle}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-sm leading-snug text-white/75 transition-colors duration-200 group-hover:text-teal-300">
                        {postTitle}
                      </h3>
                      <p className="mt-1 text-[0.68rem] uppercase tracking-[0.08em] text-white/30">
                        {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </PrefetchLink>
                );
              })}
            </div>
          </aside>
        ) : null}
      </div>
    </>
  );
}
