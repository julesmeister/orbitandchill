/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import type { NotificationRecord } from '@/db/services/notificationService';

interface ArchiveStats {
  total: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  oldestDate: string | null;
  newestDate: string | null;
}

interface NotificationHistoryFilters {
  search?: string;
  category?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}

interface UseNotificationHistoryReturn {
  // Data
  notifications: NotificationRecord[];
  stats: ArchiveStats | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingStats: boolean;
  
  // Pagination
  currentPage: number;
  hasMore: boolean;
  
  // Actions
  fetchArchivedNotifications: (filters?: NotificationHistoryFilters, append?: boolean) => Promise<void>;
  archiveMultiple: (notificationIds: string[]) => Promise<boolean>;
  restoreNotifications: (notificationIds: string[]) => Promise<boolean>;
  clearArchive: (olderThanDays?: number) => Promise<number>;
  loadMore: () => void;
  
  // Computed values
  pageSize: number;
}

/**
 * Hook for managing notification history and archive functionality
 */
export const useNotificationHistory = (
  pageSize: number = 20
): UseNotificationHistoryReturn => {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch archived notifications
  const fetchArchivedNotifications = useCallback(async (
    filters: NotificationHistoryFilters = {},
    append: boolean = false
  ) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        userId: user.id,
        limit: (filters.limit || pageSize).toString(),
        offset: (filters.offset || 0).toString(),
      });

      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.priority && filters.priority !== 'all') {
        params.append('priority', filters.priority);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(`/api/notifications/archive?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch archived notifications');
      }

      const data = await response.json();
      
      if (append) {
        setNotifications(prev => [...prev, ...data.notifications]);
      } else {
        setNotifications(data.notifications);
        setCurrentPage(1);
      }
      
      setStats(data.stats);
      setHasMore(data.pagination.hasMore);
      
    } catch (error) {
      console.error('Error fetching archived notifications:', error);
      if (!append) {
        setNotifications([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, pageSize]);

  // Archive multiple notifications
  const archiveMultiple = useCallback(async (notificationIds: string[]): Promise<boolean> => {
    if (!user?.id || notificationIds.length === 0) return false;

    try {
      const response = await fetch('/api/notifications/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, notificationIds })
      });

      if (!response.ok) {
        throw new Error('Failed to archive notifications');
      }

      const data = await response.json();
      return data.success && data.failed === 0;
      
    } catch (error) {
      console.error('Error archiving notifications:', error);
      return false;
    }
  }, [user?.id]);

  // Restore notifications from archive
  const restoreNotifications = useCallback(async (notificationIds: string[]): Promise<boolean> => {
    if (!user?.id || notificationIds.length === 0) return false;

    try {
      const promises = notificationIds.map(id =>
        fetch(`/api/notifications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, action: 'unarchive' })
        })
      );

      const responses = await Promise.all(promises);
      const successful = responses.filter(response => response.ok).length;
      
      if (successful > 0) {
        // Remove restored notifications from the list
        setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
        
        // Refresh stats
        fetchArchivedNotifications();
      }
      
      return successful === notificationIds.length;
      
    } catch (error) {
      console.error('Error restoring notifications:', error);
      return false;
    }
  }, [user?.id, fetchArchivedNotifications]);

  // Clear archive
  const clearArchive = useCallback(async (olderThanDays: number = 90): Promise<number> => {
    if (!user?.id) return 0;

    try {
      const response = await fetch('/api/notifications/archive', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, olderThanDays })
      });

      if (!response.ok) {
        throw new Error('Failed to clear archive');
      }

      const data = await response.json();
      
      // Refresh the list after clearing
      fetchArchivedNotifications();
      
      return data.deletedCount || 0;
      
    } catch (error) {
      console.error('Error clearing archive:', error);
      return 0;
    }
  }, [user?.id, fetchArchivedNotifications]);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      fetchArchivedNotifications({
        limit: pageSize,
        offset: (nextPage - 1) * pageSize
      }, true);
    }
  }, [isLoading, hasMore, currentPage, pageSize, fetchArchivedNotifications]);

  // Auto-fetch when user changes
  useEffect(() => {
    if (user?.id) {
      fetchArchivedNotifications();
    }
  }, [user?.id, fetchArchivedNotifications]);

  return {
    // Data
    notifications,
    stats,
    
    // Loading states
    isLoading,
    isLoadingStats,
    
    // Pagination
    currentPage,
    hasMore,
    
    // Actions
    fetchArchivedNotifications,
    archiveMultiple,
    restoreNotifications,
    clearArchive,
    loadMore,
    
    // Computed values
    pageSize
  };
};

export default useNotificationHistory;