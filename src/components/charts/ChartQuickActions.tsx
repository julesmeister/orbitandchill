/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, Suspense, lazy } from 'react';
import { Person } from '../../types/people';
import { usePeopleAPI } from '../../hooks/usePeopleAPI';
import StatusToast from '../reusable/StatusToast';
import { useStatusToast } from '../../hooks/useStatusToast';

import { ChartQuickActionsProps } from './types';
import { useChartActions } from './hooks/useChartActions';
import { usePersonFormState } from './hooks/usePersonFormState';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { useNatalChart } from '../../hooks/useNatalChart';
import RegenerateButton from './components/RegenerateButton';
import ChartActionButton from './components/ChartActionButton';
import ChartErrorBoundary from './components/ChartErrorBoundary';
import ChartSkeleton from './components/ChartSkeleton';

// Dynamically imported components for better bundle splitting
const PersonFormModal = lazy(() => import('./components/PersonFormModal'));
// Temporary fix: Use direct import instead of lazy loading to avoid chunk loading issues
import PeopleSelector from '../people/PeopleSelector';

export default function ChartQuickActions({
  onRegenerateChart,
  isGenerating,
  onPersonChange,
  onAddPersonClick,
  onDropdownToggle,
  onClearCache,
  chartId
}: ChartQuickActionsProps) {
  const { people, selectedPersonId, defaultPerson } = usePeopleAPI();
  const { toast, hideStatus } = useStatusToast();
  const { measureRender } = usePerformanceMonitor('ChartQuickActions');
  const { cachedChart } = useNatalChart();
  
  // Custom hooks for logic separation
  const {
    currentPerson,
    hasPersonData,
    canShare,
    handlePersonSelect,
    handleShareChart,
    handleAstrocartographyClick,
  } = useChartActions({ chartId, onPersonChange });

  const {
    showAddPersonForm,
    showEditPersonForm,
    editingPersonData,
    openAddPersonForm,
    closeAddPersonForm,
    openEditPersonForm,
    closeEditPersonForm,
    setEditingPersonData,
  } = usePersonFormState();

  // Performance monitoring
  useEffect(() => {
    measureRender();
  });


  const handleAddPersonClick = () => {
    openAddPersonForm();
    onAddPersonClick?.();
  };

  const handlePersonSaved = (person: Person) => {
    closeAddPersonForm();
    handlePersonSelect(person);
  };

  const handleEditDataClick = () => {
    let personToEdit = null;
    if (selectedPersonId) {
      personToEdit = people.find(p => p.id === selectedPersonId);
    }

    if (!personToEdit) {
      personToEdit = people.find(p => p.isDefault);
    }

    if (!personToEdit && people.length > 0) {
      personToEdit = people[0];
    }

    if (!personToEdit) {
      alert('Please add a person first before editing');
      return;
    }

    // CRITICAL FIX: Use current chart's birth data if available, as it's the most up-to-date
    // This solves the issue where form shows stale data (1993) while chart shows current data (1994)
    const currentChartData = cachedChart?.metadata?.birthData;
    if (currentChartData) {
      const updatedPersonToEdit = {
        ...personToEdit,
        birthData: currentChartData
      };
      openEditPersonForm(updatedPersonToEdit);
    } else {
      openEditPersonForm(personToEdit);
    }
  };

  const handlePersonEdited = (person: Person) => {
    closeEditPersonForm();
    handlePersonSelect(person);
  };

  // Update editing person data when selected person changes while form is open
  useEffect(() => {
    if (showEditPersonForm) {
      const currentSelectedPerson = currentPerson;
      if (currentSelectedPerson && currentSelectedPerson.id !== editingPersonData?.id) {
        setEditingPersonData(currentSelectedPerson);
      }
    }
  }, [currentPerson, showEditPersonForm, editingPersonData?.id, setEditingPersonData]);

  const handleSharedChartSelect = (chart: any) => {
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
    
    handlePersonSelect(chartAsPerson);
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
            <p className="font-open-sans text-sm text-black/60">Manage your chart and explore</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <ChartErrorBoundary>
        {showEditPersonForm ? (
          <Suspense fallback={<ChartSkeleton showPeopleSelector={false} showActionButtons={false} />}>
            <PersonFormModal
              isVisible={showEditPersonForm}
              type="edit"
              editingPerson={editingPersonData}
              onPersonSaved={handlePersonEdited}
              onCancel={closeEditPersonForm}
            />
          </Suspense>
        ) : showAddPersonForm ? (
          <Suspense fallback={<ChartSkeleton showPeopleSelector={false} showActionButtons={false} />}>
            <PersonFormModal
              isVisible={showAddPersonForm}
              type="add"
              onPersonSaved={handlePersonSaved}
              onCancel={closeAddPersonForm}
              onDropdownToggle={onDropdownToggle}
              onPersonSelect={handlePersonSelect}
              onSharedChartSelect={handleSharedChartSelect}
            />
          </Suspense>
        ) : (
        <div className="border-b border-black bg-white">
          {/* Primary Action - Regenerate Chart */}
          <RegenerateButton onClick={onRegenerateChart} isGenerating={isGenerating} />

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-3 gap-0 border-b border-black">
            {/* Edit Data Button */}
            <ChartActionButton
              onClick={handleEditDataClick}
              icon={
                <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              title="Edit Data"
              subtitle="Update info"
              className="border-r border-black"
              gradientDirection="right"
            />

            {/* Share Chart Button */}
            <ChartActionButton
              onClick={handleShareChart}
              disabled={!canShare}
              icon={
                <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              }
              title="Share Chart"
              subtitle="Copy link"
              className="border-r border-black"
              gradientDirection="right"
            />

            {/* Astrocartography Button */}
            <ChartActionButton
              onClick={handleAstrocartographyClick}
              disabled={!hasPersonData}
              icon={
                <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Astrocartography"
              subtitle="Explore locations"
              gradientDirection="left"
            />
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
                <span className="font-open-sans text-xs text-black/60 group-hover:text-white/80 transition-colors duration-300">(Force refresh)</span>
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
            <Suspense fallback={
              <div className="border border-gray-200 rounded-lg p-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            }>
              <PeopleSelector
                onPersonSelect={handlePersonSelect}
                onSharedChartSelect={handleSharedChartSelect}
                onAddNew={handleAddPersonClick}
                onDropdownToggle={onDropdownToggle}
                className="w-full"
              />
            </Suspense>
          </div>
        </div>
        )}
      </ChartErrorBoundary>

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