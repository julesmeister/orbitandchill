/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from 'next/link';
import { Discussion } from '@/types/discussion';
import { formatTimeAgo, getCategoryColor } from '@/utils/discussionsUtils';

interface DiscussionCardSimpleProps {
  discussion: Discussion;
  className?: string;
}

/**
 * Simple Discussion Card Component
 * Reusable card component for displaying discussion previews
 */
export default function DiscussionCardSimple({ 
  discussion, 
  className = "" 
}: DiscussionCardSimpleProps) {
  return (
    <div className={`relative p-6 hover:bg-gray-50 transition-all duration-300 group ${className}`}>
      {/* Category color indicator */}
      <div 
        className="absolute left-0 top-6 w-1 h-8"
        style={{ backgroundColor: getCategoryColor(discussion.category) }}
      />
      
      <div className="pl-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {discussion.isPinned && (
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8H5.5a1 1 0 00-.8 1.6l6.5 8.67 6.5-8.67A1 1 0 0016.5 12H16z"/>
                </svg>
              )}
              {discussion.isLocked && (
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                </svg>
              )}
              <Link href={`/discussions/${discussion.id}`}>
                <h3 className="font-space-grotesk text-lg font-bold text-black hover:text-gray-700 transition-colors">
                  {discussion.title}
                </h3>
              </Link>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-sm text-black/70 mb-3">
              <span className="font-medium">{discussion.author}</span>
              <span>•</span>
              <span 
                className="px-2 py-1 text-xs font-medium text-black border border-black"
                style={{ backgroundColor: getCategoryColor(discussion.category) }}
              >
                {discussion.category}
              </span>
              <span>•</span>
              <span>{formatTimeAgo(discussion.lastActivity)}</span>
            </div>

            {/* Excerpt */}
            <p className="text-black/80 mb-4 leading-relaxed">
              {discussion.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {discussion.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-black text-white text-xs font-medium border border-black"
                >
                  #{tag}
                </span>
              ))}
              {discussion.tags.length > 3 && (
                <span className="px-2 py-1 bg-white text-black text-xs font-medium border border-black">
                  +{discussion.tags.length - 3}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-black/60">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{discussion.replies} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{discussion.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>{discussion.upvotes} votes</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <button className="p-2 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button className="p-2 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}