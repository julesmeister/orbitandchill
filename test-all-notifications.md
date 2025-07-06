# Test All Notification Types

## Quick Test Commands

Test all notification types to verify they're working:

```bash
# Social Notifications
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "chart_like", "userId": "test-user", "likerName": "John", "chartTitle": "My Chart", "chartId": "chart-123"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "follow_new", "userId": "test-user", "followerName": "Jane", "followerId": "user-456"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "profile_view", "userId": "test-user", "viewerName": "Alex", "viewerId": "user-789"}'

# Event Notifications
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "event_update", "userId": "test-user", "eventTitle": "Full Moon", "updateType": "Time changed", "eventId": "event-123"}'

# System Notifications
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "system_update", "userId": "test-user", "updateTitle": "New Chart Features", "updateDescription": "Added transit analysis", "updateUrl": "/features"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "system_health", "userId": "test-user", "healthStatus": "healthy", "details": "All systems operational"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "analytics_success", "userId": "test-user", "analyticsType": "Traffic Analysis", "resultsUrl": "/analytics"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "cron_success", "userId": "test-user", "jobName": "Daily Backup", "jobDetails": "Completed in 30s"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "traffic_spike", "userId": "test-user", "trafficIncrease": "200%", "currentLoad": "75% CPU"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "account_security", "userId": "test-user", "securityEvent": "New login", "details": "From unknown device", "actionRequired": true}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "data_export", "userId": "test-user", "exportType": "User Data", "downloadUrl": "/downloads/export.zip"}'

# Admin Notifications
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "moderation_required", "userId": "test-user", "contentType": "Discussion", "contentId": "disc-123", "reason": "Inappropriate content"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "user_report", "userId": "test-user", "reportedUserId": "user-bad", "reportedUsername": "BadUser", "reportReason": "Spam"}'

# Premium Notifications
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "premium_renewal", "userId": "test-user", "tier": "Pro", "renewalDate": "2024-12-31"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "premium_trial", "userId": "test-user", "trialStatus": "ending", "daysLeft": 3, "tier": "Pro"}'

# Content Notifications
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "educational_content", "userId": "test-user", "contentTitle": "Understanding Aspects", "contentType": "Guide", "contentUrl": "/guides/aspects"}'

curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "feature_tour", "userId": "test-user", "featureName": "Chart Comparison", "tourUrl": "/tour/comparison"}'
```

## Verification

After running the tests, check:

1. **Notification Count**: Check if notifications appear in the navbar bell
2. **Deduplication**: Run the same command multiple times - should prevent duplicates
3. **Rate Limiting**: Run many commands quickly - should trigger rate limiting
4. **Health Monitoring**: Check system health shows performance metrics

```bash
# Check system health
curl http://localhost:3000/api/notifications/health?detailed=true

# Get notification count
curl "http://localhost:3000/api/notifications/summary?userId=test-user"
```

## Expected Results

✅ **All notification types should create successfully**
✅ **Rate limiting should kick in after ~10-20 rapid requests**
✅ **Duplicate prevention should work for similar notifications**
✅ **Health monitoring should track all the activity**
✅ **Batch notifications should group similar events**

## Status: ALL FUNCTIONAL ✅

Every notification type in the tree map is now fully implemented with:
- ✅ Enhanced reliability (retry mechanism)
- ✅ Deduplication prevention
- ✅ Rate limiting protection
- ✅ Health monitoring
- ✅ Batch processing (where appropriate)
- ✅ Test API endpoints