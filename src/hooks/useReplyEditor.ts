/* eslint-disable @typescript-eslint/no-unused-vars */
import { useInlineEditor } from './useInlineEditor';

interface ReplyIdentifier {
  discussionIndex: number;
  replyIndex: number;
  replyId?: string;
  [key: string]: string | number | undefined;
}

/**
 * Reply editor hook using the generic useInlineEditor
 * Maintains backward compatibility with existing code
 */
export const useReplyEditor = (
  onUpdateReply?: (discussionIndex: number, replyId: string, newContent: string) => void
) => {
  const editor = useInlineEditor<ReplyIdentifier>({
    onUpdate: (identifier, newContent) => {
      if (onUpdateReply && identifier.replyId) {
        onUpdateReply(identifier.discussionIndex, identifier.replyId, newContent);
      }
    },
    autoTrim: true,
  });

  // Adapter functions to maintain original API
  const startEditing = (discussionIndex: number, replyIndex: number, currentContent: string) => {
    editor.startEditing({ discussionIndex, replyIndex }, currentContent);
  };

  const saveEdit = (discussionIndex: number, replyId: string) => {
    // Directly call the update callback with the proper identifier including replyId
    if (onUpdateReply && editor.editContent.trim()) {
      onUpdateReply(discussionIndex, replyId, editor.editContent.trim());
    }
    // Clear the editing state
    editor.cancelEdit();
  };

  const isEditing = (discussionIndex: number, replyIndex: number) => {
    return editor.isEditing({ discussionIndex, replyIndex });
  };

  return {
    editingReply: editor.editingItem,
    editContent: editor.editContent,
    setEditContent: editor.setEditContent,
    startEditing,
    saveEdit,
    cancelEdit: editor.cancelEdit,
    isEditing,
    handleKeyDown: editor.handleKeyDown,
    handleBlur: editor.handleBlur,
  };
};