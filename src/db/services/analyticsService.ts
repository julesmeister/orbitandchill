/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { getDb, getDbAsync, analyticsTraffic, analyticsEngagement } from '@/db/index';
import { eq, gte, lte, desc, sql, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

export interface TrafficDataInput {
  date: string; // YYYY-MM-DD
  visitors?: number;
  pageViews?: number;
  chartsGenerated?: number;
  newUsers?: number;
  returningUsers?: number;
  avgSessionDuration?: number;
  bounceRate?: number;
  topPages?: Array<{ page: string; views: number; percentage: number }>;
  trafficSources?: Record<string, number>;
}

export interface EngagementDataInput {
  date: string;
  discussionsCreated?: number;
  repliesPosted?: number;
  chartsGenerated?: number;
  activeUsers?: number;
  popularDiscussions?: Array<{ id: string; title: string; engagement: number }>;
  topContributors?: Array<{ userId: string; username: string; contributions: number }>;
}

export class AnalyticsService {
  // Traffic Analytics
  static async recordTrafficData(data: TrafficDataInput) {
    let db;
    try {
      db = await getDbAsync();
      if (!db) {
        
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Database initialization failed for analytics tracking:', error);
      return null;
    }
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const existing = await executeRawSelectOne(db, {
      table: 'analytics_traffic',
      conditions: [{ column: 'date', value: data.date }]
    });

    if (existing) {
      // Update existing record using raw SQL
      await executeRawUpdate(db, 'analytics_traffic', {
        visitors: data.visitors ?? existing.visitors,
        page_views: data.pageViews ?? existing.page_views,
        charts_generated: data.chartsGenerated ?? existing.charts_generated,
        new_users: data.newUsers ?? existing.new_users,
        returning_users: data.returningUsers ?? existing.returning_users,
        avg_session_duration: data.avgSessionDuration ?? existing.avg_session_duration,
        bounce_rate: data.bounceRate ?? existing.bounce_rate,
        top_pages: data.topPages ? JSON.stringify(data.topPages) : existing.top_pages,
        traffic_sources: data.trafficSources ? JSON.stringify(data.trafficSources) : existing.traffic_sources,
      }, [{ column: 'id', value: existing.id }]);
      
      return transformDatabaseRow(existing);
    } else {
      // Create new record
      return await db.insert(analyticsTraffic).values({
        id: nanoid(12),
        date: data.date,
        visitors: data.visitors ?? 0,
        pageViews: data.pageViews ?? 0,
        chartsGenerated: data.chartsGenerated ?? 0,
        newUsers: data.newUsers ?? 0,
        returningUsers: data.returningUsers ?? 0,
        avgSessionDuration: data.avgSessionDuration ?? 0,
        bounceRate: data.bounceRate ?? 0,
        topPages: data.topPages ? JSON.stringify(data.topPages) : null,
        trafficSources: data.trafficSources ? JSON.stringify(data.trafficSources) : null,
        createdAt: new Date(),
      }).returning();
    }
  }

  static async getTrafficData(startDate: string, endDate: string) {
    const db = getDb();
    if (!db) {
      
      return [];
    }
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const data = await executeRawSelect(db, {
      table: 'analytics_traffic',
      conditions: [
        { column: 'date', value: startDate, operator: '>=' },
        { column: 'date', value: endDate, operator: '<=' }
      ],
      orderBy: [{ column: 'date', direction: 'DESC' }]
    });

    return data.map((record: { topPages: string; trafficSources: string; }) => ({
      ...record,
      topPages: record.topPages ? JSON.parse(record.topPages) : [],
      trafficSources: record.trafficSources ? JSON.parse(record.trafficSources) : {},
    }));
  }

  static async getTrafficSummary(days: number = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const data = await this.getTrafficData(startDate, endDate);

    // Calculate totals and averages
    const totals = data.reduce((acc: { visitors: any; pageViews: any; chartsGenerated: any; newUsers: any; returningUsers: any; }, day: { visitors: any; pageViews: any; chartsGenerated: any; newUsers: any; returningUsers: any; }) => ({
      visitors: acc.visitors + day.visitors,
      pageViews: acc.pageViews + day.pageViews,
      chartsGenerated: acc.chartsGenerated + day.chartsGenerated,
      newUsers: acc.newUsers + day.newUsers,
      returningUsers: acc.returningUsers + day.returningUsers,
    }), { visitors: 0, pageViews: 0, chartsGenerated: 0, newUsers: 0, returningUsers: 0 });

    const averages = {
      visitors: Math.round(totals.visitors / days),
      pageViews: Math.round(totals.pageViews / days),
      chartsGenerated: Math.round(totals.chartsGenerated / days),
      newUsers: Math.round(totals.newUsers / days),
      returningUsers: Math.round(totals.returningUsers / days),
    };

    return { data, totals, averages };
  }

  // Engagement Analytics
  static async recordEngagementData(data: EngagementDataInput) {
    let db;
    try {
      db = await getDbAsync();
      if (!db) {
        
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Database initialization failed for engagement tracking:', error);
      return null;
    }
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const existing = await executeRawSelectOne(db, {
      table: 'analytics_engagement',
      conditions: [{ column: 'date', value: data.date }]
    });
    
    const existingArray = existing ? [existing] : [];

    if (existing) {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const transformedExisting = transformDatabaseRow(existing);
      await executeRawUpdate(db, 'analytics_engagement', {
        discussions_created: data.discussionsCreated ?? transformedExisting.discussionsCreated,
        replies_posted: data.repliesPosted ?? transformedExisting.repliesPosted,
        charts_generated: data.chartsGenerated ?? transformedExisting.chartsGenerated,
        active_users: data.activeUsers ?? transformedExisting.activeUsers,
        popular_discussions: data.popularDiscussions ? JSON.stringify(data.popularDiscussions) : transformedExisting.popularDiscussions,
        top_contributors: data.topContributors ? JSON.stringify(data.topContributors) : transformedExisting.topContributors,
      }, [{ column: 'id', value: transformedExisting.id }]);
      
      // Return the updated record
      return await executeRawSelectOne(db, {
        table: 'analytics_engagement',
        conditions: [{ column: 'id', value: transformedExisting.id }]
      });
    } else {
      return await db.insert(analyticsEngagement).values({
        id: nanoid(12),
        date: data.date,
        discussionsCreated: data.discussionsCreated ?? 0,
        repliesPosted: data.repliesPosted ?? 0,
        chartsGenerated: data.chartsGenerated ?? 0,
        activeUsers: data.activeUsers ?? 0,
        popularDiscussions: data.popularDiscussions ? JSON.stringify(data.popularDiscussions) : null,
        topContributors: data.topContributors ? JSON.stringify(data.topContributors) : null,
        createdAt: new Date(),
      }).returning();
    }
  }

  static async getEngagementData(startDate: string, endDate: string) {
    const db = getDb();
    if (!db) {
      
      return [];
    }
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const data = await executeRawSelect(db, {
      table: 'analytics_engagement',
      conditions: [
        { column: 'date', value: startDate, operator: '>=' },
        { column: 'date', value: endDate, operator: '<=' }
      ],
      orderBy: [{ column: 'date', direction: 'DESC' }]
    });

    return data.map((record: { popularDiscussions: string; topContributors: string; }) => ({
      ...record,
      popularDiscussions: record.popularDiscussions ? JSON.parse(record.popularDiscussions) : [],
      topContributors: record.topContributors ? JSON.parse(record.topContributors) : [],
    }));
  }

  // Helper method to track unique visitors per day
  static async trackUniqueVisitor(ipAddress: string, userAgent: string, date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Create a unique visitor identifier using IP + User Agent + Date
    const visitorHash = this.createVisitorHash(ipAddress, userAgent, targetDate);
    
    let db;
    try {
      db = await getDbAsync();
      if (!db) {
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Database initialization failed for unique visitor tracking:', error);
      return false;
    }
    
    try {
      // Check if this visitor has already been counted today
      const existingVisitor = await db.client.execute({
        sql: 'SELECT id FROM analytics_unique_visitors WHERE visitor_hash = ? AND date = ?',
        args: [visitorHash, targetDate]
      });
      
      if (existingVisitor.rows.length > 0) {
        // Visitor already counted today
        return false;
      }
      
      // Record this unique visitor
      await db.client.execute({
        sql: 'INSERT INTO analytics_unique_visitors (id, visitor_hash, ip_address, user_agent, date, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        args: [
          Math.random().toString(36).substring(2, 15), // Simple ID generation
          visitorHash,
          ipAddress,
          userAgent.substring(0, 500), // Limit user agent length
          targetDate,
          Math.floor(Date.now() / 1000) // Unix timestamp
        ]
      });
      
      // Increment the visitor counter
      await this.incrementDailyCounter('visitors', targetDate);
      return true;
      
    } catch (error) {
      // If table doesn't exist, fall back to old behavior
      if (error instanceof Error && error.message.includes('no such table')) {
        console.warn('Unique visitors table not found, falling back to session-based counting');
        await this.incrementDailyCounter('visitors', targetDate);
        return true;
      }
      
      console.warn('Error tracking unique visitor:', error);
      return false;
    }
  }
  
  // Helper method to create a consistent visitor hash
  private static createVisitorHash(ipAddress: string, userAgent: string, date: string): string {
    // Use a simple hash function to create a unique identifier
    const hashInput = `${ipAddress}_${userAgent}_${date}`;
    
    // Simple hash function (not cryptographically secure, but sufficient for analytics)
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  // Helper method to increment daily counters
  static async incrementDailyCounter(
    metric: 'visitors' | 'pageViews' | 'chartsGenerated' | 'newUsers' | 'returningUsers' | 'locationRequests' | 'locationPermissionsGranted' | 'locationPermissionsDenied' | 'locationFallbackUsed' | 'locationErrors',
    date?: string
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    let db;
    try {
      db = await getDbAsync();
      if (!db) {
        
        return;
      }
    } catch (error) {
      console.warn('⚠️ Database initialization failed for analytics counter:', error);
      return;
    }
    
    // First ensure a record exists for today
    await this.recordTrafficData({ date: targetDate });
    
    // Then increment the specific metric
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    // Convert camelCase to snake_case for database column names
    const columnMap: Record<string, string> = {
      'visitors': 'visitors',
      'pageViews': 'page_views',
      'chartsGenerated': 'charts_generated',
      'newUsers': 'new_users',
      'returningUsers': 'returning_users',
      'locationRequests': 'location_requests',
      'locationPermissionsGranted': 'location_permissions_granted',
      'locationPermissionsDenied': 'location_permissions_denied',
      'locationFallbackUsed': 'location_fallback_used',
      'locationErrors': 'location_errors'
    };
    
    const dbColumn = columnMap[metric] || metric;
    
    await db.client.execute({
      sql: `UPDATE analytics_traffic SET ${dbColumn} = ${dbColumn} + 1 WHERE date = ?`,
      args: [targetDate]
    });
  }

  static async incrementEngagementCounter(
    metric: 'discussionsCreated' | 'repliesPosted' | 'chartsGenerated' | 'activeUsers',
    date?: string
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    let db;
    try {
      db = await getDbAsync();
      if (!db) {
        
        return;
      }
    } catch (error) {
      console.warn('⚠️ Database initialization failed for engagement counter:', error);
      return;
    }
    
    await this.recordEngagementData({ date: targetDate });
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const metricMap: Record<string, string> = {
      discussionsCreated: 'discussions_created',
      repliesPosted: 'replies_posted', 
      chartsGenerated: 'charts_generated',
      activeUsers: 'active_users'
    };
    const dbColumn = metricMap[metric] || metric;
    
    await db.client.execute({
      sql: `UPDATE analytics_engagement SET ${dbColumn} = ${dbColumn} + 1 WHERE date = ?`,
      args: [targetDate]
    });
  }

  // Generate mock data for development
  static async generateMockData(days: number = 30) {
    const promises = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const trafficData: TrafficDataInput = {
        date,
        visitors: Math.floor(Math.random() * 1000) + 100,
        pageViews: Math.floor(Math.random() * 5000) + 500,
        chartsGenerated: Math.floor(Math.random() * 200) + 20,
        newUsers: Math.floor(Math.random() * 50) + 5,
        returningUsers: Math.floor(Math.random() * 100) + 10,
        avgSessionDuration: Math.floor(Math.random() * 300) + 60,
        bounceRate: Math.random() * 0.4 + 0.2,
        topPages: [
          { page: '/natal-chart', views: Math.floor(Math.random() * 1000) + 100, percentage: 30 },
          { page: '/discussions', views: Math.floor(Math.random() * 800) + 80, percentage: 25 },
          { page: '/', views: Math.floor(Math.random() * 600) + 60, percentage: 20 },
          { page: '/about', views: Math.floor(Math.random() * 400) + 40, percentage: 15 },
        ],
        trafficSources: {
          direct: Math.floor(Math.random() * 40) + 30,
          google: Math.floor(Math.random() * 30) + 20,
          social: Math.floor(Math.random() * 20) + 10,
          referral: Math.floor(Math.random() * 15) + 5,
        }
      };

      const engagementData: EngagementDataInput = {
        date,
        discussionsCreated: Math.floor(Math.random() * 10) + 1,
        repliesPosted: Math.floor(Math.random() * 50) + 5,
        chartsGenerated: Math.floor(Math.random() * 200) + 20,
        activeUsers: Math.floor(Math.random() * 100) + 20,
      };

      promises.push(this.recordTrafficData(trafficData));
      promises.push(this.recordEngagementData(engagementData));
    }

    await Promise.all(promises);
    console.log(`✅ Generated mock analytics data for ${days} days`);
  }
}