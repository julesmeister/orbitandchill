/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Person } from '../../../types/people';
import { usePeopleAPI } from '../../../hooks/usePeopleAPI';
import { useStatusToast } from '../../../hooks/useStatusToast';
import { useUserStore } from '../../../store/userStore';
import { usePeopleStore } from '../../../store/peopleStore';

interface UseChartActionsProps {
  chartId?: string;
  onPersonChange?: (person: Person | null) => void;
}

export function useChartActions({ chartId, onPersonChange }: UseChartActionsProps) {
  const router = useRouter();
  const { selectedPerson, defaultPerson, setSelectedPerson } = usePeopleAPI();
  const { setSelectedPerson: setGlobalSelectedPerson } = usePeopleStore();
  const { user } = useUserStore();
  const { showLoading, showSuccess, showError } = useStatusToast();
  
  // Refs to prevent unnecessary re-renders
  const lastPersonIdRef = useRef<string | null>(null);
  const isShareInProgressRef = useRef(false);

  // Memoized current person selection for optimization
  const currentPerson = useMemo(() => selectedPerson || defaultPerson, [selectedPerson, defaultPerson]);

  // Memoized person availability check
  const hasPersonData = useMemo(() => Boolean(currentPerson), [currentPerson]);

  // Memoized share button availability
  const canShare = useMemo(() => Boolean(chartId && user?.id && hasPersonData), [chartId, user?.id, hasPersonData]);

  // Unified person selection handler with dual store sync
  const handlePersonSelect = useCallback((person: Person | null) => {
    const personId = person?.id || null;
    
    // Avoid unnecessary updates if person hasn't changed
    if (lastPersonIdRef.current === personId) return;
    lastPersonIdRef.current = personId;
    
    // Sync both local and global stores
    setSelectedPerson(personId);
    setGlobalSelectedPerson(personId);
    
    // Notify parent component
    onPersonChange?.(person);
  }, [setSelectedPerson, setGlobalSelectedPerson, onPersonChange]);

  // Handle share chart button click
  const handleShareChart = useCallback(async () => {
    // Prevent multiple simultaneous share operations
    if (isShareInProgressRef.current) return;
    
    if (!user?.id) {
      showError('Share Failed', 'User not available');
      return;
    }

    if (!currentPerson) {
      showError('Share Failed', 'No person selected for chart generation');
      return;
    }
    
    isShareInProgressRef.current = true;

    try {
      showLoading('Generating Share Link', 'Creating fresh chart and shareable link...');

      // Step 1: Generate a fresh chart with current person data
      const generateResponse = await fetch('/api/charts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...currentPerson.birthData,
          forceRegenerate: true,
          isPublic: true,
          subjectName: currentPerson.name,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error(`Failed to generate fresh chart: ${generateResponse.status}`);
      }

      const generateData = await generateResponse.json();
      
      if (!generateData.success || !generateData.chart) {
        throw new Error('Chart generation failed or returned invalid data');
      }

      const newChartId = generateData.chart.id;

      // Step 2: Generate share token for the fresh chart
      const shareResponse = await fetch(`/api/charts/${newChartId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!shareResponse.ok) {
        throw new Error(`Failed to generate share link: ${shareResponse.status}`);
      }

      const shareData = await shareResponse.json();
      
      if (shareData.shareUrl) {
        try {
          await navigator.clipboard.writeText(shareData.shareUrl);
          showSuccess('Link Copied!', 'Fresh chart share link has been copied to your clipboard');
        } catch (clipboardError) {
          try {
            window.focus();
            await navigator.clipboard.writeText(shareData.shareUrl);
            showSuccess('Link Copied!', 'Fresh chart share link has been copied to your clipboard');
          } catch (retryError) {
            showSuccess('Share Link Ready', `Copy this link: ${shareData.shareUrl}`);
          }
        }
      } else {
        throw new Error('No share URL returned from server');
      }
    } catch (error) {
      console.error('Share chart error:', error);
      showError('Share Failed', 'Unable to create share link. Please try again.');
    } finally {
      isShareInProgressRef.current = false;
    }
  }, [user?.id, currentPerson, showLoading, showSuccess, showError]);

  // Optimized astrocartography navigation with person sync
  const handleAstrocartographyClick = useCallback(() => {
    if (!currentPerson) {
      showError('Navigation Error', 'Please select a person first');
      return;
    }
    
    try {
      const personDataForAstro = {
        id: currentPerson.id,
        name: currentPerson.name,
        relationship: currentPerson.relationship || 'other',
        birthData: currentPerson.birthData,
        notes: currentPerson.notes,
        isDefault: currentPerson.isDefault || false,
      };
      
      // Store the current person data in sessionStorage so astrocartography page can access it
      sessionStorage.setItem('astro_person_data', JSON.stringify(personDataForAstro));
      console.log('⚡ ChartActions: Storing person data for astrocartography:', personDataForAstro);
      
      // Also sync the selection to global store as fallback
      setGlobalSelectedPerson(currentPerson.id);
      
      // Navigate to astrocartography page
      router.push('/astrocartography');
    } catch (error) {
      console.error('Error preparing person data for astrocartography:', error);
      showError('Navigation Error', 'Failed to prepare person data for astrocartography');
    }
  }, [currentPerson, setGlobalSelectedPerson, router, showError]);

  return {
    currentPerson,
    hasPersonData,
    canShare,
    handlePersonSelect,
    handleShareChart,
    handleAstrocartographyClick,
  };
}