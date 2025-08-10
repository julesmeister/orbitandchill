/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';

interface DiscussionActionsProps {
  selectedDiscussion: any;
  aiApiKey: string;
  aiProvider: string;
  aiModel: string;
  temperature: number;
  onGenerateComments: (discussionId: string, count: number, timing: any) => Promise<void>;
  onAddCustomComment: (discussionId: string, comment: string) => Promise<void>;
  onRandomizeTimes: (discussionId: string) => Promise<void>;
  onFixAvatars: (discussionId: string) => Promise<void>;
  isGenerating: boolean;
}

export default function DiscussionActions({
  selectedDiscussion,
  aiApiKey,
  aiProvider,
  aiModel,
  temperature,
  onGenerateComments,
  onAddCustomComment,
  onRandomizeTimes,
  onFixAvatars,
  isGenerating
}: DiscussionActionsProps) {
  const [commentsToGenerate, setCommentsToGenerate] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [replyTiming, setReplyTiming] = useState<'immediate' | 'scheduled' | 'random'>('random');
  const [scheduledHours, setScheduledHours] = useState(2);
  const [maxRandomHours, setMaxRandomHours] = useState(24);
  const [randomizingTimes, setRandomizingTimes] = useState(false);
  const [fixingAvatars, setFixingAvatars] = useState(false);

  if (!selectedDiscussion) return null;

  const handleGenerateComments = async () => {
    await onGenerateComments(selectedDiscussion.id, commentsToGenerate, {
      type: replyTiming,
      scheduledHours,
      maxRandomHours,
      discussionCreatedAt: selectedDiscussion.createdAt || new Date().toISOString()
    });
  };

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
                Randomize Reply Times
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Comment Generation */}
          <div className="border border-gray-200 p-4">
            <h4 className="font-space-grotesk font-medium text-black mb-3">Generate AI Comments</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of comments:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={commentsToGenerate}
                onChange={(e) => setCommentsToGenerate(parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply timing:</label>
              <select
                value={replyTiming}
                onChange={(e) => setReplyTiming(e.target.value as 'immediate' | 'scheduled' | 'random')}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediate">Post immediately</option>
                <option value="scheduled">Schedule for specific time</option>
                <option value="random">Random delays (realistic)</option>
              </select>
            </div>
            
            {replyTiming === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours after discussion creation:</label>
                <input
                  type="number"
                  min="0"
                  max="168"
                  value={scheduledHours}
                  onChange={(e) => setScheduledHours(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">0 = immediately, 168 = 7 days</p>
              </div>
            )}
            
            {replyTiming === 'random' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max random delay (hours):</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={maxRandomHours}
                  onChange={(e) => setMaxRandomHours(parseInt(e.target.value) || 24)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Replies will be spread randomly from 1h to {maxRandomHours}h</p>
              </div>
            )}
            
            <button
              onClick={handleGenerateComments}
              disabled={isGenerating || !aiApiKey.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : `Generate ${commentsToGenerate} Comments`}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}