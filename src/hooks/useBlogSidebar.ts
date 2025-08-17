import { useMemo } from 'react';
import { BlogPost, BlogCategory } from '@/types/blog';
import { useCategories } from '@/hooks/useCategories';

interface UseBlogSidebarReturn {
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
  categories: BlogCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
}

export function useBlogSidebar(allBlogPosts: BlogPost[]): UseBlogSidebarReturn {
  // Use database-backed categories
  const {
    categories: dbCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

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
    
    allBlogPosts.forEach((post: BlogPost) => {
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

  return {
    popularPosts,
    recentPosts,
    categories,
    categoriesLoading,
    categoriesError,
  };
}