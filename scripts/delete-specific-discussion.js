#!/usr/bin/env node

/**
 * Script to delete a specific discussion by title or ID
 * Usage: node delete-specific-discussion.js "Mercury Retrograde Survival Guide 2024"
 */

const BASE_URL = 'http://localhost:3000';

async function fetchDiscussions() {
  try {
    const response = await fetch(`${BASE_URL}/api/discussions?limit=100`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success ? data.discussions : [];
  } catch (error) {
    console.error('❌ Error fetching discussions:', error.message);
    return [];
  }
}

async function deleteDiscussion(discussionId, title) {
  try {
    console.log(`🗑️  Deleting: "${title}" (ID: ${discussionId})`);
    
    const response = await fetch(`${BASE_URL}/api/discussions/${discussionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Successfully deleted: "${title}"`);
      return true;
    } else {
      console.error(`❌ Failed to delete "${title}": ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting "${title}":`, error.message);
    return false;
  }
}

async function deleteSpecificDiscussion(searchTerm) {
  console.log(`🔍 Searching for discussions matching: "${searchTerm}"`);
  
  const discussions = await fetchDiscussions();
  
  if (discussions.length === 0) {
    console.log('❌ No discussions found in database');
    return;
  }
  
  // Find discussions that match the search term
  const matches = discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.id === searchTerm
  );
  
  if (matches.length === 0) {
    console.log(`❌ No discussions found matching: "${searchTerm}"`);
    console.log(`\nAvailable discussions:`);
    discussions.forEach((d, i) => {
      console.log(`   ${i + 1}. "${d.title}" (ID: ${d.id})`);
    });
    return;
  }
  
  console.log(`\n📋 Found ${matches.length} matching discussion(s):`);
  matches.forEach((discussion, index) => {
    console.log(`   ${index + 1}. "${discussion.title}" by ${discussion.author || 'Unknown'} (ID: ${discussion.id})`);
  });
  
  // Delete each matching discussion
  console.log(`\n🚀 Deleting ${matches.length} discussion(s)...\n`);
  
  let deletedCount = 0;
  
  for (const discussion of matches) {
    const success = await deleteDiscussion(discussion.id, discussion.title);
    if (success) {
      deletedCount++;
    }
    
    // Small delay between deletions
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n📈 Summary: Successfully deleted ${deletedCount}/${matches.length} discussions`);
}

// Handle command line arguments
const searchTerm = process.argv[2];

if (!searchTerm) {
  console.log('Usage: node delete-specific-discussion.js "Discussion Title"');
  console.log('Example: node delete-specific-discussion.js "Mercury Retrograde Survival Guide"');
  process.exit(1);
}

// Run the script
deleteSpecificDiscussion(searchTerm)
  .then(() => {
    console.log('\n✨ Script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });