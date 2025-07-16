/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useCategories } from '@/hooks/useCategories';
import StatusToast from '../reusable/StatusToast';

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

interface UncategorizedPostsManagerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function UncategorizedPostsManager({ isVisible, onClose }: UncategorizedPostsManagerProps) {
  const { threads, updateThread } = useAdminStore();
  const { categories } = useCategories();
  const [draggedPost, setDraggedPost] = useState<Thread | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
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

  // Get database category names
  const dbCategoryNames = categories.map(cat => cat.name);

  // Find posts with categories not in database
  const uncategorizedPosts = threads.filter((thread: Thread) => 
    !dbCategoryNames.includes(thread.category) && thread.category !== 'All Categories'
  );

  // Group uncategorized posts by their current category
  const groupedPosts = uncategorizedPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, Thread[]>);

  const handleDragStart = (e: React.DragEvent, post: Thread) => {
    setDraggedPost(post);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', post.id);
  };

  const handleDragEnd = () => {
    setDraggedPost(null);
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, categoryName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(categoryName);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    
    if (!draggedPost) return;

    // Show loading toast
    setToast({
      show: true,
      title: 'Moving Post',
      message: `Moving "${draggedPost.title}" to "${targetCategory}"...`,
      status: 'loading'
    });

    try {
      // Update the post's category (one category per post)
      const updatedData = {
        title: draggedPost.title,
        slug: draggedPost.slug,
        content: draggedPost.content,
        excerpt: draggedPost.excerpt,
        category: targetCategory, // Replace with new category (one category only)
        tags: draggedPost.tags,
        authorId: draggedPost.authorId,
        authorName: draggedPost.authorName,
        preferredAvatar: draggedPost.preferredAvatar,
        isBlogPost: draggedPost.isBlogPost,
        isPublished: draggedPost.isPublished,
        isPinned: draggedPost.isPinned,
        isLocked: draggedPost.isLocked ?? false
      };

      await updateThread(draggedPost.id, updatedData);
      
      // Show success toast
      setToast({
        show: true,
        title: 'Post Moved Successfully',
        message: `"${draggedPost.title}" has been moved to "${targetCategory}" category.`,
        status: 'success'
      });
      
    } catch (error) {
      console.error('Error updating post category:', error);
      
      // Show error toast
      setToast({
        show: true,
        title: 'Move Failed',
        message: `Failed to move post to "${targetCategory}". Please try again.`,
        status: 'error'
      });
    }

    setDraggedPost(null);
    setDropTarget(null);
  };

  if (!isVisible || uncategorizedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-black p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-black font-space-grotesk">
            Uncategorized Posts Manager
          </h3>
          <p className="text-sm text-gray-600 font-open-sans">
            {uncategorizedPosts.length} posts with categories not found in database. 
            Drag them to proper categories below. <strong>Each post can only have one category.</strong>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 border border-transparent hover:border-black transition-all duration-200"
          title="Close manager"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Uncategorized Posts */}
        <div className="space-y-3">
          <h4 className="font-medium text-black font-space-grotesk">Posts to Categorize</h4>
          <div className="space-y-2">
            {Object.entries(groupedPosts).map(([categoryName, posts]) => (
              <div key={categoryName} className="border border-gray-300 p-3 bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-2 font-open-sans">
                  Current category: "{categoryName}" ({posts.length} posts)
                </div>
                <div className="space-y-1">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, post)}
                      onDragEnd={handleDragEnd}
                      className={`p-2 bg-white border border-gray-200 cursor-move hover:border-blue-400 transition-colors ${
                        draggedPost?.id === post.id ? 'opacity-50' : ''
                      }`}
                      title="Drag to move to a proper category (replaces current category)"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-black font-space-grotesk">
                            {post.title}
                          </div>
                          <div className="text-xs text-gray-600 font-open-sans">
                            {post.isBlogPost ? 'Blog' : 'Forum'} • {post.isPublished ? 'Published' : 'Draft'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Database Categories */}
        <div className="space-y-3">
          <h4 className="font-medium text-black font-space-grotesk">Database Categories</h4>
          <div className="space-y-2">
            {categories.filter(cat => cat.name !== 'All Categories').map((category) => (
              <div
                key={category.id}
                onDragOver={(e) => handleDragOver(e, category.name)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, category.name)}
                className={`p-3 border-2 border-dashed transition-all duration-200 ${
                  dropTarget === category.name
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-black"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-black font-space-grotesk">
                      {category.name}
                    </div>
                    {category.description && (
                      <div className="text-xs text-gray-600 font-open-sans">
                        {category.description}
                      </div>
                    )}
                  </div>
                  {category.usageCount > 0 && (
                    <div className="text-xs text-gray-500 font-open-sans">
                      {category.usageCount} posts
                    </div>
                  )}
                </div>
                {dropTarget === category.name && (
                  <div className="mt-2 text-sm text-blue-600 font-open-sans">
                    Drop here to move to "{category.name}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {uncategorizedPosts.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="font-open-sans">All posts are properly categorized!</p>
        </div>
      )}

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