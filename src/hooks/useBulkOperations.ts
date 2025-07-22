/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';

interface Thread {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  preferredAvatar?: string;
  slug?: string;
  isBlogPost: boolean;
  isPublished: boolean;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  upvotes: number;
  downvotes: number;
  replies: number;
  featuredImage?: string;
  category: string;
  embeddedChart?: any;
  embeddedVideo?: any;
}

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  status: 'loading' | 'success' | 'error' | 'info';
}

export function useBulkOperations() {
  const { threads, updateThread, deleteThread } = useAdminStore();
  
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const handleSelectPost = useCallback((postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  }, [selectedPosts]);

  const handleSelectAll = useCallback((currentPosts: Thread[]) => {
    if (selectedPosts.size === currentPosts.length) {
      setSelectedPosts(new Set());
      setShowBulkActions(false);
    } else {
      const allPostIds = new Set(currentPosts.map(post => post.id));
      setSelectedPosts(allPostIds);
      setShowBulkActions(true);
    }
  }, [selectedPosts.size]);

  const handleClearSelection = useCallback(() => {
    setSelectedPosts(new Set());
    setShowBulkActions(false);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setShowBulkDeleteConfirm(true);
  }, []);

  const confirmBulkDelete = useCallback(async (onToast?: (toast: ToastState) => void) => {
    try {
      const selectedArray = Array.from(selectedPosts);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Deleting Posts',
          message: `Deleting ${selectedArray.length} posts...`,
          status: 'loading'
        });
      }

      for (const postId of selectedArray) {
        await deleteThread(postId);
      }
      
      setSelectedPosts(new Set());
      setShowBulkActions(false);
      setShowBulkDeleteConfirm(false);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Posts Deleted',
          message: `Successfully deleted ${selectedArray.length} posts.`,
          status: 'success'
        });
      }
    } catch (error) {
      console.error('Error bulk deleting posts:', error);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Delete Failed',
          message: 'Failed to delete some posts. Please try again.',
          status: 'error'
        });
      }
    }
  }, [selectedPosts, deleteThread]);

  const cancelBulkDelete = useCallback(() => {
    setShowBulkDeleteConfirm(false);
  }, []);

  const handleBulkPublish = useCallback(async (onToast?: (toast: ToastState) => void) => {
    try {
      const selectedArray = Array.from(selectedPosts);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Publishing Posts',
          message: `Publishing ${selectedArray.length} posts...`,
          status: 'loading'
        });
      }

      for (const postId of selectedArray) {
        const post = threads.find(t => t.id === postId);
        if (post) {
          await updateThread(postId, { ...post, isPublished: true });
        }
      }
      
      setSelectedPosts(new Set());
      setShowBulkActions(false);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Posts Published',
          message: `Successfully published ${selectedArray.length} posts.`,
          status: 'success'
        });
      }
    } catch (error) {
      console.error('Error bulk publishing posts:', error);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Publish Failed',
          message: 'Failed to publish some posts. Please try again.',
          status: 'error'
        });
      }
    }
  }, [selectedPosts, threads, updateThread]);

  const handleBulkUnpublish = useCallback(async (onToast?: (toast: ToastState) => void) => {
    try {
      const selectedArray = Array.from(selectedPosts);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Unpublishing Posts',
          message: `Moving ${selectedArray.length} posts to drafts...`,
          status: 'loading'
        });
      }

      for (const postId of selectedArray) {
        const post = threads.find(t => t.id === postId);
        if (post) {
          await updateThread(postId, { ...post, isPublished: false });
        }
      }
      
      setSelectedPosts(new Set());
      setShowBulkActions(false);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Posts Unpublished',
          message: `Successfully moved ${selectedArray.length} posts to drafts.`,
          status: 'success'
        });
      }
    } catch (error) {
      console.error('Error bulk unpublishing posts:', error);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Unpublish Failed',
          message: 'Failed to unpublish some posts. Please try again.',
          status: 'error'
        });
      }
    }
  }, [selectedPosts, threads, updateThread]);

  const clearSelectionsOnFilterChange = useCallback(() => {
    setSelectedPosts(new Set());
    setShowBulkActions(false);
  }, []);

  return {
    // State
    selectedPosts,
    showBulkActions,
    showBulkDeleteConfirm,
    
    // Actions
    handleSelectPost,
    handleSelectAll,
    handleClearSelection,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    handleBulkPublish,
    handleBulkUnpublish,
    clearSelectionsOnFilterChange,
  };
}