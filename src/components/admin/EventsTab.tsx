/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useAdminEvents } from '@/hooks/useAdminEvents';
import { useEventFiltering } from '@/hooks/useEventFiltering';
import { useAdminEventForm } from '@/hooks/useAdminEventForm';
import { useEventSelection } from '@/hooks/useEventSelection';
import { useFilterState } from '@/hooks/useFilterState';
import { useEventHandlers } from '@/hooks/useEventHandlers';
import EventsActionBar from './EventsActionBar';
import EventStatsCards from './EventStatsCards';
import EventTypesBreakdown from './EventTypesBreakdown';
import UsageInsights from './UsageInsights';
import FeatureAdoption from './FeatureAdoption';
import ErrorDisplay from './ErrorDisplay';

interface EventsTabProps {
  isLoading: boolean;
}

export default function EventsTab({ isLoading }: EventsTabProps) {
  // Filter state management
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedSource,
    setSelectedSource,
    selectedTab,
    setSelectedTab,
    hideChallengingDates,
    setHideChallengingDates,
    showCombosOnly,
    setShowCombosOnly,
    showHousesOnly,
    setShowHousesOnly,
    showAspectsOnly,
    setShowAspectsOnly,
    showElectionalOnly,
    setShowElectionalOnly,
    resetFilters
  } = useFilterState();

  // Use the custom hook for data management
  const {
    events,
    analytics,
    isLoadingEvents,
    isLoadingAnalytics,
    eventsError,
    analyticsError,
    createEvent,
    updateEvent,
    deleteEvent,
    bulkDeleteEvents,
    refreshData
  } = useAdminEvents();

  // Use consolidated filtering hook
  const { filteredEvents, filterStats } = useEventFiltering({
    events,
    selectedTab,
    selectedType,
    hideChallengingDates,
    showCombosOnly,
    showHousesOnly,
    showAspectsOnly,
    showElectionalOnly,
    searchQuery,
  });

  const {
    showCreateForm,
    setShowCreateForm,
    editingEvent,
    formData,
    setFormData,
    resetForm,
    openCreateForm,
    openEditForm,
  } = useAdminEventForm();

  const {
    selectedEvents,
    setSelectedEvents,
    toggleEventSelection,
    selectAllEvents: selectAllEventsBase,
    clearSelection,
  } = useEventSelection();

  const selectAllEvents = () => selectAllEventsBase(filteredEvents);

  // Event handlers
  const {
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleBulkDelete
  } = useEventHandlers({
    createEvent,
    updateEvent,
    deleteEvent,
    bulkDeleteEvents,
    resetForm,
    clearSelection,
    editingEvent,
    formData
  });


  // Show error only if both data sources fail
  if ((eventsError || analyticsError) && !analytics && events.length === 0) {
    return (
      <ErrorDisplay
        eventsError={eventsError}
        analyticsError={analyticsError}
        onRetry={refreshData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-black pb-6">
        <h1 className="font-space-grotesk text-3xl font-bold text-black mb-2">
          Events Management
        </h1>
        <p className="font-open-sans text-black/70">
          Monitor and analyze astrological events created by users
        </p>
      </div>

      {/* Action Bar */}
      <EventsActionBar
        openCreateForm={openCreateForm}
        selectedEvents={selectedEvents}
        handleBulkDelete={handleBulkDelete}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />

      {/* Events Overview Stats */}
      <EventStatsCards analytics={analytics} />

      {/* Event Types Breakdown */}
      <EventTypesBreakdown analytics={analytics} />

      {/* Usage Insights */}
      <UsageInsights analytics={analytics} />

      {/* Feature Adoption */}
      <FeatureAdoption analytics={analytics} />
    </div>
  );
}