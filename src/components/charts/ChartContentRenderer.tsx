/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import LoadingSpinner from '@/components/reusable/LoadingSpinner';
import ChartDisplayContainer from './ChartDisplayContainer';
import ChartEmptyState from './ChartEmptyState';

interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string; };
}

interface CachedChart {
  id: string;
  svg: string;
  metadata?: {
    name?: string;
    chartData?: any;
    userId?: string; // Add userId for contamination checking
  };
}

interface PersonToShow {
  name: string;
}

interface ChartContentRendererProps {
  isLoading: boolean;
  loadingTitle: string;
  loadingDescription: string;
  cachedChart: CachedChart | null;
  personToShow: PersonToShow | null;
  birthDataToShow: BirthData | null;
  chartSubjectAvatar: string;
  activeTab: string;
  isGenerating: boolean;
  hasBirthData?: boolean;
  onRegenerateChart: () => void;
  onPersonChange: (person: any) => void;
  onAddPersonClick: () => void;
  onClearCache: () => void;
  onShare: () => void;
}

/**
 * Main content renderer for chart page that handles loading, empty, and loaded states
 */
export default function ChartContentRenderer({
  isLoading,
  loadingTitle,
  loadingDescription,
  cachedChart,
  personToShow,
  birthDataToShow,
  chartSubjectAvatar,
  activeTab,
  isGenerating,
  hasBirthData = false,
  onRegenerateChart,
  onPersonChange,
  onAddPersonClick,
  onClearCache,
  onShare
}: ChartContentRendererProps) {
  const { user } = useUserStore();

  // CRITICAL: Clear contaminated cache in useEffect to prevent setState during render
  useEffect(() => {
    if (cachedChart && user) {
      const chartUserId = cachedChart.metadata?.userId;
      const currentUserId = user.id;

      // Check if chart belongs to a different user (admin contamination)
      if (chartUserId && chartUserId !== currentUserId) {
        onClearCache();
      }
    }
  }, [cachedChart?.id, user?.id, onClearCache]);

  // CRITICAL: Final validation layer before rendering
  // Prevent displaying wrong user's chart
  if (cachedChart && user) {
    const chartUserId = cachedChart.metadata?.userId;
    const currentUserId = user.id;

    // Check if chart belongs to a different user - show empty state, useEffect handles clearing
    if (chartUserId && chartUserId !== currentUserId) {
      return <ChartEmptyState />;
    }
  }
  // Loading state - use dynamic ChartEmptyState instead of blank spinner
  if (isLoading) {
    return (
      <ChartEmptyState
        isLoading={true}
        loadingTitle={loadingTitle}
        loadingDescription={loadingDescription}
        isGenerating={isGenerating}
        hasBirthData={hasBirthData}
      />
    );
  }

  // Chart available state
  if (cachedChart) {
    return (
      <ChartDisplayContainer
        cachedChart={cachedChart}
        personToShow={personToShow}
        birthDataToShow={birthDataToShow}
        chartSubjectAvatar={chartSubjectAvatar}
        activeTab={activeTab}
        isGenerating={isGenerating}
        onRegenerateChart={onRegenerateChart}
        onPersonChange={onPersonChange}
        onAddPersonClick={onAddPersonClick}
        onClearCache={onClearCache}
        onShare={onShare}
      />
    );
  }

  // Empty state - no chart available (but might be loading/generating)
  return (
    <ChartEmptyState
      isLoading={isLoading || isGenerating}
      loadingTitle={loadingTitle}
      loadingDescription={loadingDescription}
      isGenerating={isGenerating}
      hasBirthData={hasBirthData}
    />
  );
}