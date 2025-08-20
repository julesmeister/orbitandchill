# Discussion & Reply Database Implementation Rules

This document outlines the established patterns for creating and fetching discussions and replies in the Luckstrology application with optimized server-side pagination architecture.

## Architecture Overview
```
Database Layer              Service Layer               API Layer                  Frontend
─────────────────          ──────────────────          ───────────────           ──────────────
discussions                DiscussionService           /api/discussions          useDiscussions
├── id (nanoid)           ├── createDiscussion()      ├── GET (paginated)       ├── Server-side pagination
├── title                 ├── getAllDiscussions()     ├── totalCount return     ├── 10 per page
├── content               ├── getDiscussionById()     └── page/limit params     ├── Real totals display
├── authorId              └── Reply management                                   └── Cache refresh
├── category                                           Admin API
├── tags (JSON)           Performance Optimization    ─────────────────          Admin Components
├── replies (count)       ─────────────────────────   /api/admin/threads        ──────────────────
├── views                 ├── Count-only loading      ├── Separated endpoints   ├── AdminDashboard
├── upvotes               ├── Content pagination      ├── loadThreadCounts()    │   └── Count loading only
└── createdAt             └── Accurate totals         └── Content pagination    ├── PostsTab
                                                                                │   └── Content + pagination
discussion_replies                                                             └── PostsList
├── id (nanoid)                                                                    └── Accurate totals
├── discussionId
├── parentReplyId
└── content
```

## Database Schema

### Discussions Table
```sql
discussions:
  - id: text (primary key, nanoid 12 chars)
  - title: text (required)
  - excerpt: text (required)
  - content: text (required, full HTML content)
  - authorId: text (references users.id, nullable)
  - authorName: text (required, stored at creation time)
  - category: text (required)
  - tags: text (JSON array)
  - replies: integer (default 0, auto-incremented)
  - views: integer (default 0)
  - upvotes: integer (default 0)
  - downvotes: integer (default 0)
  - isLocked: boolean (default false)
  - isPinned: boolean (default false)
  - isBlogPost: boolean (default false)
  - isPublished: boolean (default true)
  - createdAt: timestamp
  - updatedAt: timestamp
  - lastActivity: timestamp
```

### Discussion Replies Table
```sql
discussion_replies:
  - id: text (primary key, nanoid 12 chars)
  - discussionId: text (references discussions.id, cascade delete)
  - authorId: text (references users.id, nullable)
  - content: text (required)
  - parentReplyId: text (self-reference for threading, nullable)
  - upvotes: integer (default 0)
  - downvotes: integer (default 0)
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Votes Table
```sql
votes:
  - id: text (primary key, nanoid 12 chars)
  - userId: text (references users.id, cascade delete)
  - discussionId: text (nullable, for discussion votes)
  - replyId: text (nullable, for reply votes)
  - voteType: 'up' | 'down'
  - createdAt: timestamp
```

## Service Layer Patterns

### DiscussionService Methods

#### Creating Discussions
```typescript
static async createDiscussion(data: CreateDiscussionData) {
  // Always include: id (nanoid), createdAt, updatedAt, lastActivity
  // Store authorName at creation time for data integrity
  // Tags stored as JSON string
}
```

#### Fetching Discussions
```typescript
static async getDiscussionById(id: string) {
  // Parse JSON fields (tags)
  // Handle null results gracefully
}

static async getAllDiscussions(options) {
  // Support filtering: category, isBlogPost, isPublished
  // Support sorting: recent, popular, replies, views
  // Support server-side pagination: limit=10, offset calculated from page
  // Return totalCount for accurate pagination displays
  // Parse JSON fields in results
}
```

#### Reply Management
```typescript
static async createReply(data: CreateReplyData) {
  // Auto-increment discussion.replies count
  // Update discussion.lastActivity
  // Support parentReplyId for threading
}

