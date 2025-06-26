import { useState } from "react";
import { ReplyFormState, Reply } from "../types/threads";
import { useUserStore } from "../store/userStore";
import { trackDiscussionInteraction } from "./usePageTracking";

export const useReplyHandling = (discussionId?: string) => {
  const { user } = useUserStore();
  const [formState, setFormState] = useState<ReplyFormState>({
    newReply: "",
    replyingTo: null,
    replyingToAuthor: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplyChange = (value: string) => {
    setFormState((prev) => ({ ...prev, newReply: value }));
  };

  const handleReplyToComment = (replyId: string, authorName: string) => {
    setFormState((prev) => ({
      ...prev,
      replyingTo: replyId,
      replyingToAuthor: authorName,
    }));
    // Scroll to reply form
    setTimeout(() => {
      document
        .getElementById("reply-form")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.newReply.trim() || isSubmitting || !discussionId) return;

    // Ensure user is available
    if (!user?.id) {
      console.error('User not authenticated');
      alert('Please refresh the page and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formState.newReply.trim(),
          authorId: user.id,
          parentReplyId: formState.replyingTo || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        // Track reply submission analytics
        try {
          await trackDiscussionInteraction('reply', discussionId, user?.id);
        } catch (analyticsError) {
          console.debug('Analytics tracking failed (non-critical):', analyticsError);
        }

        // Reset form on success
        setFormState({
          newReply: "",
          replyingTo: null,
          replyingToAuthor: null,
        });

        // Refresh the page to show new reply
        window.location.reload();
      } else {
        console.error('Failed to submit reply:', data.error);
        alert('Failed to submit reply. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReply = () => {
    setFormState({
      newReply: "",
      replyingTo: null,
      replyingToAuthor: null,
    });
  };

  const organizeReplies = (replies: Reply[]) => {
    const topLevel = replies.filter((reply) => !reply.parentId);
    const nested = replies.filter((reply) => reply.parentId);

    return topLevel.map((reply) => ({
      ...reply,
      children: nested.filter((child) => child.parentId === reply.id),
    }));
  };

  return {
    formState,
    isSubmitting,
    handleReplyChange,
    handleReplyToComment,
    handleSubmitReply,
    handleCancelReply,
    organizeReplies,
  };
};
