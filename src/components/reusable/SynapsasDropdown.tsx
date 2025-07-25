"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface DropdownOption {
  value: string;
  label: string;
  isCustom?: boolean;
  customModelId?: string;
}

interface SynapsasDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'thin';
  direction?: 'down' | 'up';
  onDeleteCustomModel?: (modelId: string, modelName: string) => void;
}

export default function SynapsasDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  variant = "default",
  direction = "down",
  onDeleteCustomModel
}: SynapsasDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 200; // Max height of dropdown

    const top = direction === 'up'
      ? rect.top - dropdownHeight + 40 // Position above button with 4px gap
      : rect.bottom + 4; // Position below button with 4px gap

    setDropdownPosition({
      top,
      left: rect.left,
      width: rect.width
    });
  }, [direction]);

  // Handle toggle and calculate position when opening
  const handleToggle = useCallback(() => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  }, [isOpen, calculatePosition]);

  // Update position on scroll and handle click outside
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, calculatePosition]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`}>
      <div className={variant === 'thin' ? 'synapsas-input-field' : 'synapsas-sort-field'}>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className={variant === 'thin' ? 'synapsas-input-select' : 'synapsas-sort-select'}
        >
          <span className="text-black">{displayLabel}</span>
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Portal dropdown to bypass z-index issues */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="synapsas-sort-dropdown"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            background: 'white',
            border: '2px solid #19181a',
            borderRadius: '0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            zIndex: 999999,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {options.map((option) => (
            <div key={option.value} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`synapsas-sort-option ${value === option.value ? 'selected' : ''}`}
                style={{ 
                  width: '100%', 
                  textAlign: 'left',
                  paddingRight: option.isCustom ? '40px' : '12px'
                }}
              >
                {option.label}
              </button>
              
              {option.isCustom && option.customModelId && onDeleteCustomModel && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomModel(option.customModelId!, option.value);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white bg-red-600 hover:text-red-600 hover:bg-white transition-all duration-200"
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  title="Delete custom model"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}

      <style jsx>{`
        /* Synapsas Sort Dropdown System */
        .synapsas-sort-field {
          position: relative;
          background-color: white;
          border: 2px solid #19181a;
          border-radius: 0;
          padding: 0;
          transition: all 0.3s ease;
        }

        .synapsas-input-field {
          position: relative;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0;
          padding: 0;
          transition: all 0.3s ease;
        }

        .synapsas-input-field:focus-within {
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
        }

        .synapsas-sort-field:focus-within {
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
        }

        .synapsas-sort-select {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          color: #19181a;
        }

        .synapsas-input-select {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          color: #19181a;
        }

        .synapsas-input-select:hover {
          opacity: 0.8;
        }

        .synapsas-sort-select:hover {
          opacity: 0.8;
        }

        .synapsas-sort-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          z-index: 15003;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 0.5rem;
        }

        .synapsas-sort-option {
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          color: #19181a;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .synapsas-sort-option:hover {
          background-color: #f3f4f6;
          padding-left: 1.25rem;
        }

        .synapsas-sort-option.selected {
          background-color: #19181a;
          color: white;
          font-weight: 600;
        }

        .synapsas-sort-option.selected:hover {
          background-color: #374151;
          color: white;
        }
      `}</style>
    </div>
  );
}