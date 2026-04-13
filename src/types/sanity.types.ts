export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface AboutMe {
  _id: string;
  title: LocalizedText;
  slug: {
    current: string;
  };
  eyebrow?: LocalizedText;
  intro?: LocalizedText;
  heroImage?: SanityImage & {
    alt?: string;
  };
  story?: {
    en?: any[];
    pl?: any[];
  };
  highlights?: LocalizedStringArray;
  ctaProjects?: LocalizedText;
  ctaContact?: LocalizedText;
  seo?: {
    metaTitle?: LocalizedText;
    metaDescription?: LocalizedText;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: SanityImage;
    noIndex?: boolean;
  };
}

export interface Project {
  _id: string;
  title: {
    en: string;
    pl: string;
  };
  slug: {
    current: string;
  };
  description: {
    en: string;
    pl: string;
  };
  mainImage: SanityImage;
  body: {
    en: any[];
    pl: any[];
  };
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  blogUrl?: string;
  publishedAt: string;
}

// Portable Text component types
export interface PortableTextBlockProps {
  children: React.ReactNode;
}

export interface PortableTextMarkProps {
  children: React.ReactNode;
  value?: {
    href?: string;
    [key: string]: any;
  };
}

export interface PortableTextImageProps {
  value: SanityImage & {
    alt?: string;
    caption?: string;
  };
}

export interface PortableTextCodeProps {
  value: {
    code: string;
    language?: string;
  };
}

export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  image: SanityImage;
  bio: any[];
}

export interface Post {
  _id: string;
  title: string | {
    en: string;
    pl: string;
  };
  slug: { current: string };
  mainImage: SanityImage;
  publishedAt: string;
  author: Author;
  categories: string[];
  body: any[] | {
    en: any[];
    pl: any[];
  };
  excerpt?: string | {
    en: string;
    pl: string;
  };
  viewCount?: number;
}

export interface LocalizedText {
  en?: string;
  pl?: string;
}

export interface LocalizedStringArray {
  en?: string[];
  pl?: string[];
}

export interface LocalizedFaqItem {
  question: string;
  answer: string;
}

export interface LocalizedFaq {
  en?: LocalizedFaqItem[];
  pl?: LocalizedFaqItem[];
}

export interface ServiceLanding {
  _id: string;
  title: LocalizedText;
  slug: {
    current: string;
  };
  serviceType: string;
  city?: string;
  isLocalLanding?: boolean;
  eyebrow?: LocalizedText;
  intro?: LocalizedText;
  heroImage?: SanityImage;
  problems?: LocalizedStringArray;
  deliverables?: LocalizedStringArray;
  processSteps?: LocalizedStringArray;
  faq?: LocalizedFaq;
  content?: {
    en?: any[];
    pl?: any[];
  };
  ctaLabel?: LocalizedText;
  ctaSecondaryLabel?: LocalizedText;
  stats?: {
    en?: Array<{ value: string; label: string }>;
    pl?: Array<{ value: string; label: string }>;
  };
  seo?: {
    metaTitle?: LocalizedText;
    metaDescription?: LocalizedText;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: SanityImage;
    noIndex?: boolean;
  };
}