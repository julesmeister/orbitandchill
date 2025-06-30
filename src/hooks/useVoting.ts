import { useState, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';

interface UseVotingOptions {
  onVoteSuccess?: (upvotes: number, downvotes: number) => void;
  onVoteError?: (error: string) => void;
}

interface VoteState {
  isVoting: boolean;
  userVote: 'up' | 'down' | null;
  upvotes: number;
  downvotes: number;
}

export function useVoting(
  type: 'discussion' | 'reply',
  id: string,
  initialUpvotes: number = 0,
  initialDownvotes: number = 0,
  initialUserVote: 'up' | 'down' | null = null,
  options?: UseVotingOptions
) {
  const { user, ensureAnonymousUser } = useUserStore();
  const [voteState, setVoteState] = useState<VoteState>({
    isVoting: false,
    userVote: initialUserVote,
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
  });
  
  
  // Store the previous state for reverting on error
  const [previousState, setPreviousState] = useState<VoteState>({
    isVoting: false,
    userVote: initialUserVote,
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
  });

  const handleVote = useCallback(async (voteType: 'up' | 'down') => {
    // Ensure we have a user (create anonymous if needed)
    let currentUser = user;
    if (!currentUser?.id) {
      await ensureAnonymousUser();
      currentUser = useUserStore.getState().user;
    }

    if (!currentUser?.id) {
      options?.onVoteError?.('Unable to create user session');
      return;
    }

    if (voteState.isVoting) return;

    // Store current state before optimistic update
    setPreviousState(voteState);

    // Optimistic update - immediately update the UI
    setVoteState(prev => {
      let newUpvotes = prev.upvotes;
      let newDownvotes = prev.downvotes;
      let newUserVote: 'up' | 'down' | null = voteType;

      // If user is changing their vote
      if (prev.userVote === 'up' && voteType === 'down') {
        newUpvotes--;
        newDownvotes++;
      } else if (prev.userVote === 'down' && voteType === 'up') {
        newDownvotes--;
        newUpvotes++;
      } 
      // If user is removing their vote (clicking same button again)
      else if (prev.userVote === voteType) {
        if (voteType === 'up') {
          newUpvotes--;
        } else {
          newDownvotes--;
        }
        newUserVote = null;
      }
      // If user is voting for the first time
      else if (!prev.userVote) {
        if (voteType === 'up') {
          newUpvotes++;
        } else {
          newDownvotes++;
        }
      }

      return {
        ...prev,
        isVoting: true,
        userVote: newUserVote,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
      };
    });

    try {
      const endpoint = type === 'discussion' 
        ? `/api/discussions/${id}/vote`
        : `/api/replies/${id}/vote`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          voteType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote');
      }

      if (data.success) {
        setVoteState(prev => ({
          ...prev,
          userVote: voteType,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          isVoting: false,
        }));

        options?.onVoteSuccess?.(data.upvotes, data.downvotes);
      }
    } catch (error) {
      console.error('Vote error:', error);
      options?.onVoteError?.(error instanceof Error ? error.message : 'Failed to submit vote');
      
      // Revert optimistic update on error
      setVoteState({
        ...previousState,
        isVoting: false,
      });
    }
  }, [user, ensureAnonymousUser, id, type, voteState, previousState, options]);

  const handleUpvote = useCallback(() => {
    // If already upvoted, remove the vote
    if (voteState.userVote === 'up') {
      handleVote('up'); // Backend will handle vote removal
    } else {
      handleVote('up');
    }
  }, [voteState.userVote, handleVote]);

  const handleDownvote = useCallback(() => {
    // If already downvoted, remove the vote
    if (voteState.userVote === 'down') {
      handleVote('down'); // Backend will handle vote removal
    } else {
      handleVote('down');
    }
  }, [voteState.userVote, handleVote]);

  return {
    ...voteState,
    handleUpvote,
    handleDownvote,
    isAuthenticated: !!user?.id,
  };
}