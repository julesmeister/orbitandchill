# 🌟 Orbit and Chill

**A modern astrology platform combining precise natal chart generation with community engagement**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)](https://python.org/)

## ✨ Features

### 🎯 Core Functionality
- **Free Natal Chart Generation**: Create precise astrological charts using astronomy-engine
- **Location Search**: Intelligent location autocomplete powered by Nominatim OpenStreetMap API
- **User Persistence**: Anonymous user profiles with data caching using Zustand + IndexedDB
- **Responsive Design**: Beautiful UI that works perfectly on all devices
- **Performance Optimized**: Buttery smooth loading with optimized skeleton states, React.memo, intelligent caching with instant cached content display, background refresh, and modular architecture

### 🏛️ Admin Dashboard
- **Analytics**: Integrated with Google Analytics for comprehensive tracking
- **Content Management**: Rich text editor for blog posts and forum threads
- **User Management**: Track user activity and engagement
- **Post Creation**: TipTap-powered rich text editor with full formatting capabilities

### 🌐 Community Features
- **Forum System**: Threaded discussions with visual threading lines and server-side pagination
- **Comment Threading**: SVG-based visual connection system for nested replies
- **Blog Platform**: Publishing system for astrological content with admin management
- **User Profiles**: Complete profile system with SEO metadata and dynamic user data
- **FAQ System**: Centralized knowledge base with 24 comprehensive questions across 6 categories
- **SEO Optimized**: Enterprise-grade SEO with Google Search Console compliance
- **Pagination Architecture**: Consistent server-side pagination (10 per page) across admin and discussions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+ (for natal chart calculations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/orbit-and-chill.git
   cd orbit-and-chill
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python library dependencies**
   ```bash
   cd natal
   poetry install
   # or with pip
   pip install -r requirements.txt
   ```

4. **Start development servers**
   ```bash
   # Frontend (Next.js)
   npm run dev

   # Python documentation (optional)
   cd natal
   poetry run mkdocs serve
   ```

5. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Python docs: [http://localhost:8000](http://localhost:8000)

## 🏗️ Architecture

### Frontend (Next.js 15)
```
src/
├── app/                    # Next.js App Router
│   ├── [username]/        # User profile pages with SEO ⭐ NEW
│   │   ├── page.tsx       # Server-side metadata generation
│   │   └── UserProfilePageClient.tsx  # Complete client functionality
│   ├── admin/             # Admin dashboard with server-side pagination ⭐
│   │   └── page.tsx       # Dashboard with separated count loading
│   ├── discussions/       # Forum discussions with pagination ⭐
│   │   ├── page.tsx       # 10-per-page server-side pagination
│   │   └── DiscussionsPageClient.tsx  # Real database totals
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/             # Admin-specific components ⭐
│   │   ├── AdminDashboard.tsx    # Optimized count-only loading
│   │   ├── PostsTab.tsx          # Server-side content pagination
│   │   └── posts/PostsList.tsx   # Accurate total displays
│   ├── charts/            # Modular chart system ⭐
│   │   ├── components/    # Chart sub-components
│   │   ├── hooks/         # Chart-specific hooks
│   │   └── types.ts       # Chart type definitions
│   ├── discussions/       # Discussion components ⭐
│   │   ├── DiscussionsSearchFilters.tsx  # Refresh functionality
│   │   └── DiscussionsPageContent.tsx    # Pagination integration
│   ├── threading/         # Comment threading system ⭐
│   ├── forms/             # Form components
│   └── reusable/          # Shared components
├── hooks/                 # Custom React hooks ⭐
│   ├── useBlogData.ts         # Main blog data orchestrator
│   ├── useBlogCache.ts        # Caching & data fetching
│   ├── useBlogFilters.ts      # Filtering & pagination
│   ├── useBlogSidebar.ts      # Popular/recent posts
│   ├── useFeaturedPosts.ts    # Homepage featured articles
│   ├── useNatalChart.ts       # Main chart orchestrator
│   ├── useChartCache.ts       # Chart caching & persistence
│   ├── useChartOperations.ts  # Chart API operations
│   ├── useDiscussions.ts      # Server-side pagination hook
│   ├── useDiscussionForm.ts   # Fixed title update handling
│   └── useRealMetrics.ts      # Fixed to use totalThreads parameter
├── data/                  # Centralized data sources
│   └── faqData.ts             # FAQ system with 24 questions ⭐
├── services/              # API service layers
│   └── chartApiService.ts     # Chart API operations
├── store/                 # Zustand state management ⭐
│   └── admin/
│       ├── api.ts             # Server-side pagination API (limit=10)
│       └── threads.ts         # loadThreadCounts() for dashboard
├── types/                 # TypeScript type definitions
│   └── chart.ts               # Chart-related types ⭐
└── utils/                 # Utility functions
    ├── chartCache.ts          # Chart caching utilities ⭐
    └── threading/             # Threading utilities (legacy)
```

### Backend Library (Python)
```
natal/
├── natal/                 # Core library
│   ├── chart.py          # Chart generation
│   ├── data.py           # Data models
│   └── utils.py          # Utility functions
├── tests/                 # Test suite
└── docs/                  # Documentation
```

### Public Assets
```
public/
├── favicon.ico                    # Main favicon
├── apple-touch-icon.png          # iOS home screen icon
├── site.webmanifest              # PWA configuration
├── browserconfig.xml             # Windows tile configuration
└── images/
    └── favicon/                   # Complete favicon set
        ├── favicon-16x16.png      # Small favicon
        ├── favicon-32x32.png      # Medium favicon
        ├── android-chrome-192x192.png  # Android icon
        ├── android-chrome-512x512.png  # High-res Android
        └── apple-touch-icon.png   # Apple touch icon
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand
- **Database**: Dexie (IndexedDB)
- **Rich Text**: TipTap editor
- **Location API**: Nominatim OpenStreetMap

### Backend Library
- **Language**: Python 3.8+
- **Astrology Engine**: astronomy-engine (MIT license)
- **Chart Generation**: Custom SVG rendering
- **Documentation**: MkDocs
- **Testing**: pytest

## 📝 Usage Examples

### Generate a Natal Chart
```python
from natal import Data, Chart

# Create chart data
data = Data(
    name="John Doe",
    utc_dt="1990-01-15 14:30",
    lat=40.7128,
    lon=-74.0060,
)

# Generate SVG chart
chart = Chart(data, width=600)
svg_string = chart.svg
```

### Access Admin Dashboard
1. Navigate to `/admin` (no authentication required in demo mode)
2. Manage posts, view analytics, and monitor traffic
3. Create content using the rich text editor

## 🎨 Key Features in Detail

### Favicon & PWA Support ⭐
- **Cross-Platform Icons**: Complete favicon set for all devices and browsers
- **PWA Ready**: Android Chrome icons and web app manifest configured
- **iOS Support**: Apple touch icon for iOS home screen installation
- **Windows Compatibility**: Browserconfig.xml for Windows tiles and taskbar
- **SEO Optimized**: Proper meta tags and icon declarations for maximum compatibility

### FAQ System ⭐
- **Centralized Knowledge Base**: 24 comprehensive questions across 6 categories
- **Smart Search**: Real-time filtering across all FAQ content
- **Color-Coded Categories**: Visual organization with category indicators
- **SEO Structured Data**: Proper Schema.org markup with no duplicate schemas
- **Responsive Design**: Mobile-optimized accordion interface

### Location Search
- **Smart Autocomplete**: Real-time location suggestions
- **Coordinates**: Automatic latitude/longitude extraction
- **Caching**: Efficient API usage with local storage

### User Persistence & Profiles ⭐
- **Anonymous Profiles**: No sign-up required with secure user isolation
- **Data Caching**: Charts and preferences stored locally with IndexedDB + localStorage fallback
- **Cross-session**: Data persists between visits
- **Instant Loading**: Cached data loads immediately with background refresh, no skeleton delays for cached content
- **Optimized Loading States**: Smart skeleton logic - only shows on first visit, cached content appears instantly
- **Background Refresh**: Fresh data loads silently without interrupting user experience
- **Secure Isolation**: Each anonymous user gets unique chart cache to prevent data leakage
- **Profile Pages**: Complete user profiles with SEO metadata and dynamic content
- **Privacy Controls**: User-controlled visibility of birth data and astrological information

### Hook Architecture ⭐

> **📚 Complete Hook Documentation**: See [CLAUDE.md](./CLAUDE.md) for detailed hook architecture and performance patterns

- **Modular Design**: Focused, reusable hooks with single responsibility principles
- **Performance Optimized**: Smart caching with instant display and background refresh  
- **User Isolation**: Secure separation between anonymous and authenticated users

### Admin System ⭐

> **📚 Complete Admin Documentation**: See [ADMIN_DOCUMENTATION.md](./ADMIN_DOCUMENTATION.md) for detailed admin system implementation

- **Google Analytics Integration**: Professional analytics without custom overhead
- **Content Management**: Server-side paginated CRUD operations for posts and threads  
- **Performance Optimized**: Efficient pagination (10 per page) with accurate totals

### Comment Threading System ⭐

> **📚 Complete Threading Documentation**: See [DISCUSSIONS_INTEGRATION.md](./DISCUSSIONS_INTEGRATION.md) for detailed threading system implementation

- **Visual Connections**: SVG-based threading lines between comments
- **Performance Optimized**: Lightweight rendering with no JavaScript calculations
- **Reusable Design**: Easily extractable as standalone component library

### Chart System Architecture ⭐

> **📚 Complete Chart Documentation**: See [CHART_SHARING_DOCUMENTATION.md](./CHART_SHARING_DOCUMENTATION.md) for detailed chart system implementation

- **Modular Components**: Refactored 531-line monolith into 10+ focused components and hooks
- **Performance Optimized**: React.memo, dynamic imports, and 30% smaller bundle size
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support

### Modular Component System ⭐

> **📚 Component Architecture Details**: See [CLAUDE.md](./CLAUDE.md) for complete component system architecture

- **Chart Components**: Highly optimized modular system with 10+ focused components
- **Custom Hooks**: Specialized hooks for performance and maintainability  
- **Performance Features**: React.memo, dynamic imports, and bundle optimization

### Content Management ⭐

> **📚 FAQ System Details**: See [SEO.md](./SEO.md) for complete FAQ system and content management implementation

- **Centralized Data**: Single source of truth for FAQ content with TypeScript interfaces
- **SEO Optimization**: Eliminated duplicate Schema.org FAQPage markups across components
- **Content Consistency**: Unified FAQ management prevents content drift and maintenance issues

## 📊 Recent Improvements

### Analytics System Optimization - COMPLETED (Round 19 - Latest)

> **📚 Analytics Documentation**: See [GOOGLE_ANALYTICS_SETUP.md](./GOOGLE_ANALYTICS_SETUP.md) for Google Analytics implementation

**Key Improvements:**
- **Eliminated Redundancy**: Removed custom analytics system in favor of Google Analytics
- **Reduced Database Load**: Deleted analytics tables and services (analytics_traffic, analytics_engagement)
- **Simplified Maintenance**: Removed 15+ custom analytics API endpoints
- **Admin Dashboard Update**: Replaced custom traffic tab with Google Analytics link
- **Performance Gain**: No more duplicate tracking overhead

### Featured Articles Loading Performance Optimization - COMPLETED (Round 18)

> **📚 Complete Implementation Details**: See [CLAUDE.md](./CLAUDE.md) for detailed performance optimization guidelines and technical implementation

**Key Improvements:**
- **Instant Cached Content**: Cached data displays immediately without skeleton delays
- **Background Refresh**: Fresh data loads silently without UI interruption  
- **Smart Debouncing**: 30-second API call deduplication with concurrent request prevention
- **Optimized Loading States**: Skeleton only on first visit, cached content appears instantly

### Google Search Console Indexing Issues - RESOLVED (Round 17)

> **📚 Full SEO Documentation**: See [SEO.md](./SEO.md) for complete SEO implementation details

**🚨 CRITICAL SEO FIXES:** All Google Search Console indexing problems have been completely resolved

```
Google Search Console Issues - FIXED
├── 🔴 "Excluded by 'noindex' tag" (2 pages) → ✅ RESOLVED
│   ├── Problem: robots.txt `Disallow: /*?*` blocked ALL parameterized URLs
│   ├── Impact: Discussion categories, pagination, search results blocked
│   └── Solution: Specific parameter blocking with explicit Allow rules
│
├── 🔴 "Crawled - currently not indexed" (3 pages) → ✅ RESOLVED  
│   ├── Problem: User profile pages had ZERO SEO metadata (client-side only)
│   ├── Impact: Profile pages invisible to search engines
│   └── Solution: Added server-side generateMetadata() with dynamic user data
│
├── 🛡️ Test Page Security → ✅ ENHANCED
│   ├── Problem: Development test pages publicly indexable
│   └── Solution: Added `*/test/*` blocking in robots.txt
│
└── 📍 Sitemap Coverage → ✅ COMPLETED
    ├── Added: `/event-chart` and discussion category URLs
    └── Enhanced: Complete route coverage with proper priorities
```

**🎯 User Profile Pages - NEW SEO IMPLEMENTATION:**
```
User Profile SEO Enhancement
├── ✅ Server-Side Metadata
│   ├── Dynamic titles with astrological data
│   └── Privacy-aware descriptions
├── ✅ Social Optimization
│   ├── Open Graph profile sharing
│   └── Twitter Cards with user metadata
├── ✅ Component Integrity
│   ├── All original functionality preserved
│   └── Full client-side features maintained
└── ✅ Build Verification
    ├── Proper 404s for non-existent users
    └── 175 pages generated successfully
```

### Discussion Slug Persistence & Database Resilience

> **📚 Complete Database Implementation**: See [API_DATABASE_PROTOCOL.md](./API_DATABASE_PROTOCOL.md) and [DISCUSSIONS_INTEGRATION.md](./DISCUSSIONS_INTEGRATION.md) for detailed implementation

**Key Fixes:**
- **Admin Interface**: PostsTab slug editing now persists to database correctly  
- **URL Routing**: Fixed 404 errors after admin slug edits
- **Database Patterns**: Enhanced field validation and connection strategies

### Server-Side Pagination Architecture

> **📚 Complete Pagination Details**: See [ADMIN_DOCUMENTATION.md](./ADMIN_DOCUMENTATION.md) for detailed pagination implementation

**Key Improvements:**
- **Optimized Admin Dashboard**: Separated count loading from content pagination
- **Consistent Standards**: 10-per-page server-side pagination across all interfaces
- **Performance Gains**: Reduced unnecessary data loading with targeted queries

### Chart Component Optimization
```
Chart System Refactoring
├── ✅ Modular Architecture
│   ├── Split 531-line monolith into 10+ focused components
│   └── Better maintainability and code organization
├── ✅ Performance Gains
│   ├── 30% smaller bundle size
│   ├── React.memo prevents unnecessary re-renders
│   └── Dynamic imports with code splitting
├── ✅ Reliability Features
│   ├── Error boundaries with retry functionality
│   ├── Graceful degradation on failures
│   └── Development-mode performance alerts (>16ms)
├── ✅ Accessibility Compliance
│   ├── WCAG 2.1 AA compliance
│   ├── Full keyboard navigation support
│   └── Screen reader compatibility
└── ✅ User Experience
    ├── Skeleton loading states for better UX
    └── Fixed Astrocartography user data passing
```

### FAQ System Consolidation
```
FAQ System Enhancement
├── ✅ Data Architecture
│   ├── Eliminated 4+ duplicate FAQ schemas causing SEO conflicts
│   ├── Created centralized `/src/data/faqData.ts`
│   └── 24 comprehensive questions across categories
├── ✅ Content Enhancement
│   ├── Added "Astrology Basics" category
│   └── Foundational knowledge integration
├── ✅ User Experience
│   ├── Real-time search functionality
│   ├── Color-coded category system
│   └── Improved mobile experience
└── ✅ SEO Optimization
    ├── Single FAQPage schema on dedicated `/faq` page
    └── Eliminated schema conflicts and duplicates
```

### Favicon Implementation
```
Favicon & PWA System
├── ✅ Complete Coverage
│   ├── All device types (desktop, mobile, tablet, PWA)
│   └── Cross-platform compatibility
├── ✅ Brand Integration
│   ├── Theme colors and app manifest
│   └── Proper branding consistency
├── ✅ Platform Support
│   ├── Windows tiles configuration
│   ├── iOS home screen icons
│   └── Android PWA support
└── ✅ Performance Optimization
    ├── Optimized file placement
    └── Proper MIME types
```

### Previous Chart System Fixes
```
Chart System Security & Architecture
├── ✅ User Isolation
│   ├── Fixed critical bug where anonymous users saw admin's charts
│   └── Complete user data separation
├── ✅ Cache Security
│   ├── Secure cache key generation
│   └── Prevents user data conflicts
└── ✅ Hook Modularization
    ├── Refactored 2000+ line hook
    └── Split into focused components
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Build and deploy
npm run build
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build
npm start
```

## 📚 Documentation Protocol

> **⚠️ CRITICAL**: Follow this protocol to avoid duplicate documentation and maintain consistency

### Primary Documentation Files (Update These)
```
Documentation Hierarchy & Responsibility
├── 📋 README.md (Master Index)
│   ├── Role: Main project overview and feature summary
│   ├── Updates: Major feature releases, architecture changes
│   └── Cross-references: All major documentation files
│
├── 🔧 CLAUDE.md (Development Guidelines)  
│   ├── Role: Claude Code instructions and development patterns
│   ├── Updates: New development protocols, coding standards
│   └── Cross-references: Related implementation docs
│
├── 🗄️ DATABASE.md (Database Schema)
│   ├── Role: Database structure and configuration
│   ├── Updates: Schema changes, migration notes
│   └── Cross-references: API_DATABASE_PROTOCOL.md, service docs
│
├── 🌐 SEO.md (SEO Strategy)
│   ├── Role: Complete SEO implementation details
│   ├── Updates: SEO fixes, Google Search Console issues
│   └── Cross-references: SITEMAP-DOCUMENTATION.md
│
├── 📊 GOOGLE_ANALYTICS_SETUP.md (Analytics)
│   ├── Role: Google Analytics implementation guide
│   ├── Updates: Analytics configuration and tracking
│   └── Cross-references: Admin documentation
│
├── 🏛️ ADMIN_DOCUMENTATION.md (Admin System)
│   ├── Role: Complete admin interface documentation
│   ├── Updates: Admin features, dashboard changes
│   └── Cross-references: ADMIN_DASHBOARD_INTEGRATION.md
│
├── 💬 DISCUSSIONS_INTEGRATION.md (Forum System)
│   ├── Role: Complete forum and discussion system
│   ├── Updates: Forum features, pagination, threading
│   └── Cross-references: Database, API, admin docs
│
└── 🔗 API_DATABASE_PROTOCOL.md (Implementation Patterns)
    ├── Role: Technical implementation guidelines
    ├── Updates: Database patterns, error handling
    └── Cross-references: Service implementations
```

### Secondary Documentation (Reference Only)
```
Specialized Documentation - Index to Primary Docs
├── 🔐 GOOGLE_AUTH_DOCUMENTATION.md → INDEX to README.md User System
├── 📊 CHART_SHARING_DOCUMENTATION.md → INDEX to README.md Chart System  
├── 🌍 SITEMAP-DOCUMENTATION.md → INDEX to SEO.md Implementation
├── 🌱 DISCUSSIONS_SEEDING_PLAN.md → INDEX to DISCUSSIONS_INTEGRATION.md
├── 📈 API_PROGRESS.md → INDEX to API_DATABASE_PROTOCOL.md
└── All other *.md files → INDEX to appropriate primary doc
```

### Documentation Update Protocol

**STEP 1: Identify Primary Document**
- Find the main documentation file responsible for your topic
- Check cross-references to ensure you're updating the right place

**STEP 2: Update Primary Document Only**  
- Make changes ONLY in the primary documentation file
- Do NOT duplicate content across multiple files

**STEP 3: Add Cross-References in Secondary Files**
```markdown
> **📚 Related Documentation:**
> - **Main Topic**: See [PRIMARY_DOC.md](./PRIMARY_DOC.md) for complete implementation
> - **Secondary Topic**: See [RELATED_DOC.md](./RELATED_DOC.md) for related patterns
```

**STEP 4: Update README.md for Major Changes**
- Add new features to the appropriate README.md section
- Update the "Recent Improvements" section for significant changes
- Ensure cross-references point to primary documentation

### Avoiding Duplicate Content
```
❌ NEVER DO THIS:
├── Feature documented in README.md
├── Same feature documented in FEATURE_SPECIFIC.md  
├── Same feature documented in API_PROGRESS.md
└── Result: Maintenance nightmare, outdated information

✅ ALWAYS DO THIS:
├── Feature documented in PRIMARY_DOC.md (complete details)
├── README.md references PRIMARY_DOC.md (summary only)
├── RELATED_DOC.md indexes to PRIMARY_DOC.md  
└── Result: Single source of truth, easy maintenance
```

### Cross-Reference Format
```markdown
> **📚 Related Documentation:**
> - **Primary Topic**: See [MAIN_DOC.md](./MAIN_DOC.md) for complete implementation
> - **Secondary Topic**: See [RELATED_DOC.md](./RELATED_DOC.md) for related patterns
> - **Technical Details**: See [TECH_DOC.md](./TECH_DOC.md) for implementation specifics
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow Documentation Protocol**: Update only primary documentation files
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Astronomy-Engine**: Professional-grade astronomical calculations (±1 arcminute precision)
- **OpenStreetMap**: Free location data via Nominatim
- **Next.js Team**: Outstanding React framework
- **Tailwind CSS**: Beautiful utility-first CSS

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our forum for discussions

---

**Built with ❤️ for the astrology community**