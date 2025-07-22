/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback } from 'react';

interface UseReplyHandlersProps {
  previewContent: any[];
  selectedMoodForIndex: Record<number, string>;
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
  activePersonas: string[];
  setPreviewContent: (updater: (prev: any[]) => any[]) => void;
  setSeedingResults: (results: any | ((prev: any) => any)) => void;
  addReplyWithToast: (
    discussionIndex: number,
    previewContent: any[],
    selectedMoodForIndex: Record<number, string>,
    aiProvider: string,
    aiModel: string,
    aiApiKey: string,
    temperature: number,
    activePersonas: string[],
    setPreviewContent: (updater: (prev: any[]) => any[]) => void,
    setSeedingResults: (results: any) => void
  ) => Promise<any>;
  deleteReplyWithToast: (
    discussionIndex: number,
    replyId: string,
    setPreviewContent: (updater: (prev: any[]) => any[]) => void,
    setSeedingResults: (results: any) => void
  ) => void;
}

export function useReplyHandlers({
  previewContent,
  selectedMoodForIndex,
  aiProvider,
  aiModel,
  aiApiKey,
  temperature,
  activePersonas,
  setPreviewContent,
  setSeedingResults,
  addReplyWithToast,
  deleteReplyWithToast
}: UseReplyHandlersProps) {
  
  const handleAddReplyWrapper = useCallback(async (discussionIndex: number) => {
    // Get the current mood for this discussion
    const currentMood = selectedMoodForIndex[discussionIndex] || 'supportive';
    
    await addReplyWithToast(
      discussionIndex,
      previewContent,
      selectedMoodForIndex,
      aiProvider,
      aiModel,
      aiApiKey,
      temperature,
      activePersonas,
      setPreviewContent,
      setSeedingResults
    );
  }, [
    previewContent,
    selectedMoodForIndex,
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    activePersonas,
    setPreviewContent,
    setSeedingResults,
    addReplyWithToast
  ]);

  const handleDeleteReply = useCallback((discussionIndex: number, replyId: string) => {
    deleteReplyWithToast(discussionIndex, replyId, setPreviewContent, setSeedingResults);
  }, [deleteReplyWithToast, setPreviewContent, setSeedingResults]);

  const handleClearReplies = useCallback((discussionIndex: number) => {
    setPreviewContent(prev => {
      const updated = [...prev];
      if (updated[discussionIndex]) {
        updated[discussionIndex] = {
          ...updated[discussionIndex],
          replies: [],
          actualReplyCount: 0
        };
      }
      return updated;
    });
    
    setSeedingResults((prev: any) => ({
      ...prev,
      message: 'Replies cleared from preview'
    }));
  }, [setPreviewContent, setSeedingResults]);

  const handleUpdateReply = useCallback((discussionIndex: number, replyId: string, newContent: string) => {
    setPreviewContent(prev => {
      const updated = [...prev];
      if (updated[discussionIndex] && updated[discussionIndex].replies) {
        updated[discussionIndex].replies = updated[discussionIndex].replies.map((reply: any) =>
          reply.id === replyId ? { ...reply, content: newContent } : reply
        );
      }
      return updated;
    });
    
    setSeedingResults((prev: any) => ({
      ...prev,
      message: 'Reply content updated'
    }));
  }, [setPreviewContent, setSeedingResults]);

  return {
    handleAddReplyWrapper,
    handleDeleteReply,
    handleClearReplies,
    handleUpdateReply
  };
}