/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import DiscussionContent from '@/components/discussions/DiscussionContent';
import { DiscussionTemp } from '@/types/threads';
import { MOOD_OPTIONS } from '@/hooks/useAIConfiguration';

interface PreviewContentDisplayProps {
  previewContent: any[];
  selectedMoodForIndex: Record<number, string>;
  generatingReplyForIndex: number | null;
  expandedReplies: Record<number, boolean>;
  aiApiKey: string;
  onAddReply: (discussionIndex: number) => void;
  onDeleteReply: (discussionIndex: number, replyId: string) => void;
  onMoodSelect: (discussionIndex: number, mood: string) => void;
  onToggleExpandReplies: (discussionIndex: number) => void;
  onClearReplies?: (discussionIndex: number) => void;
  onUpdateReply?: (discussionIndex: number, replyId: string, newContent: string) => void;
}

const PreviewContentDisplay: React.FC<PreviewContentDisplayProps> = ({
  previewContent,
  selectedMoodForIndex,
  generatingReplyForIndex,
  expandedReplies,
  aiApiKey,
  onAddReply,
  onDeleteReply,
  onMoodSelect,
  onToggleExpandReplies,
  onClearReplies,
  onUpdateReply,
}) => {
  const [editingReply, setEditingReply] = React.useState<{discussionIndex: number, replyIndex: number} | null>(null);
  const [editContent, setEditContent] = React.useState('');
  
  // Functions for inline editing
  const startEditing = (discussionIndex: number, replyIndex: number, currentContent: string) => {
    setEditingReply({ discussionIndex, replyIndex });
    setEditContent(currentContent);
  };
  
  const saveEdit = (discussionIndex: number, replyId: string) => {
    if (onUpdateReply && editContent.trim()) {
      onUpdateReply(discussionIndex, replyId, editContent.trim());
    }
    setEditingReply(null);
    setEditContent('');
  };
  
  const cancelEdit = () => {
    setEditingReply(null);
    setEditContent('');
  };
  
  
  if (!previewContent || previewContent.length === 0) {
    return null;
  }

  return (
    <div id="ai-processed-content" className="bg-white border border-black mb-8">
      <div className="p-4 border-b border-black bg-pink-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-space-grotesk font-semibold text-black">
            AI-Processed Content Preview
          </h2>
          <div className="flex items-center gap-4">
            {onClearReplies && previewContent.some(item => item.replies && item.replies.length > 0) && (
              <button
                onClick={() => {
                  // Clear replies for all discussions
                  previewContent.forEach((_, index) => {
                    if (onClearReplies) onClearReplies(index);
                  });
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium border border-black transition-colors"
                title="Clear all accumulated replies"
              >
                Clear Replies
              </button>
            )}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-black font-medium">PREVIEW MODE</span>
            </div>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded">
          <div className="flex items-start gap-2 text-sm text-yellow-800">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-semibold">This is a temporary workspace</div>
              <div className="mt-1">• Add/remove replies as needed • Replies scheduled with random delays (1h-7d) • Click "Generate Forum" to save to database</div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {previewContent.map((item, index) => {
          // Validate required fields
          if (!item.transformedTitle || !item.transformedContent) {
            console.error(`🔄 Preview item ${index} missing required fields:`, {
              hasTransformedTitle: !!item.transformedTitle,
              hasTransformedContent: !!item.transformedContent,
              itemKeys: Object.keys(item)
            });
            return (
              <div key={index} className="border border-red-300 bg-red-50 p-4">
                <p className="text-red-600">Error: Discussion {index + 1} is missing required data.</p>
                <p className="text-sm text-red-500">Missing: {!item.transformedTitle ? 'title' : ''} {!item.transformedContent ? 'content' : ''}</p>
              </div>
            );
          }

          // Convert preview item to DiscussionTemp format for proper rendering
          const discussionForPreview: DiscussionTemp = {
            id: `preview_${index}`,
            title: item.transformedTitle,
            excerpt: item.summary || item.transformedContent.substring(0, 200) + '...',
            content: item.transformedContent,
            author: item.assignedAuthor || 'Unknown Author',
            authorId: item.assignedAuthorId || 'unknown',
            avatar: '/avatars/default.png',
            category: item.category || 'General Discussion',
            replies: item.actualReplyCount || 0,
            views: Math.floor(Math.random() * 500) + 50, // Mock views for preview
            lastActivity: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isLocked: false,
            isPinned: false,
            tags: item.tags || [],
            upvotes: Math.floor(Math.random() * 50) + 10,
            downvotes: Math.floor(Math.random() * 5),
            userVote: null,
            isBlogPost: false
          };

          return (
            <div key={index} className="border border-gray-300 bg-white">
              {/* Preview Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">AI Generated</span>
                  <span className="text-xs text-gray-600">Original: {item.originalLength || 0} chars → Transformed: {item.contentLength || 0} chars</span>
                </div>
                <div className="text-xs text-gray-600">
                  {item.assignedAuthor} • {item.category} • {item.actualReplyCount || 0} replies
                </div>
              </div>

              {/* Use DiscussionContent component for proper formatting */}
              <DiscussionContent discussion={discussionForPreview} />
              
              {/* Add Reply Section with Mood Selection */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">
                    <strong>Preview:</strong> This is how the discussion will appear on the forum
                  </div>
                  <button
                    onClick={() => onAddReply(index)}
                    disabled={generatingReplyForIndex === index || !aiApiKey.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm px-4 py-2 rounded font-semibold transition-colors duration-200 flex items-center gap-2"
                  >
                    {generatingReplyForIndex === index ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <div className="w-1 h-1 bg-white animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1 h-1 bg-white animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1 h-1 bg-white animate-bounce"></div>
                        </div>
                        Generating Reply...
                      </>
                    ) : (
                      <>
                        <span>+</span>
                        Add AI Reply
                      </>
                    )}
                  </button>
                </div>
                
                {/* Mood Selection Tabs */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-semibold mr-2">Reply Mood:</span>
                  <div className="flex gap-1">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.name}
                        onClick={() => onMoodSelect(index, mood.name)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                          selectedMoodForIndex[index] === mood.name || (!selectedMoodForIndex[index] && mood.name === 'supportive')
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                        title={mood.description}
                      >
                        <span className="text-base">{mood.emoji}</span>
                        <span className="font-medium capitalize">{mood.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Display AI-generated replies */}
              {item.replies && item.replies.length > 0 && (
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-space-grotesk font-semibold text-sm text-blue-800">Generated Replies ({item.replies.length}):</h4>
                    {item.replies.length > 3 && (
                      <button
                        onClick={() => onToggleExpandReplies(index)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {expandedReplies[index] ? 'Show Less' : 'Show All'}
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(expandedReplies[index] ? item.replies : item.replies.slice(0, 3)).map((reply: any, replyIdx: any) => {
                      const scheduledHours = reply.scheduledDelay ? Math.round(reply.scheduledDelay / 60) : 0;
                      const scheduledDate = reply.createdAt ? new Date(reply.createdAt) : new Date();
                      
                      // Ensure absolutely unique key by combining multiple identifiers
                      const uniqueKey = `${index}-${replyIdx}-${reply.id || Date.now()}-${reply.authorName || 'unknown'}`;
                      
                      
                      return (
                        <div key={uniqueKey} className="bg-white p-4 rounded border border-blue-200 relative group hover:border-blue-300 transition-colors duration-200">
                          {/* Delete Button - Modern Design */}
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
                            {(reply.avatar || reply.authorAvatar) ? (
                              <img 
                                src={reply.avatar || reply.authorAvatar} 
                                alt={`${reply.authorName}'s avatar`}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  // Fallback to initial if image fails to load
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
                              {editingReply?.discussionIndex === index && editingReply?.replyIndex === replyIdx ? (
                                // Editing mode - seamless inline editor that looks like normal text
                                <div>
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    className="text-gray-700 text-sm leading-relaxed outline-none focus:outline-none bg-transparent min-h-[1.25rem] whitespace-pre-wrap"
                                    style={{ 
                                      lineHeight: '1.5',
                                      fontFamily: 'inherit'
                                    }}
                                    onInput={(e) => setEditContent(e.currentTarget.textContent || '')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.ctrlKey) {
                                        e.preventDefault();
                                        saveEdit(index, reply.id);
                                      }
                                      if (e.key === 'Escape') {
                                        e.preventDefault();
                                        cancelEdit();
                                      }
                                    }}
                                    onBlur={() => {
                                      // Auto-save on blur
                                      if (editContent.trim() && editContent !== reply.content) {
                                        saveEdit(index, reply.id);
                                      } else {
                                        cancelEdit();
                                      }
                                    }}
                                    ref={(el) => {
                                      if (el && editingReply?.discussionIndex === index && editingReply?.replyIndex === replyIdx) {
                                        el.textContent = editContent;
                                        el.focus();
                                        // Place cursor at end
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
                                // Display mode - click to edit
                                <div 
                                  className="text-gray-700 text-sm leading-relaxed cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 transition-colors"
                                  onClick={() => startEditing(index, replyIdx, reply.content)}
                                  title="Click to edit this reply"
                                >
                                  {reply.content}
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>↑ {reply.upvotes || 0}</span>
                                <span>↓ {reply.downvotes || 0}</span>
                                {reply.addingValue && <span className="italic">• {reply.addingValue}</span>}
                                <span className="text-green-600">• AI Generated</span>
                              </div>
                              {/* Scheduling Information */}
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
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {!expandedReplies[index] && item.replies.length > 3 && (
                      <div className="text-xs text-blue-600 italic text-center py-2">
                        Click "Show All" to see {item.replies.length - 3} more replies...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewContentDisplay;