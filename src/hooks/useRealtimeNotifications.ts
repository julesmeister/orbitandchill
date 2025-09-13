/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, useCallback } from 'react';
import { NotificationData } from '@/db/services/notificationService';

interface RealtimeEvent {
  type: 'connection' | 'notification' | 'heartbeat' | 'error';
  data: any;
  timestamp: string;
}

interface UseRealtimeNotificationsOptions {
  userId?: string;
  autoConnect?: boolean;
  onNotification?: (notification: NotificationData) => void;
  onConnectionChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface UseRealtimeNotificationsReturn {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  connect: (userId?: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  lastHeartbeat: Date | null;
  reconnectCount: number;
}

/**
 * Hook for real-time notifications using Server-Sent Events (SSE)
 */
export const useRealtimeNotifications = (
  options: UseRealtimeNotificationsOptions = {}
): UseRealtimeNotificationsReturn => {
  const {
    userId,
    autoConnect = true,
    onNotification,
    onConnectionChange,
    reconnectAttempts = 5,
    reconnectDelay = 3000
  } = options;

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update connection status and notify
  const updateConnectionStatus = useCallback((status: typeof connectionStatus) => {
    setConnectionStatus(status);
    onConnectionChange?.(status);
  }, [onConnectionChange]);

  // Handle SSE messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const realtimeEvent: RealtimeEvent = JSON.parse(event.data);
      
      switch (realtimeEvent.type) {
        case 'connection':
          console.log('📡 SSE connection established:', realtimeEvent.data);
          updateConnectionStatus('connected');
          setReconnectCount(0);
          break;
          
        case 'notification':
          console.log('📧 Received notification via SSE:', realtimeEvent.data);
          onNotification?.(realtimeEvent.data);
          break;
          
        case 'heartbeat':
          setLastHeartbeat(new Date(realtimeEvent.timestamp));
          
          // Reset heartbeat timeout
          if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
          }
          
          // If no heartbeat in 45 seconds, consider connection lost
          heartbeatTimeoutRef.current = setTimeout(() => {
            console.warn('📡 SSE heartbeat timeout');
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
              updateConnectionStatus('error');
              handleReconnect();
            }
          }, 45000);
          break;
          
        default:
          console.log('📡 Unknown SSE event:', realtimeEvent);
      }
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  }, [onNotification, updateConnectionStatus]);

  // Handle connection errors
  const handleError = useCallback((event: Event) => {
    console.error('📡 SSE connection error:', event);
    updateConnectionStatus('error');
    handleReconnect();
  }, [updateConnectionStatus]);

  // Handle connection close
  const handleClose = useCallback(() => {
    console.log('📡 SSE connection closed');
    updateConnectionStatus('disconnected');
    
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
  }, [updateConnectionStatus]);

  // Reconnection logic
  const handleReconnect = useCallback(() => {
    if (reconnectCount >= reconnectAttempts) {
      console.error('📡 Max reconnection attempts reached');
      updateConnectionStatus('error');
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = reconnectDelay * Math.pow(2, reconnectCount);
    console.log(`📡 Reconnecting SSE in ${delay}ms (attempt ${reconnectCount + 1})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectCount(prev => prev + 1);
      connect(userId);
    }, delay);
  }, [reconnectCount, reconnectAttempts, reconnectDelay, userId]);

  // Connect to SSE
  const connect = useCallback((connectUserId?: string) => {
    const targetUserId = connectUserId || userId;
    
    if (!targetUserId) {
      console.warn('Cannot connect SSE without userId');
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      updateConnectionStatus('connecting');
      
      const url = `/api/notifications/stream?userId=${encodeURIComponent(targetUserId)}`;
      const eventSource = new EventSource(url);
      
      eventSource.onmessage = handleMessage;
      eventSource.onerror = handleError;
      eventSource.onopen = () => {
        console.log('📡 SSE connection opened');
      };

      eventSourceRef.current = eventSource;
      
    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      updateConnectionStatus('error');
      handleReconnect();
    }
  }, [userId, handleMessage, handleError, updateConnectionStatus, handleReconnect]);

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
    
    updateConnectionStatus('disconnected');
    setReconnectCount(0);
  }, [updateConnectionStatus]);

  // Auto-connect on mount
  useEffect(() => {
    if (userId && autoConnect) {
      connect(userId);
    }

    return () => {
      disconnect();
    };
  }, [userId, autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionStatus,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
    lastHeartbeat,
    reconnectCount
  };
};

/**
 * Hook for combining regular notifications with real-time updates
 */
export const useEnhancedNotifications = (
  userId: string,
  onNewNotification?: (notification: NotificationData) => void
) => {
  const [realTimeNotifications, setRealTimeNotifications] = useState<NotificationData[]>([]);
  
  const { connectionStatus, isConnected } = useRealtimeNotifications({
    userId,
    autoConnect: true,
    onNotification: (notification) => {
      setRealTimeNotifications(prev => [notification, ...prev]);
      onNewNotification?.(notification);
    }
  });

  // Clear real-time notifications when read
  const clearRealTimeNotifications = useCallback(() => {
    setRealTimeNotifications([]);
  }, []);

  return {
    realTimeNotifications,
    clearRealTimeNotifications,
    connectionStatus,
    isConnected
  };
};

export default useRealtimeNotifications;