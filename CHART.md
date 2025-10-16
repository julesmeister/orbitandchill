# Chart System Documentation

> **📚 Comprehensive guide to the natal chart generation and sharing system**

## Quick Navigation

### 🔧 Development & Maintenance
- **[Fixes History](./docs/chart/FIXES_HISTORY.md)** - Chronological record of all critical fixes and improvements
- **[Architecture](./docs/chart/ARCHITECTURE.md)** - System architecture, components, and data flow
- **[Development Guidelines](./docs/chart/DEVELOPMENT.md)** - Development standards, testing, and best practices

### 🚀 Features & Implementation
- **[Sharing System](./docs/chart/SHARING.md)** - Chart sharing, token generation, and public access
- **[User Features](./docs/chart/USER_FEATURES.md)** - Stellium persistence, avatar display, and user experience
- **[Security & Privacy](./docs/chart/SECURITY.md)** - Access control, data protection, and privacy architecture

## System Overview

The chart system provides comprehensive natal chart generation, management, and sharing capabilities with professional-grade astronomical accuracy.

### Core Features

```
Chart System
├── Chart Generation
│   ├── Natal Charts (Professional accuracy using astronomy-engine)
│   ├── Celestial Points (Lilith, Chiron, Nodes, Part of Fortune, Vertex)
│   ├── House Systems (Placidus implementation)
│   └── Aspect Detection (Major & minor aspects with proper orbs)
├── Chart Management
│   ├── User Isolation (Secure per-user caching)
│   ├── People Management (Track multiple birth charts)
│   ├── Chart Caching (24-hour TTL with IndexedDB)
│   └── Database Persistence (Turso/LibSQL backend)
├── Chart Sharing
│   ├── Token Generation (Cryptographically secure tokens)
│   ├── Public URLs (SEO-friendly shareable links)
│   ├── Social Integration (Open Graph, Twitter Cards)
│   └── Community Discovery (Browse shared charts)
└── User Experience
    ├── Responsive Design (Mobile-optimized interface)
    ├── Real-time Updates (Instant chart regeneration)
    ├── Error Boundaries (Graceful error recovery)
    └── Accessibility (WCAG 2.1 AA compliant)
```

### Technology Stack

**Frontend**:
- Next.js 15 (App Router with React Server Components)
- TypeScript (Full type safety)
- Tailwind CSS (Utility-first styling)
- Zustand (State management)
- Dexie (IndexedDB wrapper for caching)

**Backend**:
- Next.js API Routes (RESTful endpoints)
- Turso/LibSQL (Distributed SQLite database)
- astronomy-engine (Professional-grade calculations)

**Key Libraries**:
- `astronomy-engine` - Planetary position calculations (±1 arcminute accuracy)
- `@libsql/client` - Database connectivity
- `dexie` - Client-side IndexedDB caching
- `date-fns` - Date/time manipulation

### Architecture Highlights

#### Modular Service Architecture ✅
```
Chart Generation Flow
├── Orchestration Layer (useNatalChart - 52 lines)
│   └── Coordinates specialized modules
├── Business Services Layer
│   ├── astroCalculationService.ts - Planetary calculations (320 lines)
│   ├── celestialPointsService.ts - Special points (305 lines)
│   └── houseSystemService.ts - Placidus houses (175 lines)
├── Data Services Layer
│   └── chartRenderingService.ts - SVG generation (870 lines)
└── Caching Layer
    ├── useChartCache.ts - Cache management
    └── chartCache.ts - Cache utilities
```

**Benefits**:
- **95% reduction** in main module size (2000+ → 52 lines)
- **Clear separation of concerns** for maintainability
- **Independent testing** of isolated services
- **Performance optimization** through modular code splitting

#### User Isolation Security ✅
```
Cache Key Architecture
├── User-First Design: ${userId}_person_${personId}
├── Hash-Based Identification: Prevents collisions
├── Admin Protection: No fallback contamination
└── Fail-Safe: Anonymous users isolated from admin data
```

## Recent Achievements ✅

