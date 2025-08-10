/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { MOOD_OPTIONS } from '@/hooks/useAIConfiguration';

interface MoodSelectorProps {
  discussionIndex: number;
  selectedMood?: string;
  onMoodSelect: (discussionIndex: number, mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  discussionIndex,
  selectedMood,
  onMoodSelect,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 font-semibold mr-2">Reply Mood:</span>
      <div className="flex gap-1">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.name}
            onClick={() => onMoodSelect(discussionIndex, mood.name)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
              selectedMood === mood.name || (!selectedMood && mood.name === 'supportive')
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title={mood.description}
          >
            <span className="text-base">{mood.emoji}</span>
            <span className="font-medium capitalize">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;