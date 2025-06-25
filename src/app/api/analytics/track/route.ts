/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { UserActivityService } from '@/db/services/userActivityService';

export async function POST(request: NextRequest) {
  try {
    // Check if request has a body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    let body;
    try {
      // Try to get the raw text first to debug
      const text = await request.text();
      if (!text || text.trim() === '') {
        console.warn('Empty request body received for analytics tracking');
        return NextResponse.json(
          { success: false, error: 'Empty request body' },
          { status: 400 }
        );
      }
      
      body = JSON.parse(text);
    } catch (jsonError) {
      console.error('JSON parsing error:', {
        error: jsonError,
        userAgent: request.headers.get('user-agent'),
        origin: request.headers.get('origin'),
        contentLength: request.headers.get('content-length'),
        referer: request.headers.get('referer')
      });
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { event, data } = body;

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event type is required' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Get client information for user activity tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const context = { ipAddress, userAgent, sessionId: data?.sessionId };
    
    switch (event) {
      case 'page_view':
        await handlePageView(data, today, context);
        break;
        
      case 'chart_generated':
        await handleChartGenerated(data, today, context);
        break;
        
      case 'discussion_viewed':
        await handleDiscussionViewed(data, today, context);
        break;
        
      case 'discussion_created':
        await handleDiscussionCreated(data, today, context);
        break;
        
      case 'reply_posted':
        await handleReplyPosted(data, today, context);
        break;
        
      case 'user_session':
        await handleUserSession(data, today, context);
        break;
        
      case 'user_login':
        await handleUserLogin(data, today, context);
        break;
        
      case 'user_logout':
        await handleUserLogout(data, today, context);
        break;
        
      case 'event_bookmarked':
        await handleEventBookmarked(data, today, context);
        break;
        
      case 'vote_cast':
        await handleVoteCast(data, today, context);
        break;
        
      case 'settings_changed':
        await handleSettingsChanged(data, today, context);
        break;
        
      case 'location_analytics':
        await handleLocationAnalytics(data, today, context);
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    // Don't fail the entire request if analytics tracking fails
    console.warn('Analytics tracking error (non-critical):', error);
    return NextResponse.json({ 
      success: true, 
      warning: 'Analytics tracking failed but request succeeded' 
    });
  }
}

async function handlePageView(data: any, date: string, context: any) {
  try {
    const { page, userId, sessionId, referrer } = data;
    
    // Increment page views
    await AnalyticsService.incrementDailyCounter('pageViews', date);
    
    // Track unique visitors if we have a session
    if (sessionId) {
      await AnalyticsService.incrementDailyCounter('visitors', date);
    }
    
    // Record top pages data
    const topPages = [
      { page: page || '/', views: 1, percentage: 100 }
    ];
    
    await AnalyticsService.recordTrafficData({
      date,
      topPages,
      trafficSources: referrer ? { [referrer]: 1 } : { direct: 1 }
    });

    // Record user activity if userId is provided
    if (userId) {
      await UserActivityService.recordActivity({
        userId,
        activityType: 'page_view',
        entityType: 'page',
        description: `Viewed page: ${page || '/'}`,
        metadata: { page, referrer },
        pageUrl: page,
        referrer,
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle page view analytics:', error);
  }
}

async function handleChartGenerated(data: any, date: string, context: any) {
  try {
    const { chartType, userId, chartId, title, theme } = data;
    
    // Increment chart generation counters
    await AnalyticsService.incrementDailyCounter('chartsGenerated', date);
    await AnalyticsService.incrementEngagementCounter('chartsGenerated', date);

    // Record user activity if userId is provided
    if (userId) {
      await UserActivityService.recordChartActivity(
        userId,
        chartId || 'unknown',
        'chart_generated',
        { chartType, theme, title },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle chart generation analytics:', error);
  }
}

async function handleDiscussionViewed(data: any, date: string, context: any) {
  try {
    const { discussionId, userId, title, category } = data;
    
    // This would normally update the discussion's view count
    // For now, we just track engagement
    await AnalyticsService.recordEngagementData({
      date,
      activeUsers: userId ? 1 : 0
    });

    // Record user activity if userId is provided
    if (userId && discussionId) {
      await UserActivityService.recordDiscussionActivity(
        userId,
        discussionId,
        'discussion_viewed',
        { title, category },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle discussion view analytics:', error);
  }
}

async function handleDiscussionCreated(data: any, date: string, context: any) {
  try {
    const { discussionId, userId, title, category } = data;
    
    await AnalyticsService.incrementEngagementCounter('discussionsCreated', date);
    
    // Record popular discussions
    const popularDiscussions = [
      { id: discussionId, title: title || 'New Discussion', engagement: 1 }
    ];
    
    await AnalyticsService.recordEngagementData({
      date,
      popularDiscussions
    });

    // Record user activity if userId is provided
    if (userId && discussionId) {
      await UserActivityService.recordDiscussionActivity(
        userId,
        discussionId,
        'discussion_created',
        { title, category },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle discussion creation analytics:', error);
  }
}

async function handleReplyPosted(data: any, date: string, context: any) {
  try {
    const { discussionId, userId, replyId, discussionTitle, parentReplyId } = data;
    
    await AnalyticsService.incrementEngagementCounter('repliesPosted', date);
    await AnalyticsService.incrementEngagementCounter('activeUsers', date);

    // Record user activity if userId is provided
    if (userId && replyId) {
      await UserActivityService.recordActivity({
        userId,
        activityType: 'reply_created',
        entityType: 'reply',
        entityId: replyId,
        description: `Posted a reply${discussionTitle ? ` in "${discussionTitle}"` : ''}`,
        metadata: { discussionId, discussionTitle, parentReplyId },
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle reply posted analytics:', error);
  }
}

async function handleUserSession(data: any, date: string, context: any) {
  try {
    const { userId, isNewUser, sessionDuration } = data;
    
    if (isNewUser) {
      await AnalyticsService.incrementDailyCounter('newUsers', date);
    } else {
      await AnalyticsService.incrementDailyCounter('returningUsers', date);
    }
    
    if (sessionDuration) {
      await AnalyticsService.recordTrafficData({
        date,
        avgSessionDuration: sessionDuration
      });
    }

    // Record user registration activity for new users
    if (userId && isNewUser) {
      await UserActivityService.recordUserActivity(
        userId,
        'user_registered',
        { authProvider: data.authProvider },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle user session analytics:', error);
  }
}

async function handleUserLogin(data: any, date: string, context: any) {
  try {
    const { userId, authProvider } = data;
    
    if (userId) {
      await UserActivityService.recordUserActivity(
        userId,
        'user_login',
        { authProvider },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle user login analytics:', error);
  }
}

async function handleUserLogout(data: any, date: string, context: any) {
  try {
    const { userId } = data;
    
    if (userId) {
      await UserActivityService.recordUserActivity(
        userId,
        'user_logout',
        {},
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle user logout analytics:', error);
  }
}

async function handleEventBookmarked(data: any, date: string, context: any) {
  try {
    const { userId, eventId, title, eventType, action } = data;
    
    if (userId && eventId) {
      const activityType = action === 'unbookmark' ? 'event_unbookmarked' : 'event_bookmarked';
      await UserActivityService.recordEventActivity(
        userId,
        eventId,
        activityType,
        { title, eventType },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle event bookmark analytics:', error);
  }
}

async function handleVoteCast(data: any, date: string, context: any) {
  try {
    const { userId, entityType, entityId, voteType, title } = data;
    
    if (userId && entityId) {
      const activityType = entityType === 'discussion' ? 'discussion_voted' : 'reply_voted';
      const description = `${voteType === 'up' ? 'Upvoted' : 'Downvoted'} a ${entityType}`;
      
      await UserActivityService.recordActivity({
        userId,
        activityType,
        entityType: entityType as any,
        entityId,
        description,
        metadata: { voteType, title },
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle vote cast analytics:', error);
  }
}

async function handleSettingsChanged(data: any, date: string, context: any) {
  try {
    const { userId, changes } = data;
    
    if (userId) {
      await UserActivityService.recordActivity({
        userId,
        activityType: 'settings_changed',
        entityType: 'settings',
        description: 'Updated profile settings',
        metadata: { changes },
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle settings change analytics:', error);
  }
}

async function handleLocationAnalytics(data: any, date: string, context: any) {
  try {
    const { type, source, coordinates, errorType, sessionId } = data;
    
    // Track location analytics event
    await AnalyticsService.incrementDailyCounter('locationRequests', date);
    
    // Track specific location event types
    if (type === 'permission_granted') {
      await AnalyticsService.incrementDailyCounter('locationPermissionsGranted', date);
    } else if (type === 'permission_denied') {
      await AnalyticsService.incrementDailyCounter('locationPermissionsDenied', date);
    } else if (type === 'fallback_used') {
      await AnalyticsService.incrementDailyCounter('locationFallbackUsed', date);
    } else if (type === 'location_error') {
      await AnalyticsService.incrementDailyCounter('locationErrors', date);
    }
    
    // For user activity tracking, we'd need a userId
    // Location analytics are typically anonymous, so we may not track individual user activity
    
  } catch (error) {
    console.warn('Failed to handle location analytics:', error);
  }
}