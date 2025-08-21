/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { use, useState } from "react";
import { useReplyHandling } from "../../../hooks/useReplyHandling";
import { useDiscussionData } from "./hooks/useDiscussionData";
import { getValidDate, formatDate } from "./utils";

// Components
import DiscussionDetailHeader from "./components/DiscussionDetailHeader";
import DiscussionDetailLoading from "./components/DiscussionDetailLoading";
import DiscussionDetailError from "./components/DiscussionDetailError";
import DiscussionContent, { FirstImageData } from "../../../components/discussions/DiscussionContent";
import ReplyForm from "../../../components/discussions/ReplyForm";
import RepliesSection from "../../../components/discussions/RepliesSection";
import DiscussionSidebar from "../../../components/discussions/DiscussionSidebar";
import ConfirmationToast from "../../../components/reusable/ConfirmationToast";

interface DiscussionDetailPageClientProps {
  params: Promise<{ slug: string }>;
}

export default function DiscussionDetailPageClient({
  params,
}: DiscussionDetailPageClientProps) {
  const resolvedParams = use(params);
  const [firstImage, setFirstImage] = useState<FirstImageData | null>(null);
  
  // Use custom hook for data fetching and business logic
  const {
    discussion,
    loading,
    error,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleting,
    user,
    handleReplyCountUpdate,
    handleDeleteDiscussion,
  } = useDiscussionData(resolvedParams.slug);

  // Custom hooks for reply handling
  const {
    formState,
    isSubmitting,
    handleReplyChange,
    handleReplyToComment,
    handleSubmitReply,
    handleCancelReply,
  } = useReplyHandling(discussion?.id);

  // Show loading state
  if (loading) {
    return <DiscussionDetailLoading />;
  }

  // Show error state
  if (error || !discussion) {
    return <DiscussionDetailError error={error} />;
  }

  // For now, we'll show an empty related discussions array
  // TODO: Implement proper related discussions based on category/tags
  const relatedDiscussions: any[] = [];

  const publishedDate = getValidDate(discussion.lastActivity);

  return (
    <div
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      {/* Header Section */}
      <DiscussionDetailHeader
        discussion={discussion}
        user={user}
        isDeleting={isDeleting}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      {/* Content Section */}
      <section className="px-4 md:px-8 lg:px-12 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Main Content */}
          <div className="lg:col-span-3 border border-black bg-white">
            <div className="divide-y divide-black">
              <DiscussionContent 
                discussion={discussion} 
                onFirstImageExtracted={setFirstImage}
              />

              <ReplyForm
                formState={formState}
                onReplyChange={handleReplyChange}
                onSubmit={handleSubmitReply}
                onCancel={handleCancelReply}
                isLocked={discussion.isLocked}
                isSubmitting={isSubmitting}
              />

              <RepliesSection
                discussionId={discussion.id}
                onReplyToComment={handleReplyToComment}
                onReplyCountChange={handleReplyCountUpdate}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 lg:border-t lg:border-r lg:border-b border-black">
            <DiscussionSidebar
              discussion={discussion}
              relatedDiscussions={relatedDiscussions}
              firstImage={firstImage}
            />
          </div>
        </div>
      </section>

      {/* Confirmation Toast for Delete */}
      <ConfirmationToast
        title="Delete Discussion"
        message={`Are you sure you want to delete "${discussion?.title}"? This action cannot be undone and will remove all replies as well.`}
        isVisible={showDeleteConfirm}
        onConfirm={handleDeleteDiscussion}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete Forever"
        cancelText="Keep Discussion"
        confirmButtonColor="red"
      />
    </div>
  );
}