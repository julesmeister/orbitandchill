/* eslint-disable @typescript-eslint/no-unused-vars */

export interface ThreadedReply {
  id: string;
  parentId?: string;
  children: ThreadedReply[];
  [key: string]: any;
}

/**
 * Organize replies into threaded structure with optimized performance
 * Uses Map for O(1) lookups instead of array searching
 */
export function organizeReplies<T extends ThreadedReply>(replies: T[]): T[] {
  if (!replies || replies.length === 0) {
    return [];
  }

  const replyMap = new Map<string, T>();
  const rootReplies: T[] = [];
  
  // First pass: create map and initialize children arrays
  replies.forEach(reply => {
    const enhancedReply = { ...reply, children: [] as T[] };
    replyMap.set(reply.id, enhancedReply);
    
    if (!reply.parentId) {
      rootReplies.push(enhancedReply);
    }
  });
  
  // Second pass: build tree structure with O(1) parent lookups
  replies.forEach(reply => {
    if (reply.parentId) {
      const parent = replyMap.get(reply.parentId);
      const child = replyMap.get(reply.id);
      
      if (parent && child) {
        parent.children.push(child);
      }
    }
  });
  
  // Sort replies by timestamp (most recent first for root, chronological for children)
  const sortByTimestamp = (a: T, b: T) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA; // Newest first
  };
  
  const sortRepliesRecursively = (replyList: T[]) => {
    replyList.sort(sortByTimestamp);
    replyList.forEach(reply => {
      if (reply.children.length > 0) {
        // For child replies, sort chronologically (oldest first)
        reply.children.sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeA - timeB; // Oldest first for threaded conversation flow
        });
        sortRepliesRecursively(reply.children as T[]);
      }
    });
  };
  
  sortRepliesRecursively(rootReplies);
  
  return rootReplies;
}

/**
 * Flatten threaded replies back to a linear array
 * Useful for pagination and counting
 */
export function flattenReplies(replies: ThreadedReply[]): ThreadedReply[] {
  const flattened: ThreadedReply[] = [];
  
  const traverse = (replyList: ThreadedReply[]) => {
    replyList.forEach(reply => {
      flattened.push(reply);
      if (reply.children.length > 0) {
        traverse(reply.children as ThreadedReply[]);
      }
    });
  };
  
  traverse(replies);
  return flattened;
}

/**
 * Get reply statistics from threaded structure
 */
export function getReplyStats<T extends ThreadedReply>(replies: T[]) {
  let totalReplies = 0;
  let maxDepth = 0;
  
  const calculateStats = (replyList: T[], currentDepth: number = 0) => {
    replyList.forEach(reply => {
      totalReplies++;
      maxDepth = Math.max(maxDepth, currentDepth);
      
      if (reply.children.length > 0) {
        calculateStats(reply.children as T[], currentDepth + 1);
      }
    });
  };
  
  calculateStats(replies);
  
  return {
    totalReplies,
    maxDepth,
    rootReplies: replies.length
  };
}

/**
 * Find a specific reply in threaded structure
 */
export function findReplyById<T extends ThreadedReply>(replies: T[], targetId: string): T | null {
  for (const reply of replies) {
    if (reply.id === targetId) {
      return reply as T;
    }
    
    if (reply.children.length > 0) {
      const found = findReplyById(reply.children, targetId);
      if (found) {
        return found as T;
      }
    }
  }
  
  return null;
}