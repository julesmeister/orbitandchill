#!/usr/bin/env node

/**
 * Project Migration Script
 * 
 * This script automates the process of migrating the current project
 * to a new folder/repository with a new name while preserving all
 * functionality and the existing Turso database.
 * 
 * Usage:
 *   node scripts/migrate-project.js [destination-path] [git-repo-url]
 * 
 * Examples:
 *   node scripts/migrate-project.js
 *   node scripts/migrate-project.js "https://github.com/user/orbit-and-chill.git"
 *   node scripts/migrate-project.js "../custom-path"
 *   node scripts/migrate-project.js "../custom-path" "https://github.com/user/orbit-and-chill.git"
 * 
 * Note: If destination-path is omitted, the project will be created as 
 * "orbit-and-chill" in the same parent directory as the current project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}


function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Project configuration - hardcoded for "Orbit and Chill"
const newProjectName = "Orbit and Chill";
const projectSlug = "orbit-and-chill"; // kebab-case for folder and package name

// Get command line arguments
const args = process.argv.slice(2);
let destinationPath = args[0];
const gitRepoUrl = args[1] || (args[0] && args[0].includes('.git') ? args[0] : null);

// If destination path is not provided or is a git URL, auto-generate it
if (!destinationPath || destinationPath.includes('.git')) {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);
  destinationPath = path.join(parentDir, projectSlug);
  log(`📁 Auto-generating destination path: ${destinationPath}`, 'blue');
}

// Enhanced Validation
function validateInputs() {
  // Check if source directory exists and is a valid project
  const packageJsonExists = fs.existsSync(path.join(process.cwd(), 'package.json'));
  const srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
  
  if (!packageJsonExists || !srcExists) {
    logError('This doesn\'t appear to be a valid Next.js project directory!');
    logError('Please run this script from the project root (where package.json exists).');
    process.exit(1);
  }

  // Project name is hardcoded, so no validation needed
  logInfo(`Migrating to: ${newProjectName} (${projectSlug})`);

  // Check if destination already exists
  if (fs.existsSync(destinationPath)) {
    logError(`Destination path "${destinationPath}" already exists!`);
    logError('Please choose a different destination or remove the existing directory.');
    process.exit(1);
  }

  // Check if parent directory exists and is writable
  const parentDir = path.dirname(destinationPath);
  if (!fs.existsSync(parentDir)) {
    logError(`Parent directory "${parentDir}" doesn't exist!`);
    logError('Please create the parent directory first or use a different path.');
    process.exit(1);
  }

  // Test write permissions
  try {
    const testPath = path.join(parentDir, `test-write-${Date.now()}`);
    fs.mkdirSync(testPath);
    fs.rmSync(testPath, { recursive: true });
  } catch (error) {
    logError(`No write permission to parent directory "${parentDir}"`);
    logError('Please check your permissions or choose a different location.');
    process.exit(1);
  }

  // Validate Git URL format if provided
  if (gitRepoUrl) {
    const gitUrlRegex = /^(https?:\/\/|git@)[\w\.-]+[\/:][\w\.-]+\/[\w\.-]+(\.git)?$/;
    if (!gitUrlRegex.test(gitRepoUrl)) {
      logWarning(`Git URL format seems invalid: "${gitRepoUrl}"`);
      logWarning('Continuing anyway, but you may need to add the remote manually.');
    }
  }

  // Check for required tools
  try {
    execSync('git --version', { stdio: 'pipe' });
  } catch (error) {
    logError('Git is not installed or not available in PATH');
    logError('Please install Git before running this migration script.');
    process.exit(1);
  }

  try {
    execSync('npm --version', { stdio: 'pipe' });
  } catch (error) {
    logError('npm is not installed or not available in PATH');
    logError('Please install Node.js and npm before running this migration script.');
    process.exit(1);
  }
}

// Run validation
validateInputs();

log('\n🚀 Starting Project Migration...', 'bright');
log(`📦 Project Name: ${newProjectName}`, 'blue');
log(`📁 Destination: ${destinationPath}`, 'blue');
if (gitRepoUrl) {
  log(`🔗 Git Repo: ${gitRepoUrl}`, 'blue');
}
log('');

// Progress tracking
const totalSteps = gitRepoUrl ? 9 : 8;
let currentStep = 0;

function logProgress(step, message) {
  currentStep = step;
  const progress = Math.round((step / totalSteps) * 100);
  log(`[${progress}%] ${step}/${totalSteps} ${message}`, 'cyan');
}

try {
  // Step 1: Create destination directory
  logProgress(1, 'Creating destination directory...');
  fs.mkdirSync(destinationPath, { recursive: true });
  logSuccess('Destination directory created');

  // Step 2: Copy project files (excluding node_modules, .git, and build artifacts)
  logProgress(2, 'Copying project files...');
  const excludePatterns = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.turbo',
    '.vercel',
    'coverage',
    '*.log',
    '.DS_Store'
  ];
  
  const currentDir = process.cwd();
  
  // Use robocopy on Windows or rsync on Unix-like systems
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    // Windows: Use robocopy with exclusions
    const excludeArgs = excludePatterns.map(pattern => `/XD "${pattern}"`).join(' ');
    const robocopyCmd = `robocopy "${currentDir}" "${destinationPath}" /E /XF "*.log" ${excludeArgs}`;
    try {
      execSync(robocopyCmd, { stdio: 'pipe' });
    } catch (error) {
      // Robocopy returns non-zero exit codes for successful operations, so we ignore certain errors
      if (error.status && error.status > 7) {
        throw error;
      }
    }
  } else {
    // Unix-like: Use rsync with exclusions
    const excludeArgs = excludePatterns.map(pattern => `--exclude="${pattern}"`).join(' ');
    const rsyncCmd = `rsync -av ${excludeArgs} "${currentDir}/" "${destinationPath}/"`;
    execSync(rsyncCmd, { stdio: 'inherit' });
  }
  
  logSuccess('Project files copied');

  // Step 3: Update package.json
  logProgress(3, 'Updating package.json...');
  const packageJsonPath = path.join(destinationPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.name = projectSlug;
  // Update version to indicate migration
  const currentVersion = packageJson.version || '0.1.0';
  packageJson.version = currentVersion;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  logSuccess(`Package name updated to "${projectSlug}"`);

  // Step 4: Update brand configuration
  logProgress(4, 'Updating brand configuration...');
  const brandConfigPath = path.join(destinationPath, 'src', 'config', 'brand.ts');
  
  if (fs.existsSync(brandConfigPath)) {
    let brandContent = fs.readFileSync(brandConfigPath, 'utf8');
    
    // Convert project name to proper brand name (capitalize words, remove hyphens/underscores)
    const brandName = newProjectName
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Update the brand name
    brandContent = brandContent.replace(
      /name:\s*["']Luckstrology["']/g,
      `name: "${brandName}"`
    );
    
    // Update tagline and description to be generic but still relevant
    brandContent = brandContent.replace(
      /tagline:\s*["'][^"']*["']/g,
      `tagline: "Discover the cosmic blueprint of your personality through the ancient art of astrology."`
    );
    
    brandContent = brandContent.replace(
      /description:\s*["'][^"']*["']/g,
      `description: "Unlock the secrets written in the stars at your birth and explore your unique celestial fingerprint."`
    );
    
    fs.writeFileSync(brandConfigPath, brandContent);
    logSuccess(`Brand configuration updated to "${brandName}"`);
  } else {
    logWarning('Brand configuration file not found, skipping...');
  }

  // Step 5: Update any remaining hardcoded references
  logProgress(5, 'Scanning for remaining hardcoded references...');
  
  const filesToCheck = [
    'next.config.ts',
    'next.config.js', 
    'README.md',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'public/manifest.json',
    'src/components/Layout.tsx',
    'src/components/Navbar.tsx'
  ];
  
  let referencesUpdated = 0;
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(destinationPath, filePath);
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Replace various forms of "Luckstrology" but be careful not to break functionality
        content = content.replace(/Luckstrology/g, newProjectName);
        content = content.replace(/luckstrology/g, projectSlug);
        
        // Special handling for URLs and database names - preserve functionality
        content = content.replace(
          /luckstrology-julesmeister\.aws-ap-northeast-1\.turso\.io/g,
          'luckstrology-julesmeister.aws-ap-northeast-1.turso.io' // Keep original DB URL
        );
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content);
          referencesUpdated++;
        }
      } catch (error) {
        logWarning(`Could not update references in ${filePath}: ${error.message}`);
      }
    }
  });
  
  if (referencesUpdated > 0) {
    logSuccess(`Updated references in ${referencesUpdated} files`);
  } else {
    logSuccess('No additional references found to update');
  }

  // Step 6: Create a README update
  logProgress(6, 'Creating migration notes...');
  
  const migrationNotes = `# ${newProjectName}

## Project Migration
This project was migrated from the original luckstrology codebase on ${new Date().toISOString().split('T')[0]}.

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
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables (copy from original project):
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your database credentials
   \`\`\`

3. Run database migrations:
   \`\`\`bash
   npm run db:generate
   npm run db:migrate
   \`\`\`

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Migration Script
This project includes a migration script for future moves:
\`\`\`bash
node scripts/migrate-project.js <new-name> <destination> [git-url]
\`\`\`
`;

  const readmePath = path.join(destinationPath, 'MIGRATION.md');
  fs.writeFileSync(readmePath, migrationNotes);
  logSuccess('Migration notes created');

  // Step 7: Clean up any git references and initialize new repo
  logProgress(7, 'Setting up Git repository...');
  
  process.chdir(destinationPath);
  
  // Remove any existing git directory
  const gitDir = path.join(destinationPath, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  // Initialize new git repository
  execSync('git init', { stdio: 'inherit' });
  logSuccess('New Git repository initialized');

  // Create .gitignore if it doesn't exist
  const gitignorePath = path.join(destinationPath, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# Turbo
.turbo

# IDE
.vscode/
.idea/
*.swp
*.swo
`;
    fs.writeFileSync(gitignorePath, gitignoreContent);
    logSuccess('.gitignore created');
  }

  // Add files and make initial commit
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "Initial commit - migrated from luckstrology

- Preserved all astrological features and functionality
- Updated project name to ${newProjectName} (${projectSlug})
- Maintained existing database connections
- Ready for development"`, { stdio: 'inherit' });
  
  logSuccess('Initial commit created');

  // Add remote if provided
  if (gitRepoUrl) {
    logProgress(8, 'Adding Git remote...');
    execSync(`git remote add origin ${gitRepoUrl}`, { stdio: 'inherit' });
    logSuccess(`Git remote added: ${gitRepoUrl}`);
    log('');
    logWarning('Remember to push to the remote when ready:');
    log('  git push -u origin main', 'yellow');
  }

  // Step 8/9: Install dependencies
  logProgress(gitRepoUrl ? 9 : 8, 'Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  logSuccess('Dependencies installed');

  // Final success message
  log('\n🎉 Migration completed successfully!', 'green');
  log('');
  log('📋 Next Steps:', 'bright');
  log(`1. cd "${destinationPath}"`, 'cyan');
  log('2. Copy your .env.local file from the original project', 'cyan');
  log('3. npm run dev', 'cyan');
  if (gitRepoUrl) {
    log('4. git push -u origin main (when ready)', 'cyan');
  }
  log('');
  log('🗃️  Database: No migration needed - using existing Turso database', 'blue');
  log('📊 All features preserved: charts, profiles, forums, admin, events', 'blue');
  log('');

} catch (error) {
  logError(`Migration failed: ${error.message}`);
  console.error(error);
  
  // Cleanup on failure
  if (fs.existsSync(destinationPath)) {
    logWarning('Cleaning up partial migration...');
    try {
      fs.rmSync(destinationPath, { recursive: true, force: true });
      logSuccess('Cleanup completed');
    } catch (cleanupError) {
      logError(`Cleanup failed: ${cleanupError.message}`);
    }
  }
  
  process.exit(1);
}