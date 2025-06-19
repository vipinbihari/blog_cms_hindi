import type { CollectionEntry } from 'astro:content';

// Re-export Astro content types for convenience
export type BlogPost = CollectionEntry<'posts'>;
export type BlogPostData = BlogPost['data'];

// Quiz related types
export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

// Extended types for internal use
export interface PostWithSlug {
  slug: string;
  id: string;
  collection: 'posts';
  data: BlogPostData;
  body: string;
}

// Search and filtering types
export interface SearchResult {
  post: BlogPost;
  score: number;
  matches: string[];
}

export interface PostsByYear {
  [year: string]: BlogPost[];
}

export interface CategoryStats {
  category: string;
  count: number;
  latestPost?: BlogPost;
}

export interface TagStats {
  tag: string;
  count: number;
  posts: BlogPost[];
}

// Component props types
export interface BaseLayoutProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalURL?: URL;
}

export interface PostLayoutProps {
  post: BlogPost;
  content: any;
  relatedPosts?: BlogPost[];
}

// Utility function return types
export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Author information
export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
} 