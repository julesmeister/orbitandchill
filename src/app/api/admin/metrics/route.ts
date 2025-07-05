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
      
      // Calculate active users (users with natal charts or recent activity)
      activeUsers = allUsers.filter((user: any) => 
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
    } catch (discussionError) {
      console.warn('Failed to fetch discussions:', discussionError);
      forumPosts = 0;
    }
    
    // Get traffic summary for recent analytics
    try {
      const trafficSummary = await AnalyticsService.getTrafficSummary(30);
      chartsGenerated = (trafficSummary as any).chartsGenerated || 0;
      dailyVisitors = trafficSummary.averages?.visitors || 0;
    } catch (analyticsError) {
      console.warn('Failed to fetch analytics:', analyticsError);
      chartsGenerated = 0;
      dailyVisitors = 0;
    }
    
    // Get events analytics
    try {
      eventsAnalytics = await EventService.getGlobalAnalytics();
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

    return NextResponse.json({
      success: true,
      metrics,
      note: totalUsers === 0 ? 'Database appears to be empty. Consider seeding with test data.' : undefined
    });
    
  } catch (error) {
    console.error('API Error calculating metrics:', error);
    
    // Return zeros instead of mock data
    return NextResponse.json({
      success: false,
      metrics: {
        totalUsers: 0,
        activeUsers: 0,
        chartsGenerated: 0,
        forumPosts: 0,
        dailyVisitors: 0,
        monthlyGrowth: 0,
        events: {
          totalEvents: 0,
          eventsThisMonth: 0,
          eventsByType: { benefic: 0, challenging: 0, neutral: 0 },
          generationStats: { generated: 0, manual: 0 },
          engagementStats: { bookmarked: 0, averageScore: 0 },
          usageStats: { activeUsers: 0, eventsPerUser: 0 }
        },
      },
      error: 'Failed to fetch real metrics'
    });
  }
}

// Export protected route
export const GET = createAdminRoute(handleGetMetrics, 'admin.metrics.read');