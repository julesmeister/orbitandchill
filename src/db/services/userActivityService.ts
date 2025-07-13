/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, userActivity } from '@/db/index';
import { eq, desc, and, count, sql } from 'drizzle-orm';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';
import { nanoid } from 'nanoid';

export type ActivityType = 
  | 'chart_generated' | 'chart_viewed' | 'chart_shared' | 'chart_deleted'
  | 'discussion_created' | 'discussion_viewed' | 'discussion_replied' | 'discussion_voted'
  | 'reply_created' | 'reply_voted' | 'reply_edited' | 'reply_deleted'
  | 'event_created' | 'event_bookmarked' | 'event_unbookmarked' | 'event_viewed'
  | 'user_registered' | 'user_login' | 'user_logout' | 'user_updated'
  | 'settings_changed' | 'premium_activated' | 'premium_feature_used'
  | 'page_view' | 'navigation' | 'search_performed' | 'export_data'
  | 'horary_question_submitted';

export type EntityType = 
  | 'chart' | 'discussion' | 'reply' | 'event' | 'user' | 'page' | 'search' | 'settings' | 'premium_feature' | 'horary';

export interface CreateUserActivityData {
  userId: string | null; // Allow null for anonymous users
  activityType: ActivityType;
  entityType?: EntityType;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
}

export interface UserActivityRecord {
  id: string;
  userId: string | null; // Allow null for anonymous users
  activityType: ActivityType;
  entityType?: EntityType;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
  createdAt: Date;
}

export interface ActivitySummary {
  totalActivities: number;
  chartActivities: number;
  discussionActivities: number;
  eventActivities: number;
  lastActivity?: Date;
  mostActiveDay?: string;
  activityByType: Record<ActivityType, number>;
}

export interface ActivityTimelineOptions {
  userId: string;
  limit?: number;
  offset?: number;
  activityTypes?: ActivityType[];
  entityTypes?: EntityType[];
  startDate?: Date;
  endDate?: Date;
  sessionId?: string;
}

