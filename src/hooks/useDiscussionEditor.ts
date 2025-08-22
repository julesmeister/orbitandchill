/* eslint-disable @typescript-eslint/no-unused-vars */
import { useInlineEditor } from './useInlineEditor';

interface DiscussionIdentifier {
  discussionIndex: number;
  field: 'content' | 'title';
  [key: string]: string | number | undefined;
}

/**
 * Discussion editor hook using the generic useInlineEditor
 * Maintains backward compatibility with existing code
 */
export const useDiscussionEditor = (
  onUpdateDiscussion?: (discussionIndex: number, field: 'content' | 'title', newValue: string) => void
) => {
  const editor = useInlineEditor<DiscussionIdentifier>({
    onUpdate: (identifier, newValue) => {
      if (onUpdateDiscussion) {
        onUpdateDiscussion(identifier.discussionIndex, identifier.field, newValue);
      }
    },
    autoTrim: true,
  });

  // Adapter functions to maintain original API
  const startEditing = (discussionIndex: number, field: 'content' | 'title', currentContent: string) => {
    editor.startEditing({ discussionIndex, field }, currentContent);
  };

  const saveEdit = (discussionIndex: number, field: 'content' | 'title') => {
    editor.saveEdit();
  };

  const isEditing = (discussionIndex: number, field: 'content' | 'title') => {
    return editor.isEditing({ discussionIndex, field });
  };

  return {
    editingDiscussion: editor.editingItem,
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