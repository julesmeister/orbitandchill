/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ContentInputFormProps {
  pastedContent: string;
  onContentChange: (content: string) => void;
}

const ContentInputForm: React.FC<ContentInputFormProps> = ({
  pastedContent,
  onContentChange,
}) => {
  return (
    <div className="bg-white border border-black">
      <div className="p-4 border-b border-black bg-blue-200">
        <h2 className="font-space-grotesk font-semibold text-black">
          Paste Reddit Content
        </h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-space-grotesk font-semibold mb-2">
              Content Input
            </label>
            <textarea
              value={pastedContent}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Paste Reddit discussions or any content here...

Example:
Understanding Saturn Return

I'm 28 and hearing about Saturn return everywhere. Can someone explain what this means? I've been going through major life changes lately...

[More content can be pasted here]"
              className="w-full h-64 p-3 border border-black font-open-sans text-sm resize-none"
            />
          </div>
          <div className="text-sm text-gray-600 font-open-sans">
            <p className="mb-2"><strong>Tips:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Paste entire Reddit threads or individual posts</li>
              <li>Separate multiple discussions with double line breaks</li>
              <li>Include titles, content, and comments if available</li>
              <li>AI will automatically reorganize and rephrase</li>
            </ul>
          </div>
          <div className="text-xs text-gray-500 font-open-sans">
            Character count: {pastedContent.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentInputForm;