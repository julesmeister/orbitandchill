import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { BlogPost } from '@/types/blog';
import { convertThreadToBlogPost } from '@/utils/blogUtils';
import { db } from '@/store/database';

// Cache keys and TTL
const BLOG_CACHE_KEY = 'blog-posts-cache';
const CACHE_TTL_MINUTES = 30; // 30 minutes cache

interface UseBlogCacheReturn {
  blogPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useBlogCache(): UseBlogCacheReturn {
  const [cachedBlogPosts, setCachedBlogPosts] = useState<BlogPost[]>([]);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use admin store for real blog data
  const { threads, loadThreads, isLoading } = useAdminStore();

  // Load cached data on mount
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
      } finally {
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

    // Set up periodic background refresh (every 5 minutes)
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Process and cache blog posts when threads change
  const allBlogPosts = useMemo(() => {
    const processed = threads
      .filter((thread: any) => thread.isBlogPost && thread.isPublished)
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
      db.setCache(BLOG_CACHE_KEY, processed, CACHE_TTL_MINUTES).catch(err => {
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
    if (isCacheLoaded && cachedBlogPosts.length > 0) {
      return cachedBlogPosts;
    }
    return [];
  }, [allBlogPosts, cachedBlogPosts, isCacheLoaded]);

  return {
    blogPosts: effectiveBlogPosts,
    isLoading,
    error,
    refreshData,
  };
}