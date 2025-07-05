/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { UserActivityService } from '@/db/services/userActivityService';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    // ENHANCED APPROACH: Get page data from both traffic aggregation and user activities
    
    // Method 1: Try to get from traffic data (stored during aggregation)
    const trafficData = await AnalyticsService.getTrafficData(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );
    
    const pageViewCounts: { [page: string]: number } = {};
    let totalViews = 0;
    
    // Extract page data from aggregated traffic data
    for (const day of trafficData) {
      if (day.topPages && Array.isArray(day.topPages)) {
        for (const pageData of day.topPages) {
          const page = pageData.page || '/';
          const views = pageData.views || 0;
          pageViewCounts[page] = (pageViewCounts[page] || 0) + views;
          totalViews += views;
        }
      }
    }
    
    // Method 2: If no aggregated data, try user activities (fallback)
    if (totalViews === 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const pageViewActivities = await UserActivityService.getActivitiesByType('page_view');
      
      for (const activity of pageViewActivities) {
        if (activity.createdAt >= thirtyDaysAgo) {
          const metadata = activity.metadata ? JSON.parse(activity.metadata as unknown as string) : {};
          const page = metadata.page || '/';
          pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
          totalViews++;
        }
      }
    }
    
    // Convert to array and sort by views
    const pages = Object.entries(pageViewCounts)
      .map(([page, views]) => ({
        page,
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10); // Top 10 pages

    // Return real data if we have any
    if (pages.length > 0) {
      return NextResponse.json({
        success: true,
        pages,
        dataSource: 'real',
        totalViews
      });
    }
    
    // No page-level data found, return empty instead of fallback
    
    return NextResponse.json({
      success: true,
      pages: [],
      dataSource: 'real',
      totalViews: 0
    });
    
  } catch (error) {
    console.error('API Error loading top pages:', error);
    
    // Return empty data instead of fallback
    return NextResponse.json({
      success: false,
      pages: [],
      dataSource: 'error',
      error: 'Failed to fetch top pages'
    });
  }
}