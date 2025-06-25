/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, desc, and } from 'drizzle-orm';
import { db, initializeDatabase } from '@/db/index';
import { natalCharts } from '@/db/schema';
import { generateId } from '@/utils/idGenerator';
import { createResilientService } from '@/db/resilience';
import { executeRawSelectOne, executeRawSelect, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

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

    return resilient.operation(db, 'createChart', async () => {
      await db.insert(natalCharts).values(newChart);
      
      return {
        ...newChart,
        metadata: data.metadata, // Return original object, not stringified
      };
    }, null); // Return null if database unavailable
  }

  /**
   * Get a chart by ID
   */
  static async getChartById(id: string, userId?: string): Promise<ChartData | null> {
    return resilient.item(db, 'getChartById', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const conditions = [{ column: 'id', value: id }];
      if (userId) {
        conditions.push({ column: 'user_id', value: userId });
      }

      const chart = await executeRawSelectOne(db, {
        table: 'natal_charts',
        conditions
      });
      
      if (!chart) return null;

      // Transform snake_case to camelCase and parse metadata
      const transformedChart = transformDatabaseRow(chart);
      return {
        ...transformedChart,
        metadata: JSON.parse(chart.metadata),
        createdAt: new Date(chart.created_at),
        updatedAt: new Date(chart.updated_at),
      };
    });
  }

  /**
   * Get a chart by share token (for public sharing)
   */
  static async getChartByShareToken(shareToken: string): Promise<ChartData | null> {
    return resilient.item(db, 'getChartByShareToken', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const chart = await executeRawSelectOne(db, {
        table: 'natal_charts',
        conditions: [
          { column: 'share_token', value: shareToken },
          { column: 'is_public', value: 1 } // Boolean true = 1 in SQLite
        ]
      });
      
      if (!chart) return null;

      // Transform snake_case to camelCase and parse metadata
      const transformedChart = transformDatabaseRow(chart);
      return {
        ...transformedChart,
        metadata: JSON.parse(chart.metadata),
        createdAt: new Date(chart.created_at),
        updatedAt: new Date(chart.updated_at),
      };
    });
  }

  /**
   * Get all charts for a user
   */
  static async getUserCharts(userId: string): Promise<ChartData[]> {
    return resilient.array(db, 'getUserCharts', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const charts = await executeRawSelect(db, {
        table: 'natal_charts',
        conditions: [{ column: 'user_id', value: userId }],
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });

      return charts.map((chart: any) => {
        const transformedChart = transformDatabaseRow(chart);
        return {
          ...transformedChart,
          metadata: JSON.parse(chart.metadata),
          createdAt: new Date(chart.created_at),
          updatedAt: new Date(chart.updated_at),
        };
      });
    });
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

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawUpdate(db, 'natal_charts', updateData, [
        { column: 'id', value: id },
        { column: 'user_id', value: userId }
      ]);

      return await this.getChartById(id, userId);
    });
  }

  /**
   * Delete a chart
   */
  static async deleteChart(id: string, userId: string): Promise<boolean> {
    return resilient.boolean(db, 'deleteChart', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawDelete(db, 'natal_charts', [
        { column: 'id', value: id },
        { column: 'user_id', value: userId }
      ]);

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
        createdAt: new Date(chart.createdAt),
        updatedAt: new Date(chart.updatedAt),
      };
    });
  }

  /**
   * Generate a new share token for a chart
   */
  static async generateShareToken(id: string, userId: string): Promise<string | null> {
    return resilient.operation(db, 'generateShareToken', async () => {
      const shareToken = generateId();
      
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawUpdate(db, 'natal_charts', {
          share_token: shareToken,
          is_public: true,
          updated_at: new Date()
        }, [
          { column: 'id', value: id },
          { column: 'user_id', value: userId }
        ]);

      return shareToken;
    }, null); // Return null if database unavailable
  }
}