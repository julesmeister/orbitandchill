/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

interface EmptyStateProps {
  showAddNew: boolean;
  onAddNew?: () => void;
  onClose: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ showAddNew, onAddNew, onClose }) => {
  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
      onClose();
    }
  };

  return (
    <div className="p-4 text-center">
      <div className="text-gray-500 text-sm mb-2">No people added yet</div>
      {showAddNew && onAddNew && (
        <button
          onClick={handleAddNew}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
        >
          Add your first person
        </button>
      )}
    </div>
  );
};

export default EmptyState;