/* eslint-disable @typescript-eslint/no-unused-vars */

import { formatTimestamp, generateAvatarFromName } from '@/utils/timestampFormatting';
import { organizeReplies, getReplyStats } from '@/utils/replyThreading';

export interface RawReply {
  id: string;
  authorName?: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date | string | number;
  upvotes?: number;
  downvotes?: number;
  parentReplyId?: string;
  [key: string]: any;
}

export interface EnhancedReply {
  id: string;
  author: string;
  avatar: string;
  profilePictureUrl: string | null;
  preferredAvatar: string | null;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote: null | 'up' | 'down';
  parentId?: string;
  replyToAuthor?: string;
  children: EnhancedReply[];
}

/**
 * Reply Transformation Service
 * Handles conversion of raw database replies to client-ready format
 */
export class ReplyTransformationService {
  /**
   * Transform raw reply data to enhanced format with optimized processing
   */
  static transformRawReplies(rawReplies: RawReply[]): EnhancedReply[] {
    if (!rawReplies || rawReplies.length === 0) {
      return [];
    }

    // Batch process all transformations to avoid repeated work
    const transformedReplies = rawReplies.map((reply) => {
      const authorName = reply.authorName || 'Anonymous User';
      const hasValidAvatar = reply.authorAvatar && reply.authorAvatar.startsWith('/');
      const avatarInitials = generateAvatarFromName(authorName);
      
      return {
        id: reply.id,
        author: authorName,
        avatar: hasValidAvatar ? reply.authorAvatar! : avatarInitials,
        profilePictureUrl: hasValidAvatar ? reply.authorAvatar! : null,
        preferredAvatar: hasValidAvatar ? reply.authorAvatar! : null,
        content: reply.content,
        timestamp: formatTimestamp(reply.createdAt),
        upvotes: reply.upvotes || 0,
        downvotes: reply.downvotes || 0,
        userVote: null as null | 'up' | 'down', // TODO: Get user's vote status
        parentId: reply.parentReplyId,
        replyToAuthor: reply.parentReplyId ? 'Unknown' : undefined, // TODO: Get parent author name
        children: [] as EnhancedReply[],
        createdAt: reply.createdAt // Keep for threading sort
      };
    });

    // Organize into threaded structure with optimized algorithm
    return organizeReplies(transformedReplies);
  }

  /**
   * Transform single reply (for POST responses)
   */
  static transformSingleReply(reply: RawReply, authorName?: string): EnhancedReply {
    const effectiveAuthorName = authorName || reply.authorName || 'Anonymous User';
    const hasValidAvatar = reply.authorAvatar && reply.authorAvatar.startsWith('/');
    const avatarInitials = generateAvatarFromName(effectiveAuthorName);

    return {
      id: reply.id,
      author: effectiveAuthorName,
      avatar: hasValidAvatar ? reply.authorAvatar! : avatarInitials,
      profilePictureUrl: hasValidAvatar ? reply.authorAvatar! : null,
      preferredAvatar: hasValidAvatar ? reply.authorAvatar! : null,
      content: reply.content,
      timestamp: formatTimestamp(reply.createdAt),
      upvotes: reply.upvotes || 0,
      downvotes: reply.downvotes || 0,
      userVote: null,
      parentId: reply.parentReplyId,
      replyToAuthor: reply.parentReplyId ? 'Unknown' : undefined,
      children: []
    };
  }

  /**
   * Get pagination metadata for replies
   */
  static getPaginationMetadata(
    replies: EnhancedReply[],
    limit: number,
    offset: number,
    totalFetched: number
  ) {
    const stats = getReplyStats(replies);
    
    return {
      limit,
      offset,
      hasMore: totalFetched === limit,
      stats: {
        totalReplies: stats.totalReplies,
        rootReplies: stats.rootReplies,
        maxDepth: stats.maxDepth
      }
    };
  }

  /**
   * Generate cache headers for reply responses
   */
  static generateCacheHeaders(discussionId: string, offset: number, limit: number) {
    const timestamp = Math.floor(Date.now() / 60000); // Changes every minute
    
    return {
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=900',
      'ETag': `"replies-${discussionId}-${offset}-${limit}-${timestamp}"`,
      'Last-Modified': new Date().toUTCString(),
      'Vary': 'Accept-Encoding'
    };
  }

  /**
   * Generate empty reply response with caching
   */
  static generateEmptyResponse(discussionId: string, limit: number, offset: number) {
    return {
      success: true,
      replies: [],
      total: 0,
      pagination: {
        limit,
        offset,
        hasMore: false
      }
    };
  }

  /**
   * Generate empty response cache headers
   */
  static generateEmptyCacheHeaders(discussionId: string) {
    return {
      'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache empty results longer
      'ETag': `"empty-replies-${discussionId}"`
    };
  }
}