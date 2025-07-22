/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onBulkDelete: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDelete
}: BulkActionsBarProps) {
  return (
    <div className="bg-[#6bdbff] border border-black p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-black font-space-grotesk">
            {selectedCount} post{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-black hover:underline font-open-sans"
          >
            Clear selection
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onBulkPublish}
            className="bg-[#51bd94] text-black px-4 py-2 text-sm font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black"
          >
            Publish Selected
          </button>
          <button
            onClick={onBulkUnpublish}
            className="bg-[#f2e356] text-black px-4 py-2 text-sm font-medium hover:bg-[#e8d650] transition-colors duration-200 font-open-sans border border-black"
          >
            Move to Drafts
          </button>
          <button
            onClick={onBulkDelete}
            className="bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors duration-200 font-open-sans border border-black"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}