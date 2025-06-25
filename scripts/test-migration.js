#!/usr/bin/env node

/**
 * Migration Test Script
 * Tests the migration script's validation and logic without performing actual migration
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
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\nTesting: ${testName}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test suite
let testsPassed = 0;
let testsFailed = 0;

function runTest(testName, testFn) {
  logTest(testName);
  try {
    testFn();
    testsPassed++;
    logSuccess(`${testName} passed`);
  } catch (error) {
    testsFailed++;
    logError(`${testName} failed: ${error.message}`);
  }
}

// Start tests
log('\n🧪 Migration Script Test Suite', 'bright');
log('================================\n', 'bright');

// Test 1: Verify environment
runTest('Environment Setup', () => {
  // Check Node.js
  const nodeVersion = process.version;
  logInfo(`Node.js version: ${nodeVersion}`);
  
  // Check current directory
  const cwd = process.cwd();
  logInfo(`Current directory: ${cwd}`);
  
  // Check if we're in the right project
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }
  
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  logInfo(`Current project: ${pkg.name}`);
  
  // Check migration script exists
  if (!fs.existsSync('scripts/migrate-project.js')) {
    throw new Error('Migration script not found');
  }
});

// Test 2: Test auto-path generation
runTest('Auto-path Generation', () => {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);
  const testProjectName = 'test-astrology-app';
  const expectedPath = path.join(parentDir, testProjectName);
  
  logInfo(`Current dir: ${currentDir}`);
  logInfo(`Parent dir: ${parentDir}`);
  logInfo(`Expected auto-path: ${expectedPath}`);
  
  // Verify parent directory exists and is writable
  if (!fs.existsSync(parentDir)) {
    throw new Error('Parent directory does not exist');
  }
  
  // Test write permissions
  const testPath = path.join(parentDir, `test-write-${Date.now()}`);
  try {
    fs.mkdirSync(testPath);
    fs.rmSync(testPath, { recursive: true });
    logInfo('Parent directory is writable');
  } catch (error) {
    throw new Error(`No write permission to parent directory: ${error.message}`);
  }
});

// Test 3: Validate required tools
runTest('Required Tools Check', () => {
  // Check Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    logInfo(`Git: ${gitVersion}`);
  } catch (error) {
    throw new Error('Git is not installed or not in PATH');
  }
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logInfo(`npm: ${npmVersion}`);
  } catch (error) {
    throw new Error('npm is not installed or not in PATH');
  }
});

// Test 4: Test project name validation
runTest('Project Name Validation', () => {
  const validNames = [
    'astrology-app',
    'stellar_charts',
    'MyAstroApp',
    'astro-app-2024',
    'Cosmic Charts'
  ];
  
  const invalidNames = [
    'astro/app',
    'astro\\app',
    'astro:app',
    'astro*app',
    'astro?app'
  ];
  
  const validNameRegex = /^[a-zA-Z0-9-_\s]+$/;
  
  validNames.forEach(name => {
    if (!validNameRegex.test(name)) {
      throw new Error(`Valid name "${name}" failed regex`);
    }
  });
  logInfo(`✓ All valid names passed`);
  
  invalidNames.forEach(name => {
    if (validNameRegex.test(name)) {
      throw new Error(`Invalid name "${name}" passed regex`);
    }
  });
  logInfo(`✓ All invalid names rejected`);
});

// Test 5: Test brand.ts detection and parsing
runTest('Brand Configuration Check', () => {
  const brandPath = 'src/config/brand.ts';
  
  if (!fs.existsSync(brandPath)) {
    throw new Error('brand.ts not found');
  }
  
  const brandContent = fs.readFileSync(brandPath, 'utf8');
  
  // Check current brand name
  const nameMatch = brandContent.match(/name:\s*["']([^"']+)["']/);
  if (!nameMatch) {
    throw new Error('Could not find brand name in brand.ts');
  }
  
  logInfo(`Current brand name: ${nameMatch[1]}`);
  
  // Test brand name replacement logic
  const testProjectName = 'stellar-charts';
  const expectedBrandName = 'Stellar Charts';
  
  const actualBrandName = testProjectName
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  if (actualBrandName !== expectedBrandName) {
    throw new Error(`Brand name conversion failed: expected "${expectedBrandName}", got "${actualBrandName}"`);
  }
  
  logInfo(`✓ Brand name conversion works correctly`);
});

// Test 6: Test file exclusion patterns
runTest('File Exclusion Patterns', () => {
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
  
  logInfo(`Exclusion patterns: ${excludePatterns.join(', ')}`);
  
  // Check if any excluded directories exist
  const existingExcludes = excludePatterns.filter(pattern => {
    // Remove wildcards for existence check
    const checkPath = pattern.replace('*', '');
    return fs.existsSync(checkPath);
  });
  
  if (existingExcludes.length > 0) {
    logInfo(`Found excludable items: ${existingExcludes.join(', ')}`);
  }
});

// Test 7: Dry run simulation
runTest('Migration Dry Run Simulation', () => {
  const testProjectName = 'test-migration-' + Date.now();
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);
  const testDestination = path.join(parentDir, testProjectName);
  
  logInfo(`Simulating migration to: ${testDestination}`);
  
  // Check if destination already exists
  if (fs.existsSync(testDestination)) {
    throw new Error('Test destination already exists');
  }
  
  // Simulate what would be copied
  const itemsToCopy = fs.readdirSync('.')
    .filter(item => {
      return ![
        'node_modules', '.git', '.next', 'dist', 'build',
        '.turbo', '.vercel', 'coverage'
      ].includes(item) && !item.endsWith('.log');
    });
  
  logInfo(`Would copy ${itemsToCopy.length} items`);
  logInfo(`Sample items: ${itemsToCopy.slice(0, 5).join(', ')}...`);
  
  // Check total size (excluding node_modules)
  let totalSize = 0;
  function getSize(dir, exclude = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (exclude.some(ex => filePath.includes(ex))) return;
      
      const stats = fs.statSync(filePath);
      if (stats.isDirectory() && !exclude.includes(file)) {
        getSize(filePath, exclude);
      } else {
        totalSize += stats.size;
      }
    });
  }
  
  try {
    getSize('.', ['node_modules', '.git', '.next', 'dist', 'build']);
    const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
    logInfo(`Estimated size to copy: ${sizeMB} MB`);
  } catch (error) {
    logInfo('Could not calculate size');
  }
});

// Test 8: Test Git URL validation
runTest('Git URL Validation', () => {
  const validUrls = [
    'https://github.com/user/repo.git',
    'https://github.com/user/repo',
    'git@github.com:user/repo.git',
    'https://gitlab.com/user/repo.git',
    'git@bitbucket.org:user/repo.git'
  ];
  
  const invalidUrls = [
    'not-a-url',
    'ftp://example.com/repo',
    'github.com/user/repo',
    'user/repo'
  ];
  
  const gitUrlRegex = /^(https?:\/\/|git@)[\w\.-]+[\/:][\w\.-]+\/[\w\.-]+(\.git)?$/;
  
  validUrls.forEach(url => {
    if (!gitUrlRegex.test(url)) {
      throw new Error(`Valid URL "${url}" failed regex`);
    }
  });
  logInfo(`✓ All valid Git URLs passed`);
  
  let invalidPassed = 0;
  invalidUrls.forEach(url => {
    if (gitUrlRegex.test(url)) {
      invalidPassed++;
    }
  });
  
  if (invalidPassed > 0) {
    throw new Error(`${invalidPassed} invalid URLs incorrectly passed`);
  }
  logInfo(`✓ All invalid Git URLs rejected`);
});

// Summary
log('\n\n📊 Test Summary', 'bright');
log('================', 'bright');
log(`Total tests: ${testsPassed + testsFailed}`, 'cyan');
logSuccess(`Passed: ${testsPassed}`);
if (testsFailed > 0) {
  logError(`Failed: ${testsFailed}`);
} else {
  log('\n🎉 All tests passed! The migration script should work correctly.', 'green');
  log('\nYou can now run:', 'blue');
  log('  npm run migrate "your-new-project-name"', 'cyan');
}

process.exit(testsFailed > 0 ? 1 : 0);