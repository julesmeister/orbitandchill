/* eslint-disable @typescript-eslint/no-explicit-any */

import { BlogPost } from '@/types/blog';
import { stripHtmlTags, estimateReadingTime } from '@/utils/textUtils';
import { getAvatarByIdentifier } from '@/utils/avatarUtils';

/**
 * Convert Thread data from admin store to BlogPost format
 */
export function convertThreadToBlogPost(thread: any): BlogPost {
  // Clean HTML from content for word count calculation
  const cleanContent = stripHtmlTags(thread.content || '');
  const readTime = estimateReadingTime(cleanContent);

  // Clean excerpt with fallback
  const excerpt = thread.excerpt || stripHtmlTags(thread.content || '').substring(0, 150) + '...';


  return {
    id: thread.id,
    title: thread.title || 'Untitled Post',
    excerpt: stripHtmlTags(excerpt),
    content: thread.content || '',
    author: thread.authorName || 'Admin User',
    authorId: thread.authorId || 'admin',
    authorAvatar: thread.preferredAvatar || getAvatarByIdentifier(thread.authorName || thread.authorId || 'Admin'),
    category: thread.category || 'General',
    tags: Array.isArray(thread.tags) ? thread.tags : [],
    publishedAt: new Date(thread.createdAt),
    updatedAt: new Date(thread.updatedAt),
    readTime,
    viewCount: thread.views || 0,
    imageUrl: thread.featuredImage, // Use featuredImage from thread as blog post thumbnail
    isFeatured: thread.isPinned || false,
    slug: thread.slug || generateCleanSlug(thread.title)
  };
}

/**
 * Generate clean SEO-friendly slug from title only (no ID suffix)
 */
export function generateCleanSlug(title: string): string {
  if (!title) return 'untitled';
  
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
    
  return slug || 'untitled';
}

/**
 * Generate SEO-friendly slug from title and ID
 */
export function generateSlug(title: string, id: string): string {
  if (!title) return id;
  
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
    
  return slug ? `${slug}-${id}` : id;
}

/**
 * Get section header title based on current filters
 */
export function getSectionTitle(filters: any, categories: any[]): string {
  if (filters.category) {
    return categories.find(c => c.id === filters.category)?.name || 'Articles';
  }
  
  if (filters.searchQuery) {
    return `Search Results for "${filters.searchQuery}"`;
  }
  
  return 'Recent Articles';
}

/**
 * Check if carousel should be visible
 */
export function shouldShowCarousel(featuredPosts: BlogPost[], filters: any): boolean {
  return featuredPosts.length > 0 && !filters.category && !filters.searchQuery;
}