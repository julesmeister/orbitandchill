# Notification System Testing Guide

## Overview
This guide explains how to test the newly implemented notification system for discussions and user interactions in Orbit & Chill.

## ✅ What's Implemented

### Discussion Notifications
- **Reply Notifications**: When someone replies to your discussion
- **Comment Reply Notifications**: When someone replies to your comment
- **Like Notifications**: When someone likes your discussion or comment
- **Mention Notifications**: When someone mentions you with @username in a discussion
- **Nested Reply Support**: Notifications for threaded conversations

### System Infrastructure
- **Notification Bell**: UI component in navbar showing notification count
- **Notification API**: Full CRUD operations for notifications
- **Notification Service**: Database layer for notification management
- **Helper Functions**: Utility functions for creating common notification types
- **Real-time Updates**: Server-Sent Events (SSE) for instant notification delivery
- **Connection Status**: Visual indicators for real-time connection health
- **Archive System**: Complete notification history and archive management
- **Bulk Operations**: Multi-select archive, restore, and delete operations

## 🔧 Testing APIs

### 1. Test Notification Creation
```bash
# Test discussion reply notification
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "discussion_reply",
    "userId": "your-user-id",
    "authorName": "John Doe",
    "discussionTitle": "Understanding Mars Retrograde",
    "discussionId": "discussion-123"
  }'

# Test discussion like notification  
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "discussion_like",
    "userId": "your-user-id", 
    "likerName": "Jane Smith",
    "discussionTitle": "Moon Phases Explained",
    "discussionId": "discussion-456"
  }'

# Test mention notification
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "discussion_mention",
    "userId": "your-user-id",
    "mentionerName": "Alex Johnson", 
    "discussionTitle": "Saturn Return Experience",
    "discussionId": "discussion-789"
  }'

# Test welcome notification
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "userId": "your-user-id",
    "username": "NewUser123"
  }'

# Test system announcement
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "system_announcement",
    "userId": "your-user-id",
    "title": "New Feature Available",
    "message": "We have added new astrological insights to your dashboard"
  }'
```

### 2. Check System Status
```bash
# Check if notification system is operational
curl http://localhost:3000/api/notifications-status

# Get user notification statistics
curl -X POST http://localhost:3000/api/notifications-status \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'

# Test real-time notification stream (SSE)
curl -N -H "Accept: text/event-stream" \
  "http://localhost:3000/api/notifications/stream?userId=your-user-id"
```

### 3. Notification Management
```bash
# Get user notifications
curl "http://localhost:3000/api/notifications?userId=your-user-id"

# Get unread notifications only
curl "http://localhost:3000/api/notifications?userId=your-user-id&isRead=false"

# Get notification summary
curl "http://localhost:3000/api/notifications/summary?userId=your-user-id"

# Mark notification as read
curl -X PATCH http://localhost:3000/api/notifications/notification-id \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "action": "mark_read"}'

# Mark all notifications as read
curl -X POST http://localhost:3000/api/notifications/mark-all-read \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'

# Archive a notification
curl -X PATCH http://localhost:3000/api/notifications/notification-id \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "action": "archive"}'

# Restore notification from archive
curl -X PATCH http://localhost:3000/api/notifications/notification-id \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "action": "unarchive"}'
```

### 4. Archive Management
```bash
# Get archived notifications
curl "http://localhost:3000/api/notifications/archive?userId=your-user-id"

# Get archived notifications with filters
curl "http://localhost:3000/api/notifications/archive?userId=your-user-id&category=social&priority=high&search=mars"

# Archive multiple notifications
curl -X POST http://localhost:3000/api/notifications/archive \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id",
    "notificationIds": ["notif-1", "notif-2", "notif-3"]
  }'

# Clear archive (delete old archived notifications)
curl -X DELETE http://localhost:3000/api/notifications/archive \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id",
    "olderThanDays": 90
  }'
```

## 🧪 Manual Testing Flow

### 1. Discussion Reply Testing
1. Create a discussion with User A
2. Reply to the discussion with User B
3. Check User A's notifications (should see reply notification)
4. Click notification bell in navbar to see the notification
5. Click on notification to navigate to discussion

### 2. Comment Reply Testing  
1. User A creates a discussion
2. User B comments on the discussion
3. User C replies to User B's comment
4. Check User B's notifications (should see reply notification)
5. User A should also see User B's original comment notification

### 3. Like Testing
1. User A creates a discussion
2. User B likes the discussion
3. Check User A's notifications (should see like notification)
4. User A comments on their own discussion
5. User C likes User A's comment
6. Check User A's notifications (should see comment like notification)

### 4. Mention Testing
1. User A creates a discussion
2. User B writes a reply with "@UserC what do you think about this?"
3. Check User C's notifications (should see mention notification)
4. User C should receive high-priority notification with @ icon
5. Test multiple mentions in one reply: "@UserA @UserB great discussion!"

