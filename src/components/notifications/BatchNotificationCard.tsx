/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Link from 'next/link';
import type { NotificationRecord } from '@/db/services/notificationService';

interface BatchNotificationCardProps {
  notification: NotificationRecord;
  onMarkAsRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  className?: string;
}

/**
 * Enhanced notification card that handles batched notifications
 */
export const BatchNotificationCard: React.FC<BatchNotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onArchive,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Check if this is a batched notification
  const isBatched = notification.data?.actors && notification.data?.count > 1;
  const actors = notification.data?.actors || [];
  const count = notification.data?.count || 1;
  const contextTitle = notification.data?.contextTitle || '';

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Get priority styling
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-4 border-gray-500 bg-gray-50';
      default:
        return 'border-l-4 border-gray-300 bg-white';
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead?.(notification.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onArchive?.(notification.id);
  };

  const handleToggleDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <div
      className={`relative p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
        !notification.isRead ? getPriorityStyle(notification.priority) : 'bg-white border-gray-200'
      } ${className}`}
    >
      {/* Main notification content */}
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <span className="text-2xl">{notification.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            
            <div className="flex items-center space-x-2">
              {/* Batch indicator */}
              {isBatched && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {count} events
                </span>
              )}
              
              {/* Timestamp */}
              <span className="text-sm text-gray-500">
                {formatTime(notification.createdAt)}
              </span>
            </div>
          </div>

          {/* Message */}
          <p className={`text-sm ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'} mb-2`}>
            {notification.message}
          </p>

          {/* Batched notification details */}
          {isBatched && (
            <div className="mb-3">
              <button
                onClick={handleToggleDetails}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>{showDetails ? 'Hide details' : 'Show details'}</span>
                <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {showDetails && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {actors.length} people involved:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {actors.map((actor: string, index: number) => (
                      <span
                        key={actor}
                        className="px-2 py-1 text-xs bg-white text-gray-700 rounded border"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                  
                  {contextTitle && (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Context:</span> {contextTitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            {/* Navigation link */}
            {notification.entityUrl && (
              <Link
                href={notification.entityUrl}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View {notification.entityType}
              </Link>
            )}

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                >
                  Mark read
                </button>
              )}
              
              <button
                onClick={handleArchive}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
};

/**
 * Simplified batch notification card for compact displays
 */
export const CompactBatchNotificationCard: React.FC<BatchNotificationCardProps> = ({
  notification,
  onMarkAsRead,
  className = ''
}) => {
  const isBatched = notification.data?.actors && notification.data?.count > 1;
  const count = notification.data?.count || 1;

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  return (
    <Link
      href={notification.entityUrl || '/notifications'}
      className={`block p-3 border-b hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50' : ''
      } ${className}`}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg">{notification.icon}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </p>
            
            <div className="flex items-center space-x-2">
              {isBatched && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                  {count}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatTime(notification.createdAt)}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 truncate">
            {notification.message}
          </p>
        </div>

        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
        )}
      </div>
    </Link>
  );
};

export default BatchNotificationCard;