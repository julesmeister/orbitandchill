/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface SettingsHeaderProps {
  hasUnsavedChanges: boolean;
  editedSettingsCount: number;
  isResetting: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
}

export default function SettingsHeader({
  hasUnsavedChanges,
  editedSettingsCount,
  isResetting,
  isSaving,
  onReset,
  onSave
}: SettingsHeaderProps) {
  return (
    <section className="px-[5%] py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-space-grotesk text-3xl font-bold text-black">Admin Settings</h1>
            <p className="font-inter text-base text-black/70 mt-1">
              Configure application settings and system behavior
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="px-3 py-2 text-sm font-inter font-medium text-yellow-800 bg-yellow-100 border border-yellow-300">
                {editedSettingsCount} unsaved change{editedSettingsCount !== 1 ? 's' : ''}
              </div>
            )}
            <button
              onClick={onReset}
              disabled={isResetting}
              className={`synapsas-submit-button ${isResetting ? 'disabled' : ''} bg-white text-black border-black hover:bg-gray-100`}
              style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              {isResetting ? 'Resetting...' : 'Reset to Defaults'}
            </button>
            <button
              onClick={onSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`synapsas-submit-button ${isSaving || !hasUnsavedChanges ? 'disabled' : 'primary'}`}
              style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}