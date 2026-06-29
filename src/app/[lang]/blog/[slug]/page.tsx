import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import NextHeader from '@/components/next/NextHeader';
import NextFooter from '@/components/next/NextFooter';
import BlogPostLocalizedContent from '@/components/next/BlogPostLocalizedContent';
import { getPost, getPosts, getSitemapEntries, urlFor } from '@/lib/sanity.server';
import { absoluteUrl } from '@/lib/site';
import { getLocalizedArray, getLocalizedText } from '@/lib/localize';
import { localizedPath } from '@/lib/i18n-routing';
import { isLanguage, SUPPORTED_LANGUAGES, type Language } from '@/lib/language';
import { getImageAlt } from '@/lib/image-alt';
import {
  createSneakPeekDescription,
  DEFAULT_SOCIAL_IMAGE,
  extractPortableText,
  getSanitySocialImageUrl,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from '@/lib/seo';
import { translations } from '@/translations/translations';

interface LocalizedBlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export const revalidate = 3600;
export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const { posts } = await getSitemapEntries();

  return SUPPORTED_LANGUAGES.flatMap((lang) => (
    posts.map((post) => ({
      lang,
      slug: post.slug,
    }))
  ));
}

export async function generateMetadata({ params }: LocalizedBlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const post = await getPost(slug);

  if (!post?._id) {
    return {
      title: translations[language].blog.post.backToBlog,
      alternates: { canonical: absoluteUrl(localizedPath(language, '/blog')) },
    };
  }

  const title = getLocalizedText(post.title, language);
  const excerpt = getLocalizedText(post.excerpt, language);
  const bodyPreview = extractPortableText(getLocalizedArray(post.body, language));
  const metaTitle = getLocalizedText(post.seo?.metaTitle, language, title);
  const seoDescription = getLocalizedText(post.seo?.metaDescription, language);
  const metaDescription = createSneakPeekDescription(seoDescription, excerpt, bodyPreview);
  const path = `/blog/${post.slug.current}`;
  const canonical = post.seo?.canonicalUrl || absoluteUrl(localizedPath(language, path));
  const ogImage = post.seo?.ogImage
    ? getSanitySocialImageUrl(post.seo.ogImage)
    : post.mainImage
      ? getSanitySocialImageUrl(post.mainImage)
      : DEFAULT_SOCIAL_IMAGE;
  const imageAlt = getImageAlt(post.seo?.ogImage || post.mainImage, metaTitle || title);

  return {
    title: metaTitle,
    description: metaDescription || undefined,
    keywords: post.seo?.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath('en', path)),
        pl: absoluteUrl(localizedPath('pl', path)),
        'x-default': absoluteUrl(localizedPath('pl', path)),
      },
    },
    robots: post.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'article',
      url: canonical,
      title: metaTitle,
      description: metaDescription,
      siteName: 'AppCrates',
      images: [{
        url: ogImage,
        width: SOCIAL_IMAGE_WIDTH,
        height: SOCIAL_IMAGE_HEIGHT,
        alt: imageAlt,
      }],
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: [language === 'pl' ? 'en_US' : 'pl_PL'],
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt || post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage, alt: imageAlt }] : undefined,
    },
  };
}

export default async function LocalizedBlogPostPage({ params }: LocalizedBlogPostPageProps) {
  const { lang, slug } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  const language = lang as Language;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);

  if (!post?._id) {
    notFound();
  }

  const title = getLocalizedText(post.title, language);
  const excerpt = getLocalizedText(post.excerpt, language);
  const bodyPreview = extractPortableText(getLocalizedArray(post.body, language));
  const description = createSneakPeekDescription(excerpt, bodyPreview);
  const faq = getLocalizedArray<{ question: string; answer: string }>(post.faq, language);
  const heroImageUrl = post.mainImage ? getSanitySocialImageUrl(post.mainImage) : '';
  const authorImageUrl = post.author?.image ? urlFor(post.author.image).width(80).height(80).auto('format').url() : '';
  const path = `/blog/${post.slug.current}`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: heroImageUrl,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    inLanguage: language,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      image: authorImageUrl || undefined,
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(localizedPath(language, path)),
    },
    publisher: {
      '@type': 'Organization',
      name: 'AppCrates',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/media/android-chrome-512x512.png'),
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: translations[language].navigation.home,
        item: absoluteUrl(localizedPath(language, '/')),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: translations[language].navigation.blog,
        item: absoluteUrl(localizedPath(language, '/blog')),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: absoluteUrl(localizedPath(language, path)),
      },
    ],
  };

  const faqSchema = faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: language,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  return (
    <div className="bg-indigo-950 min-h-screen">
      <NextHeader />
      <BlogPostLocalizedContent post={post} posts={posts} />
      <NextFooter />

      <Script id="blog-posting-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </div>
  );
}
