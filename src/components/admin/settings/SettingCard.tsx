/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import SettingInput from './SettingInput';
import { AdminSetting } from '@/types/adminSettings';
import { isAdvancedSetting, getSettingDisplayName } from '@/utils/adminSettings';

interface SettingCardProps {
  setting: AdminSetting;
  value: any;
  isEdited: boolean;
  showAdvanced: boolean;
  onChange: (key: string, value: any, type: string) => void;
}

export default function SettingCard({ 
  setting, 
  value, 
  isEdited, 
  showAdvanced, 
  onChange 
}: SettingCardProps) {
  const isAdvanced = isAdvancedSetting(setting);

  if (isAdvanced && !showAdvanced) {
    return null;
  }

  return (
    <div className={`synapsas-input-group p-4 border border-black ${isEdited ? 'bg-yellow-50 border-yellow-300' : 'bg-white'}`}>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <label className="synapsas-label">
          {getSettingDisplayName(setting.key)}
        </label>
        {setting.isRequired && (
          <span className="text-red-500 text-sm font-bold">*</span>
        )}
        {isAdvanced && (
          <span className="text-xs font-open-sans font-medium text-white bg-gray-800 px-2 py-1">
            Advanced
          </span>
        )}
        {isEdited && (
          <span className="text-xs font-open-sans font-medium text-white bg-yellow-600 px-2 py-1">
            Modified
          </span>
        )}
      </div>
      
      {setting.description && (
        <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{setting.description}</span>
        </div>
      )}
      
      <div className="mb-3">
        <SettingInput
          setting={setting}
          value={value}
          isEdited={isEdited}
          onChange={onChange}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-t border-gray-200 pt-2">
        <span className="truncate">{setting.key}</span>
        <span className="bg-gray-100 px-2 py-1 text-gray-600">{setting.type}</span>
      </div>
    </div>
  );
}