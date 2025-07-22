/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback } from 'react';

interface UseAvatarPathsHandlerProps {
  setSeedingResults: (results: any | ((prev: any) => any)) => void;
  refetchAvatarStatus: () => void;
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
}

export function useAvatarPathsHandler({
  setSeedingResults,
  refetchAvatarStatus,
  showLoadingToast,
  showSuccessToast,
  showErrorToast
}: UseAvatarPathsHandlerProps) {
  
  const handleFixAvatarPaths = useCallback(async () => {
    showLoadingToast('Fixing Avatar Paths', 'Updating avatar paths for users with incorrect file names...');
    
    try {
      const response = await fetch('/api/admin/fix-avatar-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        showSuccessToast(
          'Avatar Paths Fixed', 
          `Successfully updated avatar paths for ${result.fixedCount} users out of ${result.totalUsers} total users.`
        );
        setSeedingResults((prev: any) => ({
          ...prev,
          success: true,
          message: `Fixed avatar paths for ${result.fixedCount} users`,
          fixedAvatars: true,
          fixedCount: result.fixedCount,
          totalUsers: result.totalUsers,
          fixedUsers: result.fixedUsers
        }));
        
        // Refetch avatar status to update the button text
        refetchAvatarStatus();
      } else {
        console.error('🔧 Fix Avatar Paths: FAILED -', result.error);
        showErrorToast('Fix Avatar Paths Failed', result.error || 'Unknown error occurred while fixing avatar paths');
        setSeedingResults((prev: any) => ({
          ...prev,
          success: false,
          error: result.error
        }));
      }
    } catch (error) {
      console.error('🔧 Fix Avatar Paths: EXCEPTION -', error);
      showErrorToast('Fix Avatar Paths Error', 'Failed to fix avatar paths: ' + (error as Error).message);
      setSeedingResults((prev: any) => ({
        ...prev,
        success: false,
        error: 'Failed to fix avatar paths: ' + (error as Error).message
      }));
    }
  }, [setSeedingResults, refetchAvatarStatus, showLoadingToast, showSuccessToast, showErrorToast]);

  return {
    handleFixAvatarPaths
  };
}