/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

const relationshipIcons: Record<Person['relationship'], string> = {
  self: '👤',
  friend: '👥',
  family: '👪',
  partner: '💕',
  colleague: '🤝',
  other: '👻'
};

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  relationship,
  onRelationshipChange,
  required = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getRelationshipLabel = (value: Person['relationship']) => {
    const option = relationshipOptions.find(opt => opt.value === value);
    return option ? option.label : 'Select relationship';
  };

  const handleToggle = () => {
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
    setShowDropdown(!showDropdown);
  };

  const handleSelect = (value: Person['relationship']) => {
    onRelationshipChange(value);
    setShowDropdown(false);
  };

  // Update dropdown position on scroll and handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleScroll = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    const handleResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showDropdown]);

  return (
    <>
      <div className="p-4"
        style={{ 
          zIndex: 1000000,
          isolation: 'isolate',
          transform: 'translateZ(0)',
          overflow: 'visible'
        }}
      >
        <label className="synapsas-label mb-2 block">
          Relationship {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-xl">{relationshipIcons[relationship]}</span>
          <div className="flex-1 relative"
            style={{ 
              zIndex: 1000001,
              isolation: 'isolate',
              transform: 'translateZ(0)'
            }}
          >
            <div className="synapsas-date-field">
              <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className="synapsas-date-select"
              >
                <span className="text-black">
                  {getRelationshipLabel(relationship)}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portal dropdown for relationship */}
      {showDropdown && typeof window !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="synapsas-relationship-dropdown"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            zIndex: 999999,
            maxHeight: '200px',
            overflowY: 'auto',
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
              <span className="text-xl mr-2">{relationshipIcons[option.value as Person['relationship']]}</span>
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default RelationshipSelector;