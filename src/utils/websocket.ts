/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationData } from '@/db/services/notificationService';

export type WebSocketEventType = 
  | 'notification'
  | 'notification_read'
  | 'notification_deleted'
  | 'user_online'
  | 'user_offline'
  | 'typing_start'
  | 'typing_stop';

export interface WebSocketEvent {
  type: WebSocketEventType;
  data: any;
  timestamp: string;
  userId?: string;
}

export interface NotificationEvent extends WebSocketEvent {
  type: 'notification';
  data: NotificationData;
}

export interface NotificationReadEvent extends WebSocketEvent {
  type: 'notification_read';
  data: {
    notificationId: string;
    userId: string;
  };
}

export interface TypingEvent extends WebSocketEvent {
  type: 'typing_start' | 'typing_stop';
  data: {
    userId: string;
    username: string;
    discussionId: string;
  };
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private isReconnecting = false;
  private eventListeners: Map<WebSocketEventType, Set<(event: WebSocketEvent) => void>> = new Map();
  private userId: string | null = null;
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';

  constructor(userId?: string) {
    this.userId = userId || null;
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    // Initialize event listener sets for each event type
    this.eventListeners.set('notification', new Set());
    this.eventListeners.set('notification_read', new Set());
    this.eventListeners.set('notification_deleted', new Set());
    this.eventListeners.set('user_online', new Set());
    this.eventListeners.set('user_offline', new Set());
    this.eventListeners.set('typing_start', new Set());
    this.eventListeners.set('typing_stop', new Set());
  }

  connect(userId?: string) {
    if (userId) {
      this.userId = userId;
    }

    if (!this.userId) {
      console.warn('Cannot connect WebSocket without userId');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.connectionStatus = 'connecting';
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws?userId=${this.userId}`;
      
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.connectionStatus = 'error';
      this.handleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      this.isReconnecting = false;
      this.startPing();
    };

    this.ws.onmessage = (event) => {
      try {
        const wsEvent: WebSocketEvent = JSON.parse(event.data);
        this.handleEvent(wsEvent);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.connectionStatus = 'disconnected';
      this.stopPing();
      
      if (!event.wasClean && !this.isReconnecting) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus = 'error';
    };
  }

  private handleEvent(event: WebSocketEvent) {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event.type}:`, error);
        }
      });
    }
  }

  private handleReconnect() {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;
    
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`Attempting to reconnect WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Event listener management
  on(eventType: WebSocketEventType, listener: (event: WebSocketEvent) => void) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.add(listener);
    }
  }

  off(eventType: WebSocketEventType, listener: (event: WebSocketEvent) => void) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  // Send events
  send(event: Omit<WebSocketEvent, 'timestamp'>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const eventWithTimestamp = {
        ...event,
        timestamp: new Date().toISOString()
      };
      this.ws.send(JSON.stringify(eventWithTimestamp));
    } else {
      console.warn('Cannot send WebSocket message: connection not open');
    }
  }

  // Convenience methods for common events
  markNotificationAsRead(notificationId: string) {
    this.send({
      type: 'notification_read',
      data: { notificationId, userId: this.userId }
    });
  }

  startTyping(discussionId: string, username: string) {
    this.send({
      type: 'typing_start',
      data: { userId: this.userId, username, discussionId }
    });
  }

  stopTyping(discussionId: string, username: string) {
    this.send({
      type: 'typing_stop',
      data: { userId: this.userId, username, discussionId }
    });
  }

  // Connection management
  disconnect() {
    this.stopPing();
    if (this.ws) {
      this.ws.close(1000, 'User disconnect');
      this.ws = null;
    }
    this.connectionStatus = 'disconnected';
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }

  isConnected() {
    return this.connectionStatus === 'connected';
  }

  // Utility methods
  getListenerCount(eventType: WebSocketEventType): number {
    return this.eventListeners.get(eventType)?.size || 0;
  }

  clearAllListeners() {
    this.eventListeners.forEach(listeners => listeners.clear());
  }
}

// Global WebSocket manager instance
let globalWSManager: WebSocketManager | null = null;

export const getWebSocketManager = (userId?: string): WebSocketManager => {
  if (!globalWSManager || (userId && globalWSManager['userId'] !== userId)) {
    globalWSManager = new WebSocketManager(userId);
  }
  return globalWSManager;
};

export const connectWebSocket = (userId: string) => {
  const manager = getWebSocketManager(userId);
  manager.connect(userId);
  return manager;
};

export const disconnectWebSocket = () => {
  if (globalWSManager) {
    globalWSManager.disconnect();
  }
};