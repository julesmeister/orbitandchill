/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationService } from '@/db/services/notificationService';
import type { CreateNotificationData, EntityType } from '@/db/services/notificationService';
import { BRAND } from '@/config/brand';
import { BatchNotificationManager } from './batchNotifications';
import { createReliableNotification } from './notificationReliability';
import { createNotificationWithDeduplication } from './notificationDeduplication';
import { createNotificationWithRateLimit } from './notificationRateLimit';
import { notificationHealthMonitor } from './notificationHealthMonitor';

/**
 * Enhanced helper functions to create reliable, deduplicated, and rate-limited notifications
 * Integrates delivery guarantees, deduplication, rate limiting, and health monitoring
 */

/**
 * Create a notification with full reliability features
 */
const createEnhancedNotification = async (
  notificationData: CreateNotificationData,
  options: {
    enableReliability?: boolean;
    enableDeduplication?: boolean;
    enableRateLimit?: boolean;
    actorId?: string;
  } = {}
): Promise<any> => {
  const {
    enableReliability = true,
    enableDeduplication = true, 
    enableRateLimit = true,
    actorId
  } = options;

  const startTime = Date.now();
  let success = false;

  try {
    // Enhanced notification creation with all reliability features
    if (enableRateLimit) {
      const result = await createNotificationWithRateLimit(
        { ...notificationData, actorId },
        async () => {
          if (enableDeduplication) {
            return await createNotificationWithDeduplication(
              { ...notificationData, actorId },
              async () => {
                if (enableReliability) {
                  return await createReliableNotification(
                    notificationData,
                    () => NotificationService.createNotification(notificationData)
                  );
                } else {
                  return await NotificationService.createNotification(notificationData);
                }
              }
            );
          } else {
            if (enableReliability) {
              return await createReliableNotification(
                notificationData,
                () => NotificationService.createNotification(notificationData)
              );
            } else {
              return await NotificationService.createNotification(notificationData);
            }
          }
        }
      );
      
      success = result.success;
      
      if (result.rateLimited) {
        console.warn(`Notification rate limited: ${result.reason}`);
        return null;
      }
      
      if (result.success && result.notificationId) {
        return { id: result.notificationId };
      }
      
      return null;
    } else {
      // Simplified path without rate limiting
      const notification = await NotificationService.createNotification(notificationData);
      success = !!(notification && notification.id !== undefined);
      return notification;
    }
  } catch (error) {
    console.error('Enhanced notification creation failed:', error);
    success = false;
    return null;
  } finally {
    // Record performance metrics
    const duration = Date.now() - startTime;
    notificationHealthMonitor.recordPerformance(
      `create_${notificationData.type}`,
      duration,
      success
    );
  }
};

/**
 * Helper functions to create common notifications
 */

