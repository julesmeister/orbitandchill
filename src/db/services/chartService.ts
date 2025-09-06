/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, desc, and, sql } from 'drizzle-orm';
import { db, initializeDatabase } from '@/db/index';
import { natalCharts } from '@/db/schema';
import { generateId } from '@/utils/idGenerator';
import { createResilientService } from '@/db/resilience';
// Raw SQL utilities no longer needed - all methods now use Drizzle ORM consistently

export interface ChartData {
  id: string;
  userId: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  latitude: number;
  longitude: number;
  chartType: 'natal' | 'transit' | 'synastry' | 'composite';
  title?: string;
  description?: string;
  theme?: string;
  isPublic?: boolean;
  shareToken?: string;
  chartData: string; // SVG content
  metadata: any; // Chart calculations, positions, etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChartRequest {
  userId: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  latitude: number;
  longitude: number;
  chartType?: 'natal' | 'transit' | 'synastry' | 'composite';
  title?: string;
  description?: string;
  theme?: string;
  isPublic?: boolean;
  chartData: string; // SVG content
  metadata: any; // Chart calculations, positions, etc.
}

// Create resilient service instance
const resilient = createResilientService('ChartService');

export class ChartService {
  /**
   * Create a new natal chart
   */
  static async createChart(data: CreateChartRequest): Promise<ChartData | null> {
    const chartId = generateId();
    const shareToken = data.isPublic ? generateId() : undefined;
    
    // Validate chart data before attempting to save
    if (!data.chartData || data.chartData.length === 0) {
      console.error('ChartService.createChart: Cannot save chart with empty chartData');
      throw new Error('Chart data is required and cannot be empty');
    }
    
    const newChart = {
      id: chartId,
      userId: data.userId,
      subjectName: data.subjectName,
      dateOfBirth: data.dateOfBirth,
      timeOfBirth: data.timeOfBirth,
      locationOfBirth: data.locationOfBirth,
      latitude: data.latitude,
      longitude: data.longitude,
      chartType: data.chartType || 'natal',
      title: data.title,
      description: data.description,
      theme: data.theme || 'default',
      isPublic: data.isPublic || false,
      shareToken,
      chartData: data.chartData,
      metadata: JSON.stringify(data.metadata),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    
    // Direct database access for chart creation
    try {
      const insertResult = await db.insert(natalCharts).values(newChart).returning();
      
      // Verify the chart was actually saved
      const [savedChart] = await db
        .select()
        .from(natalCharts)
        .where(eq(natalCharts.id, chartId))
        .limit(1);
      
      if (!savedChart) {
        console.error('Chart was not saved to database');
        throw new Error('Chart was not saved to database');
      }
      
      
      return {
        ...newChart,
        metadata: data.metadata, // Return original object, not stringified
      };
    } catch (error) {
      console.error('ChartService.createChart: Database operation failed:', error);
      
      // If database is truly unavailable, return null
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message.includes('Database not available') || message.includes('Connection failed')) {
          // Database unavailable, return null
          return null;
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Get a chart by ID
   */
  static async getChartById(id: string, userId?: string): Promise<ChartData | null> {
    // Bypass resilience wrapper - direct database access
    try {
      // Use consistent database approach
      const whereConditions = userId 
        ? and(eq(natalCharts.id, id), eq(natalCharts.userId, userId))
        : eq(natalCharts.id, id);
      
      const [chart] = await db
        .select()
        .from(natalCharts)
        .where(whereConditions)
        .limit(1);
      
      if (!chart) return null;

      return {
        ...chart,
        metadata: JSON.parse(chart.metadata),
        // Timestamps are already Date objects from Drizzle
        createdAt: chart.createdAt,
        updatedAt: chart.updatedAt,
      };
    } catch (error) {
      console.error('ChartService.getChartById: Database operation failed:', error);
      
      // If database is truly unavailable, return null
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message.includes('Database not available') || message.includes('Connection failed')) {
          // Database unavailable, return null
          return null;
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Get a chart by share token (for public sharing)
   */
  static async getChartByShareToken(shareToken: string): Promise<ChartData | null> {
    // Bypass resilience wrapper - direct database access
    try {
      // Ensure database is initialized
      if (!db) {
        await initializeDatabase();
      }
      
      if (!db) {
        throw new Error('Database connection is not available');
      }
      
      // Use consistent database approach
      const [chart] = await db
        .select()
        .from(natalCharts)
        .where(
          and(
            eq(natalCharts.shareToken, shareToken),
            eq(natalCharts.isPublic, true)
          )
        )
        .limit(1);
      
      if (!chart) return null;

      return {
        ...chart,
        metadata: JSON.parse(chart.metadata),
        // Timestamps are already Date objects from Drizzle
        createdAt: chart.createdAt,
        updatedAt: chart.updatedAt,
      };
    } catch (error) {
      console.error('ChartService.getChartByShareToken: Database operation failed:', error);
      
      // If database is truly unavailable, return null
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message.includes('Database not available') || message.includes('Connection failed')) {
          // Database unavailable, return null
          return null;
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Get all charts for a user
   */
  static async getUserCharts(userId: string): Promise<ChartData[]> {
    const startTime = Date.now();
    console.log('🔍 ChartService.getUserCharts: Starting at', new Date().toISOString(), 'for userId:', userId);
    
    // Bypass resilience wrapper - direct database access with timeout protection
    try {
      console.log('🔍 ChartService.getUserCharts: Checking database connection...');
      
      // Check if db is available
      if (!db) {
        console.error('🔍 ChartService.getUserCharts: Database connection is null');
        await initializeDatabase();
        if (!db) {
          throw new Error('Database connection could not be established');
        }
      }
      console.log('🔍 ChartService.getUserCharts: Database connection confirmed after', Date.now() - startTime, 'ms');
      
      console.log('🔍 ChartService.getUserCharts: Executing optimized database query (no timeout)...');
      const queryStartTime = Date.now();
      
      // CRITICAL FIX: Let the query complete naturally without artificial timeout
      const charts = await db.select()
        .from(natalCharts)
        .where(eq(natalCharts.userId, userId)) // Use eq() instead of sql template for better performance
        .orderBy(desc(natalCharts.createdAt))
        .limit(50); // Limit results to prevent excessive data loading

      const queryDuration = Date.now() - queryStartTime;
      console.log('🔍 ChartService.getUserCharts: Database query completed in', queryDuration, 'ms');
      console.log('🔍 ChartService.getUserCharts: Database returned', charts.length, 'charts:', charts.map((c: any) => ({ 
        id: c.id, 
        userId: c.userId, 
        subjectName: c.subjectName, 
        dateOfBirth: c.dateOfBirth 
      })));

      console.log('🔍 ChartService.getUserCharts: Validating chart ownership...');
      // CRITICAL FIX: Verify that all returned charts actually belong to the requested user
      const invalidCharts = charts.filter((chart: any) => chart.userId !== userId);
      if (invalidCharts.length > 0) {
        console.error('🔍 ChartService.getUserCharts: WARNING - Database query returned charts that do not belong to the requested user!');
        console.error('🔍 ChartService.getUserCharts: Requested userId:', userId);
        console.error('🔍 ChartService.getUserCharts: Invalid charts found:', invalidCharts.map((c: any) => ({ id: c.id, userId: c.userId, subjectName: c.subjectName })));
      }

      console.log('🔍 ChartService.getUserCharts: Deduplicating charts...');
      // Filter and deduplicate in one efficient pass
      const seen = new Set();
      const deduplicatedCharts = charts
        .filter((chart: any) => chart.userId === userId) // Only user's charts
        .filter((chart: any) => {
          // More aggressive fingerprint - just date + time + location (ignore subject name variations)
          const fingerprint = `${chart.dateOfBirth}_${chart.timeOfBirth || 'no-time'}_${chart.latitude || 0}_${chart.longitude || 0}`;
          if (seen.has(fingerprint)) return false;
          seen.add(fingerprint);
          return true;
        });
      
      console.log('🔍 ChartService.getUserCharts: Deduplication complete');
      // Log deduplication results  
      const userChartsCount = charts.filter((chart: any) => chart.userId === userId).length;
      if (userChartsCount > deduplicatedCharts.length) {
        console.log(`🔍 ChartService.getUserCharts: Deduplicated ${userChartsCount - deduplicatedCharts.length} duplicate charts for user ${userId}`);
      }

      console.log('🔍 ChartService.getUserCharts: Transforming chart data...');
      const transformedCharts = deduplicatedCharts.map((chart: any) => ({
        ...chart,
        metadata: JSON.parse(chart.metadata),
        // Timestamps are already Date objects from Drizzle
        createdAt: chart.createdAt,
        updatedAt: chart.updatedAt,
      }));
      
      const totalDuration = Date.now() - startTime;
      console.log('🔍 ChartService.getUserCharts: Completed successfully in', totalDuration, 'ms, returning', transformedCharts.length, 'charts');
      return transformedCharts;
    } catch (error: any) {
      const totalDuration = Date.now() - startTime;
      console.error('🔍 ChartService.getUserCharts: Error after', totalDuration, 'ms:', error);
      console.error('🔍 ChartService.getUserCharts: Error message:', error?.message);
      console.error('🔍 ChartService.getUserCharts: Error stack:', error?.stack);
      
      // Enhanced error detection for localhost development
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message.includes('Database not available') || 
            message.includes('Connection failed') || 
            message.includes('ECONNREFUSED') ||
            message.includes('SERVER_ERROR') ||
            message.includes('502') ||
            message.includes('Service Unavailable') ||
            message.includes('Connection acquisition timeout') ||
            message.includes('Pool') ||
            message.includes('queue') ||
            message.includes('Request cleared due to queue overflow')) {
          console.log('🔍 ChartService.getUserCharts: Database/connection pool issue, returning empty array to prevent hanging');
          // Database or connection pool issue, return empty array to prevent hanging
          return [];
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Update a chart
   */
  static async updateChart(id: string, userId: string, updates: Partial<CreateChartRequest>): Promise<ChartData | null> {
    return resilient.item(db, 'updateChart', async () => {
      const updateData: any = {
        ...updates,
        updatedAt: new Date(),
      };

      // Handle metadata serialization
      if (updates.metadata) {
        updateData.metadata = JSON.stringify(updates.metadata);
      }

      // Use consistent database approach
      await db
        .update(natalCharts)
        .set(updateData)
        .where(
          and(
            eq(natalCharts.id, id),
            eq(natalCharts.userId, userId)
          )
        );

      return await this.getChartById(id, userId);
    });
  }

  /**
   * Delete a chart
   */
  static async deleteChart(id: string, userId: string): Promise<boolean> {
    return resilient.boolean(db, 'deleteChart', async () => {
      // Use consistent database approach
      await db
        .delete(natalCharts)
        .where(
          and(
            eq(natalCharts.id, id),
            eq(natalCharts.userId, userId)
          )
        );

      return true;
    });
  }

  /**
   * Check if a chart exists with the same birth data (for deduplication)
   */
  static async findExistingChart(
    userId: string, 
    dateOfBirth: string, 
    timeOfBirth: string, 
    latitude: number, 
    longitude: number
  ): Promise<ChartData | null> {
    return resilient.item(db, 'findExistingChart', async () => {
      const [chart] = await db
        .select()
        .from(natalCharts)
        .where(
          and(
            eq(natalCharts.userId, userId),
            eq(natalCharts.dateOfBirth, dateOfBirth),
            eq(natalCharts.timeOfBirth, timeOfBirth),
            eq(natalCharts.latitude, latitude),
            eq(natalCharts.longitude, longitude),
            eq(natalCharts.chartType, 'natal')
          )
        )
        .orderBy(desc(natalCharts.createdAt));

      if (!chart) return null;

      return {
        ...chart,
        metadata: JSON.parse(chart.metadata),
        // Timestamps are already Date objects from Drizzle
        createdAt: chart.createdAt,
        updatedAt: chart.updatedAt,
      };
    });
  }

  /**
   * Generate a new share token for a chart
   */
  static async generateShareToken(id: string, userId: string): Promise<string | null> {
    // Bypass resilience wrapper - direct database access
    try {
      // First get the existing chart to check if it already has a token
      const chart = await this.getChartById(id, userId);
      
      if (!chart) {
        throw new Error('Chart not found');
      }

      // If chart already has a share token, return it
      if (chart.shareToken && chart.isPublic) {
        return chart.shareToken;
      }

      // Generate new share token
      const shareToken = generateId();
      
      // Use consistent database approach
      // Use a simpler approach for the UPDATE query to avoid WHERE clause parsing issues
      await db
        .update(natalCharts)
        .set({
          shareToken: shareToken,
          isPublic: true,
          updatedAt: new Date()
        })
        .where(eq(natalCharts.id, id));

      return shareToken;
    } catch (error) {
      console.error('ChartService.generateShareToken: Database operation failed:', error);
      
      // If database is truly unavailable, return null
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message.includes('Database not available') || message.includes('Connection failed')) {
          // Database unavailable, return null
          return null;
        }
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Get recent shared charts for the dropdown
   */
  static async getRecentSharedCharts(limit: number = 10): Promise<ChartData[]> {
    return resilient.array(db, 'getRecentSharedCharts', async () => {
      // Use consistent database approach
      const charts = await db
        .select()
        .from(natalCharts)
        .where(
          and(
            eq(natalCharts.isPublic, true),
            // Check for non-null share_token using SQL function
            sql`${natalCharts.shareToken} IS NOT NULL`
          )
        )
        .orderBy(desc(natalCharts.createdAt))
        .limit(limit);

      return charts.map((chart: any) => ({
        ...chart,
        metadata: JSON.parse(chart.metadata),
        // Timestamps are already Date objects from Drizzle
        createdAt: chart.createdAt,
        updatedAt: chart.updatedAt,
      }));
    });
  }
}