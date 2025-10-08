/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, Suspense, lazy } from 'react';
import { Person } from '../../types/people';
import StatusToast from '../reusable/StatusToast';
import { useStatusToast } from '../../hooks/useStatusToast';

// Direct API imports - bypassing cache-contaminated unified hooks
import { usePeopleAPI } from '../../hooks/usePeopleAPI';
import { ChartQuickActionsProps } from './types';
import { useChartActions } from './hooks/useChartActions';
import { usePersonFormState } from './hooks/usePersonFormState';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { useNatalChart } from '../../hooks/useNatalChart';

// Component imports
import RegenerateButton from './components/RegenerateButton';
import ChartActionsGrid from './components/ChartActionsGrid';
import PeopleSelectorSection from './components/PeopleSelectorSection';
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
  chartId
}: ChartQuickActionsProps) {
  // Direct API people data management (no cache contamination)
  const {
    people,
    selectedPersonId,
    defaultPerson,
    loadPeople: reloadApiPeople,
    addPerson,
    deletePerson,
    updatePerson,
    setDefaultPerson
  } = usePeopleAPI();

  const { toast, hideStatus } = useStatusToast();
  const { measureRender } = usePerformanceMonitor('ChartQuickActions');
  const { cachedChart } = useNatalChart();
  
  // Chart action logic
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

  // TEMPORARILY DISABLED: Performance monitoring causing excessive re-renders
  // useEffect(() => {
  //   measureRender();
  // });

  // Note: Using direct API data only - bypassing IndexedDB/cache to prevent phantom entries


  const handleAddPersonClick = () => {
    openAddPersonForm();
    onAddPersonClick?.();
  };

  const handlePersonSaved = async (person: Person) => {
    closeAddPersonForm();

    try {
      // Reload people data from API only (no store sync)
      await reloadApiPeople();
      handlePersonSelect(person);
      onPersonChange?.(person);
    } catch (error) {
      console.error('❌ ChartQuickActions: Person save handling failed:', error);
    }
  };

  const handleEditDataClick = () => {
    // Find the person to edit directly from API data
    const personToEdit = selectedPersonId
      ? people.find(p => p.id === selectedPersonId)
      : defaultPerson;

    if (!personToEdit) {
      console.error('No person selected to edit');
      return;
    }

    openEditPersonForm(personToEdit);
  };

  const handlePersonEdited = async (person: Person) => {
    closeEditPersonForm();

    // Reload people data to get fresh data from database
    await reloadApiPeople();

    // Wait a bit for React state to update after reloadApiPeople
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the freshly loaded person from the API (not the stale form data)
    const freshPerson = people.find(p => p.id === person.id) || person;

    // Force chart regeneration with updated person data
    handlePersonSelect(freshPerson);
    onPersonChange?.(freshPerson);

    // Trigger chart regeneration with fresh data
    if (onRegenerateChart) {
      setTimeout(() => onRegenerateChart(), 200); // Small delay to ensure person selection is updated
    }
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
    // Handle shared chart selection directly
    if (chart?.person) {
      handlePersonSelect(chart.person);
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
          <ChartActionsGrid
            onEditData={handleEditDataClick}
            onShareChart={handleShareChart}
            onAstrocartography={handleAstrocartographyClick}
            canShare={canShare}
            hasPersonData={hasPersonData}
          />


          {/* People Selector Section */}
          <PeopleSelectorSection
            people={people}
            defaultPerson={defaultPerson}
            selectedPersonId={selectedPersonId}
            onPersonSelect={handlePersonSelect}
            onSharedChartSelect={handleSharedChartSelect}
            onAddNew={handleAddPersonClick}
            onDropdownToggle={() => onDropdownToggle?.(false)}
          />
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