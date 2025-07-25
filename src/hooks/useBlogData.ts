/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useCategories } from '@/hooks/useCategories';
import { BlogPost, BlogFilters, BlogCategory, BlogPaginationInfo } from '@/types/blog';
import { POSTS_PER_PAGE } from '@/constants/blog';
import { convertThreadToBlogPost } from '@/utils/blogUtils';

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
  setFilters: (filters: BlogFilters) => void;
  setCurrentPage: (page: number) => void;
}

export function useBlogData(): UseBlogDataReturn {
  const [filters, setFilters] = useState<BlogFilters>({
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Use admin store for real blog data
  const { threads, loadThreads, isLoading } = useAdminStore();
  
  // Use database-backed categories
  const {
    categories: dbCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fallback: categoriesFallback
  } = useCategories();

  // Load blog data on mount
  useEffect(() => {
    loadThreads().catch((err: any) => {
      setError('Failed to load blog posts');
      console.error('Error loading blog posts:', err);
    });
  }, [loadThreads]);

  // Get published blog posts only
  const allBlogPosts = useMemo(() => {
    return threads
      .filter((thread: any) => thread.isBlogPost && thread.isPublished)
      .map(convertThreadToBlogPost);
  }, [threads]);

  // Filter and sort posts based on current filters
  const filteredPosts = useMemo(() => {
    let filtered = [...allBlogPosts];

    // Apply category filter
    if (filters.category) {
      // Find the category by ID to get its name
      const selectedCategory = dbCategories.find(cat => cat.id === filters.category);
      if (selectedCategory) {
        filtered = filtered.filter(post => 
          post.category.toLowerCase() === selectedCategory.name.toLowerCase()
        );
      }
    }

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag: any) => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(post =>
        filters.tags!.some(tag => post.tags.includes(tag))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        break;
    }

    return filtered;
  }, [allBlogPosts, filters]);

  // Get featured posts (pinned blog posts)
  const featuredPosts = useMemo(() => {
    return allBlogPosts.filter((post: any) => post.isFeatured).slice(0, 3);
  }, [allBlogPosts]);

  // Calculate pagination
  const paginationInfo = useMemo<BlogPaginationInfo>(() => {
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    return {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage: POSTS_PER_PAGE
    };
  }, [filteredPosts.length, currentPage]);

  // Get posts for current page
  const posts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // Get popular and recent posts for sidebar
  const popularPosts = useMemo(() => {
    return [...allBlogPosts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        viewCount: post.viewCount
      }));
  }, [allBlogPosts]);

  const recentPosts = useMemo(() => {
    return [...allBlogPosts]
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt
      }));
  }, [allBlogPosts]);

  // Calculate category post counts using database categories
  const categories = useMemo<BlogCategory[]>(() => {
    const categoryCounts = new Map<string, number>();
    
    allBlogPosts.forEach((post: any) => {
      const count = categoryCounts.get(post.category) || 0;
      categoryCounts.set(post.category, count + 1);
    });

    // Convert database categories to blog categories format
    const blogCategories: BlogCategory[] = dbCategories.map(dbCategory => ({
      id: dbCategory.id,
      name: dbCategory.name,
      description: dbCategory.description || `Articles about ${dbCategory.name}`,
      postCount: categoryCounts.get(dbCategory.name) || 0
    }));

    // Add "All Posts" category at the beginning
    const allCategory: BlogCategory = {
      id: 'all',
      name: 'All Posts',
      description: 'Browse all blog posts',
      postCount: allBlogPosts.length
    };

    return [allCategory, ...blogCategories];
  }, [allBlogPosts, dbCategories]);

  // Reset to page 1 when filters change (except on initial mount)
  useEffect(() => {
    // Skip on initial mount
    const isInitialMount = currentPage === 1;
    if (!isInitialMount) {
      setCurrentPage(1);
    }
  }, [filters.category, filters.searchQuery, filters.tags?.join(','), filters.sortBy]);

  // Handle filter and page changes
  const handleSetFilters = useCallback((newFilters: BlogFilters | ((prev: BlogFilters) => BlogFilters)) => {
    setFilters(newFilters);
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    isLoading: isLoading || categoriesLoading,
    error: error || categoriesError,

    // Actions
    setFilters: handleSetFilters,
    setCurrentPage: handleSetCurrentPage,
  };
}