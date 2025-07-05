/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import SettingCard from './SettingCard';
import { AdminSetting, CategoryInfo } from '@/types/adminSettings';
import { getCategoryColor } from '@/utils/adminSettings';

interface SettingsCategoryProps {
  category: string;
  settings: AdminSetting[];
  categoryInfo: CategoryInfo;
  isExpanded: boolean;
  editedSettings: Record<string, any>;
  showAdvanced: boolean;
  onToggle: () => void;
  onSettingChange: (key: string, value: any, type: string) => void;
  getSettingValue: (setting: AdminSetting) => any;
}

export default function SettingsCategory({
  category,
  settings,
  categoryInfo,
  isExpanded,
  editedSettings,
  showAdvanced,
  onToggle,
  onSettingChange,
  getSettingValue
}: SettingsCategoryProps) {

  return (
    <div className="bg-white border border-black">
      <div
        className="px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity"
        style={{ backgroundColor: getCategoryColor(category) }}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white text-sm">{categoryInfo.icon}</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-base font-bold text-black">{categoryInfo.name}</h3>
              <p className="font-open-sans text-xs text-black/80">{categoryInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-open-sans text-xs font-medium text-black px-2 py-1 bg-white border border-black">
              {settings.length}
            </span>
            <svg
              className={`w-4 h-4 text-black transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-white border-t border-black">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.map((setting) => (
                <SettingCard
                  key={setting.key}
                  setting={setting}
                  value={getSettingValue(setting)}
                  isEdited={editedSettings.hasOwnProperty(setting.key)}
                  showAdvanced={showAdvanced}
                  onChange={onSettingChange}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}