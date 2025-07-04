/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationService } from '@/db/services/notificationService';

const ADMIN_EMAIL = 'orbitandchill@gmail.com';

export class AnalyticsNotificationService {
  /**
   * Check if user is admin and should receive analytics notifications
   */
  private static async isAdminUser(userId?: string): Promise<boolean> {
    if (!userId) return false;
    
    try {
      // Get user from database to check email
      const response = await fetch(`/api/users/by-id/${userId}`);
      if (!response.ok) return false;
      
      const userData = await response.json();
      return userData.user?.email === ADMIN_EMAIL;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get admin user ID by email
   */
  private static async getAdminUserId(): Promise<string | null> {
    try {
      const response = await fetch(`/api/users/by-email/${encodeURIComponent(ADMIN_EMAIL)}`);
      if (!response.ok) return null;
      
      const userData = await response.json();
      return userData.user?.id || null;
    } catch (error) {
      console.error('Error getting admin user ID:', error);
      return null;
    }
  }

  /**
   * Send notification about daily analytics aggregation success
   */
  static async notifyDailyAggregationSuccess(date: string, metrics: any) {
    try {
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) {
        console.log('⚠️ Admin user not found, skipping analytics notification');
        return;
      }

      await NotificationService.createNotification({
        userId: adminUserId,
        type: 'analytics_success',
        title: '📊 Daily Analytics Aggregated',
        message: `Successfully aggregated traffic data for ${date}. ${metrics.visitors} visitors, ${metrics.pageViews} page views, ${metrics.chartsGenerated} charts generated.`,
        priority: 'low',
        entityType: 'analytics',
        entityId: `daily_${date}`,
        entityUrl: '/admin?tab=traffic',
        metadata: JSON.stringify({
          date,
          metrics,
          type: 'daily_aggregation',
          timestamp: new Date().toISOString()
        })
      });

      console.log(`📊 Analytics notification sent to admin for ${date}`);
    } catch (error) {
      console.error('Error sending daily aggregation notification:', error);
    }
  }

  /**
   * Send notification about daily analytics aggregation failure
   */
  static async notifyDailyAggregationFailure(date: string, error: string) {
    try {
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) {
        console.log('⚠️ Admin user not found, skipping analytics error notification');
        return;
      }

      await NotificationService.createNotification({
        userId: adminUserId,
        type: 'analytics_failure',
        title: '📉 Analytics Aggregation Failed',
        message: `Failed to aggregate traffic data for ${date}. Error: ${error.substring(0, 100)}...`,
        priority: 'high',
        entityType: 'analytics',
        entityId: `daily_error_${date}`,
        entityUrl: '/admin?tab=traffic',
        metadata: JSON.stringify({
          date,
          error,
          type: 'daily_aggregation_error',
          timestamp: new Date().toISOString()
        })
      });

      console.log(`🚨 Analytics error notification sent to admin for ${date}`);
    } catch (error) {
      console.error('Error sending daily aggregation error notification:', error);
    }
  }

  /**
   * Send notification about cron job execution
   */
  static async notifyCronJobStatus(status: 'success' | 'failure', details: any) {
    try {
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) return;

      const isSuccess = status === 'success';
      
      await NotificationService.createNotification({
        userId: adminUserId,
        type: isSuccess ? 'cron_success' : 'cron_failure',
        title: isSuccess ? '⏰ Analytics Cron Job Completed' : '🚨 Analytics Cron Job Failed',
        message: isSuccess 
          ? `Daily analytics cron job completed successfully. Processed ${details.datesProcessed || 0} dates.`
          : `Analytics cron job failed: ${details.error?.substring(0, 100) || 'Unknown error'}`,
        priority: isSuccess ? 'low' : 'high',
        entityType: 'system',
        entityId: `cron_${Date.now()}`,
        entityUrl: '/admin?tab=traffic',
        metadata: JSON.stringify({
          status,
          details,
          type: 'cron_job',
          timestamp: new Date().toISOString()
        })
      });

      console.log(`${isSuccess ? '✅' : '❌'} Cron job notification sent to admin`);
    } catch (error) {
      console.error('Error sending cron job notification:', error);
    }
  }

  /**
   * Send notification about traffic spikes
   */
  static async notifyTrafficSpike(date: string, currentVisitors: number, averageVisitors: number) {
    try {
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) return;

      const percentage = Math.round(((currentVisitors - averageVisitors) / averageVisitors) * 100);
      
      await NotificationService.createNotification({
        userId: adminUserId,
        type: 'traffic_spike',
        title: '📈 Traffic Spike Detected',
        message: `Unusual traffic detected on ${date}. ${currentVisitors} visitors (+${percentage}% above average of ${averageVisitors}).`,
        priority: 'medium',
        entityType: 'analytics',
        entityId: `spike_${date}`,
        entityUrl: '/admin?tab=traffic',
        metadata: JSON.stringify({
          date,
          currentVisitors,
          averageVisitors,
          percentage,
          type: 'traffic_spike',
          timestamp: new Date().toISOString()
        })
      });

      console.log(`📈 Traffic spike notification sent to admin for ${date}`);
    } catch (error) {
      console.error('Error sending traffic spike notification:', error);
    }
  }

  /**
   * Send weekly analytics summary notification
   */
  static async notifyWeeklySummary(weekData: any) {
    try {
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) return;

      const totalVisitors = weekData.totalVisitors || 0;
      const totalPageViews = weekData.totalPageViews || 0;
      const totalCharts = weekData.totalCharts || 0;
      
      await NotificationService.createNotification({
        userId: adminUserId,
        type: 'analytics_success',
        title: '📊 Weekly Analytics Summary',
        message: `Past 7 days: ${totalVisitors} visitors, ${totalPageViews} page views, ${totalCharts} charts generated. Growth: ${weekData.growth || 0}%`,
        priority: 'low',
        entityType: 'analytics',
        entityId: `weekly_${Date.now()}`,
        entityUrl: '/admin?tab=traffic',
        metadata: JSON.stringify({
          weekData,
          type: 'weekly_summary',
          timestamp: new Date().toISOString()
        })
      });

      console.log('📊 Weekly summary notification sent to admin');
    } catch (error) {
      console.error('Error sending weekly summary notification:', error);
    }
  }

  /**
   * Send system health notification
   */
  static async notifySystemHealth(healthData: any) {
    try {
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) return;

      const isHealthy = healthData.status === 'healthy';
      
      await NotificationService.createNotification({
        userId: adminUserId,
        type: 'system_health',
        title: isHealthy ? '💚 Analytics System Healthy' : '🔴 Analytics System Issues',
        message: isHealthy 
          ? `All analytics systems operational. Database: ${healthData.database}, API: ${healthData.api}, Tracking: ${healthData.tracking}`
          : `Analytics system issues detected: ${healthData.issues?.join(', ')}`,
        priority: isHealthy ? 'low' : 'high',
        entityType: 'system',
        entityId: `health_${Date.now()}`,
        entityUrl: '/admin?tab=traffic',
        metadata: JSON.stringify({
          healthData,
          type: 'system_health',
          timestamp: new Date().toISOString()
        })
      });

      console.log(`${isHealthy ? '💚' : '🔴'} System health notification sent to admin`);
    } catch (error) {
      console.error('Error sending system health notification:', error);
    }
  }
}

export default AnalyticsNotificationService;