/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import type { NotificationRecord } from '@/db/services/notificationService';
import { formatDateTime } from '@/utils/dateFormatting';

interface ArchiveStats {
  total: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  oldestDate: string;
  newestDate: string;
}

interface NotificationHistoryProps {
  className?: string;
}

/**
 * Notification history and archive management component
 */
export const NotificationHistory: React.FC<NotificationHistoryProps> = ({
  className = ''
}) => {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const pageSize = 20;

  // Fetch archived notifications
  const fetchArchivedNotifications = useCallback(async (page = 1, append = false) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        userId: user.id,
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
      });

      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/notifications/archive?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch archived notifications');
      }

      const data = await response.json();
      
      if (append) {
        setNotifications(prev => [...prev, ...data.notifications]);
      } else {
        setNotifications(data.notifications);
      }
      
      setStats(data.stats);
      setHasMore(data.pagination.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching archived notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, selectedCategory, selectedPriority, searchTerm]);

  // Load more notifications
  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchArchivedNotifications(currentPage + 1, true);
    }
  };

  // Clear archive
  const clearArchive = async (olderThanDays = 90) => {
    if (!user?.id) return;

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
      
      // Refresh the list
      fetchArchivedNotifications(1);
      setShowConfirmClear(false);
      
      alert(`Deleted ${data.deletedCount} archived notifications older than ${olderThanDays} days`);
    } catch (error) {
      console.error('Error clearing archive:', error);
      alert('Failed to clear archive');
    }
  };

  // Restore selected notifications
  const restoreNotifications = async () => {
    if (!user?.id || selectedNotifications.size === 0) return;

    try {
      const notificationIds = Array.from(selectedNotifications);
      
      // Unarchive notifications by updating them
      const promises = notificationIds.map(id =>
        fetch(`/api/notifications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, action: 'unarchive' })
        })
      );

      await Promise.all(promises);
      
      // Remove restored notifications from the list
      setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
      setSelectedNotifications(new Set());
      
      // Refresh stats
      fetchArchivedNotifications(1);
    } catch (error) {
      console.error('Error restoring notifications:', error);
      alert('Failed to restore notifications');
    }
  };

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const next = new Set(prev);
      if (next.has(notificationId)) {
        next.delete(notificationId);
      } else {
        next.add(notificationId);
      }
      return next;
    });
  };

  // Select all visible notifications
  const selectAll = () => {
    setSelectedNotifications(new Set(notifications.map(n => n.id)));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedNotifications(new Set());
  };


  // Get notification icon
  const getNotificationIcon = (notification: NotificationRecord) => {
    return notification.icon || '📧';
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Initial load
  useEffect(() => {
    fetchArchivedNotifications(1);
  }, [fetchArchivedNotifications]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedNotifications(new Set());
  }, [selectedCategory, selectedPriority, searchTerm]);

  if (!user?.id) {
    return (
      <div className={`p-6 bg-white rounded-lg border ${className}`}>
        <p className="text-gray-600">Please log in to view notification history.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Notification History</h3>
          
          <div className="flex items-center space-x-2">
            {selectedNotifications.size > 0 && (
              <button
                onClick={restoreNotifications}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Restore ({selectedNotifications.size})
              </button>
            )}
            
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Archive
            </button>
          </div>
        </div>

        {/* Archive Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Archived</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{stats.byPriority.high || 0}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{stats.byCategory.social || 0}</div>
              <div className="text-sm text-gray-600">Social</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{stats.byCategory.system || 0}</div>
              <div className="text-sm text-gray-600">System</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="social">Social</option>
            <option value="system">System</option>
            <option value="reminder">Reminders</option>
            <option value="admin">Admin</option>
            <option value="premium">Premium</option>
          </select>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div className="p-6">
        {notifications.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              {selectedNotifications.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {isLoading && notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-600 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-600 animate-bounce"></div>
            </div>
            <p className="text-gray-600">Loading archived notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No archived notifications found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  selectedNotifications.has(notification.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.has(notification.id)}
                    onChange={() => toggleNotificationSelection(notification.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">
                        {getNotificationIcon(notification)} {notification.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Category: {notification.category}</span>
                      {notification.archivedAt && (
                        <span>Archived: {formatDateTime(notification.archivedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Clear Archive Confirmation */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear Archive</h3>
            <p className="text-gray-700 mb-4">
              This will permanently delete archived notifications. You can choose how far back to delete:
            </p>
            
            <div className="space-y-2 mb-4">
              <button
                onClick={() => clearArchive(30)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded"
              >
                Delete older than 30 days
              </button>
              <button
                onClick={() => clearArchive(90)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded"
              >
                Delete older than 90 days
              </button>
              <button
                onClick={() => clearArchive(365)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded"
              >
                Delete older than 1 year
              </button>
              <button
                onClick={() => clearArchive(0)}
                className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 rounded"
              >
                Delete all archived notifications
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationHistory;