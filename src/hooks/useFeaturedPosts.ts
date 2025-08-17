import { useMemo } from 'react';
import { BlogPost } from '@/types/blog';
import { useBlogCache } from './useBlogCache';

interface UseFeaturedPostsReturn {
  featuredPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

export function useFeaturedPosts(): UseFeaturedPostsReturn {
  const { blogPosts, isLoading, error } = useBlogCache();

  // Get featured posts (pinned blog posts)
  const featuredPosts = useMemo(() => {
    return blogPosts.filter((post: BlogPost) => post.isFeatured).slice(0, 3);
  }, [blogPosts]);

  return {
    featuredPosts,
    isLoading,
    error,
  };
}