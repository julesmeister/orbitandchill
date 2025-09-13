/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSeedingOperations } from './useSeedingOperations';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { useToastNotifications } from './useToastNotifications';

export const useReplyManagement = () => {
  const { handleAddReply, handleDeleteReplyById } = useSeedingOperations();
  const { getAiConfig } = useAIConfiguration();
  const {
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
    ...toastProps
  } = useToastNotifications();

  const addReplyWithToast = async (
    discussionIndex: number,
    previewContent: any[],
    selectedMoodForIndex: Record<number, string>,
    aiProvider: string,
    aiModel: string,
    aiApiKey: string,
    temperature: number,
    activePersonas: string[],
    setPreviewContent: (updater: (prev: any[]) => any[]) => void,
    setSeedingResults: (result: any) => void
  ) => {
    const discussion = previewContent[discussionIndex];
    const selectedMood = selectedMoodForIndex[discussionIndex] || 'supportive';
    
    // Show loading toast
    showLoadingToast(
      'Generating AI Reply',
      `Creating ${selectedMood} reply for "${discussion?.transformedTitle?.substring(0, 50)}..."`
    );
    
    try {
      const aiConfig = getAiConfig(aiProvider, aiModel, aiApiKey, temperature);
      const result = await handleAddReply(
        discussionIndex, 
        previewContent, 
        aiConfig, 
        setPreviewContent, 
        activePersonas,
        selectedMood
      );
      
      if (result.success) {
        showSuccessToast(
          'Reply Generated!',
          result.message || 'AI reply added successfully'
        );
      } else {
        showErrorToast(
          'Reply Generation Failed',
          result.error || 'Failed to generate reply'
        );
      }
      
      setSeedingResults(result);
      return result;
    } catch (error) {
      showErrorToast(
        'Reply Generation Error',
        'An unexpected error occurred while generating the reply'
      );
      
      const errorResult = {
        success: false,
        error: 'Unexpected error: ' + (error as Error).message
      };
      setSeedingResults(errorResult);
      return errorResult;
    }
  };

  const deleteReplyWithToast = (
    discussionIndex: number,
    replyId: string,
    setPreviewContent: (updater: (prev: any[]) => any[]) => void,
    setSeedingResults: (result: any) => void
  ) => {
    const result = handleDeleteReplyById(discussionIndex, replyId, setPreviewContent);
    setSeedingResults(result);
    return result;
  };

  return {
    // Actions
    addReplyWithToast,
    deleteReplyWithToast,
    
    // Toast props for the component
    ...toastProps,
  };
};