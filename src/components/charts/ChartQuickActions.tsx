import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Person } from '../../types/people';
import PeopleSelector from '../people/PeopleSelector';
import CompactNatalChartForm from '../forms/CompactNatalChartForm';
import { usePeopleStore } from '../../store/peopleStore';
import StatusToast from '../reusable/StatusToast';
import { useStatusToast } from '../../hooks/useStatusToast';
import { useUserStore } from '../../store/userStore';

interface ChartQuickActionsProps {
  onRegenerateChart: () => void;
  isGenerating: boolean;
  onPersonChange?: (person: Person | null) => void;
  onAddPersonClick?: () => void;
  onDropdownToggle?: (isOpen: boolean) => void;
  onClearCache?: () => void;
  chartId?: string; // Add chart ID for internal sharing
}

export default function ChartQuickActions({
  onRegenerateChart,
  isGenerating,
  onPersonChange,
  onAddPersonClick,
  onDropdownToggle,
  onClearCache,
  chartId
}: ChartQuickActionsProps) {
  const router = useRouter();
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [showEditPersonForm, setShowEditPersonForm] = useState(false);
  const [editingPersonData, setEditingPersonData] = useState<Person | null>(null);
  const { selectedPerson, defaultPerson, loadPeople, people, selectedPersonId, setSelectedPerson } = usePeopleStore();
  const { user } = useUserStore();
  const { toast, showLoading, showSuccess, showError, hideStatus } = useStatusToast();

  // Load people when component mounts (only once)
  React.useEffect(() => {
    loadPeople();
  }, []); // Empty dependency array to run only once

  const handleAddPersonClick = () => {
    setShowAddPersonForm(true);
    onAddPersonClick?.();
  };

  const handlePersonSaved = (person: Person) => {
    setShowAddPersonForm(false);
    // Update global store selection
    setSelectedPerson(person.id);
    onPersonChange?.(person);
  };

  const handleCancelAddPerson = () => {
    setShowAddPersonForm(false);
  };

  const handleEditDataClick = () => {
    // Manually find the selected person
    let personToEdit = null;
    if (selectedPersonId) {
      personToEdit = people.find(p => p.id === selectedPersonId);
    }

    // Fall back to default person if no selected person
    if (!personToEdit) {
      personToEdit = people.find(p => p.isDefault);
    }

    // Fall back to first person if no default
    if (!personToEdit && people.length > 0) {
      personToEdit = people[0];
    }

    if (!personToEdit) {
      console.warn('No person available to edit');
      alert('Please add a person first before editing');
      return;
    }

    setEditingPersonData(personToEdit);
    setShowEditPersonForm(true);
  };

  const handlePersonEdited = (person: Person) => {
    setShowEditPersonForm(false);
    setEditingPersonData(null);
    // Update global store selection
    setSelectedPerson(person.id);
    onPersonChange?.(person);
  };

  const handleCancelEditPerson = () => {
    setShowEditPersonForm(false);
    setEditingPersonData(null);
  };

  // Update editing person data when selected person changes while form is open
  React.useEffect(() => {
    if (showEditPersonForm) {
      const currentPerson = selectedPerson || defaultPerson;
      if (currentPerson && currentPerson.id !== editingPersonData?.id) {
        setEditingPersonData(currentPerson);
      }
    }
  }, [selectedPerson, defaultPerson, showEditPersonForm, editingPersonData?.id]);

  // Handle person selection from PeopleSelector
  const handlePersonSelectWrapper = (person: Person | null) => {
    if (person) {
      // Update global store selection
      setSelectedPerson(person.id);
    }
    // Also call the parent's handler
    onPersonChange?.(person);
  };

  // Handle share chart button click
  const handleShareChart = async () => {
    if (!chartId || !user?.id) {
      showError('Share Failed', 'Chart ID or user not available');
      return;
    }

    try {
      showLoading('Generating Share Link', 'Creating shareable link for your chart...');

      // Generate share token
      const response = await fetch(`/api/charts/${chartId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate share link: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.shareUrl) {
        // Copy to clipboard
        await navigator.clipboard.writeText(data.shareUrl);
        showSuccess('Link Copied!', 'Share link has been copied to your clipboard');
      } else {
        throw new Error('No share URL returned from server');
      }
    } catch (error) {
      console.error('Share chart error:', error);
      showError('Share Failed', 'Unable to create share link. Please try again.');
    }
  };

  return (
    <div className="bg-white overflow-visible">
      {/* Header */}
      <div className="p-6 border-b border-black">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">Quick Actions</h3>
            <p className="font-inter text-sm text-black/60">Manage your chart and explore</p>
          </div>
        </div>
      </div>

      {/* Content Area - Show form or actions based on state */}
      {showEditPersonForm ? (
        <div className="border-r border-b border-black bg-white">
          {/* Edit Person Form Header - Clean partition header */}
          <div className="flex items-center justify-between p-6 border-b border-black" style={{ backgroundColor: '#f0e3ff' }}>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h4 className="font-space-grotesk text-xl font-bold text-black">Edit Person Data</h4>
                <p className="font-inter text-sm text-black/70 mt-1">Update details</p>
              </div>
            </div>
            <button
              onClick={handleCancelEditPerson}
              className="group p-3 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content - Full width, clean design */}
          <CompactNatalChartForm
            editingPerson={editingPersonData}
            onPersonSaved={handlePersonEdited}
            onCancel={handleCancelEditPerson}
          />
        </div>
      ) : showAddPersonForm ? (
        <div className=" border-r border-b border-black bg-white">
          {/* People Selector - Top partition with Synapsas styling */}
          <div className="p-6 border-b border-black overflow-visible" style={{ backgroundColor: '#6bdbff' }}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-space-grotesk text-xl font-bold text-black">Generate Chart For</h4>
                <p className="font-inter text-sm text-black/70 mt-1">Select or add a new person</p>
              </div>
            </div>
            <PeopleSelector
              onPersonSelect={handlePersonSelectWrapper}
              onSharedChartSelect={(chart) => {
                // Generate a chart from shared chart data
                const chartAsPerson = {
                  id: `shared_${chart.shareToken}`,
                  userId: 'shared',
                  name: chart.subjectName,
                  relationship: 'other' as const,
                  birthData: {
                    dateOfBirth: chart.dateOfBirth,
                    timeOfBirth: chart.timeOfBirth,
                    locationOfBirth: chart.locationOfBirth,
                    coordinates: {
                      lat: chart.latitude.toString(),
                      lon: chart.longitude.toString(),
                    },
                  },
                  createdAt: new Date(chart.createdAt),
                  updatedAt: new Date(chart.createdAt),
                  notes: `Shared chart from ${new Date(chart.createdAt).toLocaleDateString()}`,
                };
                handlePersonSelectWrapper(chartAsPerson);
              }}
              onAddNew={handleAddPersonClick}
              onDropdownToggle={onDropdownToggle}
              className="w-full"
            />
          </div>

          {/* Add Person Form Header */}
          <div className="flex items-center justify-between p-6 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-space-grotesk text-xl font-bold text-black">Add New Person</h4>
                <p className="font-inter text-sm text-black/70 mt-1">Enter birth details and information</p>
              </div>
            </div>
            <button
              onClick={handleCancelAddPerson}
              className="group p-3 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <CompactNatalChartForm
            onPersonSaved={handlePersonSaved}
            onCancel={handleCancelAddPerson}
          />
        </div>
      ) : (
        <div className="border-b border-black bg-white">
          {/* Primary Action - Regenerate Chart */}
          <button
            onClick={onRegenerateChart}
            disabled={isGenerating}
            className="group relative overflow-hidden w-full text-left transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed border-b border-black"
            style={{ backgroundColor: isGenerating ? '#6bdbff' : '#51bd94' }}
          >
            <div className="relative z-10 flex items-center justify-between p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                  {isGenerating ? (
                    <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-space-grotesk text-lg font-bold text-black">
                    {isGenerating ? 'Regenerating Chart...' : 'Regenerate Chart'}
                  </div>
                  <div className="font-inter text-sm text-black/80">
                    {isGenerating ? 'Please wait, creating your chart' : 'Generate a fresh version with latest data'}
                  </div>
                </div>
              </div>
              {!isGenerating && (
                <svg className="w-6 h-6 text-black group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-3 gap-0 border-b border-black">
            {/* Edit Data Button */}
            <button
              onClick={handleEditDataClick}
              className="group relative p-4 transition-all duration-300 border-r border-black hover:bg-black overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <div className="relative flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-black group-hover:bg-white transition-colors duration-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <div className="font-space-grotesk font-semibold text-black group-hover:text-white text-sm transition-colors duration-300">Edit Data</div>
                  <div className="font-inter text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">Update info</div>
                </div>
              </div>
            </button>

            {/* Share Chart Button */}
            <button
              onClick={handleShareChart}
              disabled={!chartId || !user?.id}
              className="group relative p-4 transition-all duration-300 border-r border-black hover:bg-black overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <div className="relative flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-black group-hover:bg-white transition-colors duration-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div>
                  <div className="font-space-grotesk font-semibold text-black group-hover:text-white text-sm transition-colors duration-300">Share Chart</div>
                  <div className="font-inter text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">Copy link</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/astrocartography')}
              className="group relative p-4 transition-all duration-300 hover:bg-black overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>

              <div className="relative flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-black group-hover:bg-white transition-colors duration-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-space-grotesk font-semibold text-black group-hover:text-white text-sm transition-colors duration-300">Astrocartography</div>
                  <div className="font-inter text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">Explore locations</div>
                </div>
              </div>
            </button>
          </div>

          {/* Clear Cache (if present) */}
          {onClearCache && (
            <button
              onClick={onClearCache}
              className="group relative w-full p-4 transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-red-500 border-b border-black"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-black group-hover:text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-space-grotesk text-sm font-medium text-black group-hover:text-white transition-colors duration-300">Clear All Caches</span>
                <span className="font-inter text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">(Force refresh)</span>
              </div>
            </button>
          )}

          {/* People Selector */}
          <div className="p-4 overflow-visible">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 className="font-space-grotesk text-sm font-semibold text-black">Generate Chart For</h4>
            </div>
            <PeopleSelector
              onPersonSelect={handlePersonSelectWrapper}
              onSharedChartSelect={(chart) => {
                // Generate a chart from shared chart data
                const chartAsPerson = {
                  id: `shared_${chart.shareToken}`,
                  userId: 'shared',
                  name: chart.subjectName,
                  relationship: 'other' as const,
                  birthData: {
                    dateOfBirth: chart.dateOfBirth,
                    timeOfBirth: chart.timeOfBirth,
                    locationOfBirth: chart.locationOfBirth,
                    coordinates: {
                      lat: chart.latitude.toString(),
                      lon: chart.longitude.toString(),
                    },
                  },
                  createdAt: new Date(chart.createdAt),
                  updatedAt: new Date(chart.createdAt),
                  notes: `Shared chart from ${new Date(chart.createdAt).toLocaleDateString()}`,
                };
                handlePersonSelectWrapper(chartAsPerson);
              }}
              onAddNew={handleAddPersonClick}
              onDropdownToggle={onDropdownToggle}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Status Toast */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={hideStatus}
        duration={toast.duration}
        showProgress={toast.showProgress}
        progress={toast.progress}
      />
    </div>
  );
}