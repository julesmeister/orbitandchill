# Voting System Documentation

## Overview

The Orbit and Chill application features a comprehensive voting system that allows users to upvote and downvote discussions and replies. The system supports anonymous users through automatic user creation and provides real-time vote count updates.

## Architecture

### Database Schema

#### Votes Table
```sql
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  discussion_id TEXT,
  reply_id TEXT,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at INTEGER NOT NULL,
  FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_id) REFERENCES discussion_replies(id) ON DELETE CASCADE
);
```

#### Discussions Table (Vote Columns)
```sql
-- Vote tracking columns in discussions table
upvotes INTEGER DEFAULT 0,
downvotes INTEGER DEFAULT 0
```

#### Discussion Replies Table (Vote Columns)
```sql
-- Vote tracking columns in discussion_replies table
upvotes INTEGER DEFAULT 0,
downvotes INTEGER DEFAULT 0
```

### System Components

## Frontend Components

### VoteButtons Component (`/src/components/reusable/VoteButtons.tsx`)

A reusable voting component with built-in voting functionality.

#### Props
```typescript
interface VoteButtonsProps {
  type?: 'discussion' | 'reply';
  id?: string;
  upvotes: number;
  downvotes?: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  size?: 'sm' | 'md';
  userVote?: 'up' | 'down' | null;
  className?: string;
  useHook?: boolean; // Whether to use the voting hook or manual handlers
  onAuthRequired?: () => void; // Callback when authentication is required
}
```

#### Usage Examples

**With Built-in Voting (Recommended)**
```tsx
<VoteButtons
  type="discussion"
  id={discussion.id}
  upvotes={discussion.upvotes}
  downvotes={discussion.downvotes}
  size="md"
  userVote={discussion.userVote}
  useHook={true}
  onAuthRequired={() => setShowAuthPrompt(true)}
/>
```

**With Manual Handlers**
```tsx
<VoteButtons
  upvotes={discussion.upvotes}
  downvotes={discussion.downvotes}
  onUpvote={handleUpvote}
  onDownvote={handleDownvote}
  userVote={userVote}
  size="sm"
/>
```

#### Features
- **Automatic API Integration**: When `useHook={true}` is set, handles all API calls automatically
- **Loading States**: Shows disabled state during vote submission
- **User Vote Highlighting**: Highlights the user's current vote selection
- **Anonymous User Support**: Automatically creates anonymous users when needed
- **Error Handling**: Graceful error handling with callback support
- **Responsive Design**: Two size variants (sm/md) with consistent styling

### useVoting Hook (`/src/hooks/useVoting.ts`)

A custom hook that manages voting state and API interactions.

#### Interface
```typescript
function useVoting(
  type: 'discussion' | 'reply',
  id: string,
  initialUpvotes: number = 0,
  initialDownvotes: number = 0,
  initialUserVote: 'up' | 'down' | null = null,
  options?: UseVotingOptions
)
```

#### Return Values
```typescript
{
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  isVoting: boolean;
  handleUpvote: () => void;
  handleDownvote: () => void;
  isAuthenticated: boolean;
}
```

#### Features
- **Automatic User Creation**: Creates anonymous users if none exists
- **Vote Toggle Logic**: Handles vote removal when clicking the same vote type
- **Real-time Updates**: Updates local state immediately after successful API calls
- **Error Callbacks**: Configurable error handling through options
- **Authentication Check**: Ensures user exists before allowing votes

## Backend Implementation

### API Endpoints

#### Vote on Discussion
```
POST /api/discussions/[id]/vote
```

**Request Body**
```json
{
  "userId": "string",
  "voteType": "up" | "down"
}
```

**Response**
```json
{
  "success": true,
  "upvotes": 42,
  "downvotes": 3
}
```

#### Vote on Reply
```
POST /api/replies/[id]/vote
```

**Request Body**
```json
{
  "userId": "string",
  "voteType": "up" | "down"
}
```

**Response**
```json
{
  "success": true,
  "upvotes": 15,
  "downvotes": 2
}
```

### Database Service (`/src/db/services/discussionService.ts`)

#### `voteOnDiscussion(userId, discussionId, voteType, dbInstance?)`

Handles the complete voting workflow using raw SQL for reliability:

