# Tarot Learning Game Implementation Progress

## 🎯 Project Overview
Implementation of an interactive tarot learning game as a premium feature. Users learn the meanings of all 78 tarot cards through AI-powered scenarios and compete on a global leaderboard.

## 📋 Feature Tree Map & Status

```
🔮 Tarot Learning Game
├── 🎨 Frontend Components
│   ├── ✅ Hero Section Integration (guides/page.tsx)
│   │   ├── ✅ Left-aligned "Learning Resources" 
│   │   ├── ✅ Right-side Tarot Learning Card
│   │   ├── ✅ Premium badge & new feature indicator
│   │   └── ✅ Link to /guides/tarot-learning
│   │
│   ├── 🎮 Game Interface (src/app/guides/tarot-learning/page.tsx)
│   │   ├── ✅ Welcome Screen
│   │   │   ├── ✅ How to Play guide (4 steps)
│   │   │   ├── ✅ Scoring system explanation
│   │   │   ├── ✅ Global leaderboard display
│   │   │   └── ✅ Start Learning Journey button
│   │   │
│   │   ├── ✅ Game Session Interface (src/components/tarot/TarotGameInterface.tsx)
│   │   │   ├── ✅ Full-width layout with 3-column grid
│   │   │   ├── ✅ Card display with proper aspect ratio (w-48 h-72)
│   │   │   ├── ✅ Traditional meaning (shows after evaluation only)
│   │   │   ├── ✅ AI-generated situation/scenario presentation  
│   │   │   ├── ✅ Text area for user interpretation
│   │   │   ├── ✅ Submit button (hidden until text entered)
│   │   │   ├── ✅ AI feedback display (clean formatting, no asterisks)
│   │   │   ├── ✅ Beginner hints section with show/hide
│   │   │   ├── ✅ Game stats (ranking, cards completed)
│   │   │   ├── ✅ Level progress bar (FIXED database updates)
│   │   │   ├── ✅ Next card / End game buttons
│   │   │   ├── ✅ Refresh situation button with StatusToast
│   │   │   └── ✅ Auto-refresh progress after evaluation
│   │   │
│   │   ├── 🔒 Premium Modal (TarotPremiumModal.tsx)
│   │   │   ├── ✅ Feature explanation
│   │   │   ├── ✅ Benefits list
│   │   │   ├── ✅ Upgrade CTA
│   │   │   └── ✅ Maybe Later option
│   │   │
│   │   ├── 📊 Progress Tracking Components
│   │   │   ├── ✅ TarotLeaderboard.tsx - Global rankings sidebar
│   │   │   ├── ✅ CardMasteryGrid.tsx - 78-card progress visualization
│   │   │   ├── ✅ LevelBadge.tsx - Dynamic level calculation with expandable modal
│   │   │   ├── ✅ LevelDetailsModal.tsx - Bottom sheet modal for level progression details
│   │   │   ├── ✅ StatusToast.tsx - Loading notifications for AI operations
│   │   │   ├── ✅ TarotMatchingExercise.tsx - Card meaning matching practice
│   │   │   └── ✅ Real-time progress updates (FIXED database integration)
│   │   │
│   │   └── 🎲 Tarot Card Data (/data/tarotCards.ts)
│   │       ├── ✅ Complete 78-card dataset
│   │       ├── ✅ Major Arcana (22 cards)
│   │       ├── ✅ Minor Arcana - All suits (56 cards)
│   │       ├── ✅ Upright & reversed meanings
│   │       ├── ✅ Keywords for evaluation
│   │       ├── ✅ Elements & correspondences
│   │       ├── ✅ Actual tarot card images (78 cards in /public/tarots/)
│   │       ├── ✅ Image mapping utility (/utils/tarotImageMapping.ts)
│   │       └── ✅ Utility functions (getRandomCard, etc.)
│
├── 🗄️ Database Schema
│   ├── ✅ tarot_progress table
│   │   ├── ✅ User-card progress tracking
│   │   ├── ✅ Familiarity levels (novice → master)
│   │   ├── ✅ Mastery percentages (0-100%)
│   │   ├── ✅ Performance metrics
│   │   └── ✅ Learning streaks
│   │
│   ├── ✅ tarot_sessions table
│   │   ├── ✅ Individual game attempts
│   │   ├── ✅ AI evaluation breakdown
│   │   ├── ✅ Scoring components
│   │   ├── ✅ Learning insights
│   │   └── ✅ Session metadata
│   │
│   └── ✅ tarot_leaderboard table
│       ├── ✅ Global player rankings
│       ├── ✅ Weekly competition tracking
│       ├── ✅ Achievement system foundation
│       ├── ✅ Performance statistics
│       └── ✅ Streak tracking
│
├── 🔌 API Endpoints
│   ├── ✅ POST /api/tarot/evaluate (src/app/api/tarot/evaluate/route.ts)
│   │   ├── ✅ Receives user interpretation + AI config
│   │   ├── ✅ Calls dedicated AI evaluation endpoint
│   │   ├── ✅ Saves session to tarot_sessions table
│   │   ├── ✅ Updates tarot_progress table (FIXED column mismatches)
│   │   ├── ✅ Updates tarot_leaderboard table (FIXED database saves)
│   │   ├── ✅ Detailed logging for database operations
│   │   └── ✅ Returns formatted feedback
│   │
│   ├── ✅ POST /api/tarot/ai-evaluate (src/app/api/tarot/ai-evaluate/route.ts)
│   │   ├── ✅ OpenRouter + OpenAI integration
│   │   ├── ✅ 150 token limit for concise responses
│   │   ├── ✅ Structured prompt for consistent format
│   │   ├── ✅ Fallback to basic evaluation
│   │   └── ✅ SCORE/FEEDBACK/SAMPLE parsing
│   │
│   ├── ✅ POST /api/tarot/generate-situation (src/app/api/tarot/generate-situation/route.ts)
│   │   ├── ✅ OpenRouter + OpenAI integration
│   │   ├── ✅ 120 token limit for brief scenarios
│   │   ├── ✅ Card-specific contextual prompts
│   │   ├── ✅ Avoids repeating previous situations
│   │   ├── ✅ StatusToast integration for loading states
│   │   └── ✅ Fallback to template situations
│   │
│   ├── ✅ GET /api/tarot/progress (src/app/api/tarot/progress/route.ts)
│   │   ├── ✅ Aggregates data from tarot_leaderboard
│   │   ├── ✅ Card-specific progress from tarot_progress
│   │   ├── ✅ Recent session history from tarot_sessions
│   │   ├── ✅ Achievement calculation
│   │   ├── ✅ Returns correct totalScore (FIXED database connection)
│   │   └── ✅ Weekly statistics
│   │
│   ├── ✅ GET /api/tarot/leaderboard (src/app/api/tarot/leaderboard/route.ts)
│   │   ├── ✅ All-time rankings by total_score
│   │   ├── ✅ Weekly/monthly filtering options
│   │   ├── ✅ Returns user entries (FIXED database queries)
│   │   ├── ✅ Player statistics calculation
│   │   └── ✅ Ranking position assignment
│   │
│   ├── ✅ GET /api/tarot/card-progress (src/app/api/tarot/card-progress/route.ts)
│   │   ├── ✅ Individual card mastery tracking
│   │   ├── ✅ Upright/reversed performance metrics
│   │   ├── ✅ Familiarity levels and learning streaks
│   │   ├── ✅ Mastery percentage calculations
│   │   └── ✅ Last played timestamps
│   │
│   └── ✅ POST /api/tarot/award-points (src/app/api/tarot/award-points/route.ts)
│       ├── ✅ Manual point awarding system
│       ├── ✅ Matching exercise integration
│       ├── ✅ Leaderboard updates via Turso HTTP client
│       ├── ✅ Session type tracking
│       └── ✅ Achievement point distribution
│
├── 🤖 AI Integration
│   ├── ✅ Evaluation Algorithm (Basic)
│   │   ├── ✅ Keyword matching analysis
│   │   ├── ✅ Traditional meaning alignment
│   │   ├── ✅ Contextual relevance scoring
│   │   ├── ✅ Creativity assessment
│   │   ├── ✅ Score calculation (0-100)
│   │   ├── ✅ Accuracy rating system
│   │   └── ✅ Personalized feedback generation
│   │
│   ├── 🔄 Advanced AI Integration (Future)
│   │   ├── ⏳ External AI service integration
│   │   ├── ⏳ GPT/Claude API integration
│   │   ├── ⏳ Prompt engineering optimization
│   │   ├── ⏳ Dynamic difficulty adjustment
│   │   └── ⏳ Personalized learning paths
│   │
│   └── 📝 Scenario Generation
│       ├── ✅ 10 predefined situations
│       ├── ⏳ Dynamic scenario generation
│       ├── ⏳ Difficulty level adaptation
│       └── ⏳ Personal reading contexts
│
├── 💎 Premium Integration
│   ├── ✅ Premium feature gating
│   ├── ✅ User subscription checking (with admin override)
│   ├── ⏳ Payment integration
│   ├── ⏳ Trial period handling
│   └── ⏳ Upgrade flow optimization
│
├── 🎨 Design System Integration
│   ├── ✅ Synapsas color scheme application
│   ├── ✅ Typography consistency (Space Grotesk/Open Sans)
│   ├── ✅ Component styling alignment (sharp corners, no rounded borders)
│   ├── ✅ Interactive element design
│   ├── ✅ Mobile responsiveness optimization
│   └── ✅ Component extraction for maintainability
│
└── 🚀 Advanced Features (Future Roadmap)
    ├── 🏆 Achievement System
    │   ├── ⏳ Card mastery badges
    │   ├── ⏳ Streak achievements
    │   ├── ⏳ Perfect score awards
    │   └── ⏳ Seasonal challenges
    │
    ├── 👥 Social Features
    │   ├── ⏳ Friend challenges
    │   ├── ⏳ Progress sharing
    │   ├── ⏳ Community discussions
    │   └── ⏳ Mentor system
    │
    ├── 📚 Learning Enhancement
    │   ├── ⏳ Study mode (card references)
    │   ├── ⏳ Weak area focus
    │   ├── ⏳ Spaced repetition algorithm
    │   └── ⏳ Personalized learning paths
    │
    ├── 🎯 Game Modes
    │   ├── ⏳ Speed rounds
    │   ├── ⏳ Themed challenges (e.g., love readings)
    │   ├── ⏳ Reverse card interpretation
    │   └── ⏳ Card combination scenarios
    │
    └── 📊 Analytics & Insights
        ├── ⏳ Learning analytics dashboard
        ├── ⏳ Progress visualization charts
        ├── ⏳ Performance trend analysis
        └── ⏳ Personalized improvement suggestions
```

