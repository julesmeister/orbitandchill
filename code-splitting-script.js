#!/usr/bin/env node

/**
 * Code Splitting Implementation Script
 * Identifies heavy components and implements dynamic imports for better performance
 */

const fs = require('fs');
const path = require('path');

// Heavy components that should be lazy loaded
const HEAVY_COMPONENTS = [
  'SimpleRichTextEditor',
  'TipTapEditor', 
  'ChartDisplay',
  'NatalChartDisplay',
  'AstrocartographyMap',
  'MatrixOfDestiny',
  'ThreadingLines',
  'DiscussionForm',
  'ImageUploadModal',
  'FullscreenMapModal'
];

// Components directory
const COMPONENTS_DIR = 'src/components';
const PAGES_DIR = 'src/app';

let modificationsCount = 0;
let filesModified = [];

/**
 * Find all files that import heavy components
 */
function findFilesImportingHeavyComponents(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check if file imports any heavy components
          const hasHeavyImports = HEAVY_COMPONENTS.some(component => {
            const importRegex = new RegExp(`import.*${component}.*from`, 'g');
            return importRegex.test(content);
          });
          
          if (hasHeavyImports) {
            files.push(fullPath);
          }
        } catch (error) {
          console.warn(`Warning: Could not read ${fullPath}:`, error.message);
        }
      }
    }
  }
  
  walkDir(dir);
  return files;
}

/**
 * Convert static imports to dynamic imports with Suspense
 */
function convertToDynamicImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const changes = [];
  
  // Track if we need to add React.lazy import
  let needsLazy = false;
  let needsSuspense = false;
  
  HEAVY_COMPONENTS.forEach(component => {
    // Match import statements for this component
    const importRegex = new RegExp(`import\\s+${component}\\s+from\\s+['"](.*?)['"];?`, 'g');
    const match = importRegex.exec(content);
    
    if (match) {
      const importPath = match[1];
      
      // Remove the static import
      content = content.replace(match[0], '');
      
      // Add lazy import at the top after other imports
      const lazyImport = `const ${component} = React.lazy(() => import('${importPath}'));`;
      
      // Find where to insert the lazy import (after existing imports)
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + 
                 lazyImport + '\n' + 
                 content.slice(endOfLastImport + 1);
      }
      
      needsLazy = true;
      needsSuspense = true;
      modified = true;
      changes.push(`Converted ${component} to lazy loading`);
    }
  });
  
  // Add React.lazy import if needed
  if (needsLazy) {
    const hasReactImport = /import\s+.*React.*from\s+['"](react|'react')['"];?/g.test(content);
    
    if (hasReactImport) {
      // Update existing React import to include lazy
      content = content.replace(
        /import\s+React(.*?)from\s+['"](react)['"];?/g,
        "import React, { Suspense$1from 'react';"
      );
    } else {
      // Add new React import
      const firstImport = content.indexOf('import ');
      if (firstImport !== -1) {
        content = content.slice(0, firstImport) + 
                 "import React, { Suspense } from 'react';\n" + 
                 content.slice(firstImport);
      }
    }
  }
  
  // Wrap heavy component usage in Suspense
  if (needsSuspense) {
    HEAVY_COMPONENTS.forEach(component => {
      // Find JSX usage of the component
      const jsxRegex = new RegExp(`<${component}([^>]*?)>`, 'g');
      
      content = content.replace(jsxRegex, (match, props) => {
        return `<Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-black animate-bounce"></div>
            </div>
          </div>
        }>
          <${component}${props}>`;
      });
      
      // Close Suspense tags
      const closingRegex = new RegExp(`</${component}>`, 'g');
      content = content.replace(closingRegex, `</${component}>
        </Suspense>`);
    });
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    modificationsCount++;
    filesModified.push({
      file: filePath,
      changes: changes
    });
    
  }
  
  return modified;
}

/**
 * Main execution
 */
function main() {
  
  // Find all files that import heavy components
  const filesToProcess = [
    ...findFilesImportingHeavyComponents(COMPONENTS_DIR),
    ...findFilesImportingHeavyComponents(PAGES_DIR)
  ];

  // Process each file
  filesToProcess.forEach(filePath => {
    convertToDynamicImports(filePath);
  });
  
  // Summary
  
  if (filesModified.length > 0) {
    filesModified.forEach(({ file, changes }) => {
    });
  }
  
}

// Run the script
main();