# Orbit and Chill

## Project Migration
This project was migrated from the original Orbit and Chill codebase on 2025-06-25.

### Original Features Preserved:
- ✅ Complete astrological chart generation system
- ✅ User profiles with stellium detection
- ✅ Forum discussions with threading
- ✅ Admin dashboard with analytics
- ✅ Event calendar and electional astrology
- ✅ All database schemas and data integrity
- ✅ Authentication and user management

### Database Configuration:
The project continues to use the existing Turso database. No data migration was necessary.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy from original project):
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your database credentials
   ```

3. Run database migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Migration Script
This project includes a migration script for future moves:
```bash
node scripts/migrate-project.js <new-name> <destination> [git-url]
```
