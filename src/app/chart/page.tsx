/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import { usePeopleStore } from "../../store/peopleStore";
import { useChartTab } from "../../store/chartStore";
import { useNatalChart } from "../../hooks/useNatalChart";
import { Person } from "../../types/people";
import { trackChartGenerated, trackPageView } from "../../utils/analytics";
import NatalChartDisplay from "../../components/charts/NatalChartDisplay";
import ChartQuickActions from "../../components/charts/ChartQuickActions";
import BirthDataSummary from "../../components/charts/BirthDataSummary";
import InterpretationSidebar from "../../components/charts/InterpretationSidebar";
import TransitAspectsTab from "../../components/charts/TransitAspectsTab";
import { useStatusToast } from "../../hooks/useStatusToast";
import StatusToast from "../../components/reusable/StatusToast";
import { BRAND } from "../../config/brand";

export default function ChartPage() {
  const router = useRouter();
  const { user, isProfileComplete, isLoading: isUserLoading, loadProfile } =
    useUserStore();
  const { setSelectedPerson: setGlobalSelectedPerson, selectedPerson: globalSelectedPerson } = usePeopleStore();
  const { activeTab, setActiveTab } = useChartTab();

  // Debug: Log current active tab (removed to prevent loop)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Use global selected person if available, otherwise fall back to local state
  const activeSelectedPerson = globalSelectedPerson || selectedPerson;

  const {
    generateChart,
    isGenerating,
    cachedChart,
    shareChart,
    getUserCharts,
    hasExistingChart,
    isLoadingCache,
  } = useNatalChart(activeSelectedPerson);

  // Use status toast hook
  const { toast: statusToast, showSuccess, showError, hideStatus } = useStatusToast();

  // Create refs for stable function references
  const generateChartRef = useRef(generateChart);
  const getUserChartsRef = useRef(getUserCharts);

  // Update refs when functions change
  useEffect(() => {
    generateChartRef.current = generateChart;
    getUserChartsRef.current = getUserCharts;
  }, [generateChart, getUserCharts]);

  // Load user profile when component mounts
  useEffect(() => {
    console.log('ChartPage - Profile load effect:', {
      hasUser: !!user,
      isUserLoading,
      userId: user?.id,
      userHasBirthData: !!user?.birthData,
      userBirthDataDetails: user?.birthData ? {
        hasDateOfBirth: !!user.birthData.dateOfBirth,
        hasTimeOfBirth: !!user.birthData.timeOfBirth,
        hasLocation: !!user.birthData.locationOfBirth,
        hasCoordinates: !!user.birthData.coordinates,
        hasLat: !!user.birthData.coordinates?.lat,
      } : null,
    });
    
    // Only load profile if we don't have a user yet
    if (!user && !isUserLoading) {
      console.log('ChartPage - Loading profile');
      loadProfile();
    }
  }, [user, isUserLoading, loadProfile]);

  // Check for existing charts and auto-generate if needed
  useEffect(() => {
    console.log('ChartPage - Chart generation effect triggered:', {
      isLoadingCache,
      hasCachedChart: !!cachedChart,
      isGenerating,
      hasUser: !!user,
      userId: user?.id,
      hasActiveSelectedPerson: !!activeSelectedPerson,
      activeSelectedPersonId: activeSelectedPerson?.id,
      activeSelectedPersonName: activeSelectedPerson?.name,
    });
    
    // Early return if cache is still loading - wait for it to complete
    if (isLoadingCache) {
      console.log('ChartPage - Cache still loading, waiting...');
      return;
    }

    // Early return if we already have a cached chart - no need to do anything
    if (cachedChart) {
      console.log('ChartPage - Already have cached chart, skipping generation');
      return;
    }

    // Early return if already generating
    if (isGenerating) {
      console.log('ChartPage - Already generating, skipping');
      return;
    }

    // Early return if no user
    if (!user) {
      console.log('ChartPage - No user, skipping chart generation');
      return;
    }

    const loadOrGenerateChart = async () => {
      console.log('🔧 CHART PAGE: loadOrGenerateChart called');
      console.log('🔧 CHART PAGE: isGenerating:', isGenerating);
      console.log('🔧 CHART PAGE: user:', !!user);
      console.log('🔧 CHART PAGE: user.birthData:', !!user?.birthData);
      if (user?.birthData) {
        console.log('🔧 CHART PAGE: birth data details:', {
          dateOfBirth: !!user.birthData.dateOfBirth,
          timeOfBirth: !!user.birthData.timeOfBirth,
          locationOfBirth: !!user.birthData.locationOfBirth,
          coordinates: !!user.birthData.coordinates,
          lat: !!user.birthData.coordinates?.lat,
          lon: !!user.birthData.coordinates?.lon
        });
      }
      
      // Guard against running when already generating
      if (isGenerating) {
        console.log('🔧 CHART PAGE: Already generating, returning');
        return;
      }

      // First, try to load existing charts
      try {
        console.log('🔧 CHART PAGE: Loading existing charts...');
        const existingCharts = await getUserChartsRef.current();
        console.log('🔧 CHART PAGE: Found', existingCharts.length, 'existing charts');

        if (existingCharts.length > 0) {
          // Use the most recent chart
          const latestChart = existingCharts[0];
          console.log('🔧 CHART PAGE: Using latest chart:', latestChart.id);
          // The chart should be loaded by the useNatalChart hook automatically
          return;
        }
      } catch (error) {
        console.log('🔧 CHART PAGE: Error loading existing charts:', error);
      }

      // If no existing charts but we have birth data, try to generate
      // Check specific birth data fields instead of using isProfileComplete
      if (user.birthData?.dateOfBirth && user.birthData?.timeOfBirth && user.birthData?.coordinates?.lat) {
        console.log('🔧 CHART PAGE: No existing charts, generating new chart...');
        try {
          await generateChartRef.current({
            name: user.username || '',
            dateOfBirth: user.birthData.dateOfBirth,
            timeOfBirth: user.birthData.timeOfBirth,
            locationOfBirth: user.birthData.locationOfBirth || 'Unknown',
            coordinates: user.birthData.coordinates
          });

          // Track analytics - chart generated
          trackChartGenerated('natal', {
            isAutoGenerated: true,
            hasCompleteProfile: !!(user.birthData?.dateOfBirth && user.birthData?.timeOfBirth && user.birthData?.coordinates?.lat)
          });
          
          console.log('🔧 CHART PAGE: Chart generation completed');
        } catch (error) {
          console.log('🔧 CHART PAGE: Error during auto-generation:', error);
        }
      } else {
        console.log('🔧 CHART PAGE: Missing birth data, cannot generate chart');
      }
    };

    loadOrGenerateChart();
  }, [cachedChart, isGenerating, user?.id, user?.birthData?.dateOfBirth, user?.birthData?.timeOfBirth, user?.birthData?.coordinates?.lat]); // Optimized dependencies - removed isLoadingCache and isProfileComplete

  // Track page view analytics
  useEffect(() => {
    trackPageView('/chart');
  }, []);

  const handleClearAllCaches = async () => {
    if (!user) return;

    try {
      await handleRegenerateChart();
      showSuccess('Chart Regenerated', 'Your natal chart has been successfully regenerated with fresh calculations.', 4000);
    } catch (error) {
      showError('Regeneration Failed', 'Failed to regenerate your chart. Please try again.', 5000);
    }
  };

  const handleRegenerateChart = async () => {
    // Use selected person's data if available, otherwise fall back to user's data
    const personToUse = selectedPerson || (user?.birthData ? {
      name: user.username || "",
      birthData: user.birthData
    } : null);

    if (!personToUse?.birthData) {
      alert("No birth data available. Please select a person or add your birth data.");
      return;
    }

    try {
      const chartData = await generateChart(
        {
          name: personToUse.name || "",
          dateOfBirth: personToUse.birthData.dateOfBirth,
          timeOfBirth: personToUse.birthData.timeOfBirth,
          locationOfBirth: personToUse.birthData.locationOfBirth,
          coordinates: personToUse.birthData.coordinates,
        },
        true // forceRegenerate
      );

      // Track analytics - chart regenerated
      trackChartGenerated('natal', {
        isRegeneration: true,
        personName: personToUse.name
      });

      if (chartData) {
        // Chart regenerated successfully
      }
    } catch (error) {
      alert("Failed to regenerate chart. Please try again.");
    }
  };

  const handlePersonChange = async (person: Person | null) => {
    setSelectedPerson(person);
    // Also update the global store
    setGlobalSelectedPerson(person?.id || null);

    // Only generate chart for selected person if we don't already have a cached chart
    // This prevents disrupting existing chart views when person selector auto-selects
    if (person?.birthData && user && !cachedChart) {
      try {
        await generateChart({
          name: person.name || "",
          dateOfBirth: person.birthData.dateOfBirth,
          timeOfBirth: person.birthData.timeOfBirth,
          locationOfBirth: person.birthData.locationOfBirth,
          coordinates: person.birthData.coordinates,
        });
      } catch (error) {
        // Error generating chart for selected person
      }
    }
  };

  const handleAddPersonClick = () => {
    // This is now handled by ChartQuickActions component
  };

  // Show chart display
  return (
    <>
      <main className="bg-white">
        {/* Chart Section - Full width breakout */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-8">
            {(() => {
              // Show loading state first if any of these conditions are true:
              // 1. User data is loading
              // 2. Chart cache is loading and we know there's an existing chart
              // 3. Chart is being generated
              // 4. No user data loaded yet (initial mount)
              if (isUserLoading || (isLoadingCache && hasExistingChart) || isGenerating || !user) {
                return (
                  <div className="border border-black bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      {/* Three-Element Bounce Loading */}
                      <div className="flex items-center justify-center space-x-2 mb-8">
                        <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-black animate-bounce"></div>
                      </div>

                      {/* Heading */}
                      <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
                        {isUserLoading ? 'Loading Your Profile' :
                          isGenerating ? 'Generating Your Chart' :
                            'Loading Your Chart'}
                      </h1>

                      {/* Description */}
                      <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
                        {isUserLoading ? 'Retrieving your birth data and preferences...' :
                          isGenerating ? 'Creating your cosmic blueprint from the stars...' :
                            'We\'re retrieving your cosmic blueprint. This should only take a moment...'}
                      </p>
                    </div>
                  </div>
                );
              }

              if (cachedChart) {
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
                    {/* Main Chart */}
                    <div className="lg:col-span-4 border-black lg:border-r">
                      {(() => {
                        const personToShow = selectedPerson || (user?.birthData ? {
                          name: user.username || "",
                          birthData: user.birthData
                        } : null);

                        return (
                          <NatalChartDisplay
                            svgContent={cachedChart.svg}
                            chartName={
                              cachedChart.metadata?.name ||
                              personToShow?.name ||
                              "Natal Chart"
                            }
                            birthData={
                              cachedChart.metadata?.birthData ||
                              personToShow?.birthData ||
                              user?.birthData ||
                              {
                                dateOfBirth: "",
                                timeOfBirth: "",
                                locationOfBirth: "",
                                coordinates: { lat: "", lon: "" }
                              }
                            }
                            chartData={cachedChart.metadata?.chartData}
                            personName={cachedChart.metadata?.name || personToShow?.name}
                            personAvatar={selectedPerson ? undefined : user?.profilePictureUrl}
                            onShare={async () => {
                              if (cachedChart?.id) {
                                console.log('Attempting to share chart with ID:', cachedChart.id);
                                const shareUrl = await shareChart(cachedChart.id);
                                if (shareUrl) {
                                  // Try native sharing first, fallback to clipboard
                                  if (navigator.share) {
                                    try {
                                      await navigator.share({
                                        title: `${cachedChart.metadata?.name || 'My'} Natal Chart`,
                                        text: `Check out ${cachedChart.metadata?.name || 'my'} natal chart from ${BRAND.name}!`,
                                        url: shareUrl,
                                      });
                                    } catch {
                                      // User cancelled sharing or sharing failed, copy to clipboard
                                      await navigator.clipboard.writeText(shareUrl);
                                      showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
                                    }
                                  } else {
                                    // Fallback to clipboard
                                    await navigator.clipboard.writeText(shareUrl);
                                    showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
                                  }
                                }
                              }
                            }}
                          />
                        );
                      })()}
                    </div>

                    {/* Sidebar with Actions */}
                    <div className="lg:col-span-2 bg-white">
                      {/* Quick Actions */}
                      <ChartQuickActions
                        onRegenerateChart={handleRegenerateChart}
                        isGenerating={isGenerating}
                        onPersonChange={handlePersonChange}
                        onAddPersonClick={handleAddPersonClick}
                        onClearCache={handleClearAllCaches}
                        chartId={cachedChart?.id}
                      />

                      {/* Birth Data Summary */}
                      {(() => {
                        const personToShow = selectedPerson || (user?.birthData ? {
                          name: user.username || "",
                          birthData: user.birthData
                        } : null);

                        const birthDataToShow = cachedChart?.metadata?.birthData || personToShow?.birthData;

                        return birthDataToShow && (
                          <BirthDataSummary
                            birthData={birthDataToShow}
                            personName={cachedChart?.metadata?.name || personToShow?.name}
                          />
                        );
                      })()}

                      {/* Interpretation Sidebar - Show when interpretation tab is active */}
                      {activeTab === 'interpretation' && (
                        <div className="border-t border-black">
                          <InterpretationSidebar
                            onSectionClick={(sectionId) => {
                              // Scroll to section or handle section navigation
                              const element = document.getElementById(`section-${sectionId}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div className="border border-black bg-white">
                  <div className="p-12 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-8">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>

                    {/* Heading */}
                    <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
                      Your Cosmic Journey Awaits
                    </h2>

                    {/* Description */}
                    <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto mb-12">
                      Unlock the mysteries of your birth chart and discover the celestial blueprint that makes you uniquely you.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black mb-12">
                      <div className="p-8 border-black md:border-r" style={{ backgroundColor: '#f0e3ff' }}>
                        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Planetary Positions</h3>
                        <p className="font-open-sans text-sm text-black/80">Discover where the planets were at your exact moment of birth</p>
                      </div>

                      <div className="p-8 border-black md:border-r" style={{ backgroundColor: '#6bdbff' }}>
                        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">House System</h3>
                        <p className="font-open-sans text-sm text-black/80">Explore the 12 houses that shape different areas of your life</p>
                      </div>

                      <div className="p-8" style={{ backgroundColor: '#f2e356' }}>
                        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Aspects & Energy</h3>
                        <p className="font-open-sans text-sm text-black/80">Understand the unique energy patterns in your cosmic design</p>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                      <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                      >
                        Create Your Chart
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>

                      <button
                        onClick={() => router.push('/guides/natal-chart')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Learn About Charts
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-8 border-t border-black">
                      <p className="font-open-sans text-sm text-black/60 mb-6">Not sure where to start?</p>
                      <div className="flex flex-wrap gap-8 justify-center text-sm">
                        <Link href="/faq" className="text-black font-semibold hover:text-black/70 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View FAQs
                        </Link>
                        <Link href="/learning-center" className="text-black font-semibold hover:text-black/70 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Learning Center
                        </Link>
                        <Link href="/contact" className="text-black font-semibold hover:text-black/70 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      </main>

      {/* Status Toast */}
      <StatusToast
        title={statusToast.title}
        message={statusToast.message}
        status={statusToast.status}
        isVisible={statusToast.isVisible}
        onHide={hideStatus}
        duration={statusToast.duration}
      />
    </>
  );
}
