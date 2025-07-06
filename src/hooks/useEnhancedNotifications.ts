/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useRealtimeNotifications } from './useRealtimeNotifications';
import { useUserStore } from '@/store/userStore';
import type { NotificationRecord, NotificationData } from '@/db/services/notificationService';

interface UseEnhancedNotificationsOptions {
  enableRealtime?: boolean;
  autoConnect?: boolean;
  playSound?: boolean;
  showBrowserNotification?: boolean;
}

interface UseEnhancedNotificationsReturn {
  // Combined notification data
  notifications: NotificationRecord[];
  unreadCount: number;
  hasUnread: boolean;
  
  // Real-time status
  isRealtimeConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastHeartbeat: Date | null;
  
  // Actions (from useNotifications)
  fetchNotifications: (filters?: any) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  archiveNotification: (notificationId: string) => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  
  // Real-time controls
  connectRealtime: () => void;
  disconnectRealtime: () => void;
  
  // Loading states
  isLoading: boolean;
  isLoadingSummary: boolean;
}

/**
 * Enhanced notifications hook that combines regular notification functionality
 * with real-time updates via Server-Sent Events
 */
export const useEnhancedNotifications = (
  options: UseEnhancedNotificationsOptions = {}
): UseEnhancedNotificationsReturn => {
  const {
    enableRealtime = true,
    autoConnect = true,
    playSound = false,
    showBrowserNotification = false
  } = options;

  const { user } = useUserStore();
  const [realtimeNotifications, setRealtimeNotifications] = useState<NotificationData[]>([]);
  
  // Use existing notifications hook
  const {
    notifications: baseNotifications,
    summary,
    isLoading,
    isLoadingSummary,
    fetchNotifications,
    fetchSummary,
    markAsRead: baseMarkAsRead,
    markAllAsRead: baseMarkAllAsRead,
    archiveNotification,
    deleteNotification
  } = useNotifications();

  // Real-time notifications hook
  const {
    connectionStatus,
    isConnected: isRealtimeConnected,
    lastHeartbeat,
    connect: connectRealtime,
    disconnect: disconnectRealtime
  } = useRealtimeNotifications({
    userId: user?.id,
    autoConnect: enableRealtime && autoConnect,
    onNotification: handleRealtimeNotification,
    onConnectionChange: (status) => {
      console.log('📡 Real-time connection status:', status);
    }
  });

  // Handle new real-time notifications
  function handleRealtimeNotification(notification: NotificationData) {
    console.log('📧 New real-time notification:', notification);
    
    // Add to real-time notifications list
    setRealtimeNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 most recent
    
    // Play notification sound
    if (playSound) {
      playNotificationSound();
    }
    
    // Show browser notification
    if (showBrowserNotification && 'Notification' in window && Notification.permission === 'granted') {
      showBrowserNotificationPopup(notification);
    }
    
    // Refresh the summary to update unread count
    fetchSummary();
  }

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, []);

  // Show browser notification
  const showBrowserNotificationPopup = useCallback((notification: NotificationData) => {
    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });
      
      browserNotification.onclick = () => {
        window.focus();
        if (notification.entityUrl) {
          window.location.href = notification.entityUrl;
        }
        browserNotification.close();
      };
      
      // Auto-close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    } catch (error) {
      console.warn('Could not show browser notification:', error);
    }
  }, []);

  // Enhanced mark as read that also clears real-time notifications
  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    const success = await baseMarkAsRead(notificationId);
    
    if (success) {
      // Remove from real-time notifications if present
      setRealtimeNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
    
    return success;
  }, [baseMarkAsRead]);

  // Enhanced mark all as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    const success = await baseMarkAllAsRead();
    
    if (success) {
      // Clear all real-time notifications
      setRealtimeNotifications([]);
    }
    
    return success;
  }, [baseMarkAllAsRead]);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Auto-request notification permission on mount
  useEffect(() => {
    if (showBrowserNotification) {
      requestNotificationPermission();
    }
  }, [showBrowserNotification, requestNotificationPermission]);

  // Combine base notifications with real-time ones
  const combinedNotifications = [
    ...realtimeNotifications.map(n => ({
      ...n,
      createdAt: n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt),
      updatedAt: n.updatedAt instanceof Date ? n.updatedAt : new Date(n.updatedAt),
      readAt: n.readAt ? (n.readAt instanceof Date ? n.readAt : new Date(n.readAt)) : undefined,
      archivedAt: n.archivedAt ? (n.archivedAt instanceof Date ? n.archivedAt : new Date(n.archivedAt)) : undefined,
      expiresAt: n.expiresAt ? (n.expiresAt instanceof Date ? n.expiresAt : new Date(n.expiresAt)) : undefined,
      scheduledFor: n.scheduledFor ? (n.scheduledFor instanceof Date ? n.scheduledFor : new Date(n.scheduledFor)) : undefined
    } as NotificationRecord)),
    ...baseNotifications.filter(baseN => 
      !realtimeNotifications.some(rtN => rtN.id === baseN.id)
    )
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const unreadCount = summary?.unread || 0;
  const hasUnread = unreadCount > 0;

  return {
    // Combined data
    notifications: combinedNotifications,
    unreadCount,
    hasUnread,
    
    // Real-time status
    isRealtimeConnected,
    connectionStatus,
    lastHeartbeat,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    
    // Real-time controls
    connectRealtime,
    disconnectRealtime,
    
    // Loading states
    isLoading,
    isLoadingSummary
  };
};

export default useEnhancedNotifications;