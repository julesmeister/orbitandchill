"use client";

import React, { useState, useEffect } from 'react';

interface RenameToastProps {
  isVisible: boolean;
  currentTitle: string;
  eventId: string;
  onRename: (eventId: string, newTitle: string) => void;
  onCancel: () => void;
}

export default function RenameToast({
  isVisible,
  currentTitle,
  eventId,
  onRename,
  onCancel
}: RenameToastProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);

  useEffect(() => {
    if (isVisible) {
      setNewTitle(currentTitle);
    }
  }, [isVisible, currentTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle.trim() !== currentTitle) {
      onRename(eventId, newTitle.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="bg-white border-2 border-black shadow-lg max-w-sm w-80">
        <div className="px-4 py-3 border-b border-black bg-black">
          <h3 className="font-space-grotesk font-bold text-white text-sm">
            Rename Event
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block font-open-sans text-xs font-medium text-black mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-black font-open-sans text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter new event title"
              autoFocus
              maxLength={100}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={!newTitle.trim() || newTitle.trim() === currentTitle}
              className="flex-1 px-3 py-2 bg-black text-white font-open-sans font-medium text-xs border border-black hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-3 py-2 bg-white text-black font-open-sans font-medium text-xs border border-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}