// Discussion notifications
export const createDiscussionReplyNotification = async (
  userId: string,
  replierName: string,
  discussionTitle: string,
  discussionId: string,
  actorId?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'discussion_reply',
    title: 'New reply to your discussion',
    message: `${replierName} replied to "${discussionTitle.substring(0, 50)}${discussionTitle.length > 50 ? '...' : ''}"`,
    icon: '💬',
    priority: 'medium',
    category: 'social',
    entityType: 'discussion',
    entityId: discussionId,
    entityUrl: `/discussions/${discussionId}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }, {
    actorId: actorId || replierName
  });
};

export const createDiscussionLikeNotification = async (
  userId: string,
  likerName: string,
  discussionTitle: string,
  discussionId: string,
  enableBatching: boolean = true
) => {
  if (enableBatching) {
    // Use batch notification system for likes
    return BatchNotificationManager.addToBatch({
      userId,
      type: 'discussion_like',
      entityType: 'discussion',
      entityId: discussionId,
      actorName: likerName,
      contextTitle: discussionTitle,
      timestamp: new Date()
    });
  }

  // Fallback to immediate notification
  return NotificationService.createNotification({
    userId,
    type: 'discussion_like',
    title: 'Your discussion was liked',
    message: `${likerName} liked your discussion "${discussionTitle.substring(0, 50)}${discussionTitle.length > 50 ? '...' : ''}"`,
    icon: '👍',
    priority: 'low',
    category: 'social',
    entityType: 'discussion',
    entityId: discussionId,
    entityUrl: `/discussions/${discussionId}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

export const createReplyLikeNotification = async (
  userId: string,
  likerName: string,
  discussionTitle: string,
  discussionId: string,
  enableBatching: boolean = true
) => {
  if (enableBatching) {
    // Use batch notification system for reply likes
    return BatchNotificationManager.addToBatch({
      userId,
      type: 'discussion_like',
      entityType: 'discussion',
      entityId: discussionId,
      actorName: likerName,
      contextTitle: discussionTitle,
      timestamp: new Date()
    });
  }

  // Fallback to immediate notification
  return NotificationService.createNotification({
    userId,
    type: 'discussion_like', // Reuse discussion_like type for reply likes
    title: 'Your comment was liked',
    message: `${likerName} liked your comment in "${discussionTitle.substring(0, 50)}${discussionTitle.length > 50 ? '...' : ''}"`,
    icon: '👍',
    priority: 'low',
    category: 'social',
    entityType: 'discussion',
    entityId: discussionId,
    entityUrl: `/discussions/${discussionId}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
};

export const createDiscussionMentionNotification = async (
  userId: string,
  mentionerName: string,
  discussionTitle: string,
  discussionId: string,
  actorId?: string
) => {
  // Mentions are high priority and bypass batching but still use other reliability features
  return createEnhancedNotification({
    userId,
    type: 'discussion_mention',
    title: 'You were mentioned',
    message: `${mentionerName} mentioned you in "${discussionTitle.substring(0, 50)}${discussionTitle.length > 50 ? '...' : ''}"`,
    icon: '@',
    priority: 'high',
    category: 'social',
    entityType: 'discussion',
    entityId: discussionId,
    entityUrl: `/discussions/${discussionId}`,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
  }, {
    actorId: actorId || mentionerName
  });
};

// Chart notifications
export const createChartSharedNotification = async (
  userId: string,
  sharerName: string,
  chartTitle: string,
  chartId: string
) => {
  return NotificationService.createNotification({
    userId,
    type: 'chart_shared',
    title: 'Chart shared with you',
    message: `${sharerName} shared a natal chart: "${chartTitle}"`,
    icon: '⭐',
    priority: 'medium',
    category: 'social',
    entityType: 'chart',
    entityId: chartId,
    entityUrl: `/chart/shared/${chartId}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
};

export const createChartCommentNotification = async (
  userId: string,
  commenterName: string,
  chartTitle: string,
  chartId: string,
  actorId?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'chart_comment',
    title: 'New comment on your chart',
    message: `${commenterName} commented on your chart "${chartTitle}"`,
    icon: '💭',
    priority: 'medium',
    category: 'social',
    entityType: 'chart',
    entityId: chartId,
    entityUrl: `/chart/${chartId}`,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
  }, {
    actorId: actorId || commenterName
  });
};

// Missing Chart Notifications
export const createChartLikeNotification = async (
  userId: string,
  likerName: string,
  chartTitle: string,
  chartId: string,
  enableBatching: boolean = true,
  actorId?: string
) => {
  if (enableBatching) {
    return BatchNotificationManager.addToBatch({
      userId,
      type: 'chart_like',
      entityType: 'chart',
      entityId: chartId,
      actorName: likerName,
      contextTitle: chartTitle,
      timestamp: new Date()
    });
  }

  return createEnhancedNotification({
    userId,
    type: 'chart_like',
    title: 'Your chart was liked',
    message: `${likerName} liked your chart "${chartTitle}"`,
    icon: '❤️',
    priority: 'low',
    category: 'social',
    entityType: 'chart',
    entityId: chartId,
    entityUrl: `/chart/${chartId}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }, {
    actorId: actorId || likerName
  });
};

// User Interaction Notifications
export const createFollowNotification = async (
  userId: string,
  followerName: string,
  followerId: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'follow_new',
    title: 'New follower',
    message: `${followerName} started following you`,
    icon: '👤',
    priority: 'medium',
    category: 'social',
    entityType: 'user',
    entityId: followerId,
    entityUrl: `/profile/${followerId}`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }, {
    actorId: followerId
  });
};

export const createProfileViewNotification = async (
  userId: string,
  viewerName: string,
  viewerId: string,
  enableBatching: boolean = true
) => {
  if (enableBatching) {
    return BatchNotificationManager.addToBatch({
      userId,
      type: 'profile_view',
      entityType: 'user',
      entityId: viewerId,
      actorName: viewerName,
      contextTitle: 'Profile View',
      timestamp: new Date()
    });
  }

  return createEnhancedNotification({
    userId,
    type: 'profile_view',
    title: 'Profile view',
    message: `${viewerName} viewed your profile`,
    icon: '👁️',
    priority: 'low',
    category: 'social',
    entityType: 'user',
    entityId: viewerId,
    entityUrl: `/profile/${viewerId}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }, {
    actorId: viewerId
  });
};

// Event notifications
export const createEventReminderNotification = async (
  userId: string,
  eventTitle: string,
  eventDate: string,
  eventId: string,
  reminderTime: 'day' | 'hour' | 'now' = 'day'
) => {
  const messages = {
    day: `Tomorrow: ${eventTitle}`,
    hour: `In 1 hour: ${eventTitle}`,
    now: `Happening now: ${eventTitle}`
  };

  const priorities = {
    day: 'medium' as const,
    hour: 'high' as const,
    now: 'urgent' as const
  };

  return NotificationService.createNotification({
    userId,
    type: 'event_reminder',
    title: 'Event Reminder',
    message: messages[reminderTime],
    icon: '📅',
    priority: priorities[reminderTime],
    category: 'reminder',
    entityType: 'event',
    entityId: eventId,
    entityUrl: `/events?eventId=${eventId}`,
    data: { eventDate, reminderType: reminderTime }
  });
};

export const createEventBookmarkNotification = async (
  userId: string,
  eventTitle: string,
  eventId: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'event_bookmark',
    title: 'Event bookmarked',
    message: `You bookmarked "${eventTitle}" - check your bookmarks to view optimal timing details`,
    icon: '🔖',
    priority: 'low',
    category: 'reminder',
    entityType: 'event',
    entityId: eventId,
    entityUrl: `/events?tab=bookmarked`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }, {
    actorId: 'system'
  });
};

