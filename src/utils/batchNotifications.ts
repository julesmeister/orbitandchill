/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationService } from '@/db/services/notificationService';
import type { NotificationType, NotificationPriority, NotificationCategory, EntityType } from '@/db/services/notificationService';

interface BatchableNotification {
  userId: string;
  type: NotificationType;
  entityType: EntityType;
  entityId: string;
  actorName: string;
  contextTitle: string;
  timestamp: Date;
}

interface BatchedNotification {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  entityType: EntityType;
  entityId: string;
  entityUrl: string;
  data: {
    actors: string[];
    count: number;
    latest: Date;
    contextTitle: string;
  };
}

/**
 * Batch notification manager for grouping similar notifications
 */
export class BatchNotificationManager {
  private static pendingBatches = new Map<string, BatchableNotification[]>();
  private static batchTimeouts = new Map<string, NodeJS.Timeout>();
  private static readonly BATCH_DELAY = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_BATCH_SIZE = 10;

  /**
   * Add a notification to a batch or create immediate notification
   */
  static async addToBatch(notification: BatchableNotification): Promise<void> {
    const batchKey = this.getBatchKey(notification);
    const shouldBatch = this.shouldBatchNotification(notification.type);

    if (!shouldBatch) {
      // Create immediate notification for non-batchable types
      await this.createImmediateNotification(notification);
      return;
    }

    // Add to batch
    if (!this.pendingBatches.has(batchKey)) {
      this.pendingBatches.set(batchKey, []);
    }

    const batch = this.pendingBatches.get(batchKey)!;
    
    // Check if actor already exists in batch
    const existingIndex = batch.findIndex(b => b.actorName === notification.actorName);
    if (existingIndex >= 0) {
      // Update existing entry with latest timestamp
      batch[existingIndex].timestamp = notification.timestamp;
    } else {
      batch.push(notification);
    }

    // If batch is full, process immediately
    if (batch.length >= this.MAX_BATCH_SIZE) {
      await this.processBatch(batchKey);
      return;
    }

    // Reset batch timer
    this.resetBatchTimer(batchKey);
  }

  /**
   * Determine if notification type should be batched
   */
  private static shouldBatchNotification(type: NotificationType): boolean {
    const batchableTypes: NotificationType[] = [
      'discussion_like',
      'chart_like',
      'discussion_reply', // Only for popular discussions
    ];
    
    return batchableTypes.includes(type);
  }

  /**
   * Generate unique batch key for grouping notifications
   */
  private static getBatchKey(notification: BatchableNotification): string {
    return `${notification.userId}_${notification.type}_${notification.entityType}_${notification.entityId}`;
  }

  /**
   * Reset the batch timer for a specific batch
   */
  private static resetBatchTimer(batchKey: string): void {
    // Clear existing timer
    const existingTimer = this.batchTimeouts.get(batchKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      await this.processBatch(batchKey);
    }, this.BATCH_DELAY);

