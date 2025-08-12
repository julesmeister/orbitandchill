/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAllCategories } from '@/db/services/categoryService';
import { 
  createDiscussion, 
  createReply,
  getAllSeedUserConfigs 
} from '@/db/services/seedUserService';
import { 
  generateRepliesForDiscussion,
  generateNestedReplies 
} from '@/db/services/replyGenerationService';

export interface SeedingResults {
  discussionsCreated: number;
  repliesCreated: number;
  votesCreated: number;
  errors: string[];
  discussionSlugs?: string[];
}

export interface DiscussionItemData {
  transformedTitle: string;
  transformedContent: string;
  summary?: string;
  assignedAuthor: string;
  assignedAuthorId: string;
  category: string;
  tags: string[];
  replies?: any[];
}

/**
 * Main function to execute database seeding operations
 * Handles category validation, discussion creation, and reply generation
 */
export async function executeDatabaseSeeding(
  transformedContent: any[], 
  seedConfigs: any[], 
  generationSettings: any,
  batchId: string
): Promise<SeedingResults> {
  const startTime = performance.now();
  
  const results: SeedingResults = {
    discussionsCreated: 0,
    repliesCreated: 0,
    votesCreated: 0,
    errors: [],
    discussionSlugs: []
  };
  
  const maxNestingDepth = generationSettings?.maxNestingDepth || 4;
  
  // Fetch and validate categories
  const validCategories = await fetchValidCategories();
  const mapToValidCategory = createOptimizedCategoryMapper(validCategories);
  
  // Create optimized user config lookup cache
  const userConfigCache = createUserConfigCache(seedConfigs);
  
  console.log(`🔍 Processing ${transformedContent.length} items for seeding`);
  logTransformedContentStructure(transformedContent);
  
  // Process each discussion item
  for (const item of transformedContent) {
    try {
      // Convert cache to array for compatibility
      const seedConfigsArray = Array.from({length: userConfigCache.size}, () => userConfigCache.getRandomUser());
      const discussionResult = await processSingleDiscussion(
        item,
        seedConfigsArray,
        mapToValidCategory,
        maxNestingDepth
      );
      
      results.discussionsCreated += discussionResult.discussionsCreated;
      results.repliesCreated += discussionResult.repliesCreated;
      results.votesCreated += discussionResult.votesCreated;
      results.errors.push(...discussionResult.errors);
      if (discussionResult.discussionSlugs) {
        results.discussionSlugs!.push(...discussionResult.discussionSlugs);
      }
      
    } catch (error) {
      results.errors.push(`Failed to create discussion "${item.transformedTitle}": ${(error as Error).message}`);
    }
  }
  
  // Add base votes for discussions
  results.votesCreated += results.discussionsCreated * 15; // Average 15 votes per discussion
  
  const endTime = performance.now();
  const processingTime = Math.round(endTime - startTime);
  
  console.log(`⚡ Seeding completed in ${processingTime}ms`);
  console.log(`📊 Performance: ${results.discussionsCreated} discussions, ${results.repliesCreated} replies`);
  console.log(`🚀 Throughput: ${Math.round((results.discussionsCreated + results.repliesCreated) / (processingTime / 1000))} items/sec`);
  
  return results;
}

/**
 * Fetch valid categories from database
 */
async function fetchValidCategories() {
  console.log('🔍 Fetching existing categories from database...');
  const categoriesResult = await getAllCategories();
  const validCategories = categoriesResult.success ? categoriesResult.data || [] : [];
  const validCategoryNames = validCategories.map((cat: any) => cat.name);
  
  console.log('✅ Valid categories from database:', validCategoryNames);
  return validCategories;
}

/**
 * Create category mapping function
 */
function createCategoryMapper(validCategories: any[]) {
  const validCategoryNames = validCategories.map((cat: any) => cat.name);
  
  return (aiCategory: string): string => {
    if (!aiCategory) return validCategoryNames[0] || 'General Discussion';
    
    // Direct match (case-insensitive)
    const directMatch = validCategories.find((cat: any) => 
      cat.name.toLowerCase() === aiCategory.toLowerCase()
    );
    if (directMatch) return directMatch.name;
    
    // Partial match for common variations
    const partialMatch = validCategories.find((cat: any) => {
      const aiCat = aiCategory.toLowerCase();
      const validCat = cat.name.toLowerCase();
      return aiCat.includes(validCat) || validCat.includes(aiCat);
    });
    if (partialMatch) return partialMatch.name;
    
    // Default fallback to first category or General Discussion
    return validCategoryNames[0] || 'General Discussion';
  };
}

/**
 * Process a single discussion item
 */
