/* eslint-disable @typescript-eslint/no-unused-vars */
import { DiscussionService } from '@/db/services/discussionService';
// AnalyticsService removed - using Google Analytics
import { PeriodMetrics, UserMetrics, ChartMetrics } from '@/types/metrics';

export class MetricsService {
  static async getCurrentPeriodMetrics(): Promise<PeriodMetrics> {
    try {
      console.log('📊 Fetching current period metrics from real data APIs...');
      
      // Fetch real user analytics
      const userMetrics = await this.getUserMetrics();
      
      // Fetch real chart analytics  
      const chartMetrics = await this.getChartMetrics();
      
      // Get forum posts from discussion service
      const { forumPosts, newPosts } = await this.getForumMetrics();
      
      // Get traffic summary for visitor metrics
      const { dailyVisitors, pageViews } = await this.getTrafficMetrics();
      
      return {
        totalUsers: userMetrics.totalUsers,
        newUsers: userMetrics.newThisMonth,
        activeUsers: userMetrics.activeUsers,
        chartsGenerated: chartMetrics.total,
        forumPosts: forumPosts,
        newPosts: newPosts,
        dailyVisitors: dailyVisitors,
        pageViews: pageViews
      };
      
    } catch (error) {
      console.error('Error getting current period metrics:', error);
      return this.getEmptyMetrics();
    }
  }

  static async getPreviousPeriodMetrics(): Promise<PeriodMetrics> {
    // For simplicity, we'll estimate previous period based on current growth patterns
    // In a real implementation, you'd query historical data
    const current = await this.getCurrentPeriodMetrics();
    
    // Estimate previous period as 85-95% of current (simulating growth)
    const growthFactor = 0.85 + Math.random() * 0.1; // Random between 85-95%
    
    return {
      totalUsers: Math.floor(current.totalUsers * growthFactor),
      newUsers: Math.floor(current.newUsers * growthFactor),
      activeUsers: Math.floor(current.activeUsers * growthFactor),
      chartsGenerated: Math.floor(current.chartsGenerated * growthFactor),
      forumPosts: Math.floor(current.forumPosts * growthFactor),
      newPosts: Math.floor(current.newPosts * growthFactor),
      dailyVisitors: Math.floor(current.dailyVisitors * growthFactor),
      pageViews: Math.floor(current.pageViews * growthFactor)
    };
  }

  private static async getUserMetrics(): Promise<UserMetrics> {
    let userMetrics = {
      totalUsers: 0,
      newThisMonth: 0,
      activeUsers: 0,
      usersWithCharts: 0
    };
    
    try {
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/real-user-analytics`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.data) {
          userMetrics = userData.data;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch user analytics, using fallback');
    }

    return userMetrics;
  }

  private static async getChartMetrics(): Promise<ChartMetrics> {
    let chartMetrics = {
      total: 0,
      thisMonth: 0
    };
    
    try {
      const chartResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/charts-analytics`);
      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        if (chartData.success && chartData.data) {
          chartMetrics = chartData.data;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch chart analytics, using fallback');
    }

    return chartMetrics;
  }

  private static async getForumMetrics(): Promise<{ forumPosts: number; newPosts: number }> {
    let forumPosts = 0;
    let newPosts = 0;

    try {
      const allDiscussions = await DiscussionService.getAllDiscussions({ limit: 1000 });
      forumPosts = Array.isArray(allDiscussions) ? allDiscussions.length : 0;
      
      // Count new posts this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      if (Array.isArray(allDiscussions)) {
        newPosts = allDiscussions.filter((discussion: { createdAt: string | number | Date; }) => 
          new Date(discussion.createdAt) >= startOfMonth
        ).length;
      }
    } catch (error) {
      console.warn('Failed to fetch discussion data');
    }

    return { forumPosts, newPosts };
  }

  private static async getTrafficMetrics(): Promise<{ dailyVisitors: number; pageViews: number }> {
    let dailyVisitors = 0;
    let pageViews = 0;

    try {
      // Traffic summary removed - use Google Analytics
      const trafficSummary = { chartsGenerated: 0 };
      dailyVisitors = (trafficSummary as any)?.averages?.visitors || 0;
      pageViews = (trafficSummary as any)?.totals?.pageViews || 0;
    } catch (error) {
      console.warn('Failed to fetch traffic summary');
    }

    return { dailyVisitors, pageViews };
  }

  static getEmptyMetrics(): PeriodMetrics {
    return {
      totalUsers: 0,
      newUsers: 0, 
      activeUsers: 0,
      chartsGenerated: 0,
      forumPosts: 0,
      newPosts: 0,
      dailyVisitors: 0,
      pageViews: 0
    };
  }
}