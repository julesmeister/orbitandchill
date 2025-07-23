# Database Documentation

## 🚀 Quick Status
- **Database**: Turso (SQLite) - Production Ready
- **ORM**: Drizzle with raw SQL workarounds for Turso HTTP client
- **Migration Status**: ✅ All migrations applied via `scripts/apply-migrations.js`
- **Services**: 11 services with shared resilience patterns

## 📋 Database Schema Tree Map

```
🗄️ CORE TABLES
├── users                    # User management (anonymous + Google auth)
│   ├── birth_data          # Astrological birth information
│   ├── current_location_*  # GPS/manual location for void moon
│   ├── privacy_settings    # Public profile controls
│   └── subscription_tier   # free|premium|pro
├── natal_charts            # Generated chart storage + sharing
├── people                  # Chart subjects management
└── cache                   # TTL performance layer

🗨️ DISCUSSIONS SYSTEM
├── discussions             # Forum threads + blog posts
├── discussion_replies      # Nested threading system
├── votes                   # Up/down voting (discussions + replies)
├── categories              # Discussion organization
└── tags                    # Flexible tagging system

🔮 ASTROLOGY FEATURES
├── tarot_custom_sentences  # User sentences for card learning ✅ NEW
├── astrological_events     # Electional timing + personal events  
├── horary_questions        # Horary chart storage
├── tarot_progress         # Learning game progress
├── tarot_sessions         # Individual learning sessions
└── tarot_leaderboard      # Global rankings

🔔 NOTIFICATIONS & ADMIN
├── notifications          # User notification system
├── notification_preferences # User notification settings
├── notification_templates # Reusable notification templates
├── admin_logs             # Audit trail system
├── admin_settings         # Configuration management
├── admin_sessions         # Admin authentication
├── user_activity          # User behavior tracking
└── premium_features       # Feature gating system

📊 ANALYTICS
├── analytics_traffic      # Daily traffic metrics
├── analytics_engagement   # User engagement data
└── analytics_unique_visitors # IP-based unique visitor tracking
```

## 🛠️ Technical Patterns

### Database Connection Strategy
```typescript
// Primary: Turso HTTP Client (production)
// Issue: Drizzle WHERE clauses broken → Use raw SQL
// Fallback: Shared resilience utility for offline handling

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// ⚠️ CRITICAL: Use raw SQL for filtering
const result = await client.execute({
  sql: 'SELECT * FROM table WHERE column = ?',
  args: [value]
});
```

### Service Resilience Pattern
```typescript
// All services use shared resilience utility
import { createResilientService } from '../resilience';

const resilient = createResilientService('ServiceName');

export class MyService {
  static async getItems() {
    return resilient.array(db, 'getItems', async () => {
      // Database operation
    });
  }
}

// Fallback Types:
// resilient.array() → []
// resilient.item() → null  
// resilient.count() → 0
// resilient.boolean() → false
```

## 📁 Complete API File Structure (82 Total Endpoints)

