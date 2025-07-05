#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixCriticalHeadingIssues() {
  const fixes = [];

  // Fix discussions page - missing h1
  try {
    const discussionsPath = './src/app/discussions/page.tsx';
    let content = fs.readFileSync(discussionsPath, 'utf8');
    
    if (!content.includes('<h1')) {
      // Add h1 as screen reader only at the top of the main content
      content = content.replace(
        /(<main[^>]*>[\s\S]*?<div[^>]*>)/,
        '$1\n        <h1 className="sr-only">Community Discussions and Forum</h1>'
      );
      
      fs.writeFileSync(discussionsPath, content, 'utf8');
      fixes.push('Added sr-only h1 to discussions page');
    }
  } catch (error) {
    console.error('Could not fix discussions page:', error.message);
  }

  // Fix chart page - multiple h1 tags
  try {
    const chartPath = './src/app/chart/page.tsx';
    let content = fs.readFileSync(chartPath, 'utf8');
    
    // Replace second h1 with h2
    let h1Count = 0;
    content = content.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/g, (match) => {
      h1Count++;
      if (h1Count > 1) {
        return match.replace('<h1', '<h2').replace('</h1>', '</h2>');
      }
      return match;
    });
    
    fs.writeFileSync(chartPath, content, 'utf8');
    fixes.push('Fixed multiple h1 tags in chart page');
  } catch (error) {
    console.error('Could not fix chart page:', error.message);
  }

  // Fix settings page - multiple h1 tags
  try {
    const settingsPath = './src/app/settings/page.tsx';
    let content = fs.readFileSync(settingsPath, 'utf8');
    
    // Replace second h1 with h2
    let h1Count = 0;
    content = content.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/g, (match) => {
      h1Count++;
      if (h1Count > 1) {
        return match.replace('<h1', '<h2').replace('</h1>', '</h2>');
      }
      return match;
    });
    
    fs.writeFileSync(settingsPath, content, 'utf8');
    fixes.push('Fixed multiple h1 tags in settings page');
  } catch (error) {
    console.error('Could not fix settings page:', error.message);
  }

  // Fix profile page - missing proper heading hierarchy  
  try {
    const profilePath = './src/app/profile/page.tsx';
    let content = fs.readFileSync(profilePath, 'utf8');
    
    // Change h3 subsections to h2 for proper hierarchy
    content = content.replace(
      /<h3 className="font-space-grotesk text-lg font-bold text-black mb-3">/g,
      '<h2 className="font-space-grotesk text-lg font-bold text-black mb-3">'
    );
    
    fs.writeFileSync(profilePath, content, 'utf8');
    fixes.push('Fixed heading hierarchy in profile page');
  } catch (error) {
    console.error('Could not fix profile page:', error.message);
  }

  // Fix username page - multiple h1 tags
  try {
    const usernamePath = './src/app/[username]/page.tsx';
    let content = fs.readFileSync(usernamePath, 'utf8');
    
    // Replace second and third h1 with h2
    let h1Count = 0;
    content = content.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/g, (match) => {
      h1Count++;
      if (h1Count > 1) {
        return match.replace('<h1', '<h2').replace('</h1>', '</h2>');
      }
      return match;
    });
    
    fs.writeFileSync(usernamePath, content, 'utf8');
    fixes.push('Fixed multiple h1 tags in username page');
  } catch (error) {
    console.error('Could not fix username page:', error.message);
  }

  // Fix FAQ page - heading hierarchy
  try {
    const faqPath = './src/app/faq/page.tsx';
    let content = fs.readFileSync(faqPath, 'utf8');
    
    // First h3 after h1 should be h2 for sections
    let foundFirstH3AfterH1 = false;
    content = content.replace(/(<h1[\s\S]*?<\/h1>[\s\S]*?)(<h3[^>]*>)/g, (match, beforeH3, h3Tag) => {
      if (!foundFirstH3AfterH1) {
        foundFirstH3AfterH1 = true;
        return beforeH3 + h3Tag.replace('<h3', '<h2');
      }
      return match;
    });
    
    fs.writeFileSync(faqPath, content, 'utf8');
    fixes.push('Fixed heading hierarchy in FAQ page');
  } catch (error) {
    console.error('Could not fix FAQ page:', error.message);
  }

  return fixes;
}

// Add semantic HTML improvements
function addSemanticStructure() {
  const fixes = [];

  // Add main landmarks and improve structure
  const filesToUpdate = [
    './src/app/discussions/page.tsx',
    './src/app/learning-center/page.tsx',
    './src/app/profile/page.tsx'
  ];

  filesToUpdate.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Ensure proper main tag usage
      if (!content.includes('<main')) {
        content = content.replace(
          /(<div className="[^"]*min-h-screen[^"]*"[^>]*>)/,
          '$1\n      <main role="main">'
        );
        content = content.replace(
          /(<\/div>\s*<\/div>\s*$)/,
          '      </main>\n$1'
        );
        fixes.push(`Added main landmark to ${path.basename(filePath)}`);
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
      console.error(`Could not add semantic structure to ${filePath}:`, error.message);
    }
  });

  return fixes;
}

const headingFixes = fixCriticalHeadingIssues();
const semanticFixes = addSemanticStructure();

[...headingFixes, ...semanticFixes].forEach(fix => {
});

