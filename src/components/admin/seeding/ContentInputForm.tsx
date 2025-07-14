/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ContentInputFormProps {
  pastedContent: string;
  onContentChange: (content: string) => void;
  onProcessComments?: (comments: string) => void;
}

const ContentInputForm: React.FC<ContentInputFormProps> = ({
  pastedContent,
  onContentChange,
  onProcessComments,
}) => {
  const [commentsMode, setCommentsMode] = React.useState(false);
  const [commentsText, setCommentsText] = React.useState('');
  const [processingComments, setProcessingComments] = React.useState(false);
  const handleProcessComments = async () => {
    if (onProcessComments && commentsText.trim()) {
      setProcessingComments(true);
      try {
        await onProcessComments(commentsText);
      } finally {
        setProcessingComments(false);
      }
    }
  };

  return (
    <div className="bg-white border border-black">
      <div className="p-4 border-b border-black bg-blue-200">
        <div className="flex items-center justify-between">
          <h2 className="font-space-grotesk font-semibold text-black">
            Content Input
          </h2>
          {onProcessComments && (
            <div className="flex bg-white border border-black">
              <button
                onClick={() => setCommentsMode(false)}
                className={`px-3 py-1 text-sm font-semibold transition-colors ${
                  !commentsMode ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Full Content
              </button>
              <button
                onClick={() => setCommentsMode(true)}
                className={`px-3 py-1 text-sm font-semibold transition-colors border-l border-black ${
                  commentsMode ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Comments Only
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {!commentsMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-space-grotesk font-semibold mb-2">
                Reddit Content
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
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-space-grotesk font-semibold mb-2">
                Reddit Comments
              </label>
              <textarea
                value={commentsText}
                onChange={(e) => setCommentsText(e.target.value)}
                placeholder="Paste individual Reddit comments here, one per line or separated by blank lines...

Example:
Saturn return hit me like a truck! Everything changed when I turned 28.

I'm going through this right now and it's been the most challenging but transformative time of my life.

My therapist explained that Saturn return is like a cosmic reality check where you have to face who you really are.

Can confirm - lost my job, ended a toxic relationship, and moved cities all during my Saturn return. Best thing that ever happened to me though!"
                className="w-full h-64 p-3 border border-black font-open-sans text-sm resize-none"
              />
            </div>
            
            <div className="bg-green-50 p-4 border border-green-200">
              <h4 className="font-space-grotesk font-semibold text-green-800 mb-2">Comments Mode Features:</h4>
              <ul className="text-sm text-green-700 font-open-sans space-y-1">
                <li>• AI will rephrase each comment to make it unique</li>
                <li>• Random personas will be assigned to each comment</li>
                <li>• Comments will be organized as replies to a discussion</li>
                <li>• Perfect for quick reply generation</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleProcessComments}
                disabled={!commentsText.trim() || processingComments}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 font-semibold transition-colors flex items-center gap-2"
              >
                {processingComments ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  'Process Comments'
                )}
              </button>
              <div className="text-xs text-gray-500 font-open-sans">
                Character count: {commentsText.length}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentInputForm;