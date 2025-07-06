# Notifications System Documentation

## Overview
The Orbit & Chill application features a comprehensive notification system that keeps users informed about interactions, system updates, and important events. This document outlines the notification architecture, types, and implementation details.

## Notification Types Tree Map

```
📱 NOTIFICATION SYSTEM
├── 🗣️ SOCIAL NOTIFICATIONS
│   ├── Discussion Interactions
│   │   ├── ✅ discussion_reply (💬) - Someone replied to your discussion
│   │   ├── ✅ discussion_like (👍) - Someone liked your discussion (with batching)
│   │   └── ✅ discussion_mention (@) - Someone mentioned you in a discussion
│   ├── Chart Interactions
│   │   ├── ✅ chart_shared (⭐) - Someone shared a chart with you
│   │   ├── ✅ chart_comment (💭) - Someone commented on your chart
│   │   └── ✅ chart_like (❤️) - Someone liked your chart (with batching)
│   └── User Interactions
│   │   ├── ✅ follow_new (👤) - Someone started following you
│   │   └── ✅ profile_view (👁️) - Someone viewed your profile (with batching)
│
├── 📅 EVENT NOTIFICATIONS
│   ├── ✅ event_reminder (📅) - Upcoming astrological event reminder
│   ├── ✅ event_bookmark (🔖) - Event you bookmarked is happening soon
│   └── ✅ event_update (🔄) - Changes to events you're following
│
├── 🔧 SYSTEM NOTIFICATIONS
│   ├── Announcements
│   │   ├── ✅ system_announcement (📢) - Important system announcements
│   │   ├── ✅ system_maintenance (🔧) - Scheduled maintenance notifications
│   │   └── ✅ system_update (🆙) - New feature announcements
│   ├── Health & Performance
│   │   ├── ✅ system_health (💚) - System health status updates
│   │   ├── ✅ analytics_success (📊) - Analytics processing completed
│   │   ├── ✅ analytics_failure (📉) - Analytics processing failed
│   │   ├── ✅ cron_success (⏰) - Scheduled job completed successfully
│   │   ├── ✅ cron_failure (🚨) - Scheduled job failed
│   │   ├── ✅ traffic_spike (📈) - Unusual traffic detected
│   │   └── ✅ data_aggregation (📈) - Data aggregation completed
│   └── User Account
│   │   ├── ✅ welcome (👋) - Welcome message for new users
│   │   ├── ✅ account_security (🔒) - Security-related notifications
│   │   └── ✅ data_export (📥) - Data export ready for download
│
├── 👨‍💼 ADMIN NOTIFICATIONS
│   ├── ✅ admin_message (👨‍💼) - Important admin messages
│   ├── ✅ admin_warning (⚠️) - Admin warnings or violations
│   ├── ✅ moderation_required (🚨) - Content requiring moderation
│   └── ✅ user_report (🚨) - User reports requiring attention
│
├── ⭐ PREMIUM NOTIFICATIONS
│   ├── ✅ premium_upgrade (⭐) - Premium feature unlocked
│   ├── ✅ premium_expiry (⏰) - Premium subscription expiring
│   ├── ✅ premium_renewal (✨) - Premium subscription renewed
│   └── ✅ premium_trial (🎆) - Premium trial started/ending
│
└── 📰 CONTENT NOTIFICATIONS
    ├── ✅ newsletter (📰) - Newsletter and updates
    ├── ✅ educational_content (📚) - New learning resources available
    └── ✅ feature_tour (🎆) - Guided tours for new features

🛡️ RELIABILITY FEATURES (All ✅ Implemented)
├── ✅ Delivery Guarantees & Retry Mechanism
├── ✅ Database-Level Deduplication  
├── ✅ Rate Limiting & Abuse Prevention
├── ✅ Comprehensive Health Monitoring
├── ✅ Real-time Updates (SSE)
├── ✅ Batch Notifications
├── ✅ Archive & History System
└── ✅ Performance Tracking & Alerting

🧪 TESTING & VALIDATION (All ✅ Available)
├── ✅ Test API Endpoints for all notification types
├── ✅ Reliability testing with rate limiting & deduplication
├── ✅ Health monitoring with real-time metrics
└── ✅ System diagnostics and emergency controls
```

## Notification Priority Levels

