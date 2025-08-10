/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface Reply {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  avatar: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  parentId?: string;
  isFromDatabase?: boolean;
  timestamp?: string;
}

interface ToastHandlers {
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
}

export function useDiscussionReplies(toastHandlers: ToastHandlers) {
  const [existingReplies, setExistingReplies] = useState<Reply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const { showLoadingToast, showSuccessToast, showErrorToast } = toastHandlers;

  // Flatten threaded replies helper
  const flattenReplies = (replies: any[]): Reply[] => {
    const flat: Reply[] = [];
    replies.forEach(reply => {
      flat.push({
        id: reply.id,
        content: reply.content,
        authorName: reply.author,
        authorId: reply.authorId,
        avatar: reply.avatar,
        upvotes: reply.upvotes || 0,
        downvotes: reply.downvotes || 0,
        createdAt: reply.timestamp,
        parentId: reply.parentId,
        // Add flag to distinguish database replies from preview replies
        isFromDatabase: true,
        timestamp: reply.timestamp  // Keep formatted timestamp for display
      });
      if (reply.children && reply.children.length > 0) {
        flat.push(...flattenReplies(reply.children));
      }
    });
    return flat;
  };

  // Fetch existing replies for a discussion
  const fetchExistingReplies = useCallback(async (discussionId: string) => {
    setLoadingReplies(true);
    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        setExistingReplies(flattenReplies(data.replies || []));
      } else {
        console.error('Failed to fetch existing replies');
        setExistingReplies([]);
      }
    } catch (error) {
      console.error('Error fetching existing replies:', error);
      setExistingReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  }, []);

  // Fix avatar paths for discussion replies
  const fixDiscussionAvatars = useCallback(async (discussionId: string) => {
    showLoadingToast('Fixing Avatars', 'Updating avatar paths for discussion replies...');

    try {
      const response = await fetch('/api/admin/fix-discussion-avatar-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discussionId }),
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccessToast('Avatars Fixed', `Updated avatar paths for ${result.fixedCount} replies.`);
        // Refresh existing replies display
        await fetchExistingReplies(discussionId);
      } else {
        showErrorToast('Fix Failed', result.error || 'Failed to fix avatar paths.');
      }
    } catch (error) {
      showErrorToast('Fix Error', 'Failed to fix avatar paths: ' + (error as Error).message);
    }
  }, [fetchExistingReplies, showLoadingToast, showSuccessToast, showErrorToast]);

  // Randomize reply timestamps for a discussion
  const randomizeReplyTimes = useCallback(async (discussionId: string) => {
    showLoadingToast('Randomizing Times & Likes', 'Updating reply timestamps and vote counts to look more natural...');

    try {
      const response = await fetch('/api/admin/randomize-reply-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discussionId }),
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccessToast('Times & Likes Randomized', `Updated timestamps and vote counts for ${result.updatedCount} replies.`);
        // Refresh existing replies display
        await fetchExistingReplies(discussionId);
      } else {
        showErrorToast('Randomization Failed', result.error || 'Failed to randomize reply times and likes.');
      }
    } catch (error) {
      showErrorToast('Randomization Error', 'Failed to randomize times and likes: ' + (error as Error).message);
    }
  }, [fetchExistingReplies, showLoadingToast, showSuccessToast, showErrorToast]);

  return {
    existingReplies,
    loadingReplies,
    fetchExistingReplies,
    fixDiscussionAvatars,
    randomizeReplyTimes
  };
}