# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ESLint Configuration

When creating new files, add this ESLint disable comment at the top to reduce unnecessary linting noise:

```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */
```

This helps prevent linting errors for variables that are temporarily unused during development.

## Commands

### Frontend Development (Next.js)

**CRITICAL: NEVER RUN `npm run dev` OR ANY DEV SERVER COMMANDS - THE DEVELOPMENT SERVER IS ALWAYS RUNNING!**

**DO NOT USE THESE COMMANDS:**
- ❌ `npm run dev`
- ❌ `npm run dev > /dev/null 2>&1` 
- ❌ `npm start`
- ❌ Any variation of starting the dev server

**The development server is ALWAYS active on http://localhost:3000 - it never needs to be started!**

```bash
# ALLOWED COMMANDS ONLY:
npm run build    # Build production bundle
npm run lint     # Run ESLint for code quality
npm test         # Run tests if needed
```

### Python Library Development (natal)
```bash
cd natal
poetry install   # Install dependencies
poetry run pytest # Run tests
poetry run mkdocs serve # View documentation locally
```

## Performance Optimization Guidelines

### Featured Articles Loading Performance Architecture

```
Loading Performance Enhancement Implementation
├── Problem Analysis & Root Cause Identification
│   ├── Artificial skeleton delays preventing cached content display
│   │   ├── useSkeletonLoading hook enforced 200ms minimum delays
│   │   ├── Cached content forced to wait despite availability
│   │   └── Poor user experience on subsequent visits
│   ├── Staggered loading animations creating blank periods
│   │   ├── useStaggeredLoading created opacity-0 initial states
│   │   ├── 50ms delays per item compounded loading perception
│   │   └── Skeleton→blank→content sequence degraded UX
│   └── Redundant API calls without intelligent debouncing
│       ├── loadThreads() called on every component mount
│       ├── 5-minute background refresh too aggressive
│       └── Concurrent requests without prevention mechanisms
├── Implementation Strategy & Technical Solutions
│   ├── useBlogCache Hook Architecture Enhancement
│   │   ├── Instant cache prioritization logic implementation
│   │   │   ├── isCacheLoaded starts as true to prevent initial skeleton
│   │   │   ├── Cached data displayed immediately upon availability
│   │   │   └── Fresh data loads silently in background
│   │   ├── Intelligent loading state management
│   │   │   ├── effectiveLoading only when no data available
│   │   │   ├── Background refresh without UI interruption
│   │   │   └── Cache-first strategy with seamless updates
│   │   └── API call optimization with debouncing mechanisms
│   │       ├── 30-second minimum interval between requests
│   │       ├── Concurrent load prevention with isLoadingRef
│   │       └── Reduced refresh interval from 5 to 15 minutes
│   ├── FeaturedArticlesList Component Optimization
│   │   ├── Elimination of artificial loading delays
│   │   │   ├── Removed useSkeletonLoading artificial timing
│   │   │   ├── Eliminated useStaggeredLoading opacity animations
│   │   │   └── Direct skeleton-to-content transition logic
│   │   ├── Simplified loading state architecture
│   │   │   ├── showSkeleton = isLoading || posts.length === 0
│   │   │   ├── showContent = hasData (immediate display)
│   │   │   └── Removed intermediate loading states
│   │   └── Performance-focused rendering patterns
│   │       ├── React.memo preservation for component optimization
│   │       ├── Eliminated layout shift with consistent spacing
│   │       └── Maintained hover transitions without loading interference
│   └── Admin Store Thread Loading Enhancement
│       ├── Intelligent caching with time-based validation
│       │   ├── lastLoadTime tracking for request deduplication
│       │   ├── isLoadingThreads state for concurrent prevention
│       │   └── 30-second minimum between loadThreads() calls
│       ├── Cache-aware loading strategies
│       │   ├── Conditional loading based on data freshness
│       │   ├── Background refresh without UI loading states
│       │   └── Optimized for both fresh and cached scenarios
│       └── Error handling with graceful fallback patterns
│           ├── Preserved existing fallback mechanisms
│           ├── Loading state cleanup on errors
│           └── Maintained backward compatibility
└── Results Validation & Performance Impact
    ├── User Experience Enhancement Metrics
    │   ├── Cached content appears instantly (0ms delay vs 200ms)
    │   ├── Eliminated skeleton→blank→content sequence completely
    │   ├── Background refresh maintains freshness without interruption
    │   └── First-time loading still shows appropriate skeleton states
    ├── Technical Performance Improvements
    │   ├── Reduced API calls through intelligent debouncing
    │   ├── 30-second request deduplication prevents unnecessary loads
    │   ├── 15-minute refresh interval reduces server load
    │   └── Cache-first strategy optimizes perceived performance
    ├── Architecture Integrity Preservation
    │   ├── Hook separation of concerns maintained
    │   ├── Component reusability preserved across contexts
    │   ├── TypeScript type safety maintained throughout
    │   └── Backward compatibility with existing implementations
    └── Development Guidelines Integration
        ├── Performance optimization patterns established
        ├── Cache-first loading strategy documented
        ├── Debouncing mechanisms available for future features
        └── Loading state best practices codified for team use
```

## Architecture

### Project Structure
This is a hybrid web application combining:
- **Frontend**: Next.js 15 app with TypeScript and Tailwind CSS
- **Backend Library**: TypeScript implementation using astronomy-engine for astronomical calculations

### Key Integration Points
1. **NatalChartForm** (`/src/components/NatalChartForm.tsx`): Collects birth data with location autocomplete
2. **Location Search**: Uses Nominatim API via `useLocationSearch` hook for geocoding
3. **Data Processing**: Form data includes coordinates for precise chart calculations
4. **Chart Generation**: Will use the `natal` Python library to create SVG charts based on birth data

### Frontend Architecture
- **Routing**: Next.js App Router (`/src/app/`)
- **Components**: TypeScript React components with Tailwind CSS
- **Custom Hooks**: `/src/hooks/` for reusable logic (location search, etc.)
- **Layout**: Centralized layout with responsive Navbar component
- **Theming**: Dark mode support via Tailwind CSS classes

### Python Library (natal)
The `natal` library provides:
- Precise astrological calculations via astronomy-engine
- SVG chart generation with customizable themes
- Chart types: natal, transit, synastry, composite
- Statistical analysis and aspect calculations

Example usage:
```python
from natal import Data, Chart

# Create chart data
data = Data(
    name="Name",
    utc_dt="1980-04-20 06:30",
    lat=25.0531,
    lon=121.526,
)

# Generate SVG chart
chart = Chart(data, width=600)
svg_string = chart.svg
```

### Important Files
- `/src/components/NatalChartForm.tsx`: Form component for birth data input with location autocomplete
- `/src/hooks/useLocationSearch.ts`: Reusable hook for location search with Nominatim API
- `/src/components/Navbar.tsx`: Navigation component with responsive menu
- `/src/app/layout.tsx`: Root layout with Navbar integration
- `/natal/natal/`: Core Python library for astrological calculations
- `/src/components/threading/`: Comment threading visualization system
- `/src/utils/threading/`: Legacy threading utilities (preserved for reference)

## Comment Threading System

### Overview
The project includes a sophisticated comment threading visualization system located in `/src/components/threading/`. This system provides visual connection lines between nested comments using SVG-based rendering.

### Key Components

#### ThreadingLines.tsx
- **Purpose**: Renders visual threading lines for nested comments
- **Technology**: SVG-based curved connection lines with adaptive height
- **Features**: Connection dots, responsive design, optimized positioning

#### Usage Pattern
```tsx
import ThreadingLines from '@/components/threading/ThreadingLines';

<div className="relative mb-4">
  <ThreadingLines
    isNested={true}
    isLastChild={childIndex === reply.children.length - 1}
    hasMoreSiblings={childIndex < reply.children.length - 1}
  />
  <article className="bg-gray-50 rounded-lg border border-gray-200 p-4 ml-4">
    {/* Comment content */}
  </article>
</div>
```

#### Technical Details
- **SVG Positioning**: `left: -32px, top: -10px` relative to comment container
- **Height Calculation**: 
  - With siblings: `calc(100% + 32px)` extends to next comment
  - Last child: `42px` stops at connection point
- **Performance**: Lightweight SVG elements, no JavaScript calculations
- **Styling**: Uses `#6b7280` for lines, `#6366f1` for connection dots

#### Legacy Utilities
The `/src/utils/threading/` folder contains legacy utility functions for more complex threading scenarios. These are preserved for reference and potential future enhancements but are not used in the current implementation.

### Integration
The threading system is integrated into the forum discussion pages (`/src/app/discussions/[id]/page.tsx`) and works seamlessly with the comment hierarchy detection system.

### Repository Potential
This threading system is designed to be easily extractable as a standalone React component library for use in other projects requiring comment threading functionality.

## User Data Architecture

### Overview
The application uses a multi-layer data persistence architecture combining Zustand for state management, Dexie (IndexedDB) for primary storage, and localStorage for fallback caching. This ensures user data persistence across browser sessions while maintaining performance through intelligent caching.


### Data Flow Architecture
```
NatalChartForm → useUserStore → Dexie Database → IndexedDB
      ↓              ↓              ↓             ↓
   Real-time    Zustand Store   Cache Layer   Persistence
   Auto-save    (In-Memory)     (24hr TTL)    (Permanent)
```

### Core Data Types (`/src/types/user.ts`)

#### BirthData Interface
```typescript
interface BirthData {
  dateOfBirth: string;        // ISO date string (YYYY-MM-DD)
  timeOfBirth: string;        // HH:MM format
  locationOfBirth: string;    // Human-readable location
  coordinates: {
    lat: string;              // Latitude for precise calculations
    lon: string;              // Longitude for precise calculations
  };
}
```

#### User Interface (Application Layer)
```typescript
interface User {
  id: string;                 // Anonymous: "anon_xxxxx", Google: Google ID
  username: string;           // "Anonymous" or Google display name
  email?: string;             // Optional, from Google OAuth
  profilePictureUrl?: string; // Optional, from Google OAuth
  authProvider: "google" | "anonymous";
  createdAt: Date;            // TypeScript Date object
  updatedAt: Date;            // TypeScript Date object
  
  // Birth and astrological data
  birthData?: BirthData;      // Complete birth information
  sunSign?: string;           // Zodiac sign
  stelliumSigns?: string[];   // Signs with 3+ planets
  stelliumHouses?: string[];  // Houses with 3+ planets
  hasNatalChart?: boolean;    // Whether complete birth data exists
  
  // Privacy controls
  privacy: UserPrivacySettings;
}
```

#### UserProfile Interface (Storage Layer)
```typescript
// Flattened version for Dexie database storage
interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: "google" | "anonymous";
  createdAt: string;          // ISO string for database storage
  updatedAt: string;          // ISO string for database storage
  
  // Flattened birth data
  dateOfBirth?: string;
  timeOfBirth?: string;
  locationOfBirth?: string;
  coordinates?: { lat: string; lon: string; };
  
  // Flattened astrology data
  sunSign?: string;
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  hasNatalChart?: boolean;
  
  // Flattened privacy settings
  showZodiacPublicly: boolean;
  showStelliumsPublicly: boolean;
  showBirthInfoPublicly: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}
```

### Database Layer (`/src/store/database.ts`)

#### LuckstrologyDatabase (Dexie)
```typescript
class LuckstrologyDatabase extends Dexie {
  userProfiles!: Table<UserProfile>;     // User data storage
  natalCharts!: Table<NatalChartStorage>; // Generated charts
  cache!: Table<CacheEntry>;             // TTL cache layer
}
```

#### Database Schema
```javascript
// Dexie table definitions
this.version(1).stores({
  userProfiles: "id, username, authProvider, updatedAt, email",
  natalCharts: "id, userId, chartType, createdAt", 
  cache: "key, expiry"
});
```