async function processSingleDiscussion(
  item: DiscussionItemData,
  seedConfigs: any[],
  mapToValidCategory: (category: string) => string,
  maxNestingDepth: number
): Promise<SeedingResults> {
  const results: SeedingResults = {
    discussionsCreated: 0,
    repliesCreated: 0,
    votesCreated: 0,
    errors: [],
    discussionSlugs: []
  };
  
  console.log(`🔍 Processing item: "${item.transformedTitle}"`);
  logItemStructure(item);
  
  // Prepare discussion data
  const authorConfig = seedConfigs.find(config => config.userId === item.assignedAuthorId);
  const authorAvatar = authorConfig?.preferredAvatar || authorConfig?.profilePictureUrl || '';
  const validCategory = mapToValidCategory(item.category);
  
  console.log(`🔍 Category mapping: "${item.category}" → "${validCategory}"`);
  
  const discussionData = {
    title: item.transformedTitle,
    content: item.transformedContent,
    excerpt: item.summary || item.transformedContent.substring(0, 200) + '...',
    authorName: item.assignedAuthor,
    authorId: item.assignedAuthorId,
    authorAvatar: authorAvatar,
    category: validCategory,
    tags: item.tags,
    upvotes: Math.floor(Math.random() * 50) + 10,
    downvotes: Math.floor(Math.random() * 5),
    views: Math.floor(Math.random() * 25) + 5 // 5-30 initial views
  };
  
  // Create discussion
  const discussionResult = await createDiscussion(discussionData);
  
  if (!discussionResult) {
    results.errors.push(`Failed to create discussion in database: ${item.transformedTitle}`);
    return results;
  }
  
  const { id: discussionId, slug } = discussionResult;
  results.discussionsCreated++;
  results.discussionSlugs!.push(slug);
  
  // Handle replies
  const repliesResult = await processDiscussionReplies(
    item,
    discussionId,
    seedConfigs,
    maxNestingDepth
  );
  
  results.repliesCreated += repliesResult.repliesCreated;
  results.votesCreated += repliesResult.votesCreated;
  results.errors.push(...repliesResult.errors);
  
  // Add votes for the main discussion
  results.votesCreated += discussionData.upvotes + discussionData.downvotes;
  
  // Update views based on engagement
  await updateDiscussionViews(discussionId, discussionData, item.replies?.length || 0);
  
  return results;
}

/**
 * Process replies for a discussion
 */
async function processDiscussionReplies(
  item: DiscussionItemData,
  discussionId: string,
  seedConfigs: any[],
  maxNestingDepth: number
): Promise<SeedingResults> {
  const results: SeedingResults = {
    discussionsCreated: 0,
    repliesCreated: 0,
    votesCreated: 0,
    errors: []
  };
  
  console.log(`🔍 Checking replies for "${item.transformedTitle}": ${item.replies ? item.replies.length : 'no replies property'}`);
  
  if (!item.replies) {
    console.log(`❌ No replies property found for "${item.transformedTitle}"`);
    return results;
  }
  
  if (item.replies.length === 0) {
    console.log(`📭 Replies array is empty for "${item.transformedTitle}"`);
    // Generate template-based replies for discussions without AI replies
    const repliesResult = await generateRepliesForDiscussion(
      discussionId,
      item,
      seedConfigs,
      maxNestingDepth,
      new Date()
    );
    
    results.repliesCreated += repliesResult.repliesCreated;
    results.votesCreated += repliesResult.votesCreated;
    return results;
  }
  
  console.log(`✅ Found ${item.replies.length} replies for "${item.transformedTitle}" - will create them in database`);
  console.log(`✅ Creating ${item.replies.length} replies in database`);
  
  // Optimized reply sorting with cached timestamp parsing
  const sortedReplies = [...item.replies]
    .map(reply => ({
      ...reply,
      _cachedTime: reply.createdAt ? new Date(reply.createdAt).getTime() : Date.now()
    }))
    .sort((a, b) => a._cachedTime - b._cachedTime);

  // Process replies with optimized user lookups
  for (const reply of sortedReplies) {
    try {
      const replyResult = await createSingleReply(reply, discussionId, seedConfigs);
      if (replyResult.success) {
        results.repliesCreated++;
        results.votesCreated += replyResult.votes;
      } else {
        results.errors.push(replyResult.error || 'Unknown reply creation error');
      }
    } catch (replyError) {
      results.errors.push(`Failed to create reply: ${(replyError as Error).message}`);
    }
  }
  
  return results;
}

/**
 * Create a single reply
 */
async function createSingleReply(
  reply: any,
  discussionId: string,
  seedConfigs: any[]
): Promise<{ success: boolean; votes: number; error?: string }> {
  // Use the scheduled timestamp from the preview
  const scheduledTime = reply.createdAt ? new Date(reply.createdAt) : new Date();
  
  // Look up avatar data for the reply author
  const replyAuthorConfig = seedConfigs.find(config => config.userId === reply.authorId);
  const replyAuthorAvatar = replyAuthorConfig?.preferredAvatar || replyAuthorConfig?.profilePictureUrl || '';
  
  const replyData = {
    discussionId,
    content: reply.content,
    authorName: reply.authorName,
    authorId: reply.authorId,
    authorAvatar: replyAuthorAvatar,
    upvotes: reply.upvotes || Math.floor(Math.random() * 20) + 1,
    downvotes: reply.downvotes || Math.floor(Math.random() * 3),
    parentReplyId: null, // AI replies are all top-level for now
    scheduledCreatedAt: Math.floor(scheduledTime.getTime() / 1000) // Unix timestamp
  };
  
  const replyId = await createReply(replyData);
  
  if (replyId) {
    return {
      success: true,
      votes: replyData.upvotes + replyData.downvotes
    };
  }
  
  return {
    success: false,
    votes: 0,
    error: 'Failed to create reply in database'
  };
}

