/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from 'react';
import DiscussionForm from '../../forms/DiscussionForm';
import { User } from '@/types/user';

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

interface PostFormModalProps {
  isVisible: boolean;
  isLoading: boolean;
  editingPost: string | null;
  threads: Thread[];
  formDataRef: React.MutableRefObject<PostFormData | null>;
  onCancel: () => void;
  onAdminOptionsChange: (formData: PostFormData) => void;
  onButtonSubmit: (shouldPublish: boolean) => Promise<void>;
  user?: User | null;
}

export default function PostFormModal({
  isVisible,
  isLoading,
  editingPost,
  threads,
  formDataRef,
  onCancel,
  onAdminOptionsChange,
  onButtonSubmit,
  user
}: PostFormModalProps) {
  if (!isVisible) return null;

  return (
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
              onClick={onCancel}
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
          onClick={(e) => e.stopPropagation()}
        >
          <DiscussionForm
            initialData={editingPost ? (() => {
              const thread = threads.find((t: any) => t.id === editingPost);
              if (!thread) {
                return {};
              }
              
              console.log('🔍 PostFormModal - Constructing initialData from thread:', {
                threadId: thread.id,
                threadCategory: thread.category,
                title: thread.title
              });
              
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
              formDataRef.current = initialData;
              return initialData;
            })()}
            onSubmit={() => {
              // Don't call handleFormSubmit for auto-submits from the form
              // We'll handle intentional submits through the action buttons
            }}
            onCancel={onCancel}
            onAdminOptionsChange={(formData) => {
              console.log('🔍 Form data updated:', {
                title: formData.title,
                tags: formData.tags,
                tagsArray: JSON.stringify(formData.tags),
                contentLength: formData.content?.length,
                contentPreview: formData.content?.substring(0, 100) + '...'
              });
              formDataRef.current = formData;
              onAdminOptionsChange(formData);
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
            onClick={onCancel}
            className="group relative flex-1 p-4 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">Cancel</span>
          </button>
          <button
            onClick={() => onButtonSubmit(false)}
            className="group relative flex-1 p-4 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-yellow-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
            <span className="relative">Save Draft</span>
          </button>
          <button
            onClick={() => onButtonSubmit(true)}
            className="group relative flex-1 p-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 overflow-hidden font-space-grotesk font-semibold"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">{editingPost ? 'Update & Publish' : 'Create & Publish'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}