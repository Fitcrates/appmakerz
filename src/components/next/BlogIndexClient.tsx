'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import { useLanguage } from '@/context/LanguageContext';
import { urlFor } from '@/lib/sanity.image';
import { getLocalizedText, getLocalizedArray } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import type { Language } from '@/lib/language';
import { extractPortableText } from '@/lib/seo';
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      const postCategories = Array.isArray(post.categories) ? post.categories : [];
      postCategories.forEach((category: any) => {
        const slug = getCategorySlug(category);
        if (slug) counts[slug] = (counts[slug] || 0) + 1;
      });
    });
    return counts;
  }, [posts]);

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

          <div className="text-white/70  font-light text-lg max-w-xl">
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
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {categories.length ? (
            <>
              {[{ slug: '', label: allCategoriesLabel, count: posts.length, key: '__all' },
                ...categories
                  .map((category) => ({
                    slug: getCategorySlug(category),
                    label: getCategoryLabel(category, language),
                    count: categoryCounts[getCategorySlug(category)] || 0,
                    key: category._id || getCategorySlug(category),
                  }))
                  .filter((item) => item.slug && item.label),
              ].map((item) => {
                const isActive = selectedCategory === item.slug;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(item.slug);
                      setCurrentPage(1);
                    }}
                    className={`group/filter flex items-baseline gap-1.5 whitespace-nowrap text-[0.72rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive ? 'text-teal-300' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'text-teal-300 drop-shadow-[0_0_6px_rgba(94,234,212,0.8)]'
                          : 'text-white/25 group-hover/filter:text-teal-300/60'
                      }`}
                    >
                      /
                    </span>
                    <span>{item.label}</span>
                    <span className={`text-[0.6rem] tracking-normal notranslate ${isActive ? 'text-teal-300/60' : 'text-white/25'}`}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </>
          ) : null}
        </div>

        {/* SEARCH INPUT */}
        <div className="group relative w-full flex-shrink-0 border-b border-white/15 lg:w-72">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors duration-300 group-focus-within:text-teal-300" />
          <input
            type="text"
            placeholder={t.search || 'Search posts...'}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent py-2 pl-7 pr-2 text-sm text-white placeholder:text-white/30 outline-none"
          />
          <div className="absolute -bottom-[1px] left-0 h-[2px] w-0 bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)] transition-all duration-500 ease-out group-focus-within:w-full" />
        </div>
      </div>

      <div className={`grid gap-10 xl:gap-12 ${promotedPosts.length ? 'lg:grid-cols-[minmax(0,1fr)_18rem]' : ''}`}>
        <div>
          {paginatedPosts.length ? (
            <div id="blog-posts">
              {paginatedPosts.map((post) => {
                const postTitle = getLocalizedText(post.title, language);
                const excerpt = getLocalizedText(post.excerpt, language);
                const category = Array.isArray(post.categories) && post.categories.length > 0
                  ? getCategoryLabel(post.categories[0], language)
                  : '';
                const imageUrl = post.mainImage ? urlFor(post.mainImage).width(640).height(480).fit('crop').auto('format').url() : '';

                const bodyArray = getLocalizedArray<any>(post.body, language);
                const bodyText = extractPortableText(bodyArray);
                const wordCount = bodyText.trim().split(/\s+/).length;
                const readingTime = Math.max(1, Math.ceil(wordCount / 200));

                return (
                  <PrefetchLink
                    key={post._id}
                    href={localizedPath(language, `/blog/${post.slug.current}`)}
                    className="group relative block border-b border-white/10 first:border-t"
                  >
                    <article className="grid gap-5 py-8 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center md:gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.68rem] uppercase tracking-[0.18em]">
                          {category ? (
                            <span className="text-teal-300/80 transition-colors duration-300 group-hover:text-teal-300">
                              / {category}
                            </span>
                          ) : null}
                          <span className="text-white/30">
                            {new Date(post.publishedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {` • ${readingTime} min ${language === 'pl' ? 'czytania' : 'read'}`}
                          </span>
                        </div>

                        <h2 className="mb-3 line-clamp-2 font-oxanium text-2xl font-light text-white transition-colors duration-300 group-hover:text-teal-300 lg:text-3xl">
                          {postTitle}
                        </h2>

                        <p className="line-clamp-2 max-w-2xl text-sm font-light leading-relaxed text-white/50">
                          {excerpt}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-teal-300/70 transition-all duration-500 md:translate-y-2 md:text-teal-300/0 md:group-hover:translate-y-0 md:group-hover:text-teal-300/90">
                          <span className="text-xs uppercase tracking-wider">{t.readMore}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>

                      {imageUrl ? (
                        <div className="relative order-first aspect-[16/9] overflow-hidden bg-white/5 md:order-none md:aspect-[4/3]">
                          <img
                            src={imageUrl}
                            alt={postTitle}
                            className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-indigo-950/30 transition-colors duration-500 group-hover:bg-indigo-950/0" />
                          <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-teal-300/0 transition-colors duration-500 group-hover:border-teal-300/70" />
                          <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-teal-300/0 transition-colors duration-500 group-hover:border-teal-300/70" />
                        </div>
                      ) : null}
                    </article>

                    <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.5)] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </PrefetchLink>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white/70 ">{t.noPosts}</p>
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
                
                const bodyArray = getLocalizedArray<any>(post.body, language);
                const bodyText = extractPortableText(bodyArray);
                const wordCount = bodyText.trim().split(/\s+/).length;
                const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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
                        {` • ${readingTime} min ${language === 'pl' ? 'czytania' : 'read'}`}
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