## 📈 Implementation Status

### ✅ Completed (99% of core features)
- **Frontend Base**: Game interface, welcome screen, leaderboard display
- **Data Foundation**: Complete 78-card tarot dataset with meanings
- **Visual Assets**: All 78 actual tarot card images integrated with proper aspect ratios
- **Database Schema**: Enhanced with upright/reversed tracking and streak support
- **API Layer**: Core evaluation, progress, and leaderboard endpoints (ALL WORKING)
- **AI Integration**: OpenRouter/OpenAI evaluation with dedicated endpoints
- **Hero Integration**: Premium feature prominently displayed on guides page
- **Premium Integration**: Feature gating with admin override (orbitandchill@gmail.com)
- **Design System**: Full Synapsas styling applied (sharp corners, proper colors)
- **Component Architecture**: Extracted modular components for maintainability
- **Card Mastery System**: Visual progress grid with actual card images and dual progress bars
- **Progress Tracking**: Database persistence working, UI state refresh debugging
- **StatusToast Integration**: Loading notifications for AI operations

### 🔄 In Progress (1% remaining issues)
- **Enhanced UX**: Mobile optimization, animations, improved feedback

### ⏳ Planned
- **Social Features**: Community aspects, sharing, challenges  
- **Advanced Learning**: Spaced repetition, personalized paths
- **Payment Integration**: Stripe/payment processing for premium upgrades

## 🎮 Current Game Flow

1. **Entry Point**: Users discover feature via prominent card on `/guides` page
2. **Premium Check**: Feature displays premium modal for non-premium users
3. **Game Start**: Premium users can begin learning journey
4. **Card Presentation**: Random card + situation scenario displayed
5. **User Input**: Player writes interpretation in text area
6. **AI Evaluation**: Basic algorithm scores interpretation (0-100 points)
7. **Feedback Loop**: User receives score, feedback, and traditional meaning
8. **Progress Tracking**: Individual card progress and global leaderboard updated
9. **Continuation**: Player can continue with next card or end session

## 🔧 Technical Architecture

### Database Design (Turso SQLite)
- **Normalized Structure**: Separate tables for progress, sessions, and leaderboard
- **Actual Schema Columns** (verified from database queries):
  - `tarot_progress`: id, user_id, card_id, familiarity_level, mastery_percentage, total_attempts, total_score, average_score, best_score, learning_streak, last_attempt_date, last_played, upright_attempts, upright_score, upright_average, reversed_attempts, reversed_score, reversed_average, created_at, updated_at
  - `tarot_leaderboard`: id, user_id, username, total_score, cards_completed, overall_accuracy, learning_streak, level, weekly_score, monthly_score, weekly_rank, monthly_rank, all_time_rank, games_played, average_score, sessions_this_week, perfect_interpretations, current_streak, favorite_suit, last_played, created_at, updated_at
  - `tarot_sessions`: id, user_id, card_id, situation, user_interpretation, ai_evaluation, score, accuracy_rating, keyword_accuracy, context_relevance, traditional_alignment, creativity_bonus, strengths_identified, improvement_areas, recommended_study, session_type, created_at
- **Fixed Column Mismatches**: 
  - ✅ `cards_completed` (not `total_cards`) in leaderboard queries
  - ✅ `best_score` (not `highest_score`) in progress table  
  - ✅ `last_attempt_date` (not `first_played`) for date tracking
  - ❌ `highest_single_score` (removed - doesn't exist in leaderboard schema)
  - ❌ `first_played` (removed - doesn't exist in leaderboard schema)
  - ❌ `display_name` (removed - doesn't exist in users table)

### API Design
- **Dedicated Endpoints**: Separate APIs for different functions
  - `/api/tarot/evaluate` - Score interpretation and save progress
  - `/api/tarot/ai-evaluate` - AI-powered evaluation (OpenRouter/OpenAI)
  - `/api/tarot/generate-situation` - AI-powered scenario generation
  - `/api/tarot/progress` - User progress retrieval
  - `/api/tarot/leaderboard` - Global rankings
  - `/api/tarot/card-progress` - Individual card mastery tracking
  - `/api/tarot/award-points` - Manual point awarding system
- **Error Resilience**: Graceful degradation when database unavailable
- **Direct SQL**: Uses Turso HTTP client with proper column mapping
- **Type Safety**: TypeScript interfaces for all request/response data

### AI Integration System
- **Dedicated APIs**: Separate from discussion AI (no more transform-with-ai conflicts)
- **Provider Support**: OpenRouter, OpenAI with proper authentication
- **Token Limits**: 
  - Evaluation: 150 tokens (concise feedback)
  - Situation: 120 tokens (brief scenarios)
- **Fallback System**: Template-based responses when AI unavailable
- **Real AI Evaluation**: Contextual scoring and sample interpretations

## 🚀 Next Implementation Steps

1. **Premium Integration** (High Priority)
   - Implement actual subscription checking
   - Create upgrade flow
   - Add trial period handling

2. **Advanced AI** (High Priority)
   - Integrate with OpenAI/Anthropic APIs
   - Enhance evaluation sophistication
   - Add dynamic scenario generation

3. **Design Polish** (Medium Priority)
   - Apply Synapsas design system
   - Improve mobile experience
   - Add animations and transitions

4. **Social Features** (Low Priority)
   - Friend challenges
   - Progress sharing
   - Community discussions

## 📊 Success Metrics

### User Engagement
- **Daily Active Users**: Target 10% of premium users daily
- **Session Duration**: Average 15+ minutes per session
- **Completion Rate**: 70%+ complete at least 5 cards
- **Retention**: 60%+ return within 7 days

### Learning Effectiveness
- **Skill Progression**: Average 20% improvement in accuracy over 10 sessions
- **Card Mastery**: Users master 50+ cards within first month
- **Knowledge Retention**: Consistent performance on previously learned cards

### Business Impact
- **Premium Conversion**: 15% of users upgrade for tarot learning
- **User Satisfaction**: 4.5+ star rating in feedback
- **Feature Adoption**: 40% of premium users try tarot learning

---

## 🎨 Latest Updates (January 13, 2025)

### Component Architecture Improvements
- **Extracted Components**: Created modular, reusable components:
  - `TarotPremiumModal.tsx` - Premium feature modal with Synapsas styling
  - `TarotLeaderboard.tsx` - Compact sidebar leaderboard with level badges
  - `TarotGameGuide.tsx` - Game instructions with scoring system
  - `TarotGameInterface.tsx` - Main game interaction interface
  - `CardMasteryGrid.tsx` - Visual progress tracker for all 78 cards

### Design System Compliance
- **Synapsas Styling Applied**: Removed all rounded borders (rounded-xl, rounded-2xl, rounded-full)
- **Color Scheme Updated**: Replaced purple backgrounds with white/black Synapsas colors
- **Typography Consistency**: Space Grotesk for headings, Inter for body text
- **Sharp Corner Aesthetic**: All components now use angular, sharp design elements

### Enhanced Progress Tracking
- **Upright/Reversed Metrics**: Separate tracking for card orientations
- **Streak System**: Learning streak tracking for motivation
- **Card Mastery Grid**: Visual representation of progress on all 78 cards
- **Level Badges**: Dynamic level calculation with visual badges

### Premium Integration
- **Admin Override**: orbitandchill@gmail.com has automatic premium access
- **Feature Gating**: Non-premium users see upgrade modal
- **Graceful Degradation**: Feature remains accessible to premium users

## 🎯 Scoring System & Level Progression

### Score Calculation Formula
Each interpretation is evaluated across multiple dimensions:

```
Total Score (0-100) = Base Score + Creativity Bonus

Base Score = (30% × Keyword Accuracy) + (40% × Traditional Alignment) + (30% × Context Relevance)
Creativity Bonus = min(interpretation_length / 200, 0.3) × 20 points
```

#### Scoring Components:
1. **Keyword Accuracy (30%)**: How many traditional tarot keywords are used
   - Measures user's knowledge of card symbolism
   - Based on card's upright keyword list (e.g., "transformation", "change", "endings")

2. **Traditional Alignment (40%)**: Alignment with established card meanings
   - Core component measuring understanding of traditional interpretations
   - Compares interpretation against card's canonical meaning

3. **Context Relevance (30%)**: Application to specific situation
   - Measures ability to connect card meaning to real-life scenarios
   - Evaluates practical interpretation skills

4. **Creativity Bonus (up to 20 points)**: Rewards detailed, thoughtful responses
   - Encourages comprehensive interpretations
   - Based on interpretation length and depth

### Level System & Requirements

```
📊 Level Progression System (Aligned with /public/levels/ images)
├── 🌱 Novice (0-2,499 points) ✅ Novice.png
│   ├── Entry level - learning basic card meanings
│   ├── Single card interpretations only
│   └── Focus: Memorization and recognition
│
├── 🎯 Apprentice (2,500-9,999 points) ✅ Apprentice.png
│   ├── Comfortable with individual cards
│   ├── Single card interpretations continue
│   └── Focus: Context application and nuance
│
├── 🔮 Adept (10,000-24,999 points) ✅ Adept.png
│   ├── Strong foundation in card meanings
│   ├── Single card interpretations continue  
│   └── Focus: Complex situation analysis and advanced techniques
│
├── 👑 Master (25,000-49,999 points) ✅ Master.png
│   ├── **GAME MODE CHANGES** → Three-Card Spreads
│   ├── Past-Present-Future layouts
│   ├── Mind-Body-Spirit configurations
│   ├── Situation-Action-Outcome spreads
│   └── Focus: Card relationships and synthesis
│
└── 🌟 Grandmaster (50,000+ points) ✅ Grandmaster.png
    ├── **GAME MODE CHANGES** → Celtic Cross Spreads
    ├── Full 10-card Celtic Cross layouts
    ├── Complex multi-card relationships
    ├── Advanced spread interpretations
    ├── Timing and elemental considerations
    └── Focus: Master-level reading skills
```

### Advanced Game Modes (Master & Grandmaster)

#### Master Level - Three-Card Spreads
- **Spread Types**:
  - Past-Present-Future
  - Mind-Body-Spirit  
  - Situation-Action-Outcome
  - Problem-Cause-Solution
  - You-Relationship-Partner

- **Scoring Changes**:
  - Individual card accuracy (40%)
  - Card relationship synthesis (35%)
  - Overall reading coherence (25%)
  - Bonus for connecting card meanings

#### Grandmaster Level - Celtic Cross
- **10-Card Layout**:
  1. Present situation (center)
  2. Challenge/Cross
  3. Distant past/Foundation
  4. Recent past
  5. Possible outcome
  6. Immediate future
  7. Your approach
  8. External influences
  9. Hopes and fears
  10. Final outcome

- **Scoring Changes**:
  - Individual card accuracy (30%)
  - Positional meaning accuracy (25%)
  - Card relationships & flow (25%)
  - Reading synthesis & narrative (20%)
  - Advanced bonuses for timing, elements, patterns

### Experience Point Requirements
- **Per Card**: 20-100 points (based on accuracy)
- **Level Thresholds**: 
  - Novice: 0-2,499 points (~25-125 cards at average performance)
  - Apprentice: 2,500-9,999 points (~125-500 cards mastered)
  - Adept: 10,000-24,999 points (~500-1,250 cards, multiple iterations)
  - Master: 25,000-49,999 points (three-card spreads unlock)
  - Grandmaster: 50,000+ points (Celtic Cross spreads unlock)

### Current Implementation Status
- ✅ **Novice through Adept**: Single card interpretation system (levels 1-3)
- ⏳ **Master Level**: Three-card spread interface (planned)
- ⏳ **Grandmaster Level**: Celtic Cross interface (planned)
- ✅ **Progress Tracking**: Real-time level calculation with image assets
- ✅ **Database Schema**: Supports advanced scoring metrics
- ✅ **Level Images**: All 5 level badges available in /public/levels/

## 🐛 Recent Bug Fixes (July 14, 2025)

### Matching Exercise Major Fixes ✅ RESOLVED

#### 1. UI Responsiveness Issue
- **Problem**: Infinite re-render loop caused clicking to be unresponsive in matching exercise
- **Root Cause**: `initializeGame` function was not properly memoized, causing useEffect to repeatedly trigger
- **Solution**: Added `useCallback` to `initializeGame` with proper dependencies in `TarotMatchingExercise.tsx:125-201`

#### 2. Card ID Parsing Bug  
- **Problem**: Upright/reversed progress tracking was completely broken
- **Root Cause**: Card ID parsing was only taking first part after splitting by "-" (e.g., "the-high-priestess-upright" → "the" instead of "the-high-priestess")
- **Solution**: Fixed parsing logic to use `parts.slice(0, -1).join('-')` in `TarotMatchingExercise.tsx:234-235`

#### 3. Scoring System Overhaul
- **Problem**: Complex scoring system with 50-300 points was confusing users
- **Solution**: Implemented simple scoring: correct minus incorrect (can be negative)
- **Implementation**: Award (correct - incorrect) points, allowing negative scores for poor performance
- **Logic**: Poor performance actually reduces total points, encouraging careful play

#### 4. Individual Card Scoring
- **Problem**: Individual cards were receiving 60-80 points instead of 10% of exercise performance
- **Solution**: Limited individual card scoring to 0-10 points based on accuracy in `TarotMatchingExercise.tsx:245`

#### 5. Weighted Average Scoring System
- **Problem**: Card scores could only increase, never decrease (unrealistic progress tracking)
- **Solution**: Implemented weighted average (30% historical, 70% recent) in `/api/tarot/evaluate/route.ts:398-412`
- **Impact**: Poor recent performance now reduces overall card scores appropriately

#### 6. Auto-Close Modal
- **Problem**: Matching exercise modal showed completion screen instead of closing automatically
- **Solution**: Added automatic modal close after progress updates in `TarotMatchingExercise.tsx:409-419`

**Files Modified:**
- `src/components/tarot/TarotMatchingExercise.tsx`: Fixed infinite loop, card ID parsing, scoring, auto-close
- `src/app/api/tarot/evaluate/route.ts`: Implemented weighted average scoring system
- `src/components/tarot/CardMasteryGrid.tsx`: Added refresh callback for matching completion
- `src/app/guides/tarot-learning/page.tsx`: Added refresh functions for UI updates

**Key Code Changes:**
```typescript
// Fixed card ID parsing
const parts = key.split('-');
const cardId = parts.slice(0, -1).join('-'); // Everything except orientation

// Simple scoring formula: correct minus incorrect (can be negative)
const finalScore = gameStats.correctMatches - gameStats.incorrectMatches;

// Individual card scoring (10% of exercise performance)
const score = Math.round(accuracy * 10); // 0-10 points

// Weighted average scoring (allows score reduction)
if (newUprightAttempts === 1) {
  newUprightAverage = evaluation.score;
} else {
  newUprightAverage = (newUprightAverage * 0.3) + (evaluation.score * 0.7);
}
```

**User Experience Improvements:**
- Clicking cards now works reliably (no infinite re-render)
- Upright/reversed progress tracking functions correctly
- Scoring is transparent and intuitive (correct - incorrect)
- Individual card progress updates appropriately (can increase or decrease)
- Modal closes automatically when exercise completes
- Matching exercise integrates seamlessly with overall progress system

## 🐛 Fixed Issue: Matching Exercise Progress Tracking (July 14, 2025)

### Issue: Matching Exercise Not Updating Progress ✅ RESOLVED
**Problem**: Tarot matching exercise completed games but didn't update user progress (total points) or individual card mastery.

**Root Cause**: Database system incompatibility
- Matching exercise called `/api/tarot/evaluate` (Turso HTTP client) ✅
- Matching exercise called `/api/tarot/award-points` (Drizzle ORM) ❌

**Solution**: Converted `/api/tarot/award-points` to use Turso HTTP client
- Removed Drizzle ORM dependency
- Added proper leaderboard updates using raw SQL
- Added `overrideScore` parameter support in `/api/tarot/evaluate`
- Ensured consistent database access patterns

**Files Modified**:
- `/src/app/api/tarot/award-points/route.ts` - Complete rewrite using Turso HTTP client
- `/src/app/api/tarot/evaluate/route.ts` - Added overrideScore parameter support

**Result**: Matching exercise now properly updates both individual card progress and total user scores.

**Documentation**: 
- `/TAROT_MATCHING_EXERCISE_FIX.md` - Complete fix documentation with before/after code examples
- `/API_ENDPOINTS_DATABASE_COMPLIANCE.md` - Tracks which endpoints use correct database patterns

---

## 🐛 Database Issues Fixed (January 13, 2025)

### Issue: Leaderboard Entries Not Being Created ✅ RESOLVED
**Problem**: Sessions were saving correctly, but leaderboard entries failed to create due to column name mismatches.

**Debug Process**:
1. Added extensive logging to reveal actual database schema
2. Used `PRAGMA table_info()` queries to discover real column names
3. Identified mismatched column references in INSERT/UPDATE statements

**Specific Fixes**:
```sql
-- ❌ OLD (Wrong column names)
INSERT INTO tarot_leaderboard (..., highest_single_score, first_played, ...)
SELECT username, display_name, name FROM users WHERE id = ?

-- ✅ FIXED (Correct column names)  
INSERT INTO tarot_leaderboard (..., last_played, ...) -- removed non-existent columns
SELECT * FROM users WHERE id = ? LIMIT 1 -- use wildcard to avoid missing columns
```

**API Endpoint Status**:
- ✅ `/api/tarot/evaluate` - Fixed column name mismatches
- ✅ `/api/tarot/progress` - Fixed `total_cards` → `cards_completed` 
- ✅ `/api/tarot/ai-evaluate` - Working correctly
- ✅ `/api/tarot/generate-situation` - Working correctly
- ✅ `/api/tarot/leaderboard` - Schema aligned

### Database Schema Verification Process
```javascript
// Use this pattern to debug column mismatches:
const schemaResult = await client.execute({
  sql: 'PRAGMA table_info(table_name)',
  args: []
});
console.log('Actual columns:', schemaResult.rows.map(row => row.name));
```

---

## 📚 Related Documentation

### Implementation Documentation
- **`/TAROT_MATCHING_EXERCISE_FIX.md`** - Complete fix documentation for matching exercise progress tracking issue
  - Root cause analysis (Drizzle ORM vs Turso HTTP client incompatibility)
  - Before/after code examples
  - API endpoint modifications
  - Database operation details

- **`/API_ENDPOINTS_DATABASE_COMPLIANCE.md`** - Database compliance tracking for all API endpoints
  - Compliant endpoints using Turso HTTP client
  - Non-compliant endpoints using Drizzle ORM
  - Migration patterns and examples
  - Testing guidelines

### Core Documentation
- **`/tarot.md`** - This file (main implementation progress)
- **`/API_DATABASE_PROTOCOL.md`** - Database integration patterns and protocols
- **`/synapsas.md`** - Design system guidelines and components

### Component Files
- **`/src/components/tarot/TarotMatchingExercise.tsx`** - Main matching exercise component
- **`/src/components/tarot/CardMasteryGrid.tsx`** - 78-card progress visualization
- **`/src/components/tarot/TarotGameInterface.tsx`** - Main game interface
- **`/src/data/tarotCards.ts`** - Complete tarot card dataset

---

## 🛠️ Latest Update: TypeScript & ESLint Error Resolution (July 18, 2025)

### Fixed Issues ✅ RESOLVED
- **TypeScript Errors**: Fixed 27 type errors across codebase
- **ESLint Errors**: Resolved all linting violations
- **Events Store**: Corrected normalized state structure (Record<string, Event> vs Array)
- **Type Safety**: Added proper type annotations and assertions
- **Database Compatibility**: Fixed API endpoint type mismatches

### Files Modified
- `src/store/eventsStore.ts` - Fixed normalized state structure
- `src/hooks/useEventManager.ts` - Fixed locationForGeneration type handling
- `src/hooks/useTarotGameInterface.ts` - Fixed AI config type assertion
- `src/app/event-chart/page.tsx` - Fixed getAllEvents() usage
- `src/components/charts/ChartAttachmentToast.tsx` - Fixed event filtering
- `src/components/admin/EventsTab.tsx` - Added proper state definitions

### Code Quality Improvements
- All TypeScript errors resolved (0 errors)
- All ESLint errors resolved (0 errors)
- Type safety improved across event management system
- Database integration patterns standardized

---

## 🎨 Level Badge Enhancement (July 18, 2025)

### New Feature: Expandable Level Details Modal ✅ COMPLETED

**Implementation**: Added clickable level badges that open detailed progression information in a bottom sheet modal following Synapsas design principles.

#### Components Added:
- **`LevelDetailsModal.tsx`** - Bottom sheet modal component
  - Slides in from bottom right of screen
  - No backdrop overlay (clean interaction)
  - Shows complete level progression (Novice → Grandmaster)
  - Displays current stats and progress to next level
  - Synapsas styling with sharp corners and black borders

#### Features:
1. **Interactive Level Badges** - All level badges are now clickable with hover effects
2. **Smooth Animations** - 300ms slide-in/slide-out transitions
3. **Progress Visualization** - Complete level progression with completion status
4. **Current Stats Display** - Total points and points needed for next level
5. **Level Descriptions** - Detailed explanations for each level tier

#### Technical Implementation:
```typescript
// LevelBadge.tsx - Modal trigger
<div 
  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
  onClick={() => setIsModalOpen(true)}
>
  {/* Level badge content */}
</div>

// LevelDetailsModal.tsx - Bottom sheet behavior
<div className="fixed inset-0 z-50 pointer-events-none">
  <div className={`fixed bottom-0 right-0 w-full max-w-md bg-white border-2 border-black shadow-lg pointer-events-auto transform transition-transform duration-300 ease-out ${
    isVisible ? 'translate-y-0' : 'translate-y-full'
  }`}>
    {/* Modal content */}
  </div>
</div>
```

#### Design Compliance:
- **Synapsas Aesthetic** - Sharp corners, black borders, high contrast
- **Typography** - Space Grotesk for headers, Inter for body text
- **Color Scheme** - White/black with accent colors for completion states
- **Interactive Elements** - Hover effects and smooth transitions
- **Mobile Responsive** - Optimized for all screen sizes

#### User Experience:
- **Intuitive Interaction** - Click any level badge to view details
- **Non-intrusive** - No backdrop overlay, doesn't block page interaction
- **Informative** - Shows complete progression path and requirements
- **Accessible** - Clear close buttons and escape functionality

**Files Modified:**
- `/src/components/tarot/LevelBadge.tsx` - Added modal trigger and hover effects
- `/src/components/tarot/LevelDetailsModal.tsx` - New bottom sheet modal component

**Integration**: Works seamlessly with existing tarot learning system, leaderboard, and progress tracking components.

---

## 📚 API Documentation for Mobile Integration

### Base URL
**https://orbitandchill.com/api/tarot/**

### Complete API Endpoints

#### 1. **User Progress** - GET
**URL:** `https://orbitandchill.com/api/tarot/progress?userId={userId}`

**Response Format:**
```json
{
  "success": true,
  "progress": {
    "totalScore": 1250,
    "totalCards": 23,
    "accuracy": 78,
    "level": "Apprentice",
    "cardProgress": [
      {
        "cardId": "the-fool",
        "familiarityLevel": "apprentice",
        "masteryPercentage": 75,
        "totalAttempts": 8,
        "averageScore": 68,
        "lastPlayed": "2025-07-21T10:30:00Z"
      }
    ],
    "recentSessions": [
      {
        "cardId": "the-fool",
        "score": 85,
        "accuracyRating": "good",
        "createdAt": "2025-07-21T10:30:00Z"
      }
    ],
    "achievements": ["First 10 Cards", "Accuracy Expert"],
    "weeklyStats": {
      "sessionsThisWeek": 12,
      "weeklyScore": 450,
      "currentStreak": 5
    }
  }
}
```

#### 2. **Evaluate User Answer** - POST
**URL:** `https://orbitandchill.com/api/tarot/evaluate`

**Request Body:**
```json
{
  "userId": "user_123",
  "cardId": "the-fool",
  "cardOrientation": "upright",
  "situation": "You're considering a major career change...",
  "interpretation": "This card suggests new beginnings and taking a leap of faith...",
  "cardMeaning": "The Fool represents new beginnings, innocence, and spontaneity...",
  "cardKeywords": ["new beginnings", "innocence", "spontaneity", "leap of faith"],
  "aiConfig": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your-api-key",
    "temperature": 0.7
  },
  "overrideScore": 85
}
```

**Response Format:**
```json
{
  "success": true,
  "score": 78,
  "feedback": "You scored 78 points. Good interpretation...\n\nEXPERT EXAMPLE:\nIn this career situation, The Fool suggests...\n\nTRADITIONAL MEANING:\nNew beginnings and fresh starts...",
  "accuracyRating": "good",
  "keywordAccuracy": 0.6,
  "contextRelevance": 0.7,
  "traditionalAlignment": 0.8,
  "creativityBonus": 0.2,
  "strengthsIdentified": ["Good use of traditional keywords"],
  "improvementAreas": ["Connect more to situation"],
  "recommendedStudy": ["Practice situational interpretation"]
}
```

#### 3. **Global Leaderboard** - GET
**URL:** `https://orbitandchill.com/api/tarot/leaderboard?limit=50&timeFilter=all-time&sortBy=score&extended=true`

**Query Parameters:**
- `limit`: Number of entries (default: 50)
- `timeFilter`: "all-time", "weekly", "monthly", "daily" (default: "all-time")
- `sortBy`: "score", "accuracy", "cards", "streak" (default: "score")
- `extended`: "true" for detailed stats (default: false)

**Response Format:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "id": "user_123",
      "username": "TarotMaster",
      "score": 15750,
      "cardsCompleted": 45,
      "accuracy": 82,
      "lastPlayed": "2025-07-21T10:30:00Z",
      "level": "Master",
      "rank": 1,
      "gamesPlayed": 120,
      "averageScore": 78,
      "streak": 12,
      "joinedDate": "2025-01-15T08:00:00Z"
    }
  ],
  "stats": {
    "totalPlayers": 1247,
    "averageScore": 65,
    "topScore": 15750,
    "gamesPlayedToday": 89
  }
}
```

#### 4. **Individual Card Progress** - GET
**URL:** `https://orbitandchill.com/api/tarot/card-progress?userId={userId}`

