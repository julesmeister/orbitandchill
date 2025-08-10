/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface DiscussionPreviewCardProps {
  item: any;
  originalLength: number;
  contentLength: number;
  assignedAuthor: string;
  category: string;
  actualReplyCount: number;
}

const DiscussionPreviewCard: React.FC<DiscussionPreviewCardProps> = ({
  item,
  originalLength,
  contentLength,
  assignedAuthor,
  category,
  actualReplyCount,
}) => {
  return (
    <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">AI Generated</span>
        <span className="text-xs text-gray-600">Original: {originalLength || 0} chars → Transformed: {contentLength || 0} chars</span>
      </div>
      <div className="text-xs text-gray-600">
        {assignedAuthor} • {category} • {actualReplyCount || 0} replies
      </div>
    </div>
  );
};

export default DiscussionPreviewCard;