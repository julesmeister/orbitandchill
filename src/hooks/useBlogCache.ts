import { useEffect, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { BlogPost } from '@/types/blog';
import { convertThreadToBlogPost } from '@/utils/blogUtils';

interface UseBlogCacheReturn {
  blogPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useBlogCache(): UseBlogCacheReturn {
  // Use admin store for real blog data
  const { threads, loadThreads, isLoading } = useAdminStore();


  // Simple data refresh without caching - fetch only blog posts
  const refreshData = useCallback(async () => {
    try {
      // Pass filter: 'blog' to only fetch blog posts from API
      await loadThreads({ filter: 'blog' });
    } catch (err: any) {
      console.error('Error loading blog posts:', err);
    }
  }, [loadThreads]);

  // Load data on mount
  useEffect(() => {
    if (threads.length === 0) {
      refreshData();
    }
  }, [threads.length, refreshData]);

  // Process blog posts (already filtered by API)
  const blogPosts = useMemo(() => {
    // Early return if no threads
    if (!threads || threads.length === 0) {
      return [];
    }

    // Since API already filters for blog posts, we just need to filter for published ones
    const publishedBlogPosts = threads.filter((thread: any) => thread.isPublished);


    // Sort once after filtering
    publishedBlogPosts.sort((a: any, b: any) => {
      // Prioritize pinned content first, then sort by recent
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // If both have same pin status, sort by date (newest first)
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });

    // Convert to blog posts
    return publishedBlogPosts.map(convertThreadToBlogPost);
  }, [threads]);

  return {
    blogPosts,
    isLoading,
    error: null,
    refreshData,
  };
}