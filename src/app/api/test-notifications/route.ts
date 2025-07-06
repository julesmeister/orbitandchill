/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { 
  createDiscussionReplyNotification,
  createDiscussionLikeNotification,
  createDiscussionMentionNotification,
  createWelcomeNotification,
  createSystemAnnouncementNotification,
  createBatchedDiscussionLike,
  createBatchedChartLike,
  createBatchedDiscussionReply,
  testNotificationReliability,
  getNotificationSystemHealth,
  getSystemDiagnostics,
  createChartLikeNotification,
  createFollowNotification,
  createProfileViewNotification,
  createEventUpdateNotification,
  createSystemUpdateNotification,
  createSystemHealthNotification,
  createAnalyticsSuccessNotification,
  createAnalyticsFailureNotification,
  createCronSuccessNotification,
  createCronFailureNotification,
  createTrafficSpikeNotification,
  createDataAggregationNotification,
  createAccountSecurityNotification,
  createDataExportNotification,
  createModerationRequiredNotification,
  createUserReportNotification,
  createPremiumRenewalNotification,
  createPremiumTrialNotification,
  createEducationalContentNotification,
  createFeatureTourNotification
} from '@/utils/notificationHelpers';

/**
 * Test API endpoint for notification system
 * POST /api/test-notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, ...params } = body;

    if (!type || !userId) {
      return NextResponse.json(
        { error: 'type and userId are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'discussion_reply':
        const { authorName, discussionTitle, discussionId } = params;
        result = await createDiscussionReplyNotification(
          userId,
          authorName || 'Test User',
          discussionTitle || 'Test Discussion',
          discussionId || 'test-id'
        );
        break;

      case 'discussion_like':
        const { likerName, discussionTitle: title, discussionId: id } = params;
        result = await createDiscussionLikeNotification(
          userId,
          likerName || 'Test Liker',
          title || 'Test Discussion',
          id || 'test-id'
        );
        break;

      case 'discussion_mention':
        const { mentionerName, discussionTitle: mentionTitle, discussionId: mentionId } = params;
        result = await createDiscussionMentionNotification(
          userId,
          mentionerName || 'Test Mentioner',
          mentionTitle || 'Test Discussion',
          mentionId || 'test-id'
        );
        break;

      case 'welcome':
        const { username } = params;
        result = await createWelcomeNotification(
          userId,
          username || 'Test User',
          true
        );
        break;

      case 'system_announcement':
        const { title: announcementTitle, message } = params;
        result = await createSystemAnnouncementNotification(
          userId,
          announcementTitle || 'Test Announcement',
          message || 'This is a test system announcement'
        );
        break;

      case 'batch_discussion_like':
        const { likerName: bLikerName, discussionTitle: bTitle, discussionId: bId } = params;
        result = await createBatchedDiscussionLike(
          userId,
          bLikerName || 'Batch Test Liker',
          bTitle || 'Test Discussion for Batching',
          bId || 'batch-test-id'
        );
        break;

      case 'batch_chart_like':
        const { likerName: cLikerName, chartTitle: batchChartTitle, chartId: batchChartId } = params;
        result = await createBatchedChartLike(
          userId,
          cLikerName || 'Chart Batch Liker',
          batchChartTitle || 'Test Chart for Batching',
          batchChartId || 'chart-batch-test-id'
        );
        break;

      case 'batch_discussion_reply':
        const { replierName, discussionTitle: rTitle, discussionId: rId } = params;
        result = await createBatchedDiscussionReply(
          userId,
          replierName || 'Batch Replier',
          rTitle || 'Test Discussion for Reply Batching',
          rId || 'reply-batch-test-id'
        );
        break;

      case 'test_reliability':
        await testNotificationReliability(userId);
        result = { id: 'reliability_test_completed' };
        break;

      case 'health_check':
        const health = await getNotificationSystemHealth();
        return NextResponse.json({
          success: true,
          message: 'Health check completed',
          health
        });

      case 'system_diagnostics':
        const diagnostics = await getSystemDiagnostics();
        return NextResponse.json({
          success: true,
          message: 'System diagnostics retrieved',
          diagnostics
        });

      // New notification types
      case 'chart_like':
        const { likerName: chartLiker, chartTitle, chartId } = params;
        result = await createChartLikeNotification(
          userId,
          chartLiker || 'Chart Liker',
          chartTitle || 'Test Chart',
          chartId || 'chart-test-id'
        );
        break;

      case 'follow_new':
        const { followerName, followerId } = params;
        result = await createFollowNotification(
          userId,
          followerName || 'New Follower',
          followerId || 'follower-test-id'
        );
        break;

      case 'profile_view':
        const { viewerName, viewerId } = params;
        result = await createProfileViewNotification(
          userId,
          viewerName || 'Profile Viewer',
          viewerId || 'viewer-test-id'
        );
        break;

      case 'event_update':
        const { eventTitle: eTitle, updateType, eventId: eId } = params;
        result = await createEventUpdateNotification(
          userId,
          eTitle || 'Test Event',
          updateType || 'Time changed',
          eId || 'event-test-id'
        );
        break;

      case 'system_update':
        const { updateTitle, updateDescription, updateUrl } = params;
        result = await createSystemUpdateNotification(
          userId,
          updateTitle || 'New Feature',
          updateDescription || 'We have added a new feature to enhance your experience',
          updateUrl
        );
        break;

      case 'system_health':
        const { healthStatus, details } = params;
        result = await createSystemHealthNotification(
          userId,
          healthStatus || 'healthy',
          details || 'All systems operational'
        );
        break;

      case 'analytics_success':
        const { analyticsType, resultsUrl } = params;
        result = await createAnalyticsSuccessNotification(
          userId,
          analyticsType || 'User Activity',
          resultsUrl
        );
        break;

      case 'analytics_failure':
        const { analyticsType: failType, errorMessage } = params;
        result = await createAnalyticsFailureNotification(
          userId,
          failType || 'Traffic Analysis',
          errorMessage || 'Database connection timeout'
        );
        break;

      case 'cron_success':
        const { jobName, jobDetails } = params;
        result = await createCronSuccessNotification(
          userId,
          jobName || 'Daily Backup',
          jobDetails || 'Completed in 45 seconds'
        );
        break;

      case 'cron_failure':
        const { jobName: failJob, errorMessage: cronError } = params;
        result = await createCronFailureNotification(
          userId,
          failJob || 'Weekly Report',
          cronError || 'Unable to connect to email service'
        );
        break;

      case 'traffic_spike':
        const { trafficIncrease, currentLoad } = params;
        result = await createTrafficSpikeNotification(
          userId,
          trafficIncrease || '300%',
          currentLoad || '85% CPU usage'
        );
        break;

      case 'data_aggregation':
        const { dataType, recordsProcessed, resultsUrl: aggUrl } = params;
        result = await createDataAggregationNotification(
          userId,
          dataType || 'User Activity',
          recordsProcessed || 15420,
          aggUrl
        );
        break;

      case 'account_security':
        const { securityEvent, details: secDetails, actionRequired } = params;
        result = await createAccountSecurityNotification(
          userId,
          securityEvent || 'New login from unknown device',
          secDetails || 'Location: San Francisco, CA',
          actionRequired || false
        );
        break;

      case 'data_export':
        const { exportType, downloadUrl, expiresAt } = params;
        result = await createDataExportNotification(
          userId,
          exportType || 'User Data',
          downloadUrl || '/downloads/user-data-export.zip',
          expiresAt ? new Date(expiresAt) : undefined
        );
        break;

      case 'moderation_required':
        const { contentType: modContentType, contentId: modContentId, reason, reporterName } = params;
        result = await createModerationRequiredNotification(
          userId,
          modContentType || 'Discussion',
          modContentId || 'discussion-123',
          reason || 'Inappropriate content',
          reporterName
        );
        break;

      case 'user_report':
        const { reportedUserId, reportedUsername, reportReason, reporterName: reporter } = params;
        result = await createUserReportNotification(
          userId,
          reportedUserId || 'user-456',
          reportedUsername || 'TestUser',
          reportReason || 'Spam behavior',
          reporter
        );
        break;

      case 'premium_renewal':
        const { tier, renewalDate } = params;
        result = await createPremiumRenewalNotification(
          userId,
          tier || 'Pro',
          renewalDate || '2024-12-31'
        );
        break;

      case 'premium_trial':
        const { trialStatus, daysLeft, tier: trialTier } = params;
        result = await createPremiumTrialNotification(
          userId,
          trialStatus || 'started',
          daysLeft || 7,
          trialTier || 'Pro'
        );
        break;

      case 'educational_content':
        const { contentTitle, contentType, contentUrl, description } = params;
        result = await createEducationalContentNotification(
          userId,
          contentTitle || 'Understanding Mercury Retrograde',
          contentType || 'Guide',
          contentUrl || '/guides/mercury-retrograde',
          description
        );
        break;

      case 'feature_tour':
        const { featureName, tourUrl, description: tourDesc } = params;
        result = await createFeatureTourNotification(
          userId,
          featureName || 'Advanced Chart Analysis',
          tourUrl || '/tour/chart-analysis',
          tourDesc
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: `${type} notification created successfully`,
        notificationId: result.id
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get notification test instructions
 * GET /api/test-notifications
 */
