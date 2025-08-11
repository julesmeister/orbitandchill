/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo, useCallback } from 'react';
import { Discussion } from '@/types/discussion';
import { filterDiscussionsBySearch } from '@/utils/discussionsUtils';

/**
 * Custom hook for managing discussions search and filter state
 */
export function useDiscussionsFilters(discussions: Discussion[]) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter discussions by category and search
  const filteredDiscussions = useMemo(() => {
    // First filter by category
    const categoryFiltered = selectedCategory === "All Categories" 
      ? discussions 
      : discussions.filter(d => d.category === selectedCategory);

    // Then filter by search query
    return filterDiscussionsBySearch(categoryFiltered, searchQuery);
  }, [discussions, selectedCategory, searchQuery]);

  // Sort filtered discussions
  const sortedDiscussions = useMemo(() => {
    return [...filteredDiscussions].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.upvotes - a.upvotes;
        case "replies":
          return b.replies - a.replies;
        case "views":
          return b.views - a.views;
        default: // "recent"
          // Pinned discussions always come first
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.lastActivity.getTime() - a.lastActivity.getTime();
      }
    });
  }, [filteredDiscussions, sortBy]);

  // Handlers that reset to first page (to be used with pagination hook)
  const handleCategoryChange = useCallback((category: string, resetPage?: () => void) => {
    setSelectedCategory(category);
    resetPage?.();
  }, []);

  const handleSearchChange = useCallback((query: string, resetPage?: () => void) => {
    setSearchQuery(query);
    resetPage?.();
  }, []);

  const handleSortChange = useCallback((sort: string, resetPage?: () => void) => {
    setSortBy(sort);
    resetPage?.();
  }, []);

  // Simple setters (for direct state updates)
  const updateSelectedCategory = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const updateSortBy = useCallback((sort: string) => {
    setSortBy(sort);
  }, []);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    // State
    selectedCategory,
    sortBy,
    searchQuery,

    // Filtered and sorted data
    filteredDiscussions,
    sortedDiscussions,

    // Handlers with page reset
    handleCategoryChange,
    handleSearchChange,
    handleSortChange,

    // Simple setters
    updateSelectedCategory,
    updateSortBy,
    updateSearchQuery,

    // Direct setters for external use
    setSelectedCategory,
    setSortBy,
    setSearchQuery
  };
}