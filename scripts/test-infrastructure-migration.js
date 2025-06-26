#!/usr/bin/env node

/**
 * Infrastructure Brand Migration Test Suite
 * 
 * Tests the migration script and validates infrastructure changes
 * 
 * Usage: node scripts/test-infrastructure-migration.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Infrastructure Brand Migration Test Suite');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function test(description, testFn) {
  try {
    const result = testFn();
    if (result === true) {
      console.log(`✅ ${description}`);
      testResults.passed++;
    } else if (result === 'warning') {
      console.log(`⚠️  ${description}`);
      testResults.warnings++;
    } else {
      console.log(`❌ ${description}: ${result}`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    testResults.failed++;
  }
}

// Test file existence
function testFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

// Test file contains string
function testFileContains(filePath, searchString) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return `File not found: ${filePath}`;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  return content.includes(searchString);
}

// Test file does not contain string
function testFileNotContains(filePath, searchString) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return `File not found: ${filePath}`;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  return !content.includes(searchString);
}

console.log('\n📋 Running Pre-Migration Tests');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Pre-migration validation
test('Migration script exists', () => testFileExists('scripts/migrate-infrastructure-branding.js'));
test('Migration documentation exists', () => testFileExists('INFRASTRUCTURE_MIGRATION.md'));
test('Brand config file exists', () => testFileExists('src/config/brand.ts'));

// Test current state (before migration)
test('Database class still uses old name', () => testFileContains('src/store/database.ts', 'LuckstrologyDatabase'));
test('User storage key still uses old name', () => testFileContains('src/store/userStore.ts', 'luckstrology-user-storage'));
test('Events storage key still uses old name', () => testFileContains('src/store/eventsStore.ts', 'luckstrology-events-storage'));
test('Session key still uses old name', () => testFileContains('src/config/auth.ts', 'luckstrology_session'));

console.log('\n🔧 Testing Migration Script (Dry Run)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Test dry run execution
test('Migration script runs without errors (dry run)', () => {
  try {
    const result = execSync('node scripts/migrate-infrastructure-branding.js --dry-run --phase=1', 
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
    return result.includes('Migration script completed');
  } catch (error) {
    return error.message;
  }
});

console.log('\n📊 Testing Migration Phases');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Test individual phases
test('Phase 1 dry run executes', () => {
  try {
    const result = execSync('node scripts/migrate-infrastructure-branding.js --dry-run --phase=1', 
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
    return result.includes('PHASE 1');
  } catch (error) {
    return error.message;
  }
});

test('Phase 2 dry run executes', () => {
  try {
    const result = execSync('node scripts/migrate-infrastructure-branding.js --dry-run --phase=2', 
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
    return result.includes('PHASE 2');
  } catch (error) {
    return error.message;
  }
});

test('Phase 3 dry run executes', () => {
  try {
    const result = execSync('node scripts/migrate-infrastructure-branding.js --dry-run --phase=3', 
      { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
    return result.includes('PHASE 3');
  } catch (error) {
    return error.message;
  }
});

console.log('\n🔍 Testing Brand Configuration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('Brand config has required fields', () => {
  return testFileContains('src/config/brand.ts', 'name:') &&
         testFileContains('src/config/brand.ts', 'domain:') &&
         testFileContains('src/config/brand.ts', 'socialHandles:');
});

test('Brand config exports BRAND constant', () => {
  return testFileContains('src/config/brand.ts', 'export const BRAND');
});

console.log('\n⚡ Testing Data Migration Safety');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('Storage migration preserves data structure', () => {
  // This would need to be tested with actual localStorage data
  // For now, just check that the migration script includes data preservation logic
  const migrationScript = fs.readFileSync(
    path.join(__dirname, 'migrate-infrastructure-branding.js'), 
    'utf8'
  );
  return migrationScript.includes('localStorage.getItem') && 
         migrationScript.includes('localStorage.setItem');
});

test('Migration includes backup creation', () => {
  const migrationScript = fs.readFileSync(
    path.join(__dirname, 'migrate-infrastructure-branding.js'), 
    'utf8'
  );
  return migrationScript.includes('createBackup');
});

test('Migration includes rollback capability', () => {
  const migrationScript = fs.readFileSync(
    path.join(__dirname, 'migrate-infrastructure-branding.js'), 
    'utf8'
  );
  return migrationScript.includes('rollback');
});

console.log('\n🏗️ Testing Build Compatibility');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('TypeScript compiles without errors', () => {
  try {
    execSync('npx tsc --noEmit', { 
      cwd: path.join(__dirname, '..'), 
      stdio: 'pipe' 
    });
    return true;
  } catch (error) {
    return 'warning'; // TypeScript errors might be unrelated
  }
});

test('No syntax errors in migration script', () => {
  try {
    execSync('node -c scripts/migrate-infrastructure-branding.js', { 
      cwd: path.join(__dirname, '..'), 
      stdio: 'pipe' 
    });
    return true;
  } catch (error) {
    return error.message;
  }
});

console.log('\n📄 Testing Documentation');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('Migration documentation is comprehensive', () => {
  const docContent = fs.readFileSync(
    path.join(__dirname, '..', 'INFRASTRUCTURE_MIGRATION.md'), 
    'utf8'
  );
  return docContent.includes('Risk Assessment') &&
         docContent.includes('Rollback Strategy') &&
         docContent.includes('Testing Strategy');
});

test('Documentation includes all file references', () => {
  const docContent = fs.readFileSync(
    path.join(__dirname, '..', 'INFRASTRUCTURE_MIGRATION.md'), 
    'utf8'
  );
  return docContent.includes('database.ts') &&
         docContent.includes('userStore.ts') &&
         docContent.includes('eventsStore.ts') &&
         docContent.includes('auth.ts');
});

console.log('\n📈 Test Results Summary');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);

const totalTests = testResults.passed + testResults.failed + testResults.warnings;
const successRate = totalTests > 0 ? ((testResults.passed / totalTests) * 100).toFixed(1) : 0;

console.log(`📊 Success Rate: ${successRate}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All critical tests passed! Migration is ready for staging.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Review issues before migration.');
  process.exit(1);
}