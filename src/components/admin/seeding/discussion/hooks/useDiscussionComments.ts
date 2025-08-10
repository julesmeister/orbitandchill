/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { stripHtmlTags } from '@/utils/textUtils';

interface Comment {
  content: string;
  authorId: string;
  authorName: string;
  parentReplyId?: string;
  upvotes?: number;
  downvotes?: number;
}

interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
}

interface ToastHandlers {
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
}

export function useDiscussionComments(
  aiConfig: AIConfig,
  toastHandlers: ToastHandlers,
  onCommentAdded?: () => void
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showLoadingToast, showSuccessToast, showErrorToast } = toastHandlers;

  // Helper function to add comments to discussion
  const addCommentsToDiscussion = async (discussionId: string, comments: Comment[]) => {
    const response = await fetch('/api/admin/add-discussion-replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discussionId: discussionId,
        replies: comments,
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to add comments');
    }
  };

  // Generate AI comments
  const generateAIComments = useCallback(async (
    discussion: any,
    count: number,
    timing: any
  ) => {
    if (!aiConfig.apiKey.trim()) {
      showErrorToast('API Key Required', 'AI API key is required for comment generation.');
      return;
    }

    if (!discussion) {
      showErrorToast('No Discussion Selected', 'Please select a discussion first.');
      return;
    }

    setIsGenerating(true);
    showLoadingToast('Generating Comments', `Creating ${count} AI-generated comments...`);

    try {
      const response = await fetch('/api/admin/process-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: `Generate ${count} engaging comments for this discussion: "${discussion.title}"\n\n${stripHtmlTags(discussion.content).substring(0, 500)}`,
          aiConfig: {
            provider: aiConfig.provider,
            model: aiConfig.model,
            apiKey: aiConfig.apiKey,
            temperature: aiConfig.temperature
          },
          discussionContext: {
            title: discussion.title,
            topic: discussion.category || 'astrology'
          },
          timingConfig: timing
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const comments: Comment[] = result.data.map((comment: any) => ({
          content: comment.content,
          authorId: comment.authorId,
          authorName: comment.authorName,
          parentReplyId: comment.parentReplyId,
          upvotes: comment.upvotes || 0,
          downvotes: comment.downvotes || 0,
        }));

        // Add comments to the discussion
        await addCommentsToDiscussion(discussion.id, comments);
        
        showSuccessToast('Comments Generated', `Successfully added ${comments.length} AI-generated comments to the discussion.`);
        
        // Trigger callback if provided
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        showErrorToast('Generation Failed', result.error || 'Failed to generate comments.');
      }
    } catch (error) {
      showErrorToast('Generation Error', 'Failed to generate comments: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }, [aiConfig, showLoadingToast, showSuccessToast, showErrorToast, onCommentAdded]);

  // Add a custom comment using AI processing and seed users like content generation tab
  const addCustomComment = useCallback(async (
    discussionId: string,
    comment: string
  ) => {
    if (!comment.trim()) {
      showErrorToast('Comment Required', 'Please enter a comment.');
      return;
    }

    if (!aiConfig.apiKey.trim()) {
      showErrorToast('API Key Required', 'AI API key is required for comment processing.');
      return;
    }

    setIsGenerating(true);
    showLoadingToast('Processing Comment', 'Processing your comment with AI and assigning to seed users...');

    try {
      // Use the same process-comments endpoint as content generation tab
      const response = await fetch('/api/admin/process-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: comment.trim(), // Single comment to process
          aiConfig: {
            provider: aiConfig.provider,
            model: aiConfig.model,
            apiKey: aiConfig.apiKey,
            temperature: aiConfig.temperature
          },
          discussionContext: {
            title: 'Custom Comment',
            topic: 'astrology'
          }
        }),
      });

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        // Convert the processed comments to the format expected by addCommentsToDiscussion
        const comments: Comment[] = result.data.map((comment: any) => ({
          content: comment.content,
          authorId: comment.authorId,
          authorName: comment.authorName,
          parentReplyId: comment.parentReplyId,
          upvotes: comment.upvotes || 0,
          downvotes: comment.downvotes || 0,
        }));

        // Add the processed comments to the discussion
        await addCommentsToDiscussion(discussionId, comments);
        
        showSuccessToast('Comment Added', `Successfully processed and added ${comments.length} comment(s) with AI and seed users.`);
        
        // Trigger callback if provided
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        showErrorToast('Processing Failed', result.error || 'Failed to process comment with AI.');
      }
    } catch (error) {
      showErrorToast('Add Comment Error', 'Failed to process comment: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }, [aiConfig, showLoadingToast, showSuccessToast, showErrorToast, onCommentAdded]);

  return {
    isGenerating,
    generateAIComments,
    addCustomComment
  };
}