/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

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

interface BulkActionsBarProps {
  selectedCount: number;
  selectedPosts: Set<string>;
  threads: Thread[];
  onClearSelection: () => void;
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onBulkFeature: () => void;
  onBulkUnfeature: () => void;
  onBulkDelete: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  selectedPosts,
  threads,
  onClearSelection,
  onBulkPublish,
  onBulkUnpublish,
  onBulkFeature,
  onBulkUnfeature,
  onBulkDelete
}: BulkActionsBarProps) {
  // Determine feature status of selected posts
  const selectedThreads = threads.filter(thread => selectedPosts.has(thread.id));
  const featuredCount = selectedThreads.filter(thread => thread.isPinned).length;
  const unfeaturedCount = selectedThreads.filter(thread => !thread.isPinned).length;
  
  // Show "Feature Selected" if there are any unfeatured posts
  // Show "Unfeature Selected" if there are any featured posts
  const showFeatureButton = unfeaturedCount > 0;
  const showUnfeatureButton = featuredCount > 0;

  return (
    <div className="bg-[#6bdbff] border border-black p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-black font-space-grotesk">
            {selectedCount} post{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-black hover:underline font-open-sans"
          >
            Clear selection
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onBulkPublish}
            className="bg-[#51bd94] text-black px-4 py-2 text-sm font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black"
          >
            Publish Selected
          </button>
          <button
            onClick={onBulkUnpublish}
            className="bg-[#f2e356] text-black px-4 py-2 text-sm font-medium hover:bg-[#e8d650] transition-colors duration-200 font-open-sans border border-black"
          >
            Move to Drafts
          </button>
          {showFeatureButton && (
            <button
              onClick={onBulkFeature}
              className="bg-[#a855f7] text-white px-4 py-2 text-sm font-medium hover:bg-[#9333ea] transition-colors duration-200 font-open-sans border border-black"
            >
              Feature Selected
            </button>
          )}
          {showUnfeatureButton && (
            <button
              onClick={onBulkUnfeature}
              className="bg-[#64748b] text-white px-4 py-2 text-sm font-medium hover:bg-[#475569] transition-colors duration-200 font-open-sans border border-black"
            >
              Unfeature Selected
            </button>
          )}
          <button
            onClick={onBulkDelete}
            className="bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors duration-200 font-open-sans border border-black"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}