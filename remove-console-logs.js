#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File extensions to process
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Directories to ignore
const ignoreDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

// Function to recursively find files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip ignored directories
      if (!ignoreDirs.includes(file)) {
        findFiles(filePath, fileList);
      }
    } else {
      // Check if file has target extension
      if (extensions.includes(path.extname(file))) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Function to remove console.log statements (but keep console.error, console.warn)
function removeConsoleLogs(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let removedCount = 0;
    
    // More precise regex patterns that only match console.log (not console.error, console.warn)
    const patterns = [
      // Match console.log specifically (not console.error, console.warn, etc.)
      /(?<!\/\/.*?)console\.log\s*\([^)]*\)\s*;?\s*\n?/g,
      // Match multiline console.log with proper parentheses balancing
      /(?<!\/\/.*?)console\.log\s*\(\s*(?:[^()]*|\([^)]*\))*\s*\)\s*;?\s*\n?/g
    ];
    
    // First, let's find all console.log statements and check them
    const lines = modifiedContent.split('\n');
    const linesToRemove = [];
    
    lines.forEach((line, index) => {
      // Skip commented lines
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
        return;
      }
      
      // Only match console.log, not console.error, console.warn, console.info, etc.
      if (/\bconsole\.log\s*\(/.test(line) && 
          !/\bconsole\.(error|warn|info|debug|trace|time|timeEnd|group|groupEnd|table)\s*\(/.test(line)) {
        linesToRemove.push(index);
        removedCount++;
      }
    });
    
    // Remove lines in reverse order to maintain indices
    linesToRemove.reverse().forEach(lineIndex => {
      lines.splice(lineIndex, 1);
    });
    
    modifiedContent = lines.join('\n');
    
    // Clean up extra blank lines (more than 2 consecutive)
    modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Only write if changes were made
    if (removedCount > 0) {
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`✓ ${filePath}: Removed ${removedCount} console.log statement(s)`);
      return removedCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    return 0;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const targetDir = args.find(arg => !arg.startsWith('--')) || 'src';
  
  const startDir = path.join(process.cwd(), targetDir);
  
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Scanning for console.log statements in ${startDir}...`);
  console.log(`Will ${dryRun ? 'simulate removing' : 'remove'} console.log but keep console.error, console.warn, etc.\n`);
  
  if (!fs.existsSync(startDir)) {
    console.error(`Directory ${startDir} does not exist!`);
    return;
  }
  
  const files = findFiles(startDir);
  console.log(`Found ${files.length} files to process\n`);
  
  let totalRemoved = 0;
  let filesModified = 0;
  
  files.forEach(filePath => {
    const removed = dryRun ? countConsoleLogs(filePath) : removeConsoleLogs(filePath);
    if (removed > 0) {
      totalRemoved += removed;
      filesModified++;
    }
  });
  
  console.log(`\nSummary:`);
  console.log(`Files processed: ${files.length}`);
  console.log(`Files ${dryRun ? 'that would be modified' : 'modified'}: ${filesModified}`);
  console.log(`Total console.log statements ${dryRun ? 'found' : 'removed'}: ${totalRemoved}`);
  
  if (dryRun) {
    console.log(`\nTo actually remove console.log statements, run without --dry-run flag`);
  } else if (filesModified > 0) {
    console.log(`\n⚠️  Remember to test your application to ensure nothing broke!`);
  }
}

// Function to count console.log statements (for dry run)
function countConsoleLogs(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let count = 0;
    
    lines.forEach((line, index) => {
      // Skip commented lines
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
        return;
      }
      
      // Only match console.log, not console.error, console.warn, etc.
      if (/\bconsole\.log\s*\(/.test(line) && 
          !/\bconsole\.(error|warn|info|debug|trace|time|timeEnd|group|groupEnd|table)\s*\(/.test(line)) {
        count++;
        console.log(`  ${filePath}:${index + 1} - ${line.trim()}`);
      }
    });
    
    if (count > 0) {
      console.log(`📁 ${filePath}: Found ${count} console.log statement(s)`);
    }
    
    return count;
  } catch (error) {
    console.error(`✗ Error reading ${filePath}: ${error.message}`);
    return 0;
  }
}

// Run the script
main();