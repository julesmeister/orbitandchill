/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Person, PersonFormData } from '../../types/people';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { usePeopleStore } from '../../store/peopleStore';
import SynapsasDropdown from '../reusable/SynapsasDropdown';

interface CompactNatalChartFormProps {
  editingPerson?: Person | null;
  onPersonSaved?: (person: Person) => void;
  onCancel?: () => void;
}

const CompactNatalChartForm = ({ 
  editingPerson = null,
  onPersonSaved,
  onCancel
}: CompactNatalChartFormProps) => {
  const { addPerson, updatePerson } = usePeopleStore();

  // Define relationshipOptions at the very top
  const relationshipOptions = [
    { value: 'self', label: 'Self' },
    { value: 'friend', label: 'Friend' },
    { value: 'family', label: 'Family' },
    { value: 'partner', label: 'Partner' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    locationOfBirth: '',
    coordinates: { lat: '', lon: '' },
  });

  const [relationship, setRelationship] = useState<Person['relationship']>('friend');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timeInput, setTimeInput] = useState({ hours: '', minutes: '', period: 'AM' });
  const [dateInput, setDateInput] = useState({ month: '', day: '', year: '' });
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showMinutesPicker, setShowMinutesPicker] = useState(false);
  const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const minutesDropdownRef = useRef<HTMLDivElement>(null);
  const relationshipDropdownRef = useRef<HTMLDivElement>(null);
  const relationshipButtonRef = useRef<HTMLButtonElement>(null);

  // Helper functions for time conversion
  const convertTo24Hour = useCallback((hours: string, minutes: string, period: string) => {
    if (!hours || !minutes) return '';
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }, []);

  const convertTo12Hour = useCallback((time24: string) => {
    if (!time24) return { hours: '', minutes: '', period: 'AM' };
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hours: hour12.toString(),
      minutes: parseInt(minutes).toString(),
      period: period
    };
  }, []);

  // Helper functions for date conversion
  const convertToDateString = useCallback((month: string, day: string, year: string) => {
    if (!month || !day || !year) return '';
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }, []);

  const convertFromDateString = useCallback((dateString: string) => {
    if (!dateString) return { month: '', day: '', year: '' };
    const [year, month, day] = dateString.split('-');
    return {
      month: parseInt(month).toString(), // Remove leading zero for display
      day: parseInt(day).toString(),     // Remove leading zero for display
      year: year
    };
  }, []);

  const {
    locationQuery,
    setLocationQuery,
    locationOptions,
    showLocationDropdown,
    setShowLocationDropdown,
    isLoadingLocations,
    locationInputRef,
    dropdownRef,
    handleLocationSelect: onLocationSelect,
  } = useLocationSearch((location) => {
    setFormData(prev => ({
      ...prev,
      locationOfBirth: location.display_name,
      coordinates: {
        lat: location.lat,
        lon: location.lon
      }
    }));
    setIsLocationFocused(false);
  });

  // Load data when editing a person
  useEffect(() => {
    console.log('CompactNatalChartForm - editingPerson changed:', editingPerson);
    
    if (editingPerson) {
      console.log('Setting form data for person:', editingPerson.name);
      console.log('Birth data:', editingPerson.birthData);
      
      // Update all form fields
      setFormData({
        name: editingPerson.name || '',
        dateOfBirth: editingPerson.birthData?.dateOfBirth || '',
        timeOfBirth: editingPerson.birthData?.timeOfBirth || '',
        locationOfBirth: editingPerson.birthData?.locationOfBirth || '',
        coordinates: editingPerson.birthData?.coordinates || { lat: '', lon: '' },
      });
      
      setRelationship(editingPerson.relationship || 'friend');
      setNotes(editingPerson.notes || '');
      setIsDefault(editingPerson.isDefault || false);
      
      // Update location query
      if (editingPerson.birthData?.locationOfBirth) {
        setLocationQuery(editingPerson.birthData.locationOfBirth);
      }
      
      // Update time input
      if (editingPerson.birthData?.timeOfBirth) {
        const time12 = convertTo12Hour(editingPerson.birthData.timeOfBirth);
        console.log('Converted time:', time12);
        setTimeInput(time12);
      } else {
        setTimeInput({ hours: '', minutes: '', period: 'AM' });
      }
      
      // Update date input
      if (editingPerson.birthData?.dateOfBirth) {
        const dateObj = convertFromDateString(editingPerson.birthData.dateOfBirth);
        setDateInput(dateObj);
      } else {
        setDateInput({ month: '', day: '', year: '' });
      }
    } else {
      console.log('No editingPerson, resetting form');
      // Reset form for new person
      setFormData({
        name: '',
        dateOfBirth: '',
        timeOfBirth: '',
        locationOfBirth: '',
        coordinates: { lat: '', lon: '' },
      });
      setRelationship('friend');
      setNotes('');
      setIsDefault(false);
      setLocationQuery('');
      setTimeInput({ hours: '', minutes: '', period: 'AM' });
      setDateInput({ month: '', day: '', year: '' });
    }
  }, [editingPerson?.id, convertTo12Hour, convertFromDateString, setLocationQuery]); // Include all dependencies

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLocationInputChange = useCallback((value: string) => {
    setLocationQuery(value);
    setFormData(prev => ({ ...prev, locationOfBirth: value }));
  }, [setLocationQuery]);

  const handleTimeInputChange = useCallback((field: 'hours' | 'minutes' | 'period', value: string) => {
    const newTimeInput = { ...timeInput, [field]: value };
    setTimeInput(newTimeInput);
    
    const time24 = convertTo24Hour(newTimeInput.hours, newTimeInput.minutes, newTimeInput.period);
    if (time24) {
      setFormData(prev => ({ ...prev, timeOfBirth: time24 }));
    }
  }, [timeInput, convertTo24Hour]);

  const handleDateInputChange = useCallback((field: 'month' | 'day' | 'year', value: string) => {
    const newDateInput = { ...dateInput, [field]: value };
    setDateInput(newDateInput);
    
    const dateString = convertToDateString(newDateInput.month, newDateInput.day, newDateInput.year);
    if (dateString) {
      setFormData(prev => ({ ...prev, dateOfBirth: dateString }));
    }
  }, [dateInput, convertToDateString]);

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const handleMonthSelect = useCallback((value: string) => {
    handleDateInputChange('month', value);
    setShowMonthDropdown(false);
  }, [handleDateInputChange]);

  const getMonthLabel = useCallback((value: string) => {
    if (!value) return 'Month';
    const month = months.find(m => m.value === value);
    return month ? month.label : 'Month';
  }, [months]);

  // Generate minutes options (00, 01, 02, ..., 59)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  const handleMinuteSelect = useCallback((minute: string) => {
    handleTimeInputChange('minutes', minute);
    setShowMinutesPicker(false);
    minutesInputRef.current?.blur();
  }, [handleTimeInputChange]);

  const handleRelationshipSelect = useCallback((value: Person['relationship']) => {
    setRelationship(value);
    setShowRelationshipDropdown(false);
  }, []);

  const handleRelationshipDropdownToggle = useCallback(() => {
    if (!showRelationshipDropdown && relationshipButtonRef.current) {
      const rect = relationshipButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
    setShowRelationshipDropdown(!showRelationshipDropdown);
  }, [showRelationshipDropdown]);

  const getRelationshipLabel = useCallback((value: Person['relationship']) => {
    const option = relationshipOptions.find(opt => opt.value === value);
    return option ? option.label : 'Select relationship';
  }, [relationshipOptions]);

  // Close month dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
    };

    if (showMonthDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMonthDropdown]);

  // Close minutes picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        minutesDropdownRef.current &&
        !minutesDropdownRef.current.contains(event.target as Node) &&
        minutesInputRef.current &&
        !minutesInputRef.current.contains(event.target as Node)
      ) {
        setShowMinutesPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown position on scroll and handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (relationshipDropdownRef.current && !relationshipDropdownRef.current.contains(event.target as Node) &&
          relationshipButtonRef.current && !relationshipButtonRef.current.contains(event.target as Node)) {
        setShowRelationshipDropdown(false);
      }
    };

    const handleScroll = () => {
      if (relationshipButtonRef.current) {
        const rect = relationshipButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    const handleResize = () => {
      if (relationshipButtonRef.current) {
        const rect = relationshipButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    if (showRelationshipDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showRelationshipDropdown]);

  // Handle window focus to reset location dropdown state
  useEffect(() => {
    const handleWindowFocus = () => {
      // Reset location focus state when window regains focus
      if (isLocationFocused && !locationInputRef.current?.matches(':focus')) {
        setIsLocationFocused(false);
      }
    };

    const handleWindowBlur = () => {
      // Close location dropdown when window loses focus
      setIsLocationFocused(false);
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isLocationFocused]);

  const isFormValid = useMemo(() => {
    return !!(formData.name.trim() && formData.dateOfBirth && formData.timeOfBirth && 
             formData.locationOfBirth && formData.coordinates.lat && formData.coordinates.lon);
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coordinates.lat || !formData.coordinates.lon) {
      alert('Please select a location from the dropdown');
      return;
    }
    
    if (!isFormValid) return;

    setIsSaving(true);
    
    try {
      const { name, ...birthData } = formData;
      const personFormData: PersonFormData = {
        name,
        relationship,
        birthData,
        notes: notes || undefined,
        isDefault
      };

      let savedPerson: Person;
      if (editingPerson) {
        await updatePerson(editingPerson.id, personFormData);
        savedPerson = { ...editingPerson, ...personFormData, updatedAt: new Date() };
      } else {
        savedPerson = await addPerson(personFormData);
      }

      if (onPersonSaved) {
        onPersonSaved(savedPerson);
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, isFormValid, relationship, notes, isDefault, editingPerson, addPerson, updatePerson, onPersonSaved]);

  const relationshipIcons: Record<Person['relationship'], string> = {
    self: '👤',
    friend: '👥',
    family: '👪',
    partner: '💕',
    colleague: '🤝',
    other: '👻'
  };

  return (
    <div className="w-full bg-white" style={{ overflow: 'visible' }}>
      <form onSubmit={handleSubmit} className="space-y-0" style={{ overflow: 'visible' }}>
        {/* Name & Relationship Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-black"
          style={{ 
            zIndex: 15000,
            isolation: 'isolate',
            transform: 'translateZ(0)',
            overflow: 'visible'
          }}
        >
          <div className="p-4 md:border-r border-black">
            <label className="synapsas-label mb-2 block">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Person's name"
              className="synapsas-input"
              required
            />
          </div>
          <div className="p-4"
            style={{ 
              zIndex: 1000000,
              isolation: 'isolate',
              transform: 'translateZ(0)',
              overflow: 'visible'
            }}
          >
            <label className="synapsas-label mb-2 block">
              Relationship <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{relationshipIcons[relationship]}</span>
              <div className="flex-1 relative" ref={relationshipDropdownRef}
                style={{ 
                  zIndex: 1000001,
                  isolation: 'isolate',
                  transform: 'translateZ(0)'
                }}
              >
                <div className="synapsas-date-field">
                  <button
                    ref={relationshipButtonRef}
                    type="button"
                    onClick={handleRelationshipDropdownToggle}
                    className="synapsas-date-select"
                  >
                    <span className="text-black">
                      {getRelationshipLabel(relationship)}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Section */}
        <div className="p-4 border-b border-black relative z-50"
          style={{ 
            zIndex: 1200,
            isolation: 'isolate',
            transform: 'translateZ(0)'
          }}
        >
          <label className="synapsas-label mb-3 block">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 relative z-60" ref={monthDropdownRef}
              style={{ 
                zIndex: 1201,
                isolation: 'isolate',
                transform: 'translateZ(0)'
              }}
            >
              <label className="block text-xs font-medium text-black/70 mb-1">Month</label>
              <div className="synapsas-date-field">
                <button
                  type="button"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="synapsas-date-select"
                >
                  <span className={dateInput.month ? 'text-black' : 'text-gray-400'}>
                    {getMonthLabel(dateInput.month)}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showMonthDropdown && (
                  <div className="synapsas-month-dropdown">
                    {months.map((month) => (
                      <button
                        key={month.value}
                        type="button"
                        onClick={() => handleMonthSelect(month.value)}
                        className={`synapsas-month-option ${dateInput.month === month.value ? 'selected' : ''}`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{ 
                zIndex: 1100,
                isolation: 'isolate',
                transform: 'translateZ(0)'
              }}
            >
              <label className="block text-xs font-medium text-black/70 mb-1">Day</label>
              <div className="synapsas-date-field">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dateInput.day}
                  onChange={(e) => handleDateInputChange('day', e.target.value)}
                  placeholder="Day"
                  className="synapsas-date-input"
                  required
                />
              </div>
            </div>
            <div className="col-span-2"
              style={{ 
                zIndex: 1099,
                isolation: 'isolate',
                transform: 'translateZ(0)'
              }}
            >
              <label className="block text-xs font-medium text-black/70 mb-1">Year</label>
              <div className="synapsas-date-field">
                <input
                  type="number"
                  min="1900"
                  max="2030"
                  value={dateInput.year}
                  onChange={(e) => handleDateInputChange('year', e.target.value)}
                  placeholder="Year"
                  className="synapsas-date-input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="p-4 border-b border-black relative z-40"
          style={{ 
            zIndex: 1000,
            isolation: 'isolate',
            transform: 'translateZ(0)'
          }}
        >
          <label className="synapsas-label mb-3 block">
            Time of Birth <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="1"
              max="12"
              value={timeInput.hours}
              onChange={(e) => handleTimeInputChange('hours', e.target.value)}
              placeholder="12"
              className="synapsas-time-input w-16 text-center"
              required
            />
            <span className="text-xl font-bold text-gray-400">:</span>
            <div 
              className="relative" 
              style={{ 
                zIndex: 10000,
                isolation: 'isolate',
                transform: 'translateZ(0)'
              }}
            >
              <input
                ref={minutesInputRef}
                type="text"
                value={timeInput.minutes}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string, or 1-2 digits with valid minute values (00-59)
                  if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value) <= 59)) {
                    handleTimeInputChange('minutes', value);
                  }
                }}
                onFocus={() => setShowMinutesPicker(true)}
                onBlur={(e) => {
                  // Small delay to allow clicking on dropdown options
                  setTimeout(() => {
                    if (!minutesDropdownRef.current?.contains(document.activeElement)) {
                      const value = e.target.value;
                      if (value.length === 1 && /^\d$/.test(value)) {
                        handleTimeInputChange('minutes', value.padStart(2, '0'));
                      }
                    }
                  }, 150);
                }}
                placeholder="00"
                className="synapsas-time-input w-16 text-center"
                maxLength={2}
                required
              />
              
              {/* Minutes Picker Dropdown */}
              {showMinutesPicker && (
                <div
                  ref={minutesDropdownRef}
                  className="absolute bg-white border max-h-48 overflow-y-auto"
                  style={{ 
                    top: '100%',
                    left: '0',
                    width: '240px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    borderRadius: '0',
                    zIndex: 9999,
                    transform: 'translateZ(0)',
                    isolation: 'isolate',
                    position: 'absolute'
                  }}
                >
                  <div className="grid grid-cols-6 gap-0">
                    {minutesOptions.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => handleMinuteSelect(minute)}
                        className={`
                          w-full h-10 text-sm font-medium border-b border-r border-gray-100 transition-all duration-200 ease-in-out
                          ${timeInput.minutes === minute 
                            ? 'bg-gray-900 text-white font-semibold' 
                            : 'text-gray-900 bg-transparent hover:bg-gray-50'
                          }
                        `}
                        style={{ borderRadius: '0' }}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex bg-white">
              <button
                type="button"
                onClick={() => handleTimeInputChange('period', 'AM')}
                className={`group relative px-3 py-3 text-sm font-semibold border border-black transition-all duration-300 overflow-hidden ${
                  timeInput.period === 'AM' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
                style={{ height: '56px' }}
              >
                {/* Animated background gradient for inactive state */}
                {timeInput.period !== 'AM' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
                <span className="relative">AM</span>
              </button>
              <button
                type="button"
                onClick={() => handleTimeInputChange('period', 'PM')}
                className={`group relative px-3 py-3 text-sm font-semibold border-t border-r border-b border-black transition-all duration-300 overflow-hidden ${
                  timeInput.period === 'PM' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
                style={{ height: '56px' }}
              >
                {/* Animated background gradient for inactive state */}
                {timeInput.period !== 'PM' && (
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                )}
                <span className="relative">PM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="p-4 border-b border-black relative z-40">
          <label className="synapsas-label mb-2 block">
            Location of Birth <span className="text-red-500">*</span>
          </label>
          <input
            ref={locationInputRef}
            type="text"
            value={locationQuery}
            onChange={(e) => handleLocationInputChange(e.target.value)}
            onFocus={() => {
              setIsLocationFocused(true);
            }}
            onBlur={(e) => {
              // Only blur if not clicking on dropdown
              if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
                setTimeout(() => setIsLocationFocused(false), 150);
              }
            }}
            placeholder="e.g., New York, NY, USA"
            className="synapsas-input"
            required
            autoComplete="off"
          />

          {/* Location Dropdown */}
          {showLocationDropdown && isLocationFocused && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-4 right-4 bg-white border border-black z-[9998] max-h-40 overflow-y-auto mt-1"
            >
              {isLoadingLocations ? (
                <div className="p-3 text-center text-black text-sm">
                  <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
                  Searching...
                </div>
              ) : locationOptions.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No locations found
                </div>
              ) : (
                locationOptions.map((location) => (
                  <button
                    key={location.place_id}
                    type="button"
                    onClick={() => onLocationSelect(location)}
                    className="group relative w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 focus:outline-none focus:bg-gray-100 transition-all duration-300 overflow-hidden"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="relative text-sm font-medium text-black truncate">
                      {location.display_name}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="p-4 border-b border-black">
          <label className="synapsas-label mb-2 block">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this person..."
            className="synapsas-input resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-0">
          <button
            type="button"
            onClick={onCancel}
            className="group relative p-4 text-center font-space-grotesk font-semibold text-black border-r border-black hover:bg-black transition-all duration-300 overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <span className="relative group-hover:text-white transition-colors duration-300">Cancel</span>
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSaving}
            className={`group relative p-4 text-center font-space-grotesk font-semibold transition-all duration-300 overflow-hidden ${
              !isFormValid || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {/* Animated background gradient for enabled state */}
            {(isFormValid && !isSaving) && (
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-green-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
            )}
            
            <div className="relative">
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                editingPerson ? 'Update Person' : 'Add Person'
              )}
            </div>
          </button>
        </div>
      </form>

      <style jsx>{`
        /* Synapsas Form System */
        .synapsas-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #19181a;
          font-family: 'Inter', sans-serif;
        }

        .synapsas-input, .synapsas-select {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
          color: #19181a;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .synapsas-input:focus, .synapsas-select:focus {
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
        }

        .synapsas-input::placeholder {
          color: #6b7280;
        }

        .synapsas-time-input {
          padding: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #19181a;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
        }

        .synapsas-time-input:focus {
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
        }

        .synapsas-time-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        .synapsas-time-input::-webkit-outer-spin-button,
        .synapsas-time-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .synapsas-time-input[type=number] {
          -moz-appearance: textfield;
        }

        /* Date & Time System from NatalChartForm */
        .synapsas-date-field {
          position: relative;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .synapsas-date-field:focus-within {
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
        }

        .synapsas-date-select {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 600;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .synapsas-date-select:hover {
          opacity: 0.8;
        }

        .synapsas-date-input {
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          color: #19181a;
          text-align: center;
          border: none;
          background: transparent;
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .synapsas-date-input::placeholder {
          color: #6b7280;
          font-weight: 400;
        }

        .synapsas-date-input::-webkit-outer-spin-button,
        .synapsas-date-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .synapsas-date-input[type=number] {
          -moz-appearance: textfield;
        }

        .synapsas-month-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 0.5rem;
        }

        .synapsas-month-option {
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          color: #19181a;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .synapsas-month-option:hover {
          background-color: #f3f4f6;
          padding-left: 1.25rem;
        }

        .synapsas-month-option.selected {
          background-color: #19181a;
          color: white;
          font-weight: 600;
        }

        .synapsas-relationship-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 0.5rem;
        }

        .synapsas-relationship-option {
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 500;
          color: #19181a;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
        }

        .synapsas-relationship-option:hover {
          background-color: #f3f4f6;
          padding-left: 1.25rem;
        }

        .synapsas-relationship-option.selected {
          background-color: #19181a;
          color: white;
          font-weight: 600;
        }
      `}</style>

      {/* Portal dropdown for relationship */}
      {showRelationshipDropdown && typeof window !== 'undefined' && createPortal(
        <div 
          ref={relationshipDropdownRef}
          className="synapsas-relationship-dropdown"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            zIndex: 999999,
            maxHeight: '200px',
            overflowY: 'auto',
            marginTop: '0.5rem'
          }}
        >
          {relationshipOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleRelationshipSelect(option.value as Person['relationship'])}
              className={`synapsas-relationship-option ${relationship === option.value ? 'selected' : ''}`}
            >
              <span className="text-xl mr-2">{relationshipIcons[option.value as Person['relationship']]}</span>
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default CompactNatalChartForm;