### Round 33: Celestial Point Calculation Accuracy (Latest)
- **Fixed**: Incorrect zodiac signs for Chiron, Lunar Nodes, Part of Fortune
- **Method**: Replaced heliocentric/outdated formulas with geocentric ephemeris-based calculations
- **Impact**: ±2° accuracy for Chiron, exact match for Lunar Nodes
- **Details**: [Fixes History - Round 33](./docs/chart/FIXES_HISTORY.md#round-33-celestial-point-calculation-accuracy)

### CODE_ARCHITECTURE_PROTOCOL.md Implementation ✅
- **Refactored**: Monolithic components into modular architecture
- **Result**: 46% code reduction, 30% smaller bundle size
- **Performance**: React.memo optimization, dynamic imports
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Details**: [Architecture - Modular Design](./docs/chart/ARCHITECTURE.md#modular-architecture)

### Unified Chart Sharing System ✅
- **Architecture**: Integrated shared charts into main interface
- **UX Improvement**: Seamless viewing without context switching
- **URL Format**: `https://example.com/chart?shareToken=abc123`
- **Features**: Full functionality for shared charts (regeneration, interpretation)
- **Details**: [Sharing System](./docs/chart/SHARING.md#unified-sharing-architecture)

## Quick Start Guide

### For Developers

```bash
# Install dependencies
npm install

# Run development server (already running - don't restart!)
# Development server is ALWAYS active on http://localhost:3000

# Run type checking
npx tsc --noEmit --skipLibCheck

# Run linting
npm run lint

# Build for production
npm run build
```

### Key Entry Points

**Chart Generation**:
```typescript
import { generateNatalChart } from '@/utils/natalChart';

const result = await generateNatalChart({
  name: "John Doe",
  dateOfBirth: "1990-01-15",
  timeOfBirth: "14:30",
  locationOfBirth: "New York, USA",
  coordinates: { lat: "40.7128", lon: "-74.0060" }
});
```

**Chart Sharing**:
```typescript
import { shareChart } from '@/hooks/useChartAPI';

const shareUrl = await shareChart(chartId);
// Returns: https://example.com/chart?shareToken=abc123
```

**People Management**:
```typescript
import { usePeopleAPI } from '@/hooks/usePeopleAPI';

const { people, addPerson, selectedPerson } = usePeopleAPI();
```

## Documentation Index

### Primary Documentation

| Document | Description | Key Topics |
|----------|-------------|------------|
| [**Fixes History**](./docs/chart/FIXES_HISTORY.md) | Chronological record of critical fixes | Round 33-23: Celestial points, aspects, data priority, loading states, form UX, modular architecture |
| [**Architecture**](./docs/chart/ARCHITECTURE.md) | System architecture & components | API endpoints, hooks, services, database schema, caching strategy |
| [**Sharing System**](./docs/chart/SHARING.md) | Chart sharing implementation | Token generation, public URLs, social media, community discovery |
| [**User Features**](./docs/chart/USER_FEATURES.md) | User-facing functionality | Stellium persistence, avatar display, profile management |
| [**Security**](./docs/chart/SECURITY.md) | Security & privacy architecture | Access control, data protection, user isolation |
| [**Development**](./docs/chart/DEVELOPMENT.md) | Development guidelines | Standards, testing, performance, accessibility |

### Related Documentation

- **[README.md](./README.md)** - Project overview and setup
- **[GOOGLE_AUTH_DOCUMENTATION.md](./GOOGLE_AUTH_DOCUMENTATION.md)** - Authentication system
- **[DATABASE.md](./DATABASE.md)** - Database schema and architecture
- **[CODE_ARCHITECTURE_PROTOCOL.md](./CODE_ARCHITECTURE_PROTOCOL.md)** - Architecture standards

## Support & Contributing

### Getting Help

- **Documentation**: Start with the Quick Navigation above
- **Issues**: Check [Fixes History](./docs/chart/FIXES_HISTORY.md) for known issues and resolutions
- **Development**: Review [Development Guidelines](./docs/chart/DEVELOPMENT.md) for standards

### Development Workflow

1. **Read Documentation**: Familiarize yourself with relevant docs
2. **Follow Standards**: Adhere to [CODE_ARCHITECTURE_PROTOCOL.md](./CODE_ARCHITECTURE_PROTOCOL.md)
3. **Test Thoroughly**: Follow testing guidelines in [Development](./docs/chart/DEVELOPMENT.md)
4. **Document Changes**: Update relevant documentation files
5. **Commit with Details**: Use descriptive commit messages

---

**Last Updated**: 2025-10-16
**Documentation Version**: 1.0.0
**System Status**: ✅ Production Ready
