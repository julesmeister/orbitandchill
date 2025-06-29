/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { stripHtmlTags } from '@/utils/textUtils';
import { generateSEOSlug } from '@/utils/slugify';

interface Discussion {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string | null;
  author?: string;
  avatar?: string;
  category: string;
  tags: string[];
  replies: number;
  views: number;
  upvotes: number;
  downvotes: number;
  isLocked: boolean;
  isPinned: boolean;
  isBlogPost: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

interface UseDiscussionsState {
  discussions: Discussion[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  sortBy: string;
  searchQuery: string;
  currentPage: number;
  discussionsPerPage: number;
}

interface UseDiscussionsActions {
  refreshDiscussions: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  updateDiscussionVotes: (id: string, upvotes: number, downvotes: number) => void;
}

interface UseDiscussionsReturn extends UseDiscussionsState, UseDiscussionsActions {
  filteredDiscussions: Discussion[];
  sortedDiscussions: Discussion[];
  currentDiscussions: Discussion[];
  totalPages: number;
  handleCategoryChange: (category: string) => void;
  handleSearchChange: (query: string) => void;
  handleSortChange: (sort: string) => void;
  handlePageChange: (page: number) => void;
}

export function useDiscussions(initialPage = 1, initialPerPage = 6): UseDiscussionsReturn {
  const [state, setState] = useState<UseDiscussionsState>({
    discussions: [],
    loading: true,
    error: null,
    selectedCategory: "All Categories",
    sortBy: "recent",
    searchQuery: "",
    currentPage: initialPage,
    discussionsPerPage: initialPerPage,
  });

  // Fetch discussions from API
  const refreshDiscussions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const params = new URLSearchParams({
        limit: '50',
        sortBy: 'recent'
      });
      
      const response = await fetch(`/api/discussions?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const transformedDiscussions = data.discussions.map((d: Discussion) => {
          const convertTimestamp = (timestamp: number | string | Date) => {
            if (typeof timestamp === 'number') {
              return new Date(timestamp * 1000);
            }
            return new Date(timestamp);
          };
          
          return {
            ...d,
            slug: d.slug || generateSEOSlug(d.title),
            createdAt: convertTimestamp(d.createdAt),
            updatedAt: convertTimestamp(d.updatedAt),
            lastActivity: convertTimestamp(d.lastActivity),
          };
        });
        
        // Discussions transformed and ready for display
        setState(prev => ({ ...prev, discussions: transformedDiscussions, loading: false }));
      } else {
        throw new Error(data.error || 'Failed to fetch discussions');
      }
    } catch (err) {
      console.error('Error fetching discussions:', err);
      
      let errorMessage = 'Unknown error occurred';
      if (err instanceof SyntaxError) {
        errorMessage = 'Server returned invalid data format';
      } else if (err instanceof TypeError) {
        errorMessage = 'Network error - please check your connection';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        discussions: [],
        loading: false 
      }));
    }
  }, []);

  // Filter discussions (API already filters by isPublished)
  const filteredDiscussions = state.discussions.filter((discussion) => {
    const matchesCategory =
      state.selectedCategory === "All Categories" ||
      discussion.category === state.selectedCategory;
    
    const cleanExcerpt = stripHtmlTags(discussion.excerpt || discussion.content);
    const matchesSearch =
      discussion.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      cleanExcerpt.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) =>
        tag.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    
    return matchesCategory && matchesSearch;
  });

  // Sort discussions
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    switch (state.sortBy) {
      case "popular":
        return b.upvotes - a.upvotes;
      case "replies":
        return b.replies - a.replies;
      case "views":
        return b.views - a.views;
      default:
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.lastActivity.getTime() - a.lastActivity.getTime();
    }
  });

  // Paginate discussions
  const totalPages = Math.ceil(sortedDiscussions.length / state.discussionsPerPage);
  const indexOfLastDiscussion = state.currentPage * state.discussionsPerPage;
  const indexOfFirstDiscussion = indexOfLastDiscussion - state.discussionsPerPage;
  const currentDiscussions = sortedDiscussions.slice(
    indexOfFirstDiscussion,
    indexOfLastDiscussion
  );

  // Handlers with page reset
  const handleCategoryChange = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category, currentPage: 1 }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setState(prev => ({ ...prev, sortBy: sort, currentPage: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Update individual discussion votes
  const updateDiscussionVotes = useCallback((id: string, upvotes: number, downvotes: number) => {
    setState(prev => ({
      ...prev,
      discussions: prev.discussions.map(d => 
        d.id === id ? { ...d, upvotes, downvotes } : d
      )
    }));
  }, []);

  // Simple setters
  const setSelectedCategory = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const setSortBy = useCallback((sort: string) => {
    setState(prev => ({ ...prev, sortBy: sort }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  // Fetch discussions on mount
  useEffect(() => {
    refreshDiscussions();
  }, [refreshDiscussions]);

  return {
    ...state,
    filteredDiscussions,
    sortedDiscussions,
    currentDiscussions,
    totalPages,
    refreshDiscussions,
    setSelectedCategory,
    setSortBy,
    setSearchQuery,
    setCurrentPage,
    updateDiscussionVotes,
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
  };
}