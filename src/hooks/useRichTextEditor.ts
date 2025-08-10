/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState, useRef, useEffect } from 'react';

export const useRichTextEditor = (content: string, onChange: (content: string) => void) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Update editor content when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      // Preserve cursor position when updating content
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const cursorOffset = range ? range.startOffset : 0;
      const cursorNode = range ? range.startContainer : null;
      
      editorRef.current.innerHTML = content || '';
      
      // Restore cursor position if possible
      if (cursorNode && editorRef.current.contains(cursorNode)) {
        try {
          const newRange = document.createRange();
          newRange.setStart(cursorNode, Math.min(cursorOffset, cursorNode.textContent?.length || 0));
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        } catch (e) {
          // Ignore cursor restoration errors
        }
      }
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  }, [onChange]);

  // Handle Enter key to ensure proper line breaks
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Allow default behavior for creating line breaks
      return;
    }
  }, []);

  const execCommand = useCallback((command: string, value?: string) => {
    const result = document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
    return result;
  }, [handleInput]);

  const formatBlock = useCallback((tag: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    
    execCommand('formatBlock', tag);
  }, [execCommand]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const handleImageSelect = useCallback((src: string, alt: string) => {
    // Focus the editor first
    editorRef.current?.focus();
    
    // Restore saved selection if we have one
    const selection = window.getSelection();
    if (savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
    
    // Insert image with execCommand
    execCommand('insertImage', src);
    
    // Try to add alt attribute to the inserted image
    const images = editorRef.current?.getElementsByTagName('img');
    if (images && images.length > 0) {
      const lastImage = images[images.length - 1];
      lastImage.alt = alt;
      lastImage.title = alt;
    }
    
    setShowImageModal(false);
    setSavedSelection(null);
  }, [execCommand, savedSelection]);

  const handleAddImage = useCallback(() => {
    // Save current selection before opening modal
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      setSavedSelection(range);
    }
    setShowImageModal(true);
  }, []);

  return {
    // State
    isPreviewMode,
    setIsPreviewMode,
    isFullscreen,
    setIsFullscreen,
    showImageModal,
    setShowImageModal,
    editorRef,
    
    // Handlers
    handleInput,
    handleKeyDown,
    execCommand,
    formatBlock,
    addLink,
    handleImageSelect,
    handleAddImage
  };
};