1. **Check Existing Vote**: Queries for existing user vote on the discussion
2. **Remove Old Vote**: If changing vote type, removes the old vote and decrements count
3. **Add New Vote**: Inserts new vote record with unique ID and timestamp
4. **Update Count**: Increments the appropriate vote count (upvotes/downvotes)

```typescript
static async voteOnDiscussion(userId: string, discussionId: string, voteType: 'up' | 'down', dbInstance?: any) {
  // Implementation uses raw SQL for reliability with Turso
  // - Checks for existing votes
  // - Handles vote changes (removal + new vote)
  // - Updates discussion vote counts
  // - Prevents duplicate voting
}
```

#### `voteOnReply(userId, replyId, voteType, dbInstance?)`

Similar implementation for reply voting:

1. **Check Existing Vote**: Queries for existing user vote on the reply
2. **Remove Old Vote**: If changing vote type, removes the old vote and decrements count
3. **Add New Vote**: Inserts new vote record with unique ID and timestamp
4. **Update Count**: Increments the appropriate vote count on discussion_replies table

```typescript
static async voteOnReply(userId: string, replyId: string, voteType: 'up' | 'down', dbInstance?: any) {
  // Implementation uses raw SQL for reliability with Turso
  // - Queries reply_id in votes table
  // - Updates discussion_replies upvotes/downvotes columns
  // - Handles vote changes and prevents duplicates
}
```

#### Key Features
- **Vote Change Support**: Users can change from upvote to downvote and vice versa
- **Duplicate Prevention**: Prevents multiple votes from same user on same content
- **Atomic Operations**: Uses database transactions to ensure data consistency
- **Raw SQL Implementation**: Uses direct SQL queries for reliability with Turso
- **Database Instance Injection**: All methods accept optional dbInstance parameter for proper initialization
- **Reply Voting Support**: Full voting implementation for both discussions and replies

#### Database Initialization Pattern

To resolve database availability issues, all DiscussionService methods now use this pattern:

```typescript
static async methodName(params..., dbInstance?: any) {
  const db = dbInstance || (await import('../index')).db;
  if (!db) throw new Error('Database not available');
  
  // Method implementation...
}
```

**API Route Integration:**
```typescript
// In API routes
import { initializeDatabase, db } from '@/db/index';

export async function POST(request: NextRequest) {
  await initializeDatabase();
  
  // Pass db instance to service methods
  await DiscussionService.voteOnDiscussion(userId, discussionId, voteType, db);
  await DiscussionService.getDiscussionById(discussionId, db);
}
```

This ensures the database is properly initialized before any service method executes.

## User Authentication Integration

### Anonymous User System

The voting system integrates with the user store to automatically create anonymous users:

```typescript
// Automatic user creation in useVoting hook
let currentUser = user;
if (!currentUser?.id) {
  await ensureAnonymousUser();
  currentUser = useUserStore.getState().user;
}
```

#### Anonymous User Properties
```typescript
{
  id: "anon_" + randomString + timestamp,
  username: "Anonymous",
  authProvider: "anonymous",
  createdAt: Date,
  updatedAt: Date,
  // ... other user properties
}
```

### User Store Integration (`/src/store/userStore.ts`)

- **ensureAnonymousUser()**: Creates anonymous user if none exists
- **Persistent Storage**: Saves anonymous users to IndexedDB for session persistence
- **User Tracking**: Maintains user ID for vote attribution

## Vote State Management

### Local State Updates

The voting system uses optimistic updates for better user experience:

1. **Immediate UI Update**: Vote buttons update immediately when clicked
2. **API Call**: Background API call to persist vote
3. **Error Handling**: Reverts state if API call fails
4. **Success Confirmation**: Confirms final vote counts from server

### Vote Count Synchronization

Vote counts are synchronized between:
- **Component State**: Local component state for immediate UI updates
- **Database**: Authoritative source of truth for vote counts
- **API Response**: Server returns updated counts after successful vote

## Integration Points

### Discussion Detail Page (`/src/app/discussions/[id]/page.tsx`)

```tsx
// Vote buttons integrated in sidebar
<VoteButtons
  type="discussion"
  id={discussion.id}
  upvotes={discussion.upvotes}
  downvotes={discussion.downvotes}
  size="md"
  userVote={discussion.userVote}
  useHook={true}
/>
```

### Discussion List Page (`/src/app/discussions/page.tsx`)

