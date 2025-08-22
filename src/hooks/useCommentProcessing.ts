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
        // Show warning toast if we have partial results (use error toast for visibility)
        if (result.warning) {
          showErrorToast('⚠️ Partial Results', result.warning.message);
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
        // Enhanced error handling with specific rate limit messaging
        let errorTitle = 'Comment Processing Failed';
        let errorMessage = result.error || 'Unknown error occurred while processing comments';
        
        // Check for specific error types
        if (result.error && result.error.includes('402') && result.error.includes('Payment Required')) {
          errorTitle = '💳 Insufficient Credits';
          errorMessage = 'Your API credits have been exhausted. Please add funds to your OpenRouter account or switch to a different AI provider.';
        } else if (result.error && (result.error.includes('Insufficient USD') || result.error.includes('balance'))) {
          errorTitle = '💳 Account Balance Low';
          errorMessage = 'Insufficient balance to complete the request. Please add credits to your OpenRouter account.';
        } else if (result.error && result.error.includes('429') && result.error.includes('rate')) {
          errorTitle = '⏳ Rate Limit Reached';
          if (result.error.includes('temporarily rate-limited upstream')) {
            errorMessage = 'The AI model is temporarily overloaded. Please try again in a few minutes or select a different model.';
          } else {
            errorMessage = 'Rate limit reached. Please try again later or consider upgrading your API plan.';
          }
        } else if (result.error && (result.error.includes('401') || result.error.includes('Unauthorized') || result.error.includes('No auth credentials'))) {
          errorTitle = '🔑 Authentication Failed';
          errorMessage = 'API credentials are missing or invalid. Please check your API key configuration.';
        } else if (result.error && result.error.includes('API key')) {
          errorTitle = '🔑 API Key Issue';
          errorMessage = 'There was an issue with your API key. Please check your configuration.';
        } else if (result.error && result.error.includes('Provider returned error')) {
          errorTitle = '🤖 AI Provider Error';
          errorMessage = 'The AI service encountered an error. This may be temporary - try again in a few minutes.';
        }
        
        showErrorToast(errorTitle, errorMessage);
        setSeedingResults({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      // Enhanced catch block error handling
      let errorTitle = '🚨 Comment Processing Error';
      let errorMessage = 'Failed to process comments: ' + (error as Error).message;
      
      // Check for specific network errors
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorTitle = '🌐 Connection Error';
          errorMessage = 'Unable to connect to the AI service. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorTitle = '⏰ Request Timeout';
          errorMessage = 'The request took too long. The AI service may be busy - please try again.';
        }
      }
      
      showErrorToast(errorTitle, errorMessage);
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