**Response Format:**
```json
{
  "success": true,
  "progress": {
    "the-fool": {
      "cardId": "the-fool",
      "totalAttempts": 8,
      "averageScore": 68,
      "masteryPercentage": 75,
      "uprightAttempts": 5,
      "uprightAverage": 72,
      "reversedAttempts": 3,
      "reversedAverage": 62,
      "familiarityLevel": "apprentice",
      "learningStreak": 3,
      "lastPlayed": "2025-07-21T10:30:00Z"
    }
  }
}
```

#### 5. **Award Points** - POST
**URL:** `https://orbitandchill.com/api/tarot/award-points`

**Request Body:**
```json
{
  "userId": "user_123",
  "points": 150,
  "reason": "Matching exercise completion",
  "sessionType": "matching_exercise"
}
```

#### 6. **AI Scenario Generation** - POST
**URL:** `https://orbitandchill.com/api/tarot/generate-situation`

**Request Body:**
```json
{
  "cardId": "the-fool",
  "cardMeaning": "New beginnings and fresh starts...",
  "previousSituations": ["career change scenario", "travel situation"],
  "aiConfig": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your-api-key",
    "temperature": 0.8
  }
}
```

**Response Format:**
```json
{
  "success": true,
  "situation": "You're standing at the edge of a major life decision...",
  "context": "personal_growth"
}
```