    this.batchTimeouts.set(batchKey, timer);
  }

  /**
   * Process a batch and create grouped notification
   */
  private static async processBatch(batchKey: string): Promise<void> {
    const batch = this.pendingBatches.get(batchKey);
    if (!batch || batch.length === 0) return;

    // Clear timer
    const timer = this.batchTimeouts.get(batchKey);
    if (timer) {
      clearTimeout(timer);
      this.batchTimeouts.delete(batchKey);
    }

    try {
      const batchedNotification = this.createBatchedNotification(batch);
      await NotificationService.createNotification(batchedNotification);
      
      console.log(`✅ Created batched notification for ${batch.length} events:`, batchedNotification.title);
    } catch (error) {
      console.error('Failed to create batched notification:', error);
      
      // Fallback: create individual notifications
      for (const notification of batch) {
        try {
          await this.createImmediateNotification(notification);
        } catch (fallbackError) {
          console.error('Failed to create fallback notification:', fallbackError);
        }
      }
    } finally {
      // Clean up
      this.pendingBatches.delete(batchKey);
    }
  }

  /**
   * Create a batched notification from multiple events
   */
  private static createBatchedNotification(batch: BatchableNotification[]): BatchedNotification {
    const first = batch[0];
    const actors = batch.map(b => b.actorName);
    const uniqueActors = [...new Set(actors)];
    const count = batch.length;
    const latest = new Date(Math.max(...batch.map(b => b.timestamp.getTime())));

    const { title, message, icon } = this.getBatchedContent(first.type, uniqueActors, count, first.contextTitle);

    return {
      userId: first.userId,
      type: first.type,
      title,
      message,
      icon,
      priority: this.getBatchedPriority(first.type, count),
      category: 'social',
      entityType: first.entityType,
      entityId: first.entityId,
      entityUrl: this.getEntityUrl(first.entityType, first.entityId),
      data: {
        actors: uniqueActors,
        count,
        latest,
        contextTitle: first.contextTitle
      }
    };
  }

  /**
   * Generate batched notification content
   */
  private static getBatchedContent(
    type: NotificationType, 
    actors: string[], 
    count: number, 
    contextTitle: string
  ): { title: string; message: string; icon: string } {
    const actorCount = actors.length;
    const contextTitleShort = contextTitle.length > 40 
      ? contextTitle.substring(0, 40) + '...' 
      : contextTitle;

    switch (type) {
      case 'discussion_like':
        if (actorCount === 1) {
          return {
            title: `${actors[0]} liked your discussion`,
            message: `"${contextTitleShort}"`,
            icon: '👍'
          };
        } else if (actorCount === 2) {
          return {
            title: `${actors[0]} and ${actors[1]} liked your discussion`,
            message: `"${contextTitleShort}"`,
            icon: '👍'
          };
        } else {
          const others = actorCount - 2;
          return {
            title: `${actors[0]}, ${actors[1]} and ${others} others liked your discussion`,
            message: `"${contextTitleShort}"`,
            icon: '👍'
          };
        }

      case 'chart_like':
        if (actorCount === 1) {
          return {
            title: `${actors[0]} liked your chart`,
            message: `"${contextTitleShort}"`,
            icon: '⭐'
          };
        } else if (actorCount === 2) {
          return {
            title: `${actors[0]} and ${actors[1]} liked your chart`,
            message: `"${contextTitleShort}"`,
            icon: '⭐'
          };
        } else {
          const others = actorCount - 2;
          return {
            title: `${actors[0]}, ${actors[1]} and ${others} others liked your chart`,
            message: `"${contextTitleShort}"`,
            icon: '⭐'
          };
        }

      case 'discussion_reply':
        if (actorCount === 1) {
          return {
            title: `${count} new replies from ${actors[0]}`,
            message: `in "${contextTitleShort}"`,
            icon: '💬'
          };
        } else {
          return {
            title: `${count} new replies`,
            message: `from ${actorCount} people in "${contextTitleShort}"`,
            icon: '💬'
          };
        }

      default:
        return {
          title: `${count} new activities`,
          message: `from ${actorCount} people`,
          icon: '📧'
        };
    }
  }

  /**
   * Get priority based on batch size and type
   */
  private static getBatchedPriority(type: NotificationType, count: number): NotificationPriority {
    if (count >= 10) return 'high';
    if (count >= 5) return 'medium';
    return 'low';
  }

  /**
   * Get entity URL for navigation
   */
  private static getEntityUrl(entityType: EntityType, entityId: string): string {
    switch (entityType) {
      case 'discussion':
        return `/discussions/${entityId}`;
      case 'chart':
        return `/chart/${entityId}`;
      case 'user':
        return `/profile/${entityId}`;
      case 'event':
        return `/events/${entityId}`;
      case 'analytics':
      case 'system':
      default:
        return '/notifications';
    }
  }

  /**
   * Create immediate notification for non-batchable types
   */
  private static async createImmediateNotification(notification: BatchableNotification): Promise<void> {
    const { title, message, icon } = this.getImmediateContent(
      notification.type, 
      notification.actorName, 
      notification.contextTitle
    );

    await NotificationService.createNotification({
      userId: notification.userId,
      type: notification.type,
      title,
      message,
      icon,
      priority: this.getImmediatePriority(notification.type),
      category: 'social',
      entityType: notification.entityType,
      entityId: notification.entityId,
      entityUrl: this.getEntityUrl(notification.entityType, notification.entityId)
    });
  }

  /**
   * Generate immediate notification content
   */
  private static getImmediateContent(
    type: NotificationType, 
    actorName: string, 
    contextTitle: string
  ): { title: string; message: string; icon: string } {
    const contextTitleShort = contextTitle.length > 50 
      ? contextTitle.substring(0, 50) + '...' 
      : contextTitle;

    switch (type) {
      case 'discussion_mention':
        return {
          title: 'You were mentioned',
          message: `${actorName} mentioned you in "${contextTitleShort}"`,
          icon: '@'
        };

      case 'discussion_reply':
        return {
          title: 'New reply to your discussion',
          message: `${actorName} replied to "${contextTitleShort}"`,
          icon: '💬'
        };

      case 'system_announcement':
        return {
          title: 'System Announcement',
          message: contextTitle,
          icon: '📢'
        };

      default:
        return {
          title: 'New notification',
          message: `${actorName}: ${contextTitleShort}`,
          icon: '📧'
        };
    }
  }

  /**
   * Get priority for immediate notifications
   */
  private static getImmediatePriority(type: NotificationType): NotificationPriority {
    switch (type) {
      case 'discussion_mention':
      case 'admin_warning':
        return 'high';
      case 'discussion_reply':
      case 'system_announcement':
        return 'medium';
      default:
        return 'low';
    }
  }

  /**
   * Force process all pending batches (useful for testing or shutdown)
   */
  static async processAllPendingBatches(): Promise<void> {
    const batchKeys = Array.from(this.pendingBatches.keys());
    
    for (const batchKey of batchKeys) {
      await this.processBatch(batchKey);
    }
  }

  /**
   * Get batch statistics (for monitoring)
   */
  static getBatchStats(): {
    pendingBatches: number;
    totalPendingNotifications: number;
    activeBatchKeys: string[];
  } {
    const totalPendingNotifications = Array.from(this.pendingBatches.values())
      .reduce((sum, batch) => sum + batch.length, 0);

    return {
      pendingBatches: this.pendingBatches.size,
      totalPendingNotifications,
      activeBatchKeys: Array.from(this.pendingBatches.keys())
    };
  }
}

export default BatchNotificationManager;