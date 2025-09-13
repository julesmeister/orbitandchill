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
  
  // Load existing charts and generate ONE chart if needed (NO LOOPS)
  useEffect(() => {
    if (!user?.id || isGenerating) {
      return;
    }

    const loadChartsOnce = async () => {
      try {
        console.log('📊 Loading existing charts (controlled generation)');
        const existingCharts = await getUserCharts();
        console.log('📊 Found existing charts:', existingCharts.length);

        // ALWAYS CLEAR CACHE AND GENERATE FRESH FROM API (no cache usage)
        if (cachedChart) {
          console.log('🔄 CLEARING CACHE - API-only generation as requested');
          clearCache();
        }

        // ALWAYS generate fresh chart from API
        if (activeSelectedPerson?.birthData) {
          console.log('🚀 GENERATING FRESH CHART WITH CELESTIAL POINTS for:', activeSelectedPerson.name);
          const chartData = await generateChart({
            name: activeSelectedPerson.name || '',
            dateOfBirth: activeSelectedPerson.birthData.dateOfBirth,
            timeOfBirth: activeSelectedPerson.birthData.timeOfBirth,
            locationOfBirth: activeSelectedPerson.birthData.locationOfBirth || 'Unknown',
            coordinates: activeSelectedPerson.birthData.coordinates
          }, true); // FORCE REGENERATION to ensure celestial points

          if (chartData) {
            console.log('✅ ONE-TIME chart generation completed:', chartData.id);
          }
        }
      } catch (error: any) {
        console.error('❌ Error in controlled chart loading:', error);
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
    console.log('🔄 API-only chart regeneration started with person:', personToUse?.name);

    if (!personToUse?.birthData) {
      console.warn('🔄 Chart regeneration cancelled: No person or birth data available');
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

      if (chartData) {
        console.log('✅ API-only chart regeneration successful:', {
          personName: personToUse.name,
          chartId: chartData.id,
          hasData: !!chartData
        });
      } else {
        console.warn('⚠️ Chart regeneration returned null - API may be unavailable');
      }
    } catch (error: any) {
      console.error('❌ Chart regeneration error:', error.message);
    }
  };
  
  const handlePersonChange = async (person: Person | null) => {
    console.log('👤 API-only person change requested:', {
      personId: person?.id,
      personName: person?.name,
      hasCurrentChart: !!cachedChart
    });

    setSelectedPerson(person);
    setApiSelectedPerson(person?.id || null);

    // Clear existing chart when switching people
    clearCache();

    // If no person selected, stop here
    if (!person?.birthData) {
      console.log('👤 No person selected or no birth data');
      return;
    }

    // Generate chart for the new person
    try {
      console.log('👤 Generating chart for person:', person.name);
      await generateChart({
        name: person.name || "",
        dateOfBirth: person.birthData.dateOfBirth,
        timeOfBirth: person.birthData.timeOfBirth,
        locationOfBirth: person.birthData.locationOfBirth,
        coordinates: person.birthData.coordinates,
      });
    } catch (error) {
      console.error('❌ Error generating chart for new person:', error);
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
  
  const loadingTitle = isUserLoading ? 'Loading Your Profile' :
    isGenerating && !cachedChart ? 'Generating Your Chart' :
    cachedChart && isGenerating ? 'Updating Chart' :
    'Loading Your Chart';
  
  const loadingDescription = isUserLoading ? 'Retrieving your birth data and preferences...' :
    isGenerating && !cachedChart ? 'Creating your cosmic blueprint from the stars...' :
    cachedChart && isGenerating ? 'Refreshing your chart with latest calculations...' :
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
    
    // Handlers
    handleClearAllCaches,
    handleRegenerateChart,
    handlePersonChange,
    handleAddPersonClick,
    handleShare,
    setActiveTab,
  };
};