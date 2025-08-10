/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { stripHtmlTags } from '@/utils/textUtils';
import DiscussionFilters from './discussion/DiscussionFilters';
import DiscussionList from './discussion/DiscussionList';
import DiscussionActions from './discussion/DiscussionActions';
import PreviewContentDisplay from './PreviewContentDisplay';
import {
  useDiscussionReplies,
  useDiscussionComments,
  useDiscussionFetching,
  useDiscussionNavigation,
  useDiscussionActions
} from './discussion/hooks';

interface DiscussionBrowserProps {
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
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
  const [discussionsPerPage] = useState(10);

  // Toast handlers object for hooks
  const toastHandlers = {
    showLoadingToast,
    showSuccessToast,
    showErrorToast
  };

  // Use custom hooks
  const { threads, totalThreads, totalPages, isLoading, fetchDiscussions } = useDiscussionFetching({ 
    discussionsPerPage 
  });

  const {
    selectedDiscussion,
    filter,
    searchQuery,
    currentPage,
    setSearchQuery,
    handleFilterChange,
    handlePageChange,
    handleRefresh,
    handleDiscussionSelect
  } = useDiscussionNavigation({ fetchDiscussions });

  // AI config object for comments hook
  const aiConfig = {
    provider: aiProvider,
    model: aiModel,
    apiKey: aiApiKey,
    temperature: temperature
  };

  // Load initial data
  useEffect(() => {
    fetchDiscussions({ page: 1, filter: 'forum' });
  }, [fetchDiscussions]);

  // Use replies hook
  const {
    existingReplies,
    loadingReplies,
    fetchExistingReplies,
    fixDiscussionAvatars,
    randomizeReplyTimes
  } = useDiscussionReplies(toastHandlers);

  // Use comments hook with callback to refresh data
  const commentAddedCallback = useCallback(() => {
    handleRefresh();
    if (selectedDiscussion) {
      fetchExistingReplies(selectedDiscussion.id);
    }
  }, [handleRefresh, selectedDiscussion, fetchExistingReplies]);

  const {
    isGenerating,
    generateAIComments,
    addCustomComment
  } = useDiscussionComments(aiConfig, toastHandlers, commentAddedCallback);

  // Use discussion actions hook
  const {
    selectedMoodForIndex,
    handleMoodSelect,
    handleDeleteReply,
    handleClearReplies,
    handleUpdateReply,
    handleAddCustomComment
  } = useDiscussionActions({
    selectedDiscussion,
    fetchExistingReplies,
    addCustomComment,
    showLoadingToast,
    showSuccessToast,
    showErrorToast
  });

  // Load replies when discussion is selected
  const handleDiscussionSelectWithReplies = useCallback((discussion: any) => {
    handleDiscussionSelect(discussion);
    fetchExistingReplies(discussion.id);
  }, [handleDiscussionSelect, fetchExistingReplies]);

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <DiscussionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={handleFilterChange}
        filteredCount={totalThreads}
        onRefresh={handleRefresh}
      />

      {/* Discussion List with server-side pagination */}
      <DiscussionList
        discussions={threads}
        selectedDiscussion={selectedDiscussion}
        onDiscussionSelect={handleDiscussionSelectWithReplies}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        discussionsPerPage={discussionsPerPage}
        totalCount={totalThreads}
        totalPages={totalPages}
        isLoading={isLoading}
      />

      {/* Selected Discussion Actions */}
      {selectedDiscussion && (
        <DiscussionActions
          selectedDiscussion={selectedDiscussion}
          onAddCustomComment={handleAddCustomComment}
          onRandomizeTimes={randomizeReplyTimes}
          onFixAvatars={fixDiscussionAvatars}
          isGenerating={isGenerating}
        />
      )}

      {/* Discussion Replies Preview using existing PreviewContentDisplay */}
      {selectedDiscussion && (
        <PreviewContentDisplay
          previewContent={[{
            transformedTitle: selectedDiscussion.title,
            transformedContent: selectedDiscussion.content,
            summary: selectedDiscussion.excerpt,
            assignedAuthor: selectedDiscussion.authorName || 'Unknown Author',
            assignedAuthorId: selectedDiscussion.authorId || 'unknown',
            category: selectedDiscussion.category || 'General Discussion',
            actualReplyCount: existingReplies.length,
            replies: existingReplies,
            tags: selectedDiscussion.tags || [],
            contentLength: selectedDiscussion.content?.length || 0,
            originalLength: selectedDiscussion.content?.length || 0
          }]}
          selectedMoodForIndex={selectedMoodForIndex}
          generatingReplyForIndex={isGenerating ? 0 : null}
          expandedReplies={{ 0: true }}
          aiApiKey={aiApiKey}
          onAddReply={(discussionIndex) => {}}
          onDeleteReply={(discussionIndex, replyId) => handleDeleteReply(replyId)}
          onMoodSelect={(discussionIndex, mood) => handleMoodSelect(mood)}
          onToggleExpandReplies={(discussionIndex) => {}}
          onClearReplies={(discussionIndex) => handleClearReplies()}
          onUpdateReply={(discussionIndex, replyId, newContent) => handleUpdateReply(replyId, newContent)}
        />
      )}
    </div>
  );
}