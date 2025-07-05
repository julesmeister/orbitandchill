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
    
    // Step 1: Remove complete console.log statements with balanced parentheses
    const consoleLogPattern = /console\.log\s*\(\s*(?:[^()]*|\([^)]*\))*\s*\)\s*;?\s*\n?/g;
    modifiedContent = modifiedContent.replace(consoleLogPattern, (match) => {
      // Double check it's actually console.log and not console.error etc
      if (!/\bconsole\.(error|warn|info|debug|trace|time|timeEnd|group|groupEnd|table)\s*\(/.test(match)) {
        removedCount++;
        return '';
      }
      return match;
    });
    
    // Step 2: Clean up orphaned object properties that were part of console.log calls
    // These are lines that start with property names followed by colon, likely from broken console.log objects
    const lines = modifiedContent.split('\n');
    const linesToRemove = [];
    let inOrphanedObject = false;
    let braceDepth = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip commented lines
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        return;
      }
      
      // Check for orphaned object properties (property: value patterns not in valid contexts)
      if (/^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*/.test(line)) {
        // Look at surrounding context to see if this is likely an orphaned console.log parameter
        const prevLine = index > 0 ? lines[index - 1].trim() : '';
        const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';
        
        // If previous line doesn't end with opening brace, paren, or comma, and
        // this line looks like an object property, it's likely orphaned
        if (!prevLine.endsWith('{') && !prevLine.endsWith('(') && !prevLine.endsWith(',') &&
            !prevLine.includes('=') && !prevLine.includes('return') && !prevLine.includes('const') &&
            !prevLine.includes('let') && !prevLine.includes('var') && !prevLine.includes('if') &&
            !prevLine.includes('interface') && !prevLine.includes('type') && !prevLine.includes('class')) {
          inOrphanedObject = true;
          braceDepth = 0;
        }
      }
      
      if (inOrphanedObject) {
        // Count braces to know when orphaned object ends
        braceDepth += (line.match(/\{/g) || []).length;
        braceDepth -= (line.match(/\}/g) || []).length;
        
        linesToRemove.push(index);
        
        // If we hit a closing brace/paren with semicolon, or just a closing brace followed by semicolon
        if (trimmed.endsWith('});') || trimmed.endsWith('}') || braceDepth < 0) {
          inOrphanedObject = false;
          braceDepth = 0;
        }
      }
    });
    
    // Remove orphaned lines in reverse order to maintain indices
    linesToRemove.reverse().forEach(lineIndex => {
      lines.splice(lineIndex, 1);
    });
    
    modifiedContent = lines.join('\n');
    
    // Step 3: Clean up extra blank lines (more than 2 consecutive)
    modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Only write if changes were made
    if (removedCount > 0 || linesToRemove.length > 0) {
      fs.writeFileSync(filePath, modifiedContent);
      return removedCount + linesToRemove.length;
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

  if (!fs.existsSync(startDir)) {
    console.error(`Directory ${startDir} does not exist!`);
    return;
  }
  
  const files = findFiles(startDir);
  
  let totalRemoved = 0;
  let filesModified = 0;
  
  files.forEach(filePath => {
    const removed = dryRun ? countConsoleLogs(filePath) : removeConsoleLogs(filePath);
    if (removed > 0) {
      totalRemoved += removed;
      filesModified++;
    }
  });

  if (dryRun) {
  } else if (filesModified > 0) {
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
      }
    });
    
    if (count > 0) {
    }
    
    return count;
  } catch (error) {
    console.error(`✗ Error reading ${filePath}: ${error.message}`);
    return 0;
  }
}

// Run the script
main();