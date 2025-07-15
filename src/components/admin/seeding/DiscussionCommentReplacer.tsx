/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import StatusToast from '@/components/reusable/StatusToast';
import { stripHtmlTags } from '@/utils/textUtils';

interface DiscussionCommentReplacerProps {
  previewContent: any[];
  onReplaceComments: (discussionId: string, newReplies: any[]) => Promise<void>;
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
}

export default function DiscussionCommentReplacer({ 
  previewContent,
  onReplaceComments,
  showLoadingToast,
  showSuccessToast,
  showErrorToast
}: DiscussionCommentReplacerProps) {
  const { threads, loadThreads } = useAdminStore();
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string>('');
  const [isReplacing, setIsReplacing] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  // Load threads when component mounts if not already loaded
  useEffect(() => {
    if (threads.length === 0) {
      loadThreads();
    }
  }, [threads.length, loadThreads]);

  // Filter for published forum discussions only
  const forumDiscussions = threads.filter(t => !t.isBlogPost && t.isPublished);

  const handleReplaceComments = async () => {
    if (!selectedDiscussionId || previewContent.length === 0) {
      showErrorToast('Replace Failed', 'Please select a discussion and ensure you have preview content.');
      return;
    }

    // Find the selected preview content
    const selectedPreview = previewContent[0]; // Use the first preview content
    if (!selectedPreview || !selectedPreview.replies || selectedPreview.replies.length === 0) {
      showErrorToast('Replace Failed', 'No replies found in preview content.');
      return;
    }

    setIsReplacing(true);
    showLoadingToast('Replacing Comments', 'Updating discussion comments...');

    try {
      const response = await fetch('/api/admin/replace-discussion-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discussionId: selectedDiscussionId,
          newReplies: selectedPreview.replies.map((reply: any) => ({
            content: reply.content,
            authorId: reply.authorId,
            authorName: reply.authorName,
            parentReplyId: reply.parentReplyId,
            upvotes: reply.upvotes || 0,
            downvotes: reply.downvotes || 0,
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        showSuccessToast('Comments Replaced', `Successfully replaced ${result.repliesCount} comments in the discussion.`);
        setSelectedDiscussionId('');
        setShowSelector(false);
        
        // Reload threads to reflect changes
        loadThreads();
      } else {
        showErrorToast('Replace Failed', result.error || 'Failed to replace comments.');
      }
    } catch (error) {
      showErrorToast('Replace Error', 'Failed to replace comments: ' + (error as Error).message);
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 mb-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-space-grotesk font-semibold text-purple-800 mb-2">
            Replace Discussion Comments
          </h3>
          <p className="text-purple-700 font-open-sans">
            Replace all comments in an existing discussion with the AI-generated comments from your preview.
          </p>
        </div>
        <button
          onClick={() => setShowSelector(!showSelector)}
          disabled={previewContent.length === 0 || !previewContent[0]?.replies?.length}
          className="px-6 py-3 bg-purple-600 text-white font-space-grotesk font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {showSelector ? 'Cancel' : 'Replace Comments'}
        </button>
      </div>

      {showSelector && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-2 font-space-grotesk">
              Select Discussion to Update
            </label>
            <select
              value={selectedDiscussionId}
              onChange={(e) => setSelectedDiscussionId(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 bg-white text-black font-open-sans focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isReplacing}
            >
              <option value="">-- Select a discussion --</option>
              {forumDiscussions.map((discussion) => (
                <option key={discussion.id} value={discussion.id}>
                  {discussion.title} ({discussion.replies} replies)
                </option>
              ))}
            </select>
          </div>

          {selectedDiscussionId && (
            <div className="bg-white border border-purple-300 p-4 rounded">
              <h4 className="font-semibold text-purple-800 mb-2">Preview</h4>
              <p className="text-sm text-gray-700 mb-2">
                This will replace all existing comments in the selected discussion with{' '}
                <strong>{previewContent[0]?.replies?.length || 0}</strong> new AI-generated comments.
              </p>
              {forumDiscussions.find(d => d.id === selectedDiscussionId) && (
                <div className="text-sm text-gray-600">
                  <p><strong>Current discussion:</strong> {forumDiscussions.find(d => d.id === selectedDiscussionId)?.title}</p>
                  <p><strong>Current comment count:</strong> {forumDiscussions.find(d => d.id === selectedDiscussionId)?.replies}</p>
                  <p><strong>New comment count:</strong> {previewContent[0]?.replies?.length || 0}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowSelector(false);
                setSelectedDiscussionId('');
              }}
              className="px-4 py-2 bg-gray-300 text-black font-space-grotesk font-medium hover:bg-gray-400 transition-colors"
              disabled={isReplacing}
            >
              Cancel
            </button>
            <button
              onClick={handleReplaceComments}
              disabled={!selectedDiscussionId || isReplacing}
              className="px-4 py-2 bg-purple-600 text-white font-space-grotesk font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isReplacing ? 'Replacing...' : 'Confirm Replace'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}