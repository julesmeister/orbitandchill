/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback } from 'react';

interface TimeInputProps {
  timeInput: { hours: string; minutes: string; period: string };
  onTimeChange: (field: 'hours' | 'minutes' | 'period', value: string) => void;
}

const TimeInput = React.memo(({ timeInput, onTimeChange }: TimeInputProps) => {
  const handleTimeInputChange = useCallback((field: 'hours' | 'minutes' | 'period', value: string) => {
    onTimeChange(field, value);
  }, [onTimeChange]);

  return (
    <div className="flex items-center gap-3">
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
      <div className="synapsas-time-field">
        <input
          type="text"
          value={timeInput.minutes}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,2}$/.test(value)) {
              handleTimeInputChange('minutes', value);
            }
          }}
          placeholder="00"
          className="synapsas-time-input"
          maxLength={2}
          required
        />
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