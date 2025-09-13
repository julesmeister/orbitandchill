import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { DiscussionService } from '@/db/services/discussionService';

interface AdminNotification {
  id: string;
  type: 'new_user' | 'new_discussion' | 'system_alert' | 'high_activity' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

interface NotificationSummary {
  total: number;
  unread: number;
  hasHigh: boolean;
  recent: AdminNotification[];
}

export async function GET() {
  try {
    await initializeDatabase();
    
    const notifications: AdminNotification[] = [];
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Check for new discussions in last 24 hours
    try {
      // Initialize database first
      await initializeDatabase();
      
      const recentDiscussions = await DiscussionService.getAllDiscussions({
        limit: 50,
        sortBy: 'recent'
      });
      
      const newDiscussions = recentDiscussions.filter(discussion => 
        new Date(discussion.createdAt * 1000) > oneDayAgo  // Fix: createdAt is Unix timestamp
      );
      
      // Create notifications for new discussions
      newDiscussions.slice(0, 5).forEach((discussion) => {
        notifications.push({
          id: `discussion_${discussion.id}_${Date.now()}`,
          type: 'new_discussion',
          title: 'New Discussion Posted',
          message: `"${discussion.title}" by ${discussion.authorName || 'Anonymous'}`,
          timestamp: new Date(discussion.createdAt * 1000).toISOString(), // Convert Unix timestamp
          read: false,
          priority: 'medium',
          actionUrl: `/discussions/${discussion.id}`
        });
      });
      
      // High activity notification
      if (newDiscussions.length > 10) {
        notifications.push({
          id: `high_activity_${Date.now()}`,
          type: 'high_activity',
          title: 'High Community Activity',
          message: `${newDiscussions.length} new discussions in the last 24 hours`,
          timestamp: now.toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/admin?tab=posts'
        });
      }
      
    } catch (error) {
      console.error('Error checking discussions for notifications:', error);
      
      // Only add error notification if it's a real error, not just empty database
      if (error && error instanceof Error && !error.message.includes('no such table')) {
        notifications.push({
          id: `error_discussions_${Date.now()}`,
          type: 'system_alert',
          title: 'Discussion System Notice',
          message: 'Discussions database is initializing',
          timestamp: now.toISOString(),
          read: false,
          priority: 'low'
        });
      }
    }
    
    // Check system health for alerts
    try {
      const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/health`);
      const healthData = await healthResponse.json();
      
      if (healthData.success && healthData.health) {
        const { health } = healthData;
        
        // Database issues
        if (health.database.status === 'error') {
          notifications.push({
            id: `db_error_${Date.now()}`,
            type: 'system_alert',
            title: 'Database Connection Issue',
            message: 'Database connection is experiencing problems',
            timestamp: now.toISOString(),
            read: false,
            priority: 'high'
          });
        }
        
        // High memory usage
        if (health.memory.percentage > 80) {
          notifications.push({
            id: `memory_alert_${Date.now()}`,
            type: 'system_alert',
            title: 'High Memory Usage',
            message: `Memory usage at ${health.memory.percentage}%`,
            timestamp: now.toISOString(),
            read: false,
            priority: 'medium'
          });
        }
        
        // Low uptime
        if (parseFloat(health.uptimePercentage) < 95) {
          notifications.push({
            id: `uptime_alert_${Date.now()}`,
            type: 'system_alert',
            title: 'Low System Uptime',
            message: `Uptime is ${health.uptimePercentage}%`,
            timestamp: now.toISOString(),
            read: false,
            priority: 'high'
          });
        }
      }
    } catch (error) {
      console.error('Error checking system health for notifications:', error);
    }
    
    // Mock new user notifications (in a real system, this would check user registration logs)
    const mockNewUserNotification: AdminNotification = {
      id: `new_user_${Date.now()}`,
      type: 'new_user',
      title: 'New User Registration',
      message: 'A new user has joined the platform',
      timestamp: oneHourAgo.toISOString(),
      read: Math.random() > 0.5, // Random read status for demo
      priority: 'low'
    };
    
    // Only add if we don't have too many notifications already
    if (notifications.length < 8) {
      notifications.push(mockNewUserNotification);
    }
    
    // Sort notifications by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Calculate summary
    const unreadCount = notifications.filter(n => !n.read).length;
    const hasHighPriority = notifications.some(n => n.priority === 'high' && !n.read);
    
    const summary: NotificationSummary = {
      total: notifications.length,
      unread: unreadCount,
      hasHigh: hasHighPriority,
      recent: notifications.slice(0, 10) // Most recent 10
    };
    
    return NextResponse.json({
      success: true,
      notifications: summary
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Notifications API error:', error);
    
    return NextResponse.json({
      success: false,
      notifications: {
        total: 0,
        unread: 0,
        hasHigh: false,
        recent: []
      } as NotificationSummary,
      error: 'Failed to fetch notifications'
    }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}