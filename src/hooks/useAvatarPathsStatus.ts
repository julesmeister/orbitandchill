/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';

interface AvatarPathsStatus {
  totalUsers: number;
  usersNeedingFix: number;
  isLoading: boolean;
  error: string | null;
}

export const useAvatarPathsStatus = () => {
  const [status, setStatus] = useState<AvatarPathsStatus>({
    totalUsers: 0,
    usersNeedingFix: 0,
    isLoading: false,
    error: null,
  });

  const checkAvatarPathsStatus = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/admin/check-avatar-paths-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          totalUsers: result.totalUsers,
          usersNeedingFix: result.usersNeedingFix,
          isLoading: false,
          error: null,
        });
      } else {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Failed to check avatar paths status',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check avatar paths status: ' + (error as Error).message,
      }));
    }
  };

  useEffect(() => {
    checkAvatarPathsStatus();
  }, []);

  return {
    ...status,
    refetch: checkAvatarPathsStatus,
  };
};