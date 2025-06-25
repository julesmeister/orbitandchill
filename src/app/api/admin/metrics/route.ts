/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';
import { DiscussionService } from '@/db/services/discussionService';
import { AnalyticsService } from '@/db/services/analyticsService';
import { EventService } from '@/db/services/eventService';
import { initializeDatabase } from '@/db/index';
import { createAdminRoute, type AdminAuthContext } from '@/middleware/adminAuth';

async function handleGetMetrics(request: NextRequest, context: AdminAuthContext) {
  try {
    await initializeDatabase();
    
    console.log('📊 API: Calculating real site metrics...');
    
    let totalUsers = 0;
    let activeUsers = 0;
    let forumPosts = 0;
    let chartsGenerated = 0;
    let dailyVisitors = 0;
    let eventsAnalytics = null;
    
    // Get all users to calculate total
    try {
      const allUsers = await UserService.getAllUsers(1000);
      totalUsers = allUsers.length;
      console.log(`👥 API: Found ${totalUsers} users in database`);
      
      // Calculate active users (users with natal charts or recent activity)
      activeUsers = allUsers.filter((user: { hasNatalChart: any; updatedAt: string | number | Date; }) => 
        user.hasNatalChart || 
        (user.updatedAt && new Date(user.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      ).length;
      
    } catch (userError) {
      console.warn('Failed to fetch users:', userError);
      totalUsers = 0;
      activeUsers = 0;
    }
    
    // Get discussions count for forum posts
    try {
      const discussionsResult = await DiscussionService.getAllDiscussions({ limit: 1000 });
      forumPosts = Array.isArray(discussionsResult) ? discussionsResult.length : 0;
      console.log(`💬 API: Found ${forumPosts} discussions in database`);
    } catch (discussionError) {
      console.warn('Failed to fetch discussions:', discussionError);
      forumPosts = 0;
    }
    
    // Get traffic summary for recent analytics
    try {
      const trafficSummary = await AnalyticsService.getTrafficSummary(30);
      chartsGenerated = trafficSummary.totals.chartsGenerated || 0;
      dailyVisitors = trafficSummary.averages.visitors || 0;
      console.log(`📊 API: Analytics: ${chartsGenerated} charts, ${dailyVisitors} daily visitors`);
    } catch (analyticsError) {
      console.warn('Failed to fetch analytics:', analyticsError);
      chartsGenerated = 0;
      dailyVisitors = 0;
    }
    
    // Get events analytics
    try {
      eventsAnalytics = await EventService.getGlobalAnalytics();
      console.log(`📅 API: Events: ${eventsAnalytics.totalEvents} total, ${eventsAnalytics.eventsThisMonth} this month`);
    } catch (eventsError) {
      console.warn('Failed to fetch events analytics:', eventsError);
      eventsAnalytics = {
        totalEvents: 0,
        eventsThisMonth: 0,
        eventsByType: { benefic: 0, challenging: 0, neutral: 0 },
        generationStats: { generated: 0, manual: 0 },
        engagementStats: { bookmarked: 0, averageScore: 0 },
        usageStats: { activeUsers: 0, eventsPerUser: 0 }
      };
    }
    
    // Calculate monthly growth (simplified)
    const monthlyGrowth = Math.max(0, Math.min(25, Math.floor(totalUsers / 10)));
    
    const metrics = {
      totalUsers,
      activeUsers,
      chartsGenerated,
      forumPosts,
      dailyVisitors,
      monthlyGrowth,
      events: eventsAnalytics,
    };
    
    console.log('✅ API: Site metrics calculated:', metrics);
    
    return NextResponse.json({
      success: true,
      metrics,
      note: totalUsers === 0 ? 'Database appears to be empty. Consider seeding with test data.' : undefined
    });
    
  } catch (error) {
    console.error('API Error calculating metrics:', error);
    
    // Return fallback data if database fails
    return NextResponse.json({
      success: false,
      metrics: {
        totalUsers: 150,
        activeUsers: 45,
        chartsGenerated: 892,
        forumPosts: 25,
        dailyVisitors: 320,
        monthlyGrowth: 8,
        events: {
          totalEvents: 127,
          eventsThisMonth: 34,
          eventsByType: { benefic: 65, challenging: 28, neutral: 34 },
          generationStats: { generated: 89, manual: 38 },
          engagementStats: { bookmarked: 42, averageScore: 6.8 },
          usageStats: { activeUsers: 23, eventsPerUser: 5.5 }
        },
      },
      error: 'Failed to fetch real metrics, using fallback data'
    });
  }
}

// Export protected route
export const GET = createAdminRoute(handleGetMetrics, 'admin.metrics.read');