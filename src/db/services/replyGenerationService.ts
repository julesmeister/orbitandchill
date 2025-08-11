/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createReply } from '@/db/services/seedUserService';

export interface ReplyGenerationResult {
  repliesCreated: number;
  votesCreated: number;
}

/**
 * Generate template-based replies for a discussion that doesn't have AI-generated replies
 */
export async function generateRepliesForDiscussion(
  discussionId: string,
  discussionItem: any,
  seedConfigs: any[],
  maxNestingDepth: number,
  discussionCreatedAt: Date
): Promise<ReplyGenerationResult> {
  const results: ReplyGenerationResult = {
    repliesCreated: 0,
    votesCreated: 0
  };
  
  const targetReplies = discussionItem.estimatedReplies || 5;
  const replyTemplates = getReplyTemplates();
  
  // Generate first-level replies
  const firstLevelReplies = Math.ceil(targetReplies * 0.7); // 70% are top-level
  
  for (let i = 0; i < firstLevelReplies; i++) {
    const replyUser = seedConfigs[Math.floor(Math.random() * seedConfigs.length)];
    
    // Skip if user wouldn't reply based on probability
    if (Math.random() > replyUser.replyProbability) continue;
    
    const replyCreatedAt = getRandomDateAfter(discussionCreatedAt, 7); // Within 7 days of discussion
    
    const replyData = {
      discussionId,
      content: generateReplyContent(replyTemplates, replyUser.writingStyle),
      authorName: replyUser.username || 'Anonymous',
      authorId: replyUser.userId,
      authorAvatar: replyUser.preferredAvatar || replyUser.profilePictureUrl || '',
      parentReplyId: null,
      upvotes: Math.floor(Math.random() * 20) + 1,
      downvotes: Math.floor(Math.random() * 3)
    };
    
    const createdReplyId = await createReply(replyData);
    
    if (createdReplyId) {
      results.repliesCreated++;
      results.votesCreated += replyData.upvotes + replyData.downvotes;
      
      // Generate nested replies (with decreasing probability)
      if (maxNestingDepth > 1 && Math.random() < 0.4) {
        const nestedResults = await generateNestedReplies(
          discussionId,
          createdReplyId,
          seedConfigs,
          maxNestingDepth - 1,
          replyCreatedAt,
          Math.min(3, Math.floor(targetReplies * 0.2)) // Max 3 nested replies
        );
        
        results.repliesCreated += nestedResults.repliesCreated;
        results.votesCreated += nestedResults.votesCreated;
      }
    }
  }
  
  return results;
}

/**
 * Generate nested replies recursively
 */
export async function generateNestedReplies(
  discussionId: string,
  parentReplyId: string,
  seedConfigs: any[],
  maxDepth: number,
  parentCreatedAt: Date,
  targetCount: number
): Promise<ReplyGenerationResult> {
  const results: ReplyGenerationResult = {
    repliesCreated: 0,
    votesCreated: 0
  };
  
  if (maxDepth <= 0 || targetCount <= 0) return results;
  
  const nestedReplyTemplates = getNestedReplyTemplates();
  
  for (let i = 0; i < targetCount; i++) {
    const replyUser = seedConfigs[Math.floor(Math.random() * seedConfigs.length)];
    
    // Lower probability for nested replies
    if (Math.random() > replyUser.replyProbability * 0.6) continue;
    
    const replyCreatedAt = getRandomDateAfter(parentCreatedAt, 3); // Within 3 days of parent
    
    const replyData = {
      discussionId,
      content: generateReplyContent(nestedReplyTemplates, replyUser.writingStyle),
      authorName: replyUser.username || 'Anonymous',
      authorId: replyUser.userId,
      authorAvatar: replyUser.preferredAvatar || replyUser.profilePictureUrl || '',
      parentReplyId,
      upvotes: Math.floor(Math.random() * 10) + 1,
      downvotes: Math.floor(Math.random() * 2)
    };
    
    const createdReplyId = await createReply(replyData);
    
    if (createdReplyId) {
      results.repliesCreated++;
      results.votesCreated += replyData.upvotes + replyData.downvotes;
      
      // Recursively generate deeper nesting (with very low probability)
      if (maxDepth > 1 && Math.random() < 0.2) {
        const deeperResults = await generateNestedReplies(
          discussionId,
          createdReplyId,
          seedConfigs,
          maxDepth - 1,
          replyCreatedAt,
          1 // Only 1 deeper reply
        );
        
        results.repliesCreated += deeperResults.repliesCreated;
        results.votesCreated += deeperResults.votesCreated;
      }
    }
  }
  
  return results;
}

/**
 * Generate reply content based on templates and writing style
 */
export function generateReplyContent(templates: string[], writingStyle: string): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const variations = getStyleVariations();
  const selectedVariation = variations[writingStyle as keyof typeof variations] || variations.enthusiastic_personal;
  
  let content = template;
  Object.entries(selectedVariation).forEach(([key, value]) => {
    content = content.replace(`{${key}}`, value);
  });
  
  return content;
}