static async getRepliesForDiscussion(discussionId: string) {
  // Order by createdAt ASC for chronological display
  // Return flat array (threading handled in frontend)
}
```

#### Voting System
```typescript
static async voteOnDiscussion(userId, discussionId, voteType) {
  // Check for existing votes, remove if changing
  // Update upvotes/downvotes counters
  // Prevent duplicate votes from same user
}
```

## API Endpoint Patterns

### GET /api/discussions/[id]
```typescript
// Pattern: Try database first, fallback to mock data
try {
  await initializeDatabase();
  const discussion = await DiscussionService.getDiscussionById(id);
  
  if (!discussion) {
    return 404 error
  }
  
  // Enhance with computed fields
  const enhancedDiscussion = {
    ...discussion,
    author: discussion.authorName || 'Anonymous User',
    avatar: generateAvatarFromName(discussion.authorName),
  };
  
  return { success: true, discussion: enhancedDiscussion };
  
} catch (dbError) {
  // Return fallback data for development
  return { success: true, discussion: getFallbackData(id) };
}
```

### POST /api/discussions/[id]/replies
```typescript
// Future implementation pattern:
try {
  await initializeDatabase();
  
  // Validate input data
  const { content, authorId, parentReplyId } = await request.json();
  
  // Create reply
  const reply = await DiscussionService.createReply({
    discussionId: id,
    authorId,
    content,
    parentReplyId
  });
  
  // Fetch author information
  const author = await UserService.getUserById(authorId);
  
  // Return enhanced reply data
  return {
    success: true,
    reply: {
      ...reply,
      author: author?.username || 'Anonymous User',
      avatar: generateAvatarFromName(author?.username),
      timestamp: formatTimestamp(reply.createdAt)
    }
  };
  
} catch (error) {
  return { success: false, error: error.message };
}
```

## Frontend Integration Patterns

### Data Fetching
```typescript
// Always handle both success and error states
const response = await fetch(`/api/discussions/${id}`);
const data = await response.json();

if (data.success && data.discussion) {
  setDiscussion(data.discussion);
} else {
  setError(data.error || 'Discussion not found');
}
```

### Reply Threading
```typescript
// Backend returns flat array, frontend organizes into tree
const organizeReplies = (replies: Reply[]): Reply[] => {
  const replyMap = new Map<string, Reply>();
  const rootReplies: Reply[] = [];
  
  // First pass: create map and identify root replies
  replies.forEach(reply => {
    replyMap.set(reply.id, { ...reply, children: [] });
    if (!reply.parentReplyId) {
      rootReplies.push(replyMap.get(reply.id)!);
    }
  });
  
  // Second pass: build tree structure
  replies.forEach(reply => {
    if (reply.parentReplyId) {
      const parent = replyMap.get(reply.parentReplyId);
      if (parent) {
        parent.children.push(replyMap.get(reply.id)!);
      }
    }
  });
  
  return rootReplies;
};
```

## Error Handling Rules

1. **Database Errors**: Always provide fallback data in development
2. **Missing Data**: Return 404 with clear error messages
3. **Validation Errors**: Return 400 with specific field errors
4. **Network Errors**: Handle with loading states and retry options

## Data Enhancement Rules

1. **Author Information**: Store authorName at creation, enhance with avatar
2. **Timestamps**: Use consistent formatting for display
3. **JSON Fields**: Always parse tags and other JSON fields
4. **Computed Fields**: Add avatar, formatted dates in API responses

## Testing Patterns

1. **Mock Data**: Provide realistic fallback data for development
2. **Database Isolation**: Test services independently
3. **API Testing**: Test both success and error paths
4. **Frontend Testing**: Mock API responses

## Security Considerations

1. **Author Verification**: Verify authorId matches authenticated user
2. **Input Sanitization**: Sanitize HTML content
3. **Rate Limiting**: Implement for reply creation
4. **Spam Prevention**: Basic content validation

## Performance & Database Connection Architecture

```
Discussion System Performance Tree
├── Server-Side Pagination Strategy
│   ├── Admin Interface: AdminDashboard loads counts only → PostsTab handles content (10/page)
│   ├── Public Interface: Discussions page → 10 per page server-side fetching
│   ├── Database Queries: Real-time totals → Accurate pagination displays
│   └── Architecture Separation: Count loading vs content pagination concerns
├── Database Connection Strategy (✅ ENHANCED) - AVOID DRIZZLE ORM
│   ├── Implementation Approach (Drizzle ORM Avoidance)
│   │   ├── Avoid: Drizzle ORM operations (unreliable with Turso HTTP client)
│   │   └── Prefer: Direct Turso HTTP Client (guaranteed reliability)
│   ├── Field Validation System
│   │   ├── validFields: ['title', 'slug', 'content', 'excerpt', ...] 
│   │   └── Prevents field filtering issues (slug persistence resolved)
│   ├── Direct Database Connection Benefits
│   │   ├── No WHERE clause parsing issues
│   │   ├── No silent operation failures
│   │   ├── Direct parameter binding
│   │   └── Raw SQL execution control
│   └── Production Debug System
│       ├── 🔧 Direct database connection activation
│       ├── 🔍 Raw SQL query execution logging  
│       ├── ✅ Operation success confirmation
│       └── ❌ Error identification and recovery paths
└── Query & Data Optimization
    ├── Database Indexing: discussionId, authorId, category fields
    ├── Caching Strategy: Popular discussions and reply counts
    ├── Lazy Loading: Separate reply loading from discussion content
    └── Connection Pooling: Efficient resource management
