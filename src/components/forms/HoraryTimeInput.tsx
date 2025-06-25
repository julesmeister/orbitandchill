/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface HoraryTimeInputProps {
  timeInput: { hours: string; minutes: string; period: string };
  onTimeChange: (field: 'hours' | 'minutes' | 'period', value: string) => void;
}

const HoraryTimeInput = React.memo(({
  timeInput,
  onTimeChange
}: HoraryTimeInputProps) => (
  <div className="p-4 border-b border-black">
    <label className="synapsas-label mb-3 block">
      Time <span className="text-red-500">*</span>
    </label>
    <div className="flex items-center space-x-3">
      <input
        type="number"
        min="1"
        max="12"
        value={timeInput.hours}
        onChange={(e) => onTimeChange('hours', e.target.value)}
        placeholder="12"
        className="synapsas-time-input w-16 text-center"
        required
      />
      <span className="text-xl font-bold text-gray-400">:</span>
      <input
        type="text"
        value={timeInput.minutes}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,2}$/.test(value) && (value === '' || parseInt(value) <= 59)) {
            onTimeChange('minutes', value);
          }
        }}
        placeholder="00"
        className="synapsas-time-input w-16 text-center"
        maxLength={2}
        required
      />
      <div className="flex bg-white">
        <button
          type="button"
          onClick={() => onTimeChange('period', 'AM')}
          className={`group relative px-3 py-3 text-sm font-semibold border border-black transition-all duration-300 overflow-hidden ${
            timeInput.period === 'AM' 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
          style={{ height: '56px' }}
        >
          {timeInput.period !== 'AM' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          )}
          <span className="relative">AM</span>
        </button>
        <button
          type="button"
          onClick={() => onTimeChange('period', 'PM')}
          className={`group relative px-3 py-3 text-sm font-semibold border-t border-r border-b border-black transition-all duration-300 overflow-hidden ${
            timeInput.period === 'PM' 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
          style={{ height: '56px' }}
        >
          {timeInput.period !== 'PM' && (
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
          )}
          <span className="relative">PM</span>
        </button>
      </div>
    </div>
  </div>
));

HoraryTimeInput.displayName = 'HoraryTimeInput';

export default HoraryTimeInput;
