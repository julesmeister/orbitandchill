"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useUserStore } from '../../store/userStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { getAvatarByIdentifier } from '../../utils/avatarUtils';
import NatalChartForm, { NatalChartFormData } from '../../components/forms/NatalChartForm';
import UserActivitySection from '../../components/profile/UserActivitySection';
import UserDiscussionsSection from '../../components/profile/UserDiscussionsSection';
import ProfileStelliums from '../../components/profile/ProfileStelliums';

export default function ProfilePage() {
  const { user, updateUser, updateBirthData } = useUserStore();
  const { getUserCharts } = useNatalChart();
  const [editingBirthData, setEditingBirthData] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [chartCount, setChartCount] = useState(0);
  
  // Activity tabs state - default to forum activity
  const [activeActivityTab, setActiveActivityTab] = useState<'forum' | 'recent'>('forum');
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    account: false,
    birthData: false
  });

  // Load user charts count
  const loadChartCount = useCallback(async () => {
    if (user) {
      try {
        const charts = await getUserCharts();
        setChartCount(charts.length);
      } catch (error) {
        console.error('Error loading user charts:', error);
        setChartCount(0);
      }
    }
  }, [user, getUserCharts]);

  useEffect(() => {
    loadChartCount();
  }, [loadChartCount]);

  if (!user) {
    return (
      <div className="bg-white">
        <section className="px-[5%] py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">
              Profile Not Found
            </h1>
            <p className="font-inter text-xl text-black/80">Please refresh the page to load your profile.</p>
          </div>
        </section>
      </div>
    );
  }


  const handleBirthDataSubmit = async (formData: NatalChartFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...birthData } = formData;
    // Note: name is intentionally not used here as we don't update username from birth data form
    await updateBirthData(birthData);
    setEditingBirthData(false);
  };

  const handleUsernameUpdate = async () => {
    if (usernameInput.trim() && usernameInput !== user?.username) {
      await updateUser({ username: usernameInput.trim() });
    }
    setEditingUsername(false);
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
      {/* Compact Hero Section */}
      <section className="px-[5%] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-black">
            {/* Profile Info Section */}
            <div className="lg:col-span-3 p-8" style={{ backgroundColor: '#6bdbff' }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 border-2 border-black bg-white p-1">
                  <Image
                    src={user.profilePictureUrl || getAvatarByIdentifier(user.username)}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-space-grotesk text-3xl font-bold text-black">
                    {user.username}
                  </h1>
                  <p className="font-inter text-black/80">
                    {user.authProvider === 'google' ? 'Google Account' : 'Anonymous User'}
                  </p>
                </div>
              </div>
              <ProfileStelliums 
                detailedStelliums={user.detailedStelliums} 
                stelliumSigns={user.stelliumSigns}
                stelliumHouses={user.stelliumHouses}
                sunSign={user.sunSign} 
              />
            </div>
            
            {/* Quick Stats Section */}
            <div className="lg:col-span-2 p-6 bg-white border-l border-black">
              <h3 className="font-space-grotesk text-base font-bold text-black mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                <div className="p-3 border border-black text-center lg:text-left">
                  <div className="text-xs font-semibold text-black mb-1">CHARTS</div>
                  <div className="font-space-grotesk text-xl font-bold text-black">{chartCount}</div>
                </div>
                <div className="p-3 border border-black text-center lg:text-left">
                  <div className="text-xs font-semibold text-black mb-1">JOINED</div>
                  <div className="font-inter text-xs font-medium text-black">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="p-3 border border-black text-center lg:text-left">
                  <div className="text-xs font-semibold text-black mb-1">STATUS</div>
                  <div className="font-inter text-xs font-medium text-black">
                    {user.birthData ? 'Complete' : 'Incomplete'}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Main Content Grid - Sidebar + Activity */}
      <section className="px-[5%] py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Profile Elements */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Account Information */}
            <div className="border border-black bg-white">
              <div className="p-4 border-b border-black">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-space-grotesk text-lg font-bold text-black mb-1">Account</h2>
                    <p className="font-inter text-xs text-black/60">Personal details</p>
                  </div>
                  <button
                    onClick={() => toggleSection('account')}
                    className="p-1 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors"
                    aria-label={collapsedSections.account ? 'Expand section' : 'Collapse section'}
                  >
                    <svg 
                      className={`w-3 h-3 transition-transform duration-200 ${collapsedSections.account ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              {!collapsedSections.account && (
              <div className="p-4 space-y-3">
                {/* Username Field */}
                <div className="border border-black p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-black">USERNAME</div>
                    {!editingUsername && (
                      <button
                        onClick={() => {
                          setEditingUsername(true);
                          setUsernameInput(user.username);
                        }}
                        className="px-2 py-1 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {editingUsername ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full font-inter text-sm text-black border-b border-black bg-transparent focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUsernameUpdate();
                          if (e.key === 'Escape') setEditingUsername(false);
                        }}
                        autoFocus
                      />
                      <div className="flex space-x-0 border border-black">
                        <button
                          onClick={handleUsernameUpdate}
                          className="px-2 py-1 bg-black text-white font-semibold hover:bg-gray-800 border-r border-black text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUsername(false)}
                          className="px-2 py-1 bg-white text-black font-semibold hover:bg-black hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="font-inter text-sm font-semibold text-black">{user.username}</div>
                  )}
                </div>
                
                {/* Account Type */}
                <div className="border border-black p-2">
                  <div className="text-xs font-semibold text-black mb-1">TYPE</div>
                  <div className="font-inter text-sm font-semibold text-black capitalize">{user.authProvider}</div>
                </div>

                {/* Email (if available) */}
                {user.email && (
                  <div className="border border-black p-2">
                    <div className="text-xs font-semibold text-black mb-1">EMAIL</div>
                    <div className="font-inter text-xs font-medium text-black break-all">{user.email}</div>
                  </div>
                )}

                {/* Member Since */}
                <div className="border border-black p-2">
                  <div className="text-xs font-semibold text-black mb-1">JOINED</div>
                  <div className="font-inter text-xs font-medium text-black">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Birth Data Section */}
            <div className="border border-black bg-white">
              <div className="p-4 border-b border-black">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-space-grotesk text-lg font-bold text-black mb-1">Birth Data</h2>
                    <p className="font-inter text-xs text-black/60">Astrological details</p>
                  </div>
                  <button
                    onClick={() => toggleSection('birthData')}
                    className="p-1 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors"
                    aria-label={collapsedSections.birthData ? 'Expand section' : 'Collapse section'}
                  >
                    <svg 
                      className={`w-3 h-3 transition-transform duration-200 ${collapsedSections.birthData ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              {!collapsedSections.birthData && (
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {user.birthData && (
                        <div className="px-2 py-1 text-xs font-semibold text-black border border-black" style={{ backgroundColor: '#e7fff6' }}>
                          Complete
                        </div>
                      )}
                      <button
                        onClick={() => setEditingBirthData(!editingBirthData)}
                        className="px-3 py-1 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-xs"
                      >
                        {editingBirthData ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                  </div>
                  
                  {editingBirthData ? (
                    <NatalChartForm
                      onSubmit={handleBirthDataSubmit}
                      submitText="Save Changes"
                      showSubmitButton={true}
                    />
                  ) : (
                    <div>
                      {user.birthData ? (
                        <div className="space-y-2">
                          <div className="border border-black p-2">
                            <div className="text-xs font-semibold text-black mb-1">BIRTH DATE</div>
                            <div className="font-inter text-xs font-medium text-black">
                              {new Date(user.birthData.dateOfBirth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          <div className="border border-black p-2">
                            <div className="text-xs font-semibold text-black mb-1">BIRTH TIME</div>
                            <div className="font-inter text-xs font-medium text-black">{user.birthData.timeOfBirth}</div>
                          </div>

                          {user.sunSign && (
                            <div className="border border-black p-2">
                              <div className="text-xs font-semibold text-black mb-1">SUN SIGN</div>
                              <div className="font-inter text-xs font-medium text-black capitalize">{user.sunSign}</div>
                            </div>
                          )}

                          <div className="border border-black p-2">
                            <div className="text-xs font-semibold text-black mb-1">LOCATION</div>
                            <div className="font-inter text-xs font-medium text-black break-words">{user.birthData.locationOfBirth}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6" style={{ backgroundColor: '#f0e3ff' }}>
                          <div className="w-8 h-8 bg-white border border-black flex items-center justify-center mx-auto mb-2">
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <h3 className="font-space-grotesk text-sm font-bold text-black mb-1">No Birth Data</h3>
                          <p className="font-inter text-xs text-black/60 mb-2">Add birth information</p>
                          <button
                            onClick={() => setEditingBirthData(true)}
                            className="px-3 py-2 bg-black text-white font-semibold border border-black transition-all duration-300 hover:bg-gray-800 text-xs"
                          >
                            Add Information
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Main Content Area - Activity Tabs */}
          <div className="lg:col-span-3">
            <div className="border border-black bg-white">
              {/* Tabs Header */}
              <div className="border-b border-black">
                <div className="flex">
                  <button
                    onClick={() => setActiveActivityTab('forum')}
                    className={`px-6 py-4 font-space-grotesk font-bold border-r border-black transition-colors ${
                      activeActivityTab === 'forum' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    Forum Activity
                  </button>
                  <button
                    onClick={() => setActiveActivityTab('recent')}
                    className={`px-6 py-4 font-space-grotesk font-bold transition-colors ${
                      activeActivityTab === 'recent' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    Recent Activity
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[500px]">
                {activeActivityTab === 'forum' ? (
                  <UserDiscussionsSection userId={user.id} />
                ) : (
                  <UserActivitySection userId={user.id} />
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}