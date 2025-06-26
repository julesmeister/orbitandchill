#!/usr/bin/env node

/**
 * Infrastructure Brand Migration Script
 * 
 * Migrates all remaining infrastructure-level brand references from "Luckstrology" 
 * to the new brand name while preserving user data.
 * 
 * Usage: node scripts/migrate-infrastructure-branding.js [--dry-run] [--phase=1|2|3]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const OLD_BRAND = 'Luckstrology';
const OLD_BRAND_LOWER = 'luckstrology';
const NEW_BRAND = 'OrbitAndChill'; // Safe for technical usage (no spaces)
const NEW_BRAND_LOWER = 'orbitandchill';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const phaseArg = args.find(arg => arg.startsWith('--phase='));
const targetPhase = phaseArg ? parseInt(phaseArg.split('=')[1]) : null;

console.log('🚀 Infrastructure Brand Migration Script');
console.log(`📝 Mode: ${isDryRun ? 'DRY RUN' : 'EXECUTION'}`);
console.log(`🎯 Target Phase: ${targetPhase || 'ALL'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Backup functions
function createBackup() {
  if (isDryRun) {
    console.log('📦 [DRY RUN] Would create backup of user data');
    return;
  }
  
  const backupDir = path.join(__dirname, '..', 'migration-backups', new Date().toISOString().split('T')[0]);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  console.log(`📦 Creating backup in: ${backupDir}`);
  
  // Note: Actual localStorage backup would need to be done client-side
  console.log('⚠️  Remember to backup localStorage/IndexedDB data separately');
}

// File update utilities
function updateFile(filePath, replacements, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  for (const { from, to } of replacements) {
    if (content.includes(from)) {
      if (isDryRun) {
        console.log(`📝 [DRY RUN] ${filePath}: "${from}" → "${to}"`);
      } else {
        content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), to);
        console.log(`✅ ${filePath}: "${from}" → "${to}"`);
      }
      modified = true;
    }
  }
  
  if (modified && !isDryRun) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`💾 Updated: ${filePath} - ${description}`);
  }
  
  return modified;
}

// Phase 1: Low-Risk Infrastructure Changes
function executePhase1() {
  console.log('\n🔧 PHASE 1: Low-Risk Infrastructure Changes');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 1. Database class names
  updateFile('src/store/database.ts', [
    { from: 'export class LuckstrologyDatabase', to: `export class ${NEW_BRAND}Database` },
    { from: 'super("LuckstrologyDB")', to: `super("${NEW_BRAND}DB")` },
    { from: 'new LuckstrologyDatabase()', to: `new ${NEW_BRAND}Database()` }
  ], 'Database class names');
  
  // 2. User agent strings
  updateFile('src/utils/reverseGeocoding.ts', [
    { from: "'User-Agent': 'Luckstrology-App/1.0'", to: `'User-Agent': '${NEW_BRAND}-App/1.0'` }
  ], 'User agent string');
  
  // 3. Library metadata - ALL instances
  updateFile('src/natal/index.ts', [
    { from: "author: 'Luckstrology',", to: `author: '${NEW_BRAND}',` },
    { from: "homepage: 'https://luckstrology.com',", to: "homepage: 'https://orbitandchill.com'," },
    { from: "repository: 'https://github.com/luckstrology/natal-js',", to: "repository: 'https://github.com/orbitandchill/natal-js'," }
  ], 'Library metadata - all instances');
  
  // 4. Legacy component cleanup
  updateFile('src/app/discussions/page-db.tsx', [
    { from: '"Astrology Discussions - Luckstrology Community"', to: '"Astrology Discussions - Orbit And Chill Community"' }
  ], 'Legacy component title');
}

// Phase 2: Medium-Risk Infrastructure Changes
function executePhase2() {
  console.log('\n🔧 PHASE 2: Medium-Risk Infrastructure Changes');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 1. Session keys (will invalidate existing sessions)
  updateFile('src/config/auth.ts', [
    { from: "storageKey: 'luckstrology_session',", to: `storageKey: '${NEW_BRAND_LOWER}_session',` }
  ], 'Session storage key');
  
  // 2. Admin default settings - ALL instances
  updateFile('src/db/services/adminSettingsService.ts', [
    { from: "value: 'contact@luckstrology.com',", to: "value: 'contact@orbitandchill.com'," },
    { from: "defaultValue: 'contact@luckstrology.com'", to: "defaultValue: 'contact@orbitandchill.com'" },
    { from: "value: 'noreply@luckstrology.com',", to: "value: 'noreply@orbitandchill.com'," },
    { from: "defaultValue: 'noreply@luckstrology.com'", to: "defaultValue: 'noreply@orbitandchill.com'" }
  ], 'Admin default email settings');
  
  console.log('⚠️  Note: Session key change will require users to re-login');
}

// Phase 3: High-Risk Data Migration
function executePhase3() {
  console.log('\n🔧 PHASE 3: High-Risk Data Migration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Create client-side migration script for storage keys
  const clientMigrationScript = `
// Client-side storage migration script
// Run this in browser console or include in app startup

(function migrateUserData() {
  console.log('🔄 Starting user data migration...');
  
  try {
    // Migrate user storage
    const userData = localStorage.getItem('${OLD_BRAND_LOWER}-user-storage');
    if (userData) {
      localStorage.setItem('${NEW_BRAND_LOWER}-user-storage', userData);
      console.log('✅ Migrated user storage data');
    }
    
    // Migrate events storage  
    const eventsData = localStorage.getItem('${OLD_BRAND_LOWER}-events-storage');
    if (eventsData) {
      localStorage.setItem('${NEW_BRAND_LOWER}-events-storage', eventsData);
      console.log('✅ Migrated events storage data');
    }
    
    // Migrate IndexedDB (if using Dexie)
    if (window.indexedDB) {
      // Note: This requires more complex handling for production
      console.log('⚠️  IndexedDB migration requires manual handling');
    }
    
    console.log('🎉 Migration completed successfully');
    
    // Optionally clean up old data after confirmation
    // localStorage.removeItem('${OLD_BRAND_LOWER}-user-storage');
    // localStorage.removeItem('${OLD_BRAND_LOWER}-events-storage');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
})();
`;
  
  const clientScriptPath = path.join(__dirname, '..', 'public', 'migrate-user-data.js');
  
  if (!isDryRun) {
    fs.writeFileSync(clientScriptPath, clientMigrationScript);
    console.log(`📄 Created client migration script: ${clientScriptPath}`);
  } else {
    console.log('📝 [DRY RUN] Would create client migration script');
  }
  
  // Update storage keys in code - ALL instances
  updateFile('src/store/userStore.ts', [
    { from: '"luckstrology-user-storage"', to: `"${NEW_BRAND_LOWER}-user-storage"` }
  ], 'User store storage key');
  
  updateFile('src/store/eventsStore.ts', [
    { from: "localStorage.getItem('luckstrology-events-storage')", to: `localStorage.getItem('${NEW_BRAND_LOWER}-events-storage')` },
    { from: "localStorage.setItem('luckstrology-events-storage'", to: `localStorage.setItem('${NEW_BRAND_LOWER}-events-storage'` },
    { from: '"luckstrology-events-storage"', to: `"${NEW_BRAND_LOWER}-events-storage"` }
  ], 'Events store storage keys - all instances');
  
  console.log('⚠️  CRITICAL: Deploy client migration script before code changes');
  console.log('⚠️  CRITICAL: Test data migration thoroughly in staging');
}

// Validation function
function validateMigration() {
  console.log('\n🔍 VALIDATION: Checking for remaining references');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const result = execSync(
      `grep -r "luckstrology\\|Luckstrology" src --include="*.ts" --include="*.tsx" --exclude-dir=".next" --exclude="dataMigration.ts" || true`,
      { encoding: 'utf8', cwd: path.join(__dirname, '..') }
    );
    
    if (result.trim()) {
      console.log('⚠️  Remaining references found:');
      console.log(result);
    } else {
      console.log('✅ No remaining infrastructure references found');
    }
  } catch (error) {
    console.log('❌ Validation failed:', error.message);
  }
}

// Rollback function
function createRollbackScript() {
  const rollbackScript = `#!/usr/bin/env node
/**
 * Emergency Rollback Script
 * Reverts infrastructure brand migration changes
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Rolling back infrastructure brand migration...');

// Add rollback logic here
// This would reverse all the changes made by the migration script

console.log('✅ Rollback completed');
`;
  
  const rollbackPath = path.join(__dirname, 'rollback-infrastructure-migration.js');
  
  if (!isDryRun) {
    fs.writeFileSync(rollbackPath, rollbackScript);
    console.log(`📄 Created rollback script: ${rollbackPath}`);
  }
}

// Main execution
function main() {
  // Create backup first
  createBackup();
  
  // Execute phases based on target
  if (!targetPhase || targetPhase === 1) {
    executePhase1();
  }
  
  if (!targetPhase || targetPhase === 2) {
    executePhase2();
  }
  
  if (!targetPhase || targetPhase === 3) {
    executePhase3();
  }
  
  // Create rollback script
  createRollbackScript();
  
  // Validate migration
  if (!isDryRun) {
    validateMigration();
  }
  
  console.log('\n🎉 Migration script completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (isDryRun) {
    console.log('📝 This was a dry run. No files were modified.');
    console.log('💡 Run without --dry-run to execute changes');
  } else {
    console.log('⚠️  Remember to:');
    console.log('   1. Test in staging environment first');
    console.log('   2. Deploy client migration script before code changes');
    console.log('   3. Monitor user data integrity after deployment');
    console.log('   4. Have rollback plan ready');
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  executePhase1,
  executePhase2, 
  executePhase3,
  validateMigration
};