#### 7. **AI Evaluation** - POST
**URL:** `https://orbitandchill.com/api/tarot/ai-evaluate`

**Request Body:**
```json
{
  "userInterpretation": "This card suggests new beginnings...",
  "cardMeaning": "The Fool represents...",
  "cardKeywords": ["new beginnings", "innocence"],
  "situation": "career change scenario",
  "aiConfig": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your-api-key",
    "temperature": 0.7
  }
}
```

### Level System 🎯

**Point Thresholds:**
- **Novice:** 0-2,499 points
- **Apprentice:** 2,500-9,999 points  
- **Adept:** 10,000-24,999 points
- **Master:** 25,000-49,999 points
- **Grandmaster:** 50,000+ points

### Usage for Flutter/Mobile App 📱

#### For Tinder-Style Flashcard System:

1. **Get user progress:** Call `/progress` to show stats
2. **Present card:** Use local card data + call `/generate-situation` for dynamic scenarios
3. **User swipes/answers:** Call `/evaluate` with their interpretation
4. **Update progress:** Response automatically updates database
5. **Show rankings:** Call `/leaderboard` for competitive elements
6. **Individual card tracking:** Use `/card-progress` for detailed card mastery

## 🔐 Authentication System Documentation

### Overview
The Orbit & Chill authentication system supports both **anonymous users** and **Google OAuth** authentication with seamless transitions between the two. All user data is persisted in a Turso SQLite database with local caching.

