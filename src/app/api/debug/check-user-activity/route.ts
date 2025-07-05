/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    const db = await initializeDatabase();
    
    console.log('🔍 Checking user activity data...');
    
    // Get recent user activities
    const recentActivities = await db.client.execute({
      sql: `SELECT activity_type, COUNT(*) as count, DATE(created_at) as date 
            FROM user_activity 
            WHERE created_at >= datetime('now', '-7 days')
            GROUP BY activity_type, DATE(created_at)
            ORDER BY date DESC, count DESC`,
      args: []
    });
    
    // Get page view activities specifically
    const pageViews = await db.client.execute({
      sql: `SELECT session_id, user_id, metadata, created_at 
            FROM user_activity 
            WHERE activity_type = 'page_view' 
            AND created_at >= datetime('now', '-1 days')
            ORDER BY created_at DESC 
            LIMIT 10`,
      args: []
    });
    
    // Get analytics traffic data
    const trafficData = await db.client.execute({
      sql: `SELECT date, visitors, page_views, charts_generated, created_at 
            FROM analytics_traffic 
            WHERE date >= date('now', '-7 days')
            ORDER BY date DESC`,
      args: []
    });
    
    // Check if middleware is creating data
    const middlewareCheck = await db.client.execute({
      sql: `SELECT COUNT(*) as total_activities, 
                   COUNT(DISTINCT session_id) as unique_sessions,
                   MAX(created_at) as last_activity
            FROM user_activity 
            WHERE created_at >= datetime('now', '-1 days')`,
      args: []
    });
    
    return NextResponse.json({
      success: true,
      debug: {
        recentActivities: recentActivities.rows,
        pageViews: pageViews.rows,
        trafficData: trafficData.rows,
        middlewareCheck: middlewareCheck.rows[0],
        summary: {
          totalActivities: middlewareCheck.rows[0]?.total_activities || 0,
          uniqueSessions: middlewareCheck.rows[0]?.unique_sessions || 0,
          lastActivity: middlewareCheck.rows[0]?.last_activity || 'none',
          hasPageViews: pageViews.rows.length > 0,
          hasTrafficData: trafficData.rows.length > 0
        }
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: 'Failed to check user activity'
    }, { status: 500 });
  }
}