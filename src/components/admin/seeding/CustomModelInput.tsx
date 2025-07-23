/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface CustomModelInputProps {
  customModel: string;
  setCustomModel: (model: string) => void;
  onAddModel: () => void;
  onCancel: () => void;
}

export default function CustomModelInput({
  customModel,
  setCustomModel,
  onAddModel,
  onCancel
}: CustomModelInputProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={customModel}
        onChange={(e) => setCustomModel(e.target.value)}
        placeholder="e.g., anthropic/claude-3-sonnet:beta"
        className="flex-1 p-2 border border-gray-300 font-open-sans text-sm"
        onKeyPress={(e) => e.key === 'Enter' && onAddModel()}
      />
      <button
        onClick={onAddModel}
        disabled={!customModel.trim()}
        className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-2 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
}