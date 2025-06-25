"use client";

import React, { useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface SynapsasDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SynapsasDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = ""
}: SynapsasDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="synapsas-sort-field">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="synapsas-sort-select"
        >
          <span className="text-black">{displayLabel}</span>
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="synapsas-sort-dropdown">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`synapsas-sort-option ${value === option.value ? 'selected' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

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
          z-index: 60;
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
      `}</style>
    </div>
  );
}