| Priority | Description | Use Cases | UI Treatment |
|----------|-------------|-----------|--------------|
| **🚨 Urgent** | Immediate attention required | Security alerts, system failures | Red badge, push notification |
| **🟠 High** | Important but not critical | Admin messages, premium expiry | Orange badge, in-app notification |
| **🟡 Medium** | Standard notifications | Discussion replies, chart likes | Yellow badge, standard notification |
| **🔵 Low** | Informational updates | System health, newsletters | Gray badge, quiet notification |

## Notification Categories

### 📱 Social (Category: 'social')
- **Purpose**: User-to-user interactions and community engagement
- **Delivery**: In-app + optional email
- **Examples**: Discussion replies, chart shares, mentions

### 📅 Reminder (Category: 'reminder') 
- **Purpose**: Time-sensitive events and scheduled activities
- **Delivery**: In-app + push + optional email
- **Examples**: Astrological event reminders, chart analysis deadlines

### 🔧 System (Category: 'system')
- **Purpose**: Platform updates, maintenance, and health status
- **Delivery**: In-app + optional email for critical updates
- **Examples**: Maintenance notices, feature updates, system health

### 👨‍💼 Admin (Category: 'admin')
- **Purpose**: Administrative communications and moderation
- **Delivery**: In-app + email for important messages
- **Examples**: Policy updates, account warnings, moderation actions

### ⭐ Premium (Category: 'premium')
- **Purpose**: Premium feature communications and billing
- **Delivery**: In-app + email + push for billing
- **Examples**: Subscription updates, premium feature announcements

### 🏆 Achievement (Category: 'achievement')
- **Purpose**: User accomplishments and milestones
- **Delivery**: In-app + optional email
- **Examples**: Chart creation milestones, community engagement rewards

## Implementation Architecture

### Database Schema
```sql
-- Notifications table
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT,
  priority TEXT DEFAULT 'medium',
  category TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  entity_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP,
  delivery_method TEXT DEFAULT 'in_app',
  delivered_at TIMESTAMP,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  expires_at TIMESTAMP,
  data TEXT, -- JSON data
  tags TEXT, -- Comma-separated tags
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User notification preferences
CREATE TABLE notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  enable_in_app BOOLEAN DEFAULT TRUE,
  enable_email BOOLEAN DEFAULT TRUE,
  enable_push BOOLEAN DEFAULT FALSE,
  enable_sms BOOLEAN DEFAULT FALSE,
  quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TEXT DEFAULT '22:00',
  quiet_hours_end TEXT DEFAULT '08:00',
  timezone TEXT DEFAULT 'UTC',
  social_notifications BOOLEAN DEFAULT TRUE,
  system_notifications BOOLEAN DEFAULT TRUE,
  admin_notifications BOOLEAN DEFAULT TRUE,
  premium_notifications BOOLEAN DEFAULT TRUE,
  reminder_notifications BOOLEAN DEFAULT TRUE,
  achievement_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### API Endpoints

#### Notification Management
- `GET /api/notifications` - Get user notifications with filtering
- `POST /api/notifications` - Create new notification
- `PATCH /api/notifications/[id]` - Mark as read/archive notification
- `DELETE /api/notifications/[id]` - Delete notification
- `POST /api/notifications/mark-all-read` - Mark all notifications as read
- `GET /api/notifications/summary` - Get notification summary and counts

#### Preferences Management
- `GET /api/notifications/preferences` - Get user notification preferences
- `POST /api/notifications/preferences` - Update notification preferences

### Frontend Components

#### NotificationBell Component
**Location**: `/src/components/navbar/NotificationBell.tsx`
- Displays notification count badge
- Dropdown panel with unread/all tabs
- Real-time notification list
- Mark as read functionality
- Navigation to full notifications page

#### useNotifications Hook
**Location**: `/src/hooks/useNotifications.ts`
- State management for notifications
- API integration for CRUD operations
- Real-time updates and caching
- Computed values (unread count, summary)

## Notification Triggers

### Discussion System Triggers
```typescript
// When someone replies to a discussion
await NotificationService.createNotification({
  userId: discussionAuthorId,
  type: 'discussion_reply',
  title: 'New Reply',
  message: `${authorName} replied to your discussion "${discussionTitle}"`,
  entityType: 'discussion',
  entityId: discussionId,
  entityUrl: `/discussions/${discussionSlug}`,
  category: 'social',
  priority: 'medium'
});

