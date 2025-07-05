/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { type UserPreferences as UserPreferencesType } from '../../app/api/users/preferences/route';
import { toast } from 'sonner';

interface PreferencesSection {
  title: string;
  description: string;
  preferences: Array<{
    key: keyof UserPreferencesType;
    label: string;
    description: string;
    type: 'toggle' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
}

const preferenceSections: PreferencesSection[] = [
  {
    title: 'Privacy Settings',
    description: 'Control what information is visible to other users',
    preferences: [
      {
        key: 'showZodiacPublicly',
        label: 'Show zodiac sign publicly',
        description: 'Display your sun sign on your public profile',
        type: 'toggle'
      },
      {
        key: 'showStelliumsPublicly',
        label: 'Show stelliums publicly',
        description: 'Display your stellium information on your public profile',
        type: 'toggle'
      },
      {
        key: 'showBirthInfoPublicly',
        label: 'Show birth information publicly',
        description: 'Display your birth location and date on your public profile',
        type: 'toggle'
      },
      {
        key: 'allowDirectMessages',
        label: 'Allow direct messages',
        description: 'Let other users send you direct messages',
        type: 'toggle'
      },
      {
        key: 'showOnlineStatus',
        label: 'Show online status',
        description: 'Display when you are active on the platform',
        type: 'toggle'
      }
    ]
  },
  {
    title: 'Notifications',
    description: 'Manage how you receive updates and notifications',
    preferences: [
      {
        key: 'emailNotifications',
        label: 'Email notifications',
        description: 'Receive important updates via email',
        type: 'toggle'
      },
      {
        key: 'weeklyNewsletter',
        label: 'Weekly newsletter',
        description: 'Get our weekly astrology insights and updates',
        type: 'toggle'
      },
      {
        key: 'discussionNotifications',
        label: 'Discussion notifications',
        description: 'Get notified about replies to your discussions',
        type: 'toggle'
      },
      {
        key: 'chartReminders',
        label: 'Chart reminders',
        description: 'Receive reminders about astrological events',
        type: 'toggle'
      }
    ]
  },
  {
    title: 'Application Settings',
    description: 'Customize your app experience',
    preferences: [
      {
        key: 'defaultChartTheme',
        label: 'Default chart theme',
        description: 'Choose your preferred chart appearance',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
          { value: 'colorful', label: 'Colorful' }
        ]
      },
      {
        key: 'timezone',
        label: 'Timezone',
        description: 'Your local timezone for accurate calculations',
        type: 'select',
        options: [
          { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
          { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
          { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
          { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
          { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
          { value: 'Europe/London', label: 'London' },
          { value: 'Europe/Paris', label: 'Paris' },
          { value: 'Europe/Berlin', label: 'Berlin' },
          { value: 'Asia/Tokyo', label: 'Tokyo' },
          { value: 'Asia/Shanghai', label: 'Shanghai' },
          { value: 'Australia/Sydney', label: 'Sydney' }
        ]
      },
      {
        key: 'language',
        label: 'Language',
        description: 'Interface language preference',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Español' },
          { value: 'fr', label: 'Français' },
          { value: 'de', label: 'Deutsch' },
          { value: 'it', label: 'Italiano' },
          { value: 'pt', label: 'Português' }
        ]
      }
    ]
  }
];

export default function UserPreferences() {
  const { user } = useUserStore();
  const [preferences, setPreferences] = useState<UserPreferencesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/users/preferences?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPreferences(data.preferences);
        } else {
          toast.error('Failed to load preferences');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        toast.error('Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handlePreferenceChange = (key: keyof UserPreferencesType, value: string | boolean) => {
    if (!preferences) return;

    setPreferences(prev => ({
      ...prev!,
      [key]: value
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    if (!user || !preferences || !hasChanges) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/users/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          preferences
        })
      });

      if (response.ok) {
        setHasChanges(false);
        toast.success('Preferences saved successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountDeletionRequest = async (requestType: 'immediate' | 'grace_period') => {
    if (!user) return;

    setIsDeletionLoading(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          requestedBy: 'self',
          requestType,
          reason: deletionReason.trim() || undefined,
          gracePeriodDays: requestType === 'grace_period' ? 30 : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (requestType === 'immediate') {
          toast.success('Account deletion requested. Please check your email to confirm.');
        } else {
          toast.success('Account scheduled for deletion in 30 days. You can cancel anytime before then.');
        }
        
        setShowDeleteModal(false);
        setDeletionReason('');
      } else {
        const error = await response.json();
        if (response.status === 409) {
          toast.error('Account deletion already requested. Check your email or contact support.');
        } else {
          toast.error(error.error || 'Failed to request account deletion');
        }
      }
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast.error('Failed to request account deletion');
    } finally {
      setIsDeletionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-12 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Failed to load preferences. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full mx-4">
            <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">
              Delete Your Account
            </h3>
            <div className="mb-6">
              <p className="font-open-sans text-sm text-black mb-4">
                We're sorry to see you go! Please help us understand why you're leaving (optional):
              </p>
              <textarea
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                placeholder="Reason for leaving..."
                className="w-full border border-black rounded p-3 font-open-sans text-sm h-20 resize-none"
                maxLength={500}
              />
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-yellow-50 border border-yellow-300">
                  <h4 className="font-open-sans text-sm font-medium text-black">Scheduled Deletion (Recommended)</h4>
                  <p className="font-open-sans text-xs text-black/70 mt-1">
                    Schedule deletion in 30 days. You can cancel anytime before then.
                  </p>
                </div>
                <div className="p-3 bg-red-50 border border-red-300">
                  <h4 className="font-open-sans text-sm font-medium text-black">Immediate Deletion</h4>
                  <p className="font-open-sans text-xs text-black/70 mt-1">
                    Request immediate deletion. Requires email confirmation.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAccountDeletionRequest('grace_period')}
                disabled={isDeletionLoading}
                className="flex-1 px-4 py-2 font-open-sans text-sm font-medium text-black bg-yellow-100 border border-black hover:bg-yellow-200 disabled:opacity-50 transition-colors"
              >
                {isDeletionLoading ? 'Processing...' : 'Schedule Deletion'}
              </button>
              <button
                onClick={() => handleAccountDeletionRequest('immediate')}
                disabled={isDeletionLoading}
                className="flex-1 px-4 py-2 font-open-sans text-sm font-medium text-white bg-red-600 border border-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeletionLoading ? 'Processing...' : 'Delete Now'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeletionLoading}
                className="px-4 py-2 font-open-sans text-sm font-medium text-black bg-white border border-black hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-space-grotesk text-3xl font-bold text-black mb-2">
          Account Preferences
        </h1>
        <p className="font-open-sans text-black/70">
          Customize your experience and manage your privacy settings
        </p>
      </div>

      {/* Preferences Sections */}
      <div className="space-y-8">
        {preferenceSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-black rounded-lg bg-white">
            {/* Section Header */}
            <div className="p-6 border-b border-black/20">
              <h2 className="font-space-grotesk text-xl font-bold text-black mb-2">
                {section.title}
              </h2>
              <p className="font-open-sans text-sm text-black/70">
                {section.description}
              </p>
            </div>

            {/* Section Content */}
            <div className="p-6 space-y-6">
              {section.preferences.map((pref, prefIndex) => (
                <div key={prefIndex} className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <label className="font-open-sans font-medium text-black mb-1 block">
                      {pref.label}
                    </label>
                    <p className="font-open-sans text-sm text-black/60">
                      {pref.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {pref.type === 'toggle' ? (
                      <button
                        onClick={() => handlePreferenceChange(pref.key, !preferences[pref.key])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[pref.key] ? 'bg-black' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[pref.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <select
                        value={preferences[pref.key] as string}
                        onChange={(e) => handlePreferenceChange(pref.key, e.target.value)}
                        className="border border-black rounded px-3 py-2 font-open-sans text-sm min-w-[200px]"
                      >
                        {pref.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Account Management Section */}
        <div className="border border-black rounded-lg bg-white">
          {/* Section Header */}
          <div className="p-6 border-b border-black/20">
            <h2 className="font-space-grotesk text-xl font-bold text-black mb-2">
              Account Management
            </h2>
            <p className="font-open-sans text-sm text-black/70">
              Manage your account data and deletion options
            </p>
          </div>

          {/* Section Content */}
          <div className="p-6 space-y-6">
            {/* Data Export */}
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <label className="font-open-sans font-medium text-black mb-1 block">
                  Export Your Data
                </label>
                <p className="font-open-sans text-sm text-black/60">
                  Download a copy of all your account data including charts, discussions, and settings
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => toast.info('Data export feature coming soon')}
                  className="px-4 py-2 font-open-sans text-sm font-medium text-black bg-white border border-black hover:bg-gray-100 transition-colors"
                >
                  Export Data
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <label className="font-open-sans font-medium text-black mb-1 block">
                  Account Status
                </label>
                <p className="font-open-sans text-sm text-black/60">
                  Your account is currently active. You have {user?.authProvider === 'anonymous' ? 'an anonymous' : 'a registered'} account.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-1 font-open-sans text-sm font-medium bg-green-100 text-green-800 border border-green-300 rounded">
                  Active
                </span>
              </div>
            </div>

            {/* Account Deletion */}
            <div className="border-t border-red-200 pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <label className="font-open-sans font-medium text-red-600 mb-1 block">
                    Delete Your Account
                  </label>
                  <p className="font-open-sans text-sm text-black/60">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-open-sans text-xs text-red-800">
                      <strong>What gets deleted:</strong> Your profile, birth data, generated charts, forum posts, 
                      votes, and all personal information. Some content may be anonymized rather than deleted 
                      to preserve forum discussions.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 font-open-sans text-sm font-medium text-white bg-red-600 border border-red-600 hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-black/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}