### User Types

#### 1. Anonymous Users
- **ID Format**: `anon_${random}${timestamp}` (e.g., `anon_abc123_1721552400`)
- **Persistence**: Stored in localStorage and database
- **Username**: Auto-generated creative names (e.g., "Cosmic Seeker 123")
- **Features**: Full access to all features without authentication
- **Upgrade Path**: Can upgrade to Google authentication seamlessly

#### 2. Google OAuth Users  
- **ID Format**: Google user ID (numeric string)
- **Authentication**: Google Identity Services (GIS) OAuth2
- **Data Sync**: Profile picture, email, display name from Google
- **Cross-Device**: Synchronization across devices

#### 3. Admin Users
- **Master Admin**: `orbitandchill@gmail.com` has automatic admin privileges
- **Premium Override**: Automatic premium access for tarot features
- **Role-Based Access**: Admin dashboard and management features

### Authentication API Endpoints

#### Mobile Authentication
**POST** `https://orbitandchill.com/api/auth/mobile`

**Purpose**: Primary authentication endpoint for mobile apps

**Firebase Authentication Request (Recommended):**
```json
{
  "provider": "firebase",
  "email": "user@gmail.com",
  "name": "User Name",
  "firebaseUid": "firebase_user_id_here",
  "deviceInfo": {
    "platform": "ios" | "android", 
    "version": "app_version"
  }
}
```

