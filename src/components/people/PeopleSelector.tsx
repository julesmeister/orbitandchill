/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { Person, SharedChart } from '../../types/people';
import { usePeopleStore } from '../../store/peopleStore';
import { useUserStore } from '../../store/userStore';
import { useSharedCharts } from '../../hooks/useSharedCharts';

interface PeopleSelectorProps {
  onPersonSelect: (person: Person | null) => void;
  onSharedChartSelect?: (chart: SharedChart) => void;
  selectedPersonId?: string | null;
  className?: string;
  showAddNew?: boolean;
  onAddNew?: () => void;
  onDropdownToggle?: (isOpen: boolean) => void;
}

const PeopleSelector: React.FC<PeopleSelectorProps> = ({
  onPersonSelect,
  onSharedChartSelect,
  selectedPersonId,
  className = '',
  showAddNew = true,
  onAddNew,
  onDropdownToggle
}) => {
  const { 
    people, 
    loadPeople, 
    addPerson,
    deletePerson,
    updatePerson,
    setDefaultPerson,
    isLoading, 
    error,
    defaultPerson,
    selectedPersonId: storeSelectedPersonId,
    setSelectedPerson 
  } = usePeopleStore();
  
  const { user } = useUserStore();
  const { sharedCharts, isLoading: isSharedChartsLoading } = useSharedCharts();

  const [isOpen, setIsOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userAddedRef = useRef(false);
  
  // Reset userAddedRef when user changes
  useEffect(() => {
    userAddedRef.current = false;
  }, [user?.id]);


  // Load people on component mount
  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  // Auto-select a person if none is selected
  useEffect(() => {
    if (!isLoading && people.length > 0 && !storeSelectedPersonId) {
      // Find default person, then self person, then first person
      let personToSelect = defaultPerson;
      
      if (!personToSelect) {
        personToSelect = people.find(p => p.relationship === 'self') || people[0];
      }
      
      if (personToSelect) {
        console.log('Auto-selecting person:', personToSelect.name);
        setSelectedPerson(personToSelect.id);
        // Only call onPersonSelect if explicitly needed - this prevents disrupting existing charts
        // onPersonSelect(personToSelect);
        
        // If this person isn't marked as default, make them default
        if (!personToSelect.isDefault) {
          console.log('Setting as default:', personToSelect.name);
          setDefaultPerson(personToSelect.id).catch(console.error);
        }
      }
    }
  }, [isLoading, people, storeSelectedPersonId, defaultPerson, setSelectedPerson, onPersonSelect, setDefaultPerson]);

  // Auto-add user to people store if they have birth data and aren't already added
  useEffect(() => {
    // Early return if no user data or still loading
    if (!user?.birthData || !user.username || isLoading) {
      return;
    }

    // Early return if we already processed this user
    const storageKey = `user_added_${user.id}`;
    const alreadyProcessed = localStorage.getItem(storageKey) === 'true' || userAddedRef.current;
    
    if (alreadyProcessed) {
      return;
    }

    // Check if user is already in people store (by checking for a person with relationship 'self' and matching userId)
    const userExists = people.some(person => 
      person.relationship === 'self' && person.userId === user.id
    );

    console.log('Auto-add check:', {
      userExists,
      peopleCount: people.length,
      userId: user.id,
      hasUserData: !!user?.birthData,
      peopleDetails: people.map(p => ({ id: p.id, name: p.name, isDefault: p.isDefault, relationship: p.relationship }))
    });

    if (!userExists) {
      userAddedRef.current = true; // Prevent multiple additions
      localStorage.setItem(storageKey, 'true'); // Mark as attempted
      console.log('Adding user to people store');
      
      // Add user to people store
      const userPersonData = {
        name: user.username || 'Me',
        relationship: 'self' as const,
        birthData: user.birthData,
        isDefault: true, // Make user the default person
        notes: 'Your personal birth data'
      };

      addPerson(userPersonData).then(() => {
        console.log('Successfully added user to people store');
      }).catch(error => {
        console.error('Failed to add user to people store:', error);
        userAddedRef.current = false; // Reset on error to allow retry
        localStorage.removeItem(storageKey); // Remove the flag to allow retry
      });
    } else {
      console.log('User already exists in people store');
      userAddedRef.current = true; // Mark as added to prevent future attempts
      localStorage.setItem(storageKey, 'true'); // Mark as added
    }
  }, [user?.id, user?.birthData, user?.username, isLoading, addPerson]); // Removed 'people' from dependencies

  // Close dropdown when clicking outside (completely disabled when editing)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close dropdown if someone is editing
      if (editingPersonId) return;
      
      if (isOpen && buttonRef.current && dropdownRef.current) {
        const target = event.target as Node;
        if (!buttonRef.current.contains(target) && !dropdownRef.current.contains(target)) {
          setIsOpen(false);
          onDropdownToggle?.(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, editingPersonId, onDropdownToggle]);

  // Deduplicate people to prevent React key errors and find duplicates
  const { uniquePeople, duplicateGroups } = useMemo(() => {
    const seen = new Set();
    const unique = people.filter(person => {
      if (seen.has(person.id)) {
        return false;
      }
      seen.add(person.id);
      return true;
    });

    // Find duplicate names
    const nameCount = new Map();
    unique.forEach(person => {
      const name = person.name.toLowerCase().trim();
      if (!nameCount.has(name)) {
        nameCount.set(name, []);
      }
      nameCount.get(name).push(person);
    });

    const duplicates = new Map();
    nameCount.forEach((persons, name) => {
      if (persons.length > 1) {
        duplicates.set(name, persons);
      }
    });

    return { uniquePeople: unique, duplicateGroups: duplicates };
  }, [people]);

  // Use selectedPersonId prop or fall back to store's selectedPersonId or defaultPerson
  const currentSelectedId = selectedPersonId || storeSelectedPersonId || defaultPerson?.id;
  const selectedPerson = uniquePeople.find(p => p.id === currentSelectedId) || defaultPerson;

  const handlePersonSelect = (person: Person | null) => {
    setSelectedPerson(person?.id || null);
    onPersonSelect(person);
    setIsOpen(false);
    onDropdownToggle?.(false);
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
    setIsOpen(false);
    onDropdownToggle?.(false);
  };

  const handleToggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onDropdownToggle?.(newIsOpen);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPersonId(person.id);
    setEditingName(person.name);
  };

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

  const getRelationshipDisplay = (relationship: Person['relationship']) => {
    const relationshipMap = {
      self: 'Self',
      friend: 'Friend',
      family: 'Family',
      partner: 'Partner',
      colleague: 'Colleague',
      other: 'Other'
    };
    return relationshipMap[relationship];
  };

  const getRelationshipIcon = (relationship: Person['relationship']) => {
    switch (relationship) {
      case 'self':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'friend':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'family':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        );
      case 'partner':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'colleague':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 013-2V6" />
          </svg>
        );
      case 'other':
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (isLoading && people.length === 0) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-100 rounded-lg ${className}`}>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
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
        <div className="flex items-center space-x-3">
          {selectedPerson ? (
            <>
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600">
                {getRelationshipIcon(selectedPerson.relationship)}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{selectedPerson.name}</div>
                <div className="text-sm text-gray-500">
                  {getRelationshipDisplay(selectedPerson.relationship)}
                  {selectedPerson.isDefault && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-500">Select a person</div>
                <div className="text-sm text-gray-400">Choose who to generate chart for</div>
              </div>
            </>
          )}
        </div>
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
          {/* Duplicate Management Section */}
          {duplicateGroups.size > 0 && (
            <div className="border-b border-gray-200 bg-yellow-50 p-3">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">Duplicates Found</span>
              </div>
              {Array.from(duplicateGroups.entries()).map(([name, persons]) => (
                <div key={name} className="mb-2 last:mb-0">
                  <div className="text-xs text-yellow-700 mb-1">
                    {persons.length} entries for "{persons[0].name}"
                  </div>
                  <button
                    onClick={async () => {
                      // Keep the default person, or the first one if none is default
                      const defaultPerson = persons.find((p: { isDefault: any; }) => p.isDefault);
                      const keep = defaultPerson || persons[0];
                      const toDelete = persons.filter((p: { id: any; }) => p.id !== keep.id);
                      
                      console.log('Cleanup - All persons:', persons.map((p: { id: any; name: any; isDefault: any; }) => ({ id: p.id, name: p.name, isDefault: p.isDefault })));
                      console.log('Cleanup - Keep:', { id: keep.id, name: keep.name, isDefault: keep.isDefault });
                      console.log('Cleanup - To delete:', toDelete.map((p: { id: any; name: any; }) => ({ id: p.id, name: p.name })));
                      
                      try {
                        // Delete them one by one with proper error handling
                        for (const person of toDelete) {
                          console.log('Deleting:', person.name, person.id);
                          await deletePerson(person.id);
                          console.log('Successfully deleted:', person.name);
                        }
                        toast.success(`Cleaned up ${toDelete.length} duplicate${toDelete.length > 1 ? 's' : ''} for ${keep.name}${defaultPerson ? ' (kept default)' : ''}`);
                      } catch (error) {
                        console.error('Failed to clean duplicates:', error);
                        toast.error('Failed to clean up duplicates');
                      }
                    }}
                    className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded transition-colors"
                  >
                    Clean up duplicates
                  </button>
                </div>
              ))}
            </div>
          )}

          {uniquePeople.length === 0 ? (
            <div className="p-4 text-center">
              <div className="text-gray-500 text-sm mb-2">No people added yet</div>
              {showAddNew && onAddNew && (
                <button
                  onClick={() => {
                    console.log('Add first person clicked');
                    console.log('onAddNew function:', onAddNew);
                    onAddNew();
                    setIsOpen(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                >
                  Add your first person
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Scrollable People List */}
              <div className="flex-1 overflow-y-auto max-h-80">
                {uniquePeople.map((person) => (
                  <div
                    key={person.id}
                    className={`flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                      person.id === currentSelectedId ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div
                      onClick={() => {
                        // Don't select person if we're in edit mode
                        if (editingPersonId !== person.id) {
                          handlePersonSelect(person);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (editingPersonId !== person.id) {
                            handlePersonSelect(person);
                          }
                        }
                      }}
                      className={`flex-1 flex items-center space-x-3 text-left min-w-0 ${
                        editingPersonId === person.id ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        person.id === currentSelectedId 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
                      }`}>
                        {getRelationshipIcon(person.relationship)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingPersonId === person.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              onFocus={(e) => {
                                e.stopPropagation();
                              }}
                              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') handleSaveEdit(person.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleSaveEdit(person.id);
                              }}
                              className="text-green-600 hover:text-green-700 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleCancelEdit();
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-gray-900 truncate">{person.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              {getRelationshipDisplay(person.relationship)}
                              {person.isDefault ? (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              ) : (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    try {
                                      await setDefaultPerson(person.id);
                                      toast.success(`Set ${person.name} as default`);
                                    } catch (error) {
                                      console.error('Failed to set default person:', error);
                                      toast.error(`Failed to set ${person.name} as default`);
                                    }
                                  }}
                                  className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  Set as Default
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {person.id === currentSelectedId && editingPersonId !== person.id && (
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Only show action buttons when not in edit mode */}
                    {editingPersonId !== person.id && (
                      <div className="flex items-center space-x-1">
                        {/* Edit button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditPerson(person);
                          }}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title={`Edit ${person.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Delete button */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Delete clicked for:', person.name, person.id);
                            console.log('deletePerson function:', deletePerson);
                            try {
                              const result = await deletePerson(person.id);
                              console.log('Delete result:', result);
                              toast.success(`Deleted ${person.name}`);
                            } catch (error) {
                              console.error('Failed to delete person:', error);
                              toast.error(`Failed to delete ${person.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                            }
                          }}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title={`Delete ${person.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Shared Charts Section */}
              {onSharedChartSelect && sharedCharts.length > 0 && (
                <div className="border-t border-gray-200">
                  <div className="bg-purple-50 px-3 py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-sm font-medium text-purple-800">Shared Charts</span>
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {sharedCharts.slice(0, 5).map((chart) => (
                      <div
                        key={chart.shareToken}
                        onClick={() => handleSharedChartSelect(chart)}
                        className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{chart.subjectName}</div>
                          <div className="text-sm text-gray-500 truncate">
                            Shared {new Date(chart.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fixed Add New Person Button */}
              {showAddNew && onAddNew && (
                <div className="border-t border-gray-200 rounded-b-lg overflow-hidden">
                  <button
                    onClick={() => {
                      console.log('Add new person clicked');
                      console.log('onAddNew function:', onAddNew);
                      onAddNew();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="font-medium">Add New Person</div>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleSelector;