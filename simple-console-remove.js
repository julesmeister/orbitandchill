#!/usr/bin/env node

const fs = require('fs');

// Just remove the console.log lines entirely, line by line
function removeConsoleLogsSimple(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    // Only remove lines that ONLY contain console.log - don't touch lines with other code
    return !(/^\s*console\.log\s*\([^)]*\)\s*;?\s*$/.test(line));
  });
  
  const newContent = filteredLines.join('\n');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  return false;
}

// Apply to the problem files
const problemFiles = [
  'src/app/page.tsx',
  'src/hooks/useOptimalTimingHandler.ts',
  'src/app/events/page.tsx'
];

problemFiles.forEach(file => {
  if (fs.existsSync(file)) {
    removeConsoleLogsSimple(file);
  }
});
