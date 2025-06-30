/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// Types for response
interface NatalChartsAnalytics {
  total: number;
  thisMonth: number;
  thisWeek: number;
  byType: {
    natal: number;
    transit: number;
    synastry: number;
    composite: number;
    horary: number;
  };
}

export async function GET() {
  try {
    // Import the HTTP client directly
    const { createClient } = await import('@libsql/client/http');
    
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      throw new Error('Database configuration missing');
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Calculate date ranges
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Convert dates to Unix timestamps (in seconds)
    const firstDayOfMonthTimestamp = Math.floor(firstDayOfMonth.getTime() / 1000);
    const firstDayOfWeekTimestamp = Math.floor(firstDayOfWeek.getTime() / 1000);

    // Get total charts count using raw SQL
    const totalResult = await client.execute('SELECT COUNT(*) as count FROM natal_charts');
    const total = Number(totalResult.rows[0]?.count) || 0;

    // Get charts created this month
    const thisMonthResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM natal_charts WHERE created_at >= ?',
      args: [firstDayOfMonthTimestamp]
    });
    const thisMonth = Number(thisMonthResult.rows[0]?.count) || 0;

    // Get charts created this week
    const thisWeekResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM natal_charts WHERE created_at >= ?',
      args: [firstDayOfWeekTimestamp]
    });
    const thisWeek = Number(thisWeekResult.rows[0]?.count) || 0;

    // Get charts by type using GROUP BY
    const chartsByTypeResult = await client.execute(
      'SELECT chart_type, COUNT(*) as count FROM natal_charts GROUP BY chart_type'
    );

    // Get horary charts count from horary_questions table
    const horaryChartsResult = await client.execute(
      'SELECT COUNT(*) as count FROM horary_questions'
    );
    const horaryTotal = Number(horaryChartsResult.rows[0]?.count) || 0;

    // Get horary charts created this month
    const horaryThisMonthResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM horary_questions WHERE created_at >= ?',
      args: [firstDayOfMonthTimestamp]
    });
    const horaryThisMonth = Number(horaryThisMonthResult.rows[0]?.count) || 0;

    // Get horary charts created this week
    const horaryThisWeekResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM horary_questions WHERE created_at >= ?',
      args: [firstDayOfWeekTimestamp]
    });
    const horaryThisWeek = Number(horaryThisWeekResult.rows[0]?.count) || 0;

    // Build byType object including horary
    const byType = {
      natal: 0,
      transit: 0,
      synastry: 0,
      composite: 0,
      horary: horaryTotal
    };

    chartsByTypeResult.rows.forEach(row => {
      const chartType = row.chart_type;
      const count = Number(row.count) || 0;
      if (chartType && typeof chartType === 'string' && chartType in byType) {
        (byType as any)[chartType] = count;
      }
    });

    const analytics: NatalChartsAnalytics = {
      total: total + horaryTotal,
      thisMonth: thisMonth + horaryThisMonth, 
      thisWeek: thisWeek + horaryThisWeek,
      byType
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Charts analytics error:', error);
    
    // Return zeros if database is unavailable
    return NextResponse.json({
      success: false,
      error: 'Database temporarily unavailable',
      data: {
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
        byType: {
          natal: 0,
          transit: 0,
          synastry: 0,
          composite: 0,
          horary: 0
        }
      }
    });
  }
}