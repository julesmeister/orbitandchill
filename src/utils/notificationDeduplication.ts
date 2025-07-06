/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationService } from '@/db/services/notificationService';
import { createHash } from 'crypto';

interface NotificationFingerprint {
  userId: string;
  type: string;
  entityId?: string;
  actorId?: string;
  timeWindow: number; // minutes
}

interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingNotificationId?: string;
  reason?: string;
}

/**
 * Notification deduplication system to prevent spam and duplicate notifications
 */
export class NotificationDeduplicator {
  private static instance: NotificationDeduplicator;
  private fingerprintCache = new Map<string, string>(); // fingerprint -> notificationId
  private recentChecks = new Map<string, Date>(); // Track recent checks
  
  // Default deduplication rules
  private readonly DEFAULT_RULES = {
    'discussion_like': { timeWindow: 60, allowMultiple: false }, // 1 hour
    'discussion_reply': { timeWindow: 30, allowMultiple: true }, // 30 min, but different actors allowed
    'discussion_mention': { timeWindow: 10, allowMultiple: false }, // 10 min
    'comment_like': { timeWindow: 60, allowMultiple: false },
    'comment_reply': { timeWindow: 30, allowMultiple: true },
    'welcome': { timeWindow: 1440, allowMultiple: false }, // 24 hours
    'system_announcement': { timeWindow: 120, allowMultiple: false }, // 2 hours
    'chart_like': { timeWindow: 60, allowMultiple: false },
    'follow': { timeWindow: 60, allowMultiple: false }
  };

  private constructor() {
    // Clean up cache every 10 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 10 * 60 * 1000);
  }

  static getInstance(): NotificationDeduplicator {
    if (!NotificationDeduplicator.instance) {
      NotificationDeduplicator.instance = new NotificationDeduplicator();
    }
    return NotificationDeduplicator.instance;
  }

