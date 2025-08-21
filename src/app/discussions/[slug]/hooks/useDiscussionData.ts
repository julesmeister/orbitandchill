/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../../../../store/userStore";
import { trackDiscussionView } from "../../../../lib/analytics";
import { trackDiscussionInteraction } from "../../../../hooks/usePageTracking";

export function useDiscussionData(slug: string) {
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repliesCount, setRepliesCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { user, ensureAnonymousUser, loadProfile } = useUserStore();

  // Initialize user on mount
  useEffect(() => {
    const initUser = async () => {
      await loadProfile();
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        await ensureAnonymousUser();
      }
    };
    initUser();
  }, []);

  // PERFORMANCE: Optimized reply count updates with debouncing
  const handleReplyCountUpdate = useCallback(async (newCount: number) => {
    setRepliesCount(newCount);
    
    // Update local state immediately for better UX
    setDiscussion((prev: any) => ({
      ...prev,
      replies: newCount
    }));
    
    // Cross-check with database discussion.replies count (debounced)
    if (discussion && discussion.replies !== newCount) {
      // PERFORMANCE: Non-blocking database sync
      setTimeout(async () => {
        try {
          const response = await fetch(`/api/discussions/${discussion.id}/sync-replies`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              actualCount: newCount
            })
          });
        } catch (error) {
          // Silent fail for sync
        }
      }, 500); // 500ms debounce
    }
  }, [discussion]);

  // PERFORMANCE: Optimized reply count cross-check with caching
  const crossCheckReplyCount = useCallback(async (discussionData: any) => {
    try {
      // PERFORMANCE: Use cache-first approach for reply count
      const repliesResponse = await fetch(`/api/discussions/${discussionData.id}/replies`, {
        headers: {
          'Cache-Control': 'max-age=60', // Cache for 1 minute
          'Accept': 'application/json'
        }
      });
      
      const repliesData = await repliesResponse.json();
      
      if (repliesData.success && repliesData.replies) {
        const actualCount = repliesData.replies.length;
        const databaseCount = discussionData.replies;
        
        if (databaseCount !== actualCount) {
          handleReplyCountUpdate(actualCount).catch(() => {}); // Non-blocking
        } else {
          setRepliesCount(actualCount);
        }
      }
    } catch (error) {
      // Fall back to database count if cross-check fails
      setRepliesCount(discussionData.replies || 0);
    }
  }, [handleReplyCountUpdate]);

  // PERFORMANCE: Optimized discussion fetching with prefetching
  useEffect(() => {
    async function fetchDiscussion() {
      try {
        setLoading(true);
        
        // PERFORMANCE: Fetch discussion by slug with optimized headers
        const response = await fetch(`/api/discussions/by-slug/${slug}`, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'max-age=300', // Use cache if available
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.discussion) {
          setDiscussion(data.discussion);
          setError(null);
          
          // PERFORMANCE: Prefetch replies data (non-blocking)
          setTimeout(() => {
            fetch(`/api/discussions/${data.discussion.id}/replies`, {
              headers: { 'Cache-Control': 'max-age=60' }
            }).catch(() => {}); // Silent prefetch
          }, 100);
          
          // Track analytics
          trackDiscussionView(data.discussion.id, data.discussion.category);
          trackDiscussionInteraction('view', data.discussion.id, user?.id).catch(() => {});
          
          // Cross-check reply count after setting discussion
          crossCheckReplyCount(data.discussion).catch(() => {});
        } else {
          setError(data.error || 'Discussion not found');
          setDiscussion(null);
        }
      } catch (err) {
        setError('Failed to load discussion');
        setDiscussion(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDiscussion();
  }, [slug]);

  // Handle discussion deletion
  const handleDeleteDiscussion = useCallback(async () => {
    if (!user || !discussion) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/discussions/${discussion.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Success - redirect to discussions list
        window.location.href = '/discussions';
      } else {
        alert('Failed to delete discussion: ' + (result.error || 'Unknown error'));
        setIsDeleting(false);
      }
    } catch (error) {
      alert('Failed to delete discussion. Please try again.');
      setIsDeleting(false);
    }
  }, [user, discussion]);

  return {
    discussion,
    loading,
    error,
    repliesCount,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleting,
    user,
    handleReplyCountUpdate,
    handleDeleteDiscussion,
  };
}