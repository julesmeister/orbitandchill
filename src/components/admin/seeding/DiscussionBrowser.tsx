/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { stripHtmlTags } from '@/utils/textUtils';

interface DiscussionBrowserProps {
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
}

interface Comment {
  content: string;
  authorId: string;
  authorName: string;
  parentReplyId?: string;
  upvotes?: number;
  downvotes?: number;
}

export default function DiscussionBrowser({
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
  aiProvider,
  aiModel,
  aiApiKey,
  temperature
}: DiscussionBrowserProps) {
  const { threads, loadThreads } = useAdminStore();
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'forum' | 'recent'>('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [commentsToGenerate, setCommentsToGenerate] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyTiming, setReplyTiming] = useState<'immediate' | 'scheduled' | 'random'>('random');
  const [scheduledHours, setScheduledHours] = useState(2);
  const [maxRandomHours, setMaxRandomHours] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [discussionsPerPage] = useState(10);
  const [existingReplies, setExistingReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(false);
  const [fixingAvatars, setFixingAvatars] = useState(false);
  const [randomizingTimes, setRandomizingTimes] = useState(false);

  // Load threads when component mounts
  useEffect(() => {
    if (threads.length === 0) {
      loadThreads();
    }
  }, [threads.length, loadThreads]);

  // Filter discussions
  const filteredDiscussions = threads.filter(thread => {
    const matchesFilter = filter === 'all' || 
      (filter === 'forum' && !thread.isBlogPost) ||
      (filter === 'recent' && new Date(thread.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    const matchesSearch = !searchQuery || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch && thread.isPublished;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDiscussions.length / discussionsPerPage);
  const startIndex = (currentPage - 1) * discussionsPerPage;
  const currentDiscussions = filteredDiscussions.slice(startIndex, startIndex + discussionsPerPage);

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Generate AI comments
  const generateAIComments = async (discussionId: string) => {
    if (!aiApiKey.trim()) {
      showErrorToast('API Key Required', 'AI API key is required for comment generation.');
      return;
    }

    if (!selectedDiscussion) {
      showErrorToast('No Discussion Selected', 'Please select a discussion first.');
      return;
    }

    setIsGenerating(true);
    showLoadingToast('Generating Comments', `Creating ${commentsToGenerate} AI-generated comments...`);

    try {
      const response = await fetch('/api/admin/process-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: `Generate ${commentsToGenerate} engaging comments for this discussion: "${selectedDiscussion.title}"\n\n${stripHtmlTags(selectedDiscussion.content).substring(0, 500)}`,
          aiConfig: {
            provider: aiProvider,
            model: aiModel,
            apiKey: aiApiKey,
            temperature: temperature
          },
          discussionContext: {
            title: selectedDiscussion.title,
            topic: selectedDiscussion.category || 'astrology'
          },
          timingConfig: {
            type: replyTiming,
            scheduledHours: scheduledHours,
            maxRandomHours: maxRandomHours,
            discussionCreatedAt: selectedDiscussion.createdAt || new Date().toISOString()
          }
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const comments: Comment[] = result.data.map((comment: any) => ({
          content: comment.content,
          authorId: comment.authorId,
          authorName: comment.authorName,
          parentReplyId: comment.parentReplyId,
          upvotes: comment.upvotes || 0,
          downvotes: comment.downvotes || 0,
        }));

        // Add comments to the discussion
        await addCommentsToDiscussion(discussionId, comments);
        
        showSuccessToast('Comments Generated', `Successfully added ${comments.length} AI-generated comments to the discussion.`);
        
        // Reload threads to reflect changes
        loadThreads();
        
        // Refresh existing replies display
        if (selectedDiscussion) {
          fetchExistingReplies(selectedDiscussion.id);
        }
      } else {
        showErrorToast('Generation Failed', result.error || 'Failed to generate comments.');
      }
    } catch (error) {
      showErrorToast('Generation Error', 'Failed to generate comments: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add a custom comment
  const addCustomComment = async (discussionId: string, comment: string) => {
    if (!comment.trim()) {
      showErrorToast('Comment Required', 'Please enter a comment.');
      return;
    }

    setIsGenerating(true);
    showLoadingToast('Adding Comment', 'Adding your comment to the discussion...');

    try {
      const comments: Comment[] = [{
        content: comment,
        authorId: 'admin_user',
        authorName: 'Forum Admin',
        upvotes: 0,
        downvotes: 0,
      }];

      await addCommentsToDiscussion(discussionId, comments);
      
      showSuccessToast('Comment Added', 'Successfully added your comment to the discussion.');
      setCommentText('');
      setShowCommentForm(false);
      
      // Reload threads to reflect changes
      loadThreads();
      
      // Refresh existing replies display
      if (selectedDiscussion) {
        fetchExistingReplies(selectedDiscussion.id);
      }
    } catch (error) {
      showErrorToast('Add Comment Error', 'Failed to add comment: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch existing replies for a discussion
  const fetchExistingReplies = async (discussionId: string) => {
    setLoadingReplies(true);
    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Flatten threaded replies for admin display
        const flattenReplies = (replies: any[]): any[] => {
          const flat: any[] = [];
          replies.forEach(reply => {
            flat.push({
              id: reply.id,
              content: reply.content,
              authorName: reply.author,
              authorId: reply.authorId,
              avatar: reply.avatar,
              upvotes: reply.upvotes || 0,
              downvotes: reply.downvotes || 0,
              createdAt: reply.timestamp,
              parentId: reply.parentId
            });
            if (reply.children && reply.children.length > 0) {
              flat.push(...flattenReplies(reply.children));
            }
          });
          return flat;
        };
        
        setExistingReplies(flattenReplies(data.replies || []));
      } else {
        console.error('Failed to fetch existing replies');
        setExistingReplies([]);
      }
    } catch (error) {
      console.error('Error fetching existing replies:', error);
      setExistingReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  };

  // Fix avatar paths for discussion replies
  const fixDiscussionAvatars = async (discussionId: string) => {
    setFixingAvatars(true);
    showLoadingToast('Fixing Avatars', 'Updating avatar paths for discussion replies...');

    try {
      const response = await fetch('/api/admin/fix-discussion-avatar-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discussionId }),
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccessToast('Avatars Fixed', `Updated avatar paths for ${result.fixedCount} replies.`);
        // Refresh existing replies display
        fetchExistingReplies(discussionId);
      } else {
        showErrorToast('Fix Failed', result.error || 'Failed to fix avatar paths.');
      }
    } catch (error) {
      showErrorToast('Fix Error', 'Failed to fix avatar paths: ' + (error as Error).message);
    } finally {
      setFixingAvatars(false);
    }
  };

  // Load existing replies when a discussion is selected
  const handleDiscussionSelect = (discussion: any) => {
    setSelectedDiscussion(discussion);
    fetchExistingReplies(discussion.id);
  };

  // Randomize reply timestamps for a discussion
  const randomizeReplyTimes = async (discussionId: string) => {
    setRandomizingTimes(true);
    showLoadingToast('Randomizing Times', 'Updating reply timestamps to look more natural...');

    try {
      const response = await fetch('/api/admin/randomize-reply-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discussionId }),
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccessToast('Times Randomized', `Updated timestamps for ${result.updatedCount} replies.`);
        // Refresh existing replies display
        fetchExistingReplies(discussionId);
      } else {
        showErrorToast('Randomization Failed', result.error || 'Failed to randomize reply times.');
      }
    } catch (error) {
      showErrorToast('Randomization Error', 'Failed to randomize times: ' + (error as Error).message);
    } finally {
      setRandomizingTimes(false);
    }
  };

  // Helper function to add comments to discussion
  const addCommentsToDiscussion = async (discussionId: string, comments: Comment[]) => {
    const response = await fetch('/api/admin/replace-discussion-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discussionId: discussionId,
        newReplies: comments,
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to add comments');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white border border-black p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-black bg-white text-black font-open-sans focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'forum' | 'recent')}
              className="px-4 py-2 border border-black bg-white text-black font-open-sans"
            >
              <option value="all">All Discussions</option>
              <option value="forum">Forum Only</option>
              <option value="recent">Recent (7 days)</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 font-open-sans">
          Found {filteredDiscussions.length} discussions
        </div>
      </div>

      {/* Discussion List */}
      <div className="bg-white border border-black">
        <div className="divide-y divide-gray-200">
          {currentDiscussions.map((discussion) => (
            <div
              key={discussion.id}
              className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedDiscussion?.id === discussion.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => handleDiscussionSelect(discussion)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-space-grotesk font-semibold text-black">{discussion.title}</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 border border-gray-300 font-open-sans">
                      {discussion.category}
                    </span>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 border border-green-300 font-open-sans">
                      {discussion.replies} replies
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-open-sans mb-2 line-clamp-2">
                    {stripHtmlTags(discussion.content).substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-open-sans">
                    <span>by {discussion.authorName}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(discussion.createdAt)}</span>
                    <span>•</span>
                    <span>{discussion.views} views</span>
                  </div>
                </div>
                {selectedDiscussion?.id === discussion.id && (
                  <div className="ml-4 text-blue-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700 font-open-sans">
                Showing {startIndex + 1}-{Math.min(startIndex + discussionsPerPage, filteredDiscussions.length)} of {filteredDiscussions.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Discussion Actions */}
      {selectedDiscussion && (
        <div className="bg-white border border-black p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-space-grotesk font-semibold text-black">
              Actions for: {selectedDiscussion.title}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => randomizeReplyTimes(selectedDiscussion.id)}
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
                onClick={() => fixDiscussionAvatars(selectedDiscussion.id)}
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
                  onClick={() => generateAIComments(selectedDiscussion.id)}
                  disabled={isGenerating || !aiApiKey.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : `Generate ${commentsToGenerate} Comments`}
                </button>
              </div>
            </div>

            {/* Custom Comment */}
            <div className="border border-gray-200 p-4">
              <h4 className="font-space-grotesk font-medium text-black mb-3">Add Custom Comment</h4>
              {!showCommentForm ? (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="w-full px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700"
                >
                  Add Manual Comment
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter your comment..."
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addCustomComment(selectedDiscussion.id, commentText)}
                      disabled={isGenerating || !commentText.trim()}
                      className="flex-1 px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? 'Adding...' : 'Add Comment'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCommentForm(false);
                        setCommentText('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 font-medium hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Existing Replies Display */}
      {selectedDiscussion && (
        <div className="bg-white border border-black p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-space-grotesk font-semibold text-black">
              Existing Replies ({existingReplies.length})
            </h3>
            {existingReplies.length > 3 && (
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
          ) : existingReplies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No replies yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(expandedReplies ? existingReplies : existingReplies.slice(0, 3)).map((reply, index) => {
                const formatDate = (dateString: string) => {
                  // For admin view, always show full date and time for clarity
                  try {
                    // If it's already a formatted string from the API, return it
                    if (dateString.includes('at') || dateString.includes('ago') || dateString.includes('Yesterday')) {
                      return dateString;
                    }
                    
                    // Otherwise, format it as full date and time
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                      return dateString;
                    }
                    
                    // Show full date and time for admin clarity
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                  } catch {
                    return dateString;
                  }
                };
                
                return (
                  <div key={reply.id} className="bg-gray-50 p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      {reply.avatar && (reply.avatar.startsWith('/avatars/') || reply.avatar.startsWith('http')) ? (
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
                      <div className={`w-8 h-8 bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm ${reply.avatar && (reply.avatar.startsWith('/avatars/') || reply.avatar.startsWith('http')) ? 'hidden' : ''}`}>
                        {reply.avatar && !reply.avatar.startsWith('/avatars/') && !reply.avatar.startsWith('http') ? reply.avatar : (reply.authorName ? reply.authorName.charAt(0) : 'A')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{reply.authorName}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
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
              })}
              {!expandedReplies && existingReplies.length > 3 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  ... and {existingReplies.length - 3} more replies
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredDiscussions.length === 0 && (
        <div className="bg-white border border-black p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="font-space-grotesk font-semibold text-gray-900 mb-2">No discussions found</h3>
          <p className="text-gray-600 font-open-sans">
            {searchQuery ? 'Try adjusting your search terms or filters.' : 'Create some discussions first to manage them here.'}
          </p>
        </div>
      )}
    </div>
  );
}