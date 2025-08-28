/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useCallback, useEffect } from 'react';

interface TimeInput {
  hours: string;
  minutes: string;
  period: 'AM' | 'PM';
}

interface DateInput {
  month: string;
  day: string;
  year: string;
}

interface UseDateTimeInputOptions {
  initialDate?: string; // YYYY-MM-DD format
  initialTime?: string; // HH:MM format (24-hour)
  onChange?: (date: string, time: string) => void;
}

interface UseDateTimeInputReturn {
  // Date state
  dateInput: DateInput;
  setDateInput: React.Dispatch<React.SetStateAction<DateInput>>;
  dateString: string; // YYYY-MM-DD format
  
  // Time state
  timeInput: TimeInput;
  setTimeInput: React.Dispatch<React.SetStateAction<TimeInput>>;
  timeString: string; // HH:MM format (24-hour)
  
  // Handlers
  handleDateChange: (field: keyof DateInput, value: string) => void;
  handleTimeChange: (field: keyof TimeInput, value: string) => void;
  
  // Utility functions
  convertTo24Hour: (hours: string, minutes: string, period: string) => string;
  convertTo12Hour: (time24: string) => TimeInput;
  convertToDateString: (month: string, day: string, year: string) => string;
  convertFromDateString: (dateString: string) => DateInput;
  
  // Validation
  isValidDate: boolean;
  isValidTime: boolean;
  isComplete: boolean;
}

/**
 * Comprehensive hook for handling date and time input with conversion utilities
 * Handles both 12-hour display format and 24-hour storage format
 */
export function useDateTimeInput({
  initialDate = '',
  initialTime = '',
  onChange
}: UseDateTimeInputOptions = {}): UseDateTimeInputReturn {
  
  // Time conversion utilities
  const convertTo24Hour = useCallback((hours: string, minutes: string, period: string): string => {
    if (!hours || !minutes) return '';
    
    let hour24 = parseInt(hours);
    if (isNaN(hour24)) return '';
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    const paddedMinutes = minutes.padStart(2, '0');
    return `${hour24.toString().padStart(2, '0')}:${paddedMinutes}`;
  }, []);

  const convertTo12Hour = useCallback((time24: string): TimeInput => {
    if (!time24) return { hours: '', minutes: '', period: 'AM' };
    
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    
    if (isNaN(hour24)) return { hours: '', minutes: '', period: 'AM' };
    
    const period = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    
    return {
      hours: hour12.toString(),
      minutes: parseInt(minutes).toString(), // Remove leading zeros for display
      period: period
    };
  }, []);

  // Date conversion utilities
  const convertToDateString = useCallback((month: string, day: string, year: string): string => {
    if (!month || !day || !year) return '';
    
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }, []);

  const convertFromDateString = useCallback((dateString: string): DateInput => {
    if (!dateString) return { month: '', day: '', year: '' };
    
    const [year, month, day] = dateString.split('-');
    return {
      month: parseInt(month).toString(), // Remove leading zero for display
      day: parseInt(day).toString(),     // Remove leading zero for display
      year: year
    };
  }, []);

  // Initialize state from props
  const [timeInput, setTimeInput] = useState<TimeInput>(() => 
    initialTime ? convertTo12Hour(initialTime) : { hours: '', minutes: '', period: 'AM' }
  );
  
  const [dateInput, setDateInput] = useState<DateInput>(() =>
    initialDate ? convertFromDateString(initialDate) : { month: '', day: '', year: '' }
  );

  // Derived state
  const timeString = convertTo24Hour(timeInput.hours, timeInput.minutes, timeInput.period);
  const dateString = convertToDateString(dateInput.month, dateInput.day, dateInput.year);

  // Validation
  const isValidTime = timeString !== '' && timeString.includes(':');
  const isValidDate = dateString !== '' && dateString.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
  const isComplete = isValidDate && isValidTime;

  // Handlers
  const handleTimeChange = useCallback((field: keyof TimeInput, value: string) => {
    setTimeInput(prev => {
      const newTimeInput = { ...prev, [field]: value };
      
      // Auto-trigger onChange when time is complete
      const newTimeString = convertTo24Hour(newTimeInput.hours, newTimeInput.minutes, newTimeInput.period);
      if (newTimeString && onChange) {
        onChange(dateString, newTimeString);
      }
      
      return newTimeInput;
    });
  }, [convertTo24Hour, dateString, onChange]);

  const handleDateChange = useCallback((field: keyof DateInput, value: string) => {
    setDateInput(prev => {
      const newDateInput = { ...prev, [field]: value };
      
      // Auto-trigger onChange when date is complete
      const newDateString = convertToDateString(newDateInput.month, newDateInput.day, newDateInput.year);
      if (newDateString && onChange) {
        onChange(newDateString, timeString);
      }
      
      return newDateInput;
    });
  }, [convertToDateString, timeString, onChange]);

  // Update state when props change
  useEffect(() => {
    if (initialTime && initialTime !== timeString) {
      setTimeInput(convertTo12Hour(initialTime));
    }
  }, [initialTime, convertTo12Hour, timeString]);

  useEffect(() => {
    if (initialDate && initialDate !== dateString) {
      setDateInput(convertFromDateString(initialDate));
    }
  }, [initialDate, convertFromDateString, dateString]);

  return {
    // Date state
    dateInput,
    setDateInput,
    dateString,
    
    // Time state
    timeInput,
    setTimeInput,
    timeString,
    
    // Handlers
    handleDateChange,
    handleTimeChange,
    
    // Utility functions
    convertTo24Hour,
    convertTo12Hour,
    convertToDateString,
    convertFromDateString,
    
    // Validation
    isValidDate,
    isValidTime,
    isComplete,
  };
}

/**
 * Simplified hook for basic date input only
 */
export function useDateInput(initialDate: string = '', onChange?: (date: string) => void) {
  const { dateInput, dateString, handleDateChange, isValidDate, convertToDateString, convertFromDateString } = useDateTimeInput({
    initialDate,
    onChange: (date) => onChange?.(date)
  });

  return {
    dateInput,
    dateString,
    handleDateChange,
    isValidDate,
    convertToDateString,
    convertFromDateString,
  };
}

/**
 * Simplified hook for basic time input only
 */
export function useTimeInput(initialTime: string = '', onChange?: (time: string) => void) {
  const { timeInput, timeString, handleTimeChange, isValidTime, convertTo24Hour, convertTo12Hour } = useDateTimeInput({
    initialTime,
    onChange: (_, time) => onChange?.(time)
  });

  return {
    timeInput,
    timeString,
    handleTimeChange,
    isValidTime,
    convertTo24Hour,
    convertTo12Hour,
  };
}