export const createEventUpdateNotification = async (
  userId: string,
  eventTitle: string,
  updateType: string,
  eventId: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'event_update',
    title: 'Event updated',
    message: `"${eventTitle}" has been updated: ${updateType}`,
    icon: '🔄',
    priority: 'medium',
    category: 'reminder',
    entityType: 'event',
    entityId: eventId,
    entityUrl: `/events/${eventId}`,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
  }, {
    actorId: 'system'
  });
};

// Missing System Notifications
export const createSystemUpdateNotification = async (
  userId: string,
  updateTitle: string,
  updateDescription: string,
  updateUrl?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'system_update',
    title: `New Feature: ${updateTitle}`,
    message: updateDescription,
    icon: '🆙',
    priority: 'medium',
    category: 'system',
    entityType: 'system',
    entityUrl: updateUrl,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }, {
    actorId: 'system'
  });
};

// Health & Performance Notifications
export const createSystemHealthNotification = async (
  userId: string,
  healthStatus: 'healthy' | 'degraded' | 'critical',
  details?: string
) => {
  const priority = healthStatus === 'critical' ? 'urgent' : healthStatus === 'degraded' ? 'high' : 'medium';
  const icons = { healthy: '💚', degraded: '🟡', critical: '🔴' };
  
  return createEnhancedNotification({
    userId,
    type: 'system_health',
    title: `System Health: ${healthStatus}`,
    message: details || `System status is ${healthStatus}`,
    icon: icons[healthStatus],
    priority,
    category: 'system',
    entityType: 'system',
    data: { healthStatus, details }
  }, {
    actorId: 'system'
  });
};

export const createAnalyticsSuccessNotification = async (
  userId: string,
  analyticsType: string,
  resultsUrl?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'analytics_success',
    title: 'Analytics Processing Complete',
    message: `${analyticsType} analytics have been processed successfully`,
    icon: '📊',
    priority: 'low',
    category: 'system',
    entityType: 'system',
    entityUrl: resultsUrl,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }, {
    actorId: 'system'
  });
};

export const createAnalyticsFailureNotification = async (
  userId: string,
  analyticsType: string,
  errorMessage?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'analytics_failure',
    title: 'Analytics Processing Failed',
    message: `${analyticsType} analytics processing failed${errorMessage ? ': ' + errorMessage : ''}`,
    icon: '📉',
    priority: 'high',
    category: 'system',
    entityType: 'system',
    data: { analyticsType, errorMessage }
  }, {
    actorId: 'system'
  });
};

export const createCronSuccessNotification = async (
  userId: string,
  jobName: string,
  jobDetails?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'cron_success',
    title: 'Scheduled Task Complete',
    message: `${jobName} completed successfully${jobDetails ? ': ' + jobDetails : ''}`,
    icon: '⏰',
    priority: 'low',
    category: 'system',
    entityType: 'system',
    data: { jobName, jobDetails },
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
  }, {
    actorId: 'system'
  });
};

export const createCronFailureNotification = async (
  userId: string,
  jobName: string,
  errorMessage?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'cron_failure',
    title: 'Scheduled Task Failed',
    message: `${jobName} failed to complete${errorMessage ? ': ' + errorMessage : ''}`,
    icon: '🚨',
    priority: 'urgent',
    category: 'system',
    entityType: 'system',
    data: { jobName, errorMessage }
  }, {
    actorId: 'system'
  });
};

export const createTrafficSpikeNotification = async (
  userId: string,
  trafficIncrease: string,
  currentLoad?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'traffic_spike',
    title: 'Traffic Spike Detected',
    message: `Unusual traffic detected: ${trafficIncrease} increase${currentLoad ? ' (Current load: ' + currentLoad + ')' : ''}`,
    icon: '📈',
    priority: 'high',
    category: 'system',
    entityType: 'system',
    data: { trafficIncrease, currentLoad }
  }, {
    actorId: 'system'
  });
};

export const createDataAggregationNotification = async (
  userId: string,
  dataType: string,
  recordsProcessed?: number,
  resultsUrl?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'data_aggregation',
    title: 'Data Aggregation Complete',
    message: `${dataType} data aggregation completed${recordsProcessed ? ` (${recordsProcessed} records processed)` : ''}`,
    icon: '📈',
    priority: 'low',
    category: 'system',
    entityType: 'system',
    entityUrl: resultsUrl,
    data: { dataType, recordsProcessed },
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }, {
    actorId: 'system'
  });
};

// User Account Notifications
export const createAccountSecurityNotification = async (
  userId: string,
  securityEvent: string,
  details?: string,
  actionRequired?: boolean
) => {
  return createEnhancedNotification({
    userId,
    type: 'account_security',
    title: 'Security Alert',
    message: `${securityEvent}${details ? ': ' + details : ''}${actionRequired ? ' (Action required)' : ''}`,
    icon: '🔒',
    priority: actionRequired ? 'urgent' : 'high',
    category: 'system',
    entityType: 'system',
    entityUrl: '/settings/security',
    data: { securityEvent, details, actionRequired }
  }, {
    actorId: 'system'
  });
};

export const createDataExportNotification = async (
  userId: string,
  exportType: string,
  downloadUrl: string,
  expiresAt?: Date
) => {
  return createEnhancedNotification({
    userId,
    type: 'data_export',
    title: 'Data Export Ready',
    message: `Your ${exportType} export is ready for download`,
    icon: '📥',
    priority: 'medium',
    category: 'system',
    entityType: 'system',
    entityUrl: downloadUrl,
    data: { exportType, downloadUrl },
    expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }, {
    actorId: 'system'
  });
};

// System notifications
export const createSystemAnnouncementNotification = async (
  userId: string,
  title: string,
  message: string,
  url?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'system_announcement',
    title,
    message,
    icon: '📢',
    priority: 'medium',
    category: 'system',
    entityType: 'system',
    entityUrl: url,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }, {
    actorId: 'system'
  });
};

export const createSystemMaintenanceNotification = async (
  userId: string,
  scheduledTime: string,
  duration: string
) => {
  return NotificationService.createNotification({
    userId,
    type: 'system_maintenance',
    title: 'Scheduled Maintenance',
    message: `System maintenance scheduled for ${scheduledTime}. Expected duration: ${duration}`,
    icon: '🔧',
    priority: 'high',
    category: 'system',
    entityType: 'system',
    data: { scheduledTime, duration }
  });
};

