/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface ReplyGenerationState {
  generatingReplyForIndex: number | null;
  expandedReplies: Record<number, boolean>;
}

interface UseReplyGenerationReturn {
  // State
  generatingReplyForIndex: number | null;
  expandedReplies: Record<number, boolean>;
  
  // Actions
  handleAddReply: (discussionIndex: number, previewContent: any[], aiConfig: any, updatePreviewContent: (updater: (prev: any[]) => any[]) => void, onResult: (result: any) => void) => Promise<void>;
  handleDeleteReplyById: (discussionIndex: number, replyId: string, previewContent: any[], updatePreviewContent: (updater: (prev: any[]) => any[]) => void, onResult: (result: any) => void) => void;
  toggleExpandedReplies: (index: number) => void;
  setGeneratingReplyForIndex: (index: number | null) => void;
  setExpandedReplies: (replies: Record<number, boolean>) => void;
}

export const useReplyGeneration = (): UseReplyGenerationReturn => {
  const [generatingReplyForIndex, setGeneratingReplyForIndex] = useState<number | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  // Simple similarity calculation function
  const calculateSimilarity = useCallback((text1: string, text2: string): number => {
    if (!text1 || !text2) return 0;
    
    // Convert to lowercase and split into words
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    // Find common words
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }, []);

  const handleAddReply = useCallback(async (
    discussionIndex: number, 
    previewContent: any[], 
    aiConfig: any, 
    updatePreviewContent: (updater: (prev: any[]) => any[]) => void,
    onResult: (result: any) => void
  ) => {
    if (!aiConfig.apiKey?.trim()) {
      onResult({
        success: false,
        error: 'AI API key is required for generating replies.'
      });
      return;
    }

    setGeneratingReplyForIndex(discussionIndex);

    try {
      const discussionData = previewContent[discussionIndex];
      const currentReplyCount = discussionData.replies ? discussionData.replies.length : 0;

      const response = await fetch('/api/admin/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discussionData,
          aiConfig: {
            provider: aiConfig.provider,
            model: aiConfig.model,
            apiKey: aiConfig.apiKey,
            temperature: aiConfig.temperature
          },
          replyIndex: currentReplyCount
        }),
      });

      const result = await response.json();

      if (result.success) {
        const existingReplies = discussionData.replies || [];
        
        // Check for duplicate users (same user can't reply twice)
        const isDuplicateUser = existingReplies.some(reply => 
          reply.authorName === result.data.authorName
        );
        
        // Check for similar content (prevent very similar replies)
        const isDuplicateContent = existingReplies.some(reply => {
          const similarity = calculateSimilarity(reply.content || '', result.data.content || '');
          return similarity > 0.7; // 70% similarity threshold
        });
        
        if (isDuplicateUser) {
          onResult({
            success: false,
            error: `${result.data.authorName} has already replied to this discussion. Try generating again for a different user.`,
            lastAction: 'duplicate_user_prevented'
          });
          return;
        }
        
        if (isDuplicateContent) {
          onResult({
            success: false,
            error: `Very similar reply already exists. Try generating again for more variety.`,
            lastAction: 'duplicate_content_prevented'
          });
          return;
        }

        // Generate random timestamp between 1 hour and 7 days after discussion creation
        const discussionCreatedAt = new Date();
        const minDelayHours = 1;
        const maxDelayHours = 7 * 24; // 7 days
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const replyCreatedAt = new Date(discussionCreatedAt.getTime() + (randomDelayHours * 60 * 60 * 1000));

        // Add random timing to the reply data
        const replyWithTiming = {
          ...result.data,
          createdAt: replyCreatedAt.toISOString(),
          scheduledDelay: Math.round(randomDelayHours * 60), // minutes for display
          isTemporary: true // Mark as temporary until final generation
        };

        // Update the preview content with the new reply
        updatePreviewContent(prev => prev.map((item, index) => {
          if (index === discussionIndex) {
            const updatedItem = { ...item };
            if (!updatedItem.replies) {
              updatedItem.replies = [];
            }
            updatedItem.replies.push(replyWithTiming);
            updatedItem.actualReplyCount = updatedItem.replies.length;
            return updatedItem;
          }
          return item;
        }));

        onResult({
          success: true,
          message: `Successfully added reply by ${result.data.authorName} (scheduled ${Math.round(randomDelayHours)} hours after discussion)`,
          lastAction: 'reply_added'
        });
      } else {
        // Handle specific error cases
        let errorMessage = result.error || 'Failed to generate reply';
        
        if (errorMessage.includes('All available users have already replied')) {
          errorMessage = 'All 5 seed users have already replied! Delete some replies above to add more, or proceed to "Generate Forum" to save this discussion.';
        }
        
        onResult({
          success: false,
          error: errorMessage
        });
      }
    } catch (error) {
      onResult({
        success: false,
        error: 'Failed to generate reply: ' + (error as Error).message
      });
    } finally {
      setGeneratingReplyForIndex(null);
    }
  }, [calculateSimilarity]);

  const handleDeleteReplyById = useCallback((
    discussionIndex: number, 
    replyId: string, 
    previewContent: any[], 
    updatePreviewContent: (updater: (prev: any[]) => any[]) => void,
    onResult: (result: any) => void
  ) => {
    updatePreviewContent(prev => prev.map((item, index) => {
      if (index === discussionIndex) {
        const updatedItem = { ...item };
        if (updatedItem.replies) {
          // Filter out the reply with the specific ID
          const newReplies = updatedItem.replies.filter(reply => reply.id !== replyId);
          updatedItem.replies = newReplies;
          updatedItem.actualReplyCount = newReplies.length;
        }
        return updatedItem;
      }
      return item;
    }));

    onResult({
      success: true,
      message: 'Reply removed from preview',
      lastAction: 'reply_deleted'
    });
  }, []);

  const toggleExpandedReplies = useCallback((index: number) => {
    setExpandedReplies(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);

  return {
    // State
    generatingReplyForIndex,
    expandedReplies,
    
    // Actions
    handleAddReply,
    handleDeleteReplyById,
    toggleExpandedReplies,
    setGeneratingReplyForIndex,
    setExpandedReplies
  };
};