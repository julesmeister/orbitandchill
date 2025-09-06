/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { usePeopleStore } from '../store/peopleStore';
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
  const { setSelectedPerson: setGlobalSelectedPerson, selectedPerson: globalSelectedPerson } = usePeopleStore();
  const { activeTab, setActiveTab } = useChartTab();
  const { defaultPerson, selectedPerson: peopleSelectedPerson, loadPeople } = usePeopleAPI();
  
  // Local state
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [sharedChartLoaded, setSharedChartLoaded] = useState(false);
  
  // Use people system's selected person, or global selected person, or local state, or default person
  const activeSelectedPerson = peopleSelectedPerson || globalSelectedPerson || selectedPerson || defaultPerson;
  
  // Chart management
  const {
    generateChart,
    isGenerating,
    cachedChart,
    shareChart,
    getUserCharts,
    hasExistingChart,
    isLoadingCache,
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
  
  // OPTIMIZED: More aggressive chart loading with reduced delays
  useEffect(() => {
    
    // Start chart operations as soon as we have user data
    if (cachedChart || isGenerating || !user?.id) {
      return;
    }
    
    // Immediate load for fastest performance
    const loadOrGenerateChart = async () => {
      // Double-check these conditions  
      if (isGenerating || cachedChart) {
        return;
      }
        
        try {
          // OPTIMIZED: Remove artificial timeout and load charts naturally
          const existingCharts = await getUserChartsRef.current();
          
          if (existingCharts.length > 0) {
            return;
          }
        } catch (error: any) {
          
          if (error.message?.includes('Circuit breaker is OPEN')) {
            return;
          } else if (error.message?.includes('timeout') || error.message?.includes('Connection') || error.message?.includes('getUserCharts timeout')) {
            // Continue to generation - don't return here
          } else {
            // Continue to generation - don't return here  
          }
        }
        
        // Use the default person if available, otherwise fall back to user data
        const chartPerson = defaultPerson || (user.birthData?.dateOfBirth && user.birthData?.timeOfBirth && user.birthData?.coordinates?.lat ? {
          name: user.username || '',
          birthData: user.birthData
        } : null);
        
        if (chartPerson?.birthData) {
          try {
            const chartData = await generateChartRef.current({
              name: chartPerson.name || '',
              dateOfBirth: chartPerson.birthData.dateOfBirth,
              timeOfBirth: chartPerson.birthData.timeOfBirth,
              locationOfBirth: chartPerson.birthData.locationOfBirth || 'Unknown',
              coordinates: chartPerson.birthData.coordinates
            });
            
            // Track chart generation with essential metadata
            trackChartGeneration('natal', {
              isAutoGenerated: true,
              hasCompleteProfile: !!(user.birthData?.dateOfBirth && user.birthData?.timeOfBirth && user.birthData?.coordinates?.lat)
            });
            
          } catch (error: any) {
            console.error('Error generating chart:', error);
          }
        }
      };
      
      loadOrGenerateChart();
  }, [cachedChart, isGenerating, user?.id, user?.birthData, defaultPerson]);
  
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
            setGlobalSelectedPerson(sharedPerson.id);
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
  }, [searchParams, sharedChartLoaded, router, setGlobalSelectedPerson]);

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
      }
    } catch (error: any) {
      console.error('Regeneration error:', error);
      if (error.message?.includes('Circuit breaker is OPEN')) {
      } else if (error.message?.includes('timeout') || error.message?.includes('Connection')) {
      } else {
      }
    }
  };
  
  const handlePersonChange = async (person: Person | null) => {
    setSelectedPerson(person);
    setGlobalSelectedPerson(person?.id || null);
    
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
  
  const birthDataToShow = cachedChart?.metadata?.birthData || personToShow?.birthData;
  
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