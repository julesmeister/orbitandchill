/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Person } from '@/types/people';
import { getRelationshipDisplay, getRelationshipIconPath } from '@/utils/formatters/relationshipFormatters';
import PersonDropdown from '../ui/PersonDropdown';

interface PersonListItemProps {
  person: Person;
  isSelected: boolean;
  editingPersonId: string | null;
  editingName: string;
  isDeleting: boolean;
  onPersonSelect: (person: Person) => void;
  onStartEdit: (person: Person) => void;
  onSaveEdit: (personId: string) => void;
  onCancelEdit: () => void;
  onSetDefault: (personId: string) => void;
  onDelete: (person: Person) => void;
  onEditNameChange: (name: string) => void;
}

const PersonListItem: React.FC<PersonListItemProps> = ({
  person,
  isSelected,
  editingPersonId,
  editingName,
  isDeleting,
  onPersonSelect,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onSetDefault,
  onDelete,
  onEditNameChange
}) => {
  const renderRelationshipIcon = (relationship: string) => {
    const pathData = getRelationshipIconPath(relationship);
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pathData} />
      </svg>
    );
  };

  const isEditing = editingPersonId === person.id;

  return (
    <div
      key={person.id}
      className={`flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
      }`}
    >
      <div
        onClick={() => {
          if (!isEditing) {
            onPersonSelect(person);
          }
        }}
        className={`flex-1 flex items-center space-x-3 text-left min-w-0 ${
          isEditing ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isSelected 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
        }`}>
          {renderRelationshipIcon(person.relationship)}
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => onEditNameChange(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                }}
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') onSaveEdit(person.id);
                  if (e.key === 'Escape') onCancelEdit();
                }}
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSaveEdit(person.id);
                }}
                className="text-green-600 hover:text-green-700 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onCancelEdit();
                }}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="font-medium text-gray-900 truncate">{person.name}</div>
              <div className="text-sm text-gray-500 flex items-center">
                {getRelationshipDisplay(person.relationship)}
                {person.isDefault && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        {isSelected && !isEditing && (
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      
      {/* Only show dropdown when not in edit mode */}
      {!isEditing && (
        <PersonDropdown
          person={person}
          isDefault={person.isDefault || false}
          isDeleting={isDeleting}
          onSetDefault={onSetDefault}
          onEdit={onStartEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default PersonListItem;