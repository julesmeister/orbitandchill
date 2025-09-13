/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import type { 
  NotificationRecord, 
  NotificationSummary, 
  NotificationFilters,
  CreateNotificationData,
  UserNotificationPreferences
} from '@/db/services/notificationService';

interface UseNotificationsReturn {
  // Data
  notifications: NotificationRecord[];
  summary: NotificationSummary | null;
  preferences: UserNotificationPreferences | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingSummary: boolean;
  isLoadingPreferences: boolean;
  
  // Actions
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  archiveNotification: (notificationId: string) => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  createNotification: (data: Omit<CreateNotificationData, 'userId'>) => Promise<boolean>;
  updatePreferences: (updates: Partial<UserNotificationPreferences>) => Promise<boolean>;
  
  // Computed values
  unreadCount: number;
  hasUnread: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [preferences, setPreferences] = useState<UserNotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);

  const fetchNotifications = useCallback(async (filters: NotificationFilters = {}) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ userId: user.id });
      
      // Add filters to query params
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.isArchived !== undefined) params.append('isArchived', filters.isArchived.toString());
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.type) params.append('type', filters.type);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await fetch(`/api/notifications?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const fetchSummary = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoadingSummary(true);
    try {
      const response = await fetch(`/api/notifications/summary?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification summary');
      }
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching notification summary:', error);
      setSummary(null);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [user?.id]);

  const fetchPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoadingPreferences(true);
    try {
      const response = await fetch(`/api/notifications/preferences?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }
      
      const data = await response.json();
      setPreferences(data.preferences);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      setPreferences(null);
    } finally {
      setIsLoadingPreferences(false);
    }
  }, [user?.id]);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'mark_read' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        )
      );
      
      // Refresh summary to update unread count
      await fetchSummary();
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, [user?.id, fetchSummary]);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      );
      
      // Refresh summary to update unread count
      await fetchSummary();
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }, [user?.id, fetchSummary]);

  const archiveNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'archive' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to archive notification');
      }
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Refresh summary
      await fetchSummary();
      
      return true;
    } catch (error) {
      console.error('Error archiving notification:', error);
      return false;
    }
  }, [user?.id, fetchSummary]);

  const deleteNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}?userId=${user.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Refresh summary
      await fetchSummary();
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }, [user?.id, fetchSummary]);

  const createNotification = useCallback(async (data: Omit<CreateNotificationData, 'userId'>): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user.id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create notification');
      }
      
      const result = await response.json();
      
      // Add to local state
      if (result.notification) {
        setNotifications(prev => [result.notification, ...prev]);
      }
      
      // Refresh summary
      await fetchSummary();
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }, [user?.id, fetchSummary]);

  const updatePreferences = useCallback(async (updates: Partial<UserNotificationPreferences>): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, preferences: updates })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }
      
      const result = await response.json();
      setPreferences(result.preferences);
      
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }, [user?.id]);

  // Auto-fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      fetchSummary();
      fetchPreferences();
    }
  }, [user?.id]); // Remove fetchSummary and fetchPreferences from dependencies to prevent infinite loop

  const unreadCount = summary?.unread || 0;
  const hasUnread = unreadCount > 0;

  return {
    // Data
    notifications,
    summary,
    preferences,
    
    // Loading states
    isLoading,
    isLoadingSummary,
    isLoadingPreferences,
    
    // Actions
    fetchNotifications,
    fetchSummary,
    fetchPreferences,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    createNotification,
    updatePreferences,
    
    // Computed values
    unreadCount,
    hasUnread
  };
}