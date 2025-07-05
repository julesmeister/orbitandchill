#!/usr/bin/env node

/**
 * Font Optimization Script
 * Updates font classes to use only Space Grotesk and Open Sans
 */

const fs = require('fs');
const path = require('path');

// Font class mappings - map old font classes to our optimized fonts
const FONT_MAPPINGS = {
  'font-geist-sans': 'font-open-sans',
  'font-geist-mono': 'font-open-sans', 
  'font-epilogue': 'font-space-grotesk',
  'font-inter': 'font-open-sans',
  'font-arvo': 'font-open-sans',
  // Keep existing optimized fonts
  'font-space-grotesk': 'font-space-grotesk',
  'font-open-sans': 'font-open-sans'
};

const COMPONENTS_DIR = 'src';
let modificationsCount = 0;
let filesModified = [];

/**
 * Find all TypeScript/React files
 */
function findAllTSXFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

/**
 * Update font classes in file content
 */
function updateFontClasses(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const changes = [];
  
  // Replace font class names
  Object.entries(FONT_MAPPINGS).forEach(([oldFont, newFont]) => {
    if (oldFont === newFont) return; // Skip if same font
    
    const regex = new RegExp(`\\b${oldFont}\\b`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, newFont);
      modified = true;
      changes.push(`${oldFont} → ${newFont} (${matches.length} instances)`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    modificationsCount++;
    filesModified.push({
      file: filePath,
      changes: changes
    });
    
    console.log(`✓ ${path.relative(process.cwd(), filePath)}: ${changes.join(', ')}`);
  }
  
  return modified;
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Starting font optimization...\n');
  
  // Find all files to process
  const filesToProcess = findAllTSXFiles(COMPONENTS_DIR);
  
  console.log(`Found ${filesToProcess.length} TypeScript/React files\n`);
  
  // Process each file
  filesToProcess.forEach(filePath => {
    updateFontClasses(filePath);
  });
  
  // Summary
  console.log('\n📊 Font Optimization Summary:');
  console.log(`Files processed: ${filesToProcess.length}`);
  console.log(`Files modified: ${modificationsCount}`);
  console.log(`Optimized fonts: Space Grotesk (headings) + Open Sans (body text)`);
  console.log(`Removed fonts: Geist Sans, Geist Mono, Inter, Epilogue, Arvo`);
  
  if (filesModified.length > 0) {
    console.log('\n🔧 Modified files:');
    filesModified.forEach(({ file, changes }) => {
      console.log(`  ${path.relative(process.cwd(), file)}: ${changes.join(', ')}`);
    });
  }
  
  console.log('\n✅ Font optimization completed!');
  console.log('💡 Benefits: Reduced font bundle size, faster page loads, consistent typography');
}

// Run the script
main();