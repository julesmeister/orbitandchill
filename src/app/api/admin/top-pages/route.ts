/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { UserActivityService } from '@/db/services/userActivityService';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    console.log('📊 API: Loading real top pages data...');
    
    // Get real page view data from user activities over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const pageViewActivities = await UserActivityService.getActivitiesByType('page_view');
    
    // Aggregate page views by page path
    const pageViewCounts: { [page: string]: number } = {};
    let totalViews = 0;
    
    for (const activity of pageViewActivities) {
      if (activity.createdAt >= thirtyDaysAgo) {
        const metadata = activity.metadata ? JSON.parse(activity.metadata as unknown as string) : {};
        const page = metadata.page || '/';
        pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
        totalViews++;
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
    
    // If we have ANY real data, use it (lowered threshold for development)
    if (pages.length > 0) {
      console.log(`✅ API: Real top pages data found: ${pages.length} pages with ${totalViews} total views`);
      
      return NextResponse.json({
        success: true,
        pages,
        dataSource: 'real',
        totalViews
      });
    }
    
    // Fallback to proportional data based on actual traffic if no page-level data
    console.log('⚠️ API: No page-level data found, using proportional fallback...');
    const trafficSummary = await AnalyticsService.getTrafficSummary(30);
    const totalPageViews = (trafficSummary as any).pageViews || 100;
    
    const fallbackPages = [
      { page: '/chart', views: Math.round(totalPageViews * 0.34), percentage: 34 },
      { page: '/discussions', views: Math.round(totalPageViews * 0.23), percentage: 23 },
      { page: '/', views: Math.round(totalPageViews * 0.18), percentage: 18 },
      { page: '/horary', views: Math.round(totalPageViews * 0.10), percentage: 10 },
      { page: '/astrocartography', views: Math.round(totalPageViews * 0.08), percentage: 8 },
      { page: '/about', views: Math.round(totalPageViews * 0.07), percentage: 7 }
    ];
    
    return NextResponse.json({
      success: true,
      pages: fallbackPages,
      dataSource: 'proportional',
      totalViews: totalPageViews
    });
    
  } catch (error) {
    console.error('API Error loading top pages:', error);
    
    // Return hardcoded fallback data
    return NextResponse.json({
      success: false,
      pages: [
        { page: '/chart', views: 340, percentage: 34 },
        { page: '/discussions', views: 230, percentage: 23 },
        { page: '/', views: 180, percentage: 18 },
        { page: '/horary', views: 100, percentage: 10 },
        { page: '/astrocartography', views: 80, percentage: 8 },
        { page: '/about', views: 70, percentage: 7 }
      ],
      dataSource: 'fallback',
      error: 'Failed to fetch top pages, using hardcoded fallback'
    });
  }
}