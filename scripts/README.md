# Project Migration Scripts

This directory contains scripts to automate the migration of this Next.js astrology application to a new folder/repository with a new name.

## Features

✅ **Preserves all functionality** - Complete astrological system intact  
✅ **Keeps existing database** - No Turso database migration needed  
✅ **Updates project metadata** - New name in package.json  
✅ **Clean Git setup** - Fresh repository with proper initial commit  
✅ **Cross-platform** - Works on Windows, macOS, and Linux  
✅ **Automatic dependency install** - Ready to run immediately  

## Usage Options

### Option 1: NPM Script (Recommended)
```bash
npm run migrate [destination-path] [git-repo-url]
```

### Option 2: Direct Node.js
```bash
node scripts/migrate-project.js [destination-path] [git-repo-url]
```

### Option 3: Platform-Specific Scripts

**Windows:**
```cmd
scripts\migrate-project.bat
```

**Unix/Linux/macOS:**
```bash
./scripts/migrate-project.sh
```

## Examples

### Basic Migration (Auto-generates path)
```bash
npm run migrate
# Creates project at: ../orbit-and-chill
```

### Migration with Git Repository
```bash
npm run migrate "https://github.com/username/orbit-and-chill.git"
```

### Migration to Custom Directory
```bash
npm run migrate "/path/to/projects/orbit-and-chill"
```

### Migration with Custom Path AND Git Repo
```bash
npm run migrate "/custom/path" "https://github.com/user/orbit-and-chill.git"
```

## What the Script Does

1. 📁 **Creates destination directory** (auto-generates in parent folder if not specified)
2. 📋 **Copies all project files** (excludes node_modules, .git, build artifacts)
3. 📦 **Updates package.json** with new project name
4. 📝 **Creates migration documentation**
5. 🔧 **Initializes fresh Git repository**
6. 🔗 **Adds Git remote** (if provided)
7. 📚 **Installs dependencies**
8. ✅ **Ready to develop!**

## What's Preserved

- ✅ All astrological chart generation features
- ✅ User profiles with stellium detection
- ✅ Forum discussions and threading system
- ✅ Admin dashboard and analytics
- ✅ Event calendar and electional astrology
- ✅ Database schemas and data integrity
- ✅ Authentication and user management
- ✅ All custom components and hooks
- ✅ Tailwind styling and design system

## What's Updated

- 📦 Project name in package.json
- 🔄 Fresh Git history
- 📝 Migration documentation
- 🏗️ Clean build environment

## Post-Migration Steps

After running the migration script:

1. **Navigate to new project:**
   ```bash
   cd your-new-project-path
   ```

2. **Copy environment file:**
   ```bash
   # Copy .env.local from the original project
   cp ../luckstrology/.env.local .env.local
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Push to Git** (if remote was added):
   ```bash
   git push -u origin main
   ```

## Database Configuration

**No database migration needed!** The script preserves your existing Turso database configuration. The database name doesn't need to match your project name.

Your `.env.local` will continue to work with:
```
TURSO_DATABASE_URL=libsql://luckstrology-julesmeister.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=your-existing-token
```

## Troubleshooting

### Permission Errors
**Unix/Linux/macOS:**
```bash
chmod +x scripts/migrate-project.sh
```

### Path Issues
- Use absolute paths if relative paths cause issues
- Ensure destination parent directory exists

### Git Remote Issues
- Add the remote manually after migration:
  ```bash
  git remote add origin <your-repo-url>
  ```

## Safety Features

- ❌ **Won't overwrite existing directories**
- 🧹 **Automatic cleanup on failure**
- 📋 **Detailed logging throughout process**
- ✅ **Validates inputs before starting**

## File Exclusions

The script automatically excludes:
- `node_modules/`
- `.git/`
- `.next/`
- `dist/`, `build/`
- `.turbo/`, `.vercel/`
- `coverage/`
- Log files
- System files (`.DS_Store`)

## Requirements

- Node.js (for the main script)
- Git (for repository initialization)
- npm (for dependency installation)

---

**Ready to migrate? Pick your preferred method above and get started!** 🚀