"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { getAvatarByIdentifier } from '../../utils/avatarUtils';
import NatalChartForm from '../../components/forms/NatalChartForm';
import { NatalChartFormData } from '../../hooks/useNatalChartForm';
import UserActivitySection from '../../components/profile/UserActivitySection';
import UserDiscussionsSection from '../../components/profile/UserDiscussionsSection';
import ProfileStelliums from '../../components/profile/ProfileStelliums';
import { detectStelliums } from '../../utils/stelliumDetection';
import { generateNatalChart } from '../../utils/natalChart';
import LoadingSpinner from '../../components/reusable/LoadingSpinner';
import { User } from '../../types/user';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

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

export default function UserProfilePageClient({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const username = resolvedParams?.username as string;
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

  // Detect and sync stelliums if user has birth data but missing stellium data
  const detectAndSyncStelliums = useCallback(async (user: User, forceUpdate: boolean = false) => {
    console.log('🔍 detectAndSyncStelliums called:', { 
      userId: user.id, 
      username: user.username, 
      isOwnProfile, 
      hasBirthData: !!user.birthData, 
      forceUpdate 
    });
    
    // Only sync for current user's own profile
    if (!isOwnProfile || !user.birthData) {
      console.log('❌ Skipping stellium detection:', { isOwnProfile, hasBirthData: !!user.birthData });
      return;
    }
    
    // Check if user already has stellium data (skip check if forcing update)
    if (!forceUpdate) {
      const hasStelliumData = (
        (user.stelliumSigns && user.stelliumSigns.length > 0) ||
        (user.stelliumHouses && user.stelliumHouses.length > 0) ||
        user.sunSign ||
        (user.detailedStelliums && user.detailedStelliums.length > 0)
      );
      
      console.log('📊 Current stellium data:', {
        stelliumSigns: user.stelliumSigns,
        stelliumHouses: user.stelliumHouses,
        sunSign: user.sunSign,
        detailedStelliums: user.detailedStelliums,
        hasStelliumData
      });
      
      if (hasStelliumData) {
        console.log('✅ User already has stellium data, skipping detection');
        return;
      }
    } else {
      console.log('🔄 Force update enabled, recalculating stelliums...');
    }
    
    try {
      console.log('🎯 Generating natal chart with birth data:', {
        dateOfBirth: user.birthData.dateOfBirth,
        timeOfBirth: user.birthData.timeOfBirth,
        locationOfBirth: user.birthData.locationOfBirth,
        coordinates: user.birthData.coordinates
      });
      
      // Generate chart data for stellium detection
      const chartResult = await generateNatalChart({
        name: user.username || 'User',
        dateOfBirth: user.birthData.dateOfBirth,
        timeOfBirth: user.birthData.timeOfBirth,
        locationOfBirth: user.birthData.locationOfBirth,
        coordinates: user.birthData.coordinates
      });
      
      console.log('📈 Chart generation result:', {
        hasChartResult: !!chartResult,
        hasMetadata: !!chartResult?.metadata,
        hasChartData: !!chartResult?.metadata?.chartData,
        hasPlanets: !!chartResult?.metadata?.chartData?.planets,
        planetsCount: chartResult?.metadata?.chartData?.planets?.length
      });
      
      if (chartResult && chartResult.metadata && chartResult.metadata.chartData && chartResult.metadata.chartData.planets) {
        console.log('🪐 Planets found:', chartResult.metadata.chartData.planets.map(p => ({
          name: p.name,
          sign: p.sign,
          house: p.house
        })));
        
        // Detect stelliums from chart data
        const stelliumResult = detectStelliums(chartResult.metadata.chartData);
        
        console.log('⭐ Stellium detection result:', stelliumResult);
        
        // Prepare update data
        const updateData: Partial<User> = { hasNatalChart: true };
        
        if (stelliumResult.signStelliums.length > 0) {
          updateData.stelliumSigns = stelliumResult.signStelliums;
          console.log('🌟 Adding sign stelliums:', stelliumResult.signStelliums);
        }
        
        if (stelliumResult.houseStelliums.length > 0) {
          updateData.stelliumHouses = stelliumResult.houseStelliums;
          console.log('🏠 Adding house stelliums:', stelliumResult.houseStelliums);
        }
        
        if (stelliumResult.sunSign) {
          updateData.sunSign = stelliumResult.sunSign;
          console.log('☉ Setting sun sign:', stelliumResult.sunSign);
        }
        
        if (stelliumResult.detailedStelliums && stelliumResult.detailedStelliums.length > 0) {
          updateData.detailedStelliums = stelliumResult.detailedStelliums;
          console.log('✨ Adding detailed stelliums:', stelliumResult.detailedStelliums);
        }
        
        console.log('💾 Updating user with data:', updateData);
        
        // Update user profile
        await updateUser(updateData);
        
        console.log('✅ User store updated successfully');
        
        // Update profileUser state to reflect changes immediately
        setProfileUser(prev => prev ? { ...prev, ...updateData } : prev);
        
        console.log('🔄 Profile user state updated');
      } else {
        console.warn('⚠️ Failed to generate chart data or missing planets');
      }
    } catch (error) {
      console.error('❌ Error detecting stelliums:', error);
    }
  }, [isOwnProfile, updateUser]);

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

  // Detect stelliums when profile user is loaded
  useEffect(() => {
    console.log('👤 Profile user changed:', { 
      hasProfileUser: !!profileUser, 
      isOwnProfile, 
      username: profileUser?.username 
    });
    
    if (profileUser && isOwnProfile) {
      console.log('🚀 Triggering stellium detection for profile user');
      detectAndSyncStelliums(profileUser);
    }
  }, [profileUser, isOwnProfile, detectAndSyncStelliums]);

  // Force recalculate stelliums (for debugging)
  const forceRecalculateStelliums = useCallback(async () => {
    if (profileUser && isOwnProfile) {
      console.log('🔄 Force recalculating stelliums for user:', profileUser.username);
      console.log('📝 Current profile user data before force update:', {
        sunSign: profileUser.sunSign,
        stelliumSigns: profileUser.stelliumSigns,
        stelliumHouses: profileUser.stelliumHouses,
        detailedStelliums: profileUser.detailedStelliums
      });
      await detectAndSyncStelliums(profileUser, true);
    }
  }, [profileUser, isOwnProfile, detectAndSyncStelliums]);

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
      try {
        // Update user store first
        await updateUser({ username: usernameInput.trim() });
        
        // Update profileUser state to reflect the change immediately
        setProfileUser(prev => prev ? { ...prev, username: usernameInput.trim() } : prev);
        
        // Force refresh the profile data from the API to ensure consistency
        await fetchUserByUsername(usernameInput.trim());
        
        console.log('✅ Username updated successfully');
      } catch (error) {
        console.error('❌ Failed to update username:', error);
        // Revert username input on error
        setUsernameInput(currentUser?.username || '');
      }
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
    // Update profileUser state to reflect the change immediately
    setProfileUser(prev => prev ? { ...prev, preferredAvatar: selectedAvatar } : prev);
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
      <LoadingSpinner
        title="Loading Profile..."
        subtitle="Fetching user information."
        size="lg"
        screenCentered={true}
      />
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBirthData(!editingBirthData)}
                            className="px-3 py-1 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-xs"
                          >
                            {editingBirthData ? 'Cancel' : 'Edit'}
                          </button>
                          {profileUser?.birthData && (
                            <button
                              onClick={forceRecalculateStelliums}
                              className="px-3 py-1 bg-yellow-400 text-black font-semibold border border-black transition-all duration-300 hover:bg-yellow-500 text-xs"
                              title="Force recalculate sun sign and stelliums"
                            >
                              Recalc
                            </button>
                          )}
                        </div>
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
                              <p className="font-open-sans text-xs text-black/70">This user has private birth information</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6" style={{ backgroundColor: '#f8f8f8' }}>
                          <div className="w-8 h-8 bg-white border border-black flex items-center justify-center mx-auto mb-2">
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="font-open-sans text-xs text-black/70">
                            {isOwnProfile ? 'Add your birth information to get started' : 'No birth information available'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions for Own Profile */}
            {isOwnProfile && (
              <div className="border border-black bg-white">
                <div className="p-4 border-b border-black">
                  <h2 className="font-space-grotesk text-lg font-bold text-black mb-1">Quick Actions</h2>
                  <p className="font-open-sans text-xs text-black/60">Profile shortcuts</p>
                </div>
                <div className="p-4 space-y-2">
                  <Link
                    href="/chart"
                    className="block w-full px-3 py-2 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-center text-sm"
                  >
                    Generate Chart
                  </Link>
                  <Link
                    href="/settings"
                    className="block w-full px-3 py-2 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-center text-sm"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/discussions"
                    className="block w-full px-3 py-2 bg-white text-black font-semibold border border-black transition-all duration-300 hover:bg-black hover:text-white text-center text-sm"
                  >
                    Join Discussions
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area - Activity */}
          <div className="lg:col-span-3">
            <div className="border border-black bg-white">
              <div className="p-4 border-b border-black">
                <h2 className="font-space-grotesk text-lg font-bold text-black mb-1">Activity</h2>
                <p className="font-open-sans text-xs text-black/60">Community engagement</p>
              </div>
              <div className="border-b border-black">
                <div className="flex">
                  <button
                    onClick={() => setActiveActivityTab('forum')}
                    className={`px-6 py-3 font-semibold border-r border-black transition-colors text-sm ${
                      activeActivityTab === 'forum' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    Forum Posts
                  </button>
                  <button
                    onClick={() => setActiveActivityTab('recent')}
                    className={`px-6 py-3 font-semibold transition-colors text-sm ${
                      activeActivityTab === 'recent'
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    Recent Activity
                  </button>
                </div>
              </div>
              <div className="p-6">
                {activeActivityTab === 'forum' ? (
                  <UserDiscussionsSection 
                    userId={profileUser.id} 
                  />
                ) : (
                  <UserActivitySection 
                    userId={profileUser.id} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Selection Modal */}
      {isOwnProfile && showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-black">
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-2">Choose Avatar</h3>
              <p className="font-open-sans text-sm text-black/70">Select an avatar for your profile</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 mb-6">
                {avatarPaths.map((avatarPath, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatarPath)}
                    className={`w-12 h-12 border-2 bg-white p-1 transition-all duration-200 ${
                      selectedAvatar === avatarPath
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-black hover:border-gray-500'
                    }`}
                  >
                    <Image
                      src={avatarPath}
                      alt={`Avatar ${index + 1}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="flex space-x-0 border border-black">
                <button
                  onClick={handleAvatarSave}
                  disabled={!selectedAvatar}
                  className="px-4 py-2 bg-black text-white font-semibold hover:bg-gray-800 border-r border-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Avatar
                </button>
                <button
                  onClick={handleAvatarCancel}
                  className="px-4 py-2 bg-white text-black font-semibold hover:bg-black hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}