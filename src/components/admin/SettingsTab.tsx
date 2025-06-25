/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import SettingsHeader from './settings/SettingsHeader';
import SettingsFilters from './settings/SettingsFilters';
import SettingsNotification from './settings/SettingsNotification';
import SettingsCategory from './settings/SettingsCategory';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useSettingsFilters } from '@/hooks/useSettingsFilters';
import { CATEGORY_INFO } from '@/utils/adminSettings';

interface SettingsTabProps {
  isLoading?: boolean;
}

export default function SettingsTab({ isLoading: externalLoading = false }: SettingsTabProps) {
  // Filter state management
  const {
    selectedCategory,
    searchQuery,
    showAdvanced,
    settingsByCategory,
    setSelectedCategory,
    setSearchQuery,
    setShowAdvanced,
  } = useSettingsFilters([]);

  // Main settings state and actions
  const {
    settings,
    categories,
    editedSettings,
    expandedCategories,
    isLoading,
    isSaving,
    isResetting,
    notification,
    hasUnsavedChanges,
    editedSettingsCount,
    saveSettings,
    resetSettings,
    updateSetting,
    toggleCategory,
    getSettingValue,
  } = useAdminSettings(selectedCategory, searchQuery);

  // Update filters when settings change  
  const filtersWithSettings = useSettingsFilters(settings);
  const finalSettingsByCategory = filtersWithSettings.settingsByCategory;

  if (isLoading) {
    return (
      <div className="bg-white">
        <section className="px-[5%] py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="mt-4 font-inter text-black">Loading settings...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SettingsHeader
        hasUnsavedChanges={hasUnsavedChanges}
        editedSettingsCount={editedSettingsCount}
        isResetting={isResetting}
        isSaving={isSaving}
        onReset={() => resetSettings(selectedCategory)}
        onSave={saveSettings}
      />

      <SettingsNotification notification={notification} />

      <SettingsFilters
        categories={categories}
        categoryInfo={CATEGORY_INFO}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        showAdvanced={showAdvanced}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        onAdvancedToggle={setShowAdvanced}
      />

      {/* Settings Categories */}
      <section className="px-[5%] py-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-3">
            {Object.entries(finalSettingsByCategory).map(([category, categorySettings]) => {
              const info = CATEGORY_INFO[category] || { name: category, description: '', icon: '⚙️' };
              const isExpanded = expandedCategories.has(category);

              return (
                <SettingsCategory
                  key={category}
                  category={category}
                  settings={categorySettings}
                  categoryInfo={info}
                  isExpanded={isExpanded}
                  editedSettings={editedSettings}
                  showAdvanced={showAdvanced}
                  onToggle={() => toggleCategory(category)}
                  onSettingChange={updateSetting}
                  getSettingValue={getSettingValue}
                />
              );
            })}
          </div>
        </div>
      </section>

      {Object.keys(finalSettingsByCategory).length === 0 && (
        <section className="px-[5%] py-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-8 border border-black bg-white">
              <svg className="mx-auto h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="mt-3 font-space-grotesk text-base font-bold text-black">No settings found</h3>
              <p className="mt-1 font-inter text-xs text-black/70">
                {searchQuery ? 'Try adjusting your search criteria.' : 'No settings available in this category.'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}