export class UserActivityService {
  /**
   * Record a new user activity
   */
  static async recordActivity(data: CreateUserActivityData): Promise<UserActivityRecord | null> {
    if (!db) {
      
      // Return mock activity record for UI consistency
      return {
        id: `local_${Date.now()}`,
        userId: data.userId,
        activityType: data.activityType,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        metadata: data.metadata,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        pageUrl: data.pageUrl,
        referrer: data.referrer,
        createdAt: new Date()
      };
    }

    try {
      const id = nanoid(12);
      const now = new Date();

      // Validate userId exists if not null, or skip recording for invalid users
      if (data.userId && typeof data.userId === 'string' && data.userId !== 'anonymous') {
        // For valid user IDs, proceed normally
      } else if (data.userId === 'anonymous' || data.userId === null) {
        // For anonymous users, set userId to null
        data.userId = null;
      } else {
        // Skip recording for invalid user IDs
        console.log('⚠️ Skipping user activity recording for invalid userId:', data.userId);
        return null;
      }

      const activity = await db.insert(userActivity).values({
        id,
        userId: data.userId,
        activityType: data.activityType,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        pageUrl: data.pageUrl,
        referrer: data.referrer,
        createdAt: now,
      }).returning();

      if (activity.length === 0) return null;

      const activityData = activity[0];
      return {
        ...activityData,
        metadata: activityData.metadata ? JSON.parse(activityData.metadata) : undefined,
      };
    } catch (error) {
      // Handle foreign key constraint errors specifically
      if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
        console.log('⚠️ Foreign key constraint failed for user activity - likely anonymous user with invalid userId. Skipping record.');
        return null;
      }
      
      console.error('Error recording user activity:', error);
      return null;
    }
  }

  /**
   * Get user activity timeline with filtering and pagination
   */
  static async getUserActivityTimeline(options: ActivityTimelineOptions): Promise<UserActivityRecord[]> {
    if (!db) {
      
      return [];
    }

    try {
      const { userId, limit = 50, offset = 0, activityTypes, entityTypes, startDate, endDate, sessionId } = options;

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const rawConditions = [{ column: 'user_id', value: userId }];
      let customWhere = '';
      
      if (activityTypes && activityTypes.length > 0) {
        const typesList = activityTypes.map(t => `'${t}'`).join(', ');
        customWhere += ` AND activity_type IN (${typesList})`;
      }
      
      if (entityTypes && entityTypes.length > 0) {
        const entitiesList = entityTypes.map(e => `'${e}'`).join(', ');
        customWhere += ` AND entity_type IN (${entitiesList})`;
      }
      
      if (startDate) {
        customWhere += ` AND created_at >= '${startDate.toISOString()}'`;
      }
      
      if (endDate) {
        customWhere += ` AND created_at <= '${endDate.toISOString()}'`;
      }
      
      if (sessionId) {
        customWhere += ` AND session_id = '${sessionId}'`;
      }
      
      const activities = await executeRawSelect(db, {
        table: 'user_activity',
        conditions: rawConditions,
        orderBy: [{ column: 'created_at', direction: 'DESC' }],
        limit,
        offset
      });

      // @ts-ignore - Raw SQL utility return type mismatch
      return activities.map((activity: { metadata: string; }) => ({
        ...activity,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : undefined,
      }));
    } catch (error) {
      console.error('Error getting user activity timeline:', error);
      return [];
    }
  }

  /**
   * Get activity summary for a user
   */
  static async getUserActivitySummary(userId: string, days: number = 30): Promise<ActivitySummary> {
    if (!db) {
      
      return {
        totalActivities: 0,
        chartActivities: 0,
        discussionActivities: 0,
        eventActivities: 0,
        activityByType: {} as Record<ActivityType, number>
      };
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const activities = await executeRawSelect(db, {
        table: 'user_activity',
        conditions: [
          { column: 'user_id', value: userId },
          { column: 'created_at', value: startDate.toISOString(), operator: '>=' }
        ]
      });

      // Calculate totals
      const totalActivities = activities.length;
      const chartActivities = activities.filter((a: { entityType: string; }) => a.entityType === 'chart').length;
      const discussionActivities = activities.filter((a: { entityType: string; }) => a.entityType === 'discussion' || a.entityType === 'reply').length;
      const eventActivities = activities.filter((a: { entityType: string; }) => a.entityType === 'event').length;

      // Find last activity
      const lastActivity = activities.length > 0 ? 
        new Date(Math.max(...activities.map((a: { createdAt: string | number | Date; }) => new Date(a.createdAt).getTime()))) : 
        undefined;

      // Count activities by type
      const activityByType = activities.reduce((acc: { [x: string]: any; }, activity: { activityType: string; }) => {
        acc[activity.activityType as ActivityType] = (acc[activity.activityType as ActivityType] || 0) + 1;
        return acc;
      }, {} as Record<ActivityType, number>);

      // Find most active day
      const dayActivity = activities.reduce((acc: { [x: string]: any; }, activity: { createdAt: string | number | Date; }) => {
        const day = new Date(activity.createdAt).toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostActiveDay = (Object.entries(dayActivity) as [string, number][]).reduce<string>((max, [day, count]) => 
        count > (dayActivity[max] || 0) ? day : max, 
        Object.keys(dayActivity)[0] || ''
      );

      return {
        totalActivities,
        chartActivities,
        discussionActivities,
        eventActivities,
        lastActivity,
        mostActiveDay,
        activityByType,
      };
    } catch (error) {
      console.error('Error getting user activity summary:', error);
      return {
        totalActivities: 0,
        chartActivities: 0,
        discussionActivities: 0,
        eventActivities: 0,
        activityByType: {} as Record<ActivityType, number>,
      };
    }
  }

  /**
   * Get recent activities across all users (for admin)
   */
  static async getRecentActivities(limit: number = 100): Promise<UserActivityRecord[]> {
    if (!db) {
      
      return [];
    }

    try {
      const activities = await db.select()
        .from(userActivity)
        .orderBy(desc(userActivity.createdAt))
        .limit(limit);

      // @ts-ignore - Raw SQL utility return type mismatch
      return activities.map((activity: { metadata: string; }) => ({
        ...activity,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : undefined,
      }));
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  /**
   * Get activities by specific activity type
   */
  static async getActivitiesByType(activityType: ActivityType): Promise<UserActivityRecord[]> {
    if (!db) {
      
      return [];
    }

    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const activities = await executeRawSelect(db, {
        table: 'user_activity',
        conditions: [
          { column: 'activity_type', value: activityType }
        ],
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });

      return activities.map((activity: any) => ({
        ...transformDatabaseRow(activity),
        metadata: activity.metadata ? JSON.parse(activity.metadata) : undefined,
      }));
    } catch (error) {
      console.error(`Error getting activities by type '${activityType}':`, error);
      return [];
    }
  }

  /**
   * Get activity stats by date range
   */
  static async getActivityStatsByDateRange(startDate: Date, endDate: Date): Promise<Record<string, number>> {
    if (!db) {
      
      return {};
    }

    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const activities = await executeRawSelect(db, {
        table: 'user_activity',
        conditions: [
          { column: 'created_at', value: startDate.toISOString(), operator: '>=' },
          { column: 'created_at', value: endDate.toISOString(), operator: '<=' }
        ]
      });

      return activities.reduce((acc: { [x: string]: any; }, activity: { createdAt: string | number | Date; }) => {
        const date = new Date(activity.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Error getting activity stats by date range:', error);
      return {};
    }
  }

  /**
   * Delete old activities (cleanup)
   */
  static async cleanupOldActivities(daysToKeep: number = 365): Promise<number> {
    if (!db) {
      
      return 0;
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const deletedCount = await executeRawDelete(db, 'user_activity', [
        { column: 'created_at', value: cutoffDate.toISOString(), operator: '<=' }
      ]);
      return deletedCount;

      // Note: The exact count may not be available depending on the database implementation
      // This is a placeholder for the actual count
      return 0; // Would need to implement proper count logic
    } catch (error) {
      console.error('Error cleaning up old activities:', error);
      return 0;
    }
  }

  /**
   * Get user session activities
   */
  static async getSessionActivities(sessionId: string): Promise<UserActivityRecord[]> {
    if (!db) {
      
      return [];
    }

    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const activities = await executeRawSelect(db, {
        table: 'user_activity',
        conditions: [{ column: 'session_id', value: sessionId }],
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });

      // @ts-ignore - Raw SQL utility return type mismatch
      return activities.map((activity: { metadata: string; }) => ({
        ...activity,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : undefined,
      }));
    } catch (error) {
      console.error('Error getting session activities:', error);
      return [];
    }
  }

  /**
   * Convenience methods for common activity types
   */

  static async recordChartActivity(
    userId: string, 
    chartId: string, 
    activityType: 'chart_generated' | 'chart_viewed' | 'chart_shared' | 'chart_deleted',
    metadata: { chartType?: string; theme?: string; title?: string } = {},
    context: { ipAddress?: string; userAgent?: string; sessionId?: string } = {}
  ) {
    const descriptions = {
      chart_generated: 'Generated a new natal chart',
      chart_viewed: 'Viewed a natal chart', 
      chart_shared: 'Shared a natal chart',
      chart_deleted: 'Deleted a natal chart'
    };

    return this.recordActivity({
      userId,
      activityType,
      entityType: 'chart',
      entityId: chartId,
      description: descriptions[activityType],
      metadata,
      ...context
    });
  }

  static async recordDiscussionActivity(
    userId: string,
    discussionId: string,
    activityType: 'discussion_created' | 'discussion_viewed' | 'discussion_replied' | 'discussion_voted',
    metadata: { title?: string; category?: string; voteType?: 'up' | 'down' } = {},
    context: { ipAddress?: string; userAgent?: string; sessionId?: string } = {}
  ) {
    const descriptions = {
      discussion_created: 'Created a new discussion',
      discussion_viewed: 'Viewed a discussion',
      discussion_replied: 'Replied to a discussion', 
      discussion_voted: `${metadata.voteType === 'up' ? 'Upvoted' : 'Downvoted'} a discussion`
    };

    return this.recordActivity({
      userId,
      activityType,
      entityType: 'discussion',
      entityId: discussionId,
      description: descriptions[activityType],
      metadata,
      ...context
    });
  }

  static async recordEventActivity(
    userId: string,
    eventId: string,
    activityType: 'event_created' | 'event_bookmarked' | 'event_unbookmarked' | 'event_viewed',
    metadata: { title?: string; eventType?: string; date?: string } = {},
    context: { ipAddress?: string; userAgent?: string; sessionId?: string } = {}
  ) {
    const descriptions = {
      event_created: 'Created a new astrological event',
      event_bookmarked: 'Bookmarked an event',
      event_unbookmarked: 'Removed bookmark from event',
      event_viewed: 'Viewed an event'
    };

    return this.recordActivity({
      userId,
      activityType,
      entityType: 'event',
      entityId: eventId,
      description: descriptions[activityType],
      metadata,
      ...context
    });
  }

  static async recordUserActivity(
    userId: string,
    activityType: 'user_registered' | 'user_login' | 'user_logout' | 'user_updated',
    metadata: { authProvider?: string; changes?: string[] } = {},
    context: { ipAddress?: string; userAgent?: string; sessionId?: string } = {}
  ) {
    const descriptions = {
      user_registered: 'Registered a new account',
      user_login: 'Logged in',
      user_logout: 'Logged out',
      user_updated: 'Updated profile information'
    };

    return this.recordActivity({
      userId,
      activityType,
      entityType: 'user',
      entityId: userId,
      description: descriptions[activityType],
      metadata,
      ...context
    });
  }
}