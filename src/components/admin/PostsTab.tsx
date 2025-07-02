/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import DiscussionForm from '../forms/DiscussionForm';
import ConfirmationModal from '../reusable/ConfirmationModal';
import { stripHtmlTags } from '@/utils/textUtils';
import { extractFirstImageFromContent, createImageChartObject } from '@/utils/extractImageFromContent';

// Thread interface from adminStore
interface Thread {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
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
  isBlogPost?: boolean;
  isPublished?: boolean;
  isPinned?: boolean;
  embeddedChart?: any;
  embeddedVideo?: any;
}

export default function PostsTab({ isLoading }: PostsTabProps) {
  const { threads, loadThreads, createThread, updateThread, deleteThread } = useAdminStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'blog' | 'forum' | 'featured'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [postToDelete, setPostToDelete] = useState<Thread | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const handleFormSubmit = async (formData: PostFormData) => {
    // Extract the first image from content to use as thumbnail
    const firstImage = extractFirstImageFromContent(formData.content);
    let embeddedChart = formData.embeddedChart;
    
    // If no embedded chart but we found an image in content, create an image chart object
    if (!embeddedChart && firstImage) {
      embeddedChart = createImageChartObject(firstImage, formData.title);
    }

    const postData = {
      ...formData,
      embeddedChart, // Use the image as embedded chart if no chart was explicitly attached
      authorId: 'admin_1',
      authorName: 'Admin User',
      excerpt: formData.excerpt || stripHtmlTags(formData.content).substring(0, 150) + '...',
      isBlogPost: formData.isBlogPost ?? true,
      isPublished: formData.isPublished ?? false,
      isPinned: formData.isPinned ?? false,
      isLocked: false, // Default to unlocked for new posts
    };

    try {
      if (editingPost) {
        await updateThread(editingPost, postData);
        setEditingPost(null);
      } else {
        await createThread(postData);
      }

      setShowCreateForm(false);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

  // Auto-save for admin options when editing
  const handleAdminOptionsSave = async (formData: PostFormData) => {
    if (!editingPost) {
      return; // Only auto-save when editing existing posts
    }
    
    const currentThread = threads.find((t: Thread) => t.id === editingPost);
    if (!currentThread) {
      return;
    }

    // Extract the first image from content to use as thumbnail
    const firstImage = extractFirstImageFromContent(currentThread.content);
    let embeddedChart = currentThread.embeddedChart;
    
    // If no embedded chart but we found an image in content, create an image chart object
    if (!embeddedChart && firstImage) {
      embeddedChart = createImageChartObject(firstImage, currentThread.title);
    }

    const postData = {
      title: currentThread.title,
      content: currentThread.content,
      excerpt: currentThread.excerpt,
      category: currentThread.category,
      tags: currentThread.tags,
      embeddedChart, // Use the image as embedded chart if no chart was explicitly attached
      isBlogPost: formData.isBlogPost ?? currentThread.isBlogPost,
      isPublished: formData.isPublished ?? currentThread.isPublished,
      isPinned: formData.isPinned ?? currentThread.isPinned,
      isLocked: currentThread.isLocked ?? false,
    };

    try {
      await updateThread(editingPost, postData);
    } catch (error) {
      console.error('Error auto-saving admin options:', error);
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
      content: thread.content,
      excerpt: thread.excerpt,
      category: thread.category,
      tags: thread.tags,
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

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const blogPosts = threads.filter((t: Thread) => t.isBlogPost);
  const forumThreads = threads.filter((t: Thread) => !t.isBlogPost);
  const publishedCount = threads.filter((t: Thread) => t.isPublished).length;
  const featuredCount = threads.filter((t: Thread) => t.isPinned).length;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-black p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2 font-space-grotesk">Posts & Threads</h2>
            <div className="flex items-center space-x-6 text-sm text-gray-800 font-inter">
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
            </div>
          </div>

          <button
            onClick={() => {
              setEditingPost(null);
              setShowCreateForm(true);
            }}
            className="bg-[#6bdbff] text-black px-6 py-3 font-medium hover:bg-[#5ac8ec] transition-colors duration-200 font-inter border border-black"
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
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border font-inter ${filter === key
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
        <section className="px-[2%] py-8" style={{ backgroundColor: '#f0e3ff' }}>
          <div className="max-w-none mx-auto">
            {/* Header */}
            <div className="bg-white border border-black p-6 mb-6">
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
            <div className="bg-white border border-black">
              <DiscussionForm
                initialData={editingPost ? (() => {
                  const thread = threads.find((t: any) => t.id === editingPost);
                  if (!thread) return {};
                  
                  return {
                    title: thread.title || '',
                    content: thread.content || '',
                    excerpt: thread.excerpt || '',
                    category: thread.category || 'Natal Charts',
                    tags: Array.isArray(thread.tags) ? thread.tags : [],
                    isBlogPost: thread.isBlogPost ?? false,
                    isPublished: thread.isPublished ?? false,
                    isPinned: thread.isPinned ?? false,
                    embeddedChart: thread.embeddedChart,
                    embeddedVideo: thread.embeddedVideo
                  };
                })() : {
                  title: '',
                  content: '',
                  excerpt: '',
                  category: 'Natal Charts',
                  tags: [],
                  isBlogPost: true,
                  isPublished: false,
                  isPinned: false
                }}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                onAdminOptionsChange={handleAdminOptionsSave}
                isLoading={isLoading}
                submitText={editingPost ? 'Update Post' : 'Create Post'}
                showBlogPostToggle={true}
                showPublishToggle={true}
                showExcerpt={true}
                showPinToggle={true}
                mode={editingPost ? 'edit' : 'create'}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-0 mt-6 border border-black overflow-hidden">
              <button
                onClick={handleCancel}
                className="group relative flex-1 p-4 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">Cancel</span>
              </button>
              <button
                onClick={() => {
                  // Handle save as draft - preserve current form state
                  const currentThread = threads.find((t: any) => t.id === editingPost);
                  const draftData = {
                    title: currentThread?.title || '',
                    content: currentThread?.content || '',
                    excerpt: currentThread?.excerpt || '',
                    category: currentThread?.category || 'Natal Charts',
                    tags: currentThread?.tags || [],
                    isBlogPost: currentThread?.isBlogPost ?? true,
                    isPinned: currentThread?.isPinned ?? false,
                    isLocked: currentThread?.isLocked ?? false,
                    isPublished: false
                  };
                  handleFormSubmit(draftData);
                }}
                className="group relative flex-1 p-4 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                <span className="relative">Save Draft</span>
              </button>
              <button
                onClick={() => {
                  // Handle publish - preserve current form state
                  const currentThread = threads.find((t: any) => t.id === editingPost);
                  const publishData = {
                    title: currentThread?.title || '',
                    content: currentThread?.content || '',
                    excerpt: currentThread?.excerpt || '',
                    category: currentThread?.category || 'Natal Charts',
                    tags: currentThread?.tags || [],
                    isBlogPost: currentThread?.isBlogPost ?? true,
                    isPinned: currentThread?.isPinned ?? false,
                    isLocked: currentThread?.isLocked ?? false,
                    isPublished: true
                  };
                  handleFormSubmit(publishData);
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
        <div className="p-6 border-b border-black">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black font-space-grotesk">
              {filter === 'all' ? 'All Posts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Posts`}
            </h3>
            <div className="text-sm text-gray-700 font-inter">
              Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredThreads.length)} of {filteredThreads.length} posts
            </div>
          </div>
        </div>

        <div className="divide-y divide-black">
          {isLoading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6 animate-pulse border-b border-black last:border-b-0">
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
              <p className="font-inter">No posts found matching the current filter.</p>
            </div>
          ) : (
            currentPosts.map((thread: any) => (
              <div key={thread.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-black font-space-grotesk">{thread.title}</h4>
                      <div className="flex items-center space-x-2">
                        {thread.isPinned && (
                          <span className="px-2 py-1 text-xs font-medium bg-[#ff91e9] text-black border border-black font-inter">
                            ⭐ Featured
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium border border-black font-inter ${thread.isBlogPost
                            ? 'bg-[#6bdbff] text-black'
                            : 'bg-[#51bd94] text-black'
                          }`}>
                          {thread.isBlogPost ? 'Blog' : 'Forum'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium border border-black font-inter ${thread.isPublished
                            ? 'bg-[#51bd94] text-black'
                            : 'bg-[#f2e356] text-black'
                          }`}>
                          {thread.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2 font-inter">{stripHtmlTags(thread.excerpt)}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 font-inter">
                      <span>by {thread.authorName || 'Unknown Author'}</span>
                      <span>•</span>
                      <span>{thread.category}</span>
                      <span>•</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{thread.views} views</span>
                      <span>•</span>
                      <span>{thread.likes} likes</span>
                      {thread.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-1">
                            {thread.tags.slice(0, 3).map((tag: string, idx: number) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs border border-gray-300">
                                {tag}
                              </span>
                            ))}
                            {thread.tags.length > 3 && (
                              <span className="text-gray-500">+{thread.tags.length - 3}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-0 ml-4 border border-black overflow-hidden">
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
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-black bg-white">
            <div className="flex items-center justify-between">
              {/* Page Info */}
              <div className="text-sm text-black font-inter">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
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
                          <span key={pageNumber} className="px-3 py-2 text-sm text-gray-600 font-inter">
                            ...
                          </span>
                        );
                      }
                      if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                        return (
                          <span key={pageNumber} className="px-3 py-2 text-sm text-gray-600 font-inter">
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
                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors font-inter ${currentPage === pageNumber
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
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
                >
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Posts per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black font-inter">Posts per page:</span>
                <select
                  value={postsPerPage}
                  onChange={() => {
                    setCurrentPage(1);
                    // Note: postsPerPage is read-only in current implementation
                    // You could make it a state variable if you want to allow changing it
                  }}
                  className="text-sm border border-black px-2 py-1 bg-white font-inter"
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
    </div>
  );
}