#### Key Database Methods
- **`saveUserProfile(profile: UserProfile)`**: Persists user data to IndexedDB
- **`getCurrentUserProfile()`**: Retrieves most recently updated user profile
- **`userProfileToUser(profile)`**: Converts storage format to application format
- **`userToUserProfile(user)`**: Converts application format to storage format
- **`setCache(key, data, ttlMinutes)`**: Caches data with TTL expiration
- **`getCache<T>(key)`**: Retrieves cached data if not expired

### State Management (`/src/store/userStore.ts`)

#### Zustand Store with Persistence
```typescript
interface UserState {
  // State
  user: User | null;
  isLoading: boolean;
  
  // Computed values
  isProfileComplete: boolean;  // Has complete birth data
  hasStoredData: boolean;      // Has any user data
  
  // Actions
  updateUser: (data: Partial<User>) => Promise<void>;
  updateBirthData: (data: Partial<BirthData>) => Promise<void>;
  updatePrivacySettings: (data: Partial<UserPrivacySettings>) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  generateAnonymousId: () => string;
}
```

#### Anonymous User Generation
```typescript
const generateAnonymousId = (): string => {
  return "anon_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

// Creates persistent anonymous user on first visit
const createInitialUser = (): User => {
  return {
    id: generateAnonymousId(),
    username: "Anonymous",
    authProvider: "anonymous",
    createdAt: new Date(),
    updatedAt: new Date(),
    hasNatalChart: false,
    privacy: { /* default privacy settings */ }
  };
};
```

#### Persistence Strategy
- **Primary Storage**: Dexie (IndexedDB) for persistent data
- **Fallback Storage**: Zustand persist middleware (localStorage)
- **Cache Layer**: 24-hour TTL cache for quick access
- **Real-time Updates**: Auto-save on every form field change

### Form Component (`/src/components/forms/NatalChartForm.tsx`)

#### Auto-Save Architecture
```typescript
// Real-time auto-save on every keystroke
const updateFormData = useCallback((updates: Partial<NatalChartFormData>) => {
  const newFormData = { ...formData, ...updates };
  setFormData(newFormData);
  
  // Automatically save to user store (which saves to database)
  const { name, ...birthData } = newFormData;
  updateBirthData(birthData);  // Triggers Dexie save
}, [formData, updateBirthData]);
```

#### Form Data Interface
```typescript
interface NatalChartFormData extends BirthData {
  name: string; // Optional display name (not persisted to User.username)
}
```

#### Integration Points
1. **Location Search**: Uses `useLocationSearch` hook with Nominatim API
2. **Auto-save**: Every field change triggers `updateBirthData()`
3. **Data Restoration**: Loads saved data on component mount via `loadProfile()`
4. **Chart Generation**: Uses `useNatalChart` hook for caching and persistence

### Chart Management (`/src/hooks/useNatalChart.ts`)

#### Chart Caching Strategy
```typescript
// Cache key includes all birth data for precise cache hits
const cacheKey = `natal_chart_${userId}_${dateOfBirth}_${timeOfBirth}_${lat}_${lon}`;

// Check cache before generation
const cached = await db.getCache<NatalChartData>(cacheKey);
if (cached) return cached;

// Generate and cache new chart
await db.setCache(cacheKey, chartData, 1440); // 24 hours
```

#### Chart Storage Schema
```typescript
interface NatalChartStorage {
  id: string;
  userId: string;
  chartData: string;           // SVG or JSON data
  chartType: "natal" | "transit" | "synastry" | "composite";
  createdAt: string;
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
  };
}
```

### Data Persistence Guarantees

1. **Anonymous User Persistence**: Anonymous users get persistent IDs across browser sessions
2. **Form Auto-save**: All form data automatically saved on every keystroke
3. **Chart Caching**: Generated charts cached for 24 hours to avoid regeneration
4. **Offline Resilience**: IndexedDB works offline, localStorage provides fallback
5. **Data Consistency**: Conversion utilities ensure type safety between layers
6. **Session Persistence**: Google OAuth users maintain their session across browser refreshes (fixed race condition in initialization)

