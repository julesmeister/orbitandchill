/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// Types for response
interface UserActivityAnalytics {
  totalUsers: number;
  newThisMonth: number;
  newLastMonth: number;
  activeUsers: number;
  usersWithCharts: number;
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
    
    // First day of current month
    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    
    // First day of last month
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const firstDayOfLastMonth = new Date(lastMonthYear, lastMonth, 1);
    
    // 30 days ago for active users
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Convert dates to Unix timestamps (in seconds)
    const firstDayOfCurrentMonthTimestamp = Math.floor(firstDayOfCurrentMonth.getTime() / 1000);
    const firstDayOfLastMonthTimestamp = Math.floor(firstDayOfLastMonth.getTime() / 1000);
    const thirtyDaysAgoTimestamp = Math.floor(thirtyDaysAgo.getTime() / 1000);

    // Get total users count (excluding deleted users)
    const totalResult = await client.execute(
      'SELECT COUNT(*) as count FROM users WHERE is_deleted = 0 OR is_deleted IS NULL'
    );
    const totalUsers = totalResult.rows[0]?.count || 0;

    // Get users created this month
    const thisMonthResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM users WHERE (is_deleted = 0 OR is_deleted IS NULL) AND created_at >= ?',
      args: [firstDayOfCurrentMonthTimestamp]
    });
    const newThisMonth = thisMonthResult.rows[0]?.count || 0;

    // Get users created last month
    const lastMonthResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM users WHERE (is_deleted = 0 OR is_deleted IS NULL) AND created_at >= ? AND created_at < ?',
      args: [firstDayOfLastMonthTimestamp, firstDayOfCurrentMonthTimestamp]
    });
    const newLastMonth = lastMonthResult.rows[0]?.count || 0;

    // Get active users (users who have updatedAt in last 30 days)
    const activeUsersResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM users WHERE (is_deleted = 0 OR is_deleted IS NULL) AND updated_at >= ?',
      args: [thirtyDaysAgoTimestamp]
    });
    const activeUsers = activeUsersResult.rows[0]?.count || 0;

    // Get users who have generated at least one chart
    const usersWithChartsResult = await client.execute(
      `SELECT COUNT(DISTINCT nc.user_id) as count 
       FROM natal_charts nc 
       INNER JOIN users u ON nc.user_id = u.id 
       WHERE (u.is_deleted = 0 OR u.is_deleted IS NULL)`
    );
    const usersWithCharts = usersWithChartsResult.rows[0]?.count || 0;

    const analytics: UserActivityAnalytics = {
      totalUsers: Number(totalUsers),
      newThisMonth: Number(newThisMonth),
      newLastMonth: Number(newLastMonth),
      activeUsers: Number(activeUsers),
      usersWithCharts: Number(usersWithCharts)
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Real user analytics error:', error);
    
    // Return zeros if database is unavailable
    return NextResponse.json({
      success: false,
      error: 'Database temporarily unavailable',
      data: {
        totalUsers: 0,
        newThisMonth: 0,
        newLastMonth: 0,
        activeUsers: 0,
        usersWithCharts: 0
      }
    });
  }
}