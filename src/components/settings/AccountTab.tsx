/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import SettingsSection from './SettingsSection';
import SettingsItem from './SettingsItem';
import ToggleSwitch from './ToggleSwitch';
import StatusToast from '../reusable/StatusToast';
import ConfirmationToast from '../reusable/ConfirmationToast';

export default function AccountTab() {
  const { user, updatePrivacySettings, clearProfile } = useUserStore();
  const [showDataExportToast, setShowDataExportToast] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user) return null;

  const handlePrivacyUpdate = async (field: string, value: boolean) => {
    await updatePrivacySettings({ [field]: value });
  };

  const handleDataExport = () => {
    setShowDataExportToast(true);
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

      await clearProfile();
      window.location.href = '/';
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Privacy Settings */}
        <SettingsSection
          title="Privacy Settings"
          description="Control information visibility"
          headerColor="#ff91e9"
        >
          <div className="space-y-4">
            <SettingsItem
              title="Show Zodiac Sign Publicly"
              description="Display sun sign in discussions"
            >
              <ToggleSwitch
                enabled={user.privacy.showZodiacPublicly}
                onChange={(enabled) => handlePrivacyUpdate('showZodiacPublicly', enabled)}
              />
            </SettingsItem>

            <SettingsItem
              title="Show Birth Information"
              description="Display birth details in profile"
            >
              <ToggleSwitch
                enabled={user.privacy.showBirthInfoPublicly}
                onChange={(enabled) => handlePrivacyUpdate('showBirthInfoPublicly', enabled)}
              />
            </SettingsItem>

            <SettingsItem
              title="Allow Direct Messages"
              description="Let users send private messages"
            >
              <ToggleSwitch
                enabled={user.privacy.allowDirectMessages}
                onChange={(enabled) => handlePrivacyUpdate('allowDirectMessages', enabled)}
              />
            </SettingsItem>

            <SettingsItem
              title="Show Online Status"
              description="Display when actively using site"
            >
              <ToggleSwitch
                enabled={user.privacy.showOnlineStatus}
                onChange={(enabled) => handlePrivacyUpdate('showOnlineStatus', enabled)}
              />
            </SettingsItem>
          </div>
        </SettingsSection>

        {/* Account Status */}
        <SettingsSection
          title="Account Status"
          description="Your account information"
          headerColor="#51bd94"
        >
          <div className="space-y-4">
            <SettingsItem
              title="Account Type"
              description={user.authProvider === 'anonymous' ? 'Anonymous account' : 'Registered account'}
            >
              <span 
                className="px-3 py-1 text-xs font-semibold border border-black"
                style={{ backgroundColor: '#e7fff6', color: '#000' }}
              >
                Active
              </span>
            </SettingsItem>

            <SettingsItem
              title="Member Since"
              description={new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            >
              <div />
            </SettingsItem>

            <SettingsItem
              title="Export Your Data"
              description="Download a copy of all your account data"
            >
              <button
                onClick={handleDataExport}
                className="px-4 py-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors text-sm font-semibold"
              >
                Export Data
              </button>
            </SettingsItem>
          </div>
        </SettingsSection>
      </div>

      {/* Danger Zone - Separate Section */}
      <SettingsSection
        title="Danger Zone"
        description="Irreversible account actions"
        headerColor="#ef4444"
        className="border-red-500"
      >
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
      </SettingsSection>

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
          duration={0}
        />
      )}
    </div>
  );
}