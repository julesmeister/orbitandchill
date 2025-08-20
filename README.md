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
- **Performance Optimized**: Buttery smooth loading with skeleton states, React.memo, intelligent caching, and modular architecture

### 🏛️ Admin Dashboard
- **Analytics Overview**: Site metrics, user analytics, and traffic monitoring
- **Content Management**: Rich text editor for blog posts and forum threads
- **User Management**: Track user activity and engagement
- **Post Creation**: TipTap-powered rich text editor with full formatting capabilities

### 🌐 Community Features
- **Forum System**: Threaded discussions with visual threading lines and server-side pagination
- **Comment Threading**: SVG-based visual connection system for nested replies
- **Blog Platform**: Publishing system for astrological content with admin management
- **FAQ System**: Centralized knowledge base with 24 comprehensive questions across 6 categories
- **SEO Optimized**: Comprehensive metadata and structured data with no duplicate schemas
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

### User Persistence
- **Anonymous Profiles**: No sign-up required with secure user isolation
- **Data Caching**: Charts and preferences stored locally with IndexedDB + localStorage fallback
- **Cross-session**: Data persists between visits
- **Instant Loading**: Cached data loads immediately with background refresh
- **Secure Isolation**: Each anonymous user gets unique chart cache to prevent data leakage

### Hook Architecture ⭐
- **Modular Design**: Both blog and chart systems split into focused, reusable hooks
- **Single Responsibility**: Each hook handles one specific concern (caching, API operations, UI state)
- **Performance Optimized**: 30-minute blog cache TTL, 24-hour chart cache with smart invalidation
- **Composable**: Main orchestrator hooks (`useBlogData`, `useNatalChart`) compose specialized hooks
- **User Isolation**: Chart caching ensures complete separation between anonymous and authenticated users

### Admin Analytics ⭐
- **Real-time Metrics**: Live user counts and activity tracking with accurate database totals
- **Traffic Analysis**: Visitor patterns and page views with comprehensive dashboard
- **Content Management**: Server-side paginated CRUD operations for posts and threads
- **Performance Optimized**: Separate count loading for navigation vs content pagination (10 per page)
- **Accurate Totals**: Real database counts displayed across all admin interfaces

### Comment Threading System ⭐
- **Visual Connections**: SVG-based threading lines between comments
- **Adaptive Layout**: Dynamic height calculation based on comment hierarchy
- **Performance Optimized**: Lightweight SVG rendering with no JavaScript calculations
- **Reusable Design**: Easily extractable as standalone component library

![Comment Threading Demo](src/components/threading/React-Thread-Lines-For-Comments/Screenshot%202025-06-11%20121301.png)

### Chart System Architecture ⭐
- **Modular Components**: 531-line monolith refactored into 10+ focused components and hooks
- **Performance Optimized**: React.memo, dynamic imports, and 30% smaller bundle size
- **Error Boundaries**: Comprehensive error handling with graceful recovery and retry functionality
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
- **Secure User Isolation**: Advanced cache key generation prevents anonymous user data conflicts
- **Real-time Monitoring**: Built-in performance tracking alerts for renders >16ms
- **Type Safety**: Full TypeScript coverage with consolidated type definitions

### Modular Component System ⭐
- **Chart Components**: Highly optimized modular chart system with 10+ focused components
  - `ChartQuickActions` - Main orchestrator (reduced from 531 to ~350 lines)
  - `ChartActionButton` - Reusable action buttons with animations
  - `RegenerateButton` - Primary chart generation button
  - `PersonFormModal` - Add/edit person data modal
  - `ChartErrorBoundary` - Error recovery with retry functionality
  - `ChartSkeleton` - Loading states and skeleton UI
- **Custom Hooks**: Specialized hooks for performance and maintainability
  - `useChartActions` - Chart operations (share, navigation, person sync)
  - `usePersonFormState` - Form state management
  - `usePerformanceMonitor` - Real-time performance tracking
- **Performance Features**: React.memo, dynamic imports, and bundle optimization
- **Developer Experience**: Performance monitoring, comprehensive TypeScript, and error boundaries

### Content Management ⭐
- **Centralized Data**: Single source of truth for FAQ content with TypeScript interfaces
- **SEO Optimization**: Eliminated duplicate Schema.org FAQPage markups across components
- **Component Reusability**: FAQ structured data component supports multiple page types
- **Content Consistency**: Unified FAQ management prevents content drift and maintenance issues

## 📊 Recent Improvements

### Server-Side Pagination Architecture (Latest)
- ✅ **Optimized Admin Dashboard**: Separated count loading from content pagination for better performance
- ✅ **Consistent Pagination**: Both admin and discussions use 10-per-page server-side pagination
- ✅ **Accurate Database Totals**: Real-time total counts displayed across all interfaces
- ✅ **Architecture Efficiency**: AdminDashboard only loads counts, PostsTab handles content pagination
- ✅ **Performance Optimization**: Reduced unnecessary data loading and improved response times

### Chart Component Optimization
- ✅ **Modular Architecture**: Split 531-line monolith into 10+ focused components
- ✅ **Performance Gains**: 30% smaller bundle, React.memo prevents unnecessary re-renders
- ✅ **Error Resilience**: Error boundaries with retry functionality and graceful degradation
- ✅ **Accessibility**: WCAG 2.1 AA compliance with full keyboard and screen reader support
- ✅ **Dynamic Imports**: Code splitting with skeleton loading states for better UX
- ✅ **Performance Monitoring**: Development-mode alerts for slow renders (>16ms)
- ✅ **Fixed Astrocartography**: Resolved user data passing between chart and astrocartography pages

### FAQ System Consolidation
- ✅ **Eliminated Duplicates**: Removed 4+ duplicate FAQ schemas causing SEO conflicts
- ✅ **Centralized Data**: Created `/src/data/faqData.ts` with 24 comprehensive questions
- ✅ **Enhanced Categories**: Added "Astrology Basics" category with foundational knowledge
- ✅ **Better UX**: Real-time search, color-coded categories, and improved mobile experience
- ✅ **SEO Optimized**: Single FAQPage schema on dedicated `/faq` page prevents conflicts

### Favicon Implementation
- ✅ **Complete Coverage**: All device types (desktop, mobile, tablet, PWA)
- ✅ **Brand Integration**: Theme colors and app manifest with proper branding
- ✅ **Cross-Platform**: Windows tiles, iOS home screen, Android PWA support
- ✅ **Performance**: Optimized file placement and proper MIME types

### Previous Chart System Fixes
- ✅ **User Isolation**: Fixed critical bug where anonymous users saw admin's charts
- ✅ **Cache Security**: Secure cache key generation prevents user data conflicts
- ✅ **Hook Modularization**: Refactored 2000+ line hook into focused components

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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