// When someone mentions a user (@username)
await NotificationService.createNotification({
  userId: mentionedUserId,
  type: 'discussion_mention',
  title: 'You were mentioned',
  message: `${authorName} mentioned you in "${discussionTitle}"`,
  entityType: 'discussion',
  entityId: discussionId,
  entityUrl: `/discussions/${discussionSlug}`,
  category: 'social',
  priority: 'high'
});
```

### Chart System Triggers
```typescript
// When someone shares a chart
await NotificationService.createNotification({
  userId: recipientUserId,
  type: 'chart_shared',
  title: 'Chart Shared',
  message: `${sharerName} shared a natal chart with you`,
  entityType: 'chart',
  entityId: chartId,
  entityUrl: `/charts/${chartId}`,
  category: 'social',
  priority: 'medium'
});
```

### Event System Triggers
```typescript
// Astrological event reminders
await NotificationService.createNotification({
  userId: userId,
  type: 'event_reminder',
  title: 'Upcoming Astrological Event',
  message: `${eventName} is happening in ${timeUntilEvent}`,
  entityType: 'event',
  entityId: eventId,
  entityUrl: `/events/${eventId}`,
  category: 'reminder',
  priority: 'medium',
  scheduledFor: reminderTime
});
```

## Best Practices

### 1. Notification Timing
- **Immediate**: Security alerts, urgent admin messages
- **Batched**: Social interactions (max 1 per hour per user)
- **Scheduled**: Event reminders, maintenance notices
- **Quiet Hours**: Respect user timezone and quiet hour preferences

### 2. Content Guidelines
- **Titles**: Keep under 50 characters, actionable
- **Messages**: Clear, concise, include sender name and context
- **URLs**: Always provide direct links to related content
- **Icons**: Use consistent emoji/icons for each notification type

### 3. User Experience
- **Grouping**: Group similar notifications (e.g., "3 new replies")
- **Actions**: Allow marking as read, archiving, and quick actions
- **Persistence**: Keep important notifications until explicitly dismissed
- **Mobile**: Optimize for mobile notification panels

### 4. Performance
- **Batching**: Batch database writes for high-volume notifications
- **Caching**: Cache notification counts and summaries
- **Cleanup**: Automatically archive old notifications (90+ days)
- **Rate Limiting**: Prevent notification spam

## Future Enhancements

### 🔮 Planned Features
- **Real-time Updates**: WebSocket integration for instant notifications
- **Push Notifications**: Browser and mobile push notification support
- **Email Templates**: Rich HTML email templates for different notification types
- **Smart Grouping**: AI-powered notification grouping and summarization
- **Notification Channels**: Custom notification channels for different topics
- **Do Not Disturb**: Advanced quiet hours with context-aware exceptions

### 🎯 Advanced Features
- **Notification Analytics**: Track open rates, click-through rates, user engagement
- **A/B Testing**: Test different notification styles and timing
- **Personalization**: ML-powered notification personalization based on user behavior
- **Cross-Platform Sync**: Sync notification state across devices
- **Smart Scheduling**: Optimal timing based on user activity patterns

## Monitoring & Analytics

### Key Metrics
- **Delivery Rate**: Percentage of notifications successfully delivered
- **Open Rate**: Percentage of notifications opened/read
- **Click-through Rate**: Percentage leading to entity page visits
- **Unsubscribe Rate**: Users disabling notification types
- **Response Time**: Time from trigger to delivery

### Health Checks
- **Queue Monitoring**: Notification processing queue health
- **Delivery Failures**: Track and retry failed deliveries
- **User Preferences**: Monitor preference changes and trends
- **System Load**: Notification system performance impact

## Security & Privacy

### Data Protection
- **Personal Data**: Minimize personal data in notification content
- **Encryption**: Encrypt sensitive notification data at rest
- **Retention**: Automatic cleanup of old notification data
- **Audit Trail**: Log notification creation and delivery events

### User Control
- **Granular Control**: Fine-grained notification type preferences
- **Easy Unsubscribe**: One-click disable for notification types
- **Privacy Respect**: Honor user privacy settings and quiet hours
- **Data Export**: Include notifications in user data exports

---

*This documentation is maintained as part of the Orbit & Chill notification system. For technical implementation details, see the source code in `/src/components/navbar/NotificationBell.tsx` and `/src/db/services/notificationService.ts`.*