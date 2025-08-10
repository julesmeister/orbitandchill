/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import DiscussionContent from '@/components/discussions/DiscussionContent';
import { DiscussionTemp } from '@/types/threads';
import { useReplyEditor } from '@/hooks/useReplyEditor';
import PreviewHeader from './discussion/PreviewHeader';
import DiscussionPreviewCard from './discussion/DiscussionPreviewCard';
import MoodSelector from './discussion/MoodSelector';
import ReplyCard from './discussion/ReplyCard';

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
  const {
    editContent,
    setEditContent,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing
  } = useReplyEditor(onUpdateReply);
  
  
  if (!previewContent || previewContent.length === 0) {
    return null;
  }

  const handleClearAllReplies = () => {
    previewContent.forEach((_, index) => {
      if (onClearReplies) onClearReplies(index);
    });
  };

  return (
    <div id="ai-processed-content" className="bg-white border border-black mb-8">
      <PreviewHeader 
        hasReplies={previewContent.some(item => item.replies && item.replies.length > 0)}
        onClearAllReplies={onClearReplies ? handleClearAllReplies : undefined}
      />
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
              <DiscussionPreviewCard
                item={item}
                originalLength={item.originalLength}
                contentLength={item.contentLength}
                assignedAuthor={item.assignedAuthor}
                category={item.category}
                actualReplyCount={item.actualReplyCount}
              />

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
                
                <MoodSelector
                  discussionIndex={index}
                  selectedMood={selectedMoodForIndex[index]}
                  onMoodSelect={onMoodSelect}
                />
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
                      const uniqueKey = `${index}-${replyIdx}-${reply.id || Date.now()}-${reply.authorName || 'unknown'}`;
                      
                      return (
                        <ReplyCard
                          key={uniqueKey}
                          reply={reply}
                          index={index}
                          replyIdx={replyIdx}
                          isEditing={isEditing(index, replyIdx)}
                          editContent={editContent}
                          onStartEdit={startEditing}
                          onSaveEdit={saveEdit}
                          onCancelEdit={cancelEdit}
                          onSetEditContent={setEditContent}
                          onDeleteReply={onDeleteReply}
                        />
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