**Email Authentication Request:**
```json
{
  "provider": "email",
  "email": "user@gmail.com",
  "name": "User Name",
  "deviceInfo": {
    "platform": "ios" | "android",
    "version": "app_version"
  }
}
```

**Google Authentication Request:**
```json
{
  "provider": "google",
  "token": "google_access_token_here",
  "deviceInfo": {
    "platform": "ios" | "android",
    "version": "app_version"
  }
}
```

**How It Works:**
1. Mobile app sends user's email + name to API
2. API generates its own JWT/session token for that user
3. API returns user data + generated token
4. Mobile app uses returned token for subsequent API calls

**Response:**
```json
{
  "success": true,
  "token": "jwt_generated_by_api_abc123...",
  "user": {
    "id": "user_id", 
    "username": "Display Name",
    "email": "user@example.com",
    "authProvider": "google",
    "profilePictureUrl": "https://...",
    "subscriptionTier": "free" | "premium" | "pro",
    "role": "user" | "admin",
    "birthData": { ... },
    "privacy": { ... }
  }
}
```

#### User Profile API
**GET/POST/PATCH** `https://orbitandchill.com/api/users/profile`

**GET** - Retrieve user profile by ID:
```
GET https://orbitandchill.com/api/users/profile?userId=user_123
```

**POST** - Create/update user profile:
```json
{
  "userId": "user_123",
  "username": "New Username",
  "email": "user@example.com",
  "birthData": {
    "dateOfBirth": "1990-01-01",
    "timeOfBirth": "12:00",
    "locationOfBirth": "New York, NY",
    "coordinates": { "lat": "40.7128", "lon": "-74.0060" }
  }
}
```

#### Logout Endpoint
**POST** `https://orbitandchill.com/api/auth/logout`

**Request Body:**
```json
{
  "userId": "user_id"
}
```

### Authentication Flow for Mobile Apps

#### Option 1: Anonymous User Flow
```javascript
// Generate anonymous user ID
const generateAnonymousId = () => {
  const random = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36);
  return `anon_${random}_${timestamp}`;
};

// Authenticate anonymous user
const authenticateAnonymous = async () => {
  const anonymousId = generateAnonymousId();
  
  const response = await fetch('https://orbitandchill.com/api/auth/mobile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'anonymous',
      anonymousId: anonymousId,
      deviceInfo: {
        platform: 'ios', // or 'android'
        version: '1.0.0'
      }
    })
  });
  
  const data = await response.json();
  return data.user;
};
```

#### Option 2: Google OAuth Flow

**Method A - With Google Token (Preferred):**
```javascript
const authenticateWithGoogleToken = async (googleToken) => {
  const response = await fetch('https://orbitandchill.com/api/auth/mobile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'google',
      token: googleToken, // Google ID token or access token
      deviceInfo: {
        platform: 'ios', // or 'android'
        version: '1.0.0'
      }
    })
  });
  
  const data = await response.json();
  return data.user;
};
```

**Method B - With Email/Name (Fallback):**
```javascript
const authenticateWithGoogleEmail = async (email, name) => {
  const response = await fetch('https://orbitandchill.com/api/auth/mobile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'email', // Changed from 'google' - API generates its own token
      email: email,
      name: name,
      deviceInfo: {
        platform: 'ios', // or 'android'
        version: '1.0.0'
      }
    })
  });
  
  const data = await response.json();
  return { user: data.user, token: data.token }; // API returns generated JWT token
};
```

#### Checking User Status
```javascript
// Check if user exists and get profile
const getUserProfile = async (userId) => {
  const response = await fetch(
    `https://orbitandchill.com/api/users/profile?userId=${userId}`
  );
  
  const data = await response.json();
  if (data.success) {
    return {
      user: data.user,
      isAuthenticated: data.user.authProvider === 'google',
      isAnonymous: data.user.authProvider === 'anonymous',
      isPremium: data.user.subscriptionTier !== 'free',
      isAdmin: data.user.role === 'admin'
    };
  }
  return null;
};
```

### User Data Structure

#### User Object
```typescript
interface User {
  id: string;                          // Google ID or anon_xxxxx
  username: string;                    // Display name
  email?: string;                      // Google users only
  authProvider: "google" | "anonymous";
  profilePictureUrl?: string;          // Google profile picture
  subscriptionTier: "free" | "premium" | "pro";
  role: "user" | "admin";
  
  // Astrological data (optional)
  birthData?: {
    dateOfBirth: string;               // YYYY-MM-DD
    timeOfBirth: string;               // HH:MM
    locationOfBirth: string;           // City, State/Country
    coordinates: {
      lat: string;
      lon: string;
    }
  };
  
