# Notification System Testing Guide

## Overview
This guide explains how to test the newly implemented notification system for discussions and user interactions in Orbit & Chill.

## ✅ What's Implemented

### Discussion Notifications
- **Reply Notifications**: When someone replies to your discussion
- **Comment Reply Notifications**: When someone replies to your comment
- **Like Notifications**: When someone likes your discussion or comment
- **Nested Reply Support**: Notifications for threaded conversations

### System Infrastructure
- **Notification Bell**: UI component in navbar showing notification count
- **Notification API**: Full CRUD operations for notifications
- **Notification Service**: Database layer for notification management
- **Helper Functions**: Utility functions for creating common notification types

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

### 4. UI Testing
1. **Notification Bell**: Should show red badge with count when unread notifications exist
2. **Dropdown Panel**: Should show notifications with proper icons and timestamps
3. **Mark as Read**: Should remove unread indicator when clicked
4. **Navigation**: Should navigate to correct discussion when notification is clicked

## 🎯 Expected Behavior

### Notification Creation Rules
- ✅ **No Self-Notifications**: Users don't get notified of their own actions
- ✅ **No Duplicate Notifications**: Discussion author doesn't get notified twice if they're also the parent comment author
- ✅ **Async Processing**: Notifications are created asynchronously to not block API responses
- ✅ **Error Handling**: Failed notifications don't break the main functionality

### Notification Types & Priorities
- **Reply Notifications**: `medium` priority, 30-day expiry
- **Like Notifications**: `low` priority, 7-day expiry  
- **Welcome Notifications**: `medium` priority, no expiry
- **System Announcements**: `medium` priority, 30-day expiry

### UI Behavior
- **Unread Count**: Shows in red badge on notification bell
- **Real-time Updates**: Currently requires page refresh (WebSocket support planned)
- **Mobile Responsive**: Notification panel adapts to mobile screens
- **Keyboard Accessible**: Can be navigated with keyboard

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
- ❌ `Failed to create reply notification`

## 🚀 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for instant updates
- **Email Notifications**: HTML email templates for important notifications
- **Push Notifications**: Browser and mobile push notification support
- **Mention Notifications**: @username mention detection and notifications
- **Notification Preferences**: User settings for notification types and frequency
- **Batch Notifications**: Group similar notifications (e.g., "3 people liked your post")

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