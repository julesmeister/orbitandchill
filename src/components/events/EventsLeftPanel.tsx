/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { TimingPriority } from '../../hooks/optimalTiming/types';
import NextBookmarkedEventCountdown from './NextBookmarkedEventCountdown';
import type { AstrologicalEvent } from '../../types/events';
import Panel from '../ui/Panel';
import PanelHeader from '../ui/PanelHeader';
import FormInput from '../ui/FormInput';
import ActionButton from '../ui/ActionButton';
import ViewToggleButton from '../ui/ViewToggleButton';
import PriorityButton from '../ui/PriorityButton';

interface LocationDisplay {
  source: 'current' | 'birth' | 'fallback';
  shortName: string;
  name: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  isUserSet: boolean;
}

interface EventsLeftPanelProps {
  // Form states
  showTimingOptions: boolean;
  showAddForm: boolean;
  setShowTimingOptions: (show: boolean) => void;
  setShowAddForm: (show: boolean) => void;
  
  // Timing options
  timingPriorities: TimingPriority[];
  selectedPriorities: string[];
  togglePriority: (id: string) => void;
  isTimingGenerating: boolean;
  handleGenerateOptimalTiming: () => void;
  
  // Manual event form
  newEvent: {
    title: string;
    date: string;
    time: string;
    description: string;
  };
  setNewEvent: (event: any) => void;
  handleAddEvent: (e: React.FormEvent) => void;
  isAnalyzingEvent: boolean;
  
  // View controls
  selectedTab: string;
  viewMode: 'calendar' | 'list';
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual' | 'generated') => void;
  setViewMode: (mode: 'calendar' | 'list') => void;
  
