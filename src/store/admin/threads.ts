/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Thread } from './types';
import { threadsApi } from './api';
import { generateSlug } from '@/utils/slugify';

/**
 * Transform discussion data from API to Thread interface
 */
const transformDiscussionToThread = (discussion: any): Thread => {
  return {
    id: discussion.id,
    title: discussion.title,
    content: discussion.content,
    excerpt: discussion.excerpt,
    authorId: discussion.authorId || 'unknown',
    authorName: discussion.authorName || 'Unknown Author',
    preferredAvatar: discussion.preferredAvatar,
    slug: discussion.slug || generateSlug(discussion.title),
    // Proper boolean handling - SQLite returns 0/1, need to convert to boolean
    isBlogPost: Boolean(discussion.isBlogPost || discussion.is_blog_post),
    isPublished: Boolean(discussion.isPublished ?? discussion.is_published ?? true),
    isPinned: Boolean(discussion.isPinned || discussion.is_pinned),
    isLocked: Boolean(discussion.isLocked || discussion.is_locked),
    createdAt: discussion.createdAt ? new Date(discussion.createdAt * 1000).toISOString() : new Date().toISOString(),
    updatedAt: discussion.updatedAt ? new Date(discussion.updatedAt * 1000).toISOString() : new Date().toISOString(),
    tags: Array.isArray(discussion.tags) ? discussion.tags : [],
    views: discussion.views || 0,
    likes: discussion.upvotes || 0, // Map upvotes to likes
    comments: discussion.replies || 0,
    upvotes: discussion.upvotes || 0,
    downvotes: discussion.downvotes || 0,
    replies: discussion.replies || 0,
    category: discussion.category || 'General',
    featuredImage: discussion.featuredImage || discussion.featured_image,
    embeddedChart: discussion.embeddedChart,
    embeddedVideo: discussion.embeddedVideo
  };
};

/**
 * Threads slice for admin store
 */
export const createThreadsSlice = (set: any, get: any) => ({
  // Threads state
  threads: [] as Thread[],
  totalThreads: 0,
  totalPages: 0,
  currentPage: 1,

  // Threads actions
  loadThreads: async (options: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    filter?: string;
    search?: string;
    forceRefresh?: boolean;
  } = {}): Promise<void> => {
    set({ isLoading: true });

    try {
      // Add cache-busting timestamp when force refresh is requested
      const cacheBuster = options.forceRefresh ? `&_t=${Date.now()}` : '';
      const data = await threadsApi.getAll({
        ...options,
        cacheBuster
      });
      
      if (data.success && data.discussions) {
        const threads: Thread[] = data.discussions.map(transformDiscussionToThread);

        set({
          threads,
          totalThreads: data.totalCount || 0,
          totalPages: data.totalPages || 0,
          currentPage: data.currentPage || 1,
          isLoading: false,
        });
      } else {
        throw new Error('Failed to fetch discussions');
      }
    } catch (error) {
      // Fall back to empty array if API fails
      set({
        threads: [],
        totalThreads: 0,
        totalPages: 0,
        currentPage: 1,
        isLoading: false,
      });
    }
  },

  createThread: async (threadData: Omit<Thread, "id" | "createdAt" | "updatedAt" | "views" | "likes" | "comments" | "upvotes" | "downvotes" | "replies">): Promise<void> => {
    set({ isLoading: true });

    try {
      const data = await threadsApi.create({
        title: threadData.title,
        content: threadData.content,
        excerpt: threadData.excerpt,
        authorId: threadData.authorId,
        authorName: threadData.authorName,
        category: threadData.category,
        tags: threadData.tags,
        slug: threadData.slug,
        isBlogPost: threadData.isBlogPost,
        isPublished: threadData.isPublished,
        featuredImage: threadData.featuredImage,
      });
      
      if (data.success && data.discussion) {
        // After successful creation, reload threads with force refresh to get fresh data from API
        await get().loadThreads({ forceRefresh: true });
      } else {
        throw new Error(data.error || 'Failed to create discussion');
      }
    } catch (error) {
      // Fall back to mock creation
      const newThread: Thread = {
        ...threadData,
        id: `thread_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0,
        upvotes: 0,
        downvotes: 0,
        replies: 0,
      };

      set((state: any) => ({
        threads: [newThread, ...state.threads],
        isLoading: false,
      }));
    }
  },

  updateThread: async (id: string, updates: Partial<Thread>): Promise<void> => {
    set({ isLoading: true });

    try {
      const data = await threadsApi.update(id, updates);
      
      if (data.success && data.discussion) {
        // After successful update, reload threads with force refresh to get fresh data from API
        await get().loadThreads({ forceRefresh: true });
      } else {
        throw new Error(data.error || 'Failed to update discussion');
      }
    } catch (error) {
      // Fallback to local update
      set((state: any) => ({
        threads: state.threads.map((thread: Thread) =>
          thread.id === id
            ? { ...thread, ...updates, updatedAt: new Date().toISOString() }
            : thread
        ),
        isLoading: false,
      }));
    }
  },

  deleteThread: async (id: string): Promise<void> => {
    set({ isLoading: true });

    try {
      const data = await threadsApi.delete(id);
      
      if (data.success) {
        // Remove from local state
        set((state: any) => ({
          threads: state.threads.filter((thread: Thread) => thread.id !== id),
          isLoading: false,
        }));
      } else {
        throw new Error(data.error || 'Failed to delete discussion');
      }
    } catch (error) {
      // DO NOT fall back to local deletion - this causes issues
      // If API fails, keep the item in the list and show an error
      set({ isLoading: false });
      
      // Re-throw error so UI can handle it
      throw error;
    }
  },
});