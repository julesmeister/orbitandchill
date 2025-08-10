/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { formatReplyDate } from './utils';

interface Reply {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  avatar: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  parentId?: string;
}

interface ExistingRepliesProps {
  selectedDiscussion: any;
  replies: Reply[];
  loadingReplies: boolean;
}

export default function ExistingReplies({
  selectedDiscussion,
  replies,
  loadingReplies
}: ExistingRepliesProps) {
  const [expandedReplies, setExpandedReplies] = useState(false);

  if (!selectedDiscussion) return null;

  return (
    <div className="bg-white border border-black p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-space-grotesk font-semibold text-black">
          Existing Replies ({replies.length})
        </h3>
        {replies.length > 3 && (
          <button
            onClick={() => setExpandedReplies(!expandedReplies)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {expandedReplies ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      {loadingReplies ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading replies...</span>
        </div>
      ) : replies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No replies yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(expandedReplies ? replies : replies.slice(0, 3)).map((reply) => (
            <ReplyCard key={reply.id} reply={reply} />
          ))}
          {!expandedReplies && replies.length > 3 && (
            <div className="text-center py-2 text-sm text-gray-500">
              ... and {replies.length - 3} more replies
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReplyCard({ reply }: { reply: Reply }) {
  const showAvatar = reply.avatar && (reply.avatar.startsWith('/avatars/') || reply.avatar.startsWith('http'));
  
  return (
    <div className="bg-gray-50 p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        {showAvatar ? (
          <img
            src={reply.avatar}
            alt={`${reply.authorName}'s avatar`}
            className="w-8 h-8 object-cover border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-8 h-8 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm ${showAvatar ? 'hidden' : ''}`}>
          {reply.avatar && !showAvatar ? reply.avatar : (reply.authorName ? reply.authorName.charAt(0) : 'A')}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{reply.authorName}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{formatReplyDate(reply.createdAt)}</span>
            {reply.parentId && (
              <>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-blue-600">reply</span>
              </>
            )}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>↑ {reply.upvotes || 0}</span>
            <span>↓ {reply.downvotes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}