### Privacy Architecture

#### Privacy Settings Schema
```typescript
interface UserPrivacySettings {
  showZodiacPublicly: boolean;      // Show sun sign in public profile
  showStelliumsPublicly: boolean;   // Show stellium data publicly
  showBirthInfoPublicly: boolean;   // Show birth location/date publicly
  allowDirectMessages: boolean;     // Allow other users to contact
  showOnlineStatus: boolean;        // Show when user is active
}
```

#### Public Profile Filtering
```typescript
interface PublicUserProfile {
  id: string;
  username: string;
  profilePictureUrl?: string;
  sunSign?: string;           // Only if privacy.showZodiacPublicly
  stelliumSigns?: string[];   // Only if privacy.showStelliumsPublicly
  stelliumHouses?: string[];  // Only if privacy.showStelliumsPublicly
  hasNatalChart: boolean;
  createdAt: Date;
}
```

## Forum & Discussions Architecture

### Overview
The application features a comprehensive forum system with threaded discussions, admin management, and content creation. The system supports both blog posts and forum threads with sophisticated threading visualization.

### Thread Data Types (`/src/types/threads.ts`)

#### Core Thread Interface
```typescript
interface Thread {
  id: string;
  title: string;
  excerpt: string;
  content: string;              // Full content for discussion page
  author: string;
  authorId: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  createdAt: Date;
  updatedAt: Date;
  isLocked: boolean;
  isPinned: boolean;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  isBlogPost: boolean;          // Distinguishes blog posts from forum threads
}
```

#### Thread Reply Interface
```typescript
interface ThreadReply {
  id: string;
  threadId: string;
  content: string;
  author: string;
  authorId: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  parentReplyId?: string;       // Enables nested reply threading
}
```

#### Reply Threading Interface
```typescript
interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isAuthor?: boolean;
  parentId?: string;
  replyToAuthor?: string;
  children?: Reply[];           // Recursive structure for nested replies
}
```

#### Category & Voting Interfaces
```typescript
interface ThreadCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  threadCount: number;
}

interface ThreadVote {
  id: string;
  userId: string;
  threadId?: string;
  replyId?: string;
  voteType: 'up' | 'down';
  createdAt: Date;
}
```

### Discussion List Page (`/src/app/discussions/page.tsx`)

#### Features
- **Category Filtering**: Filter threads by astrology categories (Natal Charts, Transits, etc.)
- **Search Functionality**: Search by title, excerpt, or tags
- **Sorting Options**: Sort by recent, popular, replies, or views
- **Pagination**: Configurable posts per page with smart pagination controls
- **Responsive Design**: Sidebar collapses on mobile, cards adapt to screen size

#### Key Components Integration
```typescript
// Component hierarchy
DiscussionsPage
├── DiscussionsHeader          // Hero section with call-to-action
├── DiscussionsSidebar         // Category filters + community stats
├── SearchAndFilters           // Search bar and sort controls
├── DiscussionCard[]           // Individual thread previews
└── CommunityGuidelines        // Footer with community rules
```

#### Mock Data Structure
```typescript
const mockDiscussions: DiscussionTemp[] = [
  {
    id: '1',
    title: 'Understanding Your Mars Placement: A Deep Dive into Action and Desire',
    excerpt: 'Mars in our natal chart reveals how we take action...',
    author: 'AstroMaster',
    category: 'Natal Chart Analysis',
    replies: 23,
    views: 1247,
    isPinned: true,
    tags: ['mars', 'planets', 'natal-chart'],
    upvotes: 89
  }
  // Additional discussion entries...
];
```

### Discussion Detail Page (`/src/app/discussions/[id]/page.tsx`)

#### Features
- **SEO Optimization**: Dynamic meta tags, structured data, Open Graph
- **Thread Content**: Full discussion content with author information
- **Reply System**: Nested replies with threading visualization
- **Related Discussions**: Sidebar with similar threads
- **Social Sharing**: Meta tags for social media sharing

