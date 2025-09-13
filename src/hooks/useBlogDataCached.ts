/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useCategories } from '@/hooks/useCategories';
import { BlogPost, BlogFilters, BlogCategory, BlogPaginationInfo } from '@/types/blog';
import { POSTS_PER_PAGE } from '@/constants/blog';
import { convertThreadToBlogPost } from '@/utils/blogUtils';
import { db } from '@/store/database';

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
  refreshData: () => Promise<void>;
}

const BLOG_CACHE_KEY = 'blog_data';
const FEATURED_CACHE_KEY = 'featured_articles';
const CACHE_TTL_MINUTES = 5; // Cache for 5 minutes

export function useBlogDataCached(): UseBlogDataReturn {
  const [filters, setFilters] = useState<BlogFilters>({
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [cachedBlogPosts, setCachedBlogPosts] = useState<BlogPost[]>([]);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);

  // Use admin store for real blog data
  const { threads, loadThreads, isLoading: storeLoading } = useAdminStore();
  
  // Use database-backed categories
  const {
    categories: dbCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fallback: categoriesFallback
  } = useCategories();

  // Load cached data first
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await db.getCache<BlogPost[]>(BLOG_CACHE_KEY);
        if (cached && cached.length > 0) {
          setCachedBlogPosts(cached.map((post: any) => ({
            ...post,
            publishedAt: new Date(post.publishedAt)
          })));
        }
        setIsCacheLoaded(true);
      } catch (err: any) {
        console.error('Error loading cached blog data:', err);
        setIsCacheLoaded(true);
      }
    };

    loadCachedData();
  }, []);

  // Background data refresh
  const refreshData = useCallback(async () => {
    try {
      await loadThreads();
      setError(null);
    } catch (err: any) {
      setError('Failed to load blog posts');
      console.error('Error loading blog posts:', err);
    }
  }, [loadThreads]);

  // Load data on mount and set up background refresh
  useEffect(() => {
    // Start background refresh
    refreshData();

    // Set up periodic background refresh (every 2 minutes)
    const interval = setInterval(() => {
      refreshData();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  // Process and cache blog posts when threads change
  const allBlogPosts = useMemo(() => {
    const processed = threads
      .filter((thread: any) => thread.isPublished) // Show all published content, not just blog posts
      .sort((a: any, b: any) => {
        // Prioritize pinned content first, then sort by recent
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // If both have same pin status, sort by date (newest first)
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      })
      .map(convertThreadToBlogPost);

    // Cache the processed data
    if (processed.length > 0) {
      db.setCache(BLOG_CACHE_KEY, processed, CACHE_TTL_MINUTES).catch((err: any) => {
        console.error('Error caching blog data:', err);
      });
    }

    return processed;
  }, [threads]);

  // Use cached data if available and store data is loading
  const effectiveBlogPosts = useMemo(() => {
    if (allBlogPosts.length > 0) {
      return allBlogPosts;
    }
    if (cachedBlogPosts.length > 0 && storeLoading) {
      return cachedBlogPosts;
    }
    return [];
  }, [allBlogPosts, cachedBlogPosts, storeLoading]);

  // Filter and sort posts based on current filters
  const filteredPosts = useMemo(() => {
    let filtered = [...effectiveBlogPosts];

    // Apply category filter
    if (filters.category) {
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
  }, [effectiveBlogPosts, filters, dbCategories]);

  // Get featured posts (cached separately for faster home page loading)
  const featuredPosts = useMemo(() => {
    const featured = effectiveBlogPosts.filter((post: any) => post.isPinned).slice(0, 3);
    
    // Cache featured articles separately for home page
    if (featured.length > 0) {
      db.setCache(FEATURED_CACHE_KEY, featured, CACHE_TTL_MINUTES).catch((err: any) => {
        console.error('Error caching featured articles:', err);
      });
    }

    return featured;
  }, [effectiveBlogPosts]);

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
    return [...effectiveBlogPosts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        viewCount: post.viewCount
      }));
  }, [effectiveBlogPosts]);

  const recentPosts = useMemo(() => {
    return [...effectiveBlogPosts]
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: post.publishedAt
      }));
  }, [effectiveBlogPosts]);

  // Calculate category post counts using database categories
  const categories = useMemo<BlogCategory[]>(() => {
    const categoryCounts = new Map<string, number>();
    
    effectiveBlogPosts.forEach((post: any) => {
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
      postCount: effectiveBlogPosts.length
    };

    return [allCategory, ...blogCategories];
  }, [effectiveBlogPosts, dbCategories]);

  // Reset to page 1 when filters change
  useEffect(() => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Determine loading state: loading if store is loading AND no cached data
  const isLoading = (storeLoading || categoriesLoading) && !isCacheLoaded;

  return {
    // Data
    allBlogPosts: effectiveBlogPosts,
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
    isLoading,
    error: error || categoriesError,

    // Actions
    setFilters: handleSetFilters,
    setCurrentPage: handleSetCurrentPage,
    refreshData
  };
}

