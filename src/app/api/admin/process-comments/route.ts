/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedUserConfigs } from '@/db/services/seedUserService';
import { 
  extractRedditComments, 
  batchRephraseComments, 
  getRandomMood,
  getPersonalityForPersona 
} from '@/utils/commentProcessing';
import { HumanizationService } from '@/services/humanizationService';

// POST - Process Reddit comments and assign random personas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { comments, aiConfig, discussionContext } = body;
    
    if (!comments || !comments.trim()) {
      return NextResponse.json(
        { success: false, error: 'Comments text is required' },
        { status: 400 }
      );
    }
    
    if (!aiConfig || !aiConfig.provider || !aiConfig.apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI configuration with provider and API key is required' },
        { status: 400 }
      );
    }
    
    // Get available seed users for random assignment
    const allSeedConfigs = await getAllSeedUserConfigs();
    if (allSeedConfigs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No seed user configurations found. Please create seed users first.' },
        { status: 400 }
      );
    }
    
    // Clean Reddit content and extract actual comments
    const cleanedComments = extractRedditComments(comments);
    console.log(`Extracted ${cleanedComments.length} clean comments from Reddit content`);
    
    console.log(`Processing ${cleanedComments.length} comments for rephrasing`);
    
    if (cleanedComments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid comments found. Make sure comments are separated by line breaks and are substantial.' },
        { status: 400 }
      );
    }
    
    // Process comments with AI rephrasing and random persona assignment
    const processedReplies = [];
    
    // Limit to first 6 comments and process in batch to avoid AI response truncation
    const commentsToProcess = cleanedComments.slice(0, 6);
    console.log(`Processing ${commentsToProcess.length} comments in batch to avoid rate limits`);
    
    let partialResultsWarning = null;
    
    try {
      // Process all comments in a single AI request
      const batchResult = await batchRephraseComments(commentsToProcess, allSeedConfigs, aiConfig);
      const batchRephrasedComments = batchResult.comments;
      
      // Check if we have partial results due to truncation
      if (batchResult.hasPartialResults) {
        partialResultsWarning = {
          type: 'warning',
          message: `AI response was truncated. Successfully processed ${batchResult.extractedCount} out of ${batchResult.totalRequested} comments. The remaining comments are using original text.`
        };
        console.warn('⚠️ Partial results:', partialResultsWarning.message);
      }
      
      // Create reply objects for each rephrased comment
      for (let i = 0; i < batchRephrasedComments.length; i++) {
        const { originalComment, rephrasedComment, persona } = batchRephrasedComments[i];
        
        // Generate scheduled timing like the main seeding system
        const now = new Date();
        const minDelayHours = 1 + (i * 0.5); // Start 1 hour after, stagger by 30min each
        const maxDelayHours = 7 * 24; // Up to 7 days
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const scheduledTime = new Date(now.getTime() + (randomDelayHours * 60 * 60 * 1000));
        
        // Create reply object with proper seeding system fields
        const reply = {
          id: `reply_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 15)}`,
          content: rephrasedComment,
          authorName: persona.username,
          authorId: persona.userId,
          avatar: persona.profilePictureUrl || '/avatars/default.png',
          timestamp: scheduledTime.toISOString(),
          createdAt: now.toISOString(), // Current time when created
          scheduledDelay: Math.round(randomDelayHours * 60), // Convert to minutes
          upvotes: Math.floor(Math.random() * 20) + 1,
          downvotes: Math.floor(Math.random() * 5),
          reactionType: getRandomMood(),
          aiGenerated: true,
          writingStyle: persona.writingStyle,
          userExpertise: persona.expertiseAreas,
          originalComment: originalComment,
          isRephrased: true,
          isTemporary: true // Mark as temporary like main seeding system
        };
        
        processedReplies.push(reply);
      }
      
    } catch (error) {
      console.error('Batch processing failed, falling back to original comments:', error);
      
      // Fallback: Use original comments with random personas
      for (let i = 0; i < commentsToProcess.length; i++) {
        const originalComment = commentsToProcess[i];
        const randomPersona = allSeedConfigs[Math.floor(Math.random() * allSeedConfigs.length)];
        
        // Generate scheduled timing for fallback replies
        const now = new Date();
        const minDelayHours = 1 + (i * 0.5); // Start 1 hour after, stagger by 30min each
        const maxDelayHours = 7 * 24; // Up to 7 days
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const scheduledTime = new Date(now.getTime() + (randomDelayHours * 60 * 60 * 1000));

        // Apply humanization to fallback content too
        const humanizationIntensity = HumanizationService.getIntensityForStyle(randomPersona.writingStyle);
        const humanizedContent = HumanizationService.humanizeText(originalComment, humanizationIntensity);

        const fallbackReply = {
          id: `reply_${Date.now()}_${i}_fallback`,
          content: humanizedContent, // Use humanized content instead of original
          authorName: randomPersona.username,
          authorId: randomPersona.userId,
          avatar: randomPersona.profilePictureUrl || '/avatars/default.png',
          timestamp: scheduledTime.toISOString(),
          createdAt: now.toISOString(), // Current time when created
          scheduledDelay: Math.round(randomDelayHours * 60), // Convert to minutes
          upvotes: Math.floor(Math.random() * 15) + 1,
          downvotes: Math.floor(Math.random() * 3),
          reactionType: getRandomMood(),
          aiGenerated: true, // Mark as AI generated since we applied humanization
          writingStyle: randomPersona.writingStyle,
          userExpertise: randomPersona.expertiseAreas,
          originalComment: originalComment,
          isRephrased: true, // Mark as rephrased since we humanized it
          isTemporary: true // Mark as temporary like main seeding system
        };
        
        processedReplies.push(fallbackReply);
      }
    }
    
    const skippedComments = cleanedComments.length - commentsToProcess.length;
    const successMessage = skippedComments > 0 
      ? `Successfully processed ${processedReplies.length} comments (${skippedComments} skipped to avoid rate limits)`
      : `Successfully processed ${processedReplies.length} comments with random persona assignments`;

    // Generate a batch ID for compatibility with seeding workflow
    const batchId = `comments_batch_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    return NextResponse.json({
      success: true,
      data: processedReplies,
      message: successMessage,
      batchId: batchId, // Add batch ID for Generate Forum compatibility
      warning: partialResultsWarning, // Include warning about partial results if applicable
      summary: {
        totalComments: cleanedComments.length,
        processedReplies: processedReplies.length,
        skippedComments: skippedComments,
        rephrasedCount: processedReplies.filter(r => r.isRephrased).length,
        fallbackCount: processedReplies.filter(r => !r.isRephrased).length
      }
    });
    
  } catch (error) {
    console.error('Error processing comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process comments: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

