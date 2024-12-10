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

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image: SanityImage;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
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
  title: string;
  slug: { current: string };
  mainImage: SanityImage;
  publishedAt: string;
  author: Author;
  categories: string[];
  body: any[];
  excerpt?: string;
}