/**
 * Update discussion views based on engagement
 */
async function updateDiscussionViews(
  discussionId: string,
  discussionData: any,
  replyCount: number
) {
  const totalVotes = discussionData.upvotes + discussionData.downvotes;
  
  // Calculate additional views based on engagement
  // Formula: base views + (replies * 3-8 views per reply) + (votes * 1-3 views per vote)
  const additionalViewsFromReplies = replyCount * (Math.floor(Math.random() * 6) + 3); // 3-8 views per reply
  const additionalViewsFromVotes = totalVotes * (Math.floor(Math.random() * 3) + 1); // 1-3 views per vote
  
  const finalViews = discussionData.views + additionalViewsFromReplies + additionalViewsFromVotes;
  
  // Update the discussion with realistic view count
  try {
    const db = await (await import('@/db/index')).getDbAsync();
    if (db) {
      await db.client.execute({
        sql: 'UPDATE discussions SET views = ? WHERE id = ?',
        args: [finalViews, discussionId]
      });
      console.log(`📊 Updated views for "${discussionData.title}": ${finalViews} (${replyCount} replies, ${totalVotes} votes)`);
    }
  } catch (viewError) {
    console.error('Failed to update discussion views:', viewError);
  }
}

/**
 * Create optimized user config cache for O(1) lookups
 */
function createUserConfigCache(seedConfigs: any[]) {
  const userConfigMap = new Map<string, any>();
  
  seedConfigs.forEach(config => {
    userConfigMap.set(config.userId, config);
  });
  
  return {
    get: (userId: string) => userConfigMap.get(userId),
    getRandomUser: () => seedConfigs[Math.floor(Math.random() * seedConfigs.length)],
    size: seedConfigs.length
  };
}

/**
 * Optimized category mapper using Map for O(1) lookups
 */
function createOptimizedCategoryMapper(validCategories: any[]) {
  // Create lookup maps for faster category matching
  const exactMatchMap = new Map<string, string>();
  const lowercaseMap = new Map<string, string>();
  
  validCategories.forEach(cat => {
    exactMatchMap.set(cat.name, cat.name);
    lowercaseMap.set(cat.name.toLowerCase(), cat.name);
  });
  
  const fallbackCategory = validCategories[0]?.name || 'General Discussion';
  
  return (aiCategory: string): string => {
    if (!aiCategory) return fallbackCategory;
    
    // O(1) exact match
    if (exactMatchMap.has(aiCategory)) {
      return exactMatchMap.get(aiCategory)!;
    }
    
    // O(1) case-insensitive match
    const lowercaseCategory = aiCategory.toLowerCase();
    if (lowercaseMap.has(lowercaseCategory)) {
      return lowercaseMap.get(lowercaseCategory)!;
    }
    
    // O(n) partial match fallback (only when necessary)
    for (const [key, value] of Array.from(lowercaseMap.entries())) {
      if (key.includes(lowercaseCategory) || lowercaseCategory.includes(key)) {
        return value;
      }
    }
    
    return fallbackCategory;
  };
}

/**
 * Log transformed content structure for debugging
 */
function logTransformedContentStructure(transformedContent: any[]) {
  console.log(`🔍 Full transformedContent structure:`, transformedContent.map(item => ({
    title: item.transformedTitle,
    hasReplies: !!item.replies,
    repliesCount: item.replies?.length || 0,
    itemKeys: Object.keys(item),
    repliesStructure: item.replies ? item.replies.slice(0, 1).map((r: any) => ({
      id: r.id,
      hasAuthorName: !!r.authorName,
      hasContent: !!r.content,
      keys: Object.keys(r)
    })) : []
  })));
}

/**
 * Log individual item structure for debugging
 */
function logItemStructure(item: DiscussionItemData) {
  console.log(`🔍 Item structure:`, {
    title: item.transformedTitle,
    hasReplies: !!item.replies,
    repliesCount: item.replies?.length || 0,
    itemKeys: Object.keys(item)
  });
  
  if (item.replies && item.replies.length > 0) {
    console.log(`🔍 Sample reply structure:`, {
      id: item.replies[0].id,
      authorName: item.replies[0].authorName,
      authorId: item.replies[0].authorId,
      hasContent: !!item.replies[0].content,
      contentLength: item.replies[0].content?.length || 0,
      hasCreatedAt: !!item.replies[0].createdAt,
      replyKeys: Object.keys(item.replies[0])
    });
  }
}