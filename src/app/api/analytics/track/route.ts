/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { UserActivityService } from '@/db/services/userActivityService';

export async function POST(request: NextRequest) {
  try {
    // PERFORMANCE: Return success immediately and process analytics in background
    // This prevents analytics from blocking the main request flow
    
    // Spawn background task (non-blocking)
    process.nextTick(async () => {
      try {
        // Check if request has a body
        const contentLength = request.headers.get('content-length');
        if (!contentLength || contentLength === '0') {
          console.warn('Analytics: Empty request body');
          return;
        }

        let body;
        try {
          const text = await request.text();
          if (!text || text.trim() === '') {
            console.warn('Analytics: Empty request text');
            return;
          }
          body = JSON.parse(text);
        } catch (jsonError) {
          console.warn('Analytics: JSON parsing error', jsonError);
          return;
        }

        const { event, data } = body;
        if (!event) {
          console.warn('Analytics: Missing event type');
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        
        // Get client information for user activity tracking
        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const context = { ipAddress, userAgent, sessionId: data?.sessionId };
        
        // Add timeout to prevent analytics from consuming connection pool
        const analyticsTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analytics timeout')), 3000)
        );
        
        const analyticsWork = async () => {
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
              
            case 'session_end':
              await handleSessionEnd(data, today, context);
              break;
              
            case 'custom_event':
              await handleCustomEvent(data, today, context);
              break;
              
            case 'discussion_interaction':
              await handleDiscussionInteraction(data, today, context);
              break;
              
            case 'horary_question_submitted':
              await handleHoraryQuestion(data, today, context);
              break;
              
            default:
              console.warn('Analytics: Unknown event type:', event);
          }
        };
        
        // Run analytics with timeout protection
        await Promise.race([analyticsWork(), analyticsTimeout]).catch(err => {
          console.warn('Analytics processing failed (non-critical):', err.message);
        });
      } catch (error) {
        console.warn('Analytics background task error:', error);
      }
    });
    
    // Return success immediately without waiting for analytics
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
    
    // Track unique visitors using IP address and user agent
    const { ipAddress, userAgent } = context;
    if (ipAddress && userAgent) {
      await AnalyticsService.trackUniqueVisitor(ipAddress, userAgent, date);
    }
    
    // Categorize traffic source based on referrer
    const trafficSource = categorizeTrafficSource(referrer || '');
    
    // Record top pages data
    const topPages = [
      { page: page || '/', views: 1, percentage: 100 }
    ];
    
    await AnalyticsService.recordTrafficData({
      date,
      topPages,
      trafficSources: { [trafficSource]: 1 }
    });

    // Record user activity (for both authenticated and anonymous users)
    await UserActivityService.recordActivity({
      userId: userId || null, // Use null for anonymous users (now supported by database)
      activityType: 'page_view',
      entityType: 'page',
      description: `Viewed page: ${page || '/'}`,
      metadata: { page, referrer, trafficSource },
      pageUrl: page,
      referrer,
      ...context
    });
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

    // Record user activity (for both authenticated and anonymous users)
    await UserActivityService.recordChartActivity(
      userId || 'anonymous',
      chartId || 'unknown',
      'chart_generated',
      { chartType, theme, title },
      context
    );
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

async function handleSessionEnd(data: any, date: string, context: any) {
  try {
    const { sessionId, duration, pages, userId } = data;
    
    // Track session metrics
    if (duration && duration > 0) {
      await AnalyticsService.recordTrafficData({
        date,
        avgSessionDuration: duration
      });
    }
    
    // Track engagement if we have page count
    if (pages && pages > 0) {
      await AnalyticsService.recordEngagementData({
        date
      } as any);
    }

    // Record user activity if userId is provided
    if (userId && sessionId) {
      await UserActivityService.recordActivity({
        userId,
        activityType: 'session_ended',
        entityType: 'session',
        description: `Session ended after ${Math.round(duration / 1000)}s`,
        metadata: { sessionId, duration, pages },
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle session end analytics:', error);
  }
}

async function handleDiscussionInteraction(data: any, date: string, context: any) {
  try {
    const { action, discussionId, userId, title } = data;
    
    // Track different types of discussion interactions
    switch (action) {
      case 'view':
        await AnalyticsService.recordEngagementData({
          date,
          activeUsers: userId ? 1 : 0
        });
        break;
        
      case 'reply':
        await AnalyticsService.incrementEngagementCounter('repliesPosted', date);
        break;
        
      case 'vote_up':
      case 'vote_down':
        await AnalyticsService.incrementEngagementCounter('activeUsers', date);
        break;
    }

    // Record user activity if userId is provided
    if (userId && discussionId) {
      // Map action to proper activity type
      let activityType: 'discussion_created' | 'discussion_viewed' | 'discussion_replied' | 'discussion_voted';
      
      switch (action) {
        case 'view':
          activityType = 'discussion_viewed';
          break;
        case 'create':
          activityType = 'discussion_created';
          break;
        case 'reply':
          activityType = 'discussion_replied';
          break;
        case 'vote_up':
        case 'vote_down':
          activityType = 'discussion_voted';
          break;
        default:
          console.warn(`Unknown discussion action: ${action}`);
          return; // Skip recording if action is unknown
      }
      
      await UserActivityService.recordDiscussionActivity(
        userId,
        discussionId,
        activityType,
        { title },
        context
      );
    }
  } catch (error) {
    console.warn('Failed to handle discussion interaction analytics:', error);
  }
}

async function handleHoraryQuestion(data: any, date: string, context: any) {
  try {
    const { userId, source } = data;
    
    // Track horary question submissions
    await AnalyticsService.incrementEngagementCounter('activeUsers', date);
    await AnalyticsService.incrementEngagementCounter('activeUsers', date);

    // Record user activity if userId is provided
    if (userId) {
      await UserActivityService.recordActivity({
        userId,
        activityType: 'horary_question_submitted',
        entityType: 'horary',
        description: 'Submitted a horary question',
        metadata: { source: source || 'horary_oracle' },
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle horary question analytics:', error);
  }
}

async function handleCustomEvent(data: any, date: string, context: any) {
  try {
    const { eventName, eventData, userId } = data;
    
    // Generic handler for custom events
    await AnalyticsService.incrementDailyCounter('visitors', date);

    // Record user activity if userId is provided
    if (userId && eventName) {
      await UserActivityService.recordActivity({
        userId,
        activityType: 'custom_event',
        entityType: 'event',
        description: `Custom event: ${eventName}`,
        metadata: { eventName, ...eventData },
        ...context
      });
    }
  } catch (error) {
    console.warn('Failed to handle custom event analytics:', error);
  }
}

// Helper function to categorize traffic sources based on referrer
function categorizeTrafficSource(referrer: string): string {
  if (!referrer || referrer === 'direct') {
    return 'Direct';
  }
  
  const url = referrer.toLowerCase();
  
  // Search engines
  if (url.includes('google.com') || url.includes('google.')) {
    return 'Google';
  }
  if (url.includes('bing.com') || url.includes('bing.')) {
    return 'Bing';
  }
  if (url.includes('yahoo.com') || url.includes('yahoo.')) {
    return 'Yahoo';
  }
  if (url.includes('duckduckgo.com')) {
    return 'DuckDuckGo';
  }
  if (url.includes('baidu.com')) {
    return 'Baidu';
  }
  
  // Social media
  if (url.includes('facebook.com') || url.includes('fb.com')) {
    return 'Facebook';
  }
  if (url.includes('twitter.com') || url.includes('t.co')) {
    return 'Twitter';
  }
  if (url.includes('instagram.com')) {
    return 'Instagram';
  }
  if (url.includes('linkedin.com')) {
    return 'LinkedIn';
  }
  if (url.includes('reddit.com')) {
    return 'Reddit';
  }
  if (url.includes('pinterest.com')) {
    return 'Pinterest';
  }
  if (url.includes('tiktok.com')) {
    return 'TikTok';
  }
  if (url.includes('youtube.com')) {
    return 'YouTube';
  }
  
  // Email
  if (url.includes('mail.') || url.includes('gmail.') || url.includes('outlook.')) {
    return 'Email';
  }
  
  // Astrology communities
  if (url.includes('astro.com') || url.includes('astrodienst.com')) {
    return 'Astro.com';
  }
  if (url.includes('cafeastrology.com')) {
    return 'Cafe Astrology';
  }
  if (url.includes('astrotheme.com')) {
    return 'Astrotheme';
  }
  if (url.includes('astrolabe.com')) {
    return 'Astrolabe';
  }
  
  // News/Media
  if (url.includes('news.') || url.includes('bbc.') || url.includes('cnn.') || 
      url.includes('reuters.') || url.includes('ap.org')) {
    return 'News';
  }
  
  // Forums
  if (url.includes('forum') || url.includes('community') || url.includes('discussion')) {
    return 'Forums';
  }
  
  // Try to extract domain name for "Other" category
  try {
    const domain = new URL(referrer).hostname.replace('www.', '');
    return `Other: ${domain}`;
  } catch {
    return 'Other';
  }
}