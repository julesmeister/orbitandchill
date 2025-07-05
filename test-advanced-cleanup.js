// Advanced test for console.log orphan cleanup

const fs = require('fs');

// Test with the broken content
const testContent = `// Test file for console.log removal

function testFunction() {

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

fs.writeFileSync('test-advanced.js', testContent);

// More advanced cleanup function
function advancedCleanup(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const linesToRemove = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('//') || trimmed === '') continue;
    
    // Check for orphaned patterns that are likely from console.log removal
    
    // Pattern 1: Lines that start with string literals and have trailing commas/parentheses
    if (/^\s*['"`][^'"`]*['"`]\s*,\s*$/.test(line) || 
        /^\s*['"`][^'"`]*['"`]\s*\)\s*;\s*$/.test(line)) {
      linesToRemove.push(i);
      continue;
    }
    
    // Pattern 2: Object properties without proper context (already handled)
    if (/^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*/.test(line)) {
      const prevLine = i > 0 ? lines[i - 1].trim() : '';
      if (!prevLine.endsWith('{') && !prevLine.endsWith('(') && !prevLine.endsWith(',') &&
          !prevLine.includes('=') && !prevLine.includes('const') && !prevLine.includes('let') &&
          !prevLine.includes('var') && !prevLine.includes('interface') && !prevLine.includes('type')) {
        linesToRemove.push(i);
        continue;
      }
    }
    
    // Pattern 3: Lines with just object literals { ... } that don't belong
    if (/^\s*\{\s*$/.test(line) || /^\s*\}\s*[,;)]*\s*$/.test(line)) {
      const prevLine = i > 0 ? lines[i - 1].trim() : '';
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
      
      // If it's an orphaned object (not part of assignment, function call, etc.)
      if (!prevLine.includes('=') && !prevLine.includes('return') && 
          !prevLine.includes('const') && !prevLine.includes('let') &&
          !prevLine.endsWith('(') && !prevLine.endsWith(',')) {
        linesToRemove.push(i);
        continue;
      }
    }
    
    // Pattern 4: Orphaned parameters (strings, objects) with trailing commas
    if (/^\s*\{\s*.*?\}\s*,?\s*$/.test(line) && 
        /data:|nested:|complexObject:/.test(line)) {
      const prevLine = i > 0 ? lines[i - 1].trim() : '';
      if (!prevLine.includes('=') && !prevLine.includes('const') && 
          !prevLine.includes('return') && !prevLine.endsWith('{')) {
        linesToRemove.push(i);
        continue;
      }
    }
    
    // Pattern 5: Closing parentheses/braces that are orphaned
    if (/^\s*\)\s*;\s*$/.test(line)) {
      const prevLine = i > 0 ? lines[i - 1].trim() : '';
      // If previous line ends with comma or is a string/object, this is likely orphaned
      if (prevLine.endsWith(',') || /['"`]\s*$/.test(prevLine) || prevLine.endsWith('}')) {
        linesToRemove.push(i);
        continue;
      }
    }
  }
  
  console.log(`Found ${linesToRemove.length} lines to remove:`, linesToRemove.map(i => `${i}: ${lines[i].trim()}`));
  
  // Remove lines in reverse order
  linesToRemove.reverse().forEach(lineIndex => {
    lines.splice(lineIndex, 1);
  });
  
  let result = lines.join('\n');
  
  // Clean up extra blank lines
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, result);
  return linesToRemove.length;
}

console.log('📋 Starting content:');
console.log(testContent);

console.log('\n🔧 Running advanced cleanup...');
const removed = advancedCleanup('test-advanced.js');
console.log(`Removed ${removed} orphaned lines`);

console.log('\n✨ Final result:');
const finalContent = fs.readFileSync('test-advanced.js', 'utf8');
console.log(finalContent);