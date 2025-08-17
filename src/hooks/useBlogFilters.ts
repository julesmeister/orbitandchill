import { useState, useMemo, useCallback, useEffect } from 'react';
import { BlogPost, BlogFilters, BlogPaginationInfo } from '@/types/blog';
import { POSTS_PER_PAGE } from '@/constants/blog';
import { useCategories } from '@/hooks/useCategories';

interface UseBlogFiltersReturn {
  filteredPosts: BlogPost[];
  posts: BlogPost[];
  paginationInfo: BlogPaginationInfo;
  filters: BlogFilters;
  currentPage: number;
  setFilters: (filters: BlogFilters | ((prev: BlogFilters) => BlogFilters)) => void;
  setCurrentPage: (page: number) => void;
}

export function useBlogFilters(allBlogPosts: BlogPost[]): UseBlogFiltersReturn {
  const [filters, setFilters] = useState<BlogFilters>({
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Use database-backed categories
  const { categories: dbCategories } = useCategories();

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
  }, [allBlogPosts, filters, dbCategories]);

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
    filteredPosts,
    posts,
    paginationInfo,
    filters,
    currentPage,
    setFilters: handleSetFilters,
    setCurrentPage: handleSetCurrentPage,
  };
}