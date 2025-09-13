/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Person } from '@/types/people';
import { getRelationshipDisplay, getRelationshipIconPath } from '@/utils/formatters/relationshipFormatters';

interface SelectedPersonDisplayProps {
  selectedPerson: Person | null;
  onToggleDropdown: () => void;
  isOpen: boolean;
}

const SelectedPersonDisplay: React.FC<SelectedPersonDisplayProps> = ({
  selectedPerson,
  onToggleDropdown,
  isOpen
}) => {
  const renderRelationshipIcon = (relationship: string) => {
    const pathData = getRelationshipIconPath(relationship);
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pathData} />
      </svg>
    );
  };

  return (
    <div className="flex items-center space-x-3">
      {selectedPerson ? (
        <>
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600">
            {renderRelationshipIcon(selectedPerson.relationship)}
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">{selectedPerson.name}</div>
            <div className="text-sm text-gray-500">
              {getRelationshipDisplay(selectedPerson.relationship)}
              {selectedPerson.isDefault && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-500">Select a person</div>
            <div className="text-sm text-gray-400">Choose who to generate chart for</div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectedPersonDisplay;