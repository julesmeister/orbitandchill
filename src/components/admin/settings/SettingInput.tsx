/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AdminSetting } from '@/types/adminSettings';
import { getSettingPlaceholder } from '@/utils/adminSettings';

interface SettingInputProps {
  setting: AdminSetting;
  value: any;
  isEdited: boolean;
  onChange: (key: string, value: any, type: string) => void;
}

export default function SettingInput({ setting, value, isEdited, onChange }: SettingInputProps) {
  const handleChange = (newValue: any) => {
    onChange(setting.key, newValue, setting.type);
  };

  switch (setting.type) {
    case 'boolean':
      return (
        <div className={`synapsas-checkbox-group ${isEdited ? 'bg-yellow-50 border-yellow-300' : ''}`}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleChange(e.target.checked)}
            className="synapsas-checkbox"
            id={`setting-${setting.key}`}
          />
          <label htmlFor={`setting-${setting.key}`} className="synapsas-checkbox-label">
            {value ? 'Enabled' : 'Disabled'}
          </label>
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className={`synapsas-input ${isEdited ? 'bg-yellow-50 border-yellow-300' : ''}`}
          placeholder={getSettingPlaceholder(setting)}
        />
      );

    case 'json':
      return (
        <textarea
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleChange(parsed);
            } catch {
              handleChange(e.target.value);
            }
          }}
          rows={4}
          className={`synapsas-input font-mono text-sm ${isEdited ? 'bg-yellow-50 border-yellow-300' : ''}`}
          placeholder={getSettingPlaceholder(setting)}
          style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
        />
      );

    default:
      return (
        <input
          type={setting.key.includes('password') ? 'password' : 'text'}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={`synapsas-input ${isEdited ? 'bg-yellow-50 border-yellow-300' : ''}`}
          placeholder={getSettingPlaceholder(setting)}
        />
      );
  }
}