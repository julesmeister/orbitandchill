/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import ConfirmationModal from '../reusable/ConfirmationModal';
import StatusToast from '../reusable/StatusToast';
import UncategorizedPostsManager from './UncategorizedPostsManager';
import PostsHeader from './posts/PostsHeader';
import CategoryManager from './posts/CategoryManager';
import PostsFilters from './posts/PostsFilters';
import BulkActionsBar from './posts/BulkActionsBar';
import PostFormModal from './posts/PostFormModal';
import PostsList from './posts/PostsList';
import { usePostsManagement } from '@/hooks/usePostsManagement';
import { useBulkOperations } from '@/hooks/useBulkOperations';
import { useUserStore } from '@/store/userStore';
import { formatRelativeTime, formatDetailedDateTime } from '@/utils/dateFormatting';

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
  const { loadThreads } = useAdminStore();
  
  // Refresh function
  const handleRefresh = async () => {
    setToast({
      show: true,
      title: 'Refreshing Posts',
      message: 'Loading latest posts...',
      status: 'loading'
    });
    
    try {
      await loadThreads({ forceRefresh: true });
      setToast({
        show: true,
        title: 'Posts Refreshed',
        message: 'Successfully loaded latest posts',
        status: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        title: 'Refresh Failed',
        message: 'Failed to refresh posts. Please try again.',
        status: 'error'
      });
    }
  };
  const { user } = useUserStore();
  
  // Custom hooks
  const {
    threads,
    showCreateForm,
    editingPost,
    formDataRef,
    postToDelete,
    showDeleteConfirm,
    handleFormSubmit,
    handleAdminOptionsSave,
    handleEdit,
    handleDeletePost,
    confirmDelete,
    cancelDelete,
    handleTogglePin,
    handleCancel,
    handleCreatePost,
    setShowCreateForm
  } = usePostsManagement();

  const {
    selectedPosts,
    showBulkActions,
    showBulkDeleteConfirm,
    handleSelectPost,
    handleSelectAll,
    handleClearSelection,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    handleBulkPublish,
    handleBulkUnpublish,
    clearSelectionsOnFilterChange
  } = useBulkOperations();

  // Local UI state
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [timeUpdateTrigger, setTimeUpdateTrigger] = useState(0);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showUncategorizedManager, setShowUncategorizedManager] = useState(false);
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
    if (threads.length === 0) {
      loadThreads();
    }
  }, []);

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdateTrigger(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handler for filter changes
  const handleFilterChange = (newFilter: 'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured') => {
    setFilter(newFilter);
    setCurrentPage(1);
    clearSelectionsOnFilterChange();
  };

  // Helper functions for button-triggered submissions
  const handleButtonSubmit = async (shouldPublish: boolean) => {
    // Extract fresh data from DOM and call the hook's handleFormSubmit
    await handleFormSubmit(formDataRef.current || {} as PostFormData, shouldPublish, setToast);
  };

  // Handle toast state changes
  const handleToastChange = (newToast: typeof toast) => {
    setToast(newToast);
  };

  // Filter and pagination logic
  const filteredThreads = threads
    .filter((thread: Thread) => {
      switch (filter) {
        case 'published': return thread.isPublished;
        case 'draft': return !thread.isPublished;
        case 'blog': return thread.isBlogPost;
        case 'forum': return !thread.isBlogPost;
        case 'featured': return thread.isPinned;
        default: return true;
      }
    })
    .sort((a: Thread, b: Thread) => {
      // Sort by updated date first (if exists), then created date, both descending (newest first)
      const aDate = new Date(a.updatedAt || a.createdAt);
      const bDate = new Date(b.updatedAt || b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

  const totalPages = Math.ceil(filteredThreads.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredThreads.slice(indexOfFirstPost, indexOfLastPost);


  return (
    <div className="space-y-4">
      {/* Header */}
      <PostsHeader
        threads={threads}
        onCategoryManagerToggle={() => setShowCategoryManager(!showCategoryManager)}
        onUncategorizedManagerToggle={() => setShowUncategorizedManager(!showUncategorizedManager)}
        onCreatePost={handleCreatePost}
        onRefresh={handleRefresh}
      />

      {/* Category Manager */}
      <CategoryManager
        isVisible={showCategoryManager}
        onToast={handleToastChange}
      />

      {/* Uncategorized Posts Manager */}
      {showUncategorizedManager && (
        <UncategorizedPostsManager
          isVisible={showUncategorizedManager}
          onClose={() => setShowUncategorizedManager(false)}
        />
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <BulkActionsBar
          selectedCount={selectedPosts.size}
          onClearSelection={handleClearSelection}
          onBulkPublish={() => handleBulkPublish(setToast)}
          onBulkUnpublish={() => handleBulkUnpublish(setToast)}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {/* Filters */}
      <PostsFilters
        threads={threads}
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />

      {/* Create/Edit Form Modal */}
      <PostFormModal
        isVisible={showCreateForm}
        isLoading={isLoading}
        editingPost={editingPost}
        threads={threads}
        formDataRef={formDataRef}
        onCancel={handleCancel}
        onAdminOptionsChange={handleAdminOptionsSave}
        onButtonSubmit={handleButtonSubmit}
        user={user}
      />

      {/* Posts List */}
      <PostsList
        filteredThreads={filteredThreads}
        currentPosts={currentPosts}
        threads={threads}
        currentPage={currentPage}
        totalPages={totalPages}
        postsPerPage={postsPerPage}
        indexOfFirstPost={indexOfFirstPost}
        indexOfLastPost={indexOfLastPost}
        filter={filter}
        isLoading={isLoading}
        selectedPosts={selectedPosts}
        onSelectAll={handleSelectAll}
        onSelectPost={handleSelectPost}
        onEdit={handleEdit}
        onDelete={handleDeletePost}
        onTogglePin={handleTogglePin}
        onPageChange={setCurrentPage}
      />

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