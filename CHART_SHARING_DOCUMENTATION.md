# Chart Sharing Documentation

## Overview

The application provides a comprehensive chart sharing system that allows users to generate public shareable links for their natal charts. This system includes both technical infrastructure and user experience features designed to facilitate easy sharing while maintaining security and privacy controls.

## Current Implementation

### Architecture Overview

The chart sharing system follows a token-based approach with the following components:

```
User Chart → Share Token Generation → Public URL → Shared Chart Display
     ↓                ↓                    ↓              ↓
  Private Chart    API Endpoint      Public Access    Optimized UX
```

### Core Components

#### 1. API Endpoints

**`/api/charts/[id]/share` (POST)**
- Generates or retrieves existing share tokens for charts
- Requires `chartId` and `userId` for authentication
- Returns `shareToken` and complete `shareUrl`
- Constructs URLs in format: `${baseUrl}/chart/shared/${shareToken}`

**`/api/charts/shared` (GET)**
- Retrieves shared charts by token: `?shareToken=<token>`
- Lists recent shared charts: `?list=true` (up to 10 by default)
- Enforces `isPublic: true` flag for security
- Returns sanitized chart data for public consumption

**`/api/charts/[id]` (GET)**
- Supports both private and shared access
- With `shareToken` parameter for public access
- With `userId` parameter for private access
- Automatic access control based on chart's `isPublic` flag

#### 2. Frontend Components

**Chart Display Page (`/src/app/chart/page.tsx`)**
- Main chart page with sharing functionality
- Share button integrated into `NatalChartDisplay` component
- Native Web Share API support with clipboard fallback
- Status toast notifications for user feedback

**Shared Chart Page (`/src/app/chart/shared/[token]/page.tsx`)**
- Dedicated public viewing page for shared charts
- Full-width responsive layout optimized for sharing
- SEO-friendly with proper meta tags and structured data
- Error handling for invalid/expired tokens
- Call-to-action for visitors to create their own charts

**Chart Quick Actions (`/src/components/charts/ChartQuickActions.tsx`)**
- Share button with loading states
- Clipboard integration for share URLs
- Error handling and user feedback

#### 3. Database Layer

**Chart Service (`/src/db/services/chartService.ts`)**
- `generateShareToken()` - Creates unique share tokens
- `getChartByShareToken()` - Retrieves charts by token
- `getRecentSharedCharts()` - Lists recent public charts
- Enforces access control and `isPublic` flag validation

#### 4. Hooks and Utilities

**`useNatalChart` Hook (`/src/hooks/useNatalChart.ts`)**
- `shareChart()` method for generating share links
- Integration with chart generation and caching
- Error handling and user feedback

**`useChartAPI` Hook (`/src/hooks/useChartAPI.ts`)**
- Comprehensive API wrapper for chart operations
- Toast notifications for all sharing actions
- State management for sharing operations

**`useSharedCharts` Hook (`/src/hooks/useSharedCharts.ts`)**
- Fetches and manages recent shared charts
- Converts chart data to `SharedChart` format
- Used by `PeopleSelector` for community discovery

## User Experience Features

### Sharing Flow

1. **Chart Generation**: User creates a natal chart through the main interface
2. **Share Button**: Prominent share button in chart display
3. **Token Generation**: System generates unique share token via API
4. **URL Creation**: Complete shareable URL constructed automatically
5. **Native Sharing**: Web Share API for mobile devices, clipboard fallback
6. **Feedback**: Toast notifications confirm successful sharing

### Public Viewing Experience

1. **Direct Access**: Shared URLs work without authentication
2. **Optimized Layout**: Full-width design for better chart visibility
3. **Chart Information**: Birth data summary and generation details
4. **Call to Action**: Prominently placed button to create own chart
5. **Error Handling**: Clear messaging for invalid/expired links

### Discovery Features

1. **Recent Shared Charts**: Browse community-shared charts
2. **People Selector**: Import shared charts as "people" in your collection
3. **Chart Metadata**: Subject names, descriptions, and generation dates

## Security & Privacy

### Access Control

- **Public Flag**: Charts must be explicitly marked `isPublic: true`
- **Token-Based**: Unique tokens prevent unauthorized access
- **No Authentication**: Shared charts accessible without login
- **User Ownership**: Only chart owners can generate share tokens

### Data Protection

- **Sanitized Data**: Only necessary chart data exposed in public API
- **No User Data**: Shared charts don't expose user account information
- **Secure Tokens**: Cryptographically secure share tokens
- **Expiration**: Tokens remain valid until chart is deleted or made private

## Technical Implementation Details

### Share Token Generation

```typescript
// API: /api/charts/[id]/share
const shareToken = await ChartService.generateShareToken(chartId, userId);
const shareUrl = `${baseUrl}/chart/shared/${shareToken}`;
```

### Chart Sharing in Components