  /**
   * Check if a notification would be a duplicate
   */
  async checkForDuplicate(
    userId: string,
    type: string,
    entityId?: string,
    actorId?: string,
    customTimeWindow?: number
  ): Promise<DuplicateCheckResult> {
    try {
      const rule = this.DEFAULT_RULES[type as keyof typeof this.DEFAULT_RULES];
      if (!rule) {
        // Unknown type, allow it
        return { isDuplicate: false };
      }

      const timeWindow = customTimeWindow || rule.timeWindow;
      
      // Generate fingerprint for this notification
      const fingerprint = this.generateFingerprint({
        userId,
        type,
        entityId,
        actorId: rule.allowMultiple ? actorId : undefined, // Include actor only if multiples allowed
        timeWindow
      });

      // Check cache first
      const cachedNotificationId = this.fingerprintCache.get(fingerprint);
      if (cachedNotificationId) {
        return {
          isDuplicate: true,
          existingNotificationId: cachedNotificationId,
          reason: 'Found in cache'
        };
      }

      // Check database for recent similar notifications
      const cutoffTime = new Date(Date.now() - (timeWindow * 60 * 1000));
      const existingNotifications = await this.findSimilarNotifications(
        userId,
        type,
        entityId,
        rule.allowMultiple ? actorId : undefined,
        cutoffTime
      );

      if (existingNotifications.length > 0) {
        const existingId = existingNotifications[0].id;
        
        // Cache this result
        this.fingerprintCache.set(fingerprint, existingId);
        
        return {
          isDuplicate: true,
          existingNotificationId: existingId,
          reason: `Similar notification found within ${timeWindow} minutes`
        };
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error('Error checking for duplicate notification:', error);
      // On error, allow the notification to prevent blocking
      return { isDuplicate: false };
    }
  }

  /**
   * Register a new notification in the deduplication system
   */
  async registerNotification(
    notificationId: string,
    userId: string,
    type: string,
    entityId?: string,
    actorId?: string
  ): Promise<void> {
    try {
      const rule = this.DEFAULT_RULES[type as keyof typeof this.DEFAULT_RULES];
      if (!rule) return;

      const fingerprint = this.generateFingerprint({
        userId,
        type,
        entityId,
        actorId: rule.allowMultiple ? actorId : undefined,
        timeWindow: rule.timeWindow
      });

      // Cache this notification
      this.fingerprintCache.set(fingerprint, notificationId);
    } catch (error) {
      console.error('Error registering notification for deduplication:', error);
    }
  }

  /**
   * Find similar notifications in the database
   */
  private async findSimilarNotifications(
    userId: string,
    type: string,
    entityId?: string,
    actorId?: string,
    cutoffTime: Date
  ): Promise<any[]> {
    try {
      // Build conditions for similarity check
      const conditions = [
        { column: 'userId', value: userId },
        { column: 'type', value: type },
        { column: 'createdAt', operator: '>=', value: cutoffTime.toISOString() }
      ];

      if (entityId) {
        conditions.push({ column: 'entityId', value: entityId });
      }

      if (actorId) {
        conditions.push({ column: 'actorId', value: actorId });
      }

      // Use NotificationService to find similar notifications
      const notifications = await NotificationService.getUserNotifications(userId, {
        isRead: undefined,
        limit: 10,
        offset: 0
      });

      // Filter notifications based on our conditions
      return notifications.filter(notification => {
        if (notification.type !== type) return false;
        if (new Date(notification.createdAt) < cutoffTime) return false;
        if (entityId && notification.entityId !== entityId) return false;
        if (actorId && notification.actorId !== actorId) return false;
        
        return true;
      });
    } catch (error) {
      console.error('Error finding similar notifications:', error);
      return [];
    }
  }

  /**
   * Generate a unique fingerprint for a notification
   */
  private generateFingerprint(data: NotificationFingerprint): string {
    const normalizedData = {
      userId: data.userId,
      type: data.type,
      entityId: data.entityId || '',
      actorId: data.actorId || '',
      timeWindow: data.timeWindow
    };

    const dataString = JSON.stringify(normalizedData);
    return createHash('md5').update(dataString).digest('hex');
  }

  /**
   * Clean up old entries from cache
   */
  private cleanupCache(): void {
    const cutoffTime = new Date(Date.now() - (2 * 60 * 60 * 1000)); // 2 hours ago
    const toRemove: string[] = [];

    for (const [fingerprint, timestamp] of this.recentChecks) {
      if (timestamp < cutoffTime) {
        toRemove.push(fingerprint);
      }
    }

    for (const fingerprint of toRemove) {
      this.recentChecks.delete(fingerprint);
      this.fingerprintCache.delete(fingerprint);
    }

    if (toRemove.length > 0) {
      console.log(`Cleaned up ${toRemove.length} old deduplication entries`);
    }
  }

  /**
   * Get deduplication statistics
   */
  getStats(): {
    cacheSize: number;
    recentChecks: number;
    rules: Record<string, any>;
  } {
    return {
      cacheSize: this.fingerprintCache.size,
      recentChecks: this.recentChecks.size,
      rules: this.DEFAULT_RULES
    };
  }

  /**
   * Clear all deduplication data (useful for testing)
   */
  clearCache(): void {
    this.fingerprintCache.clear();
    this.recentChecks.clear();
  }

  /**
   * Update deduplication rules for a notification type
   */
  updateRule(
    type: string,
    rule: { timeWindow: number; allowMultiple: boolean }
  ): void {
    (this.DEFAULT_RULES as any)[type] = rule;
  }
}

/**
 * Helper function to check for duplicates before creating a notification
 */
export async function createNotificationWithDeduplication(
  notificationData: {
    userId: string;
    type: string;
    entityId?: string;
    actorId?: string;
    [key: string]: any;
  },
  createFunction: () => Promise<any>
): Promise<{ success: boolean; notificationId?: string; isDuplicate?: boolean; reason?: string }> {
  const deduplicator = NotificationDeduplicator.getInstance();
  
  try {
    // Check for duplicates
    const duplicateCheck = await deduplicator.checkForDuplicate(
      notificationData.userId,
      notificationData.type,
      notificationData.entityId,
      notificationData.actorId
    );

    if (duplicateCheck.isDuplicate) {
      console.log(
        `Skipping duplicate notification: ${notificationData.type} for user ${notificationData.userId}`,
        duplicateCheck.reason
      );
      
      return {
        success: false,
        isDuplicate: true,
        reason: duplicateCheck.reason,
        notificationId: duplicateCheck.existingNotificationId
      };
    }

    // Create the notification
    const result = await createFunction();
    
    if (result && result.id) {
      // Register the new notification for future deduplication
      await deduplicator.registerNotification(
        result.id,
        notificationData.userId,
        notificationData.type,
        notificationData.entityId,
        notificationData.actorId
      );
      
      return {
        success: true,
        notificationId: result.id
      };
    } else {
      return {
        success: false,
        reason: 'Notification creation failed'
      };
    }
  } catch (error) {
    console.error('Error in createNotificationWithDeduplication:', error);
    return {
      success: false,
      reason: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export singleton instance
export const notificationDeduplicator = NotificationDeduplicator.getInstance();