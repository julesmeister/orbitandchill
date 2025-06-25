/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { UserService } from '@/db/services/userService';
import { initializeDatabase } from '@/db/index';

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

    await initializeDatabase();
    
    // Fetch replies from database
    const rawReplies = await DiscussionService.getRepliesForDiscussion(discussionId);
    
    // Enhance replies with author information
    const enhancedReplies = await Promise.all(
      rawReplies.map(async (reply: { authorId: string; id: any; content: any; createdAt: string | number | Date; upvotes: any; downvotes: any; parentReplyId: any; }) => {
        let authorName = 'Anonymous User';
        let avatar = 'AN';
        
        // Try to get author information if authorId exists
        if (reply.authorId) {
          try {
            const author = await UserService.getUserById(reply.authorId);
            if (author) {
              authorName = author.username || 'Anonymous User';
              avatar = generateAvatarFromName(authorName);
            }
          } catch (error) {
            console.warn(`Could not fetch author for reply ${reply.id}:`, error);
          }
        }
        
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
      })
    );
    
    // Organize into threaded structure
    const organizedReplies = organizeReplies(enhancedReplies);
    
    return NextResponse.json({
      success: true,
      replies: organizedReplies,
      total: rawReplies.length
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