```
src/app/api/
├── 🔐 auth/
│   ├── logout/route.ts
│   └── mobile/route.ts
├── 👤 users/
│   ├── preferences/route.ts
│   ├── charts/route.ts
│   ├── location/route.ts
│   ├── profile/route.ts
│   ├── account/route.ts
│   ├── delete/route.ts
│   ├── activity/route.ts
│   ├── [userId]/replies/route.ts
│   └── by-username/[username]/route.ts
├── 📊 charts/
│   ├── generate/route.ts
│   ├── shared/route.ts
│   ├── [id]/route.ts
│   ├── [id]/share/route.ts
│   ├── [id]/preview/route.ts
│   └── user/[userId]/route.ts
├── 💬 discussions/
│   ├── route.ts              # List + create
│   ├── create/route.ts
│   ├── test/route.ts
│   ├── replies/route.ts
│   ├── votes/route.ts
│   ├── by-slug/[slug]/route.ts
│   ├── [id]/route.ts         # CRUD individual
│   ├── [id]/replies/route.ts
│   ├── [id]/vote/route.ts
│   └── [id]/sync-replies/route.ts
├── 🏷️ categories/
│   ├── route.ts              # CRUD categories
│   └── [id]/route.ts
├── 🔖 tags/
│   └── route.ts              # Tag management
├── 👥 people/
│   └── route.ts              # People management for charts
├── 🔮 tarot/
│   ├── ai-evaluate/route.ts
│   ├── award-points/route.ts
│   ├── card-progress/route.ts
│   ├── evaluate/route.ts
│   ├── generate-situation/route.ts
│   ├── leaderboard/route.ts
│   ├── progress/route.ts
│   └── sentences/            # ✅ TAROT SENTENCES (12 endpoints)
│       ├── card/route.ts     # Get sentences for specific card
│       ├── user/route.ts     # Get all user sentences + pagination
│       ├── add/route.ts      # Add custom sentences
│       ├── update/route.ts   # Update existing sentences
│       ├── delete/route.ts   # Delete sentences
│       ├── bulk-sync/route.ts # Mobile app migration
│       ├── generate/route.ts # AI sentence generation
│       ├── stats/route.ts    # User statistics
│       ├── random/route.ts   # Flashcard learning
│       ├── migrate-hardcoded/route.ts # One-time migration
│       └── clear-all/route.ts # Clear all user sentences
├── 📅 events/
│   ├── route.ts              # CRUD events
│   ├── bulk/route.ts
│   ├── [id]/route.ts
│   └── [id]/bookmark/route.ts
├── ❓ horary/
│   └── questions/
│       ├── route.ts          # CRUD horary questions
│       └── [id]/route.ts
├── 🔔 notifications/
│   ├── route.ts              # List + create
│   ├── summary/route.ts
│   ├── mark-all-read/route.ts
│   ├── preferences/route.ts
│   ├── archive/route.ts
│   ├── batch/route.ts
│   ├── health/route.ts
│   ├── stream/route.ts
│   └── [id]/route.ts         # Individual CRUD
├── 🔧 admin/ (50+ endpoints)
│   ├── 🔐 auth/              # Admin authentication
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   ├── master-login/route.ts
│   │   └── verify/route.ts
│   ├── 👥 users/             # User management
│   │   ├── route.ts
│   │   ├── search/route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── update/route.ts
│   │       ├── promote/route.ts
│   │       ├── demote/route.ts
│   │       └── role/route.ts
│   ├── 📊 analytics/         # Analytics endpoints
│   │   ├── metrics/route.ts
│   │   ├── health/route.ts
│   │   ├── enhanced-metrics/route.ts
│   │   ├── charts-analytics/route.ts
│   │   ├── real-user-analytics/route.ts
│   │   ├── user-analytics/route.ts
│   │   ├── traffic-data/route.ts
│   │   ├── traffic-sources/route.ts
│   │   ├── top-pages/route.ts
│   │   ├── location-analytics/route.ts
│   │   ├── seed-analytics/route.ts
│   │   └── analytics-cron/route.ts
│   ├── ⚙️ settings/          # Configuration
│   │   ├── route.ts
│   │   ├── seo-settings/route.ts
│   │   ├── premium-features/route.ts
│   │   └── roles/route.ts
│   ├── 📋 audit-logs/        # Audit system
│   │   ├── route.ts
│   │   └── stats/route.ts
│   ├── 🔮 tarot/            # Tarot admin
│   │   └── migrate-tarot-tables/route.ts
│   ├── 📅 events/           # Events admin
│   │   ├── route.ts
│   │   ├── events-migrate/route.ts
│   │   └── [id]/route.ts
│   ├── 🤖 ai/               # AI management
│   │   ├── ai-config/route.ts
│   │   ├── custom-ai-models/route.ts
│   │   ├── create-custom-models-table/route.ts
│   │   ├── debug-custom-models/route.ts
│   │   ├── generate-reply/route.ts
│   │   ├── transform-with-ai/route.ts
│   │   └── process-pasted-content/route.ts
│   ├── 🌱 seeding/          # Data seeding
│   │   ├── seed-data/route.ts
│   │   ├── seed-users/
│   │   │   ├── route.ts
│   │   │   ├── bulk-create/route.ts
│   │   │   └── complete-all/route.ts
│   │   ├── execute-seeding/route.ts
│   │   ├── migrate-seeding-tables/route.ts
│   │   ├── seeding-progress/[batchId]/route.ts
│   │   ├── clear-seeded-content/route.ts
│   │   └── randomize-reply-times/route.ts
│   ├── 🧹 maintenance/      # System maintenance
│   │   ├── emergency-db-clear/route.ts
│   │   ├── migrate-categories-table/route.ts
│   │   ├── migrate-premium/route.ts
│   │   ├── migrate-user-activity/route.ts
│   │   ├── fix-avatar-paths/route.ts
│   │   ├── fix-discussion-avatar-paths/route.ts
│   │   ├── check-avatar-paths-status/route.ts
│   │   ├── process-comments/route.ts
│   │   ├── replace-discussion-comments/route.ts
│   │   ├── aggregate-daily-traffic/route.ts
│   │   ├── generate-sitemap/route.ts
│   │   └── generate-robots/route.ts
│   └── 🔧 system/           # System utilities
│       ├── notifications/route.ts
│       └── pool-health/route.ts
├── 🔍 debug/ (12 endpoints)
│   ├── db-connection/route.ts
│   ├── connection-pool/route.ts
│   ├── env-check/route.ts
│   ├── env-vars-server/route.ts
│   ├── list-tables/route.ts
│   ├── user-lookup/route.ts
│   ├── check-events/route.ts
│   ├── check-user-activity/route.ts
│   ├── create-horary-table/route.ts
│   ├── test-horary-creation/route.ts
│   └── cleanup-horary/route.ts
├── 📊 analytics/
│   └── track/route.ts
├── 💬 replies/
│   └── [id]/vote/route.ts
├── 🔍 monitoring/
│   └── memory/route.ts
├── 🏥 health/
│   └── route.ts
├── 🔔 notifications-status/
│   └── route.ts
├── 🧪 test-*/
│   ├── test-db/route.ts
│   └── test-notifications/route.ts
└── 🌐 ws/
    └── route.ts              # WebSocket endpoint
```

