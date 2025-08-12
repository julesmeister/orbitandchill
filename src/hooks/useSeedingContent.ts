/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSeedingOperations } from './useSeedingOperations';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { useToastNotifications } from '@/hooks/useToastNotifications';

interface GenerationSettings {
  discussionsToGenerate: number;
  repliesPerDiscussion: { min: number; max: number };
  maxNestingDepth: number;
  contentVariation: number;
}

export const useSeedingContent = () => {
  const {
    handleProcessPastedContent,
    handleProcessWithAI,
    handleExecuteSeeding,
    initializeSeedUsers,
    checkSeedUsersStatus,
  } = useSeedingOperations();

  const { getAiConfig } = useAIConfiguration();
  const { 
    showLoadingToast, 
    showSuccessToast, 
    showErrorToast,
    toastVisible,
    toastTitle,
    toastMessage,
    toastStatus,
    hideToast
  } = useToastNotifications();

  const processContentWrapper = async (
    pastedContent: string,
    discussionsToGenerate: number,
    setSeedingResults: (result: any) => void
  ) => {
    const result = await handleProcessPastedContent(pastedContent, discussionsToGenerate);
    setSeedingResults(result);
    return result;
  };

  const processWithAIWrapper = async (
    scrapedContent: any[],
    aiProvider: string,
    aiModel: string,
    aiApiKey: string,
    temperature: number,
    generationSettings: GenerationSettings,
    setSeedingResults: (result: any) => void,
    setPreviewContent: (content: any[]) => void,
    setExpandedReplies: (replies: Record<number, boolean>) => void
  ) => {
    try {
      console.log('🔄 Starting AI processing wrapper...');
      const aiConfig = getAiConfig(aiProvider, aiModel, aiApiKey, temperature);
      
      const result = await handleProcessWithAI(scrapedContent, aiConfig, generationSettings);
      console.log('🔄 AI processing result:', result);
      
      setSeedingResults(result);
      if (result && result.success && result.data) {
        // Check if any of the transformed content contains parsing failure
        const hasParsingFailure = result.data.some((item: any) => 
          item.transformedContent === 'AI-transformed content (parsing failed)' ||
          item.transformedContent?.includes('(parsing failed)')
        );
        
        if (hasParsingFailure) {
          console.error('🔄 AI processing returned parsing failure in content');
          const failureResult = {
            success: false,
            error: 'AI response parsing failed. The content could not be properly transformed.',
            data: result.data
          };
          setSeedingResults(failureResult);
          return failureResult;
        }
        
        console.log('🔄 AI processing successful, setting preview content:', result.data.length, 'discussions');
        setPreviewContent(result.data);
        setExpandedReplies({});
      } else {
        console.error('🔄 AI processing failed or invalid result:', result?.error || 'Unknown error');
      }
      
      return result;
    } catch (error) {
      console.error('🔄 AI processing wrapper error:', error);
      const errorResult = {
        success: false,
        error: 'Failed to process AI result: ' + (error as Error).message
      };
      setSeedingResults(errorResult);
      return errorResult;
    }
  };

  const executeSeedingWrapper = async (
    previewContent: any[],
    batchId: string,
    generationSettings: GenerationSettings,
    selectedUsers: string[],
    setSeedingResults: (result: any) => void
  ) => {
    // Show loading toast when seeding starts
    showLoadingToast('Generating Forum', 'Creating discussions, replies, and distributing votes...');
    
    const result = await handleExecuteSeeding(previewContent, batchId, generationSettings);
    
    // Add the selected users count to the result
    if (result.success && result.finalStats) {
      const enhancedResult = {
        ...result,
        finalStats: {
          ...result.finalStats,
          usersCreated: selectedUsers.length
        }
      };
      setSeedingResults(enhancedResult);
      
      // Show success toast with detailed statistics
      const stats = enhancedResult.finalStats;
      const successMessage = `Created ${stats.discussionsCreated} discussions, ${stats.repliesCreated} replies, and ${stats.votesDistributed} votes!`;
      showSuccessToast('Forum Generation Complete', successMessage);
      
      // Open the first generated discussion in a new tab
      if (result.discussionSlugs && result.discussionSlugs.length > 0) {
        const firstDiscussionSlug = result.discussionSlugs[0];
        const discussionUrl = `/discussions/${firstDiscussionSlug}`;
        window.open(discussionUrl, '_blank');
      }
      
      return enhancedResult;
    } else {
      setSeedingResults(result);
      
      // Show error toast with user-friendly message
      const errorMessage = result.error || 'Forum generation failed due to an unexpected error.';
      showErrorToast('Forum Generation Failed', errorMessage);
      
      return result;
    }
  };

  const initializeSeedUsersWrapper = async (setSeedingResults: (result: any) => void) => {
    const result = await initializeSeedUsers();
    setSeedingResults(result);
    return result;
  };

  return {
    // Wrapper functions
    processContentWrapper,
    processWithAIWrapper,
    executeSeedingWrapper,
    initializeSeedUsersWrapper,
    checkSeedUsersStatus,
    
    // Toast notification properties
    toastVisible,
    toastTitle,
    toastMessage,
    toastStatus,
    hideToast,
  };
};