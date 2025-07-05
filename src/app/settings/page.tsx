"use client";

import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import StatusToast from '../../components/reusable/StatusToast';
import ConfirmationToast from '../../components/reusable/ConfirmationToast';
import SynapsasDropdown from '../../components/reusable/SynapsasDropdown';

export default function SettingsPage() {
  const { user, updatePrivacySettings, clearProfile } = useUserStore();
  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications' | 'account'>('preferences');
  const [showDataExportToast, setShowDataExportToast] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
        <section className="px-[5%] py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">
              Settings Not Available
            </h1>
            <p className="font-open-sans text-xl text-black/80">Please refresh the page to load your settings.</p>
          </div>
        </section>
      </div>
    );
  }

  const handlePrivacyUpdate = async (field: string, value: boolean) => {
    await updatePrivacySettings({ [field]: value });
  };

  const handleDataExport = () => {
    setShowDataExportToast(true);
    // Simulate export process
    setTimeout(() => {
      setShowDataExportToast(false);
    }, 3000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const performAccountDeletion = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Clear local data after successful deletion
      await clearProfile();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
      {/* Hero Section */}
      <section className="px-[5%] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-black">
          {/* Settings Info Section */}
          <div className="lg:col-span-3 p-8" style={{ backgroundColor: '#f2e356' }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 border-2 border-black bg-white p-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="font-space-grotesk text-3xl font-bold text-black">
                  Settings
                </h1>
                <p className="font-open-sans text-black/80">
                  Configure your preferences and account settings
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation Section */}
          <div className="lg:col-span-2 p-6 bg-white border-l border-black">
            <h3 className="font-space-grotesk text-base font-bold text-black mb-4">
              Quick Navigation
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left p-3 border border-black text-sm font-semibold transition-colors ${
                  activeTab === 'preferences' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left p-3 border border-black text-sm font-semibold transition-colors ${
                  activeTab === 'notifications' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left p-3 border border-black text-sm font-semibold transition-colors ${
                  activeTab === 'account' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Settings Content */}
      <section className="px-[5%] py-6">
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* App Preferences */}
            <div className="border border-black bg-white">
              <div className="p-6 border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
                <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">App Preferences</h2>
                <p className="font-open-sans text-sm text-black/80">Customize your experience</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Default Chart Theme
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Choose your preferred chart appearance
                      </p>
                    </div>
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
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Timezone
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Your local timezone for accurate calculations
                      </p>
                    </div>
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
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Language
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Interface language preference
                      </p>
                    </div>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Display Preferences */}
            <div className="border border-black bg-white">
              <div className="p-6 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
                <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">Display Preferences</h2>
                <p className="font-open-sans text-sm text-black/80">Interface and layout options</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Chart Animation Speed
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Control chart rendering animations
                      </p>
                    </div>
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
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Default View Mode
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Preferred chart view when opening
                      </p>
                    </div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <div className="border border-black bg-white">
              <div className="p-6 border-b border-black" style={{ backgroundColor: '#51bd94' }}>
                <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">Email Notifications</h2>
                <p className="font-open-sans text-sm text-black/80">Manage email preferences</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Email Notifications
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Receive important updates via email
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-black transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Weekly Newsletter
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Get our weekly astrology insights and updates
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-white transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Discussion Notifications
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Get notified about replies to your discussions
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-black transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Chart Reminders
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Receive reminders about astrological events
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-white transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Browser Notifications */}
            <div className="border border-black bg-white">
              <div className="p-6 border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
                <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">Browser Notifications</h2>
                <p className="font-open-sans text-sm text-black/80">Push notification settings</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Push Notifications
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Enable browser push notifications
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-white transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Real-time Alerts
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Instant notifications for urgent updates
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-black transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="border border-black p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                        Sound Notifications
                      </div>
                      <p className="font-open-sans text-xs text-black/60">
                        Play sound with notifications
                      </p>
                    </div>
                    <button className="relative inline-flex h-6 w-12 items-center border-2 border-black bg-white transition-colors">
                      <span className="inline-block h-3 w-3 transform bg-white border border-black translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Privacy Settings */}
              <div className="border border-black bg-white">
                <div className="p-6 border-b border-black" style={{ backgroundColor: '#ff91e9' }}>
                  <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">Privacy Settings</h2>
                  <p className="font-open-sans text-sm text-black/80">Control information visibility</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Show Zodiac Sign Publicly
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          Display sun sign in discussions
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyUpdate('showZodiacPublicly', !user.privacy.showZodiacPublicly)}
                        className={`relative inline-flex h-6 w-12 items-center border-2 border-black transition-colors ${
                          user.privacy.showZodiacPublicly ? 'bg-black' : 'bg-white'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform bg-white border border-black transition-transform ${
                            user.privacy.showZodiacPublicly ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Show Birth Information
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          Display birth details in profile
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyUpdate('showBirthInfoPublicly', !user.privacy.showBirthInfoPublicly)}
                        className={`relative inline-flex h-6 w-12 items-center border-2 border-black transition-colors ${
                          user.privacy.showBirthInfoPublicly ? 'bg-black' : 'bg-white'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform bg-white border border-black transition-transform ${
                            user.privacy.showBirthInfoPublicly ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Allow Direct Messages
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          Let users send private messages
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyUpdate('allowDirectMessages', !user.privacy.allowDirectMessages)}
                        className={`relative inline-flex h-6 w-12 items-center border-2 border-black transition-colors ${
                          user.privacy.allowDirectMessages ? 'bg-black' : 'bg-white'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform bg-white border border-black transition-transform ${
                            user.privacy.allowDirectMessages ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Show Online Status
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          Display when actively using site
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyUpdate('showOnlineStatus', !user.privacy.showOnlineStatus)}
                        className={`relative inline-flex h-6 w-12 items-center border-2 border-black transition-colors ${
                          user.privacy.showOnlineStatus ? 'bg-black' : 'bg-white'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform bg-white border border-black transition-transform ${
                            user.privacy.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="border border-black bg-white">
                <div className="p-6 border-b border-black" style={{ backgroundColor: '#51bd94' }}>
                  <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">Account Status</h2>
                  <p className="font-open-sans text-sm text-black/80">Your account information</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Account Type
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          {user.authProvider === 'anonymous' ? 'Anonymous account' : 'Registered account'}
                        </p>
                      </div>
                      <span 
                        className="px-3 py-1 text-xs font-semibold border border-black"
                        style={{ backgroundColor: '#e7fff6', color: '#000' }}
                      >
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Member Since
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
                          Export Your Data
                        </div>
                        <p className="font-open-sans text-xs text-black/60">
                          Download a copy of all your account data
                        </p>
                      </div>
                      <button
                        onClick={handleDataExport}
                        className="px-4 py-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors text-sm font-semibold"
                      >
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone - Separate Section */}
            <div className="border border-black bg-white">
              <div className="p-6 border-b border-black bg-red-500">
                <h2 className="font-space-grotesk text-xl font-bold text-white mb-1">Danger Zone</h2>
                <p className="font-open-sans text-sm text-white/90">Irreversible account actions</p>
              </div>
              <div className="p-6">
                <div className="border border-red-500 p-6 bg-red-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-space-grotesk text-lg font-semibold text-black mb-2">
                        Delete Your Account
                      </div>
                      <p className="font-open-sans text-sm text-black/70 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <div className="p-4 border border-red-300 bg-white">
                        <p className="font-open-sans text-xs text-red-800">
                          <strong>What gets deleted:</strong> Your profile, birth data, generated charts, forum posts, votes, and all personal information. Some content may be anonymized rather than deleted to preserve forum discussions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-red-600 text-white border border-red-600 hover:bg-red-700 transition-colors font-space-grotesk font-semibold"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Components */}
        {showDataExportToast && (
          <StatusToast
            title="Data Export"
            message="Data export feature coming soon! We'll notify you when it's available."
            status="info"
            isVisible={showDataExportToast}
            onHide={() => setShowDataExportToast(false)}
            duration={3000}
          />
        )}

        {showDeleteConfirmation && (
          <ConfirmationToast
            title="Delete Account"
            message="Are you sure you want to delete your account? This action cannot be undone."
            isVisible={showDeleteConfirmation}
            onConfirm={() => {
              setShowDeleteConfirmation(false);
              performAccountDeletion();
            }}
            onCancel={() => setShowDeleteConfirmation(false)}
            confirmText="Delete Account"
            confirmButtonColor="red"
          />
        )}

        {deleteError && (
          <StatusToast
            title="Deletion Failed"
            message={deleteError}
            status="error"
            isVisible={true}
            onHide={() => setDeleteError(null)}
            duration={5000}
          />
        )}

        {isDeleting && (
          <StatusToast
            title="Deleting Account"
            message="Please wait while we delete your account..."
            status="info"
            isVisible={true}
            onHide={() => {}}
            duration={0} // No auto-hide
          />
        )}
      </section>
    </div>
  );
}