```

## Database Connection Resilience Implementation

### Discussion System Specific Patterns

```
Discussion Database Operations Tree (AVOID DRIZZLE ORM WHERE POSSIBLE)
├── Field Validation Rules (src/db/services/discussionService.ts)
│   ├── validFields: ['title', 'slug', 'content', 'excerpt', 'category', 'authorName', 'tags']
│   ├── Boolean Fields: ['isBlogPost', 'isPublished', 'isPinned', 'isLocked'] 
│   ├── Numeric Fields: ['views', 'upvotes', 'downvotes', 'replies', 'updatedAt']
│   └── Critical Fix: Added 'slug' field to prevent filtering before database operations
├── Discussion-Specific Column Mapping
│   ├── Frontend → Database: authorName → author_name, featuredImage → featured_image
│   ├── Boolean Conversion: SQLite integers (0/1) ↔ JavaScript booleans
│   ├── JSON Fields: tags array ↔ JSON string storage
│   └── Timestamps: JavaScript Date ↔ Unix timestamp (Math.floor(Date.getTime() / 1000))
├── Raw SQL Implementation (RECOMMENDED - bypasses Drizzle ORM issues)
│   ├── UPDATE discussions SET slug = ?, title = ?, content = ? WHERE id = ?
│   ├── Parameter Binding: [slugValue, titleValue, contentValue, discussionId]
│   ├── Environment Variables: TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
│   └── Error Recovery: Direct connection when Drizzle ORM WHERE clauses fail
└── Discussion Threading Architecture
    ├── discussion_replies table with parentReplyId for nesting
    ├── Reply count auto-increment on discussion creation
    ├── Last activity timestamp updates on new replies
    └── Reply fetching with chronological ordering (createdAt ASC)
```

### Reply Management Patterns (Discussion-Specific)

```
Reply Threading Implementation
├── Database Schema (discussion_replies table)
│   ├── id (nanoid 12 chars) → Unique reply identifier
│   ├── discussionId → Foreign key to discussions table (CASCADE DELETE)
│   ├── parentReplyId → Self-reference for nested threading (nullable)
│   ├── authorId → References users table (nullable for anonymous)
│   └── content → Reply content with HTML support
├── Reply Creation Flow
│   ├── Insert reply → discussion_replies table
│   ├── Increment count → UPDATE discussions SET replies = replies + 1
│   ├── Update activity → UPDATE discussions SET last_activity = timestamp
│   └── Thread organization → Frontend handles reply tree structure
└── Reply Fetching Strategy
    ├── Raw SQL: SELECT * FROM discussion_replies WHERE discussion_id = ? ORDER BY created_at ASC
    ├── Flat array return → Frontend organizes into nested tree
    ├── Author enhancement → LEFT JOIN with users table for author info
    └── Performance: Load replies separately from discussion content (lazy loading)