#### Component Architecture
```typescript
DiscussionDetailPage
├── DiscussionHeader           // Thread title, author, metadata
├── DiscussionContent          // Main thread content
├── ReplyForm                  // New reply composition
├── RepliesSection             // Threaded reply display
└── DiscussionSidebar          // Related threads, thread info
```

#### Custom Hooks Integration
```typescript
const {
  formState,                   // Reply form state management
  handleReplyChange,           // Form input handlers
  handleReplyToComment,        // Nested reply functionality
  handleSubmitReply,           // Reply submission
  handleCancelReply,           // Form cancellation
  organizeReplies,             // Reply hierarchy organization
} = useReplyHandling();

useDiscussionMeta(discussion); // SEO meta tag management
```

#### Structured Data for SEO
```typescript
const structuredData = generateDiscussionStructuredData(discussion);
// Generates Schema.org DiscussionForumPosting markup
```

### Admin Posts Management (`/src/components/admin/PostsTab.tsx`)

#### Features
- **Dual Content Types**: Create/edit both blog posts and forum threads
- **Rich Text Editor**: TipTap-based WYSIWYG editor for content creation
- **Content Filtering**: Filter by published/draft status, blog/forum type
- **Bulk Operations**: Mass editing and deletion capabilities
- **Publication Control**: Draft/publish workflow with scheduling

#### Form Data Interface
```typescript
interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  isBlogPost?: boolean;        // Blog post vs forum thread
  isPublished?: boolean;       // Draft vs published status
}
```

#### Admin Store Integration
```typescript
const { 
  threads,                     // All threads/posts
  loadThreads,                 // Fetch from database
  createThread,                // Create new content
  updateThread,                // Edit existing content
  deleteThread                 // Remove content
} = useAdminStore();
```

#### Content Statistics
```typescript
// Real-time content metrics
const blogPosts = threads.filter(t => t.isBlogPost);
const forumThreads = threads.filter(t => !t.isBlogPost);
const publishedCount = threads.filter(t => t.isPublished).length;
```

### Data Flow Architecture

#### Discussion Creation Flow
```
AdminPostsTab → DiscussionForm → TipTap Editor → AdminStore → Database
     ↓              ↓                ↓            ↓          ↓
  UI Form      Rich Content    HTML Content   State Mgmt  Persistence
```

#### Discussion Display Flow
```
DiscussionsPage → Filter/Search → DiscussionCard → Link → DetailPage
     ↓               ↓              ↓             ↓        ↓
  List View     Applied Filters   Thread Preview  Route  Full Content
```

#### Reply Threading Flow
```
ReplyForm → useReplyHandling → organizeReplies → ThreadingLines → Visual Tree
    ↓            ↓                 ↓                ↓              ↓
User Input   State Logic    Hierarchy Build   SVG Rendering   Thread View
```

### Threading Visualization System

#### Reply Organization
```typescript
const organizeReplies = (replies: Reply[]): Reply[] => {
  // Convert flat reply array to nested tree structure
  // Handle parent-child relationships
  // Sort by timestamp and relevance
  // Return hierarchical reply structure
};
```

#### Visual Threading Components
- **ThreadingLines.tsx**: SVG-based connection lines
- **Connection Dots**: Visual reply relationship indicators  
- **Adaptive Height**: Dynamic sizing based on reply depth
- **Mobile Responsive**: Optimized for various screen sizes

### Content Management Features

#### Category System
```typescript
const categories = [
  'All Categories',
  'Natal Chart Analysis',      // Birth chart interpretation
  'Transits & Predictions',    // Current planetary movements
  'Chart Reading Help',        // Community assistance requests
  'Synastry & Compatibility',  // Relationship astrology
  'Mundane Astrology',         // World events and astrology
  'Learning Resources',        // Educational content
  'General Discussion'         // Open-ended discussions
];
```

#### Tag System
- **Flexible Tagging**: Free-form tags for content organization
- **Search Integration**: Tags included in search functionality
- **Category Cross-reference**: Tags supplement category organization
- **Popular Tags**: Display trending discussion topics

