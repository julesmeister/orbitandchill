/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useRef, useEffect } from 'react';

interface TimeInputProps {
  timeInput: { hours: string; minutes: string; period: string };
  onTimeChange: (field: 'hours' | 'minutes' | 'period', value: string) => void;
}

const TimeInput = React.memo(({ timeInput, onTimeChange }: TimeInputProps) => {
  const [showMinutesPicker, setShowMinutesPicker] = useState(false);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const minutesDropdownRef = useRef<HTMLDivElement>(null);

  const handleTimeInputChange = useCallback((field: 'hours' | 'minutes' | 'period', value: string) => {
    onTimeChange(field, value);
  }, [onTimeChange]);

  // Generate minutes options (00, 01, 02, ..., 59)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Handle clicking outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        minutesDropdownRef.current &&
        !minutesDropdownRef.current.contains(event.target as Node) &&
        minutesInputRef.current &&
        !minutesInputRef.current.contains(event.target as Node)
      ) {
        setShowMinutesPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinuteSelect = useCallback((minute: string) => {
    handleTimeInputChange('minutes', minute);
    setShowMinutesPicker(false);
    minutesInputRef.current?.blur();
  }, [handleTimeInputChange]);

  return (
    <div className="flex items-center gap-3 relative" style={{ zIndex: 500 }}>
      <div className="synapsas-time-field">
        <input
          type="number"
          min="1"
          max="12"
          value={timeInput.hours}
          onChange={(e) => handleTimeInputChange('hours', e.target.value)}
          placeholder="12"
          className="synapsas-time-input"
          required
        />
      </div>
      <span className="text-2xl font-bold text-gray-400">:</span>
      <div 
        className="synapsas-time-field relative" 
        style={{ 
          zIndex: 1000,
          isolation: 'isolate',
          transform: 'translateZ(0)'
        }}
      >
        <input
          ref={minutesInputRef}
          type="text"
          value={timeInput.minutes}
          onChange={(e) => {
            const value = e.target.value;
            // Allow empty string, or 1-2 digits with valid minute values (00-59)
            if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value) <= 59)) {
              handleTimeInputChange('minutes', value);
            }
          }}
          onFocus={() => setShowMinutesPicker(true)}
          onBlur={(e) => {
            // Small delay to allow clicking on dropdown options
            setTimeout(() => {
              if (!minutesDropdownRef.current?.contains(document.activeElement)) {
                const value = e.target.value;
                if (value.length === 1 && /^\d$/.test(value)) {
                  handleTimeInputChange('minutes', value.padStart(2, '0'));
                }
              }
            }, 150);
          }}
          placeholder="00"
          className="synapsas-time-input"
          maxLength={2}
          required
        />
        
        {/* Minutes Picker Dropdown */}
        {showMinutesPicker && (
          <div
            ref={minutesDropdownRef}
            className="absolute bg-white border border-gray-300 max-h-48 overflow-y-auto"
            style={{ 
              top: '100%',
              left: '0',
              width: '240px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              borderRadius: '0',
              zIndex: 1001,
              transform: 'translateZ(0)',
              isolation: 'isolate',
              position: 'absolute'
            }}
          >
            <div className="grid grid-cols-6 gap-0">
              {minutesOptions.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleMinuteSelect(minute)}
                  className={`
                    w-full h-10 text-sm font-medium border-b border-r border-gray-100 transition-all duration-200 ease-in-out
                    ${timeInput.minutes === minute 
                      ? 'bg-gray-900 text-white font-semibold' 
                      : 'text-gray-900 bg-transparent hover:bg-gray-50'
                    }
                  `}
                  style={{ borderRadius: '0' }}
                >
                  {minute}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="synapsas-period-selector">
        <button
          type="button"
          onClick={() => handleTimeInputChange('period', 'AM')}
          className={`synapsas-period-button ${timeInput.period === 'AM' ? 'active' : ''}`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => handleTimeInputChange('period', 'PM')}
          className={`synapsas-period-button ${timeInput.period === 'PM' ? 'active' : ''}`}
        >
          PM
        </button>
      </div>
    </div>
  );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;