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
    <div className="bg-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-space-grotesk text-2xl font-bold text-black">Admin Settings</h1>
          <p className="font-inter text-sm text-black/70 mt-0.5">
            Configure application settings and system behavior
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <div className="px-2 py-1 text-xs font-inter font-medium text-black bg-white border border-black">
              {editedSettingsCount} unsaved change{editedSettingsCount !== 1 ? 's' : ''}
            </div>
          )}
          <button
            onClick={onReset}
            disabled={isResetting}
            className={`synapsas-submit-button ${isResetting ? 'disabled' : ''} bg-white text-black border-black hover:bg-gray-100`}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            {isResetting ? 'Resetting...' : 'Reset to Defaults'}
          </button>
          <button
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`synapsas-submit-button ${isSaving || !hasUnsavedChanges ? 'disabled' : 'primary'}`}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}