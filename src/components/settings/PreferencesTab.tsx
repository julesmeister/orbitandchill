/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import SettingsSection from './SettingsSection';
import SettingsItem from './SettingsItem';
import SynapsasDropdown from '../reusable/SynapsasDropdown';

export default function PreferencesTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* App Preferences */}
      <SettingsSection
        title="App Preferences"
        description="Customize your experience"
        headerColor="#6bdbff"
      >
        <div className="space-y-6">
          <SettingsItem
            title="Default Chart Theme"
            description="Choose your preferred chart appearance"
          >
            <SynapsasDropdown
              options={[
                { value: 'default', label: 'Default' },
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'colorful', label: 'Colorful' }
              ]}
              value="default"
              onChange={(value) => {/* Chart theme change handler */}}
              className="min-w-[150px]"
            />
          </SettingsItem>

          <SettingsItem
            title="Timezone"
            description="Your local timezone for accurate calculations"
          >
            <SynapsasDropdown
              options={[
                { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
                { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
                { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' }
              ]}
              value="UTC"
              onChange={(value) => {/* Timezone change handler */}}
              className="min-w-[250px]"
            />
          </SettingsItem>

          <SettingsItem
            title="Language"
            description="Interface language preference"
          >
            <SynapsasDropdown
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' }
              ]}
              value="en"
              onChange={(value) => {/* Language change handler */}}
              className="min-w-[120px]"
            />
          </SettingsItem>
        </div>
      </SettingsSection>

      {/* Display Preferences */}
      <SettingsSection
        title="Display Preferences"
        description="Interface and layout options"
        headerColor="#f2e356"
      >
        <div className="space-y-6">
          <SettingsItem
            title="Chart Animation Speed"
            description="Control chart rendering animations"
          >
            <SynapsasDropdown
              options={[
                { value: 'fast', label: 'Fast' },
                { value: 'normal', label: 'Normal' },
                { value: 'slow', label: 'Slow' },
                { value: 'none', label: 'No Animation' }
              ]}
              value="normal"
              onChange={(value) => {/* Animation speed change handler */}}
              className="min-w-[140px]"
            />
          </SettingsItem>

          <SettingsItem
            title="Default View Mode"
            description="Preferred chart view when opening"
          >
            <SynapsasDropdown
              options={[
                { value: 'wheel', label: 'Wheel View' },
                { value: 'table', label: 'Table View' },
                { value: 'aspects', label: 'Aspects View' }
              ]}
              value="wheel"
              onChange={(value) => {/* View mode change handler */}}
              className="min-w-[140px]"
            />
          </SettingsItem>
        </div>
      </SettingsSection>
    </div>
  );
}