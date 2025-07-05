#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Track heading hierarchy issues
const issues = [];

function analyzeHeadingHierarchy(filePath, content) {
  const headingRegex = /<h([1-6])[^>]*>/g;
  let match;
  const headings = [];
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const line = content.substring(0, match.index).split('\n').length;
    headings.push({ level, line, match: match[0] });
  }
  
  if (headings.length === 0) return;
  
  const fileIssues = [];
  
  // Check for multiple h1 tags
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count > 1) {
    fileIssues.push(`Multiple h1 tags (${h1Count} found) - should only have one per page`);
  }
  
  // Check for missing h1
  if (h1Count === 0) {
    fileIssues.push('Missing h1 tag - every page should have exactly one h1');
  }
  
  // Check for skipped heading levels
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];
    
    if (current.level > previous.level + 1) {
      fileIssues.push(`Heading level skip: h${previous.level} → h${current.level} at line ${current.line}`);
    }
  }
  
  // Check for improper nesting in sections
  let currentSection = null;
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    
    if (heading.level === 1) {
      currentSection = 'main';
    } else if (heading.level === 2) {
      currentSection = 'section';
    }
  }
  
  if (fileIssues.length > 0) {
    issues.push({
      file: filePath,
      issues: fileIssues,
      headings: headings
    });
  }
}

function fixCommonIssues(filePath, content) {
  let fixed = content;
  let changes = [];
  
  // Fix: Footer headings should be h2 for main sections, h3 for subsections
  if (filePath.includes('Layout.tsx')) {
    // Brand section should be h2
    fixed = fixed.replace(
      /<h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Orbit and Chill<\/h3>/,
      '<h2 className="font-space-grotesk text-xl font-bold text-black mb-4">Orbit and Chill</h2>'
    );
    if (fixed !== content) changes.push('Footer brand: h3 → h2');
    
    // Footer subsections should be h3
    const h4Pattern = /<h4 className="font-space-grotesk text-sm font-bold text-black mb-6">/g;
    fixed = fixed.replace(h4Pattern, '<h3 className="font-space-grotesk text-sm font-bold text-black mb-6">');
    if (fixed.match(h4Pattern)) changes.push('Footer sections: h4 → h3');
    
    // Newsletter should be h3
    fixed = fixed.replace(
      /<h3 className="font-space-grotesk text-3xl font-bold text-black mb-4">/,
      '<h3 className="font-space-grotesk text-3xl font-bold text-black mb-4">'
    );
  }
  
  // Fix: Chart page multiple h1 tags
  if (filePath.includes('chart/page.tsx')) {
    // Keep first h1, change subsequent ones to h2
    let h1Count = 0;
    fixed = fixed.replace(/<h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">/g, (match) => {
      h1Count++;
      if (h1Count === 1) {
        return match; // Keep first h1
      } else {
        changes.push(`H1 ${h1Count} → H2`);
        return match.replace('<h1', '<h2').replace('text-4xl md:text-5xl', 'text-3xl md:text-4xl');
      }
    });
  }
  
  // Fix: Missing h1 in pages that start with h2/h3
  if (filePath.includes('discussions/page.tsx')) {
    // Add h1 for main page title if missing
    if (!content.includes('<h1')) {
      fixed = fixed.replace(
        /(<main[^>]*>[\s\S]*?<div[^>]*>[\s\S]*?<div[^>]*>)/,
        '$1\n        <h1 className="sr-only">Community Discussions</h1>'
      );
      changes.push('Added h1 for accessibility');
    }
  }
  
  // Fix: Learning center heading hierarchy
  if (filePath.includes('learning-center/page.tsx')) {
    // Fix h3 sections that should be h2
    fixed = fixed.replace(
      /<h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">More Features to Explore<\/h3>/,
      '<h2 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">More Features to Explore</h2>'
    );
    fixed = fixed.replace(
      /<h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">Quick Start Guide<\/h3>/,
      '<h2 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">Quick Start Guide</h2>'
    );
    fixed = fixed.replace(
      /<h3 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-4">Ready to Begin Your Astrological Journey\?<\/h3>/,
      '<h2 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-4">Ready to Begin Your Astrological Journey?</h2>'
    );
    if (fixed !== content) changes.push('Learning center: h3 sections → h2');
  }
  
  // Fix: Profile page heading structure
  if (filePath.includes('profile/page.tsx')) {
    // Ensure proper heading hierarchy in profile sections
    fixed = fixed.replace(
      /<h3 className="font-space-grotesk text-lg font-bold text-black mb-3">/g,
      '<h2 className="font-space-grotesk text-lg font-bold text-black mb-3">'
    );
    if (fixed !== content) changes.push('Profile sections: h3 → h2');
  }
  
  return { content: fixed, changes };
}

function scanAndFixFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory() && !['node_modules', '.git', '.next'].includes(file.name)) {
      scanAndFixFiles(filePath);
    } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Analyze issues
        analyzeHeadingHierarchy(filePath, content);
        
        // Apply fixes
        const { content: fixedContent, changes } = fixCommonIssues(filePath, content);
        
        if (changes.length > 0) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
        }
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    }
  }
}

// Scan src directory
scanAndFixFiles('./src');

// Report remaining issues
if (issues.length > 0) {
  issues.forEach(({ file, issues: fileIssues, headings }) => {
  });
}
