"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { getAvatarByIdentifier } from '../../utils/avatarUtils';
import NatalChartForm, { NatalChartFormData } from '../../components/forms/NatalChartForm';
import UserActivitySection from '../../components/profile/UserActivitySection';
import UserDiscussionsSection from '../../components/profile/UserDiscussionsSection';
import ProfileStelliums from '../../components/profile/ProfileStelliums';
import { User } from '../../types/user';

// Avatar options (matching avatarUtils.ts)
const avatarPaths: string[] = [
  "/avatars/Avatar-1.png",
  "/avatars/Avatar-2.png",
  "/avatars/Avatar-3.png",
  "/avatars/Avatar-4.png",
  "/avatars/Avatar-5.png",
  "/avatars/Avatar-6.png",
  "/avatars/Avatar-7.png",
  "/avatars/Avatar-8.png",
  "/avatars/Avatar-9.png",
  "/avatars/Avatar-10.png",
  "/avatars/Avatar-11.png",
  "/avatars/Avatar-12.png",
  "/avatars/Avatar-13.png",
  "/avatars/Avatar-14.png",
  "/avatars/Avatar-15.png",
  "/avatars/Avatar-16.png",
  "/avatars/Avatar-17.png",
  "/avatars/Avatar-18.png",
  "/avatars/Avatar-19.png",
  "/avatars/Avatar-20.png",
  "/avatars/Avatar-21.png",
  "/avatars/Avatar-22.png",
  "/avatars/Avatar-23.png",
  "/avatars/Avatar-24.png",
  "/avatars/Avatar-25.png",
  "/avatars/Avatar-26.png",
  "/avatars/Avatar-27.png",
  "/avatars/Avatar-28.png",
  "/avatars/Avatar-29.png",
  "/avatars/Avatar-30.png",
  "/avatars/Avatar-31.png",
  "/avatars/Avatar-32.png",
  "/avatars/Avatar-33.png",
  "/avatars/Avatar-34.png",
  "/avatars/Avatar-35.png",
  "/avatars/Avatar-36.png",
];

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const { user: currentUser, updateUser, updateBirthData } = useUserStore();
  const { getUserCharts } = useNatalChart();
  
  // Profile user state (the user whose profile we're viewing)
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartCount, setChartCount] = useState(0);
  
  // Edit states (only for own profile)
  const [editingBirthData, setEditingBirthData] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  
  // Activity tabs state
  const [activeActivityTab, setActiveActivityTab] = useState<'forum' | 'recent'>('forum');
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    account: false,
    birthData: false
  });

  // Check if this is the current user's own profile
  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id;

  // Fetch user by username
  const fetchUserByUsername = useCallback(async (targetUsername: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/by-username/${encodeURIComponent(targetUsername)}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        setProfileUser(data.user);
        setUsernameInput(data.user.username);
      } else {
        setError('User not found');
        setProfileUser(null);
      }
    } catch (err) {
      setError('Failed to load user profile');
      setProfileUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user profile
  useEffect(() => {
    if (username) {
      fetchUserByUsername(username);
    }
  }, [username, fetchUserByUsername]);

  // Load user charts count
  const loadChartCount = useCallback(async () => {
    if (profileUser) {
      try {
        // For now, we can only load charts for the current user
        // Later you might want to add an API endpoint to get public chart counts
        if (isOwnProfile) {
          const charts = await getUserCharts();
          setChartCount(charts.length);
        } else {
          setChartCount(0); // Or fetch from a public API endpoint
        }
      } catch (error) {
        setChartCount(0);
      }
    }
  }, [profileUser, isOwnProfile, getUserCharts]);

  useEffect(() => {
    loadChartCount();
  }, [loadChartCount]);

  // Handle birth data submission (only for own profile)
  const handleBirthDataSubmit = async (formData: NatalChartFormData) => {
    if (!isOwnProfile) return;
    
    const { name, ...birthData } = formData;
    await updateBirthData(birthData);
    setEditingBirthData(false);
  };

  // Handle username update (only for own profile)
  const handleUsernameUpdate = async () => {
    if (!isOwnProfile) return;
    
    if (usernameInput.trim() && usernameInput !== currentUser?.username) {
      await updateUser({ username: usernameInput.trim() });
    }
    setEditingUsername(false);
  };

  // Handle avatar selection (only for own profile)
  const handleAvatarSelect = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
  };

  const handleAvatarSave = async () => {
    if (!isOwnProfile || !selectedAvatar) return;
    
    await updateUser({ preferredAvatar: selectedAvatar });
    setShowAvatarModal(false);
    setSelectedAvatar(null);
  };

  const handleAvatarCancel = () => {
    setShowAvatarModal(false);
    setSelectedAvatar(null);
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get current avatar (preferred or deterministic)
  const getCurrentAvatar = () => {
    if (profileUser?.preferredAvatar) {
      return profileUser.preferredAvatar;
    }
    return profileUser?.profilePictureUrl || getAvatarByIdentifier(profileUser?.username || '');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white">
        <section className="px-[5%] py-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-black animate-bounce"></div>
            </div>
            <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">
              Loading Profile...
            </h1>
            <p className="font-open-sans text-xl text-black/80">Fetching user information.</p>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error || !profileUser) {
    return (
      <div className="bg-white">
        <section className="px-[5%] py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">
              {error === 'User not found' ? 'User Not Found' : 'Profile Error'}
            </h1>
            <p className="font-open-sans text-xl text-black/80 mb-8">
              {error === 'User not found' 
                ? `No user found with username "${username}"`
                : 'Unable to load this profile. Please try again.'}
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium border border-black"
            >
              Go Home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
      {/* Compact Hero Section */}
      <section className="px-[5%] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-black">
            {/* Profile Info Section */}
            <div className="lg:col-span-3 p-8" style={{ backgroundColor: '#6bdbff' }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-black bg-white p-1">
                    <Image
                      src={getCurrentAvatar()}
                      alt={profileUser.username}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-black text-white border border-black hover:bg-gray-800 transition-colors flex items-center justify-center"
                      title="Change avatar"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="font-space-grotesk text-3xl font-bold text-black">
                    {profileUser.username}
                  </h1>
                  <p className="font-open-sans text-black/80">
                    {profileUser.authProvider === 'google' ? 'Google Account' : 'Anonymous User'}
                    {isOwnProfile && <span className="ml-2 text-sm">(You)</span>}
                  </p>
                </div>
              </div>
              <ProfileStelliums 
                detailedStelliums={profileUser.detailedStelliums} 
                stelliumSigns={profileUser.stelliumSigns}
                stelliumHouses={profileUser.stelliumHouses}
                sunSign={profileUser.sunSign} 
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
                  <div className="font-open-sans text-xs font-medium text-black">
                    {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="p-3 border border-black text-center lg:text-left">
                  <div className="text-xs font-semibold text-black mb-1">STATUS</div>
                  <div className="font-open-sans text-xs font-medium text-black">
                    {profileUser.birthData ? 'Complete' : 'Incomplete'}
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
                    <p className="font-open-sans text-xs text-black/60">Personal details</p>
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
                    {isOwnProfile && !editingUsername && (
                      <button
                        onClick={() => {
                          setEditingUsername(true);
                          setUsernameInput(profileUser.username);
                        }}
                        className="px-2 py-1 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isOwnProfile && editingUsername ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full font-open-sans text-sm text-black border-b border-black bg-transparent focus:outline-none"
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
                    <div className="font-open-sans text-sm font-semibold text-black">{profileUser.username}</div>
                  )}
                </div>
                
                {/* Account Type */}
                <div className="border border-black p-2">
                  <div className="text-xs font-semibold text-black mb-1">TYPE</div>
                  <div className="font-open-sans text-sm font-semibold text-black capitalize">{profileUser.authProvider}</div>
                </div>

                {/* Email (only show for own profile) */}
                {isOwnProfile && profileUser.email && (
                  <div className="border border-black p-2">
                    <div className="text-xs font-semibold text-black mb-1">EMAIL</div>
                    <div className="font-open-sans text-xs font-medium text-black break-all">{profileUser.email}</div>
                  </div>
                )}

                {/* Member Since */}
                <div className="border border-black p-2">
                  <div className="text-xs font-semibold text-black mb-1">JOINED</div>
                  <div className="font-open-sans text-xs font-medium text-black">
                    {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
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
                    <p className="font-open-sans text-xs text-black/60">Astrological details</p>
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
                      {profileUser.birthData && (
                        <div className="px-2 py-1 text-xs font-semibold text-black border border-black" style={{ backgroundColor: '#e7fff6' }}>
                          Complete
                        </div>
                      )}
                      {isOwnProfile && (
                        <button
                          onClick={() => setEditingBirthData(!editingBirthData)}
                          className="px-3 py-1 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-xs"
                        >
                          {editingBirthData ? 'Cancel' : 'Edit'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {isOwnProfile && editingBirthData ? (
                    <NatalChartForm
                      onSubmit={handleBirthDataSubmit}
                      submitText="Save Changes"
                      showSubmitButton={true}
                    />
                  ) : (
                    <div>
                      {profileUser.birthData ? (
                        <div className="space-y-2">
                          {/* Only show birth data if user has made it public or it's own profile */}
                          {(isOwnProfile || profileUser.privacy?.showBirthInfoPublicly) && (
                            <>
                              <div className="border border-black p-2">
                                <div className="text-xs font-semibold text-black mb-1">BIRTH DATE</div>
                                <div className="font-open-sans text-xs font-medium text-black">
                                  {new Date(profileUser.birthData.dateOfBirth).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                              
                              <div className="border border-black p-2">
                                <div className="text-xs font-semibold text-black mb-1">BIRTH TIME</div>
                                <div className="font-open-sans text-xs font-medium text-black">{profileUser.birthData.timeOfBirth}</div>
                              </div>

                              <div className="border border-black p-2">
                                <div className="text-xs font-semibold text-black mb-1">LOCATION</div>
                                <div className="font-open-sans text-xs font-medium text-black break-words">{profileUser.birthData.locationOfBirth}</div>
                              </div>
                            </>
                          )}

                          {/* Always show sun sign if public or own profile */}
                          {(isOwnProfile || profileUser.privacy?.showZodiacPublicly) && profileUser.sunSign && (
                            <div className="border border-black p-2">
                              <div className="text-xs font-semibold text-black mb-1">SUN SIGN</div>
                              <div className="font-open-sans text-xs font-medium text-black capitalize">{profileUser.sunSign}</div>
                            </div>
                          )}

                          {/* Show privacy message for other users */}
                          {!isOwnProfile && !profileUser.privacy?.showBirthInfoPublicly && (
                            <div className="text-center py-4" style={{ backgroundColor: '#f0e3ff' }}>
                              <div className="w-8 h-8 bg-white border border-black flex items-center justify-center mx-auto mb-2">
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <h3 className="font-space-grotesk text-sm font-bold text-black mb-1">Private Birth Data</h3>
                              <p className="font-open-sans text-xs text-black/60">This user has chosen to keep their birth information private</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6" style={{ backgroundColor: '#f0e3ff' }}>
                          <div className="w-8 h-8 bg-white border border-black flex items-center justify-center mx-auto mb-2">
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <h3 className="font-space-grotesk text-sm font-bold text-black mb-1">No Birth Data</h3>
                          <p className="font-open-sans text-xs text-black/60 mb-2">
                            {isOwnProfile ? 'Add birth information' : 'No birth data available'}
                          </p>
                          {isOwnProfile && (
                            <button
                              onClick={() => setEditingBirthData(true)}
                              className="px-3 py-2 bg-black text-white font-semibold border border-black transition-all duration-300 hover:bg-gray-800 text-xs"
                            >
                              Add Information
                            </button>
                          )}
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
                  <UserDiscussionsSection userId={profileUser.id} />
                ) : (
                  <UserActivitySection userId={profileUser.id} />
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Avatar Selection Modal - Only for own profile */}
      {isOwnProfile && showAvatarModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={handleAvatarCancel}
          />
          
          {/* Modal */}
          <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[70vh] bg-white border-2 border-black shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-black">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-space-grotesk text-lg font-bold text-black">Choose Avatar</h2>
                  <p className="font-open-sans text-xs text-black/70 mt-1">Select your preferred profile picture</p>
                </div>
                <button
                  onClick={handleAvatarCancel}
                  className="p-1 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {avatarPaths.map((avatarPath, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatarPath)}
                    className={`relative w-12 h-12 border-2 transition-all duration-200 ${
                      selectedAvatar === avatarPath 
                        ? 'border-black bg-black p-1' 
                        : getCurrentAvatar() === avatarPath
                        ? 'border-blue-500 bg-blue-50 p-1'
                        : 'border-gray-300 hover:border-black p-1'
                    }`}
                  >
                    <Image
                      src={avatarPath}
                      alt={`Avatar ${index + 1}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                    {getCurrentAvatar() === avatarPath && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full"></div>
                    )}
                    {selectedAvatar === avatarPath && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-black border border-white rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-black flex">
              <button
                onClick={handleAvatarCancel}
                className="flex-1 px-4 py-3 bg-white text-black border-r border-black hover:bg-black hover:text-white transition-colors font-open-sans font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarSave}
                disabled={!selectedAvatar}
                className={`flex-1 px-4 py-3 font-open-sans font-medium text-sm transition-colors ${
                  selectedAvatar
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}