  // Location and events
  locationDisplay: LocationDisplay;
  showLocationToast: () => void;
  events: AstrologicalEvent[];
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  
  // Date controls
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function EventsLeftPanel({
  showTimingOptions,
  showAddForm,
  setShowTimingOptions,
  setShowAddForm,
  timingPriorities,
  selectedPriorities,
  togglePriority,
  isTimingGenerating,
  handleGenerateOptimalTiming,
  newEvent,
  setNewEvent,
  handleAddEvent,
  isAnalyzingEvent,
  selectedTab,
  viewMode,
  setSelectedTab,
  setViewMode,
  locationDisplay,
  showLocationToast,
  events,
  error,
  setError,
  currentDate,
  setCurrentDate
}: EventsLeftPanelProps) {
  return (
    <div className="xl:col-span-1 space-y-6">
      {/* Generator Form */}
      {showTimingOptions && (
        <Panel data-timing-options>
          <PanelHeader 
            title="Generate Optimal Times" 
            onClose={() => setShowTimingOptions(false)} 
          />

          <div className="space-y-4">
            <p className="text-sm text-black/70 font-open-sans">
              Select your priorities for timing analysis:
            </p>

            <div className="space-y-2">
              {timingPriorities.map((priority) => (
                <PriorityButton
                  key={priority.id}
                  priority={priority}
                  isSelected={selectedPriorities.includes(priority.id)}
                  onToggle={togglePriority}
                />
              ))}
            </div>

            <ActionButton
              onClick={handleGenerateOptimalTiming}
              disabled={selectedPriorities.length === 0 || isTimingGenerating}
              isLoading={isTimingGenerating}
              variant="primary"
              className="px-6 py-3 border-2"
            >
              Generate Recommendations
            </ActionButton>
          </div>
        </Panel>
      )}

      {/* Add Event Form */}
      {showAddForm && (
        <Panel>
          <PanelHeader 
            title="Add Manual Event" 
            onClose={() => setShowAddForm(false)} 
          />

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title..."
                required
              />
              <FormInput
                label="Date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Time (Optional)"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
              <FormInput
                label="Description (Optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Brief description..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <ActionButton
                type="button"
                onClick={() => setShowAddForm(false)}
                variant="secondary"
                className="px-3 py-2 border-2 text-sm"
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => {
                  const now = new Date();
                  const currentDate = now.toISOString().split('T')[0];
                  const currentTime = now.toTimeString().slice(0, 5);
                  setNewEvent({ 
                    ...newEvent, 
                    date: currentDate,
                    time: currentTime
                  });
                }}
                variant="secondary"
                className="px-3 py-2 border-2 text-sm"
              >
                Now
              </ActionButton>
              <ActionButton
                type="submit"
                disabled={isAnalyzingEvent}
                isLoading={isAnalyzingEvent}
                variant="primary"
                className="px-6 py-2 border-2 text-sm font-medium"
              >
                Add Event
              </ActionButton>
            </div>
          </form>
        </Panel>
      )}

      {/* Default Left Panel Content - Show when no forms are active */}
      {!showTimingOptions && !showAddForm && (
        <>
          {/* Header */}
          <Panel>
            <h1 className="font-space-grotesk text-2xl font-bold text-black mb-2">
              Electional Astrology
            </h1>
            
            
            {/* Month Selector */}
            <div className="mb-4">
              <div className="bg-white border border-black p-1 flex items-center">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="inline-flex items-center justify-center px-3 py-2 text-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-semibold font-space-grotesk text-black px-4 py-2 flex-1 text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="inline-flex items-center justify-center px-3 py-2 text-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <p className="font-open-sans text-sm text-black/70 mb-4">
              Plan your wedding, launch your business, schedule important meetings, or make major decisions when the stars are most favorable for success.
            </p>
            {/* Next Bookmarked Event Countdown */}
            <div className="mb-4">
              <NextBookmarkedEventCountdown events={events} />
            </div>
            
            {/* Location Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {locationDisplay.source === 'current' ? '📍' :
                      locationDisplay.source === 'birth' ? '🏠' : '🏙️'}
                  </span>
                  <span className="font-space-grotesk font-medium text-black text-sm">
                    {locationDisplay.shortName}
                  </span>
                </div>
                <button
                  onClick={showLocationToast}
                  className="p-1 text-black hover:text-gray-600 transition-all duration-200"
                  title="Change location"
                >
                  ⚙️
                </button>
              </div>
              <p className="text-xs text-black/60 font-open-sans leading-relaxed">
                Your location is required for precise astrological calculations. We use it to determine planetary house positions, local sunrise/sunset times, and celestial angles specific to your geographic coordinates. This ensures optimal timing recommendations are accurate for your exact location on Earth.
              </p>
            </div>
          </Panel>

          {/* View Toggle for Calendar */}
          <Panel>
            <PanelHeader title="Calendar View" />
            <div className="space-y-3">
              <ViewToggleButton
                onClick={() => {
                  setSelectedTab('bookmarked');
                  setViewMode('calendar');
                }}
                isActive={selectedTab === 'bookmarked' && viewMode === 'calendar'}
                icon="⭐"
              >
                View Bookmarked Events
              </ViewToggleButton>
              
              <ViewToggleButton
                onClick={() => {
                  setSelectedTab('manual');
                  setViewMode('calendar');
                }}
                isActive={selectedTab === 'manual' && viewMode === 'calendar'}
                icon="✏️"
              >
                View Manual Events
              </ViewToggleButton>

              <ViewToggleButton
                onClick={() => {
                  if (viewMode === 'calendar') {
                    setViewMode('list');
                  } else {
                    setSelectedTab('generated');
                    setViewMode('calendar');
                  }
                }}
                isActive={viewMode === 'calendar'}
                icon="✨"
              >
                {viewMode === 'calendar' ? 'Hide Generated Events Calendar' : 'Generated Events'}
              </ViewToggleButton>
            </div>
          </Panel>

          {/* Action Buttons */}
          <Panel>
            <PanelHeader title="Quick Actions" />
            <div className="space-y-3">
              <ActionButton
                onClick={() => setShowTimingOptions(true)}
                disabled={isTimingGenerating}
                variant="secondary"
                icon="✨"
              >
                Generate Optimal Times
              </ActionButton>

              <ActionButton
                onClick={() => setShowAddForm(true)}
                variant="secondary"
                icon="📅"
              >
                Add Manual Event
              </ActionButton>
            </div>
          </Panel>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-red-800 font-open-sans text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}