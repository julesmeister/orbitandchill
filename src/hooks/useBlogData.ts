import { BlogPost, BlogFilters, BlogCategory, BlogPaginationInfo } from '@/types/blog';
import { useBlogCache } from './useBlogCache';
import { useBlogFilters } from './useBlogFilters';
import { useBlogSidebar } from './useBlogSidebar';

interface UseBlogDataReturn {
  // Data
  allBlogPosts: BlogPost[];
  filteredPosts: BlogPost[];
  featuredPosts: BlogPost[];
  posts: BlogPost[];
  categories: BlogCategory[];
  popularPosts: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    publishedAt: Date;
  }>;
  paginationInfo: BlogPaginationInfo;

  // State
  filters: BlogFilters;
  currentPage: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setFilters: (filters: BlogFilters | ((prev: BlogFilters) => BlogFilters)) => void;
  setCurrentPage: (page: number) => void;
}

/**
 * Main orchestrator hook for blog data - combines focused hooks
 */
export function useBlogData(): UseBlogDataReturn {
  // Get cached blog posts
  const { 
    blogPosts: allBlogPosts, 
    isLoading: cacheLoading, 
    error: cacheError 
  } = useBlogCache();

  // Get filtering and pagination
  const {
    filteredPosts,
    posts,
    paginationInfo,
    filters,
    currentPage,
    setFilters,
    setCurrentPage,
  } = useBlogFilters(allBlogPosts);

  // Get sidebar data
  const {
    popularPosts,
    recentPosts,
    categories,
    categoriesLoading,
    categoriesError,
  } = useBlogSidebar(allBlogPosts);

  // Get featured posts (pinned blog posts)
  const featuredPosts = allBlogPosts.filter((post: BlogPost) => post.isFeatured).slice(0, 3);

  return {
    // Data
    allBlogPosts,
    filteredPosts,
    featuredPosts,
    posts,
    categories,
    popularPosts,
    recentPosts,
    paginationInfo,

    // State
    filters,
    currentPage,
    isLoading: cacheLoading || categoriesLoading,
    error: cacheError || categoriesError,

    // Actions
    setFilters,
    setCurrentPage,
  };
}