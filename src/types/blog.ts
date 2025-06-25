/* eslint-disable @typescript-eslint/no-unused-vars */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime: number; // in minutes
  viewCount: number;
  imageUrl?: string;
  isFeatured: boolean;
  slug: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

export interface BlogFilters {
  category?: string;
  searchQuery?: string;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'popular';
}

export interface BlogPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
}