// Admin notifications
export const createAdminMessageNotification = async (
  userId: string,
  title: string,
  message: string,
  adminName: string
) => {
  return NotificationService.createNotification({
    userId,
    type: 'admin_message',
    title: `Message from ${adminName}`,
    message,
    icon: '👨‍💼',
    priority: 'high',
    category: 'admin',
    entityType: 'system',
    data: { adminName }
  });
};

export const createAdminWarningNotification = async (
  userId: string,
  reason: string,
  details?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'admin_warning',
    title: 'Community Guidelines Warning',
    message: `${reason}${details ? `: ${details}` : ''}`,
    icon: '⚠️',
    priority: 'urgent',
    category: 'admin',
    entityType: 'system',
    data: { reason, details }
  }, {
    actorId: 'system'
  });
};

export const createModerationRequiredNotification = async (
  userId: string,
  contentType: string,
  contentId: string,
  reason: string,
  reporterName?: string
) => {
  // Map contentType to valid EntityType
  const getEntityType = (type: string): EntityType => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
      case 'discussion':
        return 'discussion';
      case 'reply':
        return 'reply';
      case 'chart':
        return 'chart';
      case 'event':
        return 'event';
      case 'user':
        return 'user';
      case 'analytics':
        return 'analytics';
      default:
        return 'system';
    }
  };

  return createEnhancedNotification({
    userId,
    type: 'moderation_required',
    title: 'Content Requires Moderation',
    message: `${contentType} requires review: ${reason}${reporterName ? ` (Reported by ${reporterName})` : ''}`,
    icon: '🚨',
    priority: 'high',
    category: 'admin',
    entityType: getEntityType(contentType),
    entityId: contentId,
    entityUrl: `/admin/moderation/${contentType.toLowerCase()}/${contentId}`,
    data: { contentType, contentId, reason, reporterName }
  }, {
    actorId: 'system'
  });
};

export const createUserReportNotification = async (
  userId: string,
  reportedUserId: string,
  reportedUsername: string,
  reportReason: string,
  reporterName?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'user_report',
    title: 'User Report Received',
    message: `User ${reportedUsername} has been reported: ${reportReason}${reporterName ? ` (By ${reporterName})` : ''}`,
    icon: '🚨',
    priority: 'high',
    category: 'admin',
    entityType: 'user',
    entityId: reportedUserId,
    entityUrl: `/admin/users/${reportedUserId}`,
    data: { reportedUserId, reportedUsername, reportReason, reporterName }
  }, {
    actorId: 'system'
  });
};

// Premium notifications
export const createPremiumUpgradeNotification = async (
  userId: string,
  tier: string
) => {
  return NotificationService.createNotification({
    userId,
    type: 'premium_upgrade',
    title: 'Welcome to Premium!',
    message: `Your account has been upgraded to ${tier}. Enjoy exclusive features!`,
    icon: '⭐',
    priority: 'medium',
    category: 'premium',
    entityType: 'system',
    entityUrl: '/settings',
    data: { tier }
  });
};

export const createPremiumExpiryNotification = async (
  userId: string,
  expiryDate: string,
  daysLeft: number
) => {
  const isUrgent = daysLeft <= 3;
  
  return createEnhancedNotification({
    userId,
    type: 'premium_expiry',
    title: isUrgent ? 'Premium Expiring Soon!' : 'Premium Renewal Reminder',
    message: `Your premium subscription expires ${isUrgent ? 'in ' + daysLeft + ' days' : 'on ' + expiryDate}`,
    icon: '⏰',
    priority: isUrgent ? 'urgent' : 'high',
    category: 'premium',
    entityType: 'system',
    entityUrl: '/settings',
    data: { expiryDate, daysLeft }
  }, {
    actorId: 'system'
  });
};

export const createPremiumRenewalNotification = async (
  userId: string,
  tier: string,
  renewalDate: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'premium_renewal',
    title: 'Premium Subscription Renewed',
    message: `Your ${tier} subscription has been renewed until ${renewalDate}`,
    icon: '✨',
    priority: 'medium',
    category: 'premium',
    entityType: 'system',
    entityUrl: '/settings',
    data: { tier, renewalDate }
  }, {
    actorId: 'system'
  });
};

