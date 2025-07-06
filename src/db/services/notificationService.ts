/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb, notifications, notificationPreferences, notificationTemplates, users } from '@/db/index';
import { eq, desc, and, count, sql, asc, inArray, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow, prepareConditions } from '@/db/rawSqlUtils';
import { UserService } from './userService';

export type NotificationType = 
  | 'discussion_reply' | 'discussion_like' | 'discussion_mention'
  | 'chart_shared' | 'chart_comment' | 'chart_like'
  | 'event_reminder' | 'event_bookmark' | 'event_update'
  | 'system_announcement' | 'system_maintenance' | 'system_update' | 'system_health'
  | 'admin_message' | 'admin_warning' | 'moderation_required' | 'user_report'
  | 'premium_upgrade' | 'premium_expiry' | 'premium_renewal' | 'premium_trial'
  | 'welcome' | 'newsletter' | 'educational_content' | 'feature_tour'
  | 'analytics_success' | 'analytics_failure' | 'cron_success' | 'cron_failure' | 'traffic_spike'
  | 'data_aggregation' | 'account_security' | 'data_export' | 'follow_new' | 'profile_view'
  | 'rate_limit_warning';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationCategory = 'social' | 'system' | 'admin' | 'premium' | 'reminder' | 'achievement';
export type EntityType = 'discussion' | 'reply' | 'chart' | 'event' | 'user' | 'system' | 'analytics';
export type DeliveryMethod = 'in_app' | 'email' | 'push' | 'sms';

// Alias for backward compatibility
export type NotificationData = NotificationRecord;

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  entityType?: EntityType;
  entityId?: string;
  entityUrl?: string;
  deliveryMethod?: DeliveryMethod;
  scheduledFor?: Date;
  expiresAt?: Date;
  data?: Record<string, any>;
  tags?: string[];
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  entityType?: EntityType;
  entityId?: string;
  entityUrl?: string;
  isRead: boolean;
  readAt?: Date;
  isArchived: boolean;
  archivedAt?: Date;
  deliveryMethod: DeliveryMethod;
  deliveredAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  scheduledFor?: Date;
  expiresAt?: Date;
  data?: Record<string, any>;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationFilters {
  isRead?: boolean;
  isArchived?: boolean;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  type?: NotificationType;
  entityType?: EntityType;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  latest?: NotificationRecord;
}

