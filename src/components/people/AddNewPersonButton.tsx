/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

interface AddNewPersonButtonProps {
  onAddNew: () => void;
  onClose: () => void;
}

const AddNewPersonButton: React.FC<AddNewPersonButtonProps> = ({ onAddNew, onClose }) => {
  const handleClick = () => {
    onAddNew();
    onClose();
  };

  return (
    <div className="border-t border-gray-200 rounded-b-lg overflow-hidden">
      <button
        onClick={handleClick}
        className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
      >
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div className="font-medium">Add New Person</div>
      </button>
    </div>
  );
};

export default AddNewPersonButton;