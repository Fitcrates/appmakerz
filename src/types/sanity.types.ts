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
  homepageDescription?: {
    en?: string;
    pl?: string;
  };
  homepageTitle?: {
    en?: string;
    pl?: string;
  };
  homepageOrder?: number;
  category?: {
    en: string;
    pl: string;
  };
  year?: string;
  featured?: boolean;
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
  featured?: boolean;
  featuredOrder?: number;
  author: Author;
  categories?: Array<string | Category>;
  body: any[] | {
    en: any[];
    pl: any[];
  };
  excerpt?: string | {
    en: string;
    pl: string;
  };
  viewCount?: number;
  tags?: string[];
  relatedServices?: ServiceLanding[];
}

export interface Category {
  _id: string;
  title?: LocalizedText;
  slug?: { current?: string };
  description?: LocalizedText;
  color?: string;
  order?: number;
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

export interface ServiceModel {
  label: string;
  title: string;
  audience: string;
  points?: string[];
  linkLabel?: string;
  linkHref?: string;
}

/** A group of related things the studio can do, rendered as one block on the hub. */
export interface ServiceCapability {
  group: string;
  items?: string[];
  linkLabel?: string;
  linkHref?: string;
}

export type HubMediaPlacement =
  | 'after-fork'
  | 'after-capabilities'
  | 'after-fit'
  | 'after-integrations'
  | 'after-evidence';

/** An optional picture dropped between two hub sections. */
export interface HubMediaEntry {
  placement: HubMediaPlacement;
  image?: SanityImage & { alt?: string };
  caption?: LocalizedText;
  wide?: boolean;
}

/** One row in the hub's integration ledger. `group` buckets rows under a heading. */
export interface ServiceIntegration {
  group?: string;
  name: string;
  detail?: string;
  meta?: string;
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
  models?: {
    en?: ServiceModel[];
    pl?: ServiceModel[];
  };
  /** 'hub' swaps the sales layout for the technology-overview one. Defaults to 'service'. */
  layoutVariant?: 'service' | 'hub';
  capabilities?: {
    en?: ServiceCapability[];
    pl?: ServiceCapability[];
  };
  fitYes?: LocalizedStringArray;
  fitNo?: LocalizedStringArray;
  integrations?: {
    en?: ServiceIntegration[];
    pl?: ServiceIntegration[];
  };
  technologies?: string[];
  hubMedia?: HubMediaEntry[];
  guideCta?: {
    enabled?: boolean;
    chapters?: string[];
  };
  relatedServices?: ServiceLanding[];
  relatedProjects?: Project[];
  relatedPosts?: Post[];
  seo?: {
    metaTitle?: LocalizedText;
    metaDescription?: LocalizedText;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: SanityImage;
    noIndex?: boolean;
  };
}
