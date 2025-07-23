"use client";

import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import PreferencesTab from '../../components/settings/PreferencesTab';
import NotificationsTab from '../../components/settings/NotificationsTab';
import AccountTab from '../../components/settings/AccountTab';

export default function SettingsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications' | 'account'>('preferences');

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
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'account' && <AccountTab />}
      </section>
    </div>
  );
}