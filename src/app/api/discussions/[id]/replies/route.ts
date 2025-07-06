/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { UserService } from '@/db/services/userService';
import { initializeDatabase } from '@/db/index';
import { createDiscussionReplyNotification, createDiscussionMentionNotification } from '@/utils/notificationHelpers';
import { processMentions } from '@/utils/mentionUtils';

// Helper function to format timestamp for display
const formatTimestamp = (date: Date | string | number) => {
  let d: Date;
  
  // Handle Unix timestamps (integers from database)
  if (typeof date === 'number') {
    // If it looks like a Unix timestamp (less than year 3000), convert from seconds
    d = date < 32503680000 ? new Date(date * 1000) : new Date(date);
  } else {
    d = new Date(date);
  }
  
  // Fallback for invalid dates
  if (isNaN(d.getTime())) {
    return 'just now';
  }
  
  const now = new Date();
  const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Helper function to generate avatar from name
const generateAvatarFromName = (name: string) => {
  if (!name) return 'AN';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

// Helper function to organize replies into threaded structure
const organizeReplies = (replies: any[]): any[] => {
  const replyMap = new Map<string, any>();
  const rootReplies: any[] = [];
  
  // First pass: create map and identify root replies
  replies.forEach(reply => {
    replyMap.set(reply.id, { ...reply, children: [] });
    if (!reply.parentId) {
      rootReplies.push(replyMap.get(reply.id)!);
    }
  });
  
  // Second pass: build tree structure
  replies.forEach(reply => {
    if (reply.parentId) {
      const parent = replyMap.get(reply.parentId);
      if (parent) {
        parent.children.push(replyMap.get(reply.id)!);
      }
    }
  });
  
  return rootReplies;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    await initializeDatabase();
    
    // PERFORMANCE: Optimized fetch with connection reuse and caching
    const rawReplies = await DiscussionService.getRepliesWithAuthors(discussionId, limit, offset);
    
    // PERFORMANCE: Early return if no replies to avoid unnecessary processing
    if (!rawReplies || rawReplies.length === 0) {
      return NextResponse.json({
        success: true,
        replies: [],
        total: 0,
        pagination: {
          limit,
          offset,
          hasMore: false
        }
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache empty results longer
          'ETag': `"empty-replies-${discussionId}"`,
        }
      });
    }
    
    // Transform replies to expected format (no more N+1 queries!)
    const enhancedReplies = rawReplies.map((reply: any) => {
      const authorName = reply.authorName || 'Anonymous User';
      const avatar = reply.authorAvatar ? 
        reply.authorAvatar : 
        generateAvatarFromName(authorName);
      
      return {
        id: reply.id,
        author: authorName,
        avatar: avatar,
        content: reply.content,
        timestamp: formatTimestamp(reply.createdAt),
        upvotes: reply.upvotes || 0,
        downvotes: reply.downvotes || 0,
        userVote: null, // TODO: Get user's vote status
        parentId: reply.parentReplyId, // Use parentId to match Reply interface
        replyToAuthor: reply.parentReplyId ? 'Unknown' : undefined, // TODO: Get parent author name
        children: [] as any[]
      };
    });
    
    // Organize into threaded structure
    const organizedReplies = organizeReplies(enhancedReplies);
    
    return NextResponse.json({
      success: true,
      replies: organizedReplies,
      total: rawReplies.length,
      pagination: {
        limit,
        offset,
        hasMore: rawReplies.length === limit
      }
    }, {
      // PERFORMANCE: Enhanced caching headers with stale-while-revalidate
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=900', // 1min browser, 5min CDN, 15min stale
        'ETag': `"replies-${discussionId}-${offset}-${limit}-${Math.floor(Date.now() / 60000)}"`, // ETag changes every minute
        'Last-Modified': new Date().toUTCString(),
        'Vary': 'Accept-Encoding',
        // PERFORMANCE: Add prefetch hints for pagination
        'Link': offset > 0 ? `</api/discussions/${discussionId}/replies?offset=${Math.max(0, offset - limit)}&limit=${limit}>; rel=prev` : ''
      }
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch replies',
        replies: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, authorId, parentReplyId } = body;

    // Validate required fields
    if (!content || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Content and authorId are required' },
        { status: 400 }
      );
    }

    await initializeDatabase();
    
    // Create reply
    const reply = await DiscussionService.createReply({
      discussionId,
      authorId,
      content,
      parentReplyId
    });
    
    if (!reply) {
      return NextResponse.json(
        { success: false, error: 'Failed to create reply' },
        { status: 500 }
      );
    }
    
    // Get author information
    let authorName = 'Anonymous User';
    let avatar = 'AN';
    
    try {
      const author = await UserService.getUserById(authorId);
      if (author) {
        authorName = author.username || 'Anonymous User';
        avatar = generateAvatarFromName(authorName);
      }
    } catch (error) {
      console.warn(`Could not fetch author for new reply:`, error);
    }
    
    // Return enhanced reply data
    const enhancedReply = {
      id: reply.id,
      author: authorName,
      avatar: avatar,
      content: reply.content,
      timestamp: formatTimestamp(reply.createdAt),
      upvotes: reply.upvotes || 0,
      downvotes: reply.downvotes || 0,
      userVote: null,
      parentId: reply.parentReplyId,
      replyToAuthor: parentReplyId ? 'Unknown' : undefined, // TODO: Get parent author name
      children: []
    };
    
    // Create notifications (async, don't block response)
    try {
      const discussion = await DiscussionService.getDiscussionById(discussionId);
      
      // 1. Create reply notification for discussion author
      if (discussion && discussion.authorId !== authorId) {
        // Don't notify if replying to your own discussion
        await createDiscussionReplyNotification(
          discussion.authorId,
          authorName,
          discussion.title,
          discussionId
        );
        console.log('✅ Discussion reply notification created');
      }
      
      // 2. Create reply notification for parent reply author
      if (parentReplyId) {
        const parentReply = await DiscussionService.getReplyById(parentReplyId);
        if (parentReply && parentReply.authorId !== authorId && parentReply.authorId !== discussion?.authorId) {
          // Don't notify if replying to yourself or if parent is discussion author (already notified)
          await createDiscussionReplyNotification(
            parentReply.authorId,
            authorName,
            discussion?.title || 'Discussion',
            discussionId
          );
          console.log('✅ Parent reply notification created');
        }
      }

      // 3. Create mention notifications for @mentioned users
      const mentionedUserIds = await processMentions(content);
      if (mentionedUserIds.length > 0) {
        // Filter out self-mentions and users already notified
        const alreadyNotified = new Set([
          authorId, // Don't notify self
          discussion?.authorId, // Discussion author already notified
          ...(parentReplyId ? [await DiscussionService.getReplyById(parentReplyId)?.then(r => r?.authorId)].filter(Boolean) : [])
        ]);

        const usersToNotify = mentionedUserIds.filter(userId => !alreadyNotified.has(userId));
        
        for (const userId of usersToNotify) {
          await createDiscussionMentionNotification(
            userId,
            authorName,
            discussion?.title || 'Discussion',
            discussionId
          );
          console.log(`✅ Mention notification created for user: ${userId}`);
        }
      }
    } catch (notificationError) {
      // Don't fail the request if notification fails
      console.error('Failed to create notifications:', notificationError);
    }

    return NextResponse.json({
      success: true,
      reply: enhancedReply
    });

  } catch (error) {
    console.error('Error creating reply:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create reply',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}