export const createPremiumTrialNotification = async (
  userId: string,
  trialStatus: 'started' | 'ending' | 'ended',
  daysLeft?: number,
  tier?: string
) => {
  const messages = {
    started: `Your ${tier} trial has started! Enjoy premium features.`,
    ending: `Your ${tier} trial ends in ${daysLeft} days. Upgrade to continue.`,
    ended: `Your ${tier} trial has ended. Upgrade to restore premium features.`
  };
  
  const priorities = {
    started: 'medium' as const,
    ending: 'high' as const,
    ended: 'urgent' as const
  };

  return createEnhancedNotification({
    userId,
    type: 'premium_trial',
    title: `Premium Trial ${trialStatus.charAt(0).toUpperCase() + trialStatus.slice(1)}`,
    message: messages[trialStatus],
    icon: '🎆',
    priority: priorities[trialStatus],
    category: 'premium',
    entityType: 'system',
    entityUrl: '/settings',
    data: { trialStatus, daysLeft, tier }
  }, {
    actorId: 'system'
  });
};

// Welcome and onboarding notifications
export const createWelcomeNotification = async (
  userId: string,
  username: string,
  isNewUser: boolean = true
) => {
  const message = isNewUser 
    ? `Welcome to ${BRAND.name}, ${username}! Explore your natal chart, discover optimal timing, and connect with our astrology community.`
    : `Welcome back, ${username}! Check out what's new since your last visit.`;

  return createEnhancedNotification({
    userId,
    type: 'welcome',
    title: isNewUser ? `Welcome to ${BRAND.name}!` : 'Welcome back!',
    message,
    icon: '👋',
    priority: 'medium',
    category: 'system',
    entityType: 'system',
    entityUrl: isNewUser ? '/guides' : '/chart',
    data: { isNewUser, username }
  }, {
    actorId: 'system'
  });
};

// Newsletter notifications
export const createNewsletterNotification = async (
  userId: string,
  subject: string,
  summary: string,
  newsletterUrl?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'newsletter',
    title: 'New Newsletter Available',
    message: `${subject}: ${summary.substring(0, 100)}${summary.length > 100 ? '...' : ''}`,
    icon: '📰',
    priority: 'low',
    category: 'system',
    entityType: 'system',
    entityUrl: newsletterUrl,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
  }, {
    actorId: 'system'
  });
};

export const createEducationalContentNotification = async (
  userId: string,
  contentTitle: string,
  contentType: string,
  contentUrl: string,
  description?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'educational_content',
    title: 'New Learning Resource Available',
    message: `New ${contentType}: ${contentTitle}${description ? ' - ' + description : ''}`,
    icon: '📚',
    priority: 'low',
    category: 'system',
    entityType: 'system',
    entityUrl: contentUrl,
    data: { contentTitle, contentType, description },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }, {
    actorId: 'system'
  });
};

export const createFeatureTourNotification = async (
  userId: string,
  featureName: string,
  tourUrl: string,
  description?: string
) => {
  return createEnhancedNotification({
    userId,
    type: 'feature_tour',
    title: `Discover: ${featureName}`,
    message: `Take a guided tour of ${featureName}${description ? ' - ' + description : ''}`,
    icon: '🎆',
    priority: 'low',
    category: 'system',
    entityType: 'system',
    entityUrl: tourUrl,
    data: { featureName, description },
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
  }, {
    actorId: 'system'
  });
};

// Bulk notification helpers
export const createBulkNotificationForAllUsers = async (
  userIds: string[],
  notificationData: Omit<CreateNotificationData, 'userId'>
) => {
  return NotificationService.createBulkNotifications(userIds, notificationData);
};

export const createSystemAnnouncementForAllUsers = async (
  userIds: string[],
  title: string,
  message: string,
  url?: string
) => {
  return createBulkNotificationForAllUsers(userIds, {
    type: 'system_announcement',
    title,
    message,
    icon: '📢',
    priority: 'medium',
    category: 'system',
    entityType: 'system',
    entityUrl: url,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
};

// Helper to create delayed notifications (for scheduling)
export const scheduleNotification = async (
  notificationData: CreateNotificationData,
  scheduleFor: Date
) => {
  return NotificationService.createNotification({
    ...notificationData,
    scheduledFor: scheduleFor
  });
};

// Batch notification helpers
export const createBatchedDiscussionLike = async (
  userId: string,
  likerName: string,
  discussionTitle: string,
  discussionId: string
) => {
  return BatchNotificationManager.addToBatch({
    userId,
    type: 'discussion_like',
    entityType: 'discussion',
    entityId: discussionId,
    actorName: likerName,
    contextTitle: discussionTitle,
    timestamp: new Date()
  });
};

export const createBatchedChartLike = async (
  userId: string,
  likerName: string,
  chartTitle: string,
  chartId: string
) => {
  return BatchNotificationManager.addToBatch({
    userId,
    type: 'chart_like',
    entityType: 'chart',
    entityId: chartId,
    actorName: likerName,
    contextTitle: chartTitle,
    timestamp: new Date()
  });
};

export const createBatchedDiscussionReply = async (
  userId: string,
  replierName: string,
  discussionTitle: string,
  discussionId: string
) => {
  return BatchNotificationManager.addToBatch({
    userId,
    type: 'discussion_reply',
    entityType: 'discussion',
    entityId: discussionId,
    actorName: replierName,
    contextTitle: discussionTitle,
    timestamp: new Date()
  });
};

// Force process all pending batches (useful for testing/cleanup)
export const processPendingBatches = async () => {
  return BatchNotificationManager.processAllPendingBatches();
};

// Get batch statistics
export const getBatchStats = () => {
  return BatchNotificationManager.getBatchStats();
};

// Health monitoring functions
export const getNotificationSystemHealth = async () => {
  return await notificationHealthMonitor.getHealthStatus();
};

export const startNotificationHealthMonitoring = (intervalMinutes: number = 5) => {
  notificationHealthMonitor.startMonitoring(intervalMinutes);
};

export const stopNotificationHealthMonitoring = () => {
  notificationHealthMonitor.stopMonitoring();
};

export const getNotificationSystemAlerts = () => {
  return notificationHealthMonitor.getActiveAlerts();
};

// Reliability testing functions
export const testNotificationReliability = async (userId: string) => {
  console.log('Testing notification reliability features...');
  
  // Test rate limiting
  console.log('Testing rate limiting...');
  for (let i = 0; i < 25; i++) {
    await createWelcomeNotification(userId, `TestUser${i}`);
  }
  
  // Test deduplication
  console.log('Testing deduplication...');
  for (let i = 0; i < 5; i++) {
    await createDiscussionReplyNotification(userId, 'TestReplier', 'Test Discussion', 'test-123');
  }
  
  // Test delivery reliability
  console.log('Testing delivery reliability...');
  await createSystemAnnouncementNotification(userId, 'Reliability Test', 'This tests the delivery mechanism');
  
  console.log('Reliability test complete. Check system health for results.');
};

// Note: createBatchedChartLike already defined above

export const createBatchedProfileView = async (
  userId: string,
  viewerName: string,
  viewerId: string
) => {
  return BatchNotificationManager.addToBatch({
    userId,
    type: 'profile_view',
    entityType: 'user',
    entityId: viewerId,
    actorName: viewerName,
    contextTitle: 'Profile View',
    timestamp: new Date()
  });
};

// Emergency functions
export const emergencyStopAllNotifications = () => {
  console.warn('EMERGENCY: Stopping all notification systems');
  stopNotificationHealthMonitoring();
  // Additional emergency procedures could be added here
};

export const getSystemDiagnostics = async () => {
  return {
    health: await getNotificationSystemHealth(),
    batchStats: getBatchStats(),
    timestamp: new Date().toISOString()
  };
};

// Utility function to create any notification type with enhanced features
export const createNotificationByType = async (
  type: string,
  userId: string,
  data: Record<string, any>
): Promise<any> => {
  // Route to appropriate notification function based on type
  switch (type) {
    case 'discussion_reply':
      return createDiscussionReplyNotification(userId, data.replierName, data.discussionTitle, data.discussionId, data.actorId);
    case 'discussion_like':
      return createDiscussionLikeNotification(userId, data.likerName, data.discussionTitle, data.discussionId, data.enableBatching);
    case 'discussion_mention':
      return createDiscussionMentionNotification(userId, data.mentionerName, data.discussionTitle, data.discussionId, data.actorId);
    case 'chart_shared':
      return createChartSharedNotification(userId, data.sharerName, data.chartTitle, data.chartId);
    case 'chart_comment':
      return createChartCommentNotification(userId, data.commenterName, data.chartTitle, data.chartId, data.actorId);
    case 'chart_like':
      return createChartLikeNotification(userId, data.likerName, data.chartTitle, data.chartId, data.enableBatching, data.actorId);
    case 'follow_new':
      return createFollowNotification(userId, data.followerName, data.followerId);
    case 'profile_view':
      return createProfileViewNotification(userId, data.viewerName, data.viewerId, data.enableBatching);
    case 'event_reminder':
      return createEventReminderNotification(userId, data.eventTitle, data.eventDate, data.eventId, data.reminderTime);
    case 'event_bookmark':
      return createEventBookmarkNotification(userId, data.eventTitle, data.eventId);
    case 'event_update':
      return createEventUpdateNotification(userId, data.eventTitle, data.updateType, data.eventId);
    case 'system_announcement':
      return createSystemAnnouncementNotification(userId, data.title, data.message, data.url);
    case 'system_maintenance':
      return createSystemMaintenanceNotification(userId, data.scheduledTime, data.duration);
    case 'system_update':
      return createSystemUpdateNotification(userId, data.updateTitle, data.updateDescription, data.updateUrl);
    case 'welcome':
      return createWelcomeNotification(userId, data.username, data.isNewUser);
    case 'follow_new':
      return createFollowNotification(userId, data.followerName, data.followerId);
    case 'profile_view':
      return createProfileViewNotification(userId, data.viewerName, data.viewerId, data.enableBatching);
    case 'event_update':
      return createEventUpdateNotification(userId, data.eventTitle, data.updateType, data.eventId);
    case 'system_update':
      return createSystemUpdateNotification(userId, data.updateTitle, data.updateDescription, data.updateUrl);
    case 'premium_renewal':
      return createPremiumRenewalNotification(userId, data.tier, data.renewalDate);
    case 'premium_trial':
      return createPremiumTrialNotification(userId, data.trialStatus, data.daysLeft, data.tier);
    case 'educational_content':
      return createEducationalContentNotification(userId, data.contentTitle, data.contentType, data.contentUrl, data.description);
    case 'feature_tour':
      return createFeatureTourNotification(userId, data.featureName, data.tourUrl, data.description);
    case 'newsletter':
      return createNewsletterNotification(userId, data.subject, data.summary, data.newsletterUrl);
    case 'data_aggregation':
      return createDataAggregationNotification(userId, data.dataType, data.recordsProcessed, data.resultsUrl);
    case 'account_security':
      return createAccountSecurityNotification(userId, data.securityEvent, data.details, data.actionRequired);
    case 'data_export':
      return createDataExportNotification(userId, data.exportType, data.downloadUrl, data.expiresAt);
    case 'moderation_required':
      return createModerationRequiredNotification(userId, data.contentType, data.contentId, data.reason, data.reporterName);
    case 'user_report':
      return createUserReportNotification(userId, data.reportedUserId, data.reportedUsername, data.reportReason, data.reporterName);
    case 'analytics_success':
      return createAnalyticsSuccessNotification(userId, data.analyticsType, data.resultsUrl);
    case 'analytics_failure':
      return createAnalyticsFailureNotification(userId, data.analyticsType, data.errorMessage);
    case 'cron_success':
      return createCronSuccessNotification(userId, data.jobName, data.jobDetails);
    case 'cron_failure':
      return createCronFailureNotification(userId, data.jobName, data.errorMessage);
    case 'traffic_spike':
      return createTrafficSpikeNotification(userId, data.trafficIncrease, data.currentLoad);
    case 'system_health':
      return createSystemHealthNotification(userId, data.healthStatus, data.details);
    default:
      throw new Error(`Unknown notification type: ${type}`);
  }
};

// Helper to create expiring notifications
export const createExpiringNotification = async (
  notificationData: CreateNotificationData,
  expiresInDays: number
) => {
  return NotificationService.createNotification({
    ...notificationData,
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
  });
};