```typescript
// NatalChartDisplay component
onShare={async () => {
  if (cachedChart?.id) {
    const shareUrl = await shareChart(cachedChart.id);
    if (shareUrl) {
      // Native sharing with clipboard fallback
      if (navigator.share) {
        await navigator.share({
          title: `${chartName} Natal Chart`,
          text: `Check out ${chartName} natal chart from ${BRAND.name}!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
      }
    }
  }
}}
```

### Public Chart Access

```typescript
// Shared chart page
const response = await fetch(`/api/charts/shared?shareToken=${token}`);
const { chart } = await response.json();
```

## Performance Considerations

### Caching Strategy

- **Local Cache**: 24-hour TTL for frequently accessed charts
- **API Caching**: Existing chart deduplication prevents regeneration
- **Database Optimization**: Indexed queries for share token lookups

### Loading States

- **Progressive Loading**: Skeleton screens during chart fetching
- **Error Boundaries**: Graceful handling of failed share requests
- **Optimistic Updates**: Immediate feedback before API confirmation

## Current Limitations & Areas for Improvement

### 1. Share Token Management

**Current State**: Tokens are permanent until chart deletion
**Improvements Needed**:
- Expiration dates for share tokens
- Ability to revoke/regenerate tokens
- Analytics on share link usage

### 2. Social Media Integration

**Current State**: Basic Web Share API support
**Improvements Needed**:
- Rich preview cards for social media platforms
- Custom share messages for different platforms
- Open Graph meta tags optimization

### 3. Chart Customization for Sharing

**Current State**: Shares the exact chart as generated
**Improvements Needed**:
- Custom titles and descriptions for shared charts
- Theme selection for public viewing
- Privacy controls for birth data display

### 4. Discovery and Community Features

**Current State**: Basic recent charts listing
**Improvements Needed**:
- Enhanced chart discovery with filtering
- Chart collections and favorites
- User profiles for chart creators (optional)

### 5. Analytics and Insights

**Current State**: No sharing analytics
**Improvements Needed**:
- View counts for shared charts
- Geographic distribution of viewers
- Popular charts and trending shares

### 6. Mobile Experience

**Current State**: Basic responsive design
**Improvements Needed**:
- Optimized mobile chart viewing
- Touch-friendly sharing controls
- App-like sharing experience

### 7. Chart Variations for Sharing

**Current State**: Only natal charts supported
**Improvements Needed**:
- Transit charts sharing
- Synastry charts sharing
- Composite charts sharing

## Recommended Improvements

### Priority 1: Enhanced Share Management

```typescript
// Proposed API extensions
interface ShareSettings {
  expirationDate?: Date;
  customTitle?: string;
  customDescription?: string;
  allowDownload?: boolean;
  showBirthData?: boolean;
}

POST /api/charts/[id]/share
{
  userId: string;
  settings: ShareSettings;
}
```

### Priority 2: Social Media Optimization

```typescript
// Enhanced meta tags for shared charts
const generateShareMetaTags = (chart: SharedChart) => ({
  title: `${chart.subjectName}'s Natal Chart | ${BRAND.name}`,
  description: `Explore ${chart.subjectName}'s cosmic blueprint created on ${chart.createdAt}`,
  image: `/api/charts/${chart.id}/preview.png`, // Chart preview image
  url: `/chart/shared/${chart.shareToken}`
});
```

### Priority 3: Community Discovery

```typescript
// Enhanced discovery API
GET /api/charts/shared?category=natal&timeframe=week&limit=20
{
  charts: SharedChart[];
  filters: {
    categories: string[];
    timeframes: string[];
    sortOptions: string[];
  };
}
```

### Priority 4: Analytics Integration

```typescript
// Share analytics tracking
interface ShareAnalytics {
  chartId: string;
  shareToken: string;
  viewCount: number;
  uniqueViewers: number;
  geographicDistribution: { country: string; views: number }[];
  referrerSources: { source: string; count: number }[];
}
```

## Integration Points

### With User System
- Anonymous users can view shared charts
- Logged-in users can import shared charts as "people"
- Chart ownership and permission management

### With Chart Generation
- Automatic share token generation for public charts
- Integration with chart regeneration workflow
- Caching considerations for shared charts

### With Navigation
- Direct deep linking to shared charts
- Breadcrumb navigation for shared chart pages
- SEO-friendly URL structure

## Development Guidelines

### Adding New Sharing Features

1. **API First**: Design API endpoints before frontend components
2. **Security**: Always validate chart ownership and public flags
3. **Performance**: Consider caching implications for new features
4. **User Experience**: Provide clear feedback for all sharing actions
5. **Mobile**: Ensure all sharing features work on mobile devices

### Testing Considerations

- Token generation and validation
- Permission checks for chart access
- Error handling for invalid tokens
- Mobile sharing functionality
- Social media preview generation

## Conclusion

The current chart sharing implementation provides a solid foundation for sharing natal charts with the community. The system is secure, user-friendly, and performant. However, there are significant opportunities for enhancement, particularly in areas of social media integration, community discovery, and advanced sharing controls.

The recommended improvements would transform the sharing system from a basic link-sharing mechanism into a comprehensive social astrology platform that encourages community engagement and chart exploration.