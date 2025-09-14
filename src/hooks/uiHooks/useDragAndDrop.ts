/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

export interface DragAndDropState {
  draggedItem: string | null;
  dragOverItem: string | null;
}

export interface UseDragAndDropProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  isEnabled: boolean;
}

export interface DragHandlers {
  handleDragStart: (e: React.DragEvent, itemId: string) => void;
  handleDragOver: (e: React.DragEvent, itemId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetItemId: string) => void;
  draggedItem: string | null;
  dragOverItem: string | null;
}

/**
 * Custom hook for managing drag and drop functionality
 * Provides reusable drag-and-drop logic for list reordering
 */
export function useDragAndDrop<T extends { id: string }>({
  items,
  onReorder,
  isEnabled
}: UseDragAndDropProps<T>): DragHandlers {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    if (!isEnabled) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  }, [isEnabled]);

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    if (!isEnabled || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  }, [isEnabled, draggedItem]);

  const handleDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();

    if (!draggedItem || !isEnabled || draggedItem === targetItemId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem);
    const targetIndex = newItems.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Remove dragged item and insert at target position
    const [draggedSection] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedSection);

    onReorder(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  }, [draggedItem, isEnabled, items, onReorder]);

  return {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    draggedItem,
    dragOverItem
  };
}