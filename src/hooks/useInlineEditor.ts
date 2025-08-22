/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

export interface EditingIdentifier {
  [key: string]: string | number | undefined;
}

export interface UseInlineEditorOptions<T extends EditingIdentifier> {
  onUpdate?: (identifier: T, newContent: string) => void;
  autoTrim?: boolean;
}

/**
 * Generic inline editor hook that eliminates code duplication
 * Used by both reply editing and discussion editing
 */
export function useInlineEditor<T extends EditingIdentifier>(
  options: UseInlineEditorOptions<T> = {}
) {
  const { onUpdate, autoTrim = true } = options;
  
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [editContent, setEditContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');

  const startEditing = useCallback((identifier: T, currentContent: string) => {
    setEditingItem(identifier);
    setEditContent(currentContent);
    setOriginalContent(currentContent);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingItem) return;
    
    const finalContent = autoTrim ? editContent.trim() : editContent;
    
    if (finalContent && finalContent !== originalContent) {
      if (onUpdate) {
        onUpdate(editingItem, finalContent);
      }
    }
    
    setEditingItem(null);
    setEditContent('');
    setOriginalContent('');
  }, [editingItem, editContent, originalContent, onUpdate, autoTrim]);

  const cancelEdit = useCallback(() => {
    setEditingItem(null);
    setEditContent('');
    setOriginalContent('');
  }, []);

  const isEditing = useCallback((identifier: T) => {
    if (!editingItem) return false;
    return Object.keys(identifier).every(
      key => editingItem[key] === identifier[key]
    );
  }, [editingItem]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  const handleBlur = useCallback(() => {
    const trimmedContent = autoTrim ? editContent.trim() : editContent;
    if (trimmedContent && trimmedContent !== originalContent) {
      saveEdit();
    } else {
      cancelEdit();
    }
  }, [editContent, originalContent, autoTrim, saveEdit, cancelEdit]);

  return {
    editingItem,
    editContent,
    originalContent,
    setEditContent,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing,
    handleKeyDown,
    handleBlur,
    hasChanges: editContent !== originalContent,
    isEditMode: editingItem !== null,
  };
}