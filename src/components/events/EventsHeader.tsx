"use client";

import React from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';

interface NewEvent {
  title: string;
  date: string;
  time: string;
  description: string;
}

interface TimingPriority {
  id: string;
  icon: string;
  label: string;
  description: string;
}

interface EventsHeaderProps {
  events: AstrologicalEvent[];
  showCalendar: boolean;
  showTimingOptions: boolean;
  showAddForm: boolean;
  isTimingGenerating: boolean;
  isAnalyzingEvent: boolean;
  selectedPriorities: string[];
  challengingEventsCount: number;
  newEvent: NewEvent;
  timingPriorities: TimingPriority[];
  setShowCalendar: (show: boolean) => void;
  setShowTimingOptions: (show: boolean) => void;
  setShowAddForm: (show: boolean) => void;
  setIsFormAnimating: (animating: boolean) => void;
  setNewEvent: (event: NewEvent) => void;
  handleGenerateOptimalTiming: () => void;
  handleAddEvent: (e: React.FormEvent) => Promise<void>;
  togglePriority: (priorityId: string) => void;
}

export default function EventsHeader({
  events,
  showCalendar,
  showTimingOptions,
  showAddForm,
  isTimingGenerating,
  isAnalyzingEvent,
  selectedPriorities,
  challengingEventsCount,
  newEvent,
  timingPriorities,
  setShowCalendar,
  setShowTimingOptions,
  setShowAddForm,
  setIsFormAnimating,
  setNewEvent,
  handleGenerateOptimalTiming,
  handleAddEvent,
  togglePriority
}: EventsHeaderProps) {
  // Focus restoration helper for form inputs to prevent interaction blocking
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Ensure the input is properly focused and any existing focus corruption is cleared
    try {
      const target = e.target;
      // Brief timeout to ensure DOM is ready
      setTimeout(() => {
        if (target && document.activeElement !== target) {
          target.focus();
        }
      }, 10);
    } catch (error) {
      console.warn('Focus restoration failed:', error);
    }
  };

  // Window focus reset to prevent input field blocking (same solution as delete buttons)
  const handleWindowFocusReset = async () => {
    setTimeout(async () => {
      try {
        // Web fallback for focus reset (same as delete button solution)
        window.blur();
        await new Promise(resolve => setTimeout(resolve, 50));
        window.focus();
        
        // Additional DOM focus cleanup
        if (document.activeElement && document.activeElement !== document.body) {
          (document.activeElement as HTMLElement).blur();
        }
        document.body.focus();
      } catch (error) {
        console.warn('Focus reset failed:', error);
      }
    }, 200);
  };

  return (
    <header className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23374151' stroke-width='0.5' opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`
        }}>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 pt-16 pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Events Dashboard
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Manage your astrological events and discover optimal timing for important life moments
            </p>
            
            {/* Stats */}
            <div className="flex space-x-6 text-sm flex-wrap">
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{events.length}</div>
                <div className="text-gray-300">Total Events</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{events.filter(e => e.type === 'benefic').length}</div>
                <div className="text-gray-300">Favorable</div>
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-xl px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{events.filter(e => e.isGenerated).length}</div>
                <div className="text-gray-300">AI Generated</div>
              </div>
              {challengingEventsCount > 0 && (
                <div className="backdrop-blur-sm bg-white/10 rounded-xl px-6 py-4 border border-orange-300/30 ring-1 ring-orange-400/20">
                  <div className="text-2xl font-bold text-orange-200">{challengingEventsCount}</div>
                  <div className="text-orange-300">⚠️ Challenging</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            {/* Calendar Toggle */}
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 min-w-[220px] ${
                showCalendar
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400'
                  : 'bg-white/15 backdrop-blur-md text-white border-2 border-white/30 shadow-xl hover:bg-white/25 hover:border-white/50 hover:shadow-2xl'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  showCalendar ? 'bg-white/20' : 'bg-emerald-500/80'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="tracking-wide text-right">
                  {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                </span>
              </div>
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                showCalendar ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-all duration-300"></div>
              </div>
            </button>
            
            {/* Generate Timing Button */}
            <button
              onClick={() => {
                if (showTimingOptions) {
                  handleGenerateOptimalTiming();
                } else {
                  setShowTimingOptions(!showTimingOptions);
                  setShowAddForm(false);
                }
              }}
              disabled={isTimingGenerating}
              className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 min-w-[220px] ${
                isTimingGenerating 
                  ? 'bg-purple-300/50 text-white/60 cursor-not-allowed shadow-lg'
                  : showTimingOptions && selectedPriorities.length > 0
                  ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/50 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:from-purple-400 hover:to-violet-400'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className={`p-1.5 rounded-lg bg-white/20 transition-all duration-300 ${
                  isTimingGenerating ? 'animate-pulse' : ''
                }`}>
                  {isTimingGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="tracking-wide text-right">
                    {showTimingOptions && selectedPriorities.length > 0 
                      ? `Generate ${selectedPriorities.length} Timing${selectedPriorities.length > 1 ? 's' : ''}`
                      : isTimingGenerating ? 'Generating...' : 'Generate Timing'
                    }
                  </span>
                  {showTimingOptions && selectedPriorities.length > 0 && (
                    <div className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                      {selectedPriorities.length}
                    </div>
                  )}
                </div>
              </div>
              {!isTimingGenerating && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/10 to-purple-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>
            
            {/* Add Event Button */}
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (!showAddForm) {
                  setShowTimingOptions(false);
                }
                setIsFormAnimating(true);
                setTimeout(() => setIsFormAnimating(false), 300);
                
                // Apply focus reset to prevent input field blocking
                handleWindowFocusReset();
              }}
              className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 min-w-[220px] ${
                showAddForm
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 hover:from-red-400 hover:to-pink-400'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:from-blue-400 hover:to-cyan-400'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="p-1.5 rounded-lg bg-white/20 transition-all duration-300">
                  {showAddForm ? (
                    <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                <span className="tracking-wide text-right">
                  {showAddForm ? 'Cancel Event' : 'Add Event'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Sliding Add Event Form - part of header gradient */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showAddForm ? 'max-h-[250px] pb-8' : 'max-h-0'
      }`}>
        <div className="relative z-10 max-w-[1600px] mx-auto px-6">
          <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Event Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                onFocus={handleInputFocus}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                onFocus={handleInputFocus}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Time (Optional)</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                onFocus={handleInputFocus}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
              />
            </div>
            
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                onFocus={handleInputFocus}
                rows={3}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe the astrological significance..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">&nbsp;</label>
              <button
                type="submit"
                disabled={isAnalyzingEvent}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                  isAnalyzingEvent 
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                }`}
                style={{ height: 'calc(3rem * 1.5 + 1rem)' }}
              >
                {isAnalyzingEvent ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Timing Priority Options - slides below Generate button */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showTimingOptions ? 'max-h-[400px] pb-8' : 'max-h-0'
      }`}>
        <div className="relative z-10 max-w-[1600px] mx-auto px-6">
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-4">What would you like to prioritize?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {timingPriorities.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => togglePriority(priority.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    selectedPriorities.includes(priority.id)
                      ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/20'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  {selectedPriorities.includes(priority.id) && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="text-3xl mb-2">{priority.icon}</div>
                  <div className="text-sm font-medium text-white">{priority.label}</div>
                  <div className="text-xs text-white/60 mt-1">{priority.description}</div>
                </button>
              ))}
            </div>
            {selectedPriorities.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-white/80 text-sm">
                  Selected {selectedPriorities.length} priorit{selectedPriorities.length === 1 ? 'y' : 'ies'}. 
                  Click the Generate button above to create your personalized timing map!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}