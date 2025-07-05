/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import Image from "next/image";
import VoteButtons from '@/components/reusable/VoteButtons';
import { createCleanExcerpt } from '@/utils/textUtils';

interface Discussion {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string | null;
  author?: string;
  avatar?: string;
  category: string;
  tags: string[];
  replies: number;
  views: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  isLocked: boolean;
  isPinned: boolean;
  isBlogPost: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  embeddedChart?: any; // For image thumbnails extracted from content
}

interface DiscussionCardProps {
  discussion: Discussion;
  onVoteSuccess?: (discussionId: string, newUpvotes: number, newDownvotes: number) => void;
}

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

// All categories use consistent black styling per Synapsas guidelines
const getCategoryColor = () => '#19181a'; // Synapsas black

export default function DiscussionCard({ discussion, onVoteSuccess }: DiscussionCardProps) {
  // Check if we have a thumbnail image from extracted content
  const thumbnailImage = discussion.embeddedChart?.chartType === 'image' ? discussion.embeddedChart.imageUrl : null;

  return (
    <div className="relative p-4 md:p-6 hover:bg-gray-50 transition-all duration-300 group">
      {/* Category indicator */}
      <div className="absolute left-0 top-4 md:top-6 w-1 h-6 md:h-8 bg-black" />
      
      <div className="pl-4 md:pl-6">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Thumbnail image for mobile */}
          {thumbnailImage && (
            <div className="mb-3">
              <Link href={`/discussions/${discussion.slug}`}>
                <Image 
                  src={thumbnailImage} 
                  alt={discussion.title}
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover border border-black hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Link>
            </div>
          )}
          
          {/* Title and badges */}
          <div className="flex items-start gap-2 mb-3">
            {Boolean(discussion.isPinned) && (
              <svg className="w-3 h-3 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8H5.5a1 1 0 00-.8 1.6l6.5 8.67 6.5-8.67A1 1 0 0016.5 12H16z"/>
              </svg>
            )}
            {Boolean(discussion.isLocked) && (
              <svg className="w-3 h-3 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            )}
            <Link href={`/discussions/${discussion.slug}`} className="flex-1">
              <h3 className="font-space-grotesk text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors leading-tight">
                {discussion.title}
              </h3>
            </Link>
          </div>

          {/* Excerpt - Shorter on mobile */}
          <p className="text-black/80 mb-3 leading-relaxed text-sm">
            {createCleanExcerpt(discussion.excerpt || discussion.content, 80)}
          </p>

          {/* Author and Category row - spaced apart */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-xs text-black/70">{discussion.author}</span>
            <span className="px-1.5 py-0.5 text-xs font-medium text-black border border-black bg-white">
              {discussion.category.split(' ')[0]}
            </span>
          </div>

          {/* Stats and time row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-black/60">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{formatCompactNumber(discussion.replies)}</span>
              </div>
              <span className="text-black/50">{formatTimeAgo(discussion.lastActivity)}</span>
            </div>
            
            {/* Mobile vote buttons - horizontal */}
            <VoteButtons
              id={discussion.id}
              upvotes={discussion.upvotes}
              downvotes={discussion.downvotes}
              userVote={discussion.userVote}
              type="discussion"
              useHook={true}
              layout="horizontal"
              showCount={true}
              size="sm"
              onVoteSuccess={(newUpvotes, newDownvotes) => {
                onVoteSuccess?.(discussion.id, newUpvotes, newDownvotes);
              }}
            />
          </div>

          {/* Tags - Only show on tablet and up */}
          <div className="hidden md:flex flex-wrap gap-1 mt-3">
            {discussion.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-black text-white text-xs font-medium border border-black"
              >
                #{tag}
              </span>
            ))}
            {discussion.tags.length > 2 && (
              <span className="px-2 py-1 bg-white text-black text-xs font-medium border border-black">
                +{discussion.tags.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Layout - Hidden on mobile/tablet */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {/* Thumbnail image for desktop */}
              {thumbnailImage && (
                <div className="float-right ml-4 mb-2">
                  <Link href={`/discussions/${discussion.slug}`}>
                    <Image 
                      src={thumbnailImage} 
                      alt={discussion.title}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover border border-black hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                {Boolean(discussion.isPinned) && (
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8H5.5a1 1 0 00-.8 1.6l6.5 8.67 6.5-8.67A1 1 0 0016.5 12H16z"/>
                  </svg>
                )}
                {Boolean(discussion.isLocked) && (
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                  </svg>
                )}
                <Link href={`/discussions/${discussion.slug}`}>
                  <h3 className="font-space-grotesk text-lg font-bold text-black hover:text-gray-700 transition-colors">
                    {discussion.title}
                  </h3>
                </Link>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-sm text-black/70 mb-3">
                <span className="font-medium">{discussion.author}</span>
                <span>•</span>
                <span className="px-2 py-1 text-xs font-medium text-black border border-black bg-white">
                  {discussion.category}
                </span>
                <span>•</span>
                <span>{formatTimeAgo(discussion.lastActivity)}</span>
              </div>

              {/* Excerpt */}
              <p className="text-black/80 mb-4 leading-relaxed">
                {createCleanExcerpt(discussion.excerpt || discussion.content, 150)}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {discussion.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
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
              </div>
            </div>

            {/* Desktop Quick Actions */}
            <div className="ml-4">
              <VoteButtons
                id={discussion.id}
                upvotes={discussion.upvotes}
                downvotes={discussion.downvotes}
                userVote={discussion.userVote}
                type="discussion"
                useHook={true}
                layout="vertical"
                showCount={true}
                size="md"
                onVoteSuccess={(newUpvotes, newDownvotes) => {
                  onVoteSuccess?.(discussion.id, newUpvotes, newDownvotes);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}