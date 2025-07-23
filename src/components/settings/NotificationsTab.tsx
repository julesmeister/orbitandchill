/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import SettingsSection from './SettingsSection';
import SettingsItem from './SettingsItem';
import ToggleSwitch from './ToggleSwitch';

export default function NotificationsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Email Notifications */}
      <SettingsSection
        title="Email Notifications"
        description="Manage email preferences"
        headerColor="#51bd94"
      >
        <div className="space-y-4">
          <SettingsItem
            title="Email Notifications"
            description="Receive important updates via email"
          >
            <ToggleSwitch
              enabled={true}
              onChange={(enabled) => {/* Email notifications handler */}}
            />
          </SettingsItem>

          <SettingsItem
            title="Weekly Newsletter"
            description="Get our weekly astrology insights and updates"
          >
            <ToggleSwitch
              enabled={false}
              onChange={(enabled) => {/* Newsletter handler */}}
            />
          </SettingsItem>

          <SettingsItem
            title="Discussion Notifications"
            description="Get notified about replies to your discussions"
          >
            <ToggleSwitch
              enabled={true}
              onChange={(enabled) => {/* Discussion notifications handler */}}
            />
          </SettingsItem>

          <SettingsItem
            title="Chart Reminders"
            description="Receive reminders about astrological events"
          >
            <ToggleSwitch
              enabled={false}
              onChange={(enabled) => {/* Chart reminders handler */}}
            />
          </SettingsItem>
        </div>
      </SettingsSection>

      {/* Browser Notifications */}
      <SettingsSection
        title="Browser Notifications"
        description="Push notification settings"
        headerColor="#6bdbff"
      >
        <div className="space-y-4">
          <SettingsItem
            title="Push Notifications"
            description="Enable browser push notifications"
          >
            <ToggleSwitch
              enabled={false}
              onChange={(enabled) => {/* Push notifications handler */}}
            />
          </SettingsItem>

          <SettingsItem
            title="Real-time Alerts"
            description="Instant notifications for urgent updates"
          >
            <ToggleSwitch
              enabled={true}
              onChange={(enabled) => {/* Real-time alerts handler */}}
            />
          </SettingsItem>

          <SettingsItem
            title="Sound Notifications"
            description="Play sound with notifications"
          >
            <ToggleSwitch
              enabled={false}
              onChange={(enabled) => {/* Sound notifications handler */}}
            />
          </SettingsItem>
        </div>
      </SettingsSection>
    </div>
  );
}