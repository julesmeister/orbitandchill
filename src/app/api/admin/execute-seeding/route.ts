import { NextRequest, NextResponse } from 'next/server';
import { 
  getSeedingBatch, 
  updateSeedingBatch, 
  createDiscussion, 
  createReply, 
  createVote,
  getAllSeedUserConfigs 
} from '@/db/services/seedUserService';

// POST - Execute seeding by creating discussions and replies in the database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, transformedContent, generationSettings } = body;
    
    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }
    
    if (!transformedContent || !Array.isArray(transformedContent)) {
      return NextResponse.json(
        { success: false, error: 'Transformed content array is required' },
        { status: 400 }
      );
    }
    
    // Verify the seeding batch exists
    const batch = await getSeedingBatch(batchId);
    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Seeding batch not found' },
        { status: 404 }
      );
    }
    
    if (batch.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Batch must be completed before executing seeding' },
        { status: 400 }
      );
    }
    
    // Get seed user configurations for reply generation
    const seedConfigs = await getAllSeedUserConfigs();
    if (seedConfigs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No seed user configurations found' },
        { status: 400 }
      );
    }
    
    // Update batch status to processing seeding
    await updateSeedingBatch(batchId, { status: 'processing' });
    
    try {
      // Create discussions and replies in the actual database
      const results = await executeDatabaseSeeding(
        transformedContent, 
        seedConfigs, 
        generationSettings,
        batchId
      );
      
      // Update batch with final statistics
      await updateSeedingBatch(batchId, {
        status: 'completed',
        discussionsCreated: results.discussionsCreated,
        repliesCreated: results.repliesCreated,
        votesCreated: results.votesCreated
      });
      
      return NextResponse.json({
        success: true,
        batchId,
        results,
        message: `Successfully seeded ${results.discussionsCreated} discussions with ${results.repliesCreated} replies`
      });
    } catch (seedingError) {
      // Update batch status to failed
      await updateSeedingBatch(batchId, {
        status: 'failed',
        errors: [...(batch.errors || []), (seedingError as Error).message]
      });
      throw seedingError;
    }
  } catch (error) {
    console.error('Error executing seeding:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute seeding: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Execute actual database seeding operations
async function executeDatabaseSeeding(
  transformedContent: any[], 
  seedConfigs: any[], 
  generationSettings: any,
  batchId: string
) {
  const results = {
    discussionsCreated: 0,
    repliesCreated: 0,
    votesCreated: 0,
    errors: [] as string[]
  };
  
  const maxNestingDepth = generationSettings?.maxNestingDepth || 4;
  const temporalSpreadDays = 30; // Spread content across 30 days
  
  for (const item of transformedContent) {
    try {
      // Create the main discussion in the database
      const discussionData = {
        title: item.transformedTitle,
        content: item.transformedContent,
        excerpt: item.summary || item.transformedContent.substring(0, 200) + '...',
        authorName: item.assignedAuthor,
        authorId: item.assignedAuthorId,
        category: item.category,
        tags: item.tags,
        upvotes: Math.floor(Math.random() * 50) + 10,
        downvotes: Math.floor(Math.random() * 5)
      };
      
      const discussionId = await createDiscussion(discussionData);
      
      if (!discussionId) {
        results.errors.push(`Failed to create discussion in database: ${item.transformedTitle}`);
        continue;
      }
      
      results.discussionsCreated++;
      
      // If AI generated replies, create them in the database with staggered timing
      if (item.replies && item.replies.length > 0) {
        // Sort replies by their scheduled time to maintain chronological order
        const sortedReplies = [...item.replies].sort((a, b) => {
          const timeA = new Date(a.createdAt || new Date()).getTime();
          const timeB = new Date(b.createdAt || new Date()).getTime();
          return timeA - timeB;
        });

        for (const reply of sortedReplies) {
          try {
            // Use the scheduled timestamp from the preview
            const scheduledTime = reply.createdAt ? new Date(reply.createdAt) : new Date();
            
            const replyData = {
              discussionId,
              content: reply.content,
              authorName: reply.authorName,
              authorId: reply.authorId,
              upvotes: reply.upvotes || Math.floor(Math.random() * 20) + 1,
              downvotes: reply.downvotes || Math.floor(Math.random() * 3),
              parentReplyId: null, // AI replies are all top-level for now
              scheduledCreatedAt: Math.floor(scheduledTime.getTime() / 1000) // Unix timestamp
            };
            
            const replyId = await createReply(replyData);
            
            if (replyId) {
              results.repliesCreated++;
              results.votesCreated += replyData.upvotes + replyData.downvotes;
            }
          } catch (replyError) {
            results.errors.push(`Failed to create reply: ${(replyError as Error).message}`);
          }
        }
      } else {
        // If no AI replies, generate some using templates
        const repliesResult = await generateRepliesForDiscussion(
          discussionId,
          item,
          seedConfigs,
          maxNestingDepth,
          new Date()
        );
        
        results.repliesCreated += repliesResult.repliesCreated;
        results.votesCreated += repliesResult.votesCreated;
      }
      
      // Add votes for the main discussion
      results.votesCreated += discussionData.upvotes + discussionData.downvotes;
      
    } catch (error) {
      results.errors.push(`Failed to create discussion "${item.transformedTitle}": ${(error as Error).message}`);
    }
  }
  
  // Add base votes for discussions
  results.votesCreated += results.discussionsCreated * 15; // Average 15 votes per discussion
  
  return results;
}

async function generateRepliesForDiscussion(
  discussionId: string,
  discussionItem: any,
  seedConfigs: any[],
  maxNestingDepth: number,
  discussionCreatedAt: Date
) {
  const results = {
    repliesCreated: 0,
    votesCreated: 0
  };
  
  const targetReplies = discussionItem.estimatedReplies || 5;
  const replyTemplates = [
    "This resonates with my experience. {insight}",
    "I've noticed similar patterns in my chart. {detail}",
    "Great question! {answer}",
    "From my perspective, {opinion}",
    "This is fascinating! {enthusiasm}",
    "I respectfully disagree. {counterpoint}",
    "Could you elaborate on {question}?",
    "Thank you for sharing this. {gratitude}"
  ];
  
  // Generate first-level replies
  const firstLevelReplies = Math.ceil(targetReplies * 0.7); // 70% are top-level
  
  for (let i = 0; i < firstLevelReplies; i++) {
    const replyUser = seedConfigs[Math.floor(Math.random() * seedConfigs.length)];
    
    // Skip if user wouldn't reply based on probability
    if (Math.random() > replyUser.replyProbability) continue;
    
    const replyId = `reply_${discussionId}_${i + 1}`;
    const replyCreatedAt = getRandomDateAfter(discussionCreatedAt, 7); // Within 7 days of discussion
    
    const replyData = {
      discussionId,
      content: generateReplyContent(replyTemplates, replyUser.writingStyle),
      authorName: replyUser.username || 'Anonymous',
      authorId: replyUser.userId,
      parentReplyId: null,
      upvotes: Math.floor(Math.random() * 20) + 1,
      downvotes: Math.floor(Math.random() * 3)
    };
    
    const createdReplyId = await createReply(replyData);
    
    if (createdReplyId) {
      results.repliesCreated++;
      results.votesCreated += replyData.upvotes + replyData.downvotes;
      
      // Store the reply ID for potential nested replies
      replyId = createdReplyId;
    } else {
      continue; // Skip nested replies if parent failed
    }
    
    // Generate nested replies (with decreasing probability)
    if (maxNestingDepth > 1 && Math.random() < 0.4) {
      const nestedResults = await generateNestedReplies(
        discussionId,
        replyId,
        seedConfigs,
        maxNestingDepth - 1,
        replyCreatedAt,
        Math.min(3, Math.floor(targetReplies * 0.2)) // Max 3 nested replies
      );
      
      results.repliesCreated += nestedResults.repliesCreated;
      results.votesCreated += nestedResults.votesCreated;
    }
  }
  
  return results;
}

async function generateNestedReplies(
  discussionId: string,
  parentReplyId: string,
  seedConfigs: any[],
  maxDepth: number,
  parentCreatedAt: Date,
  targetCount: number
) {
  const results = {
    repliesCreated: 0,
    votesCreated: 0
  };
  
  if (maxDepth <= 0 || targetCount <= 0) return results;
  
  const nestedReplyTemplates = [
    "I agree with your point about {topic}.",
    "That's an interesting perspective. {thought}",
    "Can you share more about {detail}?",
    "This reminds me of {connection}.",
    "I had a different experience with {contrast}."
  ];
  
  for (let i = 0; i < targetCount; i++) {
    const replyUser = seedConfigs[Math.floor(Math.random() * seedConfigs.length)];
    
    // Lower probability for nested replies
    if (Math.random() > replyUser.replyProbability * 0.6) continue;
    
    const replyId = `reply_${discussionId}_nested_${parentReplyId}_${i + 1}`;
    const replyCreatedAt = getRandomDateAfter(parentCreatedAt, 3); // Within 3 days of parent
    
    const replyData = {
      discussionId,
      content: generateReplyContent(nestedReplyTemplates, replyUser.writingStyle),
      authorName: replyUser.username || 'Anonymous',
      authorId: replyUser.userId,
      parentReplyId,
      upvotes: Math.floor(Math.random() * 10) + 1,
      downvotes: Math.floor(Math.random() * 2)
    };
    
    const createdReplyId = await createReply(replyData);
    
    if (createdReplyId) {
      results.repliesCreated++;
      results.votesCreated += replyData.upvotes + replyData.downvotes;
      
      // Store the reply ID for potential deeper nesting
      replyId = createdReplyId;
    } else {
      continue; // Skip deeper nesting if this reply failed
    }
    
    // Recursively generate deeper nesting (with very low probability)
    if (maxDepth > 1 && Math.random() < 0.2) {
      const deeperResults = await generateNestedReplies(
        discussionId,
        replyId,
        seedConfigs,
        maxDepth - 1,
        replyCreatedAt,
        1 // Only 1 deeper reply
      );
      
      results.repliesCreated += deeperResults.repliesCreated;
      results.votesCreated += deeperResults.votesCreated;
    }
  }
  
  return results;
}

function generateReplyContent(templates: string[], writingStyle: string): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const styleVariations = {
    'professional_educational': {
      insight: 'This aligns with established astrological principles.',
      detail: 'The planetary positions confirm this interpretation.',
      answer: 'Based on traditional astrology, this indicates...',
      opinion: 'from a professional standpoint, this suggests...',
      enthusiasm: 'This is a textbook example of astrological synchronicity.',
      counterpoint: 'However, we should consider alternative interpretations.',
      question: 'the technical aspects',
      gratitude: 'This contributes valuable insight to our understanding.'
    },
    'enthusiastic_personal': {
      insight: 'OMG yes, this is exactly what happened to me!',
      detail: 'When I looked at my chart, I saw the same thing!',
      answer: 'I think it means you\'re about to have an amazing breakthrough!',
      opinion: 'I feel like this is such a powerful message from the universe!',
      enthusiasm: 'I literally got chills reading this!',
      counterpoint: 'I love this, but I wonder if there\'s another angle?',
      question: 'how this felt for you',
      gratitude: 'Thank you so much for sharing your story!'
    },
    'analytical_questioning': {
      insight: 'The statistical correlation here is noteworthy.',
      detail: 'I\'ve tracked similar patterns in my research.',
      answer: 'The evidence suggests a measurable influence.',
      opinion: 'from an empirical standpoint, this warrants investigation.',
      enthusiasm: 'This data point supports the hypothesis.',
      counterpoint: 'I question whether this correlation implies causation.',
      question: 'the methodology behind this conclusion',
      gratitude: 'This adds to our dataset for analysis.'
    },
    'beginner_enthusiastic': {
      insight: 'Wow, I\'m just learning and this makes so much sense!',
      detail: 'I\'m still figuring out my chart, but this helps!',
      answer: 'I think (though I\'m new) this could mean growth?',
      opinion: 'as a beginner, this feels really important!',
      enthusiasm: 'This is why I love learning about astrology!',
      counterpoint: 'I\'m confused - could there be another explanation?',
      question: 'how to interpret this',
      gratitude: 'Thank you for helping us newbies understand!'
    },
    'specialist_timing': {
      insight: 'The timing of this insight is particularly significant.',
      detail: 'Current planetary transits support this interpretation.',
      answer: 'Given the Mercury retrograde cycle, this timing is optimal.',
      opinion: 'considering the current astrological climate, this suggests...',
      enthusiasm: 'Perfect timing for this realization!',
      counterpoint: 'However, we should wait for the retrograde to end.',
      question: 'the timing implications',
      gratitude: 'Excellent timing for bringing this up.'
    }
  };
  
  const variations = styleVariations[writingStyle as keyof typeof styleVariations] || styleVariations.enthusiastic_personal;
  
  let content = template;
  Object.entries(variations).forEach(([key, value]) => {
    content = content.replace(`{${key}}`, value);
  });
  
  return content;
}

function getRandomPastDate(daysBack: number): Date {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const randomDays = Math.floor(Math.random() * daysBack);
  return new Date(now.getTime() - (randomDays * msInDay));
}

function getRandomDateAfter(baseDate: Date, maxDaysAfter: number): Date {
  const msInDay = 24 * 60 * 60 * 1000;
  const randomMs = Math.floor(Math.random() * maxDaysAfter * msInDay);
  return new Date(baseDate.getTime() + randomMs);
}