  // Privacy settings
  privacy: {
    showZodiacPublicly: boolean;
    showBirthInfoPublicly: boolean;
    allowDirectMessages: boolean;
    showOnlineStatus: boolean;
  };
}
```

### Premium Access Control

#### Admin Override
- **Master Admin**: `orbitandchill@gmail.com` automatically gets premium access
- **Auto-Elevation**: Admin users bypass all premium checks

#### Premium Validation
```javascript
const checkPremiumAccess = (user) => {
  // Admin override
  if (user.email === 'orbitandchill@gmail.com' || user.role === 'admin') {
    return true;
  }
  
  // Subscription tier check
  return user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro';
};
```

### Session Management

#### Client-Side Storage
- **Anonymous ID**: Store in device's persistent storage
- **User Profile**: Cache user data locally
- **Session Duration**: 24-hour sessions with automatic refresh

#### Session Refresh
```javascript
const refreshUserSession = async (userId) => {
  const profile = await getUserProfile(userId);
  // Update local cache
  return profile;
};
```

### Error Handling

#### Common Error Responses
```json
{
  "success": false,
  "error": "Invalid token format",
  "code": "INVALID_TOKEN"
}

{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT"
}

{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

#### Rate Limiting
- **Authentication**: 5 attempts per 15 minutes per IP
- **Profile Updates**: 10 requests per minute per user

### Security Features

#### Input Validation
- Token format validation
- Device info validation
- Email format verification (Google users)

#### Privacy Protection
- Granular privacy controls
- Public profile filtering
- Optional data exposure

### Integration Notes

#### For Mobile Apps
1. **Choose Authentication**: Start with anonymous for immediate access
2. **Upgrade Path**: Offer Google sign-in for enhanced features
3. **Data Persistence**: Store user ID securely on device
4. **Premium Features**: Check subscription tier for feature gating
5. **Session Management**: Refresh user data periodically

#### For Web Apps
- Same API endpoints work for web applications
- Additional social login options available
- Real-time WebSocket connections for live features

#### Usage Example (Any Platform)
```javascript
// Example: Get user progress
const response = await fetch('https://orbitandchill.com/api/tarot/progress?userId=user_123');
const data = await response.json();

if (data.success) {
  console.log('User Level:', data.progress.level);
  console.log('Total Score:', data.progress.totalScore);
  console.log('Accuracy:', data.progress.accuracy);
}

// Example: Submit card evaluation
const evalResponse = await fetch('https://orbitandchill.com/api/tarot/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    cardId: 'the-fool',
    cardOrientation: 'upright',
    situation: 'Career change scenario...',
    interpretation: 'This card suggests new beginnings...',
    cardMeaning: 'The Fool represents new beginnings...',
    cardKeywords: ['new beginnings', 'innocence', 'spontaneity']
  })
});

const evalData = await evalResponse.json();
console.log('Score:', evalData.score);
console.log('Feedback:', evalData.feedback);
```

### Leaderboard API Access 🏆

#### Basic API Call
**URL:** `https://orbitandchill.com/api/tarot/leaderboard`

**Query Parameters:**
- `limit`: Number of entries (default: 50, max: 50)
- `timeFilter`: "all-time", "weekly", "monthly", "daily" (default: "all-time")  
- `sortBy`: "score", "accuracy", "cards", "streak" (default: "score")
- `extended`: "true" for detailed user stats (default: false)

#### Example API Calls

**Get Top 10 All-Time Leaders:**
```
GET https://orbitandchill.com/api/tarot/leaderboard?limit=10&timeFilter=all-time&sortBy=score&extended=true
```

**Get Weekly Top Performers:**
```
GET https://orbitandchill.com/api/tarot/leaderboard?limit=20&timeFilter=weekly&sortBy=score&extended=true
```

**Get Most Accurate Players:**
```
GET https://orbitandchill.com/api/tarot/leaderboard?sortBy=accuracy&extended=true
```

#### Response Data Structure

**Response Format:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "id": "user_123",
      "username": "TarotMaster",
      "score": 15750,
      "cardsCompleted": 45,
      "accuracy": 82,
      "lastPlayed": "2025-07-21T10:30:00Z",
      "level": "Master",
      "rank": 1,
      "gamesPlayed": 120,
      "averageScore": 78,
      "streak": 12,
      "joinedDate": "2025-01-15T08:00:00Z"
    }
  ],
  "stats": {
    "totalPlayers": 1247,
    "averageScore": 65,
    "topScore": 15750,
    "gamesPlayedToday": 89
  }
}
```

#### Key Data Fields

**Leaderboard Entry:**
- `id`: User identifier
- `username`: Display name  
- `score`: Total points earned
- `cardsCompleted`: Number of cards mastered
- `accuracy`: Overall accuracy percentage
- `level`: Current level (Novice, Apprentice, Adept, Master, Grandmaster)
- `rank`: Position on leaderboard (1-indexed)
- `gamesPlayed`: Total games played (extended only)
- `averageScore`: Average score per game (extended only)  
- `streak`: Current learning streak (extended only)

**Global Stats:**
- `totalPlayers`: Total users on leaderboard
- `averageScore`: Average score across all players
- `topScore`: Highest score achieved
- `gamesPlayedToday`: Games played today across all users

#### Finding User's Rank

To find a specific user's rank, call the leaderboard API and search through the results:

```javascript
// Pseudo-code for finding user rank
const leaderboardData = await fetch('https://orbitandchill.com/api/tarot/leaderboard?extended=true');
const { leaderboard } = leaderboardData;

const userEntry = leaderboard.find(entry => entry.id === userId);
const userRank = userEntry ? userEntry.rank : null;
```

#### Use Cases for Mobile Apps

1. **Display Top 10**: Show top performers
2. **User Rank**: Find and display user's current position
3. **Weekly Competition**: Show weekly leaderboard for fresh competition
4. **Achievement Tracking**: Compare user stats against global averages
5. **Social Features**: Show friends' rankings
6. **Motivation**: Display next rank requirements

#### Authentication Note:
All endpoints require a `userId` parameter. The system supports both anonymous users (with persistent IDs like `anon_xyz123`) and authenticated Google users.

#### Error Handling:
All endpoints return `{ success: true/false, error?: string }` format for consistent error handling across all platforms.

---

*Last Updated: July 21, 2025*
*Status: Database Issues Fixed, Core Implementation Complete (99%), Matching Exercise Progress Tracking Fixed, TypeScript/ESLint Errors Resolved, Level Badge Enhancement Complete, API Documentation Added for Mobile Integration*