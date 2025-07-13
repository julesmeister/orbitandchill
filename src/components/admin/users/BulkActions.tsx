/* eslint-disable @typescript-eslint/no-unused-vars */

interface BulkActionsProps {
  selectedCount: number;
  isLoading: boolean;
  onDeactivate: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function BulkActions({
  selectedCount,
  isLoading,
  onDeactivate,
  onDelete,
  onClear
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="px-8 py-4 bg-yellow-50 border-b border-black">
      <div className="flex items-center justify-between">
        <span className="font-open-sans text-sm text-black">
          {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDeactivate}
            disabled={isLoading}
            className="px-3 py-1 font-open-sans text-sm bg-white border border-black hover:bg-gray-100 disabled:opacity-50"
          >
            Deactivate
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="px-3 py-1 font-open-sans text-sm bg-red-600 text-white border border-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1 font-open-sans text-sm bg-gray-100 border border-black hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}