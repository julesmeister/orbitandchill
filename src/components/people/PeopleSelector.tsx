/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Person, SharedChart } from '../../types/people';
import { usePeopleAPI } from '../../hooks/usePeopleAPI';
import { useUserStore } from '../../store/userStore';
import { useSharedCharts } from '../../hooks/useSharedCharts';
import { usePersonActions } from '../../hooks/usePersonActions';
import { useDropdownState } from '../../hooks/useDropdownState';
import { useAutoSelection } from '../../hooks/useAutoSelection';
import { getRelationshipDisplay, getRelationshipIconPath } from '../../utils/formatters/relationshipFormatters';
import { DuplicateDetectionService } from '../../services/duplicateDetectionService';
import PersonListItem from './PersonListItem';
import DuplicateManager from './DuplicateManager';
import SharedChartsSection from './SharedChartsSection';
import AddNewPersonButton from './AddNewPersonButton';
import EmptyState from './EmptyState';
import SelectedPersonDisplay from './SelectedPersonDisplay';

interface PeopleSelectorProps {
  onPersonSelect: (person: Person | null) => void;
  onSharedChartSelect?: (chart: SharedChart) => void;
  selectedPersonId?: string | null;
  className?: string;
  showAddNew?: boolean;
  onAddNew?: () => void;
  onDropdownToggle?: (isOpen: boolean) => void;
  people?: Person[];  // Optional external people data
  defaultPerson?: Person | null;  // Optional external default person
}

const PeopleSelector: React.FC<PeopleSelectorProps> = ({
  onPersonSelect,
  onSharedChartSelect,
  selectedPersonId,
  className = '',
  showAddNew = true,
  onAddNew,
  onDropdownToggle,
  people: externalPeople,
  defaultPerson: externalDefaultPerson
}) => {
  const {
    people: apiPeople,
    loadPeople,
    addPerson,
    deletePerson,
    updatePerson,
    setDefaultPerson,
    isLoading,
    error,
    defaultPerson: apiDefaultPerson,
    selectedPersonId: storeSelectedPersonId,
    setSelectedPerson
  } = usePeopleAPI();

  // Use external data if provided, otherwise use API data
  const people = externalPeople || apiPeople;
  const defaultPerson = externalDefaultPerson || apiDefaultPerson;

  const { user } = useUserStore();
  const { sharedCharts, isLoading: isSharedChartsLoading } = useSharedCharts();

  // State declarations must come before hook calls that use them
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Dropdown state management
  const {
    isOpen,
    buttonRef,
    dropdownRef,
    handleToggleDropdown,
    closeDropdown
  } = useDropdownState({
    onDropdownToggle,
    editingPersonId
  });

  // Auto-selection logic
  useAutoSelection({
    people,
    defaultPerson,
    isLoading,
    storeSelectedPersonId,
    setSelectedPerson,
    setDefaultPerson
  });
  // userAddedRef removed - auto-add logic now handled by usePeopleAPI hook
  
  // Component state logging removed for cleaner output


  // People are auto-loaded by usePeopleAPI hook


  // Deduplicate people and find duplicates using service
  const { uniquePeople, duplicateGroups } = useMemo(() => {
    // First, remove any obviously invalid or malformed entries
    const validPeople = people.filter(person => {
      return person && person.id && person.name && person.userId;
    });

    const seen = new Set();
    const unique = validPeople.filter(person => {
      if (seen.has(person.id)) {
        return false;
      }
      seen.add(person.id);
      return true;
    });

    // Find duplicates using service
    const duplicates = new Map();
    unique.forEach(person => {
      if (DuplicateDetectionService.hasCompleteBirthData(person)) {
        const personDuplicates = DuplicateDetectionService.findDuplicates(person, unique);
        if (personDuplicates.length > 0) {
          const allDuplicates = [person, ...personDuplicates];
          const displayName = person.name || 'Unknown';
          if (!duplicates.has(displayName)) {
            duplicates.set(displayName, allDuplicates);
          }
        }
      }
    });

    return { uniquePeople: unique, duplicateGroups: duplicates };
  }, [people]);

  // Use selectedPersonId prop or fall back to store's selectedPersonId or defaultPerson
  const currentSelectedId = selectedPersonId || storeSelectedPersonId || defaultPerson?.id;
  const selectedPerson = uniquePeople.find(p => p.id === currentSelectedId) || defaultPerson;

  const handlePersonSelect = (person: Person | null) => {
    if (person?.id) {
      handlePersonAction(person.id);
    }
    closeDropdown();
  };

  const handleSharedChartSelect = (chart: SharedChart) => {
    // Convert shared chart to a Person-like object for compatibility
    const chartAsPerson: Person = {
      id: `shared_${chart.shareToken}`,
      userId: 'shared',
      name: chart.subjectName,
      relationship: 'other',
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

    onSharedChartSelect?.(chart);
    onPersonSelect(chartAsPerson);
    closeDropdown();
  };


  const {
    isDeleting,
    duplicateWarning,
    handleSelectPerson: handlePersonAction,
    handleSetDefault,
    handleEditPerson: startEditPerson,
    handleDeletePerson,
    checkForDuplicates,
    clearDuplicateWarning
  } = usePersonActions({
    people,
    onSelectionChange: (personId: string | null) => {
      setSelectedPerson(personId);
      const person = personId ? people.find(p => p.id === personId) || null : null;
      onPersonSelect(person);
    },
    onEditPerson: (person: Person) => {
      setEditingPersonId(person.id);
      setEditingName(person.name);
    }
  });

  const handleSaveEdit = async (personId: string) => {
    if (editingName.trim()) {
      try {
        await updatePerson(personId, { name: editingName.trim() });
        toast.success('Person name updated');
        setEditingPersonId(null);
        setEditingName('');
      } catch (error) {
        console.error('Failed to update person name:', error);
        toast.error('Failed to update person name');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPersonId(null);
    setEditingName('');
  };


  if (isLoading && people.length === 0) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-100 rounded-lg ${className}`}>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-600 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-600 animate-bounce"></div>
        </div>
        <span className="ml-2 text-sm text-gray-600">Loading people...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center text-red-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        zIndex: 1,
        isolation: 'isolate',
        transform: 'translateZ(0)'
      }}
    >
      {/* Selected Person Display */}
      <button
        ref={buttonRef}
        onClick={handleToggleDropdown}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <SelectedPersonDisplay
          selectedPerson={selectedPerson}
          onToggleDropdown={handleToggleDropdown}
          isOpen={isOpen}
        />
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable List */}
      <div 
        ref={dropdownRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-[600px] flex flex-col overflow-hidden"
          style={{
            zIndex: 3000,
            transform: 'translateZ(0)',
            isolation: 'isolate',
            position: 'relative'
          }}
        >

          <DuplicateManager
            duplicateGroups={duplicateGroups}
            onCleanupComplete={loadPeople}
          />

          {uniquePeople.length === 0 ? (
            <EmptyState
              showAddNew={showAddNew}
              onAddNew={onAddNew}
              onClose={closeDropdown}
            />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto max-h-80">
                {uniquePeople.map((person) => (
                  <PersonListItem
                    key={person.id}
                    person={person}
                    isSelected={person.id === currentSelectedId}
                    editingPersonId={editingPersonId}
                    editingName={editingName}
                    isDeleting={isDeleting}
                    onPersonSelect={handlePersonSelect}
                    onStartEdit={startEditPerson}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDeletePerson}
                    onEditNameChange={setEditingName}
                  />
                ))}
              </div>

              {onSharedChartSelect && (
                <SharedChartsSection
                  sharedCharts={sharedCharts}
                  onSharedChartSelect={handleSharedChartSelect}
                />
              )}

              {showAddNew && onAddNew && (
                <AddNewPersonButton
                  onAddNew={onAddNew}
                  onClose={closeDropdown}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleSelector;