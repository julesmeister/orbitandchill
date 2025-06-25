/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from 'react';
import { AdminSetting } from '@/types/adminSettings';
import { filterSettings, groupSettingsByCategory } from '@/utils/adminSettings';

export function useSettingsFilters(settings: AdminSetting[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredSettings = useMemo(() => {
    return filterSettings(settings, searchQuery);
  }, [settings, searchQuery]);

  const settingsByCategory = useMemo(() => {
    return groupSettingsByCategory(filteredSettings);
  }, [filteredSettings]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setShowAdvanced(false);
  };

  return {
    // State
    selectedCategory,
    searchQuery,
    showAdvanced,
    
    // Computed
    filteredSettings,
    settingsByCategory,
    
    // Actions
    setSelectedCategory,
    setSearchQuery,
    setShowAdvanced,
    resetFilters,
  };
}