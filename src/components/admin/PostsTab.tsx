/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';
import DiscussionForm from '../forms/DiscussionForm';
import ConfirmationModal from '../reusable/ConfirmationModal';
import StatusToast from '../reusable/StatusToast';
import UncategorizedPostsManager from './UncategorizedPostsManager';
import { stripHtmlTags } from '@/utils/textUtils';
import { extractFirstImageFromContent, createImageChartObject } from '@/utils/extractImageFromContent';
import { useCategories } from '@/hooks/useCategories';

// Thread interface from adminStore
interface Thread {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  preferredAvatar?: string; // User's chosen avatar
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

interface PostsTabProps {
  isLoading: boolean;
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

export default function PostsTab({ isLoading }: PostsTabProps) {
  const { threads, loadThreads, createThread, updateThread, deleteThread } = useAdminStore();
  const { user } = useUserStore();

  // Date formatting utility function
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
  };

  const formatDetailedDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };
  
  // Database-backed categories management
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fallback: categoriesFallback,
    addCategory,
    updateCategory: updateCategoryDb,
    deleteCategory: deleteCategoryDb,
    refreshCategories
  } = useCategories();
  
  // UI state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const formDataRef = useRef<PostFormData | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [postToDelete, setPostToDelete] = useState<Thread | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Multi-select state
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Real-time updates for relative time display
  const [timeUpdateTrigger, setTimeUpdateTrigger] = useState(0);
  
  // Category management state
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showUncategorizedManager, setShowUncategorizedManager] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{id: string, value: string} | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    status: 'loading' | 'success' | 'error' | 'info';
  }>({
    show: false,
    title: '',
    message: '',
    status: 'info'
  });

  useEffect(() => {
    // Only load threads if not already loaded - AdminDashboard handles initial loading
    if (threads.length === 0) {
      loadThreads();
    }
  }, []); // Empty dependency array - only run once on mount

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdateTrigger(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Database-backed category management functions
  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.some(cat => cat.name === newCategory.trim())) {
      const success = await addCategory({
        name: newCategory.trim(),
        color: '#6bdbff', // Default color
        description: `Discussion category: ${newCategory.trim()}`
      });
      
      if (success) {
        setNewCategory('');
        setToast({
          show: true,
          title: 'Category Added',
          message: 'Category has been created successfully.',
          status: 'success'
        });
      } else {
        setToast({
          show: true,
          title: 'Add Failed',
          message: 'Failed to create category. Please try again.',
          status: 'error'
        });
      }
    }
  };

  const handleEditCategory = async (categoryId: string, newValue: string) => {
    if (newValue.trim() && !categories.some(cat => cat.name === newValue.trim() && cat.id !== categoryId)) {
      const success = await updateCategoryDb(categoryId, { name: newValue.trim() });
      
      if (success) {
        setEditingCategory(null);
        setToast({
          show: true,
          title: 'Category Updated',
          message: 'Category has been updated successfully.',
          status: 'success'
        });
      } else {
        setToast({
          show: true,
          title: 'Update Failed',
          message: 'Failed to update category. Please try again.',
          status: 'error'
        });
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category || category.isDefault) {
      setToast({
        show: true,
        title: 'Delete Failed',
        message: 'Cannot delete default category.',
        status: 'error'
      });
      return;
    }

    const success = await deleteCategoryDb(categoryId);
    
    if (success) {
      setToast({
        show: true,
        title: 'Category Deleted',
        message: 'Category has been deleted successfully.',
        status: 'success'
      });
    } else {
      setToast({
        show: true,
        title: 'Delete Failed',
        message: 'Failed to delete category. Please try again.',
        status: 'error'
      });
    }
  };

  const handleResetCategories = async () => {
    await refreshCategories();
    setToast({
      show: true,
      title: 'Categories Reset',
      message: 'Categories have been reset to defaults.',
      status: 'success'
    });
  };


  const handleFormSubmit = async (formData: PostFormData, shouldPublish?: boolean) => {
    // If shouldPublish is not explicitly passed, this might be an auto-submit - ignore it
    if (shouldPublish === undefined) {
      return;
    }
    
    // Show loading toast
    setToast({
      show: true,
      title: editingPost ? 'Updating Post' : 'Creating Post',
      message: editingPost ? 'Saving your changes...' : 'Publishing your new post...',
      status: 'loading'
    });
    
    // Use thumbnailUrl from form data (extracted by DiscussionForm) or extract from content as fallback
    const thumbnailUrl = formData.thumbnailUrl || extractFirstImageFromContent(formData.content);
    let embeddedChart = formData.embeddedChart;
    
    // If no embedded chart but we found an image in content, create an image chart object
    if (!embeddedChart && thumbnailUrl) {
      embeddedChart = createImageChartObject(thumbnailUrl, formData.title);
    }

    const postData = {
      ...formData,
      embeddedChart, // Use the image as embedded chart if no chart was explicitly attached
      featuredImage: thumbnailUrl || undefined, // Set the extracted/provided image as featured image for blog display
      authorId: user?.id || 'admin_1',
      authorName: formData.authorName || user?.username || 'Admin User', // Use form's authorName or fallback
      preferredAvatar: user?.preferredAvatar, // Include user's preferred avatar
      excerpt: formData.excerpt && formData.excerpt.trim() ? stripHtmlTags(formData.excerpt).substring(0, 150) + (stripHtmlTags(formData.excerpt).length > 150 ? '...' : '') : (formData.content ? stripHtmlTags(formData.content).substring(0, 150) + '...' : 'No description available'),
      isBlogPost: formData.isBlogPost ?? true,
      isPublished: shouldPublish, // Use the shouldPublish flag from button click
      isPinned: formData.isPinned ?? false,
      isLocked: false, // Default to unlocked for new posts
    };
    
    console.log('🔍 Saving post data:', {
      title: postData.title,
      isPublished: postData.isPublished,
      contentLength: postData.content?.length,
      contentPreview: postData.content?.substring(0, 100) + '...'
    });
    

    try {
      if (editingPost) {
        console.log('🔍 Updating thread ID:', editingPost);
        await updateThread(editingPost, postData);
        console.log('✅ Thread updated successfully');
        setEditingPost(null);
        setShowCreateForm(false);
        
        // Show success toast
        setToast({
          show: true,
          title: 'Post Updated',
          message: 'Your changes have been saved successfully.',
          status: 'success'
        });
      } else {
        await createThread(postData);
        console.log('✅ Thread created successfully');
        setShowCreateForm(false);
        
        // Show success toast
        setToast({
          show: true,
          title: 'Post Created',
          message: 'Your new post has been published successfully.',
          status: 'success'
        });
      }
    } catch (error) {
      console.error('❌ Error saving post:', error);
      
      // Show error toast
      setToast({
        show: true,
        title: 'Save Failed',
        message: 'There was an error saving your post. Please try again.',
        status: 'error'
      });
    }
  };

  // Auto-save for admin options when editing
  const handleAdminOptionsSave = async (formData: PostFormData) => {
    console.log('🔍 handleAdminOptionsSave called with formData:', formData);
    console.log('🔍 handleAdminOptionsSave - authorName from formData:', formData.authorName);
    
    if (!editingPost) {
      return; // Only auto-save when editing existing posts
    }
    
    const currentThread = threads.find((t: Thread) => t.id === editingPost);
    if (!currentThread) {
      return;
    }

    // Show quick auto-save toast
    setToast({
      show: true,
      title: 'Auto-saving',
      message: 'Saving changes...',
      status: 'loading'
    });

    // Extract the first image from content to use as thumbnail
    const firstImage = extractFirstImageFromContent(formData.content || currentThread.content);
    let embeddedChart = currentThread.embeddedChart;
    
    // If no embedded chart but we found an image in content, create an image chart object
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
      authorName: formData.authorName || currentThread.authorName, // ✅ Now uses form data first
      preferredAvatar: currentThread.preferredAvatar, // Preserve existing preferred avatar
      embeddedChart, // Use the image as embedded chart if no chart was explicitly attached
      isBlogPost: formData.isBlogPost ?? currentThread.isBlogPost,
      isPublished: formData.isPublished ?? currentThread.isPublished,
      isPinned: formData.isPinned ?? currentThread.isPinned,
      isLocked: currentThread.isLocked ?? false,
    };
    
    console.log('🔍 handleAdminOptionsSave - Final postData authorName:', postData.authorName);

    try {
      console.log('🔍 Auto-save: About to update thread');
      await updateThread(editingPost, postData);
      console.log('🔍 Auto-save: Thread updated successfully');
      
      // Show quick success toast for auto-save
      setToast({
        show: true,
        title: 'Auto-saved',
        message: 'Changes saved automatically.',
        status: 'success'
      });
      
      // Auto-hide after 2 seconds
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 2000);
    } catch (error) {
      console.error('❌ Error auto-saving admin options:', error);
      
      // Show error toast for auto-save failure
      setToast({
        show: true,
        title: 'Auto-save Failed',
        message: 'Could not save changes automatically.',
        status: 'error'
      });
    }
  };

  const handleEdit = (thread: Thread) => {
    setEditingPost(thread.id);
    setShowCreateForm(true);
  };

  const handleDeletePost = (thread: Thread) => {
    setPostToDelete(thread);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
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
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const handleTogglePin = async (thread: Thread) => {
    const updatedData = {
      title: thread.title,
      slug: thread.slug,
      content: thread.content,
      excerpt: thread.excerpt,
      category: thread.category,
      tags: thread.tags,
      authorId: thread.authorId,
      authorName: thread.authorName,
      preferredAvatar: thread.preferredAvatar, // Preserve preferred avatar
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
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPost(null);
  };

  // Multi-select handlers
  const handleSelectPost = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === currentPosts.length) {
      setSelectedPosts(new Set());
      setShowBulkActions(false);
    } else {
      const allPostIds = new Set(currentPosts.map(post => post.id));
      setSelectedPosts(allPostIds);
      setShowBulkActions(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedPosts(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const selectedArray = Array.from(selectedPosts);
      
      // Show loading toast
      setToast({
        show: true,
        title: 'Deleting Posts',
        message: `Deleting ${selectedArray.length} posts...`,
        status: 'loading'
      });

      for (const postId of selectedArray) {
        await deleteThread(postId);
      }
      
      setSelectedPosts(new Set());
      setShowBulkActions(false);
      setShowBulkDeleteConfirm(false);
      
      // Show success toast
      setToast({
        show: true,
        title: 'Posts Deleted',
        message: `Successfully deleted ${selectedArray.length} posts.`,
        status: 'success'
      });
    } catch (error) {
      console.error('Error bulk deleting posts:', error);
      setToast({
        show: true,
        title: 'Delete Failed',
        message: 'Failed to delete some posts. Please try again.',
        status: 'error'
      });
    }
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  const handleBulkPublish = async () => {
    try {
      const selectedArray = Array.from(selectedPosts);
      
      // Show loading toast
      setToast({
        show: true,
        title: 'Publishing Posts',
        message: `Publishing ${selectedArray.length} posts...`,
        status: 'loading'
      });

      for (const postId of selectedArray) {
        const post = threads.find(t => t.id === postId);
        if (post) {
          await updateThread(postId, { ...post, isPublished: true });
        }
      }
      
      setSelectedPosts(new Set());
      setShowBulkActions(false);
      
      // Show success toast
      setToast({
        show: true,
        title: 'Posts Published',
        message: `Successfully published ${selectedArray.length} posts.`,
        status: 'success'
      });
    } catch (error) {
      console.error('Error bulk publishing posts:', error);
      setToast({
        show: true,
        title: 'Publish Failed',
        message: 'Failed to publish some posts. Please try again.',
        status: 'error'
      });
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      const selectedArray = Array.from(selectedPosts);
      
      // Show loading toast
      setToast({
        show: true,
        title: 'Unpublishing Posts',
        message: `Moving ${selectedArray.length} posts to drafts...`,
        status: 'loading'
      });

      for (const postId of selectedArray) {
        const post = threads.find(t => t.id === postId);
        if (post) {
          await updateThread(postId, { ...post, isPublished: false });
        }
      }
      
      setSelectedPosts(new Set());
      setShowBulkActions(false);
      
      // Show success toast
      setToast({
        show: true,
        title: 'Posts Unpublished',
        message: `Successfully moved ${selectedArray.length} posts to drafts.`,
        status: 'success'
      });
    } catch (error) {
      console.error('Error bulk unpublishing posts:', error);
      setToast({
        show: true,
        title: 'Unpublish Failed',
        message: 'Failed to unpublish some posts. Please try again.',
        status: 'error'
      });
    }
  };

  // Function to handle button-triggered submissions
  const handleButtonSubmit = async (shouldPublish: boolean) => {
    console.log('🔍 Button clicked: shouldPublish =', shouldPublish);
    
    // Always extract fresh data from the DOM to ensure we have the latest changes
    const titleInput = document.querySelector('input[name="title"], input[placeholder*="title" i]') as HTMLInputElement;
    const contentElement = document.querySelector('[contenteditable="true"], .rich-text-editor') as HTMLElement;
    const excerptElement = document.querySelector('textarea[name="excerpt"], textarea[placeholder*="excerpt" i]') as HTMLTextAreaElement;
    const categorySelect = document.querySelector('select[name="category"]') as HTMLSelectElement;
    const authorNameInput = document.querySelector('input[name="authorName"], input[placeholder*="author" i]') as HTMLInputElement;
    
    // Get tags from tag elements
    const tagElements = document.querySelectorAll('[data-tag], .tag-item');
    const tags: string[] = Array.from(tagElements).map(el => el.textContent?.trim() || '').filter(Boolean);
    
    // Get checkbox states
    const isBlogPostCheckbox = document.querySelector('input[type="checkbox"][name="isBlogPost"], input[type="checkbox"][id*="blog"]') as HTMLInputElement;
    const isPinnedCheckbox = document.querySelector('input[type="checkbox"][name="isPinned"], input[type="checkbox"][id*="pin"]') as HTMLInputElement;
    
    console.log('🔍 Found form elements:', {
      titleInput: titleInput?.value,
      contentLength: contentElement?.innerHTML?.length,
      excerptLength: excerptElement?.value?.length,
      category: categorySelect?.value,
      authorName: authorNameInput?.value,
      tags,
      isBlogPost: isBlogPostCheckbox?.checked,
      isPinned: isPinnedCheckbox?.checked
    });
    
    if (!titleInput || !contentElement) {
      console.log('❌ Could not find required form elements');
      return;
    }
    
    const extractedFormData: PostFormData = {
      title: titleInput.value || formDataRef.current?.title || '',
      content: contentElement.innerHTML || formDataRef.current?.content || '',
      excerpt: excerptElement?.value || formDataRef.current?.excerpt || '',
      category: categorySelect?.value || formDataRef.current?.category || 'Natal Charts',
      tags: tags.length > 0 ? tags : (formDataRef.current?.tags || []),
      authorName: authorNameInput?.value || formDataRef.current?.authorName || '',
      isBlogPost: isBlogPostCheckbox?.checked ?? formDataRef.current?.isBlogPost ?? true,
      isPinned: isPinnedCheckbox?.checked ?? formDataRef.current?.isPinned ?? false,
    };
    
    console.log('🔍 Extracted form data:', {
      title: extractedFormData.title,
      contentLength: extractedFormData.content.length,
      contentPreview: extractedFormData.content.substring(0, 100) + '...',
      category: extractedFormData.category,
      tags: extractedFormData.tags,
      isBlogPost: extractedFormData.isBlogPost,
      isPinned: extractedFormData.isPinned
    });
    
    // Call the actual submit handler with the extracted form data
    await handleFormSubmit(extractedFormData, shouldPublish);
  };

  const filteredThreads = threads.filter((thread: Thread) => {
    switch (filter) {
      case 'published':
        return thread.isPublished;
      case 'draft':
        return !thread.isPublished;
      case 'blog':
        return thread.isBlogPost;
      case 'forum':
        return !thread.isBlogPost;
      case 'featured':
        return thread.isPinned;
      default:
        return true;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredThreads.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredThreads.slice(indexOfFirstPost, indexOfLastPost);

  // Reset to first page and clear selections when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPosts(new Set());
    setShowBulkActions(false);
  }, [filter]);

  const blogPosts = threads.filter((t: Thread) => t.isBlogPost);
  const forumThreads = threads.filter((t: Thread) => !t.isBlogPost);
  const publishedCount = threads.filter((t: Thread) => t.isPublished).length;
  const featuredCount = threads.filter((t: Thread) => t.isPinned).length;


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-black p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2 font-space-grotesk">Posts & Threads</h2>
            <div className="flex items-center space-x-6 text-sm text-gray-800 font-open-sans">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-[#6bdbff] mr-2"></div>
                {blogPosts.length} Blog Posts
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-[#51bd94] mr-2"></div>
                {forumThreads.length} Forum Threads
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-[#ff91e9] mr-2"></div>
                {publishedCount} Published
              </span>
              {threads.length > 0 && (
                <span className="flex items-center text-xs text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 mr-2"></div>
                  Last activity: {(() => {
                    const mostRecentThread = threads.reduce((latest, current) => 
                      new Date(current.updatedAt || current.createdAt) > new Date(latest.updatedAt || latest.createdAt) ? current : latest
                    );
                    return formatRelativeTime(mostRecentThread.updatedAt || mostRecentThread.createdAt);
                  })()}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCategoryManager(!showCategoryManager)}
              className="bg-[#f2e356] text-black px-4 py-3 font-medium hover:bg-[#e8d650] transition-colors duration-200 font-open-sans border border-black"
              title="Manage Categories"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                </svg>
                <span>Categories</span>
              </div>
            </button>
            
            <button
              onClick={() => setShowUncategorizedManager(!showUncategorizedManager)}
              className="bg-[#51bd94] text-black px-4 py-3 font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black"
              title="Manage Uncategorized Posts"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Organize Posts</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setEditingPost(null);
                setShowCreateForm(true);
              }}
              className="bg-[#6bdbff] text-black px-6 py-3 font-medium hover:bg-[#5ac8ec] transition-colors duration-200 font-open-sans border border-black"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Post</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Manager */}
      {showCategoryManager && (
        <div className="bg-white border border-black p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black font-space-grotesk">Manage Categories</h3>
            <button
              onClick={handleResetCategories}
              className="bg-gray-100 text-black px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200 font-open-sans border border-black"
              title="Reset to default categories"
            >
              Reset to Defaults
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Add New Category */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category..."
                className="flex-1 px-3 py-2 border border-black bg-white text-black placeholder-gray-500 font-open-sans focus:outline-none focus:ring-2 focus:ring-black/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
                className="bg-[#51bd94] text-black px-4 py-2 font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            
            {/* Categories List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 font-open-sans">
                  Current categories ({categories.length})
                  {categoriesFallback && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300">
                      Fallback Mode
                    </span>
                  )}
                  {categoriesLoading && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-300">
                      Loading...
                    </span>
                  )}
                </p>
                {categoriesError && (
                  <button
                    onClick={refreshCategories}
                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-200 transition-colors"
                    title="Retry loading categories"
                  >
                    Retry
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2 bg-gray-50 border border-black p-2">
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        value={editingCategory.value}
                        onChange={(e) => setEditingCategory({id: category.id, value: e.target.value})}
                        className="flex-1 px-2 py-1 border border-black bg-white text-black font-open-sans text-sm focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleEditCategory(category.id, editingCategory.value);
                          }
                          if (e.key === 'Escape') {
                            setEditingCategory(null);
                          }
                        }}
                        onBlur={() => setEditingCategory(null)}
                        autoFocus
                      />
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-black"
                          style={{ backgroundColor: category.color }}
                          title={`Color: ${category.color}`}
                        />
                        <span className="text-sm text-black font-open-sans">
                          {category.name}
                          {category.isDefault && (
                            <span className="ml-1 text-xs text-gray-500">(default)</span>
                          )}
                        </span>
                        {category.usageCount > 0 && (
                          <span className="text-xs text-gray-500">({category.usageCount} uses)</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingCategory({id: category.id, value: category.name})}
                        className="p-1 text-gray-600 hover:text-black hover:bg-white border border-transparent hover:border-black transition-all duration-200"
                        title="Edit category"
                        disabled={categoriesLoading}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      {!category.isDefault && (
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-white border border-transparent hover:border-red-600 transition-all duration-200"
                          title="Delete category"
                          disabled={categoriesLoading}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Uncategorized Posts Manager */}
      {showUncategorizedManager && (
        <UncategorizedPostsManager
          isVisible={showUncategorizedManager}
          onClose={() => setShowUncategorizedManager(false)}
        />
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-[#6bdbff] border border-black p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-black font-space-grotesk">
                {selectedPosts.size} post{selectedPosts.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-sm text-black hover:underline font-open-sans"
              >
                Clear selection
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBulkPublish}
                className="bg-[#51bd94] text-black px-4 py-2 text-sm font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black"
              >
                Publish Selected
              </button>
              <button
                onClick={handleBulkUnpublish}
                className="bg-[#f2e356] text-black px-4 py-2 text-sm font-medium hover:bg-[#e8d650] transition-colors duration-200 font-open-sans border border-black"
              >
                Move to Drafts
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors duration-200 font-open-sans border border-black"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-black p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Posts', count: threads.length },
            { key: 'published', label: 'Published', count: publishedCount },
            { key: 'draft', label: 'Drafts', count: threads.length - publishedCount },
            { key: 'blog', label: 'Blog Posts', count: blogPosts.length },
            { key: 'forum', label: 'Forum Threads', count: forumThreads.length },
            { key: 'featured', label: '⭐ Featured', count: featuredCount },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as 'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured')}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border font-open-sans ${filter === key
                  ? 'bg-[#f2e356] text-black border-black'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-black'
                }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Create/Edit Form - Synapsas Design */}
      {showCreateForm && (
        <section 
          className="px-[2%] py-8" 
          style={{ backgroundColor: '#f0e3ff' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-none mx-auto">
            {/* Header */}
            <div className="bg-white border border-black p-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="font-space-grotesk text-3xl font-bold text-black">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="group relative p-3 border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div 
              className="bg-white border border-black"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DiscussionForm
                initialData={editingPost ? (() => {
                  const thread = threads.find((t: any) => t.id === editingPost);
                  if (!thread) {
                    return {};
                  }
                  
                  const formData = {
                    title: thread.title || '',
                    content: thread.content || '',
                    excerpt: thread.excerpt || '',
                    category: thread.category || 'Natal Charts',
                    tags: Array.isArray(thread.tags) ? thread.tags : [],
                    slug: thread.slug,
                    authorName: thread.authorName || '',
                    isBlogPost: thread.isBlogPost ?? false,
                    isPublished: thread.isPublished ?? false,
                    isPinned: thread.isPinned ?? false,
                    embeddedChart: thread.embeddedChart,
                    embeddedVideo: thread.embeddedVideo
                  };
                  // Store initial data in ref
                  formDataRef.current = formData;
                  return formData;
                })() : (() => {
                  const initialData = {
                    title: '',
                    content: '',
                    excerpt: '',
                    category: 'Natal Charts',
                    tags: [],
                    authorName: user?.username || 'Admin User',
                    isBlogPost: true,
                    isPublished: false,
                    isPinned: false
                  };
                  // Store initial data in ref
                  formDataRef.current = initialData;
                  return initialData;
                })()}
                onSubmit={(formData) => {
                  // Don't call handleFormSubmit for auto-submits from the form
                  // We'll handle intentional submits through the action buttons
                }}
                onCancel={() => {
                  handleCancel();
                }}
                onAdminOptionsChange={(formData) => {
                  console.log('🔍 Form data updated:', {
                    title: formData.title,
                    contentLength: formData.content?.length,
                    contentPreview: formData.content?.substring(0, 100) + '...'
                  });
                  // Store the current form data in ref for button submissions
                  formDataRef.current = formData;
                  handleAdminOptionsSave(formData);
                }}
                isLoading={isLoading}
                submitText={editingPost ? 'Update Post' : 'Create Post'}
                showBlogPostToggle={true}
                showPublishToggle={true}
                showExcerpt={true}
                showPinToggle={true}
                showSubmitButton={false}
                showAuthorField={true}
                mode={editingPost ? 'edit' : 'create'}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-0 mt-6 border border-black overflow-hidden">
              <button
                onClick={() => {
                  handleCancel();
                }}
                className="group relative flex-1 p-4 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">Cancel</span>
              </button>
              <button
                onClick={() => {
                  handleButtonSubmit(false);
                }}
                className="group relative flex-1 p-4 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                <span className="relative">Save Draft</span>
              </button>
              <button
                onClick={() => {
                  handleButtonSubmit(true);
                }}
                className="group relative flex-1 p-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">{editingPost ? 'Update & Publish' : 'Create & Publish'}</span>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Posts List */}
      <div className="bg-white border border-black">
        <div className="p-4 border-b border-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {currentPosts.length > 0 && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPosts.size === currentPosts.length && currentPosts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-black bg-white border-2 border-black rounded focus:ring-black focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 font-open-sans">
                    Select all on page
                  </span>
                </label>
              )}
              <h3 className="text-lg font-semibold text-black font-space-grotesk">
                {filter === 'all' ? 'All Posts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Posts`}
              </h3>
            </div>
            <div className="text-sm text-gray-700 font-open-sans">
              <div>Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredThreads.length)} of {filteredThreads.length} posts</div>
              {threads.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Most recent: {(() => {
                    const mostRecentThread = threads.reduce((latest, current) => 
                      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                    );
                    return formatRelativeTime(mostRecentThread.createdAt);
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-black">
          {isLoading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 animate-pulse border-b border-black last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {/* Title skeleton */}
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        {/* Status badges skeleton */}
                        <div className="flex space-x-2">
                          <div className="h-5 w-12 bg-gray-200 rounded"></div>
                          <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Excerpt skeleton */}
                      <div className="space-y-2 mb-3">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      
                      {/* Meta info skeleton */}
                      <div className="flex items-center space-x-4">
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        <div className="h-3 w-14 bg-gray-200 rounded"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Action buttons skeleton */}
                    <div className="flex gap-0 ml-4">
                      <div className="w-12 h-10 bg-gray-200 border border-gray-300"></div>
                      <div className="w-12 h-10 bg-gray-200 border-l-0 border-r-0 border-t border-b border-gray-300"></div>
                      <div className="w-12 h-10 bg-gray-200 border border-gray-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-open-sans">No posts found matching the current filter.</p>
            </div>
          ) : (
            currentPosts.map((thread: any) => (
              <div key={thread.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Checkbox for individual post selection */}
                    <label className="flex items-center mt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(thread.id)}
                        onChange={() => handleSelectPost(thread.id)}
                        className="w-4 h-4 text-black bg-white border-2 border-black rounded focus:ring-black focus:ring-2"
                      />
                    </label>
                    
                    <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-black font-space-grotesk">{thread.title}</h4>
                      <div className="flex items-center space-x-2">
                        {thread.isPinned && (
                          <span className="px-2 py-1 text-xs font-medium bg-[#ff91e9] text-black border border-black font-open-sans">
                            ⭐ Featured
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium border border-black font-open-sans ${thread.isBlogPost
                            ? 'bg-[#6bdbff] text-black'
                            : 'bg-[#51bd94] text-black'
                          }`}>
                          {thread.isBlogPost ? 'Blog' : 'Forum'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium border border-black font-open-sans ${thread.isPublished
                            ? 'bg-[#51bd94] text-black'
                            : 'bg-[#f2e356] text-black'
                          }`}>
                          {thread.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2 font-open-sans">
                      {stripHtmlTags(thread.excerpt || thread.content || 'No description available').substring(0, 150)}
                      {(thread.excerpt || thread.content) && stripHtmlTags(thread.excerpt || thread.content).length > 150 ? '...' : ''}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 font-open-sans">
                      <span>by {thread.authorName || 'Unknown Author'}</span>
                      <span>•</span>
                      <span>{thread.category}</span>
                      <span>•</span>
                      <span 
                        title={formatDetailedDateTime(thread.createdAt)}
                        className="cursor-help hover:text-gray-800 transition-colors"
                      >
                        {formatRelativeTime(thread.createdAt)}
                      </span>
                      {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
                        <>
                          <span>•</span>
                          <span 
                            title={`Updated: ${formatDetailedDateTime(thread.updatedAt)}`}
                            className="cursor-help hover:text-gray-800 transition-colors text-orange-600"
                          >
                            edited {formatRelativeTime(thread.updatedAt)}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{thread.views} views</span>
                      <span>•</span>
                      <span>{thread.likes} likes</span>
                      {thread.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            {thread.tags.slice(0, 3).map((tag: string, idx: number) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs border border-gray-300">
                                {tag}
                              </span>
                            ))}
                            {thread.tags.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs border border-gray-300">
                                +{thread.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-0 ml-4 border border-black overflow-hidden">
                    {/* Visit/View button */}
                    <a
                      href={`/discussions/${thread.slug || thread.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-4 py-3 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                      title={`View ${thread.isBlogPost ? 'blog post' : 'discussion'}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    {/* Pin button - shows for all blog posts */}
                    {Boolean(thread.isBlogPost) && (
                      <button
                        onClick={() => handleTogglePin(thread)}
                        className={`group relative px-4 py-3 border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden ${
                          Boolean(thread.isPinned)
                            ? 'bg-[#ff91e9] text-black hover:bg-black hover:text-white' 
                            : 'bg-white text-black'
                        }`}
                        title={Boolean(thread.isPinned) ? "Unpin from featured" : "Pin as featured"}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <svg className="relative w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(thread)}
                      className="group relative px-4 py-3 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                      title="Edit"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDeletePost(thread)}
                      className="group relative px-4 py-3 bg-white text-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                      title="Delete"
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                      <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Time Update Info - Always show when posts exist */}
        {filteredThreads.length > 0 && totalPages <= 1 && (
          <div className="px-4 py-2 border-t border-black bg-gray-50">
            <div className="text-xs text-gray-500 text-center font-open-sans">
              Times updated {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit'
              })} • Showing all {filteredThreads.length} posts
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-black bg-white">
            <div className="flex items-center justify-between">
              {/* Page Info */}
              <div className="text-sm text-black font-open-sans">
                <div>Page {currentPage} of {totalPages}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Times updated {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1;

                    if (!showPage) {
                      // Show ellipsis
                      if (pageNumber === 2 && currentPage > 4) {
                        return (
                          <span key={pageNumber} className="px-3 py-2 text-sm text-gray-600 font-open-sans">
                            ...
                          </span>
                        );
                      }
                      if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                        return (
                          <span key={pageNumber} className="px-3 py-2 text-sm text-gray-600 font-open-sans">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors font-open-sans ${currentPage === pageNumber
                            ? 'bg-[#6bdbff] text-black border-black hover:bg-[#5ac8ec]'
                            : 'text-gray-800 bg-white border-black hover:bg-gray-50'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-open-sans"
                >
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Posts per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black font-open-sans">Posts per page:</span>
                <select
                  value={postsPerPage}
                  onChange={() => {
                    setCurrentPage(1);
                    // Note: postsPerPage is read-only in current implementation
                    // You could make it a state variable if you want to allow changing it
                  }}
                  className="text-sm border border-black px-2 py-1 bg-white font-open-sans"
                  disabled
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message={
          postToDelete
            ? `Are you sure you want to delete this ${postToDelete.isBlogPost ? 'blog post' : 'forum thread'}: "${
                postToDelete.title.length > 60
                  ? postToDelete.title.substring(0, 60) + '...'
                  : postToDelete.title
              }"? This action cannot be undone.`
            : 'Are you sure you want to delete this post?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        autoClose={15}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteConfirm}
        title="Delete Multiple Posts"
        message={
          `Are you sure you want to delete ${selectedPosts.size} selected post${selectedPosts.size !== 1 ? 's' : ''}? This action cannot be undone and will permanently remove all selected posts.`
        }
        confirmText={`Delete ${selectedPosts.size} Post${selectedPosts.size !== 1 ? 's' : ''}`}
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
        autoClose={15}
      />

      {/* Status Toast */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.show}
        onHide={() => setToast(prev => ({ ...prev, show: false }))}
        duration={toast.status === 'success' ? 3000 : toast.status === 'error' ? 5000 : 0}
      />
    </div>
  );
}