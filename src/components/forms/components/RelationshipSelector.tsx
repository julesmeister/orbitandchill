/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useRef, useEffect } from 'react';
import { Person } from '../../../types/people';

interface RelationshipSelectorProps {
  relationship: Person['relationship'];
  onRelationshipChange: (value: Person['relationship']) => void;
  required?: boolean;
}

const relationshipOptions = [
  { value: 'self', label: 'Self' },
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'partner', label: 'Partner' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' }
] as const;

// Removed emojis for cleaner UI
// const relationshipIcons: Record<Person['relationship'], string> = {
//   self: '👤',
//   friend: '👥',
//   family: '👪',
//   partner: '💕',
//   colleague: '🤝',
//   other: '👻'
// };

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  relationship,
  onRelationshipChange,
  required = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getRelationshipLabel = (value: Person['relationship']) => {
    const option = relationshipOptions.find(opt => opt.value === value);
    return option ? option.label : 'Select relationship';
  };

  const handleSelect = (value: Person['relationship']) => {
    onRelationshipChange(value);
    setShowDropdown(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  return (
    <div className="p-4 md:border-r border-black relative" ref={dropdownRef}
      style={{ 
        zIndex: showDropdown ? 1500 : 1,
        isolation: 'isolate'
      }}
    >
      <label className="synapsas-label mb-2 block">
        Relationship {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="synapsas-date-field">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="synapsas-date-select"
          >
            <span className={relationship ? 'text-black' : 'text-gray-400'}>
              {getRelationshipLabel(relationship)}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Inline dropdown like month picker */}
          {showDropdown && (
            <div className="synapsas-relationship-dropdown"
              style={{
                zIndex: 9999,
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem'
              }}
            >
              {relationshipOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value as Person['relationship'])}
                  className={`synapsas-relationship-option ${relationship === option.value ? 'selected' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipSelector;