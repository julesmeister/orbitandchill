/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationService } from '@/db/services/notificationService';
import type { CreateNotificationData } from '@/db/services/notificationService';
import { BRAND } from '@/config/brand';

/**
 * Helper functions to create common notifications
 */

// Discussion notifications
export const createDiscussionReplyNotification = async (
  userId: string,
  replierName: string,
  discussionTitle: string,
  discussionId: string
) => {
  return NotificationService.createNotification({
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
  });
};

export const createDiscussionLikeNotification = async (
  userId: string,
  likerName: string,
  discussionTitle: string,
  discussionId: string
) => {
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
  discussionId: string
) => {
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
  discussionId: string
) => {
  return NotificationService.createNotification({
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
  chartId: string
) => {
  return NotificationService.createNotification({
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
  return NotificationService.createNotification({
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
  });
};

// System notifications
export const createSystemAnnouncementNotification = async (
  userId: string,
  title: string,
  message: string,
  url?: string
) => {
  return NotificationService.createNotification({
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
  return NotificationService.createNotification({
    userId,
    type: 'admin_warning',
    title: 'Community Guidelines Warning',
    message: `${reason}${details ? `: ${details}` : ''}`,
    icon: '⚠️',
    priority: 'urgent',
    category: 'admin',
    entityType: 'system',
    data: { reason, details }
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
  
  return NotificationService.createNotification({
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

  return NotificationService.createNotification({
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
  });
};

// Newsletter notifications
export const createNewsletterNotification = async (
  userId: string,
  subject: string,
  summary: string,
  newsletterUrl?: string
) => {
  return NotificationService.createNotification({
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