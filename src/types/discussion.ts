/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Discussion Types
 * Shared type definitions for discussion-related entities
 */

/**
 * Core Discussion interface for database-integrated discussions
 * Matches the existing interface in useDiscussions.ts
 */
export interface Discussion {
  id: string;
  title: string;
  slug: string; // URL-friendly version of title
  excerpt: string;
  content: string;
  authorId: string | null;
  author?: string; // Populated from user lookup
  avatar?: string; // Generated from author name
  category: string;
  tags: string[];
  replies: number;
  views: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null; // User's vote on this discussion
  isLocked: boolean;
  isPinned: boolean;
  isBlogPost: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

/**
 * Discussion sort options
 */
export type DiscussionSortType = 'recent' | 'popular' | 'replies' | 'views';

/**
 * Discussion sort option for UI display
 */
export interface DiscussionSortOption {
  value: DiscussionSortType;
  label: string;
}

/**
 * Discussion filters for data fetching
 */
export interface DiscussionFilters {
  category?: string;
  sortBy?: DiscussionSortType;
  searchQuery?: string;
  isBlogPost?: boolean;
  isPublished?: boolean;
  authorId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Pagination configuration for discussions
 */
export interface DiscussionsPaginationConfig {
  currentPage: number;
  discussionsPerPage: number;
  totalDiscussions: number;
  totalPages: number;
}

/**
 * Discussion API response structure
 */
export interface DiscussionsApiResponse {
  success: boolean;
  discussions: Discussion[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

/**
 * Discussion categories with metadata
 */
export interface DiscussionCategory {
  name: string;
  color: string;
  count?: number;
}

/**
 * Discussion loading state
 */
export interface DiscussionsLoadingState {
  loading: boolean;
  error: string | null;
  retryCount: number;
}

/**
 * Discussion form data for creating/editing
 */
export interface DiscussionFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  isBlogPost?: boolean;
  isPublished?: boolean;
}

/**
 * Discussion card props for reusable component
 */
export interface DiscussionCardProps {
  discussion: Discussion;
  getCategoryColor: (category: string) => string;
  formatTimeAgo: (date: Date) => string;
  className?: string;
}

/**
 * Discussion metadata for SEO and social sharing
 */
export interface DiscussionMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}