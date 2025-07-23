/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function ToggleSwitch({ 
  enabled, 
  onChange, 
  disabled = false,
  className = ''
}: ToggleSwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-12 items-center border-2 border-black transition-colors ${
        enabled ? 'bg-black' : 'bg-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span
        className={`inline-block h-3 w-3 transform bg-white border border-black transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}