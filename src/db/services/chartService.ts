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

    // Check database availability before attempting operation
    console.log('ChartService.createChart: Checking database availability...');
    console.log('ChartService.createChart: Database object:', !!db);
    console.log('ChartService.createChart: Database client:', !!db?.client);
    console.log('ChartService.createChart: TURSO_DATABASE_URL:', !!process.env.TURSO_DATABASE_URL);
    
    // Bypass resilience wrapper and go directly to database
    // The resilience wrapper is incorrectly detecting database as unavailable
    try {
      console.log('ChartService.createChart: Attempting direct database insert...');
      await db.insert(natalCharts).values(newChart);
      
      // Verify the chart was actually saved
      const [savedChart] = await db
        .select()
        .from(natalCharts)
        .where(eq(natalCharts.id, chartId))
        .limit(1);
      
      if (!savedChart) {
        console.error('ChartService.createChart: Chart was not saved to database!');
        throw new Error('Chart was not saved to database');
      }
      
      console.log('ChartService.createChart: Chart successfully saved with ID:', savedChart.id);
      
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
          console.warn('ChartService.createChart: Database unavailable, returning null');
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
    return resilient.item(db, 'getChartById', async () => {
      // Use the same database approach as createChart for consistency
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
    });
  }

  /**
   * Get a chart by share token (for public sharing)
   */
  static async getChartByShareToken(shareToken: string): Promise<ChartData | null> {
    return resilient.item(db, 'getChartByShareToken', async () => {
      // Use the same database approach as createChart for consistency
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
    });
  }

  /**
   * Get all charts for a user
   */
  static async getUserCharts(userId: string): Promise<ChartData[]> {
    // Bypass resilience wrapper - direct database access
    try {
      console.log('ChartService.getUserCharts: Looking for charts for user:', userId);
      const charts = await db
        .select()
        .from(natalCharts)
        .where(eq(natalCharts.userId, userId))
        .orderBy(desc(natalCharts.createdAt));

      console.log('ChartService.getUserCharts: Found', charts.length, 'charts for user', userId);
      if (charts.length > 0) {
        console.log('ChartService.getUserCharts: Chart IDs:', charts.map(c => c.id));
      }

      return charts.map((chart: any) => ({
        ...chart,
        metadata: JSON.parse(chart.metadata),
        // Timestamps are already Date objects from Drizzle
        createdAt: chart.createdAt,
        updatedAt: chart.updatedAt,
      }));
    } catch (error) {
      console.error('ChartService.getUserCharts: Database operation failed:', error);
      
      // If database is truly unavailable, return empty array
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as Error).message;
        if (message.includes('Database not available') || message.includes('Connection failed')) {
          console.warn('ChartService.getUserCharts: Database unavailable, returning empty array');
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

      // Use the same database approach as createChart for consistency
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
      // Use the same database approach as createChart for consistency
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
    return resilient.operation(db, 'generateShareToken', async () => {
      // First get the existing chart to check if it already has a token
      console.log('Looking for chart with ID:', id, 'for user:', userId);
      const chart = await this.getChartById(id, userId);
      
      if (!chart) {
        console.log('Chart not found - let\'s check all charts for this user');
        const userCharts = await this.getUserCharts(userId);
        console.log('User has', userCharts.length, 'charts:', userCharts.map(c => ({ id: c.id, title: c.title })));
        throw new Error('Chart not found');
      }

      // If chart already has a share token, return it
      if (chart.shareToken && chart.isPublic) {
        return chart.shareToken;
      }

      // Generate new share token
      const shareToken = generateId();
      
      // Use the same database approach as createChart for consistency
      await db
        .update(natalCharts)
        .set({
          shareToken: shareToken,
          isPublic: true,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(natalCharts.id, id),
            eq(natalCharts.userId, userId)
          )
        );

      return shareToken;
    }, null); // Return null if database unavailable
  }

  /**
   * Get recent shared charts for the dropdown
   */
  static async getRecentSharedCharts(limit: number = 10): Promise<ChartData[]> {
    return resilient.array(db, 'getRecentSharedCharts', async () => {
      // Use the same database approach as createChart for consistency
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