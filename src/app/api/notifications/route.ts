/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/db/services/notificationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Parse filters from query params
    const filters: any = {};
    
    const isRead = searchParams.get('isRead');
    if (isRead !== null) {
      filters.isRead = isRead === 'true';
    }
    
    const isArchived = searchParams.get('isArchived');
    if (isArchived !== null) {
      filters.isArchived = isArchived === 'true';
    }
    
    const category = searchParams.get('category');
    if (category) {
      filters.category = category;
    }
    
    const priority = searchParams.get('priority');
    if (priority) {
      filters.priority = priority;
    }
    
    const type = searchParams.get('type');
    if (type) {
      filters.type = type;
    }
    
    const entityType = searchParams.get('entityType');
    if (entityType) {
      filters.entityType = entityType;
    }
    
    const limit = searchParams.get('limit');
    if (limit) {
      filters.limit = parseInt(limit);
    }
    
    const offset = searchParams.get('offset');
    if (offset) {
      filters.offset = parseInt(offset);
    }
    
    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',').map(tag => tag.trim());
    }
    
    const startDate = searchParams.get('startDate');
    if (startDate) {
      filters.startDate = new Date(startDate);
    }
    
    const endDate = searchParams.get('endDate');
    if (endDate) {
      filters.endDate = new Date(endDate);
    }

    const notifications = await NotificationService.getNotifications(userId, filters);
    
    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      type, 
      title, 
      message, 
      icon, 
      priority, 
      category, 
      entityType, 
      entityId, 
      entityUrl,
      deliveryMethod,
      scheduledFor,
      expiresAt,
      data,
      tags
    } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'userId, type, title, and message are required' },
        { status: 400 }
      );
    }

    const notification = await NotificationService.createNotification({
      userId,
      type,
      title,
      message,
      icon,
      priority,
      category,
      entityType,
      entityId,
      entityUrl,
      deliveryMethod,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      data,
      tags
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification', details: error },
      { status: 500 }
    );
  }
}