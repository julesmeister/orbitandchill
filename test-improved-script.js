// Test the improved console.log removal on our test file

const fs = require('fs');

// Recreate the test file with orphaned console.log statements
const testContent = `// Test file for console.log removal

function testFunction() {
  
    name: 'John',
    age: 30,
    city: 'New York'
  });
  
    'Multi-line console log',
    { data: 'some data' },
    'more text'
  );
  
  // This should stay
  console.error('This is an error');
  console.warn('This is a warning');
  
  const data = { foo: 'bar' };
  
  // Complex nested console.log
  if (true) {
      complexObject: {
        nested: true,
        values: [1, 2, 3]
      },
      timestamp: Date.now()
    });
  }
  
  // This should also stay
  console.info('Info message');
  
  return 'done';
}`;

// Write the test file
fs.writeFileSync('test-orphaned.js', testContent);

// Now apply the improved removeConsoleLogs function
console.log('📋 Original file with orphans:');
console.log(testContent);

// Copy the improved function directly here for testing
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
    
    console.log(`Found ${linesToRemove.length} orphaned lines to remove:`, linesToRemove);
    
    // Remove orphaned lines in reverse order to maintain indices
    linesToRemove.reverse().forEach(lineIndex => {
      lines.splice(lineIndex, 1);
    });
    
    modifiedContent = lines.join('\n');
    
    // Clean up extra blank lines (more than 2 consecutive)
    modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Write the result
    fs.writeFileSync(filePath, modifiedContent);
    
    return removedCount + linesToRemove.length;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 0;
  }
}

// Test the function
console.log('\n🔧 Running improved console.log removal...');
const result = removeConsoleLogs('test-orphaned.js');
console.log(`Removed ${result} items`);

console.log('\n✨ Result after cleanup:');
const cleanedContent = fs.readFileSync('test-orphaned.js', 'utf8');
console.log(cleanedContent);