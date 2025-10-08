/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { useChartTab } from '../store/chartStore';
import { useNatalChart } from './useNatalChart';
import { usePeopleAPI } from './usePeopleAPI';
import { Person } from '../types/people';
import { trackChartGeneration } from '../lib/analytics'; // Use Google Analytics
import { BRAND } from '../config/brand';

export const useChartPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isProfileComplete, isLoading: isUserLoading, loadProfile } = useUserStore();
  const { activeTab, setActiveTab } = useChartTab();
  const { defaultPerson, selectedPerson: peopleSelectedPerson, setSelectedPerson: setApiSelectedPerson, loadPeople } = usePeopleAPI();
  
  // Local state
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [sharedChartLoaded, setSharedChartLoaded] = useState(false);
  
  // Use people system's selected person, or local state, or default person
  const activeSelectedPerson = peopleSelectedPerson || selectedPerson || defaultPerson;
  
  // Chart management
  const {
    generateChart,
    isGenerating,
    cachedChart,
    shareChart,
    getUserCharts,
    hasExistingChart,
    isLoadingCache,
    clearCache,
  } = useNatalChart(activeSelectedPerson);
  
  
  // Create refs for stable function references
  const generateChartRef = useRef(generateChart);
  const getUserChartsRef = useRef(getUserCharts);
  
  // Update refs when functions change
  useEffect(() => {
    generateChartRef.current = generateChart;
    getUserChartsRef.current = getUserCharts;
  }, [generateChart, getUserCharts]);
  
  // OPTIMIZED: Load user profile and people in parallel for faster initial load
  useEffect(() => {
    const initializeData = async () => {
      // Start loading user profile immediately
      if (!user && !isUserLoading) {
        await loadProfile();
      }
      
      // Load people as soon as we have a user ID
      if (user?.id) {
        // Don't await - let this run in parallel with chart operations
        loadPeople();
        
        // OPTIMIZATION: Preemptively try to load charts in parallel
        // This reduces the delay before chart generation starts
        if (!cachedChart && !isGenerating) {
          getUserChartsRef.current().catch(() => {
            // Ignore errors - this is just a preemptive load
          });
        }
      }
    };
    
    initializeData();
  }, [user, isUserLoading, loadProfile, loadPeople]);
  
  // Track what charts we've already generated to prevent loops
  const generatedChartsRef = useRef<Set<string>>(new Set());

  // Load existing charts and generate ONE chart if needed (NO LOOPS)
  useEffect(() => {
    if (!user?.id || isGenerating) {
      return;
    }

    // Create a unique key for this person's chart
    const personKey = `${user.id}_${activeSelectedPerson?.id || 'default'}`;

    // Skip if we've already generated a chart for this person
    if (generatedChartsRef.current.has(personKey)) {
      return;
    }

    const loadChartsOnce = async () => {
      try {
        const existingCharts = await getUserCharts();

        // ALWAYS CLEAR CACHE AND GENERATE FRESH FROM API (no cache usage)
        if (cachedChart) {
          clearCache();
        }

        // ALWAYS generate fresh chart from API (ONLY ONCE per person)
        if (activeSelectedPerson?.birthData) {
          // Mark this person as having a generated chart BEFORE generating
          generatedChartsRef.current.add(personKey);

          const chartData = await generateChart({
            name: activeSelectedPerson.name || '',
            dateOfBirth: activeSelectedPerson.birthData.dateOfBirth,
            timeOfBirth: activeSelectedPerson.birthData.timeOfBirth,
            locationOfBirth: activeSelectedPerson.birthData.locationOfBirth || 'Unknown',
            coordinates: activeSelectedPerson.birthData.coordinates
          }, true); // FORCE REGENERATION to ensure celestial points

          if (!chartData) {
            // If generation failed, remove the key so it can be retried
            generatedChartsRef.current.delete(personKey);
          }
        }
      } catch (error: any) {
        console.error('Error in controlled chart loading:', error);
        // Remove key on error so it can be retried
        generatedChartsRef.current.delete(personKey);
      }
    };

    loadChartsOnce();
  }, [user?.id, activeSelectedPerson?.id]); // Only trigger on user/person change
  
  // Handle share token from URL
  useEffect(() => {
    const shareToken = searchParams.get('shareToken');
    if (shareToken && !sharedChartLoaded) {
      const loadSharedChart = async () => {
        try {
          const response = await fetch(`/api/charts/shared?shareToken=${shareToken}`);
          const result = await response.json();
          
          if (result.success && result.chart) {
            const sharedChart = result.chart;
            // Convert shared chart to person format
            const sharedPerson: Person = {
              id: `shared_${shareToken}`,
              userId: 'shared',
              name: sharedChart.subjectName || 'Shared Chart',
              relationship: 'other',
              birthData: {
                dateOfBirth: sharedChart.dateOfBirth,
                timeOfBirth: sharedChart.timeOfBirth,
                locationOfBirth: sharedChart.locationOfBirth,
                coordinates: {
                  lat: sharedChart.latitude?.toString() || '',
                  lon: sharedChart.longitude?.toString() || '',
                },
              },
              createdAt: new Date(sharedChart.createdAt),
              updatedAt: new Date(sharedChart.createdAt),
              notes: `Shared chart from ${new Date(sharedChart.createdAt).toLocaleDateString()}`,
            };
            
            // Set as selected person
            setSelectedPerson(sharedPerson);
            setApiSelectedPerson(sharedPerson.id);
            setSharedChartLoaded(true);
            
            // Show success message
            
            // Clean up URL by removing the share token
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('shareToken');
            router.replace(newUrl.pathname + newUrl.search);
          } else {
          }
        } catch (error) {
          console.error('Error loading shared chart:', error);
        }
      };
      
      loadSharedChart();
    }
  }, [searchParams, sharedChartLoaded, router, setApiSelectedPerson]);

  // Track page view analytics
  useEffect(() => {
    // Page view tracking handled by Google Analytics automatically
  }, []);
  
  // Handler functions
  const handleClearAllCaches = async () => {
    if (!user) return;
    
    try {
      await handleRegenerateChart();
    } catch (error) {
    }
  };
  
  const handleRegenerateChart = async () => {
    const personToUse = activeSelectedPerson;

    if (!personToUse?.birthData) {
      return;
    }

    try {
      // Clear existing chart first for clean state
      clearCache();

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

      trackChartGeneration('natal', {
        isRegeneration: true,
        personName: personToUse.name
      });
    } catch (error: any) {
      console.error('Chart regeneration error:', error.message);
    }
  };
  
  const handlePersonChange = async (person: Person | null) => {
    setSelectedPerson(person);
    setApiSelectedPerson(person?.id || null);

    // Clear existing chart when switching people
    clearCache();

    // Clear the generation tracking to allow regeneration
    const personKey = `${user?.id}_${person?.id || 'default'}`;
    generatedChartsRef.current.delete(personKey);

    // If no person selected, stop here
    if (!person?.birthData) {
      return;
    }

    // Generate chart for the new person
    try {
      await generateChart({
        name: person.name || "",
        dateOfBirth: person.birthData.dateOfBirth,
        timeOfBirth: person.birthData.timeOfBirth,
        locationOfBirth: person.birthData.locationOfBirth,
        coordinates: person.birthData.coordinates,
      }, true); // Force regenerate to ensure fresh data
    } catch (error) {
      console.error('Error generating chart for new person:', error);
    }
  };
  
  const handleAddPersonClick = () => {
    // This is now handled by ChartQuickActions component
  };
  
  const handleShare = async () => {
    if (cachedChart?.id) {
      const shareUrl = await shareChart(cachedChart.id);
      if (shareUrl) {
        if (navigator.share) {
          try {
            await navigator.share({
              title: `${cachedChart.metadata?.name || 'My'} Natal Chart`,
              text: `Check out ${cachedChart.metadata?.name || 'my'} natal chart from ${BRAND.name}!`,
              url: shareUrl,
            });
          } catch {
            // User cancelled sharing or sharing failed, copy to clipboard
            try {
              await navigator.clipboard.writeText(shareUrl);
            } catch (clipboardError) {
              // Fallback: try to focus the document and retry
              try {
                window.focus();
                await navigator.clipboard.writeText(shareUrl);
                } catch (retryError) {
                // Final fallback: show the URL to user
              }
            }
          }
        } else {
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(shareUrl);
          } catch (clipboardError) {
            // Fallback: try to focus the document and retry
            try {
              window.focus();
              await navigator.clipboard.writeText(shareUrl);
            } catch (retryError) {
              // Final fallback: show the URL to user
            }
          }
        }
      }
    }
  };
  
  // OPTIMIZED: Smarter loading state that reduces perceived loading time
  // Only show loading when we're actually waiting for essential data
  const isLoading = isUserLoading || (!user && !cachedChart) || (isGenerating && !cachedChart && !hasExistingChart);
  
  // Use the activeSelectedPerson which properly includes the default person with relationship: 'self'
  const personToShow = activeSelectedPerson;
  
  // Always prefer the current person's birth data over cached data for immediate updates
  const birthDataToShow = personToShow?.birthData || cachedChart?.metadata?.birthData;
  
  // Determine if user has birth data (form was submitted)
  const hasBirthData = Boolean(
    personToShow?.birthData?.dateOfBirth &&
    personToShow?.birthData?.timeOfBirth &&
    personToShow?.birthData?.coordinates?.lat
  );

  const loadingTitle = isUserLoading ? 'Loading Your Profile' :
    isGenerating && !cachedChart ? 'Generating Your Chart' :
    cachedChart && isGenerating ? 'Updating Chart' :
    hasBirthData ? 'Preparing Your Chart' :
    'Loading Your Chart';

  const loadingDescription = isUserLoading ? 'Retrieving your birth data and preferences...' :
    isGenerating && !cachedChart ? 'Creating your cosmic blueprint from the stars...' :
    cachedChart && isGenerating ? 'Refreshing your chart with latest calculations...' :
    hasBirthData ? 'Calculating planetary positions and aspects...' :
    'Retrieving your cosmic blueprint...';
  
  
  return {
    // State
    router,
    user,
    selectedPerson,
    activeSelectedPerson,
    activeTab,
    cachedChart,
    personToShow,
    birthDataToShow,

    // Loading states
    isLoading,
    isGenerating,
    loadingTitle,
    loadingDescription,
    hasBirthData,

    // Handlers
    handleClearAllCaches,
    handleRegenerateChart,
    handlePersonChange,
    handleAddPersonClick,
    handleShare,
    setActiveTab,
  };
};