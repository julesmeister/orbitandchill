"use client";

import { useState, useRef, useEffect } from 'react';

interface AdminDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export default function AdminDropdown({ options, value, onChange, className = '', label }: AdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black flex items-center justify-between min-w-[140px]"
      >
        <span>{value}</span>
        <svg className="w-4 h-4 text-black ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 z-50 max-height-200 overflow-y-auto mt-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 hover:pl-5 transition-all duration-200 border-none cursor-pointer font-inter ${
                value === option ? 'bg-black text-white font-semibold hover:!bg-gray-800 hover:!text-white' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}