/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface UseSeedingExecutionReturn {
  // State
  seedingInProgress: boolean;
  seedingProgress: number;
  
  // Actions
  handleExecuteSeeding: (previewContent: any[], batchId: string, generationSettings: any, selectedUsers: string[], onResult: (result: any) => void) => Promise<void>;
  setSeedingProgress: (progress: number) => void;
}

export const useSeedingExecution = (): UseSeedingExecutionReturn => {
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState(0);

  const handleExecuteSeeding = useCallback(async (
    previewContent: any[],
    batchId: string,
    generationSettings: any,
    selectedUsers: string[],
    onResult: (result: any) => void
  ) => {
    if (previewContent.length === 0) {
      onResult({
        success: false,
        error: 'No processed content available. Please process content with AI first.'
      });
      return;
    }

    if (!batchId) {
      onResult({
        success: false,
        error: 'No batch ID available. Please process content with AI first.'
      });
      return;
    }

    setSeedingInProgress(true);
    setSeedingProgress(0);

    try {
      const response = await fetch('/api/admin/execute-seeding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId,
          transformedContent: previewContent,
          generationSettings: {
            discussionsToGenerate: generationSettings.discussionsToGenerate,
            repliesPerDiscussion: generationSettings.repliesPerDiscussion,
            maxNestingDepth: generationSettings.maxNestingDepth,
            contentVariation: generationSettings.contentVariation
          }
        }),
      });

      const result = await response.json();
      setSeedingProgress(100);

      if (result.success) {
        onResult({
          success: true,
          message: result.message,
          finalStats: {
            discussionsCreated: result.results.discussionsCreated,
            usersCreated: selectedUsers.length,
            repliesCreated: result.results.repliesCreated,
            votesDistributed: result.results.votesCreated,
            errors: result.results.errors
          },
          batchId: result.batchId
        });
      } else {
        onResult({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      onResult({
        success: false,
        error: 'Seeding execution failed: ' + (error as Error).message
      });
    } finally {
      setSeedingInProgress(false);
    }
  }, []);

  const setSeedingProgressManual = useCallback((progress: number) => {
    setSeedingProgress(progress);
  }, []);

  return {
    // State
    seedingInProgress,
    seedingProgress,
    
    // Actions
    handleExecuteSeeding,
    setSeedingProgress: setSeedingProgressManual
  };
};