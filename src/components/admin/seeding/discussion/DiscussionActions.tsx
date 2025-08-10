/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';

interface DiscussionActionsProps {
  selectedDiscussion: any;
  onAddCustomComment: (discussionId: string, comment: string) => Promise<void>;
  onRandomizeTimes: (discussionId: string) => Promise<void>;
  onFixAvatars: (discussionId: string) => Promise<void>;
  isGenerating: boolean;
}

export default function DiscussionActions({
  selectedDiscussion,
  onAddCustomComment,
  onRandomizeTimes,
  onFixAvatars,
  isGenerating
}: DiscussionActionsProps) {
  const [commentText, setCommentText] = useState('');
  const [randomizingTimes, setRandomizingTimes] = useState(false);
  const [fixingAvatars, setFixingAvatars] = useState(false);

  if (!selectedDiscussion) return null;


  const handleAddCustomComment = async () => {
    await onAddCustomComment(selectedDiscussion.id, commentText);
    setCommentText('');
  };

  const handleRandomizeTimes = async () => {
    setRandomizingTimes(true);
    await onRandomizeTimes(selectedDiscussion.id);
    setRandomizingTimes(false);
  };

  const handleFixAvatars = async () => {
    setFixingAvatars(true);
    await onFixAvatars(selectedDiscussion.id);
    setFixingAvatars(false);
  };

  return (
    <div className="bg-white border border-black p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-space-grotesk font-semibold text-black">
          Actions for: {selectedDiscussion.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleRandomizeTimes}
            disabled={randomizingTimes}
            className="px-4 py-2 bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {randomizingTimes ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Randomizing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Randomize Times & Likes
              </>
            )}
          </button>
          <button
            onClick={handleFixAvatars}
            disabled={fixingAvatars}
            className="px-4 py-2 bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {fixingAvatars ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fixing Avatars...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Fix Avatar Paths
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Custom Comment Section - Full Width */}
        <div className="border border-gray-200 p-4">
          <h4 className="font-space-grotesk font-medium text-black mb-3">Add Custom Comment</h4>
          <div className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your custom comment here..."
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCustomComment}
                disabled={isGenerating || !commentText.trim()}
                className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Comment
                  </>
                )}
              </button>
              <button
                onClick={() => setCommentText('')}
                disabled={isGenerating || !commentText.trim()}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}