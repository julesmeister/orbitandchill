#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple script to fix specific orphaned console.log statements

const files = [
  'src/hooks/useGoogleAuth.ts',
  'src/store/eventsStore.ts', 
  'src/app/api/events/route.ts'
];

files.forEach(filePath => {
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix specific orphaned patterns from console.log removals
    
    // Pattern 1: useGoogleAuth.ts - orphaned object properties
    content = content.replace(
      /console\.log\([^)]*\);\s*\n\s*action: result\.action,\s*\n\s*userId: googleUser\.id,\s*\n\s*userType: 'google'\s*\n\s*\}\);/g,
      ''
    );
    
    // Pattern 2: Simple orphaned object properties 
    content = content.replace(
      /\s*action: result\.action,\s*\n\s*userId: googleUser\.id,\s*\n\s*userType: 'google'\s*\n\s*\}\);/g,
      ''
    );
    
    // Pattern 3: eventsStore.ts - orphaned debug object
    content = content.replace(
      /\s*hasUserId: !!\uniqueNewEvents\[0\]\?\.userId,\s*\n\s*hasTitle: !!\uniqueNewEvents\[0\]\?\.title,\s*\n\s*hasDate: !!\uniqueNewEvents\[0\]\?\.date,\s*\n\s*hasType: !!\uniqueNewEvents\[0\]\?\.type,\s*\n\s*hasDescription: !!\uniqueNewEvents\[0\]\?\.description,\s*\n\s*typeValue: uniqueNewEvents\[0\]\?\.type,\s*\n\s*dateValue: uniqueNewEvents\[0\]\?\.date,\s*\n\s*keys: Object\.keys\(uniqueNewEvents\[0\] \|\| \{\}\)\s*\n\s*\}\);/g,
      ''
    );
    
    // Pattern 4: events/route.ts - orphaned debug objects
    content = content.replace(
      /\s*userId,\s*\n\s*allParams: Object\.fromEntries\(searchParams\.entries\(\)\)\s*\n\s*\}\);/g,
      ''
    );
    
    content = content.replace(
      /\s*tab,\s*\n\s*isGenerated,\s*\n\s*isBookmarked,\s*\n\s*shouldUseAllBranch,\s*\n\s*originalCondition: \([^)]*\)\s*\n\s*\}\);/g,
      ''
    );
    
    content = content.replace(
      /\s*userId: body\.userId,\s*\n\s*title: body\.title,\s*\n\s*hasLocationData: !!\(body\.locationName \|\| body\.latitude \|\| body\.longitude\),\s*\n\s*locationData: \{[\s\S]*?\}\s*\n\s*\}\);/g,
      ''
    );
    
    content = content.replace(
      /\s*hasEvent: !!\w+,\s*\n\s*eventId: \w+\?\.id,\s*\n\s*eventTitle: \w+\?\.title,\s*\n\s*eventLocationName: \w+\?\.locationName\s*\n\s*\}\);/g,
      ''
    );
    
    fs.writeFileSync(filePath, content);
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}: ${error.message}`);
  }
});