```

### Discussion URL and Slug Management

```
Discussion URL Architecture (Post Slug-Fix Implementation)
├── Admin Interface Slug Editing (src/components/admin/PostsTab.tsx)
│   ├── Form Field: slug input in PostFormModal component
│   ├── Real-time Preview: Shows URL as user types
│   ├── Validation: Ensures slug meets URL requirements
│   └── Persistence: Now correctly saves to database (validFields fix)
├── Public URL Routing (src/app/discussions/[slug]/route.ts)
│   ├── Primary Route: /discussions/[slug] → Dynamic routing
│   ├── Slug Lookup: Raw SQL for reliable WHERE clause execution
│   ├── ID Fallback: Falls back to ID lookup when slug missing
│   └── SEO Benefits: Human-readable URLs for better search indexing
├── API Slug Resolution (src/app/api/discussions/by-slug/[slug]/route.ts)
│   ├── Database Query: SELECT * FROM discussions WHERE slug = ? AND is_published = 1
│   ├── Error Handling: 404 when slug not found, 500 for database errors
│   ├── Response Enhancement: Includes author avatar and computed fields
│   └── Caching Headers: Optimized for CDN and browser caching
└── Migration and Maintenance
    ├── Existing discussions without slugs → Generate from title
    ├── Slug uniqueness validation → Prevent duplicate URLs
    ├── Slug history tracking → Maintain old URLs for SEO
    └── Admin tools → Bulk slug generation and validation
```

### Discussion Categories and Filtering

```
Discussion Category System Architecture
├── Category Structure (Astrology-Specific)
│   ├── 'All Categories' → No filtering applied
│   ├── 'Natal Chart Analysis' → Birth chart interpretations
│   ├── 'Transits & Predictions' → Current planetary movements
│   ├── 'Chart Reading Help' → Community assistance requests
│   ├── 'Synastry & Compatibility' → Relationship astrology
│   ├── 'Mundane Astrology' → World events and astrology
│   ├── 'Learning Resources' → Educational content
│   └── 'General Discussion' → Open-ended astrology discussions
├── Database Filtering (Server-Side Performance)
│   ├── Raw SQL: SELECT * FROM discussions WHERE category = ? AND is_published = 1
│   ├── Index Optimization: CREATE INDEX idx_discussions_category ON discussions(category)
│   ├── Pagination Integration: Combined with LIMIT/OFFSET for performance
│   └── Count Queries: SELECT COUNT(*) for accurate pagination totals
├── Frontend Category Management
│   ├── Category Dropdown: Real-time filtering with server-side queries
│   ├── URL State: Category preserved in query parameters
│   ├── Category Colors: Visual coding for different astrology topics
│   └── Category Badges: Discussion cards show category with styling
└── Admin Category Management
    ├── Category Creation: Admin interface for new categories
    ├── Discussion Migration: Move discussions between categories
    ├── Category Analytics: Track popular categories for insights
    └── Category Permissions: Control who can post in specific categories
```

### 📋 For Database Connection Technical Patterns, See:
- `API_DATABASE_PROTOCOL.md` → "Drizzle ORM Compatibility Issues & Solutions" (Line 251-354)
- `API_DATABASE_PROTOCOL.md` → "Direct Database Connection Pattern" (Line 1371-1883)  
- `API_DATABASE_PROTOCOL.md` → "Discussion Slug Persistence Resolution" (Line 1885-1906)

## Next Steps for Reply Implementation

1. Create `/api/discussions/[id]/replies` endpoint
2. Implement reply creation with proper validation
3. Add reply fetching with threading support
4. Update RepliesSection to use real data
5. Implement voting system for replies
6. Add real-time updates for new replies