export async function GET() {
  return NextResponse.json({
    message: 'Notification Test API',
    usage: {
      endpoint: 'POST /api/test-notifications',
      examples: [
        {
          type: 'discussion_reply',
          userId: 'user-id',
          authorName: 'John Doe',
          discussionTitle: 'Understanding Mars Retrograde',
          discussionId: 'discussion-123'
        },
        {
          type: 'discussion_like',
          userId: 'user-id',
          likerName: 'Jane Smith',
          discussionTitle: 'Moon Phases Explained',
          discussionId: 'discussion-456'
        },
        {
          type: 'discussion_mention',
          userId: 'user-id',
          mentionerName: 'Alex Johnson',
          discussionTitle: 'Saturn Return Experience',
          discussionId: 'discussion-789'
        },
        {
          type: 'welcome',
          userId: 'user-id',
          username: 'NewUser123'
        },
        {
          type: 'system_announcement',
          userId: 'user-id',
          title: 'New Feature Available',
          message: 'We have added new astrological insights to your dashboard'
        },
        {
          type: 'batch_discussion_like',
          userId: 'user-id',
          likerName: 'Batch Test User',
          discussionTitle: 'Understanding Mercury Retrograde',
          discussionId: 'batch-test-123'
        },
        {
          type: 'batch_chart_like',
          userId: 'user-id',
          likerName: 'Chart Enthusiast',
          chartTitle: 'My Natal Chart Analysis',
          chartId: 'chart-batch-456'
        },
        {
          type: 'batch_discussion_reply',
          userId: 'user-id',
          replierName: 'Active Commenter',
          discussionTitle: 'Saturn Return Experiences',
          discussionId: 'reply-batch-789'
        },
        {
          type: 'test_reliability',
          userId: 'user-id'
        },
        {
          type: 'health_check',
          userId: 'user-id'
        },
        {
          type: 'system_diagnostics',
          userId: 'user-id'
        }
      ]
    },
    notificationTypes: [
      // Social notifications
      'discussion_reply',
      'discussion_like', 
      'discussion_mention',
      'chart_like',
      'follow_new',
      'profile_view',
      // Event notifications
      'event_update',
      // System notifications
      'welcome',
      'system_announcement',
      'system_update',
      'system_health',
      'analytics_success',
      'analytics_failure',
      'cron_success',
      'cron_failure',
      'traffic_spike',
      'data_aggregation',
      'account_security',
      'data_export',
      // Admin notifications
      'moderation_required',
      'user_report',
      // Premium notifications
      'premium_renewal',
      'premium_trial',
      // Content notifications
      'educational_content',
      'feature_tour',
      // Batch notifications
      'batch_discussion_like',
      'batch_chart_like',
      'batch_discussion_reply',
      // System utilities
      'test_reliability',
      'health_check',
      'system_diagnostics'
    ]
  });
}