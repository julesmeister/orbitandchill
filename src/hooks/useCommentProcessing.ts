/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback } from 'react';

interface UseCommentProcessingProps {
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
  previewContent: any[];
  setPreviewContent: (content: any[] | ((prev: any[]) => any[])) => void;
  setSeedingResults: (results: any) => void;
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
}

export function useCommentProcessing({
  aiProvider,
  aiModel,
  aiApiKey,
  temperature,
  previewContent,
  setPreviewContent,
  setSeedingResults,
  showLoadingToast,
  showSuccessToast,
  showErrorToast
}: UseCommentProcessingProps) {
  
  const handleProcessComments = useCallback(async (commentsText: string) => {
    if (!aiApiKey.trim()) {
      showErrorToast('API Key Required', 'AI API key is required for comment processing.');
      setSeedingResults({
        success: false,
        error: 'AI API key is required for comment processing.'
      });
      return;
    }

    // Show loading toast
    showLoadingToast('Processing Comments', 'AI is rephrasing and organizing comments...');

    try {
      const response = await fetch('/api/admin/process-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: commentsText,
          aiConfig: {
            provider: aiProvider,
            model: aiModel,
            apiKey: aiApiKey,
            temperature: temperature
          },
          discussionContext: {
            title: 'Community Discussion',
            topic: 'astrology'
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Show warning toast if we have partial results
        if (result.warning) {
          showErrorToast('Partial Results', result.warning.message);
        }
        
        // Add comments as replies to existing preview content instead of creating separate discussion
        if (previewContent.length > 0) {
          // Add comments as replies to the first existing discussion
          setPreviewContent(prev => {
            const updated = [...prev];
            if (updated[0]) {
              updated[0] = {
                ...updated[0],
                replies: [...(updated[0].replies || []), ...result.data],
                actualReplyCount: (updated[0].actualReplyCount || 0) + result.data.length
              };
            }
            return updated;
          });
          
          const successMsg = result.warning 
            ? `Added ${result.data.length} comments (${result.summary.rephrasedCount} rephrased, ${result.summary.fallbackCount} original)`
            : `Added ${result.data.length} rephrased comments as replies to existing discussion!`;
          
          showSuccessToast('Comments Processed', successMsg);
          setSeedingResults({
            success: true,
            message: successMsg,
            summary: result.summary,
            processedComments: true,
            addedToExisting: true,
            hasPartialResults: !!result.warning
          });
          
          // Auto-scroll to preview section after comments are processed
          setTimeout(() => {
            const previewSection = document.getElementById('ai-processed-content');
            if (previewSection) {
              previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          // No existing content - create new discussion for comments only
          const mockDiscussion = {
            id: `discussion_${Date.now()}`,
            transformedTitle: 'Community Discussion from Comments',
            transformedContent: 'A discussion created from rephrased community comments',
            originalTitle: 'Community Discussion from Comments',
            originalContent: commentsText.substring(0, 200) + '...',
            assignedAuthor: 'Community',
            category: 'General Discussion',
            tags: ['community', 'discussion'],
            replies: result.data,
            actualReplyCount: result.data.length,
            estimatedEngagement: result.data.length * 2,
            isTemporary: true
          };

          setPreviewContent([mockDiscussion]);
          
          const successMsg = result.warning 
            ? `Created discussion with ${result.data.length} comments (${result.summary.rephrasedCount} rephrased, ${result.summary.fallbackCount} original)`
            : `Created new discussion with ${result.data.length} rephrased comments!`;
          
          showSuccessToast('Comments Processed', successMsg);
          setSeedingResults({
            success: true,
            message: successMsg,
            summary: result.summary,
            processedComments: true,
            createdNew: true,
            hasPartialResults: !!result.warning
          });
          
          // Auto-scroll to preview section after comments are processed
          setTimeout(() => {
            const previewSection = document.getElementById('ai-processed-content');
            if (previewSection) {
              previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      } else {
        showErrorToast('Comment Processing Failed', result.error || 'Unknown error occurred while processing comments');
        setSeedingResults({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      showErrorToast('Comment Processing Error', 'Failed to process comments: ' + (error as Error).message);
      setSeedingResults({
        success: false,
        error: 'Failed to process comments: ' + (error as Error).message
      });
    }
  }, [
    aiProvider,
    aiModel, 
    aiApiKey,
    temperature,
    previewContent,
    setPreviewContent,
    setSeedingResults,
    showLoadingToast,
    showSuccessToast,
    showErrorToast
  ]);

  return {
    handleProcessComments
  };
}