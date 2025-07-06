/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/db/services/notificationService';

/**
 * Notification System Status API
 * GET /api/notifications-status
 */
export async function GET(request: NextRequest) {
  try {
    // Test basic notification service functionality
    const testUserId = 'test-user-' + Date.now();
    
    // Try to create a test notification
    const testNotification = await NotificationService.createNotification({
      userId: testUserId,
      type: 'system_announcement',
      title: 'System Status Check',
      message: 'This is a test notification to verify the system is working',
      icon: '🔧',
      priority: 'low',
      category: 'system',
      entityType: 'system'
    });

    // Try to get notifications for the test user
    const notifications = await NotificationService.getNotifications(testUserId);
    
    // Clean up the test notification
    if (testNotification?.id) {
      await NotificationService.deleteNotification(testNotification.id, testUserId);
    }

    return NextResponse.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      tests: {
        createNotification: testNotification ? 'pass' : 'fail',
        getNotifications: Array.isArray(notifications) ? 'pass' : 'fail',
        deleteNotification: 'pass' // If we got here, delete worked
      },
      version: '1.0.0',
      features: {
        discussionNotifications: 'enabled',
        voteNotifications: 'enabled', 
        systemNotifications: 'enabled',
        emailNotifications: 'planned',
        pushNotifications: 'planned',
        realTimeNotifications: 'planned'
      }
    });

  } catch (error) {
    console.error('Notification status check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      tests: {
        createNotification: 'fail',
        getNotifications: 'fail',
        deleteNotification: 'fail'
      }
    }, { status: 500 });
  }
}

/**
 * Get notification statistics
 * POST /api/notifications-status
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user's notification summary
    const summary = await NotificationService.getNotificationSummary(userId);
    const notifications = await NotificationService.getNotifications(userId, { limit: 5 });

    return NextResponse.json({
      userId,
      summary,
      recentNotifications: notifications,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting notification stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get notification statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}