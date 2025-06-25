# Discussion & Reply Database Implementation Rules

This document outlines the established patterns for creating and fetching discussions and replies in the Luckstrology application.

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
  // Support pagination: limit, offset
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

## Performance Optimizations

1. **Pagination**: Always implement for large result sets
2. **Indexing**: Index frequently queried fields (discussionId, authorId)
3. **Caching**: Cache popular discussions and reply counts
4. **Lazy Loading**: Load replies separately from discussion content

## Next Steps for Reply Implementation

1. Create `/api/discussions/[id]/replies` endpoint
2. Implement reply creation with proper validation
3. Add reply fetching with threading support
4. Update RepliesSection to use real data
5. Implement voting system for replies
6. Add real-time updates for new replies