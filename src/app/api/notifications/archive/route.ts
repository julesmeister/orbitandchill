/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/db/services/notificationService';

/**
 * Notification Archive API
 * GET /api/notifications/archive?userId=xxx - Get archived notifications
 * POST /api/notifications/archive - Archive multiple notifications
 * DELETE /api/notifications/archive - Clear archive (delete archived notifications)
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Get archived notifications
    const notifications = await NotificationService.getNotifications(userId, {
      isArchived: true,
      limit,
      offset,
      category: category as any,
      priority: priority as any,
      type: type as any
    });

    // If search term provided, filter by title or message
    let filteredNotifications = notifications;
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredNotifications = notifications.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm) ||
        notification.message.toLowerCase().includes(searchTerm)
      );
    }

    // Get archive statistics
    const archiveStats = await NotificationService.getArchiveStats(userId);

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
      stats: archiveStats,
      pagination: {
        limit,
        offset,
        total: filteredNotifications.length,
        hasMore: filteredNotifications.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching archived notifications:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch archived notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, notificationIds } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'notificationIds array is required' },
        { status: 400 }
      );
    }

    // Archive multiple notifications
    const results = await Promise.allSettled(
      notificationIds.map(id => NotificationService.archiveNotification(id, userId))
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      archived: successful,
      failed,
      total: results.length
    });

  } catch (error) {
    console.error('Error archiving notifications:', error);
    return NextResponse.json(
      { 
        error: 'Failed to archive notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, olderThanDays } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Delete archived notifications older than specified days (default: 90 days)
    const cutoffDays = olderThanDays || 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - cutoffDays);

    const deletedCount = await NotificationService.deleteArchivedNotifications(userId, cutoffDate);

    return NextResponse.json({
      success: true,
      deletedCount,
      cutoffDate: cutoffDate.toISOString()
    });

  } catch (error) {
    console.error('Error clearing notification archive:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear notification archive',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}