## ⚡ Database Commands & Migration System

### Production Migration Script
```bash
# Apply all migrations to Turso production database
node scripts/apply-migrations.js

# What it does:
# ✅ Reads all .sql files from migrations/ folder in order
# ✅ Connects to Turso using TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
# ✅ Executes each migration with statement breakpoint handling
# ✅ Continues on errors (for duplicate table/column issues)
# ✅ Provides detailed success/error logging
```

### Development Commands
```bash
# Schema Changes
npm run db:generate    # Create migration after schema.ts changes
npm run db:migrate     # Apply to local database (requires Turso config)

# Development Tools
npm run db:studio      # Visual database browser
npm run db:test        # Run database tests
```

### Migration Script Details
The `scripts/apply-migrations.js` script is **critical for production deployments**:
- **Environment**: Loads from `.env.local` automatically
- **Error Handling**: Continues on duplicate table/column errors (expected for re-runs)
- **Statement Splitting**: Handles Drizzle's `--> statement-breakpoint` format
- **Order**: Processes migrations in alphabetical order (0000_*, 0001_*, etc.)
- **Safety**: Does not drop or destructively modify existing data

## 🔧 Key Technical Solutions

### Turso HTTP Client Issues → Raw SQL
**Problem**: Drizzle WHERE clauses completely ignored by Turso HTTP client
**Solution**: All filtering uses direct SQL execution

```typescript
// ❌ BROKEN with Turso
const results = await db.select().from(table).where(eq(table.id, id));

// ✅ WORKING with Turso  
const results = await client.execute({
  sql: 'SELECT * FROM table WHERE id = ?',
  args: [id]
});
```

### Field Name Mapping
**Issue**: Raw SQL returns snake_case, frontend expects camelCase
```typescript
// Transform in all raw SQL responses
return {
  authorId: row.author_id,      // snake_case → camelCase
  isPublished: Boolean(row.is_published), // 0/1 → true/false
  tags: row.tags ? JSON.parse(row.tags) : []
};
```

### Database Resilience
**Pattern**: All services gracefully handle database unavailability
- Analytics continue without breaking
- UI shows cached/empty data
- Services return appropriate fallbacks
- Warning logs (not errors) for debugging

## 📊 Migration Status

```
✅ Applied: 26 migrations total
├── 0013_magenta_apocalypse.sql    # ✅ tarot_custom_sentences + people tables  
├── 0017_add_tarot_tables.sql      # ✅ Tarot learning game tables
├── 0018_fix_categories_table.sql  # ✅ Category table fixes
├── 0019_add_people_table.sql      # ✅ People management
├── 0020_add_unique_constraint_people.sql # ✅ People constraints
└── 20250626T05163_add_performance_indexes.sql # ✅ 45 performance indexes
```

## 🎯 Current Implementation Status

| System | Tables | APIs | Status |
|--------|--------|------|--------|
| **Users & Auth** | 3 | 9 | ✅ Complete |
| **Charts & Natal** | 2 | 5 | ✅ Complete |
| **Discussions** | 5 | 9 | ✅ Complete |
| **Tarot Sentences** | 1 | 12 | ✅ Complete |
| **Events** | 1 | 7 | ✅ Complete |
| **Notifications** | 3 | 5 | ✅ Complete |
| **Admin & Analytics** | 8 | 14 | ✅ Complete |
| **Premium Features** | 1 | 4 | ✅ Complete |

**Total: 32 tables, 82 APIs - 100% Complete**

## 🔍 Quick Reference

### Tarot Sentences API (Latest Addition)
```typescript
// Core endpoints for Flutter mobile app integration
POST /api/tarot/sentences/add           # Add custom sentences
GET  /api/tarot/sentences/card          # Get sentences for specific card  
POST /api/tarot/sentences/generate      # AI-powered sentence generation
POST /api/tarot/sentences/bulk-sync     # Mobile app migration
GET  /api/tarot/sentences/stats         # User statistics

// Features: 5-sentence limit, duplicate prevention, AI integration
// Sources: 'user', 'ai_generated', 'migrated'
// Migration: ✅ Applied to production via scripts/apply-migrations.js
```

### Common Service Patterns
```typescript
// All services follow this pattern:
export class ServiceName {
  static async getItems() {
    return resilient.array(db, 'getItems', async () => {
      const result = await client.execute({
        sql: 'SELECT * FROM table',
        args: []
      });
      return result.rows.map(transformFields);
    });
  }
}
```

### Environment Setup
```bash
# .env.local requirements
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
ADMIN_ACCESS_KEY=admin-development-key-123
JWT_SECRET=your-jwt-secret
```

---
**Last Updated**: 2025-07-23  
**Database Version**: Production-ready with 32 tables, 82 APIs, complete resilience patterns