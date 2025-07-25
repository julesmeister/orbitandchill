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