#!/usr/bin/env node

/**
 * Script to clear mock discussions from the database
 * This will delete discussions that appear to be mock/test data
 */

const BASE_URL = 'http://localhost:3000';

// Common mock discussion patterns to identify and delete
const MOCK_PATTERNS = [
  'Mercury Retrograde Survival Guide',
  'Understanding Your Mars Placement',
  'Saturn Return',
  'Venus Transit',
  'Full Moon in',
  'New Moon in',
  'Jupiter',
  'Pluto',
  'Uranus',
  'Neptune',
  'Chart Reading Request',
  'Help with my chart',
  'What does this mean',
  'Compatibility question',
  'Synastry',
  'Transit forecast',
  'Moon phase',
  'Astrological analysis',
  'Birth chart interpretation',
  'Planetary alignment'
];

async function fetchDiscussions() {
  try {
    console.log('🔍 Fetching all discussions...');
    
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
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch discussions');
    }
    
    console.log(`✅ Found ${data.discussions.length} discussions`);
    return data.discussions;
    
  } catch (error) {
    console.error('❌ Error fetching discussions:', error.message);
    return [];
  }
}

function isMockDiscussion(discussion) {
  const title = discussion.title.toLowerCase();
  const content = (discussion.content || discussion.excerpt || '').toLowerCase();
  
  // Check if title or content matches any mock patterns
  return MOCK_PATTERNS.some(pattern => 
    title.includes(pattern.toLowerCase()) || 
    content.includes(pattern.toLowerCase())
  );
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

async function clearMockDiscussions() {
  console.log('🧹 Starting mock discussions cleanup...\n');
  
  // Fetch all discussions
  const discussions = await fetchDiscussions();
  
  if (discussions.length === 0) {
    console.log('ℹ️  No discussions found to process.');
    return;
  }
  
  // Identify mock discussions
  const mockDiscussions = discussions.filter(isMockDiscussion);
  const realDiscussions = discussions.filter(d => !isMockDiscussion(d));
  
  console.log(`\n📊 Analysis:`);
  console.log(`   Total discussions: ${discussions.length}`);
  console.log(`   Mock discussions found: ${mockDiscussions.length}`);
  console.log(`   Real discussions: ${realDiscussions.length}`);
  
  if (mockDiscussions.length === 0) {
    console.log('\n✨ No mock discussions found to delete!');
    return;
  }
  
  console.log(`\n🎯 Mock discussions to delete:`);
  mockDiscussions.forEach((discussion, index) => {
    console.log(`   ${index + 1}. "${discussion.title}" by ${discussion.author || 'Unknown'}`);
  });
  
  // Delete each mock discussion
  console.log(`\n🚀 Starting deletion process...\n`);
  
  let deletedCount = 0;
  let failedCount = 0;
  
  for (const discussion of mockDiscussions) {
    const success = await deleteDiscussion(discussion.id, discussion.title);
    if (success) {
      deletedCount++;
    } else {
      failedCount++;
    }
    
    // Add small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Successfully deleted: ${deletedCount} discussions`);
  console.log(`   ❌ Failed to delete: ${failedCount} discussions`);
  console.log(`   📝 Remaining discussions: ${realDiscussions.length + failedCount}`);
  
  if (deletedCount > 0) {
    console.log('\n🎉 Mock discussions cleanup completed!');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  clearMockDiscussions()
    .then(() => {
      console.log('\n✨ Script completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { clearMockDiscussions, fetchDiscussions, isMockDiscussion };