/**
 * Get reply templates for top-level replies
 */
function getReplyTemplates(): string[] {
  return [
    "This resonates with my experience. {insight}",
    "I've noticed similar patterns in my chart. {detail}",
    "Great question! {answer}",
    "From my perspective, {opinion}",
    "This is fascinating! {enthusiasm}",
    "I respectfully disagree. {counterpoint}",
    "Could you elaborate on {question}?",
    "Thank you for sharing this. {gratitude}"
  ];
}

/**
 * Get reply templates for nested replies
 */
function getNestedReplyTemplates(): string[] {
  return [
    "I agree with your point about {topic}.",
    "That's an interesting perspective. {thought}",
    "Can you share more about {detail}?",
    "This reminds me of {connection}.",
    "I had a different experience with {contrast}."
  ];
}

/**
 * Get style variations for different writing styles
 */
function getStyleVariations() {
  return {
    'professional_educational': {
      insight: 'This aligns with established astrological principles.',
      detail: 'The planetary positions confirm this interpretation.',
      answer: 'Based on traditional astrology, this indicates...',
      opinion: 'from a professional standpoint, this suggests...',
      enthusiasm: 'This is a textbook example of astrological synchronicity.',
      counterpoint: 'However, we should consider alternative interpretations.',
      question: 'the technical aspects',
      gratitude: 'This contributes valuable insight to our understanding.',
      topic: 'traditional interpretations',
      thought: 'In my practice, I have observed similar patterns.',
      connection: 'classical astrological texts',
      contrast: 'my professional methodology'
    },
    'enthusiastic_personal': {
      insight: 'OMG yes, this is exactly what happened to me!',
      detail: 'When I looked at my chart, I saw the same thing!',
      answer: 'I think it means you are about to have an amazing breakthrough!',
      opinion: 'I feel like this is such a powerful message from the universe!',
      enthusiasm: 'I literally got chills reading this!',
      counterpoint: 'I love this, but I wonder if there is another angle?',
      question: 'how this felt for you',
      gratitude: 'Thank you so much for sharing your story!',
      topic: 'the energy behind this',
      thought: 'Your energy really comes through in this!',
      connection: 'my own spiritual journey',
      contrast: 'my personal experience'
    },
    'analytical_questioning': {
      insight: 'The statistical correlation here is noteworthy.',
      detail: 'I have tracked similar patterns in my research.',
      answer: 'The evidence suggests a measurable influence.',
      opinion: 'from an empirical standpoint, this warrants investigation.',
      enthusiasm: 'This data point supports the hypothesis.',
      counterpoint: 'I question whether this correlation implies causation.',
      question: 'the methodology behind this conclusion',
      gratitude: 'This adds to our dataset for analysis.',
      topic: 'the statistical significance',
      thought: 'The data pattern is quite compelling.',
      connection: 'other research I have reviewed',
      contrast: 'the findings in my study'
    },
    'beginner_enthusiastic': {
      insight: 'Wow, I am just learning and this makes so much sense!',
      detail: 'I am still figuring out my chart, but this helps!',
      answer: 'I think (though I am new) this could mean growth?',
      opinion: 'as a beginner, this feels really important!',
      enthusiasm: 'This is why I love learning about astrology!',
      counterpoint: 'I am confused - could there be another explanation?',
      question: 'how to interpret this',
      gratitude: 'Thank you for helping us newbies understand!',
      topic: 'what you just explained',
      thought: 'I never thought of it that way before!',
      connection: 'what I have been learning',
      contrast: 'what my beginner book said'
    },
    'specialist_timing': {
      insight: 'The timing of this insight is particularly significant.',
      detail: 'Current planetary transits support this interpretation.',
      answer: 'Given the Mercury retrograde cycle, this timing is optimal.',
      opinion: 'considering the current astrological climate, this suggests...',
      enthusiasm: 'Perfect timing for this realization!',
      counterpoint: 'However, we should wait for the retrograde to end.',
      question: 'the timing implications',
      gratitude: 'Excellent timing for bringing this up.',
      topic: 'the current transits',
      thought: 'The planetary timing really supports this.',
      connection: 'the current astrological weather',
      contrast: 'what I have observed in past cycles'
    }
  };
}

/**
 * Generate a random date after a base date
 */
export function getRandomDateAfter(baseDate: Date, maxDaysAfter: number): Date {
  const msInDay = 24 * 60 * 60 * 1000;
  const randomMs = Math.floor(Math.random() * maxDaysAfter * msInDay);
  return new Date(baseDate.getTime() + randomMs);
}

/**
 * Generate a random past date
 */
export function getRandomPastDate(daysBack: number): Date {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const randomDays = Math.floor(Math.random() * daysBack);
  return new Date(now.getTime() - (randomDays * msInDay));
}