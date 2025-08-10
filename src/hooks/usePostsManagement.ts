/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useCallback } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';
import { stripHtmlTags } from '@/utils/textUtils';
import { extractFirstImageFromContent, createImageChartObject } from '@/utils/extractImageFromContent';

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

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  slug?: string;
  authorName?: string;
  isBlogPost?: boolean;
  isPublished?: boolean;
  isPinned?: boolean;
  embeddedChart?: any;
  embeddedVideo?: any;
  thumbnailUrl?: string;
}

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  status: 'loading' | 'success' | 'error' | 'info';
}

export function usePostsManagement() {
  const { threads, createThread, updateThread, deleteThread, loadThreads } = useAdminStore();
  const { user } = useUserStore();
  
  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const formDataRef = useRef<PostFormData | null>(null);
  
  // Delete confirmation state
  const [postToDelete, setPostToDelete] = useState<Thread | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFormSubmit = useCallback(async (
    formData: PostFormData, 
    shouldPublish?: boolean,
    onToast?: (toast: ToastState) => void
  ) => {
    if (shouldPublish === undefined) {
      return;
    }
    
    if (onToast) {
      onToast({
        show: true,
        title: editingPost ? 'Updating Post' : 'Creating Post',
        message: editingPost ? 'Saving your changes...' : 'Publishing your new post...',
        status: 'loading'
      });
    }
    
    const thumbnailUrl = formData.thumbnailUrl || extractFirstImageFromContent(formData.content);
    let embeddedChart = formData.embeddedChart;
    
    if (!embeddedChart && thumbnailUrl) {
      embeddedChart = createImageChartObject(thumbnailUrl, formData.title);
    }

    const postData = {
      ...formData,
      embeddedChart,
      featuredImage: thumbnailUrl || undefined,
      authorId: user?.id || 'admin_1',
      authorName: formData.authorName || user?.username || 'Admin User',
      preferredAvatar: user?.preferredAvatar,
      excerpt: formData.excerpt && formData.excerpt.trim() 
        ? stripHtmlTags(formData.excerpt).substring(0, 150) + (stripHtmlTags(formData.excerpt).length > 150 ? '...' : '') 
        : (formData.content ? stripHtmlTags(formData.content).substring(0, 150) + '...' : 'No description available'),
      isBlogPost: formData.isBlogPost ?? true,
      isPublished: shouldPublish,
      isPinned: formData.isPinned ?? false,
      isLocked: false,
    };

    try {
      if (editingPost) {
        await updateThread(editingPost, postData);
        setEditingPost(null);
        setShowCreateForm(false);
        
        if (onToast) {
          onToast({
            show: true,
            title: 'Post Updated',
            message: 'Your changes have been saved successfully.',
            status: 'success'
          });
        }
      } else {
        await createThread(postData);
        setShowCreateForm(false);
        
        if (onToast) {
          onToast({
            show: true,
            title: 'Post Created',
            message: 'Your new post has been published successfully.',
            status: 'success'
          });
        }
      }
    } catch (error) {
      console.error('❌ Error saving post:', error);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Save Failed',
          message: 'There was an error saving your post. Please try again.',
          status: 'error'
        });
      }
    }
  }, [editingPost, createThread, updateThread, user]);

  const handleAdminOptionsSave = useCallback(async (
    formData: PostFormData, 
    onToast?: (toast: ToastState) => void
  ) => {
    if (!editingPost) {
      return;
    }
    
    const currentThread = threads.find((t: Thread) => t.id === editingPost);
    if (!currentThread) {
      return;
    }

    if (onToast) {
      onToast({
        show: true,
        title: 'Auto-saving',
        message: 'Saving changes...',
        status: 'loading'
      });
    }

    const firstImage = extractFirstImageFromContent(formData.content || currentThread.content);
    let embeddedChart = currentThread.embeddedChart;
    
    if (!embeddedChart && firstImage) {
      embeddedChart = createImageChartObject(firstImage, formData.title || currentThread.title);
    }

    const contentToUse = formData.content || currentThread.content;
    const excerptToUse = formData.excerpt && formData.excerpt.trim() 
      ? stripHtmlTags(formData.excerpt).substring(0, 150) + (stripHtmlTags(formData.excerpt).length > 150 ? '...' : '')
      : currentThread.excerpt || (contentToUse ? stripHtmlTags(contentToUse).substring(0, 150) + '...' : 'No description available');

    const postData = {
      title: formData.title || currentThread.title,
      slug: formData.slug || currentThread.slug,
      content: contentToUse,
      excerpt: excerptToUse,
      category: formData.category || currentThread.category,
      tags: formData.tags || currentThread.tags,
      authorId: currentThread.authorId,
      authorName: formData.authorName || currentThread.authorName,
      preferredAvatar: currentThread.preferredAvatar,
      embeddedChart,
      isBlogPost: formData.isBlogPost ?? currentThread.isBlogPost,
      isPublished: formData.isPublished ?? currentThread.isPublished,
      isPinned: formData.isPinned ?? currentThread.isPinned,
      isLocked: currentThread.isLocked ?? false,
    };

    try {
      await updateThread(editingPost, postData);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Auto-saved',
          message: 'Changes saved automatically.',
          status: 'success'
        });
        
        setTimeout(() => {
          onToast({ show: false, title: '', message: '', status: 'info' });
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error auto-saving admin options:', error);
      
      if (onToast) {
        onToast({
          show: true,
          title: 'Auto-save Failed',
          message: 'Could not save changes automatically.',
          status: 'error'
        });
      }
    }
  }, [editingPost, threads, updateThread]);

  const handleEdit = useCallback((thread: Thread) => {
    setEditingPost(thread.id);
    setShowCreateForm(true);
  }, []);

  const handleDeletePost = useCallback((thread: Thread) => {
    setPostToDelete(thread);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (postToDelete) {
      try {
        await deleteThread(postToDelete.id);
        setShowDeleteConfirm(false);
        setPostToDelete(null);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
        setShowDeleteConfirm(false);
        setPostToDelete(null);
      }
    }
  }, [postToDelete, deleteThread]);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  }, []);

  const handleTogglePin = useCallback(async (thread: Thread) => {
    const updatedData = {
      title: thread.title,
      slug: thread.slug,
      content: thread.content,
      excerpt: thread.excerpt,
      category: thread.category,
      tags: thread.tags,
      authorId: thread.authorId,
      authorName: thread.authorName,
      preferredAvatar: thread.preferredAvatar,
      isBlogPost: thread.isBlogPost,
      isPublished: thread.isPublished,
      isPinned: !thread.isPinned,
      isLocked: thread.isLocked ?? false
    };

    try {
      await updateThread(thread.id, updatedData);
    } catch (error) {
      console.error('Error toggling pin:', error);
      alert('Error updating post. Please try again.');
    }
  }, [updateThread]);

  const handleCancel = useCallback(() => {
    setShowCreateForm(false);
    setEditingPost(null);
  }, []);

  const handleCreatePost = useCallback(() => {
    setEditingPost(null);
    setShowCreateForm(true);
  }, []);

  return {
    // State
    threads,
    showCreateForm,
    editingPost,
    formDataRef,
    postToDelete,
    showDeleteConfirm,
    
    // Actions
    handleFormSubmit,
    handleAdminOptionsSave,
    handleEdit,
    handleDeletePost,
    confirmDelete,
    cancelDelete,
    handleTogglePin,
    handleCancel,
    handleCreatePost,
    setShowCreateForm,
  };
}