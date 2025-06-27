/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Reply } from '../../types/threads';
import ThreadingLines from '../threading/ThreadingLines';
import VoteButtons from '../reusable/VoteButtons';

interface RepliesSectionProps {
  discussionId: string;
  onReplyToComment: (replyId: string, authorName: string) => void;
  onReplyCountChange?: (count: number) => void;
}

export default function RepliesSection({ discussionId, onReplyToComment, onReplyCountChange }: RepliesSectionProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [totalReplies, setTotalReplies] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PERFORMANCE: Optimized refresh with caching and error handling
  const refreshReplies = async (useCache = true) => {
    try {
      const cacheHeaders = useCache ? {
        'Cache-Control': 'max-age=60',
        'Accept': 'application/json'
      } : {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      };

      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        headers: cacheHeaders
      });
      
      const data = await response.json();
      
      if (data.success) {
        setReplies(data.replies || []);
        setTotalReplies(data.total || 0);
        setError(null);
        
        // Notify parent of reply count change
        if (onReplyCountChange) {
          onReplyCountChange(data.total || 0);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch replies');
      }
    } catch (err) {
      console.error('Error refreshing replies:', err);
      setError('Failed to load replies');
    }
  };

  // Fetch replies from API
  useEffect(() => {
    async function fetchReplies() {
      try {
        setLoading(true);
        await refreshReplies();
      } catch (err) {
        console.error('Error fetching replies:', err);
        setError('Failed to load replies');
        setReplies([]);
        setTotalReplies(0);
      } finally {
        setLoading(false);
      }
    }

    if (discussionId) {
      fetchReplies();
    }
  }, [discussionId]);
  // Loading state
  if (loading) {
    return (
      <section className="bg-white p-8">
        <header className="mb-8">
          <h2 className="font-space-grotesk text-xl font-bold text-black">
            Replies
          </h2>
        </header>
        
        {/* Beautiful loading skeleton */}
        <div className="space-y-8">
          {/* Loading skeleton for replies */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-black p-6 animate-pulse">
              <div className="flex space-x-4">
                {/* Avatar skeleton */}
                <div className="w-12 h-12 border border-black bg-gray-200 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-300"></div>
                </div>
                
                <div className="flex-1 space-y-3">
                  {/* Header skeleton */}
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-300 w-24"></div>
                    <div className="h-3 bg-gray-200 w-16"></div>
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 w-full"></div>
                    <div className="h-4 bg-gray-200 w-3/4"></div>
                    <div className="h-4 bg-gray-200 w-1/2"></div>
                  </div>
                  
                  {/* Actions skeleton */}
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 border border-black bg-gray-200"></div>
                      <div className="h-3 bg-gray-300 w-8"></div>
                      <div className="w-8 h-8 border border-black bg-gray-200"></div>
                    </div>
                    <div className="h-8 bg-gray-200 w-20 border border-black"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Modern loading indicator with dots animation */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <span className="font-inter text-black/60 text-sm">Loading replies</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white p-8">
        <header className="mb-8">
          <h2 className="font-space-grotesk text-xl font-bold text-black">
            Replies
          </h2>
        </header>
        <div className="text-center py-12">
          <p className="text-black/60 font-inter">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors font-inter"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (totalReplies === 0) {
    return (
      <section className="bg-white p-8">
        <header className="mb-8">
          <h2 className="font-space-grotesk text-xl font-bold text-black">
            0 Replies
          </h2>
        </header>
        <div className="text-center py-12">
          <p className="text-black/60 font-inter mb-4">
            No replies yet. Be the first to join the discussion!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-8">
      <header className="mb-8 flex items-center justify-between">
        <h2 className="font-space-grotesk text-xl font-bold text-black">
          {totalReplies} {totalReplies === 1 ? 'Reply' : 'Replies'}
        </h2>
        <button 
          onClick={() => refreshReplies()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-inter"
          title="Refresh replies"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </header>

      <div className="space-y-8">
        {replies.map((reply) => (
          <div key={reply.id} className="space-y-6">
            {/* Main Reply */}
            <article className="bg-white border border-black p-6" itemScope itemType="https://schema.org/Comment">
              <div className="flex space-x-4">
                <div className="w-12 h-12 border border-black flex items-center justify-center flex-shrink-0 bg-gray-100">
                  <span className="text-black font-bold text-lg font-space-grotesk">
                    {reply.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <header className="flex items-center space-x-3 mb-3">
                    <span className="font-space-grotesk font-bold text-black" itemProp="author">{reply.author}</span>
                    <time className="text-black/60 text-sm font-inter" itemProp="dateCreated">
                      {reply.timestamp}
                    </time>
                  </header>
                  <div itemProp="text">
                    <p className="text-black mb-4 leading-relaxed font-inter">{reply.content}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <VoteButtons
                        type="reply"
                        id={reply.id}
                        upvotes={reply.upvotes}
                        downvotes={reply.downvotes}
                        size="md"
                        userVote={reply.userVote}
                        useHook={true}
                      />
                      
                      <button
                        onClick={() => onReplyToComment(reply.id, reply.author)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-transparent text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 font-inter"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Nested Replies */}
            {reply.children && reply.children.length > 0 && (
              <div className="ml-16 relative">
                {reply.children.map((childReply, childIndex) => (
                  <div key={childReply.id} className="relative mb-6">
                    <ThreadingLines
                      isNested={true}
                      isLastChild={childIndex === (reply.children?.length ?? 0) - 1}
                      hasMoreSiblings={childIndex < (reply.children?.length ?? 0) - 1}
                    />
                    <article className="bg-white border border-black p-4 ml-4">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 border border-black flex items-center justify-center flex-shrink-0 bg-gray-100">
                          <span className="text-black font-bold text-sm font-space-grotesk">
                            {childReply.avatar}
                          </span>
                        </div>
                        <div className="flex-1">
                          <header className="flex items-center space-x-2 mb-2">
                            <span className="font-space-grotesk font-bold text-black">{childReply.author}</span>
                            <span className="text-black/40 text-sm font-inter">replying to</span>
                            <span className="text-black font-medium text-sm font-inter">{childReply.replyToAuthor}</span>
                            <time className="text-black/60 text-sm font-inter">
                              {childReply.timestamp}
                            </time>
                          </header>
                          <div>
                            <p className="text-black mb-3 leading-relaxed font-inter">{childReply.content}</p>
                          </div>
                          <div className="flex items-center space-x-3 mt-3">
                            <VoteButtons
                              type="reply"
                              id={childReply.id}
                              upvotes={childReply.upvotes}
                              downvotes={childReply.downvotes}
                              size="sm"
                              userVote={childReply.userVote}
                              useHook={true}
                            />
                            
                            <button
                              onClick={() => onReplyToComment(childReply.id, childReply.author)}
                              className="inline-flex items-center gap-1 px-4 py-1 bg-transparent text-black font-medium text-xs border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 font-inter"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}