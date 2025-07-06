/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useNotifications } from '@/hooks/useNotifications';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

interface NotificationPreferencesProps {
  className?: string;
}

/**
 * Notification preferences and settings component
 */
export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  className = ''
}) => {
  const { user } = useUserStore();
  const { preferences, isLoadingPreferences, updatePreferences } = useNotifications();
  const { connectionStatus, lastHeartbeat, connect, disconnect, isConnected } = useRealtimeNotifications({
    userId: user?.id,
    autoConnect: false
  });
  
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: string, value: any) => {
    setLocalPreferences(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!localPreferences || !user?.id) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const success = await updatePreferences(localPreferences);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRealtimeToggle = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect(user?.id);
    }
  };

  if (isLoadingPreferences) {
    return (
      <div className={`p-6 bg-white rounded-lg border ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!localPreferences) {
    return (
      <div className={`p-6 bg-white rounded-lg border ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Preferences</h3>
        <p className="text-gray-600">Unable to load notification preferences.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        <ConnectionStatus 
          status={connectionStatus}
          lastHeartbeat={lastHeartbeat}
          showText={false}
        />
      </div>

      <div className="space-y-6">
        {/* Real-time Notifications */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-blue-900">Real-time Notifications</h4>
              <p className="text-sm text-blue-700">Get instant notifications without page refresh</p>
            </div>
            <button
              onClick={handleRealtimeToggle}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isConnected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </button>
          </div>
          
          <ConnectionStatus 
            status={connectionStatus}
            lastHeartbeat={lastHeartbeat}
            showText={true}
          />
        </div>

        {/* Email Notifications */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.enableEmail || false}
                onChange={(e) => handlePreferenceChange('enableEmail', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Enable email notifications</span>
            </label>
            
            <label className="flex items-center ml-6">
              <input
                type="checkbox"
                checked={localPreferences.dailyDigest || false}
                onChange={(e) => handlePreferenceChange('dailyDigest', e.target.checked)}
                disabled={!localPreferences.enableEmail}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="ml-2 text-gray-700">Daily email digest</span>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Browser Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.enablePush || false}
                onChange={(e) => handlePreferenceChange('enablePush', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Show browser notifications</span>
            </label>
            
            <label className="flex items-center ml-6">
              <input
                type="checkbox"
                checked={localPreferences.enableInApp || false}
                onChange={(e) => handlePreferenceChange('enableInApp', e.target.checked)}
                disabled={!localPreferences.enablePush}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="ml-2 text-gray-700">Play notification sound</span>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.socialNotifications?.in_app !== false}
                onChange={(e) => handlePreferenceChange('socialNotifications', { ...localPreferences.socialNotifications, in_app: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Discussion replies</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.socialNotifications?.in_app !== false}
                onChange={(e) => handlePreferenceChange('socialNotifications', { ...localPreferences.socialNotifications, in_app: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Likes and reactions</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.socialNotifications?.in_app !== false}
                onChange={(e) => handlePreferenceChange('socialNotifications', { ...localPreferences.socialNotifications, in_app: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">@Mentions</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.systemNotifications?.in_app !== false}
                onChange={(e) => handlePreferenceChange('systemNotifications', { ...localPreferences.systemNotifications, in_app: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">System announcements</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.socialNotifications?.in_app !== false}
                onChange={(e) => handlePreferenceChange('socialNotifications', { ...localPreferences.socialNotifications, in_app: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Chart comments</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.reminderNotifications?.in_app !== false}
                onChange={(e) => handlePreferenceChange('reminderNotifications', { ...localPreferences.reminderNotifications, in_app: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Event reminders</span>
            </label>
          </div>
        </div>

        {/* Frequency Settings */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Notification Frequency</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Digest frequency</label>
              <select
                value={localPreferences.weeklyDigest ? 'weekly' : (localPreferences.dailyDigest ? 'daily' : 'never')}
                onChange={(e) => {
                  handlePreferenceChange('dailyDigest', e.target.value === 'daily');
                  handlePreferenceChange('weeklyDigest', e.target.value === 'weekly');
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Quiet hours (no notifications)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={localPreferences.quietHoursStart || '22:00'}
                  onChange={(e) => handlePreferenceChange('quietHoursStart', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={localPreferences.quietHoursEnd || '08:00'}
                  onChange={(e) => handlePreferenceChange('quietHoursEnd', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="text-sm text-green-600 flex items-center">
                ✅ Preferences saved successfully
              </span>
            )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSaving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;