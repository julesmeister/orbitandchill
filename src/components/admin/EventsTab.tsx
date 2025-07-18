/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Search, Plus, Calendar, Star, Trash2, Edit3, Bookmark } from 'lucide-react';
import { useAdminEvents } from '@/hooks/useAdminEvents';
import { useEventFiltering } from '@/hooks/useEventFiltering';
import { useAdminEventForm, EventFormData } from '@/hooks/useAdminEventForm';
import { useEventSelection } from '@/hooks/useEventSelection';
import { 
  getGeneratedPercentage, 
  getBeneficPercentage, 
  getBookmarkPercentage, 
  getManualPercentage 
} from '@/utils/analyticsHelpers';

interface EventsTabProps {
  isLoading: boolean;
}

export default function EventsTab({ isLoading }: EventsTabProps) {
  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'benefic' | 'challenging' | 'neutral'>('all');
  const [selectedSource, setSelectedSource] = useState<'all' | 'generated' | 'manual'>('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'bookmarked' | 'manual'>('all');
  const [hideChallengingDates, setHideChallengingDates] = useState(false);
  const [showCombosOnly, setShowCombosOnly] = useState(false);
  const [showHousesOnly, setShowHousesOnly] = useState(false);
  const [showAspectsOnly, setShowAspectsOnly] = useState(false);
  const [showElectionalOnly, setShowElectionalOnly] = useState(false);

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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        ...formData,
        score: formData.type === 'benefic' ? 8 : formData.type === 'challenging' ? 3 : 5,
      });
      
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      await updateEvent(editingEvent.id, formData);
      resetForm();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedEvents.length} events?`)) return;
    
    try {
      await bulkDeleteEvents(selectedEvents);
      clearSelection();
    } catch (error) {
      console.error('Error bulk deleting events:', error);
      alert('Failed to delete some events. Please try again.');
    }
  };

  // Show error only if both data sources fail
  if ((eventsError || analyticsError) && !analytics && events.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800 font-open-sans text-sm mb-2">
            {eventsError || analyticsError || 'Failed to load data'}
          </p>
          <button 
            onClick={refreshData}
            className="text-red-600 hover:text-red-800 underline text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
          
          {selectedEvents.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white border border-red-600 font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedEvents.length})
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black w-64"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="all">All Types</option>
            <option value="benefic">Benefic</option>
            <option value="challenging">Challenging</option>
            <option value="neutral">Neutral</option>
          </select>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="all">All Sources</option>
            <option value="generated">Generated</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Events Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-open-sans text-sm text-black/60 mb-1">Total Events</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">
                {analytics?.totalEvents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-open-sans text-sm text-black/60 mb-1">This Month</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">
                {analytics?.eventsThisMonth || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-open-sans text-sm text-black/60 mb-1">Active Users</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">
                {analytics?.usageStats.activeUsers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-open-sans text-sm text-black/60 mb-1">Average Score</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">
                {analytics?.engagementStats.averageScore || 0}/10
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Event Types Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black p-8">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Event Types</h3>
          {analytics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
                <span className="font-open-sans text-sm font-medium text-black">Benefic Events</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.eventsByType.benefic}</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#ff6b6b' }}>
                <span className="font-open-sans text-sm font-medium text-black">Challenging Events</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.eventsByType.challenging}</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
                <span className="font-open-sans text-sm font-medium text-black">Neutral Events</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.eventsByType.neutral}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-black bg-gray-50">
              <p className="font-open-sans text-sm text-black/60">Loading...</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-black p-8">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Generation & Engagement</h3>
          {analytics ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#f2e356' }}>
                <span className="font-open-sans text-sm font-medium text-black">Generated Events</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.generationStats.generated}</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#ff91e9' }}>
                <span className="font-open-sans text-sm font-medium text-black">Manual Events</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.generationStats.manual}</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
                <span className="font-open-sans text-sm font-medium text-black">Bookmarked Events</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.engagementStats.bookmarked}</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
                <span className="font-open-sans text-sm font-medium text-black">Events per User</span>
                <span className="font-open-sans text-sm font-bold text-black">{analytics.usageStats.eventsPerUser}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-black bg-gray-50">
              <p className="font-open-sans text-sm text-black/60">Loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Insights */}
      <div className="bg-white border border-black p-8">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Usage Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-black">
            <div className="text-3xl font-space-grotesk font-bold text-black mb-2">
              {getGeneratedPercentage(analytics)}%
            </div>
            <div className="font-open-sans text-sm text-black/60">Generated Events</div>
            <div className="font-open-sans text-xs text-black/40 mt-1">
              Users prefer auto-generated optimal timing
            </div>
          </div>
          
          <div className="text-center p-6 border border-black">
            <div className="text-3xl font-space-grotesk font-bold text-black mb-2">
              {getBeneficPercentage(analytics)}%
            </div>
            <div className="font-open-sans text-sm text-black/60">Benefic Events</div>
            <div className="font-open-sans text-xs text-black/40 mt-1">
              Users focus on positive timing
            </div>
          </div>
          
          <div className="text-center p-6 border border-black">
            <div className="text-3xl font-space-grotesk font-bold text-black mb-2">
              {getBookmarkPercentage(analytics)}%
            </div>
            <div className="font-open-sans text-sm text-black/60">Bookmark Rate</div>
            <div className="font-open-sans text-xs text-black/40 mt-1">
              Events saved for later reference
            </div>
          </div>
        </div>
      </div>

      {/* Feature Adoption */}
      <div className="bg-white border border-black p-8">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">Feature Adoption</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-open-sans text-sm text-black">Electional Astrology (Auto-generation)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${getGeneratedPercentage(analytics)}%` 
                  }}
                ></div>
              </div>
              <span className="font-open-sans text-xs text-black/60 w-12">
                {getGeneratedPercentage(analytics)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-open-sans text-sm text-black">Manual Event Creation</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${getManualPercentage(analytics)}%` 
                  }}
                ></div>
              </div>
              <span className="font-open-sans text-xs text-black/60 w-12">
                {getManualPercentage(analytics)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-open-sans text-sm text-black">Event Bookmarking</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${getBookmarkPercentage(analytics)}%` 
                  }}
                ></div>
              </div>
              <span className="font-open-sans text-xs text-black/60 w-12">
                {getBookmarkPercentage(analytics)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}