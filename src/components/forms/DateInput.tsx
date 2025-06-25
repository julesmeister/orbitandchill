/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DateInputProps {
  dateInput: { month: string; day: string; year: string };
  onDateChange: (field: 'month' | 'day' | 'year', value: string) => void;
}

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const DateInput = React.memo(({ dateInput, onDateChange }: DateInputProps) => {
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Close month dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
    };

    if (showMonthDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMonthDropdown]);

  const handleMonthSelect = useCallback((value: string) => {
    onDateChange('month', value);
    setShowMonthDropdown(false);
  }, [onDateChange]);

  const getMonthLabel = useCallback((value: string) => {
    if (!value) return 'Month';
    const month = MONTHS.find(m => m.value === value);
    return month ? month.label : 'Month';
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="synapsas-date-field month-field relative" ref={monthDropdownRef}>
        <button
          type="button"
          onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          className="synapsas-date-select"
        >
          <span className={dateInput.month ? 'text-black' : 'text-gray-400'}>
            {getMonthLabel(dateInput.month)}
          </span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showMonthDropdown && (
          <div className="synapsas-month-dropdown">
            {MONTHS.map((month) => (
              <button
                key={month.value}
                type="button"
                onClick={() => handleMonthSelect(month.value)}
                className={`synapsas-month-option ${dateInput.month === month.value ? 'selected' : ''}`}
              >
                {month.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="synapsas-date-field">
        <input
          type="number"
          min="1"
          max="31"
          value={dateInput.day}
          onChange={(e) => onDateChange('day', e.target.value)}
          placeholder="Day"
          className="synapsas-date-input"
          required
        />
      </div>
      <div className="synapsas-date-field">
        <input
          type="number"
          min="1900"
          max="2030"
          value={dateInput.year}
          onChange={(e) => onDateChange('year', e.target.value)}
          placeholder="Year"
          className="synapsas-date-input"
          required
        />
      </div>
    </div>
  );
});

DateInput.displayName = 'DateInput';

export default DateInput;