import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { BlogPost } from '@/types/blog';
import { convertThreadToBlogPost } from '@/utils/blogUtils';
import { db } from '@/store/database';

// Cache keys and TTL
const BLOG_CACHE_KEY = 'blog-posts-cache';
const CACHE_TTL_MINUTES = 30; // 30 minutes cache
const REFRESH_INTERVAL_MINUTES = 15; // Reduced from 5 minutes to 15 minutes

interface UseBlogCacheReturn {
  blogPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useBlogCache(): UseBlogCacheReturn {
  const [cachedBlogPosts, setCachedBlogPosts] = useState<BlogPost[]>([]);
  const [isCacheLoaded, setIsCacheLoaded] = useState(true); // Start as true to prevent skeleton
  const [error, setError] = useState<string | null>(null);
  const lastLoadTimeRef = useRef<number>(0);
  const isLoadingRef = useRef<boolean>(false);

  // Use admin store for real blog data
  const { threads, loadThreads, isLoading } = useAdminStore();

  // Load cached data immediately on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await db.getCache<BlogPost[]>(BLOG_CACHE_KEY);
        if (cached && cached.length > 0) {
          setCachedBlogPosts(cached.map(post => ({
            ...post,
            publishedAt: new Date(post.publishedAt)
          })));
        }
      } catch (err) {
        console.error('Error loading cached blog data:', err);
      }
      // Keep isCacheLoaded as true always
    };

    loadCachedData();
  }, []);

  // Optimized background data refresh with debouncing
  const refreshData = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastLoad = now - lastLoadTimeRef.current;
    
    // Prevent concurrent loads and frequent requests (min 30 seconds between loads)
    if (isLoadingRef.current || timeSinceLastLoad < 30000) {
      return;
    }

    isLoadingRef.current = true;
    lastLoadTimeRef.current = now;

    try {
      await loadThreads();
      setError(null);
    } catch (err: any) {
      setError('Failed to load blog posts');
      console.error('Error loading blog posts:', err);
    } finally {
      isLoadingRef.current = false;
    }
  }, [loadThreads]);

  // Load data on mount and set up background refresh
  useEffect(() => {
    // Only load if we don't have recent threads data
    if (threads.length === 0 && isCacheLoaded) {
      refreshData();
    }

    // Set up periodic background refresh (every 15 minutes instead of 5)
    const interval = setInterval(() => {
      refreshData();
    }, REFRESH_INTERVAL_MINUTES * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshData, threads.length, isCacheLoaded]);

  // Optimized processing with early returns and reduced operations
  const allBlogPosts = useMemo(() => {
    // Early return if no threads
    if (!threads || threads.length === 0) {
      return [];
    }

    // Pre-filter and sort in single pass for better performance
    const blogThreads: any[] = [];
    
    for (const thread of threads) {
      if (thread.isBlogPost && thread.isPublished) {
        blogThreads.push(thread);
      }
    }

    // Sort once after filtering
    blogThreads.sort((a: any, b: any) => {
      // Prioritize pinned content first, then sort by recent
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // If both have same pin status, sort by date (newest first)
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });

    // Convert to blog posts
    const processed = blogThreads.map(convertThreadToBlogPost);

    // Cache asynchronously to avoid blocking
    if (processed.length > 0) {
      setTimeout(() => {
        db.setCache(BLOG_CACHE_KEY, processed, CACHE_TTL_MINUTES).catch(err => {
          console.error('Error caching blog data:', err);
        });
      }, 0);
    }

    return processed;
  }, [threads]);

  // Always show cached data immediately, then silently update with fresh data
  const effectiveBlogPosts = useMemo(() => {
    // Prioritize cached data if available (instant display)
    if (isCacheLoaded && cachedBlogPosts.length > 0) {
      return cachedBlogPosts;
    }
    // Use fresh data when available
    if (allBlogPosts.length > 0) {
      return allBlogPosts;
    }
    return [];
  }, [allBlogPosts, cachedBlogPosts, isCacheLoaded]);

  // Only show loading when we truly have no data to show
  const effectiveLoading = effectiveBlogPosts.length === 0 && isLoading;

  return {
    blogPosts: effectiveBlogPosts,
    isLoading: effectiveLoading,
    error,
    refreshData,
  };
}