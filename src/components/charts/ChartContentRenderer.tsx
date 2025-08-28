/* eslint-disable @typescript-eslint/no-unused-vars */

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
  onRegenerateChart,
  onPersonChange,
  onAddPersonClick,
  onClearCache,
  onShare
}: ChartContentRendererProps) {
  const { user } = useUserStore();
  
  // CRITICAL: Final validation layer before rendering
  // Prevent displaying wrong user's chart
  if (cachedChart && user) {
    const chartName = cachedChart.metadata?.name;
    const currentUsername = user.username;
    
    // Check for obvious contamination
    if (chartName === 'Orbit Chill' && currentUsername !== 'Orbit Chill') {
      console.error('🚨 CRITICAL: Prevented rendering admin chart for non-admin user!');
      console.error('🚨 Chart name:', chartName, 'User:', currentUsername);
      // Force empty state and clear cache
      onClearCache();
      return <ChartEmptyState />;
    }
  }
  // Loading state
  if (isLoading) {
    return (
      <LoadingSpinner
        variant="dots"
        size="lg"
        title={loadingTitle}
        subtitle={loadingDescription}
        screenCentered={true}
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

  // Empty state - no chart available
  return <ChartEmptyState />;
}