Vote counts are displayed in discussion cards and can be filtered/sorted by popularity.

### Reply Voting (`/src/components/discussions/RepliesSection.tsx`)

Voting is fully implemented for replies:

```tsx
// Vote buttons integrated in reply components
<VoteButtons
  type="reply"
  id={reply.id}
  upvotes={reply.upvotes}
  downvotes={reply.downvotes}
  size="md"
  userVote={reply.userVote}
  useHook={true}
/>
```

**Features:**
- Full voting functionality for all reply levels
- Supports nested reply voting
- Real-time vote count updates
- Automatic refresh functionality

## Error Handling

### Frontend Error Handling
- **Network Errors**: Graceful handling of API failures
- **Authentication Errors**: Automatic user creation prompts
- **UI Feedback**: Loading states and error messages
- **Retry Logic**: Built-in retry for transient failures

### Backend Error Handling
- **Database Errors**: Proper error logging and response codes
- **Validation**: Input validation for vote types and IDs
- **Constraint Violations**: Handling of database constraint errors
- **Transaction Rollback**: Ensures data consistency on failures

## Performance Considerations

### Database Optimization
- **Indexed Queries**: Proper indexes on vote lookup columns
- **Bulk Operations**: Efficient vote count updates
- **Connection Pooling**: Optimized database connections

### Frontend Optimization
- **Debounced Requests**: Prevents rapid-fire vote submissions
- **Component Memoization**: Optimized re-rendering
- **Lazy Loading**: Vote components loaded on demand

## Security Considerations

### Vote Integrity
- **User Authentication**: All votes tied to user accounts (including anonymous)
- **Single Vote Policy**: One vote per user per discussion/reply
- **SQL Injection Prevention**: Parameterized queries for all database operations
- **Rate Limiting**: (Future) Prevent vote spam

### Data Validation
- **Vote Type Validation**: Ensures only 'up' or 'down' votes
- **User Validation**: Verifies user exists and has permission to vote
- **Content Validation**: Ensures discussion/reply exists before allowing votes

## Future Enhancements

### Planned Features
1. ~~**Reply Voting**: Extend voting to discussion replies~~ ✅ **COMPLETED**
2. **Vote History**: Track user's voting history
3. **Vote Analytics**: Detailed voting statistics for admins
4. **Vote Notifications**: Notify content authors of votes
5. **Advanced Voting**: Support for different vote weights or types

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live vote updates
2. **Caching Layer**: Redis caching for vote counts
3. **Rate Limiting**: Implement vote rate limiting
4. **Audit Trail**: Comprehensive logging of all vote operations

## Troubleshooting

### Common Issues

#### "Database not available" Error
- **Cause**: Database instance not properly initialized in service methods
- **Solution**: Ensure API routes call `await initializeDatabase()` and pass `db` instance to service methods
- **Fix Applied**: All DiscussionService methods now accept optional `dbInstance` parameter

#### Votes Not Persisting
- Check database connection
- Verify vote table exists and has proper schema
- Check console for API errors
- Ensure proper database instance injection

#### Vote Counts Not Updating
- Verify API response includes updated counts
- Check component state management
- Ensure proper re-rendering after vote

#### Anonymous User Creation Failing
- Check user store initialization
- Verify IndexedDB permissions
- Check browser storage limits

### Debug Tools

#### Console Logging
The system includes extensive logging:
```
🔍 Checking for existing vote: { userId, discussionId }
✅ Vote operation completed successfully
❌ Vote operation failed: [error details]
```

#### Database Queries
Raw SQL queries are logged for debugging:
```
🔍 Executing: SELECT * FROM votes WHERE user_id = ? AND discussion_id = ?
```

## Testing

### Unit Tests (Future)
- Vote button component tests
- useVoting hook tests
- Database service tests

### Integration Tests (Future)
- End-to-end voting workflows
- Anonymous user creation
- Vote count accuracy

### Manual Testing Checklist
- [x] Anonymous user can vote on discussions ✅
- [x] Anonymous user can vote on replies ✅
- [x] Vote counts update immediately ✅
- [x] Vote changes work (up to down, down to up) ✅
- [x] Vote removal works (clicking same vote twice) ✅
- [x] Error states display properly ✅
- [x] Loading states work correctly ✅
- [x] Database initialization issues resolved ✅
- [x] Reply voting fully functional ✅