/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Discussion, 
  DiscussionFilters, 
  DiscussionsApiResponse, 
  DiscussionSortType 
} from '@/types/discussion';

/**
 * Custom hook specifically for discussions page data management
 * Simplified version focused on page-db.tsx requirements
 */
export function useDiscussionsPageData() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load discussions from API with fallback
  const loadDiscussions = useCallback(async (filters: DiscussionFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Determine sort mapping
      let sortMapping: DiscussionSortType = 'recent';
      if (filters.sortBy) {
        sortMapping = filters.sortBy;
      }

      // Build query parameters
      const params = new URLSearchParams({
        sortBy: sortMapping,
        limit: '100',
        isBlogPost: 'false'
      });

      if (filters.category && filters.category !== "All Categories") {
        params.append('category', filters.category);
      }

      try {
        // Fetch discussions from API
        const response = await fetch(`/api/discussions?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data: DiscussionsApiResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to load discussions');
        }

        // Convert date strings back to Date objects and add missing fields
        const enhancedDiscussions: Discussion[] = data.discussions.map((discussion: any) => ({
          ...discussion,
          slug: discussion.slug || discussion.id, // Fallback to ID if slug missing
          createdAt: new Date(discussion.createdAt),
          updatedAt: new Date(discussion.updatedAt),
          lastActivity: new Date(discussion.lastActivity),
        }));

        setDiscussions(enhancedDiscussions);
      } catch (apiError) {
        // Fallback to mock data if API fails
        const fallbackDiscussions: Discussion[] = [
          {
            id: "fallback-1",
            title: "Database Integration in Progress",
            slug: "database-integration-in-progress",
            excerpt: "The discussions system is being set up with real database integration. This is temporary sample data.",
            content: "Please wait while we complete the database setup...",
            authorId: "system",
            author: "System",
            avatar: "SY",
            category: "General Discussion",
            tags: ["system", "setup"],
            replies: 0,
            views: 0,
            upvotes: 0,
            downvotes: 0,
            userVote: null,
            isLocked: false,
            isPinned: true,
            isBlogPost: false,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastActivity: new Date(),
          }
        ];

        setDiscussions(fallbackDiscussions);
      }
    } catch (err) {
      setError('Database connection is being set up. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    discussions,
    loading,
    error,
    loadDiscussions
  };
}