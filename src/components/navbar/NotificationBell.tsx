/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationRecord } from '@/db/services/notificationService';

interface NotificationBellProps {
  isMobile?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');
  const { 
    notifications, 
    summary, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    archiveNotification,
    unreadCount,
    hasUnread 
  } = useNotifications();

  const handleToggle = () => {
    if (!isOpen) {
      // Fetch notifications when opening
      fetchNotifications({ 
        isArchived: false,
        limit: 20,
        ...(activeTab === 'unread' ? { isRead: false } : {})
      });
    }
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab: 'all' | 'unread') => {
    setActiveTab(tab);
    fetchNotifications({ 
      isArchived: false,
      limit: 20,
      ...(tab === 'unread' ? { isRead: false } : {})
    });
  };

  const handleNotificationClick = async (notification: NotificationRecord) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    // Navigate to related content if URL is provided
    if (notification.entityUrl) {
      window.location.href = notification.entityUrl;
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    // Refresh current tab
    fetchNotifications({ 
      isArchived: false,
      limit: 20,
      ...(activeTab === 'unread' ? { isRead: false } : {})
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'discussion_reply':
      case 'discussion_mention':
        return '💬';
      case 'discussion_like':
        return '👍';
      case 'chart_shared':
      case 'chart_comment':
        return '⭐';
      case 'chart_like':
        return '❤️';
      case 'event_reminder':
        return '📅';
      case 'event_bookmark':
        return '🔖';
      case 'system_announcement':
        return '📢';
      case 'system_maintenance':
        return '🔧';
      case 'system_update':
        return '🆙';
      case 'admin_message':
        return '👨‍💼';
      case 'admin_warning':
        return '⚠️';
      case 'premium_upgrade':
        return '⭐';
      case 'premium_expiry':
        return '⏰';
      case 'welcome':
        return '👋';
      case 'newsletter':
        return '📰';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative p-2 text-black hover:text-gray-600 transition-colors ${
          isMobile ? 'text-lg' : 'text-base'
        }`}
        aria-label={`Notifications ${hasUnread ? `(${unreadCount} unread)` : ''}`}
      >
        {/* Bell Icon */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-0">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className={`absolute ${isMobile ? 'right-0' : 'right-0'} mt-2 z-50 bg-white border border-black shadow-lg ${
            isMobile ? 'w-80 max-w-[90vw]' : 'w-96'
          }`}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black font-space-grotesk">
                  Notifications
                </h3>
                {hasUnread && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              {/* Tabs */}
              <div className="flex mt-2 space-x-1">
                <button
                  onClick={() => handleTabChange('unread')}
                  className={`px-3 py-1 text-xs font-medium border transition-colors ${
                    activeTab === 'unread'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => handleTabChange('all')}
                  className={`px-3 py-1 text-xs font-medium border transition-colors ${
                    activeTab === 'all'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span className="ml-2 text-sm">Loading...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-2xl mb-2">🔕</div>
                  <p className="text-sm">
                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <span className="text-lg">
                            {notification.icon || getNotificationIcon(notification.type)}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''} text-black`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority !== 'medium' && notification.priority}
                            </span>
                          </div>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page when implemented
                    window.location.href = '/notifications';
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;