/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useCallback, useRef, useState } from 'react';
import { WebSocketManager, getWebSocketManager, NotificationEvent, NotificationReadEvent } from '@/utils/websocket';
import { NotificationData } from '@/db/services/notificationService';

interface UseWebSocketNotificationsOptions {
  userId?: string;
  autoConnect?: boolean;
  onNotification?: (notification: NotificationData) => void;
  onNotificationRead?: (notificationId: string) => void;
  onConnectionChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

interface UseWebSocketNotificationsReturn {
  wsManager: WebSocketManager | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  connect: (userId?: string) => void;
  disconnect: () => void;
  markAsRead: (notificationId: string) => void;
  isConnected: boolean;
  sendTypingStart: (discussionId: string, username: string) => void;
  sendTypingStop: (discussionId: string, username: string) => void;
}

/**
 * Hook for managing WebSocket notifications
 */
export const useWebSocketNotifications = (
  options: UseWebSocketNotificationsOptions = {}
): UseWebSocketNotificationsReturn => {
  const {
    userId,
    autoConnect = true,
    onNotification,
    onNotificationRead,
    onConnectionChange
  } = options;

  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket manager
  useEffect(() => {
    if (userId) {
      const manager = getWebSocketManager(userId);
      setWsManager(manager);
      
      if (autoConnect) {
        manager.connect(userId);
      }
    }
  }, [userId, autoConnect]);

  // Monitor connection status
  useEffect(() => {
    if (wsManager) {
      // Check status periodically
      statusCheckInterval.current = setInterval(() => {
        const status = wsManager.getConnectionStatus();
        setConnectionStatus(status);
        onConnectionChange?.(status);
      }, 1000);

      return () => {
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
        }
      };
    }
  }, [wsManager, onConnectionChange]);

  // Set up notification listeners
  useEffect(() => {
    if (!wsManager) return;

    const handleNotification = (event: NotificationEvent) => {
      console.log('📧 Received notification via WebSocket:', event.data);
      onNotification?.(event.data);
    };

    const handleNotificationRead = (event: NotificationReadEvent) => {
      console.log('✅ Notification marked as read via WebSocket:', event.data.notificationId);
      onNotificationRead?.(event.data.notificationId);
    };

    wsManager.on('notification', handleNotification as any);
    wsManager.on('notification_read', handleNotificationRead as any);

    return () => {
      wsManager.off('notification', handleNotification as any);
      wsManager.off('notification_read', handleNotificationRead as any);
    };
  }, [wsManager, onNotification, onNotificationRead]);

  // Connection methods
  const connect = useCallback((connectUserId?: string) => {
    if (wsManager) {
      wsManager.connect(connectUserId || userId);
    } else if (connectUserId || userId) {
      const manager = getWebSocketManager(connectUserId || userId!);
      setWsManager(manager);
      manager.connect(connectUserId || userId);
    }
  }, [wsManager, userId]);

  const disconnect = useCallback(() => {
    if (wsManager) {
      wsManager.disconnect();
    }
  }, [wsManager]);

  // Notification methods
  const markAsRead = useCallback((notificationId: string) => {
    if (wsManager && wsManager.isConnected()) {
      wsManager.markNotificationAsRead(notificationId);
    }
  }, [wsManager]);

  // Typing indicators
  const sendTypingStart = useCallback((discussionId: string, username: string) => {
    if (wsManager && wsManager.isConnected()) {
      wsManager.startTyping(discussionId, username);
    }
  }, [wsManager]);

  const sendTypingStop = useCallback((discussionId: string, username: string) => {
    if (wsManager && wsManager.isConnected()) {
      wsManager.stopTyping(discussionId, username);
    }
  }, [wsManager]);

  return {
    wsManager,
    connectionStatus,
    connect,
    disconnect,
    markAsRead,
    isConnected: connectionStatus === 'connected',
    sendTypingStart,
    sendTypingStop
  };
};

/**
 * Hook for typing indicators in discussions
 */
export const useTypingIndicator = (
  discussionId: string,
  username: string,
  wsManager: WebSocketManager | null
) => {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!wsManager) return;

    const handleTypingStart = (event: any) => {
      const { userId, username: typingUsername, discussionId: eventDiscussionId } = event.data;
      
      if (eventDiscussionId === discussionId && typingUsername !== username) {
        setTypingUsers(prev => new Set([...prev, typingUsername]));
        
        // Clear existing timeout for this user
        const existingTimeout = typingTimeoutRefs.current.get(userId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        
        // Set timeout to remove user from typing list
        const timeout = setTimeout(() => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(typingUsername);
            return next;
          });
          typingTimeoutRefs.current.delete(userId);
        }, 3000); // Remove after 3 seconds of inactivity
        
        typingTimeoutRefs.current.set(userId, timeout);
      }
    };

    const handleTypingStop = (event: any) => {
      const { userId, username: typingUsername, discussionId: eventDiscussionId } = event.data;
      
      if (eventDiscussionId === discussionId && typingUsername !== username) {
        setTypingUsers(prev => {
          const next = new Set(prev);
          next.delete(typingUsername);
          return next;
        });
        
        // Clear timeout for this user
        const existingTimeout = typingTimeoutRefs.current.get(userId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          typingTimeoutRefs.current.delete(userId);
        }
      }
    };

    wsManager.on('typing_start', handleTypingStart);
    wsManager.on('typing_stop', handleTypingStop);

    return () => {
      wsManager.off('typing_start', handleTypingStart);
      wsManager.off('typing_stop', handleTypingStop);
      
      // Clear all timeouts
      typingTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutRefs.current.clear();
    };
  }, [wsManager, discussionId, username]);

  const startTyping = useCallback(() => {
    if (wsManager && wsManager.isConnected() && !isTypingRef.current) {
      wsManager.startTyping(discussionId, username);
      isTypingRef.current = true;
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [wsManager, discussionId, username]);

  const stopTyping = useCallback(() => {
    if (wsManager && wsManager.isConnected() && isTypingRef.current) {
      wsManager.stopTyping(discussionId, username);
      isTypingRef.current = false;
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  }, [wsManager, discussionId, username]);

  const handleTyping = useCallback(() => {
    startTyping();
    
    // Auto-stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [startTyping, stopTyping]);

  return {
    typingUsers: Array.from(typingUsers),
    startTyping,
    stopTyping,
    handleTyping
  };
};

export default useWebSocketNotifications;