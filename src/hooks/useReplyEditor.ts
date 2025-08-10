/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

interface EditingState {
  discussionIndex: number;
  replyIndex: number;
}

export const useReplyEditor = (onUpdateReply?: (discussionIndex: number, replyId: string, newContent: string) => void) => {
  const [editingReply, setEditingReply] = useState<EditingState | null>(null);
  const [editContent, setEditContent] = useState('');

  const startEditing = (discussionIndex: number, replyIndex: number, currentContent: string) => {
    setEditingReply({ discussionIndex, replyIndex });
    setEditContent(currentContent);
  };

  const saveEdit = (discussionIndex: number, replyId: string) => {
    if (onUpdateReply && editContent.trim()) {
      onUpdateReply(discussionIndex, replyId, editContent.trim());
    }
    setEditingReply(null);
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingReply(null);
    setEditContent('');
  };

  const isEditing = (discussionIndex: number, replyIndex: number) => {
    return editingReply?.discussionIndex === discussionIndex && 
           editingReply?.replyIndex === replyIndex;
  };

  return {
    editingReply,
    editContent,
    setEditContent,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing
  };
};