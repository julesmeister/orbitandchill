/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

interface AdminStats {
  blogPosts: number;
  forumThreads: number;
  published: number;
  drafts: number;
  total: number;
  categoryCounts: Record<string, number>;
}

interface UseAdminStatsReturn {
  stats: AdminStats;
  isLoading: boolean;
  error: string | null;
}

export function useAdminStats(): UseAdminStatsReturn {
  const [stats, setStats] = useState<AdminStats>({
    blogPosts: 0,
    forumThreads: 0,
    published: 0,
    drafts: 0,
    total: 0,
    categoryCounts: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats || {
            blogPosts: 0,
            forumThreads: 0,
            published: 0,
            drafts: 0,
            total: 0,
            categoryCounts: {}
          });
        } else {
          throw new Error(data.error || 'Failed to fetch admin stats');
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set empty stats on error
        setStats({
          blogPosts: 0,
          forumThreads: 0,
          published: 0,
          drafts: 0,
          total: 0,
          categoryCounts: {}
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return {
    stats,
    isLoading,
    error
  };
}