### 5. Real-time Testing
1. Open two browser windows/tabs with different users
2. Create a discussion with User A
3. In User B's window, reply to the discussion
4. User A should see notification appear instantly (without page refresh)
5. Check connection status indicator shows "Connected" with green dot
6. Test with poor connection: disable network briefly, reconnect

### 6. Archive Testing
1. Archive several notifications by clicking archive button
2. Check that notifications disappear from main list
3. Go to notification history/archive page
4. Verify archived notifications appear with archive timestamp
5. Test search and filtering in archive
6. Select multiple notifications and restore them
7. Verify restored notifications appear in main notification list
8. Test bulk archive operations
9. Test archive clearing with different time periods

### 7. UI Testing
1. **Notification Bell**: Should show red badge with count when unread notifications exist
2. **Dropdown Panel**: Should show notifications with proper icons and timestamps
3. **Mark as Read**: Should remove unread indicator when clicked
4. **Navigation**: Should navigate to correct discussion when notification is clicked
5. **Mention Display**: @mentions should be highlighted in discussion content
6. **Connection Status**: Should show real-time connection health indicator
7. **Archive Interface**: Archive history with search, filters, and bulk operations
8. **Statistics**: Archive stats showing counts by category and priority

## 🎯 Expected Behavior

### Notification Creation Rules
- ✅ **No Self-Notifications**: Users don't get notified of their own actions
- ✅ **No Duplicate Notifications**: Discussion author doesn't get notified twice if they're also the parent comment author
- ✅ **Async Processing**: Notifications are created asynchronously to not block API responses
- ✅ **Error Handling**: Failed notifications don't break the main functionality

### Notification Types & Priorities
- **Reply Notifications**: `medium` priority, 30-day expiry
- **Like Notifications**: `low` priority, 7-day expiry
- **Mention Notifications**: `high` priority, 14-day expiry
- **Welcome Notifications**: `medium` priority, no expiry
- **System Announcements**: `medium` priority, 30-day expiry

### UI Behavior
- **Unread Count**: Shows in red badge on notification bell
- **Real-time Updates**: Instant updates via Server-Sent Events (SSE)
- **Connection Status**: Visual indicator for real-time connection health
- **Mobile Responsive**: Notification panel adapts to mobile screens
- **Keyboard Accessible**: Can be navigated with keyboard
- **Auto-reconnection**: Automatic reconnection on connection loss

## 🔍 Debugging

### Common Issues
1. **Notifications Not Appearing**: Check browser console for API errors
2. **Wrong User IDs**: Ensure you're using actual user IDs from the database
3. **Database Errors**: Check server logs for database connection issues
4. **Missing Dependencies**: Ensure NotificationService is properly imported

### Debug Console Commands
```javascript
// In browser console - check current user
const user = JSON.parse(localStorage.getItem('user-store'));
console.log('Current user:', user?.state?.user);

// Check notification count
fetch('/api/notifications/summary?userId=' + user.state.user.id)
  .then(r => r.json())
  .then(console.log);

// Create test notification  
fetch('/api/test-notifications', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    type: 'welcome',
    userId: user.state.user.id,
    username: user.state.user.username
  })
}).then(r => r.json()).then(console.log);
```

### Log Monitoring
Check server logs for these messages:
- ✅ `Discussion reply notification created`
- ✅ `Discussion like notification created`
- ✅ `Parent reply notification created`
- ✅ `Mention notification created for user: [userId]`
- ❌ `Failed to create notifications`

## 🚀 Future Enhancements

### Planned Features
- **Enhanced Real-time Features**: WebSocket upgrade from SSE for bidirectional communication
- **Email Notifications**: HTML email templates for important notifications
- **Push Notifications**: Browser and mobile push notification support
- **Enhanced Mention Features**: Mention autocomplete in text editor, multiple mentions per message
- **Notification Preferences**: User settings for notification types and frequency
- **Batch Notifications**: Group similar notifications (e.g., "3 people liked your post")
- **Typing Indicators**: Show when users are typing in real-time

### Performance Optimizations
- **Notification Queuing**: Background job processing for high-volume notifications
- **Caching**: Redis caching for notification counts and recent notifications
- **Database Indexing**: Optimized database queries for notification retrieval
- **Rate Limiting**: Prevent notification spam

## 📊 Monitoring

### Key Metrics to Track
- **Notification Creation Rate**: How many notifications are created per hour
- **Delivery Success Rate**: Percentage of notifications successfully delivered
- **Read Rate**: Percentage of notifications that are read by users
- **Click-through Rate**: Percentage of notifications that lead to user actions
- **User Engagement**: How notifications affect user activity and retention

### Health Checks
The `/api/notifications-status` endpoint provides system health information:
- Notification service availability
- Database connectivity
- Recent error rates
- Feature status

---

*This notification system provides the foundation for keeping users engaged with real-time updates about community interactions. Test thoroughly and monitor user feedback for continuous improvement.*