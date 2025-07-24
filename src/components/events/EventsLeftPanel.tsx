/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { TimingPriority } from '../../hooks/optimalTiming/types';
import NextBookmarkedEventCountdown from './NextBookmarkedEventCountdown';
import type { AstrologicalEvent } from '../../types/events';
import Panel from '../ui/Panel';
import PanelHeader from '../ui/PanelHeader';
import FormInput from '../ui/FormInput';
import ActionButton from '../ui/ActionButton';
import ViewToggleButton from '../ui/ViewToggleButton';
import PriorityButton from '../ui/PriorityButton';
import VertexCorners from '../ui/VertexCorners';
import { useSound } from '../../hooks/useSound';

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
  const { play: playHoverSound } = useSound('/sounds/hover.mp3', 0.3);
  const [isActionsViewsExpanded, setIsActionsViewsExpanded] = useState(false);
  const [isElectionalExpanded, setIsElectionalExpanded] = useState(false);

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
            {/* Desktop Header (always visible) */}
            <div className="hidden sm:block">
              <h1 className="font-space-grotesk text-2xl font-bold text-black mb-2">
                Electional Astrology
              </h1>
            </div>
            
            {/* Mobile Collapsible Header */}
            <div className={`sm:hidden -m-6 ${isElectionalExpanded ? 'mb-0' : ''}`}>
              <div className={`flex items-center justify-between px-4 py-3 ${isElectionalExpanded ? 'border-b border-gray-200' : ''}`}>
                <h1 className="font-space-grotesk text-lg font-bold text-black">
                  Electional Astrology
                </h1>
                <button
                  onClick={() => setIsElectionalExpanded(!isElectionalExpanded)}
                  onMouseEnter={playHoverSound}
                  className="p-1 border border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-200"
                >
                  <svg 
                    className={`w-4 h-4 text-black transition-transform duration-200 ${
                      isElectionalExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Always visible on desktop, collapsible on mobile */}
            <div className={`sm:block ${isElectionalExpanded ? 'block pt-4' : 'hidden'}`}>
            {/* Month Selector */}
            <div className="mb-4">
              <div className="bg-white border border-black p-1 flex items-center">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  onMouseEnter={playHoverSound}
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
                  onMouseEnter={playHoverSound}
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
                  onMouseEnter={playHoverSound}
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
            </div>
          </Panel>

          {/* Combined Actions & Views */}
          <Panel>
            {/* Desktop Header (always visible) */}
            <div className="hidden sm:block">
              <PanelHeader title="Actions & Views" />
            </div>
            
            {/* Mobile Collapsible Header */}
            <div className={`sm:hidden -m-6 ${isActionsViewsExpanded ? 'mb-0' : ''}`}>
              <div className={`flex items-center justify-between px-4 py-3 ${isActionsViewsExpanded ? 'border-b border-gray-200' : ''}`}>
                <h3 className="font-space-grotesk text-base font-semibold text-black">
                  Actions & Views
                </h3>
                <button
                  onClick={() => setIsActionsViewsExpanded(!isActionsViewsExpanded)}
                  onMouseEnter={playHoverSound}
                  className="p-1 border border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-200"
                >
                  <svg 
                    className={`w-4 h-4 text-black transition-transform duration-200 ${
                      isActionsViewsExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Always visible on desktop, collapsible on mobile */}
            <div className={`sm:block ${isActionsViewsExpanded ? 'block pt-4' : 'hidden'} space-y-4`}>
              {/* Quick Actions */}
              <div>
                <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowTimingOptions(true)}
                    onMouseEnter={playHoverSound}
                    disabled={isTimingGenerating}
                    className="relative group bg-white text-black border border-gray-300 hover:border-transparent px-3 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <VertexCorners show={!isTimingGenerating} />
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <span className="text-xs">✨</span>
                      <span>Generate</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setShowAddForm(true)}
                    onMouseEnter={playHoverSound}
                    className="relative group bg-white text-black border border-gray-300 hover:border-transparent px-3 py-2 text-sm font-medium transition-all duration-200"
                  >
                    <VertexCorners />
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <span className="text-xs">📅</span>
                      <span>Add Event</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Calendar Views */}
              <div>
                <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">Calendar Views</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedTab('bookmarked');
                      setViewMode('calendar');
                    }}
                    onMouseEnter={playHoverSound}
                    className={`relative group border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedTab === 'bookmarked' && viewMode === 'calendar'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-transparent'
                    }`}
                  >
                    <VertexCorners show={!(selectedTab === 'bookmarked' && viewMode === 'calendar')} />
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                      <span>⭐</span>
                      <span className="hidden sm:inline">Bookmarked</span>
                      <span className="sm:hidden">⭐</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTab('manual');
                      setViewMode('calendar');
                    }}
                    onMouseEnter={playHoverSound}
                    className={`relative group border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedTab === 'manual' && viewMode === 'calendar'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-transparent'
                    }`}
                  >
                    <VertexCorners show={!(selectedTab === 'manual' && viewMode === 'calendar')} />
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                      <span>✏️</span>
                      <span className="hidden sm:inline">Manual</span>
                      <span className="sm:hidden">✏️</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      if (viewMode === 'calendar') {
                        setViewMode('list');
                      } else {
                        setSelectedTab('generated');
                        setViewMode('calendar');
                      }
                    }}
                    onMouseEnter={playHoverSound}
                    className={`relative group border px-3 py-2 text-sm font-medium transition-all duration-200 col-span-1 sm:col-span-2 ${
                      viewMode === 'calendar'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-transparent'
                    }`}
                  >
                    <VertexCorners show={viewMode !== 'calendar'} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>✨</span>
                      <span>{viewMode === 'calendar' ? 'Hide Calendar' : 'Generated Events'}</span>
                    </span>
                  </button>
                </div>
              </div>
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
            onMouseEnter={playHoverSound}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}