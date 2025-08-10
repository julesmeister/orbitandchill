/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface TemperatureControlProps {
  temperature: number;
  onTemperatureChange: (temperature: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
}

const TemperatureControl: React.FC<TemperatureControlProps> = ({
  temperature,
  onTemperatureChange,
  label = "Creativity Level",
  min = 0,
  max = 1,
  step = 0.1,
}) => {
  return (
    <div>
      <label className="block text-sm font-space-grotesk font-semibold mb-2">
        {label}: {temperature}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={temperature}
        onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>Conservative</span>
        <span>Creative</span>
      </div>
    </div>
  );
};

export default TemperatureControl;