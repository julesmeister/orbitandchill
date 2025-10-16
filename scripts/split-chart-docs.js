/**
 * Script to split CHART_SHARING_DOCUMENTATION.md into modular files
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '..', 'CHART_SHARING_DOCUMENTATION.md');
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'chart');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Read source file
const content = fs.readFileSync(SOURCE_FILE, 'utf8');
const lines = content.split('\n');

// Section markers
const sections = {
  fixes: {
    start: 'Recent Critical Fixes',
    file: 'FIXES_HISTORY.md',
    end: '## Overview'
  },
  architecture: {
    start: '## Architecture Overview',
    file: 'ARCHITECTURE.md',
    patterns: ['## Core Components', '## Database Layer', '## Hooks and Utilities']
  },
  sharing: {
    start: '## Clean Sharing Architecture',
    file: 'SHARING.md',
    patterns: ['### Sharing Flow', '### Public Viewing Experience']
  },
  security: {
    start: '## Security & Privacy',
    file: 'SECURITY.md',
    patterns: ['### Access Control', '### Data Protection']
  },
  development: {
    start: '## Development Guidelines',
    file: 'DEVELOPMENT.md',
    patterns: ['### Adding New Sharing Features', '### Testing Considerations']
  },
  userFeatures: {
    start: '## User Profile & Stellium Persistence System',
    file: 'USER_FEATURES.md',
    patterns: ['## Avatar Display Consistency']
  }
};

// Extract sections
function extractSection(startMarker, endMarker, patterns = []) {
  let inSection = false;
  let sectionLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we're starting a section
    if (line.includes(startMarker)) {
      inSection = true;
    }

    // Collect lines while in section
    if (inSection) {
      sectionLines.push(line);

      // Check patterns for multi-section extraction
      if (patterns.length > 0) {
        for (const pattern of patterns) {
          if (line.includes(pattern)) {
            // Continue collecting
            break;
          }
        }
      }
    }

    // Check if we're ending a section
    if (endMarker && line.includes(endMarker) && inSection) {
      break;
    }
  }

  return sectionLines.join('\n');
}

// Create FIXES_HISTORY.md (all rounds)
console.log('Creating FIXES_HISTORY.md...');
const fixesContent = [];
fixesContent.push('# Chart System Fixes History\n');
fixesContent.push('> **📚 [Back to Main Documentation](../../CHART.md)**\n');
fixesContent.push('## Overview\n');
fixesContent.push('This document contains a chronological record of all critical fixes and improvements to the chart system, organized by implementation rounds.\n');

// Extract all fix rounds
let fixRound = 33;
while (fixRound >= 23) {
  const roundMarker = `## Recent Critical Fixes (Round ${fixRound}`;
  const nextRoundMarker = `## Recent Critical Fixes (Round ${fixRound - 1}`;

  let roundContent = [];
  let inRound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(roundMarker)) {
      inRound = true;
    }

    if (inRound) {
      roundContent.push(line);

      // Stop at next round or major section
      if ((line.includes(nextRoundMarker) ||
           (line.startsWith('## ') && !line.includes('Recent Critical Fixes'))) &&
          roundContent.length > 10) {
        break;
      }
    }
  }

  if (roundContent.length > 0) {
    fixesContent.push(roundContent.join('\n'));
    fixesContent.push('\n---\n');
  }

  fixRound--;
}

fs.writeFileSync(path.join(DOCS_DIR, 'FIXES_HISTORY.md'), fixesContent.join('\n'));
console.log('✅ FIXES_HISTORY.md created');

console.log('\n✨ Documentation split complete!');
console.log(`📁 Files created in: ${DOCS_DIR}`);
