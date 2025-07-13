/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface GenerationSettingsProps {
  discussionsToGenerate: number;
  repliesPerDiscussion: { min: number; max: number };
  maxNestingDepth: number;
  contentVariation: number;
  onDiscussionsChange: (value: number) => void;
  onMinRepliesChange: (value: number) => void;
  onMaxRepliesChange: (value: number) => void;
  onMaxNestingChange: (value: number) => void;
  onContentVariationChange: (value: number) => void;
}

const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  discussionsToGenerate,
  repliesPerDiscussion,
  maxNestingDepth,
  contentVariation,
  onDiscussionsChange,
  onMinRepliesChange,
  onMaxRepliesChange,
  onMaxNestingChange,
  onContentVariationChange,
}) => {
  return (
    <div className="bg-white border border-black mb-8">
      <div className="p-4 border-b border-black bg-green-200">
        <h2 className="font-space-grotesk font-semibold text-black">
          Generation Settings
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-space-grotesk font-semibold mb-2">Discussions</label>
            <input
              type="number"
              value={discussionsToGenerate}
              onChange={(e) => onDiscussionsChange(parseInt(e.target.value))}
              className="w-full p-2 border border-black font-open-sans"
            />
          </div>
          <div>
            <label className="block text-sm font-space-grotesk font-semibold mb-2">Min Replies</label>
            <input
              type="number"
              value={repliesPerDiscussion.min}
              onChange={(e) => onMinRepliesChange(parseInt(e.target.value))}
              className="w-full p-2 border border-black font-open-sans"
            />
          </div>
          <div>
            <label className="block text-sm font-space-grotesk font-semibold mb-2">Max Replies</label>
            <input
              type="number"
              value={repliesPerDiscussion.max}
              onChange={(e) => onMaxRepliesChange(parseInt(e.target.value))}
              className="w-full p-2 border border-black font-open-sans"
            />
          </div>
          <div>
            <label className="block text-sm font-space-grotesk font-semibold mb-2">Max Nesting</label>
            <input
              type="number"
              value={maxNestingDepth}
              onChange={(e) => onMaxNestingChange(parseInt(e.target.value))}
              className="w-full p-2 border border-black font-open-sans"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-space-grotesk font-semibold mb-2">
            Content Variation: {contentVariation}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={contentVariation}
            onChange={(e) => onContentVariationChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationSettings;