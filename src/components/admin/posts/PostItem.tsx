/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { stripHtmlTags } from '@/utils/textUtils';
import { formatRelativeTime, formatDetailedDateTime } from '@/utils/dateFormatting';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import MetaSeparator from './MetaSeparator';

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

interface PostItemProps {
  thread: Thread;
  isSelected: boolean;
  onSelect: (threadId: string) => void;
  onEdit: (thread: Thread) => void;
  onDelete: (thread: Thread) => void;
  onTogglePin: (thread: Thread) => void;
}

export default function PostItem({
  thread,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onTogglePin
}: PostItemProps) {
  return (
    <div className="p-3 md:p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-3 xl:gap-4">
        <div className="flex items-start space-x-3 md:space-x-4 flex-1">
          {/* Checkbox for individual post selection */}
          <label className="flex items-center mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(thread.id)}
              className="w-4 h-4 text-black bg-white border-2 border-black rounded focus:ring-black focus:ring-2"
            />
          </label>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-2 gap-2 lg:gap-0">
              <h4 className="text-lg md:text-xl lg:text-lg font-medium text-black font-space-grotesk lg:truncate lg:flex-1 lg:min-w-0">{thread.title}</h4>
              <div className="flex items-center flex-wrap gap-2 lg:flex-shrink-0">
                {thread.isPinned && (
                  <StatusBadge type="featured">⭐ Featured</StatusBadge>
                )}
                <StatusBadge type={thread.isBlogPost ? 'blog' : 'forum'}>
                  {thread.isBlogPost ? 'Blog' : 'Forum'}
                </StatusBadge>
                <StatusBadge type={thread.isPublished ? 'published' : 'draft'}>
                  {thread.isPublished ? 'Published' : 'Draft'}
                </StatusBadge>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2 font-open-sans">
              {stripHtmlTags(thread.excerpt || thread.content || 'No description available').substring(0, 150)}
              {(thread.excerpt || thread.content) && stripHtmlTags(thread.excerpt || thread.content).length > 150 ? '...' : ''}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 font-open-sans">
              <span>by {thread.authorName || 'Unknown Author'}</span>
              <MetaSeparator />
              <span>{thread.category}</span>
              <MetaSeparator />
              <span 
                title={formatDetailedDateTime(thread.createdAt)}
                className="cursor-help hover:text-gray-800 transition-colors"
              >
                {formatRelativeTime(thread.createdAt)}
              </span>
              {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
                <>
                  <MetaSeparator />
                  <span 
                    title={`Updated: ${formatDetailedDateTime(thread.updatedAt)}`}
                    className="cursor-help hover:text-gray-800 transition-colors text-orange-600"
                  >
                    edited {formatRelativeTime(thread.updatedAt)}
                  </span>
                </>
              )}
              <MetaSeparator />
              <span>{thread.views} views</span>
              <MetaSeparator />
              <span>{thread.likes} likes</span>
              {thread.tags.length > 0 && (
                <>
                  <MetaSeparator />
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
        </div>

        {/* Action Buttons */}
        <div className="flex gap-0 xl:ml-4 border border-black overflow-hidden self-start xl:self-auto">
          <ActionButton
            href={`/discussions/${thread.slug || thread.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
            title={`View ${thread.isBlogPost ? 'blog post' : 'discussion'}`}
            variant="view"
            label="View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </ActionButton>

          {Boolean(thread.isBlogPost) && (
            <ActionButton
              onClick={() => onTogglePin(thread)}
              title={Boolean(thread.isPinned) ? "Unpin from featured" : "Pin as featured"}
              variant="pin"
              isActive={Boolean(thread.isPinned)}
              label={Boolean(thread.isPinned) ? "Unpin" : "Pin"}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </ActionButton>
          )}

          <ActionButton
            onClick={() => onEdit(thread)}
            title="Edit"
            variant="edit"
            label="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </ActionButton>

          <ActionButton
            onClick={() => onDelete(thread)}
            title="Delete"
            variant="delete"
            className="border-r-0"
            label="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}