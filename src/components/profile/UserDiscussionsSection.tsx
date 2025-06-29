/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Discussion {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  category: string;
  createdAt: string;
  replies: number;
  views: number;
  upvotes: number;
}

interface Reply {
  id: string;
  discussionId: string;
  discussionSlug?: string;
  discussionTitle: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

interface UserDiscussionsSectionProps {
  userId: string;
}

export default function UserDiscussionsSection({ userId }: UserDiscussionsSectionProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [activeTab, setActiveTab] = useState<'discussions' | 'replies'>('discussions');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserContent();
  }, [userId]);

  const fetchUserContent = async () => {
    setIsLoading(true);
    try {
      // Fetch user's discussions
      const discussionsResponse = await fetch(`/api/discussions?authorId=${userId}`);
      if (discussionsResponse.ok) {
        const data = await discussionsResponse.json();
        setDiscussions(data.discussions || []);
      }

      // Fetch user's replies
      const repliesResponse = await fetch(`/api/users/${userId}/replies`);
      if (repliesResponse.ok) {
        const data = await repliesResponse.json();
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error('Error fetching user content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="p-6 border-b border-gray-200">
          <p className="font-inter text-sm text-black/60">Loading discussions and replies...</p>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="p-6 border-b border-black">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-inter text-sm text-black/60">Your discussions and replies</p>
          </div>
          <div className="flex space-x-0 border border-black">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                activeTab === 'discussions'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Discussions ({discussions.length})
            </button>
            <button
              onClick={() => setActiveTab('replies')}
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border-l border-black ${
                activeTab === 'replies'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Replies ({replies.length})
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'discussions' ? (
          <div className="space-y-3">
            {discussions.length === 0 ? (
              <div className="text-center py-12" style={{ backgroundColor: '#f0e3ff' }}>
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">No Discussions Yet</h3>
                <p className="font-inter text-sm text-black/60">Start a discussion to share your thoughts</p>
              </div>
            ) : (
              discussions.map((discussion) => (
                <Link
                  key={discussion.id}
                  href={`/discussions/${discussion.slug || discussion.id}`}
                  className="block border border-black p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-space-grotesk text-sm font-semibold text-black group-hover:underline">
                      {discussion.title}
                    </h4>
                    <span className="px-2 py-1 bg-black text-white text-xs font-semibold">
                      {discussion.category}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-black/60 mb-2 line-clamp-2">
                    {discussion.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-black/60">
                    <span>{formatDistanceToNow(new Date(discussion.createdAt))} ago</span>
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.views} views</span>
                    <span>{discussion.upvotes} upvotes</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {replies.length === 0 ? (
              <div className="text-center py-12" style={{ backgroundColor: '#e7fff6' }}>
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">No Replies Yet</h3>
                <p className="font-inter text-sm text-black/60">Join discussions to share your insights</p>
              </div>
            ) : (
              replies.map((reply) => (
                <Link
                  key={reply.id}
                  href={`/discussions/${reply.discussionSlug || reply.discussionId}`}
                  className="block border border-black p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="mb-2">
                    <span className="font-inter text-xs text-black/60">Replied to:</span>
                    <h4 className="font-space-grotesk text-sm font-semibold text-black group-hover:underline">
                      {reply.discussionTitle}
                    </h4>
                  </div>
                  <p className="font-inter text-xs text-black/60 mb-2 line-clamp-2">
                    {reply.content}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-black/60">
                    <span>{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
                    <span>{reply.upvotes} upvotes</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}