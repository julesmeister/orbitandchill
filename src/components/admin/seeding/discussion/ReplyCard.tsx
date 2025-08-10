/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ReplyCardProps {
  reply: any;
  index: number;
  replyIdx: number;
  isEditing: boolean;
  editContent: string;
  onStartEdit: (discussionIndex: number, replyIndex: number, content: string) => void;
  onSaveEdit: (discussionIndex: number, replyId: string) => void;
  onCancelEdit: () => void;
  onSetEditContent: (content: string) => void;
  onDeleteReply: (discussionIndex: number, replyId: string) => void;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  index,
  replyIdx,
  isEditing,
  editContent,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onSetEditContent,
  onDeleteReply,
}) => {
  const isExistingReply = reply.isFromDatabase || (reply.timestamp && !reply.scheduledDelay);
  const scheduledHours = reply.scheduledDelay ? Math.round(reply.scheduledDelay / 60) : 0;
  const scheduledDate = reply.createdAt ? new Date(reply.createdAt) : new Date();

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Unknown time';
    
    // If it's already formatted (like "2h ago"), use it as is
    if (timestamp.includes('ago') || timestamp.includes('at ')) {
      return timestamp;
    }
    
    // If it's an ISO string, format it nicely
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp; // Return original if invalid
      
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = diffInMs / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      const diffInDays = diffInHours / 24;
      
      if (diffInMinutes < 1) {
        return 'just now';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInDays < 7) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
      return timestamp; // Return original if formatting fails
    }
  };

  return (
    <div className="bg-white p-4 rounded border border-blue-200 relative group hover:border-blue-300 transition-colors duration-200">
      {/* Delete Button */}
      <button
        onClick={() => onDeleteReply(index, reply.id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-2 py-1 text-xs font-medium flex items-center gap-1 transition-all duration-200 hover:shadow-sm"
        title="Delete this reply"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
      
      <div className="flex items-start gap-3 pr-8">
        {/* Avatar */}
        {(reply.avatar || reply.authorAvatar) ? (
          <img 
            src={reply.avatar || reply.authorAvatar} 
            alt={`${reply.authorName}'s avatar`}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm ${(reply.avatar || reply.authorAvatar) ? 'hidden' : ''}`}>
          {reply.authorName ? reply.authorName.charAt(0) : 'A'}
        </div>
        
        <div className="flex-1">
          <div className="font-semibold text-blue-800 mb-1 text-sm">{reply.authorName}</div>
          
          {isEditing ? (
            // Editing mode
            <div>
              <div
                contentEditable
                suppressContentEditableWarning={true}
                className="text-gray-700 text-sm leading-relaxed outline-none focus:outline-none bg-transparent min-h-[1.25rem] whitespace-pre-wrap"
                style={{ 
                  lineHeight: '1.5',
                  fontFamily: 'inherit'
                }}
                onInput={(e) => onSetEditContent(e.currentTarget.textContent || '')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    onSaveEdit(index, reply.id);
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    onCancelEdit();
                  }
                }}
                onBlur={() => {
                  if (editContent.trim() && editContent !== reply.content) {
                    onSaveEdit(index, reply.id);
                  } else {
                    onCancelEdit();
                  }
                }}
                ref={(el) => {
                  if (el && isEditing) {
                    el.textContent = editContent;
                    el.focus();
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                  }
                }}
              />
              <div className="text-xs text-gray-400 mt-1 opacity-75">
                Ctrl+Enter to save, Esc to cancel, or click outside to auto-save
              </div>
            </div>
          ) : (
            // Display mode
            <div 
              className="text-gray-700 text-sm leading-relaxed cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 transition-colors"
              onClick={() => onStartEdit(index, replyIdx, reply.content)}
              title="Click to edit this reply"
            >
              {reply.content}
            </div>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>↑ {reply.upvotes || 0}</span>
            <span>↓ {reply.downvotes || 0}</span>
            {reply.addingValue && <span className="italic">• {reply.addingValue}</span>}
            {isExistingReply ? (
              <span className="text-blue-600">• From Database • {formatTimestamp(reply.timestamp || reply.createdAt)}</span>
            ) : (
              <span className="text-green-600">• AI Generated</span>
            )}
          </div>
          
          {/* Scheduling Information */}
          {!isExistingReply && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <div className="flex items-center gap-2 text-yellow-800">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>Scheduled:</strong> {scheduledHours}h after discussion creation
                </span>
              </div>
              <div className="text-yellow-700 mt-1">
                Will be posted: {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString()}
              </div>
              <div className="text-yellow-600 mt-1 italic">
                ⚠️ Preview only - not saved to database yet
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;