#### Content Moderation
- **Lock Threads**: Prevent new replies on sensitive topics
- **Pin Important**: Highlight important discussions
- **Admin Controls**: Full editorial control over all content
- **Community Guidelines**: Clear rules for participation

### Performance Considerations

#### Pagination Strategy
- **Configurable Page Size**: 3, 5, 10, 20, 50 posts per page
- **Smart Navigation**: Ellipsis for large page counts
- **URL State**: Page number in URL for bookmarking
- **Smooth Scrolling**: Auto-scroll to top on page change

#### Lazy Loading
- **Reply Threading**: Load nested replies on demand
- **Related Content**: Fetch similar discussions asynchronously
- **Image Loading**: Lazy load avatars and content images
- **Search Optimization**: Debounced search with caching

### Integration Points

#### User System Integration
- **Author Attribution**: Links to user profiles and reputation
- **Voting System**: User-specific vote tracking and display
- **Permission Checks**: Role-based content creation/editing
- **Anonymous Support**: Allow anonymous participation

#### SEO & Meta Management
- **Dynamic Titles**: Thread-specific page titles
- **Meta Descriptions**: Auto-generated from thread excerpts
- **Canonical URLs**: Proper URL structure for search engines
- **Social Sharing**: Open Graph and Twitter Card support

## Layout & Styling Patterns

### Full-Width Page Breakout
For pages that need to break out of the default Layout container (`container mx-auto p-4`) to use full browser width while maintaining normal document flow (non-sticky behavior):

```tsx
// Use this CSS technique to break out of container constraints
<div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
  <div className="px-6 py-8">
    {/* Page content */}
  </div>
</div>
```

#### When to Use
- Chart display pages that need full width for better visualization
- Discussion pages with wide content layouts
- Any page where container constraints feel too narrow

#### Technical Details
- **`w-screen`**: Sets width to full viewport width
- **`relative left-1/2 right-1/2`**: Centers the element
- **`-ml-[50vw] -mr-[50vw]`**: Negative margins extend to full viewport edges
- **Advantages**: Maintains normal document flow, no sticky navbar issues
- **Used in**: `/src/app/chart/page.tsx`

## Python Development Notes
When working with the `natal` library:
- Use Python 3.12+ with modern type hints (`list[int]`, `A | B`, etc.)
- All functions must be type hinted
- Use Google-style docstrings without type information
- Use `typing.Self` instead of forward reference strings

## Documentation Standards

### Tree Map Format Requirement
**CRITICAL: ALL documentation updates MUST use tree map format, NEVER checklists**

```
Documentation Update Structure
├── Problem Analysis
│   ├── Root Cause Identification
│   │   ├── Technical Issue Description
│   │   ├── Impact Assessment
│   │   └── Affected Components
│   └── Solution Architecture
│       ├── Implementation Approach
│       ├── Technical Decisions
│       └── Integration Points
├── Implementation Details
│   ├── Code Changes
│   │   ├── Files Modified
│   │   ├── Functions Added/Updated
│   │   └── Configuration Changes
│   └── Testing Strategy
│       ├── Verification Methods
│       ├── Edge Cases Covered
│       └── Performance Impact
└── Results & Validation
    ├── Feature Functionality
    ├── Performance Metrics
    └── User Experience Impact
```

### Forbidden Documentation Patterns
**❌ NEVER USE:**
- Bulleted lists for technical documentation
- Checklist-style updates
- Linear numbered sequences
- Generic "✅ Fixed X" entries

**✅ ALWAYS USE:**
- Hierarchical tree map structures
- Contextual problem-solution relationships  
- Technical decision trees
- Architecture flow diagrams in text format

## User Approval Workflow

```
User Approval Process Tree
├── Implementation Phase
│   ├── Claude implements fix/feature
│   ├── Code changes completed
│   └── Testing performed
├── Review Phase
│   ├── User examines changes
│   ├── Functionality verification
│   └── Quality assessment
└── Completion Phase
    ├── User says "solved" (approval signal)
    ├── Claude commits changes with descriptive message
    └── Git history updated with proper documentation
```