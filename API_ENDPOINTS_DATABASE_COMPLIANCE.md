# API Endpoints Database Compliance Status

This document tracks which API endpoints use the correct Turso HTTP client vs. problematic Drizzle ORM, according to `/API_DATABASE_PROTOCOL.md`.

## ✅ Compliant Endpoints (Turso HTTP Client)

### Tarot Learning System
- **`/api/tarot/evaluate`** - ✅ Turso HTTP client
  - Scores user interpretations
  - Updates individual card progress
  - Handles `overrideScore` parameter for matching exercises
  - File: `/src/app/api/tarot/evaluate/route.ts`

- **`/api/tarot/award-points`** - ✅ Turso HTTP client (FIXED July 14, 2025)
  - Awards total points to user leaderboard
  - Updates global rankings
  - File: `/src/app/api/tarot/award-points/route.ts`
  - **Previous Issue**: Was using Drizzle ORM, causing matching exercise progress failures

- **`/api/tarot/ai-evaluate`** - ✅ Turso HTTP client  
  - AI-powered interpretation evaluation
  - File: `/src/app/api/tarot/ai-evaluate/route.ts`

- **`/api/tarot/generate-situation`** - ✅ Turso HTTP client
  - Generates card scenarios
  - File: `/src/app/api/tarot/generate-situation/route.ts`

- **`/api/tarot/progress`** - ✅ Turso HTTP client
  - Retrieves user progress data
  - File: `/src/app/api/tarot/progress/route.ts`

- **`/api/tarot/leaderboard`** - ✅ Turso HTTP client
  - Global rankings retrieval
  - File: `/src/app/api/tarot/leaderboard/route.ts`

## ❌ Non-Compliant Endpoints (Drizzle ORM)

**Note**: According to `/API_DATABASE_PROTOCOL.md`, no endpoints should use Drizzle ORM with Turso HTTP client due to WHERE clause parsing issues and other incompatibilities.

### Potential Issues to Check
These endpoints may still be using Drizzle ORM and should be audited:

- **Admin endpoints** - Check `/src/app/api/admin/` directory
- **User management** - Check `/src/app/api/users/` directory  
- **Discussion/forum** - Check `/src/app/api/discussions/` directory
- **Chart generation** - Check `/src/app/api/charts/` directory

## Database Access Patterns

### ✅ Correct Pattern (Turso HTTP Client)
```typescript
import { createClient } from '@libsql/client/http';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const result = await client.execute({
  sql: 'SELECT * FROM table WHERE id = ?',
  args: [id]
});
```

### ❌ Incorrect Pattern (Drizzle ORM)
```typescript
import { db } from '@/db';
import { table } from '@/db/schema';
import { eq } from 'drizzle-orm';

// WHERE clauses may be ignored by Turso HTTP client
const result = await db.select().from(table).where(eq(table.id, id));
```

## Component Integration

### Tarot Matching Exercise Flow
1. **TarotMatchingExercise.tsx** - User completes matching game
2. **`/api/tarot/evaluate`** - Records individual card attempts (overrideScore)
3. **`/api/tarot/award-points`** - Awards total points to user
4. **Database Updates** - Both individual progress and leaderboard updated

### Key Files
- `/src/components/tarot/TarotMatchingExercise.tsx` - Main matching component
- `/src/components/tarot/CardMasteryGrid.tsx` - Shows matching exercise button
- `/src/components/tarot/TarotGameInterface.tsx` - Main game interface

## Database Tables Used

### Tarot System Tables
- **`tarot_progress`** - Individual card mastery tracking
- **`tarot_leaderboard`** - Global user rankings and scores  
- **`tarot_sessions`** - Individual game session records

### Schema Naming
- **Database**: snake_case column names
- **TypeScript**: camelCase property names
- **Conversion**: Required between database and frontend

## Testing Compliance

### How to Test Database Compliance
1. Complete a tarot matching exercise
2. Verify both individual card progress and total score update
3. Check database entries are created correctly
4. Confirm no Drizzle ORM errors in console

### Debug Tools
- Browser console logs for API calls
- Database query logging in API endpoints
- Network tab to monitor API responses

## Migration Strategy

### Converting Drizzle ORM to Turso HTTP Client
1. Replace imports (`@/db` → `@libsql/client/http`)
2. Change queries from ORM syntax to raw SQL
3. Add parameter binding for security
4. Handle snake_case ↔ camelCase conversion
5. Add proper error handling
6. Test thoroughly

### Example Migration
```typescript
// BEFORE (Drizzle ORM)
const result = await db.update(users)
  .set({ totalScore: sql`${users.totalScore} + ${points}` })
  .where(eq(users.id, userId));

// AFTER (Turso HTTP Client)
const result = await client.execute({
  sql: 'UPDATE users SET total_score = total_score + ? WHERE id = ?',
  args: [points, userId]
});
```

---

*Last Updated: July 14, 2025*  
*Status: Tarot endpoints fully compliant, other endpoints need audit*