export interface UserNotificationPreferences {
  id: string;
  userId: string;
  enableInApp: boolean;
  enableEmail: boolean;
  enablePush: boolean;
  enableSms: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursTimezone?: string;
  socialNotifications: { in_app: boolean; email: boolean; push: boolean; };
  systemNotifications: { in_app: boolean; email: boolean; push: boolean; };
  adminNotifications: { in_app: boolean; email: boolean; push: boolean; };
  premiumNotifications: { in_app: boolean; email: boolean; push: boolean; };
  reminderNotifications: { in_app: boolean; email: boolean; push: boolean; };
  achievementNotifications: { in_app: boolean; email: boolean; push: boolean; };
  dailyDigest: boolean;
  weeklyDigest: boolean;
  digestTime: string;
  digestDayOfWeek: number;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(data: CreateNotificationData): Promise<NotificationRecord | null> {
    const db = getDb();
    if (!db) {
      
      // Return mock notification for UI consistency
      return {
        id: `local_${Date.now()}`,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        icon: data.icon,
        priority: data.priority || 'medium',
        category: data.category || 'system',
        entityType: data.entityType,
        entityId: data.entityId,
        entityUrl: data.entityUrl,
        isRead: false,
        isArchived: false,
        deliveryMethod: data.deliveryMethod || 'in_app',
        emailSent: false,
        scheduledFor: data.scheduledFor,
        expiresAt: data.expiresAt,
        data: data.data,
        tags: data.tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    try {
      const id = nanoid(12);
      const now = new Date();

      const notification = await db.insert(notifications).values({
        id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        icon: data.icon,
        priority: data.priority || 'medium',
        category: data.category || 'system',
        entityType: data.entityType,
        entityId: data.entityId,
        entityUrl: data.entityUrl,
        deliveryMethod: data.deliveryMethod || 'in_app',
        scheduledFor: data.scheduledFor,
        expiresAt: data.expiresAt,
        data: data.data ? JSON.stringify(data.data) : null,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        createdAt: now,
        updatedAt: now,
      }).returning();

      if (notification.length === 0) return null;

      return this.transformNotification(notification[0]);
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  /**
   * Get notifications for a user with filtering and pagination
   */
  static async getNotifications(userId: string, filters: NotificationFilters = {}): Promise<NotificationRecord[]> {
    const db = getDb();
    if (!db) {
      
      return [];
    }

    try {
      const { 
        isRead, 
        isArchived, 
        category, 
        priority, 
        type, 
        entityType,
        startDate, 
        endDate, 
        tags,
        limit = 50, 
        offset = 0 
      } = filters;

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const conditions = [{ column: 'user_id', value: userId }];

      // Apply filters
      if (isRead !== undefined) {
        conditions.push({ column: 'is_read', value: isRead ? '1' : '0' });
      }
      
      if (isArchived !== undefined) {
        conditions.push({ column: 'is_archived', value: isArchived ? '1' : '0' });
      }
      
      if (category) {
        conditions.push({ column: 'category', value: category });
      }
      
      if (priority) {
        conditions.push({ column: 'priority', value: priority });
      }
      
      if (type) {
        conditions.push({ column: 'type', value: type });
      }
      
      if (entityType) {
        conditions.push({ column: 'entity_type', value: entityType });
      }
      
      if (startDate) {
        // @ts-ignore - Raw SQL utility interface mismatch
        conditions.push({ column: 'created_at', value: startDate.toISOString(), operator: '>=' });
      }
      
      if (endDate) {
        // @ts-ignore - Raw SQL utility interface mismatch
        conditions.push({ column: 'created_at', value: endDate.toISOString(), operator: '<=' });
      }

      const result = await executeRawSelect(db, {
        table: 'notifications',
        conditions,
        orderBy: [{ column: 'created_at', direction: 'DESC' }],
        limit,
        offset
      });

      // Handle tags filtering (post-process since it's complex JSON)
      let filteredResult = result;
      if (tags && tags.length > 0) {
        filteredResult = result.filter((row: any) => {
          if (!row.tags) return false;
          try {
            const notificationTags = JSON.parse(row.tags);
            return tags.some(tag => notificationTags.includes(tag));
          } catch {
            return false;
          }
        });
      }

      return filteredResult.map((row: any) => this.transformNotification(transformDatabaseRow(row)));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const db = getDb();
    if (!db) {
      
      return false;
    }

    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const rowsAffected = await executeRawUpdate(db, 'notifications', {
        is_read: 1,
        read_at: new Date(),
        updated_at: new Date()
      }, [
        { column: 'id', value: notificationId },
        { column: 'user_id', value: userId }
      ]);

      return rowsAffected > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const db = getDb();
    if (!db) {
      
      return 0;
    }

    try {
      const result = await db.update(notifications)
        .set({ 
          isRead: true, 
          readAt: new Date(),
          updatedAt: new Date() 
        })
        .where(and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        ));

      // Note: The exact count may not be available depending on the database implementation
      return 0; // Would need to implement proper count logic
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
  }

  /**
   * Archive notification
   */
  static async archiveNotification(notificationId: string, userId: string): Promise<boolean> {
    const db = getDb();
    if (!db) {
      
      return false;
    }

    try {
      await db.update(notifications)
        .set({ 
          isArchived: true, 
          archivedAt: new Date(),
          updatedAt: new Date() 
        })
        .where(and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        ));

      return true;
    } catch (error) {
      console.error('Error archiving notification:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const db = getDb();
    if (!db) {
      
      return false;
    }

    try {
      await db.delete(notifications)
        .where(and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        ));

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get notification summary for a user
   */
  static async getNotificationSummary(userId: string): Promise<NotificationSummary> {
    const db = getDb();
    if (!db) {
      
      return {
        total: 0,
        unread: 0,
        byCategory: {
          social: 0,
          system: 0,
          admin: 0,
          premium: 0,
          reminder: 0,
          achievement: 0
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0
        }
      };
    }

    try {
      // Get all active (non-archived) notifications
      const result = await db.select()
        .from(notifications)
        .where(and(
          eq(notifications.userId, userId),
          eq(notifications.isArchived, false)
        ));

      const total = result.length;
      const unread = result.filter((n: { isRead: any; }) => !n.isRead).length;

      // Count by category
      const byCategory = result.reduce((acc: { [x: string]: any; }, notification: { category: string; }) => {
        const category = notification.category as NotificationCategory;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<NotificationCategory, number>);

      // Count by priority
      const byPriority = result.reduce((acc: { [x: string]: any; }, notification: { priority: string; }) => {
        const priority = notification.priority as NotificationPriority;
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {} as Record<NotificationPriority, number>);

      // Get latest notification
      const latest = result.length > 0 ? 
        this.transformNotification(
          result.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        ) : 
        undefined;

      return {
        total,
        unread,
        byCategory: {
          social: byCategory.social || 0,
          system: byCategory.system || 0,
          admin: byCategory.admin || 0,
          premium: byCategory.premium || 0,
          reminder: byCategory.reminder || 0,
          achievement: byCategory.achievement || 0
        },
        byPriority: {
          low: byPriority.low || 0,
          medium: byPriority.medium || 0,
          high: byPriority.high || 0,
          urgent: byPriority.urgent || 0
        },
        latest
      };
    } catch (error) {
      console.error('Error getting notification summary:', error);
      return {
        total: 0,
        unread: 0,
        byCategory: {
          social: 0,
          system: 0,
          admin: 0,
          premium: 0,
          reminder: 0,
          achievement: 0
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0
        }
      };
    }
  }

  /**
   * Get user notification preferences
   */
  static async getUserPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    const db = getDb();
    if (!db) {
      
      return this.getDefaultPreferences(userId);
    }

    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const result = await executeRawSelect(db, {
        table: 'notification_preferences',
        conditions: [{ column: 'user_id', value: userId }],
        limit: 1
      });

      if (result.length === 0) {
        // Create default preferences for user
        return await this.createDefaultPreferences(userId);
      }

      return this.transformUserPreferences(result[0]);
    } catch (error) {
      console.error('Error getting user notification preferences:', error);
      return this.getDefaultPreferences(userId);
    }
  }

  /**
   * Update user notification preferences
   */
  static async updateUserPreferences(
    userId: string, 
    updates: Partial<UserNotificationPreferences>
  ): Promise<UserNotificationPreferences | null> {
    const db = getDb();
    if (!db) {
      
      return this.getDefaultPreferences(userId);
    }

    try {
      // Check if preferences exist
      const existing = await this.getUserPreferences(userId);
      
      if (!existing) {
        return await this.createDefaultPreferences(userId);
      }

      const updateData: any = {
        updatedAt: new Date()
      };

      // Map updates to database format
      if (updates.enableInApp !== undefined) updateData.enableInApp = updates.enableInApp;
      if (updates.enableEmail !== undefined) updateData.enableEmail = updates.enableEmail;
      if (updates.enablePush !== undefined) updateData.enablePush = updates.enablePush;
      if (updates.enableSms !== undefined) updateData.enableSms = updates.enableSms;
      if (updates.quietHoursEnabled !== undefined) updateData.quietHoursEnabled = updates.quietHoursEnabled;
      if (updates.quietHoursStart !== undefined) updateData.quietHoursStart = updates.quietHoursStart;
      if (updates.quietHoursEnd !== undefined) updateData.quietHoursEnd = updates.quietHoursEnd;
      if (updates.quietHoursTimezone !== undefined) updateData.quietHoursTimezone = updates.quietHoursTimezone;
      if (updates.socialNotifications !== undefined) updateData.socialNotifications = JSON.stringify(updates.socialNotifications);
      if (updates.systemNotifications !== undefined) updateData.systemNotifications = JSON.stringify(updates.systemNotifications);
      if (updates.adminNotifications !== undefined) updateData.adminNotifications = JSON.stringify(updates.adminNotifications);
      if (updates.premiumNotifications !== undefined) updateData.premiumNotifications = JSON.stringify(updates.premiumNotifications);
      if (updates.reminderNotifications !== undefined) updateData.reminderNotifications = JSON.stringify(updates.reminderNotifications);
      if (updates.achievementNotifications !== undefined) updateData.achievementNotifications = JSON.stringify(updates.achievementNotifications);
      if (updates.dailyDigest !== undefined) updateData.dailyDigest = updates.dailyDigest;
      if (updates.weeklyDigest !== undefined) updateData.weeklyDigest = updates.weeklyDigest;
      if (updates.digestTime !== undefined) updateData.digestTime = updates.digestTime;
      if (updates.digestDayOfWeek !== undefined) updateData.digestDayOfWeek = updates.digestDayOfWeek;

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawUpdate(db, 'notification_preferences', updateData, [
        { column: 'user_id', value: userId }
      ]);

      // Return updated preferences
      return await this.getUserPreferences(userId);
    } catch (error) {
      console.error('Error updating user notification preferences:', error);
      return null;
    }
  }

  /**
   * Clean up expired notifications
   */
  static async cleanupExpiredNotifications(): Promise<number> {
    const db = getDb();
    if (!db) {
      
      return 0;
    }

    try {
      const now = new Date();
      
      const result = await db.delete(notifications)
        .where(and(
          sql`${notifications.expiresAt} IS NOT NULL`,
          sql`${notifications.expiresAt} <= ${now}`
        ));

      return 0; // Would need to implement proper count logic
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      return 0;
    }
  }

  /**
   * Bulk create notifications for multiple users
   */
  static async createBulkNotifications(
    userIds: string[], 
    notificationData: Omit<CreateNotificationData, 'userId'>
  ): Promise<NotificationRecord[]> {
    const results: NotificationRecord[] = [];
    
    for (const userId of userIds) {
      const notification = await this.createNotification({
        ...notificationData,
        userId
      });
      
      if (notification) {
        results.push(notification);
      }
    }
    
    return results;
  }

  /**
   * Helper: Transform database notification to API format
   */
  private static transformNotification(dbNotification: any): NotificationRecord {
    return {
      id: dbNotification.id,
      userId: dbNotification.userId,
      type: dbNotification.type,
      title: dbNotification.title,
      message: dbNotification.message,
      icon: dbNotification.icon,
      priority: dbNotification.priority,
      category: dbNotification.category,
      entityType: dbNotification.entityType,
      entityId: dbNotification.entityId,
      entityUrl: dbNotification.entityUrl,
      isRead: dbNotification.isRead,
      readAt: dbNotification.readAt ? new Date(dbNotification.readAt) : undefined,
      isArchived: dbNotification.isArchived,
      archivedAt: dbNotification.archivedAt ? new Date(dbNotification.archivedAt) : undefined,
      deliveryMethod: dbNotification.deliveryMethod,
      deliveredAt: dbNotification.deliveredAt ? new Date(dbNotification.deliveredAt) : undefined,
      emailSent: dbNotification.emailSent,
      emailSentAt: dbNotification.emailSentAt ? new Date(dbNotification.emailSentAt) : undefined,
      scheduledFor: dbNotification.scheduledFor ? new Date(dbNotification.scheduledFor) : undefined,
      expiresAt: dbNotification.expiresAt ? new Date(dbNotification.expiresAt) : undefined,
      data: dbNotification.data ? JSON.parse(dbNotification.data) : undefined,
      tags: dbNotification.tags ? JSON.parse(dbNotification.tags) : undefined,
      createdAt: new Date(dbNotification.createdAt),
      updatedAt: new Date(dbNotification.updatedAt)
    };
  }

  /**
   * Helper: Safely parse JSON with fallback
   */
  private static safeJsonParse(jsonString: string | null | undefined, defaultValue: any): any {
    if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
      return defaultValue;
    }
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return defaultValue;
    }
  }

  /**
   * Helper: Transform database preferences to API format
   */
  private static transformUserPreferences(dbPrefs: any): UserNotificationPreferences {
    return {
      id: dbPrefs.id,
      userId: dbPrefs.userId,
      enableInApp: dbPrefs.enableInApp,
      enableEmail: dbPrefs.enableEmail,
      enablePush: dbPrefs.enablePush,
      enableSms: dbPrefs.enableSms,
      quietHoursEnabled: dbPrefs.quietHoursEnabled,
      quietHoursStart: dbPrefs.quietHoursStart,
      quietHoursEnd: dbPrefs.quietHoursEnd,
      quietHoursTimezone: dbPrefs.quietHoursTimezone,
      socialNotifications: this.safeJsonParse(dbPrefs.socialNotifications, { in_app: true, email: true, push: false }),
      systemNotifications: this.safeJsonParse(dbPrefs.systemNotifications, { in_app: true, email: false, push: false }),
      adminNotifications: this.safeJsonParse(dbPrefs.adminNotifications, { in_app: true, email: true, push: true }),
      premiumNotifications: this.safeJsonParse(dbPrefs.premiumNotifications, { in_app: true, email: true, push: false }),
      reminderNotifications: this.safeJsonParse(dbPrefs.reminderNotifications, { in_app: true, email: false, push: true }),
      achievementNotifications: this.safeJsonParse(dbPrefs.achievementNotifications, { in_app: true, email: false, push: false }),
      dailyDigest: dbPrefs.dailyDigest,
      weeklyDigest: dbPrefs.weeklyDigest,
      digestTime: dbPrefs.digestTime,
      digestDayOfWeek: dbPrefs.digestDayOfWeek,
      createdAt: new Date(dbPrefs.createdAt),
      updatedAt: new Date(dbPrefs.updatedAt)
    };
  }

  /**
   * Helper: Get default preferences for a user
   */
  private static getDefaultPreferences(userId: string): UserNotificationPreferences {
    return {
      id: `default_${userId}`,
      userId,
      enableInApp: true,
      enableEmail: true,
      enablePush: false,
      enableSms: false,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      quietHoursTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      socialNotifications: { in_app: true, email: true, push: false },
      systemNotifications: { in_app: true, email: false, push: false },
      adminNotifications: { in_app: true, email: true, push: true },
      premiumNotifications: { in_app: true, email: true, push: false },
      reminderNotifications: { in_app: true, email: false, push: true },
      achievementNotifications: { in_app: true, email: false, push: false },
      dailyDigest: false,
      weeklyDigest: true,
      digestTime: '09:00',
      digestDayOfWeek: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Helper: Create default preferences for a user
   */
  private static async createDefaultPreferences(userId: string): Promise<UserNotificationPreferences> {
    const db = getDb();
    if (!db) {
      return this.getDefaultPreferences(userId);
    }

    try {
      const id = nanoid(12);
      const now = new Date();
      const defaults = this.getDefaultPreferences(userId);

      const created = await db.insert(notificationPreferences).values({
        id,
        userId,
        enableInApp: defaults.enableInApp,
        enableEmail: defaults.enableEmail,
        enablePush: defaults.enablePush,
        enableSms: defaults.enableSms,
        quietHoursEnabled: defaults.quietHoursEnabled,
        quietHoursStart: defaults.quietHoursStart,
        quietHoursEnd: defaults.quietHoursEnd,
        quietHoursTimezone: defaults.quietHoursTimezone,
        socialNotifications: JSON.stringify(defaults.socialNotifications),
        systemNotifications: JSON.stringify(defaults.systemNotifications),
        adminNotifications: JSON.stringify(defaults.adminNotifications),
        premiumNotifications: JSON.stringify(defaults.premiumNotifications),
        reminderNotifications: JSON.stringify(defaults.reminderNotifications),
        achievementNotifications: JSON.stringify(defaults.achievementNotifications),
        dailyDigest: defaults.dailyDigest,
        weeklyDigest: defaults.weeklyDigest,
        digestTime: defaults.digestTime,
        digestDayOfWeek: defaults.digestDayOfWeek,
        createdAt: now,
        updatedAt: now
      }).returning();

      if (created.length > 0) {
        return this.transformUserPreferences(created[0]);
      }

      return defaults;
    } catch (error: any) {
      // Check if this is a foreign key constraint error
      if (error?.code === 'SQLITE_CONSTRAINT' && error?.message?.includes('FOREIGN KEY constraint failed')) {
        console.warn(`⚠️ User ${userId} doesn't exist in database, attempting to create user first`);
        
        try {
          // Try to create a basic user record
          // For Google users, we need to create them with the exact Google ID
          await db.insert(users).values({
            id: userId,
            username: userId.startsWith('anon_') ? 'Anonymous' : 'User',
            authProvider: userId.startsWith('anon_') ? 'anonymous' : 'google',
            createdAt: new Date(),
            updatedAt: new Date(),
            stelliumSigns: JSON.stringify([]),
            stelliumHouses: JSON.stringify([]),
            hasNatalChart: false,
            showZodiacPublicly: false,
            showStelliumsPublicly: false,
            showBirthInfoPublicly: false,
            allowDirectMessages: true,
            showOnlineStatus: true,
          }).returning();
          
          console.log(`✅ Created user ${userId}, retrying notification preferences creation`);
          
          // Retry creating the notification preferences
          const defaultPrefs = this.getDefaultPreferences(userId);
          const retryNow = new Date();
          const retryCreated = await db.insert(notificationPreferences).values({
            id: nanoid(12),
            userId,
            enableInApp: defaultPrefs.enableInApp,
            enableEmail: defaultPrefs.enableEmail,
            enablePush: defaultPrefs.enablePush,
            enableSms: defaultPrefs.enableSms,
            quietHoursEnabled: defaultPrefs.quietHoursEnabled,
            quietHoursStart: defaultPrefs.quietHoursStart,
            quietHoursEnd: defaultPrefs.quietHoursEnd,
            quietHoursTimezone: defaultPrefs.quietHoursTimezone,
            socialNotifications: JSON.stringify(defaultPrefs.socialNotifications),
            systemNotifications: JSON.stringify(defaultPrefs.systemNotifications),
            adminNotifications: JSON.stringify(defaultPrefs.adminNotifications),
            premiumNotifications: JSON.stringify(defaultPrefs.premiumNotifications),
            reminderNotifications: JSON.stringify(defaultPrefs.reminderNotifications),
            achievementNotifications: JSON.stringify(defaultPrefs.achievementNotifications),
            dailyDigest: defaultPrefs.dailyDigest,
            weeklyDigest: defaultPrefs.weeklyDigest,
            digestTime: defaultPrefs.digestTime,
            digestDayOfWeek: defaultPrefs.digestDayOfWeek,
            createdAt: retryNow,
            updatedAt: retryNow
          }).returning();
          
          if (retryCreated.length > 0) {
            return this.transformUserPreferences(retryCreated[0]);
          }
        } catch (retryError) {
          console.error('Failed to create user and retry notification preferences:', retryError);
        }
      }
      
      console.error('Error creating default notification preferences:', error);
      return this.getDefaultPreferences(userId);
    }
  }

  /**
   * Unarchive notification (restore from archive)
   */
  static async unarchiveNotification(notificationId: string, userId: string): Promise<boolean> {
    const db = getDb();
    if (!db) {
      return false;
    }

    try {
      await db.update(notifications)
        .set({ 
          isArchived: false, 
          archivedAt: null,
          updatedAt: new Date() 
        })
        .where(and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        ));

      return true;
    } catch (error) {
      console.error('Error unarchiving notification:', error);
      return false;
    }
  }

  /**
   * Get archive statistics for a user
   */
  static async getArchiveStats(userId: string): Promise<any> {
    const db = getDb();
    if (!db) {
      return {
        total: 0,
        byCategory: {},
        byPriority: {},
        oldestDate: null,
        newestDate: null
      };
    }

    try {
      // Get all archived notifications
      const archivedNotifications = await db.select()
        .from(notifications)
        .where(and(
          eq(notifications.userId, userId),
          eq(notifications.isArchived, true)
        ))
        .orderBy(desc(notifications.archivedAt));

      const total = archivedNotifications.length;

      if (total === 0) {
        return {
          total: 0,
          byCategory: {},
          byPriority: {},
          oldestDate: null,
          newestDate: null
        };
      }

      // Count by category
      const byCategory = archivedNotifications.reduce((acc: any, notification: any) => {
        const category = notification.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Count by priority
      const byPriority = archivedNotifications.reduce((acc: any, notification: any) => {
        const priority = notification.priority;
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      const oldestDate = archivedNotifications[archivedNotifications.length - 1]?.archivedAt;
      const newestDate = archivedNotifications[0]?.archivedAt;

      return {
        total,
        byCategory,
        byPriority,
        oldestDate,
        newestDate
      };
    } catch (error) {
      console.error('Error getting archive stats:', error);
      return {
        total: 0,
        byCategory: {},
        byPriority: {},
        oldestDate: null,
        newestDate: null
      };
    }
  }

  /**
   * Delete archived notifications older than a specific date
   */
  static async deleteArchivedNotifications(userId: string, cutoffDate: Date): Promise<number> {
    const db = getDb();
    if (!db) {
      return 0;
    }

    try {
      const result = await db.delete(notifications)
        .where(and(
          eq(notifications.userId, userId),
          eq(notifications.isArchived, true),
          sql`${notifications.archivedAt} < ${cutoffDate.toISOString()}`
        ));

      return result.rowsAffected || 0;
    } catch (error) {
      console.error('Error deleting archived notifications:', error);
      return 0;
    }
  }

  /**
   * Get a single notification by ID
   */
  static async getNotificationById(notificationId: string): Promise<NotificationRecord | null> {
    const db = getDb();
    if (!db) {
      return null;
    }

    try {
      const result = await executeRawSelect(db, {
        table: 'notifications',
        conditions: [{ column: 'id', value: notificationId }],
        limit: 1
      });

      if (result.length === 0) return null;
      
      return this.transformNotification(transformDatabaseRow(result[0]));
    } catch (error) {
      console.error('Error getting notification by ID:', error);
      return null;
    }
  }

  /**
   * Update a notification with partial data
   */
  static async updateNotification(
    notificationId: string, 
    updates: Partial<Pick<NotificationRecord, 'title' | 'message' | 'isRead' | 'readAt' | 'isArchived' | 'archivedAt' | 'deliveredAt' | 'emailSent' | 'emailSentAt' | 'data' | 'tags'>> & { metadata?: string }
  ): Promise<boolean> {
    const db = getDb();
    if (!db) {
      return false;
    }

    try {
      const updateData: any = {
        updatedAt: new Date()
      };

      // Map updates to database format
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.isRead !== undefined) updateData.isRead = updates.isRead;
      if (updates.readAt !== undefined) updateData.readAt = updates.readAt;
      if (updates.isArchived !== undefined) updateData.isArchived = updates.isArchived;
      if (updates.archivedAt !== undefined) updateData.archivedAt = updates.archivedAt;
      if (updates.deliveredAt !== undefined) updateData.deliveredAt = updates.deliveredAt;
      if (updates.emailSent !== undefined) updateData.emailSent = updates.emailSent;
      if (updates.emailSentAt !== undefined) updateData.emailSentAt = updates.emailSentAt;
      if (updates.data !== undefined) updateData.data = JSON.stringify(updates.data);
      if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

      const rowsAffected = await executeRawUpdate(db, 'notifications', updateData, [
        { column: 'id', value: notificationId }
      ]);

      return rowsAffected > 0;
    } catch (error) {
      console.error('Error updating notification:', error);
      return false;
    }
  }
}